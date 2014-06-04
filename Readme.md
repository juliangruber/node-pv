
# node-pv

  A node.js implementation of the [pv](http://www.ivarch.com/programs/pv.shtml) utility.

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
$ npm install -g pv
```

## License

  MIT

