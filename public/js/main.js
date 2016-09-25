"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//vector class
var Vector = function () {
	function Vector() {
		var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
		var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

		_classCallCheck(this, Vector);

		this.x = x;
		this.y = y;
		this.magnitude = Math.sqrt(x * x + y * y);
		this.angle = Math.atan2(y, x);
	}

	_createClass(Vector, [{
		key: "add",
		value: function add(v) {
			this.x = this.x + v.x;
			this.y = this.y + v.y;
			this.magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
			this.angle = Math.atan2(this.y, this.x);
			return this;
		}
	}, {
		key: "subtract",
		value: function subtract(v) {
			this.x = this.x - v.x;
			this.y = this.y - v.y;
			this.magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
			this.angle = Math.atan2(this.y, this.x);
			return this;
		}
	}, {
		key: "setAngle",
		value: function setAngle(angle) {
			this.angle = angle;
			this.x = this.magnitude * Math.cos(angle);
			this.y = this.magnitude * Math.sin(angle);
			return this;
		}
	}, {
		key: "setMagnitude",
		value: function setMagnitude(magnitude) {
			this.magnitude = magnitude;
			this.x = Math.cos(this.angle) * magnitude;
			this.y = Math.sin(this.angle) * magnitude;
			return this;
		}
	}]);

	return Vector;
}();

//particle class


var Particle = function () {
	function Particle(opts) {
		_classCallCheck(this, Particle);

		this.x = opts.x || Math.random() * cW;
		this.y = opts.y || Math.random() * cH;
		this.radius = opts.radius || 15;
		this.v = opts.v || new Vector();
		this.acc = opts.acc || new Vector();
		this.mass = opts.mass || 40;
		this.color = opts.color || 320;
		this.maxV = opts.maxV || 9;
		this.maxA = opts.maxA || 1;
		this.tasteTheRainbow = opts.tasteTheRainbow || false;
		if (opts.trail) {
			this.trail = true;
			this.trailLength = opts.trailLength || 10;
			this.trajPoints = new Queue([]);
		}
	}

	_createClass(Particle, [{
		key: "accelerate",
		value: function accelerate() {
			this.acc.magnitude = this.acc.magnitude > this.maxA ? this.acc.setMagnitude(this.maxA) : this.acc.magnitude;
			this.v.add(this.acc);
		}
	}, {
		key: "isOnScreen",
		value: function isOnScreen() {
			return this.x <= cW || this.x >= 0 || this.y <= cH || this.y >= 0;
		}
	}, {
		key: "update",
		value: function update() {
			if (this.acc.magnitude) {
				this.accelerate();
			}
			if (this.trail) {
				var point = {
					x: this.x,
					y: this.y
				};
				this.trajPoints.enqueue(point);
				if (this.trajPoints.getLength() >= this.trailLength) {
					this.trajPoints.dequeue();
				}
			}
			this.v.magnitude = this.v.magnitude > this.maxV ? this.v.setMagnitude(this.maxV) : this.v.magnitude;
			this.x += this.v.x;
			this.y += this.v.y;
			if (this.tasteTheRainbow) {
				this.color = this.color <= 360 ? ++this.color : 1;
			}
		}
	}, {
		key: "render",
		value: function render(context) {
			var trailContext = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

			context.beginPath();
			context.fillStyle = "hsl(" + this.color + ", 100%, 50%)";
			context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
			context.fill();
			context.closePath();
			if (this.trail && trailContext) {
				var trajectory = this.trajPoints;
				trailContext.beginPath();
				trailContext.strokeStyle = "hsl(" + this.color + ", 100%, 50%)";
				trailContext.lineWidth = 0.2;
				trailContext.moveTo(trajectory.queue[0].x, trajectory.queue[0].y);
				for (var i = 1, len = trajectory.getLength(); i < len; i++) {
					trailContext.lineTo(trajectory.queue[i].x, trajectory.queue[i].y);
				}
				trailContext.stroke();
				trailContext.closePath();
			}
		}
	}]);

	return Particle;
}();

