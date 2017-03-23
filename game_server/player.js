#!/usr/bin/env node

exports = module.exports = Player;

function Player() {
	this.index = 0;
	this.session_id = 0;
	this.uid = 0;
	this.name = '';
	this.sex = '';

	this.has_gamble_score = false;

	this.is_landlord = false;
	this.hand_pokers = [];
	this.last_ground_pokers = [];

	this.is_pokers_all_in_hand = function(pokers) {
		pokers.forEach((poker) => {
			var in_hand = false;
			this.hand_pokers.forEach((hand_poker) => {
				if(hand_poker.id === poker.id) {
					in_hand = true;
				}
			});

			if(!in_hand) {
				return false;
			}
		});

		return true;	
	};

	this.remove_pokers_from_hand = function(pokers) {
		pokers.forEach((poker) => {
			var index = 0;
			this.hand_pokers.forEach((hand_poker) => {
				if(hand_poker.id === poker.id) {
					this.hand_pokers.splice(index, 1);
				}

				index++;
			});
		});
	};
}

