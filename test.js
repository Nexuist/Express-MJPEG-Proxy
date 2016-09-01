var express = require("express");
var script = require("./index");
if (process.argv.length < 3) {
	console.log("node test.js <STREAM URL> [PORT]");
	process.exit(1);
}
var url = process.argv[2];
var port = process.argv[3] || 8080;
var proxy = new script.Proxy(url);
var server = express();
server.get("/", proxy.requestHandler);
server.listen(port, function() {
	console.log("Proxying", url, "on port", port);
	var clients = 0;
	proxy.emitter.on("error", function(err) {
		console.log("Encountered stream error:", err);
	});
	proxy.emitter.on("addClient", function() {
		clients++;
		console.log("Added a client:", clients, "total");
	});
	proxy.emitter.on("dropClient", function() {
		clients--;
		console.log("Dropped a client:", clients, "total");
	});
});
