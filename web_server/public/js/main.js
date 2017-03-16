(function(window){
    UI.show_landlord_poker([new Poker(103), new Poker(104), new Poker(105)]);
    UI.show_rate(10);
    UI.show_bscore(2);

    UI.show_enemy_portrait('left', 'xl', 'male');
    UI.show_enemy_portrait('right', 'cx', 'female');

    UI.show_enemy_hand_poker('left', 9);
    UI.show_enemy_hand_poker('right', 10);

    //UI.show_enemy_ground_poker('left', [new Poker(203), new Poker(204)]);
    UI.show_enemy_ground_poker('left', [new Poker(203), new Poker(204), new Poker(205), new Poker(206), new Poker(207)]);
    UI.show_enemy_ground_poker('right', [new Poker(303), new Poker(304), new Poker(305), new Poker(306), new Poker(307)]);
    UI.show_my_ground_poker([new Poker(403), new Poker(404), new Poker(405), new Poker(406), new Poker(407)]);
})(window);
