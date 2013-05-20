var master = window.master = new webkitAudioContext()
var editor = require('./')(master);

editor.source.connect(master.destination)
editor.editor.editor.scrollTo(0,0) 
// lol

