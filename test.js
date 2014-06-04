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
  ps.stderr.once('data', function(){
    ps.stderr.once('data', function(chunk){
      ps.stdin.end();
      t.ok(/3B/.test(chunk.toString()));
      t.end();
    });
  });
  ps.stdin.write('hey');
});

test('bin time', function(t){
  var ps = spawn(__dirname + '/bin/pv.js');
  ps.on('error', t.error.bind(t));
  ps.stderr.once('data', function(){
    ps.stderr.once('data', function(chunk){
      ps.stdin.end();
      t.ok(/00:00:01/.test(chunk.toString()));
      t.end();
    });
  });
  ps.stdin.write('hey');
});

