var canvas;
var ctx;
var w;
var h;

var hue = 217;
var stars = [];
var count = 0;
var maxStars = 1200;

var canvas2;
var ctx2;

$(function () {
    $("#nav_right a").click(function () {
        //"a.title-dw" title-dw是啊标签的css选择器class="title-dw".
        $(".view-box").animate({
            scrollTop: $($(this).attr("href")).get(0).offsetTop + -100 + "px"
            //document.getElementById("section4").offsetTop
        }, {
                duration: 800,
                easing: "swing"
            });
        return false;
    });


});

$(window).on("load resize", function () {
    var wh = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
    $("#section1").css("height", wh);
    $('.view-box').scrollspy({ target: '#nav_right', offset: 150 });
    animation();

    Highcharts.chart('chart_box', {
        exporting: { enabled: false },
        colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            },
            backgroundColor: 'transparent',
            plotBackgroundColor: 'transparent',
            style: {
            }
        },
        title: {
            text: ' '
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                    enabled: true,
                    format: '{point.name} {point.percentage:.1f}%'
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            type: 'pie',
            name: 'Token distribution',
            data: [
                ['Team', 20.0],
                {
                    name: 'Community',
                    y: 30.0,
                    sliced: true,
                    selected: true
                },
                ['Business', 23],
                ['Sale', 25],
                ['Benefication', 2]
            ]
        }]
    });

    new Swiper('.swiper-container', {
        direction: 'horizontal',
        autoplay: {
            delay: 1000
        },
        loop: false,
        freeMode: true,
        slidesPerView: 'auto',
        speed: 5000,
        // 如果需要分页器
        // pagination: {
        //   el: '.swiper-pagination',
        // },

        // 如果需要前进后退按钮
        // navigation: {
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev',
        // },

        // 如果需要滚动条
        // scrollbar: {
        //   el: '.swiper-scrollbar',
        // },
    });

    $('.loading').fadeOut(500);
});

function initAnimation() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    // w = canvas.width = window.innerWidth,
    // h = canvas.height = window.innerHeight,
    w = canvas.width = document.getElementById('section1').clientWidth;
    h = canvas.height = document.getElementById('section1').clientHeight;

    canvas2 = document.createElement('canvas');
    ctx2 = canvas2.getContext('2d');
    canvas2.width = 100;
    canvas2.height = 100;
    var half = canvas2.width / 2;
    var gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient2.addColorStop(0.025, '#fff');
    //gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
    // gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
    //gradient2.addColorStop(0.25,'#061649');
    //gradient2.addColorStop(1, 'transparent');
    gradient2.addColorStop(0.1, '#80bcff');
    gradient2.addColorStop(0.15, 'transparent');

    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();

    for (var i = 0; i < maxStars; i++) {
        new Star();
    }
}

// End cache

function random(min, max) {
    if (arguments.length < 2) {
        max = min;
        min = 0;
    }

    if (min > max) {
        var hold = max;
        max = min;
        min = hold;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maxOrbit(x, y) {
    var max = Math.max(x, y);
    var diameter = Math.round(Math.sqrt(max * max + max * max));
    return diameter / 2;
}

var Star = function () {

    this.orbitRadius = random(maxOrbit(w, h));
    this.radius = random(60, this.orbitRadius) / 12;
    this.orbitX = w / 2;
    this.orbitY = h / 2;
    this.timePassed = random(0, maxStars);
    this.speed = random(this.orbitRadius) / 900000;
    this.alpha = random(5, 15) / 10;

    count++;
    stars[count] = this;
}

Star.prototype.draw = function () {
    var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
    var y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
    var twinkle = random(10);

    if (twinkle === 1 && this.alpha > 0) {
        this.alpha -= 0.05;
    } else if (twinkle === 2 && this.alpha < 1) {
        this.alpha += 0.05;
    }

    ctx.globalAlpha = this.alpha;
    ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
    this.timePassed += this.speed;
}



function animation() {
    if (!canvas) {
        initAnimation();
    }

    // ctx.globalCompositeOperation = 'source-over';
    // ctx.globalAlpha = 0.1;
    // ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 1)';
    // ctx.fillRect(0, 0, w, h);

    ctx.clearRect(0, 0, w, h);

    //ctx.globalCompositeOperation = 'copy';
    for (var i = 1, l = stars.length; i < l; i++) {
        stars[i].draw();
    };

    window.requestAnimationFrame(animation);
}

function getElementSize(id, type) {
    var reg = /(\d*)px/g;
    var str;
    if (type == 'width')
        str = window.getComputedStyle(document.getElementById(id)).width;
    else
        str = window.getComputedStyle(document.getElementById(id)).height;

    var arr = reg.exec(str);

    if (arr && arr.length >= 1)
        return arr[1];
    else
        return null;
}
