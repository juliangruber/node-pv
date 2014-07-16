var Transform = require('stream').Transform;
var bytes = require('bytes');
var strftime = require('strftime');
var inherits = require('util').inherits;

module.exports = PV;
inherits(PV, Transform);

function PV(opts){
  if (!(this instanceof PV)) return new PV(opts);
  Transform.call(this);

  opts = opts || {};
  this.name = opts.name;
  this.size = opts.size;
  this.volume = 0;
  this.throughput = 0;
  this.start = new Date;
  this.firstLine = true;

  this.interval = setInterval(this.progress.bind(this), 1000);
}

PV.prototype._transform = function(buf, _, done){
  this.volume += buf.length;
  this.throughput += buf.length;

  if (this.firstLine) {
    this.progress();
    this.firstLine = false;
  }

  done(null, buf);
};

PV.prototype.progress = function(){
  var segs = [];
  if (this.name) segs.push(this.name + ':');
  segs.push(bytes(this.volume).toUpperCase());
  segs.push(time(new Date - this.start));
  segs.push('[' + bytes(this.throughput).toUpperCase() + '/s]');
  if (this.size) {
    segs.push(Math.round(this.volume / this.size * 100) + '%');
    segs.push('ETA');
    segs.push(time((this.size - this.volume) / this.throughput * 1000));
  }

  this.throughput = 0;
  this.emit('info', '\r' + segs.join('  '));
};

PV.prototype._flush =
PV.prototype.close = function(cb){
  clearInterval(this.interval);
  if (cb) cb();
};

//
// Print time `n` in format HH:MM:SS.
//

function time(n){
  return strftime('%H:%M:%S', new Date(n - 3600000));
}

