module.exports = function(){
  
  time = 0;
  sammple = 0;
  var emitter = require('events').EventEmitter
  var emit = new emitter
  jsynth = require('jsynth')
  osc = require('oscillators')
  amod = require('amod')
  delay = require('jdelay')
  teoria = require('teoria')
  nvelope = require('nvelope')
  jmod = require('jmod')
  sync = require('jsynth-sync')
  sine = osc.sine
  saw = osc.saw
  square = osc.square
  triangle = osc.triangle
  isaw = osc.saw_i
  var master = (window.AudioContext) ? new AudioContext : new webkitAudioContext
  window.master = master
  var buf = new Float32Array(2048 * 2 * 2)
  for(var y = 0; y < buf.length; y ++){
    buf[y] = 0
  }
  emit.on('data', function(buf){
    window.parent.postMessage(buf, '*')
  })
  var music = function(t, s, i){return 0}
  var x = 0; 
  var dsp = function(t, s, i){
    time = t; 
    sample = s;
    x = music(t)
    buf[s % buf.length - 1] = x
    if(s % (buf.length - 1) == 0) emit.emit('data', buf) 
    return x
  }

  var synth = jsynth(master, dsp, 2048 * 2 * 2)
  
  synth.connect(master.destination)
  
  window.addEventListener('message', function(evt){
    try{
      try{
        var fn = Function(evt.data)()
      }catch(err){console.log(err)}
      try{  
        if(isNaN(fn(Math.random()))) throw new Error('returned NaN')
        else music = fn
      }catch(err){console.log(err)}
    }
    catch(err){console.log(err)}
  })

}