var Planet = function (_Particle) {
	_inherits(Planet, _Particle);

	function Planet() {
		_classCallCheck(this, Planet);

		return _possibleConstructorReturn(this, (Planet.__proto__ || Object.getPrototypeOf(Planet)).apply(this, arguments));
	}

	_createClass(Planet, [{
		key: "gravitate",
		value: function gravitate(p) {
			if (Particle.prototype.isPrototypeOf(p)) {
				var d = Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y));
				var attractiveForce = p.mass * this.mass / (d * d);
				this.acc.setAngle(Math.atan2(p.y - this.y, p.x - this.x)).setMagnitude(attractiveForce);
			} else {
				throw new Error("The argument passed to the gravitate function must be a particle");
			}
			this.update();
		}
	}, {
		key: "gravitateStarCluster",
		value: function gravitateStarCluster(cluster) {
			var gV = new Vector();
			for (var i = 0; i < cluster.length; i++) {
				var _star = cluster[i];
				if (Particle.prototype.isPrototypeOf(_star)) {
					var v = new Vector();
					var d = Math.sqrt((this.x - _star.x) * (this.x - _star.x) + (this.y - _star.y) * (this.y - _star.y));
					var attractiveForce = _star.mass * this.mass / (d * d);
					v.setAngle(Math.atan2(_star.y - this.y, _star.x - this.x)).setMagnitude(attractiveForce);
					gV = gV.add(v);
				} else {
					throw new Error("The argument supplied to the gravitateStarCluster function must be an array of particles");
				}
			}
			this.acc.setAngle(gV.angle).setMagnitude(gV.magnitude);
		}
	}]);

	return Planet;
}(Particle);

var Queue = function () {
	function Queue(array) {
		_classCallCheck(this, Queue);

		this.queue = array;
	}

	_createClass(Queue, [{
		key: "getLength",
		value: function getLength() {
			return this.queue.length;
		}
	}, {
		key: "enqueue",
		value: function enqueue(element) {
			this.queue.unshift(element);
		}
	}, {
		key: "dequeue",
		value: function dequeue() {
			this.queue.pop();
		}
	}, {
		key: "display",
		value: function display() {
			for (var i = 0; i < this.getLength; i++) {
				console.log(this.queue[i]);
			}
		}
	}]);

	return Queue;
}();

//util function to paint entire canvas of specified color


function paintCanvas(color, context) {
	var W = context.canvas.clientWidth;
	var H = context.canvas.clientHeight;
	context.save();
	context.fillStyle = color;
	context.fillRect(0, 0, W, H);
	context.restore();
}

//////////////////////////////////////
// -- THIS ANIMATION'S VARIABLES -- //
//////////////////////////////////////

//canvas
var trailCanvas = document.getElementsByClassName("c-gravity__trails")[0]; // '[0]' is needed since getElementsByClassName returns an HTML collection
var particlesCanvas = document.getElementsByClassName("c-gravity__particles")[0];
var trailCtx = trailCanvas.getContext('2d');
var particleCtx = particlesCanvas.getContext('2d');

var cW = particlesCanvas.width = trailCanvas.width = window.innerWidth;
var cH = particlesCanvas.height = trailCanvas.height = window.innerHeight;

//animation constants
var settings = {

	STAR_MASS: 1000,
	PLANET_MASS: 20,
	PLANET_V_X: 2,
	P_TRAIL: true,
	P_MAX_VELOCITY: 8,
	P_MAX_ACC: 0.5,
	P_MIN_VELOCITY: 5,
	PARTICLE_NUM: 70,
	BOUNDS: true,
	TRAIL_LENGTH: 100,
	TRAIL_CNVS: trailCanvas,
	PARTICLE_CNVS: particlesCanvas,
	COLOR: 320,
	TRAIL_CTXT: trailCtx,
	TASTETHERAINBOW: true,
	PARTICLE_CTXT: particleCtx

};

//on resize update canvas size
window.addEventListener('resize', function () {
	cW = particlesCanvas.width = trailCanvas.width = window.innerWidth;
	cH = particlesCanvas.height = trailCanvas.height = window.innerHeight;
});

//mobile
var mobileX = cW / 2;
var mobileY = cH / 2;

//stars and particles
var s = [];
var p = [];

var star = new Particle({
	x: cW / 2,
	y: cH / 2,
	radius: 15,
	color: settings.COLOR,
	tasteTheRainbow: settings.TASTETHERAINBOW,
	mass: settings.STAR_MASS
});

