function getTimeRemaining(endtime) {
	var t = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor((t / 1000) % 60);
	var minutes = Math.floor((t / 1000 / 60) % 60);
	var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	var days = Math.floor(t / (1000 * 60 * 60 * 24));
	return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	};
}

function initializeClock(endtime) {
	var day_text = document.getElementById('countdown');
	var time_text = document.getElementById('countdown-text');

	function updateClock() {
		var t = getTimeRemaining(endtime);

		day_text.innerHTML = t.days;

		time_text.innerHTML = (t.days) + ' Day ' + ('0' + t.hours).slice(-2) + ':' + ('0' + t.minutes).slice(-2) + ':' + ('0' + t.seconds).slice(-2);

		if (t.total <= 0) {
			clearInterval(timeinterval);
		}
	}

	updateClock();
	var timeinterval = setInterval(updateClock, 1000);
}

function show_banner() {
	var camera, controls, scene, renderer;

	var mouseX = 675, mouseY = 217;


	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x062131, 0.002);

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(scene.fog.color);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	var container = document.getElementById('banner-animate');
	container.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
	camera.position.z = 600;

	// controls = new THREE.OrbitControls( camera, renderer.domElement );
	// //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
	// controls.enableDamping = true;
	// controls.dampingFactor = 0.25;
	// controls.enableZoom = true;

	// world
	var geometry = new THREE.CylinderGeometry(0, 10, 15, 3, 1);

	var materials = [
		new THREE.MeshLambertMaterial({ color: 0x293732 }),
		new THREE.MeshLambertMaterial({ color: 0x0A3349 }),
		new THREE.MeshLambertMaterial({ color: 0x1B2941 }),
	];

	var tris = [];

	var pivot = new THREE.Object3D();

	pivot.position = scene.position;

	for (var i = 0; i < 500; i++) {

		tris[i] = new THREE.Mesh(geometry, materials[getRandom(0, 2)]);
		tris[i].position.x = (Math.random() - 0.5) * 1000;
		tris[i].position.y = (Math.random() - 0.5) * 1000;
		tris[i].position.z = (Math.random() - 0.5) * 1000;
		tris[i].rotation.x = (Math.random() - 0.5) * 1000;
		tris[i].rotation.y = (Math.random() - 0.5) * 1000;

		tris[i].o_pos_x = tris[i].position.x;
		tris[i].o_pos_y = tris[i].position.y;

		pivot.add(tris[i]);

	}

	scene.add(pivot);


	// Main

	var size = 200;
	var point;

	var outerGeo = new THREE.CylinderGeometry(size, size, 20, 3, 20);
	var innerGeo = new THREE.CylinderGeometry(size - 5, size - 5, 20, 3, 20);

	var outerBSP = new ThreeBSP(outerGeo);
	var innerBSP = new ThreeBSP(innerGeo);

	var intersections = outerBSP.subtract(innerBSP);

	var mainMat = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: THREE.FaceColors });
	var faceIndices = ['a', 'b', 'c'];

	var mainGeo = intersections.toGeometry();

	for (var i = 0; i < mainGeo.faces.length; i++) {
		var face = mainGeo.faces[i];
		var numberOfSides = 3;
		// assign color to each vertex of current face
		for (var j = 0; j < numberOfSides; j++) {

			vertexIndex = face[faceIndices[j]];

			// store coordinates of vertex
			point = mainGeo.vertices[vertexIndex];

			// initialize color variable
			color = new THREE.Color(0xffffff);
			color.setRGB(0.5 + point.x / size, 0.5 + point.y / size, 0.5 + point.z / size);
			face.vertexColors[j] = color;

		}
	}

	var mainTri = new THREE.Mesh(mainGeo, mainMat);
	mainTri.rotateX((Math.PI * 3) / 2);
	mainTri.position.set(0, 0, 0);
	scene.add(mainTri);

	var subTri = new THREE.Mesh(mainGeo, mainMat);
	subTri.rotateX(Math.PI / 2).scale.set(0.49, 0.49, 0.49);
	subTri.rotateZ((Math.PI * 6) / 2);
	subTri.position.set(0, 0, 0);
	scene.add(subTri);




	// lights
	var ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(ambientLight);

	var lights = [];
	lights[0] = new THREE.PointLight(0xffffff, 1, 0);
	lights[1] = new THREE.PointLight(0xffffff, 1, 0);
	lights[2] = new THREE.PointLight(0xffffff, 1, 0);

	lights[0].position.set(0, 200, 0);
	lights[1].position.set(100, 200, 100);
	lights[2].position.set(- 100, - 200, - 100);

	scene.add(lights[0]);
	scene.add(lights[1]);
	scene.add(lights[2]);

	//


	//

	window.addEventListener('resize', onWindowResize, false);


	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		

	}

	function onDocumentMouseMove(event) {
		// mouseX = event.clientX - window.innerWidth / 2;
		// mouseY = event.clientY - window.innerHeight / 2;
	}

	document.addEventListener('mousemove', onDocumentMouseMove, false);

	var tween;

	function onClick(event) {
		TWEEN.removeAll();
		tween = new TWEEN.Tween({ x: camera.position.x, y: camera.position.y, z: camera.position.z })
			.to({ x: camera.position.x + 10, y: camera.position.y + 10, z: camera.position.z + 10 }, 2000)
			.onUpdate(function () {
				camera.position.set(this.x);
				camera.lookAt(scene.position);
			})
			.start();
	}

	// document.addEventListener( 'click', onClick, false );

	var cameraAngle = 0;
	var orbitRange = 800;
	var orbitSpeed = 0.02;
	var desiredAngle = (Math.PI * 6) / 2;

	var inc = 0.06;
	var rev_inc = false;

	camera.position.set(orbitRange, 100, 500);
	camera.lookAt(mainTri.position);




	animate();


	function animate() {
		var time = Date.now() * 0.00005;

		if (inc >= 1) {
			rev_inc = true;
		}

		if (rev_inc) {
			inc -= 0.005;
		} else {
			inc += 0.005;
		}

		if (inc <= 0.06) {
			rev_inc = false;
		}

		requestAnimationFrame(animate);

		// controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true

		TWEEN.update();

		camera.position.x += (mouseX - camera.position.x) * 0.05;
		camera.position.y += (-mouseY - camera.position.y) * 0.05;
		camera.lookAt(scene.position);

		for (var i = 0; i < mainTri.geometry.faces.length; i++) {

			var face = mainTri.geometry.faces[i];
			var numberOfSides = 3;

			// assign color to each vertex of current face
			for (var j = 0; j < numberOfSides; j++) {

				vertexIndex = face[faceIndices[j]];

				// store coordinates of vertex
				point = mainTri.geometry.vertices[vertexIndex];
				face.vertexColors[j].setHSL(inc + point.x / size, 0.6, 0.5);


			}
		}

		mainTri.geometry.colorsNeedUpdate = true;


		pivot.rotation.y += 0.001;
		pivot.rotation.x += 0.001;

		render();

	}

	function render() {

		renderer.render(scene, camera);

	}


	function getRandom(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}

