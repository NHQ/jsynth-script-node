var Editor = require('./javascript-editor');
var Emitter = require('events').EventEmitter
var jsynth = require('jsynth');
var fs = require('fs');

var s1 = fs.readFileSync('./styles/codemirror.css');
var s3 = fs.readFileSync('./styles/style.css');
var s2 = fs.readFileSync('./styles/theme.css');
var js = fs.readFileSync('./sinewave.js');

var val = fs.readFileSync('./entry.js');
var css = s1 + s2 + s3;	

(function(window, document){

		var time = 0; 
		var sample = 0;
		var sampleIndex = 0;
		var global = {};
		var sampleRate = 0;
		var oscillators = require('oscillators')();
		var sine = oscillators.sine;
		var saw = oscillators.saw;
		var saw_i = oscillators.saw_i;
		var square = oscillators.square;
		var triangle = oscillators.triangle;
		var delay = require('jdelay');
		var amod = require('amod');
		var tau = Math.PI * 2;

	  module.exports = function(master){
		
					sampleRate = master.sampleRate
		
					var emitter = new Emitter()

					var style = document.createElement('style');
					style.textContent = css;
					document.head.appendChild(style)

					var box = document.createElement('div');
					box.classList.add('editorBox');
				  document.body.appendChild(box);

					var div = document.createElement('div');
					div.classList.add('editor');
					div.classList.add('left');
					box.appendChild(div);

					var div2 = document.createElement('div');
					div2.classList.add('right');
					box.appendChild(div2);

					var ed = Editor({ container: box, value: js, updateInterval: Infinity})

					ed.editor.addKeyMap({'Shift-Enter': keyMap, 'Alt-Enter':keyMap, 'Cmd-Enter': keyMapLine})
					
					emitter.on('update', function(fn){
						fn();
					})
					
					var source = jsynth(master, function(){
						time = arguments[0]
						sampleIndex = arguments[1]
						sample = arguments[2]
						return synth() || 0;
					});

					return {editor: ed, element: box, style: style, source: source}
					
					function synth (){return 0};
					
					function runCode(code){
						var fn = Function(code);
						synth = fn;
					}

					function keyMapLine(e){
						var lineNo = ed.editor.getCursor().line;
						var line = ed.editor.getLine(lineNo);
						var ready = ed.update(line);
						if(!(ready === false)){
							ed.editor.addLineClass(lineNo, 'background', 'highlightLine')
							setTimeout(function(){ed.editor.removeLineClass(lineNo, 'background', 'highlightLine')}, 1000)
							eval(line);
						}
					}

					function keyMap(e){
						var val = null;
						if(ed.editor.somethingSelected()) val = ed.editor.getSelection();
						else val = ed.editor.getValue()
						var ready = ed.update(val)
						if(!(ready === false)){
							eval(val)
						}
					}
  	}

	})(window, document)