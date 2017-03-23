function UI() {
}

UI.timer_my_clock = 0;
UI.timer_left_clock = 0;
UI.timer_right_clock = 0;

UI.create_small_poker_dom = function(poker, margin_left, z_index) {
    var $num_node = $('<p></p>');
    $num_node.addClass('num');
    $num_node.addClass('num' + poker.get_num());
    $num_node.addClass(poker.get_shape());

    var $shape_node = $('<p></p>');
    $shape_node.addClass('shape');
    $shape_node.addClass(poker.get_shape());

    var $poker_content_node = $('<div></div>');
    $poker_content_node.addClass('poker-content');

    $poker_content_node.append($num_node);
    $poker_content_node.append($shape_node);

    var $poker_position_node = $('<div></div>');
    $poker_position_node.addClass('poker small');
    $poker_position_node.css({
        'margin-left': margin_left,
        'z-index': z_index
    });

    $poker_position_node.append($poker_content_node);

    return $poker_position_node;
};

UI.create_middle_poker_dom = function(poker, z_index, margin_left) {
    var $num_node = $('<p></p>');
    $num_node.addClass('num');
    $num_node.addClass('num' + poker.get_num());
    $num_node.addClass(poker.get_shape());

    var $shape_node = $('<p></p>');
    $shape_node.addClass('shape');
    $shape_node.addClass(poker.get_shape());

    var $poker_content_node = $('<div></div>');
    $poker_content_node.addClass('poker-content');

    $poker_content_node.append($num_node);
    $poker_content_node.append($shape_node);

    var $poker_position_node = $('<div></div>');
    $poker_position_node.addClass('poker middle');

    $poker_position_node.css({
        'z-index': z_index,
        'margin-left': margin_left
    });

    $poker_position_node.append($poker_content_node);

    return $poker_position_node;
};

UI.create_poker_dom = function(poker, z_index, margin_left) {
    var $num_node = $('<p></p>');
    $num_node.addClass('num');
    $num_node.addClass('num' + poker.get_num());
    $num_node.addClass(poker.get_shape());

    var $shape_node = $('<p></p>');
    $shape_node.addClass('shape');
    $shape_node.addClass(poker.get_shape());

    var $poker_content_node = $('<div></div>');
    $poker_content_node.addClass('poker-content');

    $poker_content_node.append($num_node);
    $poker_content_node.append($shape_node);

    var $poker_position_node = $('<div></div>');
    $poker_position_node.addClass('poker');

    $poker_position_node.attr("poker-id", poker.id);

    $poker_position_node.css({
        'z-index': z_index,
        'margin-left': margin_left
    });

    $poker_position_node.append($poker_content_node);

    return $poker_position_node;
};

UI.show_landlord_poker = function(pokers) {
    $('.landlord-poker').children().remove();

    const margin_interval = 14, layer_interval = 1;
    var margin_left = -14, z_index = 1;
    pokers.forEach(function(poker) {
        $('.landlord-poker').append(UI.create_small_poker_dom(poker, margin_left, z_index));
        margin_left += margin_interval;
        z_index += layer_interval;
    });
};

UI.create_yellow_num_dom = function(num) {
    var dom_arr = [];
    var split_num_arr = String(num).split('');

    split_num_arr.forEach(function(split_num) {
        var $num_node = $('<div></div>');
        $num_node.addClass('yellow-num');
        $num_node.addClass('yellow-num' + split_num);

        dom_arr.push($num_node);
    });

    return dom_arr;
};

UI.show_rate = function(rate) {
    $('.rate-num').children().remove();

    var $yellow_num_dom = UI.create_yellow_num_dom(rate).reverse();
    $yellow_num_dom.forEach(function($dom) {
        $('.rate-num').append($dom);
    });
};

UI.show_bscore = function(bscore) {
    $('.bscore-num').children().remove();

    var $yellow_num_dom = UI.create_yellow_num_dom(bscore).reverse();
    $yellow_num_dom.forEach(function($dom) {
        $('.bscore-num').append($dom);
    });
};