function show_line() {
	var canvas = document.getElementById("banner-animate");
	var ctx = canvas.getContext("2d");
	var cw = canvas.width = window.innerWidth,
		cx = cw / 2;
	var ch = canvas.height = window.innerHeight,
		cy = ch / 2;

	ctx.fillStyle = "#000";
	var linesNum = 16;
	var linesRy = [];
	var requestId = null;

	function Line(flag) {
		this.flag = flag;
		this.a = {};
		this.b = {};
		if (flag == "v") {
			this.a.y = 0;
			this.b.y = ch;
			this.a.x = randomIntFromInterval(0, ch);
			this.b.x = randomIntFromInterval(0, ch);
		} else if (flag == "h") {
			this.a.x = 0;
			this.b.x = cw;
			this.a.y = randomIntFromInterval(0, cw);
			this.b.y = randomIntFromInterval(0, cw);
		}
		this.va = randomIntFromInterval(25, 100) / 100;
		this.vb = randomIntFromInterval(25, 100) / 100;

		this.draw = function () {
			ctx.strokeStyle = "#ccc";
			ctx.beginPath();
			ctx.moveTo(this.a.x, this.a.y);
			ctx.lineTo(this.b.x, this.b.y);
			ctx.stroke();
		}

		this.update = function () {
			if (this.flag == "v") {
				this.a.x += this.va;
				this.b.x += this.vb;
			} else if (flag == "h") {
				this.a.y += this.va;
				this.b.y += this.vb;
			}

			this.edges();
		}

		this.edges = function () {
			if (this.flag == "v") {
				if (this.a.x < 0 || this.a.x > cw) {
					this.va *= -1;
				}
				if (this.b.x < 0 || this.b.x > cw) {
					this.vb *= -1;
				}
			} else if (flag == "h") {
				if (this.a.y < 0 || this.a.y > ch) {
					this.va *= -1;
				}
				if (this.b.y < 0 || this.b.y > ch) {
					this.vb *= -1;
				}
			}
		}
	}

	for (var i = 0; i < linesNum; i++) {
		var flag = i % 2 == 0 ? "h" : "v";
		var l = new Line(flag);
		linesRy.push(l);
	}

	function Draw() {
		requestId = window.requestAnimationFrame(Draw);
		ctx.clearRect(0, 0, cw, ch);

		for (var i = 0; i < linesRy.length; i++) {
			var l = linesRy[i];
			l.draw();
			l.update();
		}
		for (var i = 0; i < linesRy.length; i++) {
			var l = linesRy[i];
			for (var j = i + 1; j < linesRy.length; j++) {
				var l1 = linesRy[j]
				Intersect2lines(l, l1);
			}
		}
	}

	function Init() {
		linesRy.length = 0;
		for (var i = 0; i < linesNum; i++) {
			var flag = i % 2 == 0 ? "h" : "v";
			var l = new Line(flag);
			linesRy.push(l);
		}

		if (requestId) {
			window.cancelAnimationFrame(requestId);
			requestId = null;
		}

		cw = canvas.width = window.innerWidth,
			cx = cw / 2;
		ch = canvas.height = window.innerHeight,
			cy = ch / 2;

		Draw();
	};

	setTimeout(function () {
		Init();

		addEventListener('resize', Init, false);
	}, 15);

	function Intersect2lines(l1, l2) {
		var p1 = l1.a,
			p2 = l1.b,
			p3 = l2.a,
			p4 = l2.b;
		var denominator = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
		var ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator;
		var ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator;
		var x = p1.x + ua * (p2.x - p1.x);
		var y = p1.y + ua * (p2.y - p1.y);
		if (ua > 0 && ub > 0) {
			markPoint({
				x: x,
				y: y
			})
		}
	}

	function markPoint(p) {
		ctx.beginPath();
		ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
		ctx.fill();
	}

	function randomIntFromInterval(mn, mx) {
		return ~~(Math.random() * (mx - mn + 1) + mn);
	}
}

function draw_chart() {
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
	var chart = Highcharts.chart('token_chart', {
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
}

show_banner();
draw_chart();
// var deadline = '2018-12-24';
// initializeClock(deadline);
