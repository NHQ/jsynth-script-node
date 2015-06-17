require('../cheatcode')(256 * 2)
var drop = require('drag-drop/buffer')
master = new webkitAudioContext()
tapes = []
tapenodes = []
var box = document.createElement('div')
box.style.width = box.style.height = '133px'
box.style.position = 'absolute'
box.style.top = box.style.right = '11px'
box.style.border = '3px solid green'
box.style.zIndex = 99
document.body.appendChild(box)

drop(box, function(files){
  master.decodeAudioData(files[0].buffer, function(data){
    Ciseaux.from(data).then(function(tape){
      tapes.push(tape)
/*
      tape.render(master).then(function(buff){
        var src = master.createBufferSource()
        src.buffer = buff
        src.connect(master.destination)
        src.start(0)
      })
*/
    })
  })
})

var editor = require('./allone')(master);

editor.editor.editor.scrollTo(0,0) 
// lol

