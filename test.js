var test = require('tape');
var spawn = require('child_process').spawn;
var tmpdir = require('os').tmpdir;
var fs = require('fs');

test('bin stdin pass through', function(t){
  var ps = spawn(__dirname + '/bin/pv.js');
  ps.on('error', t.error.bind(t));
  ps.stdout.on('data', function(chunk){
    t.equal(chunk.toString(), 'hey');
    t.end();
  });
  ps.stdin.end('hey');
});

test('bin stdarg read', function(t){
  var tmp = tmpdir() + '/pv' + Math.random();
  fs.writeFileSync(tmp, 'hey');

  var ps = spawn(__dirname + '/bin/pv.js', [tmp]);
  ps.on('error', t.error.bind(t));
  ps.stdout.on('data', function(chunk){
    t.equal(chunk.toString(), 'hey');
    t.end();
  });
});

test('bin volume', function(t){
  var ps = spawn(__dirname + '/bin/pv.js');
  ps.on('error', t.error.bind(t));
  ps.stderr.once('data', function(chunk){
    ps.stdin.end();
    t.ok(/3B/.test(chunk.toString()));
    t.end();
  });
  ps.stdin.write('hey');
});

test('bin time', function(t){
  var ps = spawn(__dirname + '/bin/pv.js');
  ps.on('error', t.error.bind(t));
  ps.stderr.once('data', function(chunk){
    ps.stdin.end();
    t.ok(/00:00:00/.test(chunk.toString()));
    t.end();
  });
  ps.stdin.write('hey');
});

test('bin throughput', function(t){
  var ps = spawn(__dirname + '/bin/pv.js');
  ps.on('error', t.error.bind(t));
  ps.stderr.once('data', function(chunk){
    ps.stdin.end();
    t.ok(/\[3B\/s\]/.test(chunk.toString()));
    t.end();
  });
  ps.stdin.write('hey');
});

test('bin name', function(t){
  var ps = spawn(__dirname + '/bin/pv.js', ['-N', 'test']);
  ps.on('error', t.error.bind(t));
  ps.stderr.once('data', function(chunk){
    ps.stdin.end();
    t.ok(/test:/.test(chunk.toString()));
    t.end();
  });
  ps.stdin.write('hey');
});

test('bin size arg', function(t){
  var ps = spawn(__dirname + '/bin/pv.js', ['-s', '30']);
  ps.on('error', t.error.bind(t));
  ps.stderr.once('data', function(chunk){
    ps.stdin.end();
    t.ok(/10%/.test(chunk.toString()));
    t.end();
  });
  ps.stdin.write('hey');
});

test('bin argv size', function(t){
  var tmp = tmpdir() + '/pv' + Math.random();
  fs.writeFileSync(tmp, 'hey');

  var ps = spawn(__dirname + '/bin/pv.js', [tmp]);
  ps.on('error', t.error.bind(t));
  ps.stderr.once('data', function(chunk){
    ps.stdin.end();
    t.ok(/100%/.test(chunk.toString()));
    t.end();
  });
  ps.stdin.write('hey');
});

test('bin eta', function(t){
  var ps = spawn(__dirname + '/bin/pv.js', ['-s', '30']);
  ps.on('error', t.error.bind(t));
  ps.stderr.once('data', function(chunk){
    ps.stdin.end();
    t.ok(/ETA  00:00:09/.test(chunk.toString()));
    t.end();
  });
  ps.stdin.write('hey');
});

test('bin no newline', function(t){
  var ps = spawn(__dirname + '/bin/pv.js');
  ps.on('error', t.error.bind(t));
  ps.stderr.once('data', function(chunk){
    ps.stdin.end();
    t.notOk(/\n/.test(chunk.toString()));
    t.end();
  });
  ps.stdin.write('hey');
});

