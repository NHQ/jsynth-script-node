var eat = require('../../es666')
var Editor = require('javascript-editor');
var Emitter = require('events').EventEmitter
var fs = require('fs');
var diff = window.diff = require('diff');
var store = window.store = require('store');
var codes = []
var diffs = [];
var currentDiff = 0;
var lastCompile = '' 
var firstDifObject = {
	diff: diff.createPatch('http://secret.synth.fm', '', lastCompile),
	time: new Date().getTime()
}
var startTime = new Date().getTime()
diffs.push(firstDifObject)
store.set(startTime + '_diffs', diffs)
var sessions = store.get('sessions') || []
sessions.push(startTime + '_diffs')
store.set('sessions', [])

var s1 = fs.readFileSync('./css/codemirror.css', 'utf8');
var s3 = fs.readFileSync('./css/style.css', 'utf8');
var s2 = fs.readFileSync('./css/theme.css', 'utf8');
var s4 = fs.readFileSync('./css/sidebar.css', 'utf8');

var css = s1 + s2 + s3 + s4; 

(function(window, document){

	  module.exports = function(master){
		
					var emitter = new Emitter()
					
          window.addEventListener('message', function(evt){
            //console.log(evt.data)
          }, true)
					
          window.getDiffs = getDiffByIndex;

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

					var ed = Editor({ container: box, value: '', updateInterval: Infinity, viewportMargin: Infinity})

					ed.editor.addKeyMap({
            'Shift-Enter': keyMap, 
            'Alt-Enter':keyMapLine, 
            'Cmd-Enter': keyMapLine, 
            'Ctrl-[': diffBack,
            'Ctrl-]':diffAhead
            })
										
					emitter.on('update', function(fn){
						fn();
					})
					
					return {editor: ed, element: box}
					function diffAhead(){
            ++currentDiff
            if(currentDiff > diffs.length - 1) currentDiff = 0
            ed.editor.setValue(getDiffs(currentDiff))
          }
          function diffBack(){
            --currentDiff
            if(currentDiff < 0) currentDiff = diffs.length - 1
            ed.editor.setValue(getDiffs(currentDiff))
          }
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
              eatcode(line)
					  }
          }

					function keyMap(e){
						var val = null;
						if(ed.editor.somethingSelected()) val = ed.editor.getSelection();
						else val = ed.editor.getValue()
						var ready = ed.update(val)
						if(!(ready === false)){
              eatcode(val)
              var d = diff.createPatch('http://secret.synth.fm', lastCompile, val);
							lastCompile = val;
              diffs.push({time: new Date().getTime(), diff: d})
							currentDiff = diffs.length - 1
							store.set(startTime + '_diffs', diffs);
						}
					}
					
					function getDiffByIndex(index){
						var str = '';
						for(var x = 0; x < index; x++) {
						  str =	diff.applyPatch(str, diffs[x].diff)
						}
						return str
					}

          function eatcode(txt){
            if(txt) codes.push(txt)
            if(codes.length){
              eat(codes.shift(), function(e, r){
                if(e) console.log(e) 
                eatcode()
              })
            }
          }
  	}

	})(window, document)
