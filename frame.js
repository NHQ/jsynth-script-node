
module.exports = function(){
  var jsynth = require('jsynth')
  window.time = 0;
  osc = require('oscillators')
  amod = require('amod')
  delay = require('jdelay')
  sine = osc.sine
  saw = osc.saw
  square = osc.square
  triangle = osc.triangle
  isaw = osc.saw_i
  var master = (window.AudioContext) ? new AudioContext : new webkitAudioContext
  window.master = master
  var music = function(t, s, i){return 0}
  var dsp = function(t, s, i){time = t; return music(i)}
  var synth = jsynth(master, dsp)
  synth.connect(master.destination)
  window.addEventListener('message', function(evt){
    try{
      var fn = Function(evt.data)()
      if(isNaN(fn(Math.random()))) throw new Error('returned NaN')
      else music = fn
    }
    catch(err){console.log(err)}
  })

}


