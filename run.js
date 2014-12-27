var spawn = require('child_process').spawn
spawn('opa', ['-i', 'entry.js', '-o', 'public/bundle.js', '-d'])
