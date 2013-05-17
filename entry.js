var master = new webkitAudioContext()
var editor = require('./')(master);

editor.source.connect(master.destination)
//editor.element.style.display = 'block'