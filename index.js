var events = require("events");
exports.Proxy = function(opts) {
	if (!opts) throw new Error("No options provided!");
	if (typeof opts === "string" || opts instanceof String) {
		var url = require("url").parse(opts);
		opts = {
			port: url.port || 80,
			host: url.hostname,
			method: "GET",
			path: url.pathname + (url.search ? url.search : "")
		};
	}
	var serverHeaders = null;
	var clients = [];
	/* Begin consuming stream */
	var stream = require("http").request(opts);
	stream.end();
	/* Got a response from the stream */
	stream.on("response", function(res) {
		serverHeaders = res.headers;
		res.setEncoding("binary");
		/* Send the new chunk to every client on the list */
		res.on("data", function(chunk) {
			for (var i = clients.length; i--;) {
				clients[i].write(chunk, "binary");
			}
		});
	});
	this.emitter = emitter = new events.EventEmitter();
	stream.on("error", function(err) {
		emitter.emit("error", err);
	});
	/* Add a new client to the list and send initial headers */
	this.requestHandler = function(req, res) {
		res.writeHead(200, {
			"Expires": "Mon, 01 Jul 1980 00:00:00 GMT",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Content-Type": serverHeaders["content-type"]
		});
		clients.push(res);
		emitter.emit("addClient");
		res.socket.on("close", function() {
			clients.splice(clients.indexOf(res), 1);
			emitter.emit("dropClient");
		});
	};
};
