function Poker(id) {
    if(Poker.all_pokers.indexOf(id) === -1) {
        throw "invalid poker id" + id;
    }

    this.id = id;

    this.get_num = function() {
        return this.id % Poker.MASK;
    };

    this.get_shape = function() {
        return Poker.shapes[parseInt(this.id / Poker.MASK)];
    };
}

Poker.shapes = {
    1: "spade",
    2: "heart",
    3: "clubs",
    4: "diamond"
};

Poker.MASK = 100;

Poker.all_pokers = [
    115,103,104,105,106,107,108,109,110,111,112,113,114,
    215,203,204,205,206,207,208,209,210,211,212,213,214,
    315,303,304,305,306,307,308,309,310,311,312,313,314,
    415,403,404,405,406,407,408,409,410,411,412,413,414,
    518,519
];

Poker.poker_group_type = {
    "single": 11,                       //单个
    "single_sequence": 12,              //单顺, eg: 3-4-5-6-7
    "joker_boom": 99,                   //王炸

    "double": 21,                       //对子
    "doubule_sequence": 22,             //连对

    "triple_sequence": 31,              //三(连)不带
    "triple_sequence_with_single": 32,  //三(连)带单
    "triple_sequence_with_double": 33,  //三(连)带对

    "quadruple_with_single": 41,       //四带单
    "quadruple_with_double": 42,       //四带对
    "quadruple_boom": 98               //四不带炸弹
};

Poker.sort = function(pokers) {
    return pokers.sort(function(a, b) {
                a = a.get_num();
                b = b.get_num();

                return a - b;
            });
};

Poker.get_max_same_number_count = function(pokers) {
    var max_count = 0,
        number_group = {};

    pokers.forEach(function(poker) {
        var num = poker.get_num();
        number_group[num] = number_group[num] || 0;
        number_group[num]++;

        if (number_group[num] > max_count) {
            max_count = number_group[num];
        };
    });

    return max_count;
}

Poker.get_pokers_type_and_min_value = function(pokers) {
    var max_same_number_count = Poker.get_max_same_number_count(pokers);
    switch(max_same_number_count)
    {
        case 1:
            if(pokers.length === 1) {
                return {
                    type: Poker.poker_group_type["single"],
                    value: pokers[0].get_num()
                };
            }
             else if (pokers.length === 2) {
                if ((pokers[0].id === 518 && pokers[1].id === 519)
					||(pokers[1].id === 518 && pokers[0].id === 519)
)
                {
                    return {
                        type: Poker.poker_group_type["joker_boom"],
                        value: 518
                    };
                }
            }
            else if(pokers.length >= 5)
            {
                var sorted_pokers = Poker.sort(pokers);

                var current_num = sorted_pokers[0].get_num(),
                    is_valid = true;

                sorted_pokers.forEach(function(poker) {
                    if (current_num >= 15) {
                        is_valid = false;
                    }

                    if(current_num++ !== poker.get_num()) {
                        is_valid = false;
                    }
                });

                if(is_valid) {
                    return {
                        type: Poker.poker_group_type["single_sequence"],
                        value: sorted_pokers[0].get_num()
                    };
                }
            }

            return false;
        case 2:
            if (pokers.length === 2) {
                return {
                    type: Poker.poker_group_type["double"],
                    value: pokers[0].get_num()
                };
            }
            else if(pokers.length % 2 === 0 && pokers.length > 4) {
                var sorted_pokers = Poker.sort(pokers);
                var current_num = sorted_pokers[0].get_num(),
                    is_valid = true;

				var i = 0;
                for (; i < sorted_pokers.length; i += 2) {
                    if (current_num !== sorted_pokers[i].get_num() || current_num !== sorted_pokers[i + 1].get_num()) {
                        is_valid = false;
                    }

                    if (current_num++ >= 15) {
                        is_valid = false;
                    }
                };

                if (is_valid) {
                    return {
                        type: Poker.poker_group_type["doubule_sequence"],
                        value: sorted_pokers[0].get_num()
                    };
                }
            }

            return false;
        case 3:
            var number_group = {};

            pokers.forEach(function(poker) {
                var num = poker.get_num();
                number_group[num] = number_group[num] || 0;
                number_group[num]++;
            });

            var min_number = 0,
                triple_count = 0,
                single_count = 0,
                double_count = 0;

			var triple_num_array = [];

            for(var poker_num in number_group) {
                if(number_group[poker_num] === 3) {
                    triple_count++;
					triple_num_array.push(poker_num);

                    if(min_number === 0) {
                        min_number = poker_num;
                    }
                    else if(min_number > poker_num) {
                        min_number = poker_num;
                    }
                }
                else if(number_group[poker_num] === 2) {
                    double_count++;
                }
                else if(number_group[poker_num] === 1) {
                    single_count++;
                }
            }

			if(triple_count > 1) {
				triple_num_array.sort();

				var last_num = 0;

				for(i = 0; i < triple_num_array.length; i++) {
					if(last_num !== 0) {
						if(triple_num_array[i] !== last_num + 1) {
							return false;
						}
					}

					last_num = triple_num_array[i];
				}

				/*
				triple_num_array.forEach((num) => {
					if(last_num !== 0) {
						if(num !== last_num + 1) {
							return false;
						}
					}

					last_num = num;
				});
				*/
			}

            var is_valid = true,
                group_type = Poker.poker_group_type["triple_sequence"];
            if(single_count === 0 || double_count === 0) {
                if(single_count > 0) {
                    if(single_count !== triple_count) {
                        is_valid = false;
                    }
                    else {
                        group_type = Poker.poker_group_type["triple_sequence_with_single"];
                    }
                }

                if(double_count > 0) {
                    if(double_count !== triple_count) {
                        if(double_count * 2 === triple_count) {
                            group_type = Poker.poker_group_type["triple_sequence_with_single"];
                        }
                        else {
                            is_valid = false;
                        }

                    }
                    else {
                        group_type = Poker.poker_group_type["triple_sequence_with_double"];
                    }
                }
            }
            else {
                is_valid = false;
            }

            if(is_valid) {
                return {
                    type: group_type,
                    value: min_number
                }
            }
            else {
                return false;
            }
        case 4:
            if(pokers.length === 4) {
                return {
                    type: Poker.poker_group_type["quadruple_boom"],
                    value: pokers[0].get_num()
                }
            }
            else if(pokers.length == 6) {
                var sorted_pokers = Poker.sort(pokers);
                return {
                    type: Poker.poker_group_type["quadruple_with_single"],
                    value: sorted_pokers[4].get_num()
                }
            }
            else if(pokers.length == 8) {
                var number_group = {};

                pokers.forEach(function(poker) {
                    var num = poker.get_num();
                    number_group[num] = number_group[num] || 0;
                    number_group[num]++;
                });

                var min_number = 0;

                for(var poker_num in number_group) {
                    if(number_group[poker_num] === 4) {
                        if(min_number === 0) {
                            min_number = poker_num;
                        }
                        else if(min_number < poker_num) {
                            min_number = poker_num;
                        }
                    }
                    else if(number_group[poker_num] !== 2) {
                        return false;
                    }
                }

                return {
                    type: Poker.poker_group_type["quadruple_with_double"],
                    value: min_number
                }
            }

            return false;
        default:
            return false;
    }
}
