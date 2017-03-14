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
