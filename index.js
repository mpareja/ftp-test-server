var util = require("util");
var EventEmitter = require("events").EventEmitter;
var spawn = require('child_process').spawn;

function FtpServer() {
  EventEmitter.call(this);
}

util.inherits(FtpServer,  EventEmitter);

FtpServer.prototype.init = function(cfg) {
  var cmd = [__dirname + '/ftpd.py'];

  cfg.user && cmd.push(cfg.user);
  cfg.pass && cmd.push(cfg.pass);
  cfg.port && cmd.push(cfg.port);
  var server = this.server = spawn('python', cmd);

  var self = this;
  server.stdout.on('data', function(data) {
    self.emit('stdout', data)
  });

  server.stderr.on('data', function(data) {
    self.emit('stderr', data)
  });

  server.on('close', function(code, signal) {
    self.emit('close', code, signal);
  });

  server.on('exit', function(code, signal) {
    self.emit('exit', code, signal);
  });

  server.on('disconnect', function() {
    self.emit('disconnect');
  });

  server.on('error', function(err) {
    self.emit('error', err);
  });
};

FtpServer.prototype.stop = function(cfg) {
  this.server.kill();
};

module.exports = FtpServer;