UI.show_enemy_portrait = function(position, name, sex) {
    var class_name = position == 'left' ? '.left-user' : '.right-user';

    $('.enemy-base ' + class_name + ' .user-portrait-wrap .user-portrait').removeClass('hide male female landlord');
    $('.enemy-base ' + class_name + ' .user-portrait-wrap .user-portrait').addClass(sex);
    $('.enemy-base ' + class_name + ' .user-name').html(name);
};

UI.show_my_portrait = function(name, sex) {
    $('.my-base-info .user-portrait-wrap .user-portrait').removeClass('hide male female landlord');
    $('.my-base-info .user-portrait-wrap .user-portrait').addClass(sex);
    $('.my-base-info .user-name').html(name);
}

UI.show_enemy_hand_poker = function(position, poker_count) {
    var class_name = position == 'left' ? '.left-hand-poker' : '.right-hand-poker';

    $(class_name + ' .poker-back').removeClass('hide');

    $(class_name + ' .poker-count').children().remove();
    var $yellow_num_dom = UI.create_yellow_num_dom(poker_count).reverse();
    $yellow_num_dom.forEach(function($dom) {
        $(class_name + ' .poker-count').append($dom);
    });
};

UI.show_enemy_ground_poker = function(position, pokers) {
	console.log(pokers);
    var class_name = position == 'left' ? '.left-ground-poker' : '.right-ground-poker';

    $(class_name).children().remove();

    var margin_left = 0, margin_interval = 20;
    var z_index = 1, layer_interval = 1;

    if (position === 'right') {
        margin_left = 263;
        margin_interval = -margin_interval;
        z_index = 100;
        layer_interval = -layer_interval;

        pokers = pokers.reverse();
    }

	pokers.forEach(function(poker) {
		$(class_name).append(UI.create_middle_poker_dom(poker, z_index, margin_left));
			margin_left += margin_interval;
			z_index += layer_interval;
	});
};

UI.show_my_ground_poker = function(pokers) {
	console.log(pokers);
    $('.my-ground-poker').children().remove();

    const margin_interval = 20, layer_interval = 1;
    var margin_left = (1024 - (pokers.length - 1) * 20 - 90) / 2, z_index = 1;

	pokers.forEach(function(poker) {
		$('.my-ground-poker').append(UI.create_middle_poker_dom(poker, z_index, margin_left));
		margin_left += margin_interval;
		z_index += layer_interval;
	});
};

UI.show_gamble_score_bar = function() {
    $('.tool-bar').addClass('hide');

    $('.gamble-score-bar').removeClass('hide');
    $('.gamble-score-bar .button').removeClass('disable');
};

UI.gamble_score = function(score) {
    $('.gamble-score-bar .button').addClass('disable');

    switch(score)
    {
    case 1:
        $('.gamble-score-bar .button .one').parent().addClass('highlight');
        break;
    case 2:
        $('.gamble-score-bar .button .two').parent().addClass('highlight');
        break;
    case 3:
        $('.gamble-score-bar .button .three').parent().addClass('highlight');
        break;
    default:
        $('.gamble-score-bar .button .no-gamble').parent().addClass('highlight');
    }
};

UI.show_tool_bar = function(is_disable = false) {
    $('.gamble-score-bar').addClass('hide');

    $('.tool-bar').removeClass('hide');

    if (is_disable) {
        $('.tool-bar .button').addClass('disable');
    }
    else {
        $('.tool-bar .button').removeClass('disable');
    }

};

UI.show_tips = function(tips) {
    $('.tips-info').html(tips);

    setTimeout(function() {
        $('.tips-info').html('');
    }, 3000);
};

