function Poker(id) {
    if(Poker.all_pokers.indexOf(id) == -1) {
        throw "invalid poker id" + id;
    }

    this.id = id;

    this.get_num = function() {
        return this.id % Poker.MASK;
    }

    this.get_shape = function() {
        return Poker.shapes[parseInt(this.id / Poker.MASK)];
    }
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

