var encode = require("./encoding.js");

function Printer() {
  this.commandMode = 'CPCL'
}
Printer.prototype.init = function() {
	this.data = ''
	this.command = []
}

Printer.prototype.addCommand = function(content) {
	var code = new encode.TextEncoder('gb18030', { NONSTANDARD_allowLegacyEncoding: true }).encode(content + '\r\n')
	for (var i = 0; i < code.length; ++i) {
		this.command.push(code[i])
	}
}

Printer.prototype.setBitmap = function(x, y, res) {
	var w = res.width
	var width = parseInt((res.width + 7) / 8 * 8 / 8)
	var height = res.height;

	let data = `CG ${width} ${height} ${x} ${y}\r\n`
	console.log(data);
	this.addCommand(data) 
	var r = []
	var bits = new Uint8Array(height * width);
	for (y = 0; y < height; y++) {
		for (x = 0; x < w; x++) {
			var color = res.data[(y * w + x) * 4 + 1];
			if (color > 128) {
				bits[parseInt(y * width + x / 8)] |= (0x80 >> (x % 8));
			}
		}
	}
	for (var i = 0; i < bits.length; i++) {
		this.command.push((~bits[i]) & 0xFF);
		r.push((~bits[i]) & 0xFF);
	}
	console.log(
		JSON.stringify(r)
	);
}

Printer.prototype.pushCode = function(content) {
	content.forEach((el)=>{
		this.command.push(el)
	})
}

Printer.prototype.setPagePrint = function() {
	this.addCommand("PRINT")
}

Printer.prototype.getData = function() {
	return this.command;
}

module.exports = Printer
module.exports.default = Printer