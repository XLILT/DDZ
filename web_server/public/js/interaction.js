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
})();
