oz = oscillators;
opts = {};
var frequency = 606 * 2 * 3
//opts.freq = 303;
var freqaa = [202, 303, 404, 303, 606, 505, 404, 303];

opts.c = 1000;
opts.a = 1;
opts.m = 2;
opts.wave = 'sine';
// global.Delay = delay(sampleRate * 2, 1, .9);
dingdong = makeBells(opts);

synth = function(){
  opts.m = 8/5 + ( .2 * ( 1 + sine(time, 1)));
  opts.a = .52 + ( .05 * ( 1 + sine(time, 8)));
  opts.c = 100 + ( 33 * ( 1 + sine(time, 1/4)));
  return global.Delay(dingdong(time, opts.m, opts.c, opts.a) * .4, sampleRate * (.005 + (time % 1/16)), .5, 1)
}


function makeBells(opts){
	
	opts = opts || {}
	var f = opts.freq || opts.frequency || frequency || 0 // base frequency
  var g = createGause(opts)
  var m = opts.m || 2;
  var wave = opts.wave || 'sine';
  
	return (function(time, _m, c, a){

		var x = f, y = 0;
		
		while(x <= 11000){
			y += (oz[wave](time, x) * g(x, c, a));
      x *= _m || m
		}
		
		return y
		
	})
	
}

function createGause(opts){
	opts = opts || {}
	var c = opts.c || 100
	var a = opts.a || 1
	
	return (function (delta, _c, _a){
    a = _a || a
    c = _c || c
		return +
			a *
			Math.pow(
				Math.E,
				(
					-Math.pow(
					  delta - 0,
					  2 ) / 
				  Math.pow(
				    32 * c,
					  2 )
				 )
			)
	})
}