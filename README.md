### Introduction

This module proxies MJPEG streams (from an IP camera, for example) to a given endpoint of your choice using [express.js](https://expressjs.com/).

### Events

* `error` If the stream errors.

* `addClient` When a new client begins consuming the proxy stream.

* `dropClient` When a client closes the connection with the proxy stream.

### Example Usage

```javascript
var express = require("express");
var proxy = require("express-mjpeg-proxy").Proxy;
var url = "Insert MJPEG stream here";

var server = express();
server.get("/", new proxy(url).requestHandler);
server.listen(8080);

```


### Demo

Run `npm test <STREAM URL> [PORT]` to start a sample express.js server running the stream. Note that you will need to have express.js installed in the package already (`npm install express`) in order for this to work.

### Details

When a new Proxy object is created, it will establish a connection to the MJPEG stream. Any new data from the stream will be sent to any client in the `clients` array.
The argument can either be a string (in the form a URL) or an object acceptable by [http.request](https://nodejs.org/api/http.html#http_http_request_options_callback):

```javascript
var proxy = new Proxy("URL"); // Works
var proxy = new Proxy({
	host: "...",
	port: "80",
	method: "GET"
	path: "/cam.mjpeg"
}); // Also works

```

When requestHandler is executed, it will add the new client to the clients array. When the client closes the connection, it will be removed from the clients array. requestHandler will also send headers to every new client that preserve the boundary value in the Content-Type header.

### Credits

For the module(s) this project was forked from:

* Phil Rene ([philrene](http://github.com/philrene))

* Chris Chua ([chrisirhc](http://github.com/chrisirhc))

* Georges-Etienne Legendre ([legege](https://github.com/legege))


### License
```
Copyright (c) 2016 Andi Andreas

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
