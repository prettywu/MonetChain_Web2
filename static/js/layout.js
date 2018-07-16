var Layout = function () {
    'use strict';
    
    // handle on page scroll
    var handleHeaderOnScroll = function() {
        if ($(window).scrollTop() > 60) {
            $('body').addClass('page-on-scroll');
        } else {
            $('body').removeClass('page-on-scroll');
        }
    }   

    // handle group element heights
    return {
        init: function () {
            handleHeaderOnScroll(); // initial setup for fixed header

            // handle minimized header on page scroll
            $(window).scroll(function() {
                handleHeaderOnScroll();
            });
        }
    };
}();

$(document).ready(function() {
    Layout.init();
});