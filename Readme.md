
# node-pv

  A node.js implementation of the
  [Pipe Viewer](http://www.ivarch.com/programs/pv.shtml) utility, useful for
  inspecting a pipe's traffic.

## Example

```bash
$ cat /dev/random | pv >/dev/null
18.88MB  00:00:02  [9.59MB/s]^C
```

## Usage

  There's an excellent description on
  [Peteris Krumins](https://github.com/pkrumins)'s blog:
  [A Unix Utility You Should Know About: Pipe Viewer](http://www.catonmat.net/blog/unix-utilities-pipe-viewer/)

```bash
$ source | pv [OPTIONS] | dest

$ pv [OPTIONS] <FILE> | dest
```

## Options

  - `-s, --size SIZE`: Assume the total amount of data to be transferred is __SIZE__ bytes
  - `-N, --name NAME`: Prefix the output information with __NAME__

## Installation

```bash
$ npm install -g node-pv
```

## JS API

```js
var PV = require('node-pv');
var pv = PV({
  size: /* ... */,
  name: /* ... */,
  objectMode: /* ... */
});

pv.on('info', function(str){
  process.stderr.write(str);
});

process.stdin.pipe(pv).pipe(process.stdout);
```

## License

  MIT

