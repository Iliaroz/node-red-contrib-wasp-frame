module.exports = function (RED) {
  if (false) {
    // Test for nodes compatibilities
    throw 'Info : not compatible'
  }

  function NodeConstructor(config) {
    RED.nodes.createNode(this, config);
    var self = this;;

	// INPUT
    self.on('input', function (msg) {
      msg.payload = [msg.payload, msg.payload];
      self.send(msg);
    })
	
	// CLOSE
    self.on('close', function () {
		//self.child.kill();
	})
  }
  RED.nodes.registerType('wasp-frame', NodeConstructor)
}
