var $doc = $('html, body');
$('.cabecalho-menu-item').click(function() {
    $doc.animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 1000);
    return false;
});

var $doc = $('html, body');
$('.botao-sobre').click(function() {
    $doc.animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 1000);
    return false;
});

$(function() {
    $(window).on("scroll", function() {
        if($(window).scrollTop() < 797) {
            $(".inicio").addClass("cor-menu");
        } else {
            $(".inicio").removeClass("cor-menu");
        }
        if($(window).scrollTop() > 796 && $(window).scrollTop() < 1406) {
            $(".sobre").addClass("cor-menu");
        } else {
            $(".sobre").removeClass("cor-menu");
        }
        if($(window).scrollTop() > 1405 && $(window).scrollTop() < 2089) {
            $(".hab").addClass("cor-menu");
        } else {
            $(".hab").removeClass("cor-menu");
        }
        if($(window).scrollTop() > 2088) {
            $(".contato").addClass("cor-menu");
        } else {
            $(".contato").removeClass("cor-menu");
        }
    });
  });