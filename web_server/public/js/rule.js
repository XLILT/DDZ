function PokerRule() {
}

PokerRule.could_play_poker = function(playing_pokers, cope_pokers) {
    var playing_pokers_type = Poker.get_pokers_type_and_min_value(playing_pokers);
    if(playing_pokers_type === false) {
        return false;
    }

    if(cope_pokers === null || cope_pokers === undefined || cope_pokers.length === 0) {
        return true;
    }

    var cope_pokers_type = this.get_pokers_type_and_min_value(cope_pokers);
    if(cope_pokers_type === false) {
        return false;
    }

    if(playing_pokers_type.type === this.poker_group_type["joker_boom"]) {
        if(cope_pokers_type.type === this.poker_group_type["joker_boom"]) {
            return true;
        }
        else {
            return false;   //impossible
        }

    }
    else if(playing_pokers_type.type === this.poker_group_type["quadruple_boom"]) {
        if (cope_pokers_type.type === this.poker_group_type["joker_boom"]) {
            return false;
        }
        else if(cope_pokers_type.type === this.poker_group_type["quadruple_boom"]) {
            if(playing_pokers_type.value > cope_pokers_type.value) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    }
    else {
        if (cope_pokers_type.type === this.poker_group_type["joker_boom"]
            || cope_pokers_type.type === this.poker_group_type["quadruple_boom"]) {
            return false;
        }
        else {
            if(playing_pokers.length !== cope_pokers.length) {
                return false;
            }

            if(playing_pokers_type.type !== cope_pokers_type.type) {
                return false;
            }

            if(playing_pokers_type.value > cope_pokers_type.value) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    return true;
};
