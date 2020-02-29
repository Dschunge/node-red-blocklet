module.exports = function(RED) {
    function LowerCaseNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase();
            node.send(msg);
        });
        node.on('close', function () {
            console.log('close nodes')
        });
    }
    RED.nodes.registerType("lower-case", LowerCaseNode);
}