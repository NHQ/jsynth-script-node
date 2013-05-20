oz = require('oscillators')();
var opts = {};
opts.freq = 303;
opts.res = 10;
opts.tlr = opts.tlf = 1000;
time = 0;
opts.c = 100;

dingdong = makeBells(opts);

synth = function(){
  return dingdong(time)
}

setInterval(function(){
	time+=.001
	synth()
//	console.log(synth()	)
},10)


function makeBells(opts){
	
	opts = opts || {}
	var f = opts.freq || opts.frequency || 0 // base frequency
  var g = createGause(opts)

	return (function(time){

		var x = f, y = 0;
		
		while(x <= 22000){
			y += (oz.sine(time, x) * g(x));
			console.log(x, y);
			x *= 2
		}
		
		return y
		
	})
	
}

function createGause(opts){
	opts = opts || {}
	var c = opts.c || 100
	var a = opts.a || 1
	var b = opts.b || 0
	
	return (function (delta){
		return +
			a *
			Math.pow(
				Math.E,
				(
					-Math.pow(
					  delta - b,
					  2 ) / 
				  Math.pow(
				    2*c,
					  2 )
				 )
			)
	})
}