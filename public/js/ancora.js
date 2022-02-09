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
    let largura = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
    if(largura > 768){
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
    } else if(largura > 684) {
        $(window).on("scroll", function() {
            
            if($(window).scrollTop() < 613) {
                $(".inicio").addClass("cor-menu");
            } else {
                $(".inicio").removeClass("cor-menu");
            }
            if($(window).scrollTop() > 612 && $(window).scrollTop() < 1140) {
                $(".sobre").addClass("cor-menu");
            } else {
                $(".sobre").removeClass("cor-menu");
            }
            if($(window).scrollTop() > 1139 && $(window).scrollTop() < 1819) {
                $(".hab").addClass("cor-menu");
            } else {
                $(".hab").removeClass("cor-menu");
            }
            if($(window).scrollTop() > 1818) {
                $(".contato").addClass("cor-menu");
            } else {
                $(".contato").removeClass("cor-menu");
            }
        });
    } else {
        $(window).on("scroll", function() {
            
            if($(window).scrollTop() < 613) {
                $(".inicio").addClass("cor-menu");
            } else {
                $(".inicio").removeClass("cor-menu");
            }
            if($(window).scrollTop() > 612 && $(window).scrollTop() < 1148) {
                $(".sobre").addClass("cor-menu");
            } else {
                $(".sobre").removeClass("cor-menu");
            }
            if($(window).scrollTop() > 1147 && $(window).scrollTop() < 1827) {
                $(".hab").addClass("cor-menu");
            } else {
                $(".hab").removeClass("cor-menu");
            }
            if($(window).scrollTop() > 1826) {
                $(".contato").addClass("cor-menu");
            } else {
                $(".contato").removeClass("cor-menu");
            }
        });
    }
  });