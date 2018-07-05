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
            scrollTop: $($(this).attr("href")).get(0).offsetTop + -400 + "px"
            //document.getElementById("section4").offsetTop
        }, {
                duration: 800,
                easing: "swing"
            });
        return false;
    });

    animation();
});

$(window).on("load resize", function () {
    var wh = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
    $("#section1").css("height", wh);
    $('.view-box').scrollspy({ target: '#nav_right', offset: 400 });
    $('.loading').fadeOut(500);
    Highcharts.theme = {
        colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
            '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        chart: {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                    [0, '#173548']
                ]
            },
            style: {
                fontFamily: '\'Unica One\', sans-serif'
            },
            plotBorderColor: '#606063'
        },
        title: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase',
                fontSize: '20px'
            }
        },
        subtitle: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase'
            }
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'

                }
            }
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    color: '#f1f1f1',
                    stroke: '#000000'
                },
                marker: {
                    lineColor: '#333'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            }
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        credits: {
            style: {
                color: '#666'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },

        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000003',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },

        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },

        // special colors for some of the
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
    };
    // Apply the theme
    Highcharts.setOptions(Highcharts.theme);
    var chart = Highcharts.chart('chart_box', {
        exporting: { enabled: false },
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
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
});

function initAnimation() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    // w = canvas.width = window.innerWidth,
    // h = canvas.height = window.innerHeight,
    w = canvas.width = getElementSize("section1", "width");
    h = canvas.height = getElementSize("section1", "height");

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
    gradient2.addColorStop(0.2, 'transparent');

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
