function SampleNode(config) {
    RED.nodes.createNode(this,config);
    // node-specific code goes here

}

RED.nodes.registerType("sample",SampleNode, {
    settings: {
        sampleNodeColour: {
            value: "red",
            exportable: true
        }
    }
});


let node = this;
this.on('input', function(msg, send, done) {
    // For maximum backwards compatibility, check that send exists.
    // If this node is installed in Node-RED 0.x, it will need to
    // fallback to using `node.send`
    send = send || function() { node.send.apply(node,arguments) }

    msg.payload = "hi";
    send(msg);

    if (done) {
        done();
    }
});


this.on('close', function(done) {
    doSomethingWithACallback(function() {
        done();
    });
});