UI.show_my_hand_poker = function(pokers) {
    $('.my-hand-poker').children().remove();

    const margin_interval = 30, layer_interval = 1;
    var margin_left = (889 - (pokers.length - 1) * margin_interval - 102) / 2, z_index = 1;

    pokers.forEach(function(poker) {
        $('.my-hand-poker').append(UI.create_poker_dom(poker, z_index, margin_left));
        margin_left += margin_interval;
        z_index += layer_interval;
    });

    $('.my-base-info .poker-count').children().remove();

    var $yellow_num_dom = UI.create_yellow_num_dom(pokers.length).reverse();
    $yellow_num_dom.forEach(function($dom) {
        $('.my-base-info .poker-count').append($dom);
    });
};

UI.get_selected_pokers = function() {
    var selected_pokers = [];

    var $nodes = $('.my-hand-poker .poker.selected');
    $nodes.each(function(index) {
        var poker = new Poker(parseInt($nodes.eq(index).attr('poker-id')));
        selected_pokers.push(poker);
    });

    return selected_pokers;
};

UI.clock_time = function(position, time) {
	switch(position)
	{
	case 'left':
		$('.left-user .clock p').html(parseInt(time / 1000));
		$('.left-user .clock').removeClass('hide');
		UI.timer_left_clock = setInterval(() => {
			var sec = parseInt($('.left-user .clock p').html()) - 1;
			if(sec > 0) {
				$('.left-user .clock p').html(sec);
			}
			else {
				clearInterval(UI.timer_left_clock);
				UI.timer_left_clock = 0;

				$('.left-user .clock').addClass('hide');
			}
		}, 1000);
		break;
	case 'right':
		$('.right-user .clock p').html(parseInt(time / 1000));
		$('.right-user .clock').removeClass('hide');
		UI.timer_right_clock = setInterval(() => {
			var sec = parseInt($('.right-user .clock p').html()) - 1;
			if(sec > 0) {
				$('.right-user .clock p').html(sec);
			}
			else {
				clearInterval(UI.timer_right_clock);
				UI.timer_right_clock = 0;

				$('.right-user .clock').addClass('hide');
			}
		}, 1000);
		break;
	default:
		$('.my-base-info .clock p').html(parseInt(time / 1000));
		$('.my-base-info .clock').removeClass('hide');
		UI.timer_my_clock = setInterval(() => {
			var sec = parseInt($('.my-base-info .clock p').html()) - 1;
			if(sec > 0) {
				$('.my-base-info .clock p').html(sec);
			}
			else {
				clearInterval(UI.timer_my_clock);
				UI.timer_my_clock = 0;

				$('.my-base-info .clock').addClass('hide');
			}
		}, 1000);
	}
};

UI.stop_clock = function(position) {
	switch(position)
	{
	case 'left':
		clearInterval(UI.timer_left_clock);
		UI.timer_left_clock = 0;

		$('.left-user .clock').addClass('hide');
		break;
	case 'right':
		clearInterval(UI.timer_right_clock);
		UI.timer_right_clock = 0;

		$('.right-user .clock').addClass('hide');
		break;
	default:
		clearInterval(UI.timer_my_clock);
		UI.timer_my_clock = 0;

		$('.my-base-info .clock').addClass('hide');
	}
};

UI.show_player_gamble_score = function(position, score) {
	switch(position)
	{
	case 'left':
		$('.left-ground-poker .gamble-score').children().remove();
		$('.left-ground-poker .gamble-score').removeClass('hide');

		var $yellow_num_dom = UI.create_yellow_num_dom(score).reverse();
			$yellow_num_dom.forEach(function($dom) {
		    $('.left-ground-poker .gamble-score').append($dom);
		});
		break;
	case 'right':
		$('.right-ground-poker .gamble-score').children().remove();
		$('.right-ground-poker .gamble-score').removeClass('hide');

		var $yellow_num_dom = UI.create_yellow_num_dom(score).reverse();
			$yellow_num_dom.forEach(function($dom) {
		    $('.right-ground-poker .gamble-score').append($dom);
		});
		break;
	default:
	}
};

UI.hide_gamble_score = function() {
	$('.gamble-score').addClass('hide');
};

UI.reselect_poker = function() {
	$('.my-hand-poker .poker').removeClass('selected');
};

