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
			game.reselect_poker();
            break;
        case '出牌':
			game.you_play();
            break;
		case '不出':
			game.you_play(true);
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
