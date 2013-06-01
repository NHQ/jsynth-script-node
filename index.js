var Editor = require('javascript-editor');
var Emitter = require('events').EventEmitter
var jsynth = require('jsynth');
var fs = require('fs');
var html = require('hyperscript');
var touchdown = require('touchdown');
var diff = window.diff = require('diff');
var store = window.store = require('store');
var diffs = [];
var txt = fs.readFileSync('./sinewave.js');
var lastCompile = txt + '';
var firstDifObject = {
	diff: diff.createPatch('http://secret.synth.fm', '', lastCompile),
	time: new Date().getTime()
}

diffs.push(firstDifObject)

var s1 = fs.readFileSync('../css/script-node/codemirror.css');
var s3 = fs.readFileSync('../css/script-node/style.css');
var s2 = fs.readFileSync('../css/script-node/theme.css');
var s4 = fs.readFileSync('../css/script-node/sidebar.css');
var s5 = fs.readFileSync('../css/popup.css');

var css = s1 + s2 + s3 + s4 + s5;	

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
					
					window.getDiffs = getDiffByIndex;

					var style = document.createElement('style');
					style.textContent = css;
					document.head.appendChild(style)
					
					var label1 = html('legend', 'SHIFT-ENTER', 
						html('label', {for: 'compileButton'}, 
							touchdown.start(html('button', {
								textContent: 'compile code',
								name: 'compileButton',
								id: 'compileButton',
								ontouchdown: keyMap,
								}
							))
						)
					)
					
					var label2 = html('legend', 'ctrl-s', 
						html('label', {for: 'shareButton'}, 
							touchdown.start(html('button', {
								textContent: 'share',
								name: 'shareButton',
								id: 'shareButton',
								ontouchdown: null,
								}
							))
						)
					)
					
					var label3 = html('legend', 'ctrl-g', 
						html('label', {for: 'commitButton'}, 
							touchdown.start(html('button', {
								textContent: 'git commit',
								name: 'commitButton',
								id: 'commitButton'
								}
							))
						)
					)
					
					var label4 = html('legend', 'ctrl-h', 
						html('label', {for: 'helpButton'}, 
							touchdown.start(html('button', {
								textContent: 'help & info',
								name: 'helpButton',
								id: 'helpButton'
								}
							))
						)
					)
					
					var label5 = html('legend', 'ctrl-m', 
						html('label', {for: 'menuButton'}, 
							touchdown.start(html('button', {
								textContent: 'hide toolbar',
								name: 'menuButton',
								id: 'menuButton'
								}
							))
						)
					)
					
					var label6 = html('legend', 'ctrl-z', 
						html('label', {for: 'zeroButton'}, 
							touchdown.start(html('button', {
								textContent: 'return zero',
								name: 'zeroButton',
								id: 'zeroButton',
								ontouchdown: function(){synth = function(){return 0}}
								}
							))
						)
					)
					
					var label7 = html('legend', 'ctrl-o', 
						html('label', {for: 'openButton'}, 
							touchdown.start(html('button', {
								textContent: 'open file',
								name: 'openButton',
								id: 'openButton'
								}
							))
						)
					)
					
					var label8 = html('legend', 'ctrl-f', 
						html('label', {for: 'fullScreenButton'}, 
							touchdown.start(html('button', {
								textContent: 'full screen',
								name: 'fullScreenButton',
								id: 'fullScreenButton',
								ontouchdown: function(){document.body.webkitRequestFullscreen()}
								}
							))
						)
					)
					
					var sidebar = html('div.skinnyBar', 
						html('h1',{
							innerHTML: '<i>the</i><br />PROTOTYPER'
						}
						)
					)
					
					var scriptMenu = html('div.scriptMenu', [label1, label2, label3, label4, label5, label6, label7, label8]);

					sidebar.appendChild(scriptMenu)					
					document.body.appendChild(sidebar)
					
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

					var ed = Editor({ container: box, value: txt, updateInterval: Infinity, viewportMargin: Infinity})

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
					
					function ctrl_s(){}
					function ctrl_c(){}
					function ctrl_h(){}
					function ctrl_g(){}

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
							eval(val);
							var d = diff.createPatch('http://secret.synth.fm', lastCompile, val);
							lastCompile = val;
							diffs.push({time: new Date().getTime(), diff: d})
							store.set('diffs', diffs);
						}
					}
					
					function getDiffByIndex(index){
						var str = '';
						for(var x = 0; x < index; x++) {
						  str =	diff.applyPatch(str, diffs[x].diff)
						}
						return str
					}
  	}

	})(window, document)
