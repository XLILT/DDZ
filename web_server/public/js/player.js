function Enemy() {
    this.index = 0;
    this.position = '';
    this.name = '';
    this.sex = '';
    this.hand_poker_count = 0;
    this.last_ground_poker = [];

    this.location_position = function(your_index) {
        if (your_index === this.index + 1 || your_index === this.index - 2) {
            this.position = 'left';
        }
        else {
            this.position = 'right';
        }
    };
}

function You() {
    this.index = 0;
    this.name = '';
    this.sex = '';
    this.hand_poker = [];
    this.last_ground_poker = [];
}