for (var i = 0; i < settings.PARTICLE_NUM; i++) {

	var planet = new Planet({
		x: Math.random() * cW,
		y: Math.random() * cH,
		radius: 2,
		mass: settings.PLANET_MASS,
		trail: settings.P_TRAIL,
		trailLength: settings.TRAIL_LENGTH,
		color: settings.COLOR,
		maxV: settings.P_MAX_VELOCITY,
		maxA: settings.P_MAX_ACC,
		tasteTheRainbow: settings.TASTETHERAINBOW,
		v: new Vector(Math.random() < 0.5 ? -settings.P_MIN_VELOCITY : settings.P_MIN_VELOCITY, 0)
	});

	p.push(planet);
}

//variable that will store animation frame id
var animationFrame = void 0;

//animation function
function animate() {

	//clear particle canvas
	settings.PARTICLE_CTXT.clearRect(0, 0, cW, cH);

	//clear trails canvas and paint it black
	settings.TRAIL_CTXT.clearRect(0, 0, cW, cH);
	paintCanvas('black', settings.TRAIL_CTXT);

	//update star's position and render it
	star.update();
	star.render(settings.PARTICLE_CTXT);

	//update and render other particles
	for (var _i = 0; _i < p.length; _i++) {
		p[_i].gravitate(star);
		if (settings.BOUNDS) {
			if (p[_i].x > cW) {
				p[_i].x = cW;
			}
			if (p[_i].x < 0) {
				p[_i].x = 0;
			}
			if (p[_i].y > cH) {
				p[_i].y = cH;
			}
			if (p[_i].y < 0) {
				p[_i].y = 0;
			}
		}
		if (p[_i].isOnScreen()) {
			p[_i].render(settings.PARTICLE_CTXT, settings.TRAIL_CTXT);
		}
	}

	//request new animation frame to the browser
	animationFrame = requestAnimationFrame(animate);
}

//datgui stuff and thangs
var gui = new dat.GUI();
gui.add(settings, 'STAR_MASS', 500, 2500).name('star mass').onFinishChange(function () {
	star.mass = settings.STAR_MASS;
});
gui.add(settings, 'P_TRAIL').name('particle trail').onFinishChange(function () {
	for (var _i2 = 0; _i2 < settings.PARTICLE_NUM; _i2++) {
		p[_i2].trail = settings.P_TRAIL;
		p[_i2].trajPoints = new Queue([]);
	}
});
gui.add(settings, 'P_MAX_VELOCITY', 4, 14).name('max velocity').onFinishChange(function () {
	for (var _i3 = 0; _i3 < settings.PARTICLE_NUM; _i3++) {
		p[_i3].maxV = settings.P_MAX_VELOCITY;
	}
});
gui.add(settings, 'P_MAX_ACC', 0.2, 2).name('max acceleration').onFinishChange(function () {
	for (var _i4 = 0; _i4 < settings.PARTICLE_NUM; _i4++) {
		p[_i4].maxA = settings.P_MAX_ACC;
	}
});
gui.add(settings, 'PARTICLE_NUM', 1, 250).name('particles number').onFinishChange(function () {
	p = [];
	settings.TRAIL_CTXT.clearRect(0, 0, cW, cH);
	for (var _i5 = 0; _i5 < settings.PARTICLE_NUM; _i5++) {
		var _planet = new Planet({
			x: Math.random() * cW,
			y: Math.random() * cH,
			radius: 2,
			mass: settings.PLANET_MASS,
			trail: settings.P_TRAIL,
			trailLength: settings.TRAIL_LENGTH,
			color: settings.COLOR,
			maxV: settings.P_MAX_VELOCITY,
			maxA: settings.P_MAX_ACC,
			tasteTheRainbow: settings.TASTETHERAINBOW,
			v: new Vector(Math.random() < 0.5 ? -settings.P_MIN_VELOCITY : settings.P_MIN_VELOCITY, 0)
		});
		p.push(_planet);
	}
	star.color = settings.COLOR;
});
gui.add(settings, 'BOUNDS').name('bounds');
gui.add(settings, 'TRAIL_LENGTH', 10, 200).name('trail length').onFinishChange(function () {
	settings.TRAIL_CTXT.clearRect(0, 0, cW, cH);
	for (var _i6 = 0; _i6 < settings.PARTICLE_NUM; _i6++) {
		p[_i6].trajPoints = new Queue([]);
		p[_i6].trailLength = settings.TRAIL_LENGTH;
	}
});

//for debugging without printing stuff 1000000000 times in the console
//window.setInterval(function(){ console.log(); }, 2000);