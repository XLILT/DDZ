function UI() {
}

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

UI.create_middle_poker_dom = function(poker, float_direction, z_index, left_right, distance) {
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
        'float': float_direction,
        'z-index': z_index
    });

    if (left_right === 'right') {
        $poker_position_node.css('right', distance);
    }
    else {
        $poker_position_node.css('left', distance);
    }

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
}

UI.show_rate = function(rate) {
    $('.rate-num').children().remove();

    var $yellow_num_dom = UI.create_yellow_num_dom(rate).reverse();
    $yellow_num_dom.forEach(function($dom) {
        $('.rate-num').append($dom);
    });
}

UI.show_bscore = function(bscore) {
    $('.bscore-num').children().remove();

    var $yellow_num_dom = UI.create_yellow_num_dom(bscore).reverse();
    $yellow_num_dom.forEach(function($dom) {
        $('.bscore-num').append($dom);
    });
}

UI.show_enemy_portrait = function(position, name, sex) {
    var class_name = position == 'left' ? '.left-user' : '.right-user';

    $('.enemy-base ' + class_name + ' .user-portrait-wrap .user-portrait').removeClass('hide male female landlord');
    $('.enemy-base ' + class_name + ' .user-portrait-wrap .user-portrait').addClass(sex);
    $('.enemy-base ' + class_name + ' .user-name').html(name);
}

UI.show_enemy_hand_poker = function(position, poker_count) {
    var class_name = position == 'left' ? '.left-hand-poker' : '.right-hand-poker';

    $(class_name + ' .poker-back').removeClass('hide');

    $(class_name + ' .poker-count').children().remove();
    var $yellow_num_dom = UI.create_yellow_num_dom(poker_count).reverse();
    $yellow_num_dom.forEach(function($dom) {
        $(class_name + ' .poker-count').append($dom);
    });
}

UI.show_enemy_ground_poker = function(position, pokers) {
    var class_name = position == 'left' ? '.left-ground-poker' : '.right-ground-poker';
    var offset_direction = position == 'left' ? 'right' : 'left';

    $(class_name).children().remove();

    const distance_interval = 85;
    var distance = 0;
    var z_index, layer_interval;

    if (position === 'left') {
        z_index = 1;
        layer_interval = 1;
    }
    else {
        z_index = 100;
        layer_interval = -1;
    }

    pokers.forEach(function(poker) {
        $(class_name).append(UI.create_middle_poker_dom(poker, position, z_index, offset_direction, distance));
            distance += distance_interval;
            z_index += layer_interval;
    });
}
