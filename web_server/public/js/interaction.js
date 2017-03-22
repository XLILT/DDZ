(function() {
    $('.my-hand-poker').delegate('.poker', 'click', function() {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            $(this).addClass('selected');
        }
    });

    $('.tool-bar').delegate('.button', 'click', function() {
        switch($(this).attr('title'))
        {
        case '重选':
            $('.my-hand-poker .poker').removeClass('selected');
            break;
        case '出牌':
            var cope_pokers = [];
            if(game.last_player_index != game.you.index) {
                cope_pokers = game.last_played_pokers;
            }

            var playing_pokers = UI.get_selected_pokers();

            if(PokerRule.could_play_poker(playing_pokers, cope_pokers)) {
                console.log("could play");
            }
            else {
                UI.show_tips("你选择的牌不符合规则");
            }
            break;
        default:
            break;
        }
    });

	$('.gamble-score-bar').delegate('.button', 'click', function() {
		UI.stop_clock('');
		switch($(this).attr('title'))
		{
		case '1分':
			UI.gamble_score(1);
			game.you_gamble_score(1);
			break;
		case '2分':
			UI.gamble_score(2);
			game.you_gamble_score(2);
			break;
		case '3分':
			UI.gamble_score(3);
			game.you_gamble_score(3);
			break;
		default:
			UI.gamble_score(0);
			game.you_gamble_score(0);
		}
	});
})();
