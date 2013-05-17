/* ** Welcome to the secret.synth.fm pre alpa beta mic check party ***
	
	*** IMPORTANTE: THIS IS THE USER MANUAL ***
	
	This is a live scripting environment for web audio.
	
	There is a "global" variable *synth* [Function] which gets polled for every sample. 
	I.E. synth = myDspFunction; See the Example following these comments. 
	Press SHIFT-ENTER right now to hear it play while you read...
	
	*synth* is not actually global, just a closure up/out/around. When you compile/run your code, 
	it's run in its own closure. This has consequences of its own, for loops or w/e. 
	But you can handle it. You can write other variables the true global, window, if you want.
	Who will care if you do? It's a safe place to store things for a sesh.
	
	>>TO COMPILE YOUR CODE<< you have options:
	'SHIFT-ENTER' == compile everything in the editor || selected text only.
	'ALT-ENTER' === same as above.
	'CMD-ENTER' === compile the current line only.
	
	There are some other pseudo globals you can use.
	The most important is *time*, in the lowercase. 
	*time* is updated every call to synth(). You know what to do with that.
	
	The others are: *sampleRate*, *oscillators*, *amod*, *delay*, *sample*
	
	*sampleRate* the master sampleRate, in samples per second

	*oscillators* [object] // a group of time-domain oscillator functions
		.sine(time, frequency)
		.square(ibid.)
		.saw(ibid.)
		.saw_i(ibid.) // inverted saw
		.triangle(ibid.)

	*amod* [Function] // amplitude modulation, takes 4 params
		@ base // or center, eg: .5
		@	radius // how far from the center to modulate, eg: .1
		@ *time* // the aforementioned time psuedo-global
		@ frequency // how often in Hz you want to go from eg: .4 to .6 (.5+-.1)

	*delay* [Function] // a delay function constructor, takes 3 params
		@ delayLength [integer] // in SAMPLES eg: 1 second delay = sampleRate
		@ feedback [float] // the feedback level 0-1 normalized, but you can pass any value... 
		@ mix [float] // mix amount for the effect, zero meaning the delay effect is null. same as above...
		returns a [Function] which takes 4 params
			@ sample // the actual sample, or input
			@@@ the three params above, to change them on the fly
			returns the delayed sample value [float]
			
	*sample* [float] // an input value from audio input streams from other sources, coming soon ;^)
	
*/

// this sample forked and modded from https://github.com/substack/nodepdx-beep-boop-examples/tree/master/example
// press SHIFT+ENTER to compile!
var tau = Math.PI * 2;
var Delay = delay(sampleRate * 4, .887, .223) // a 4 second delay?

synth = function () { // define the global synth function
  	var tt = time // mapping a local variable to the global time
    if (tt % 8 > 6 && tt % 8 < 7) {
        tt = Math.sin((tt - 6) * tau / 4);
    }
    if (tt % 8 >= 7 && tt % 8 < 7.5) {
        tt = Math.cos((tt - 7) * tau / 1) * 2;
    }
    var t = tt % 8;
    
    var honk = (tt % 32 >= 15.5 && tt % 32 < 16.5) * (
        2 * sin(254)
        + 5 * sin(4) * sin(508)
        + 1 * sin(250)
        + 0.5 * sin(125)
    ) * (sin(3) + sin(5) + sin(0.5)) / 3;
    
    var n = t % 7;
    var xs = [ 303, 1212, 666];
    
    var speed = tt % 8 > 7 ? 16 : 2;
    var x = xs[Math.floor(t*speed)%xs.length]
    var z = tt % 8 < 7 ? 1000 : 80;
    
    var f = x + Math.sin(z * (t % 1));
    
  	var sample = (
         0.15 * Math.sin(tau * t * f) * (time % 32 > 8 ? 1 : 0)
        + 0.1 * Math.sin(tau * t * (f * 2 + 4)) * (time % 32 > 16 ? 1 : 0)
        + 0.4 * (tt >= 3) * shaker(tt < 16 ? tt : (tt % 4 + 16))
        + honk
    );
  
  		// amod the sample - .5 base gain plus/minus .2, every tt
  	sample *= amod(.5, .2, time, tt); 
      // put the put the delay on it
 	  sample = Delay(sample)
    
    return sample
    
    function sin (x) {
        return Math.sin(tau * t * x);
    }
};

function shaker (t) {
    var n = (Math.sin(t * 2) + 1) * 4;
    var xs = [ 20, 10, 32, 50, 30 ];
    var x = xs[Math.floor(t*8)%xs.length];
    var f = x + Math.sin(1000 * (n % 1));
    var r = sin(f) * (sin(4) + sin(3) + sin(5)) * sin(4);
    return r * r;
    
    function sin (x) {
        return Math.sin(tau * t * x);
    }
}