module.exports = function(RED) {    
    function LowerCaseNode(config) {
        connect = socket => {
            const BLOCK = 0, UNCLE = 1, TXN = 2, INTERNAL_MSG = 3
            const tmp = '{"jsonrpc":"2.0","id":2,"method":"subscribe","params":["address:transactions",{"address":"0xf2FA00B8E0117BA72324EbBc5D3514B722b5a656"}]}'
            socket.send(tmp);           
        }   

        RED.nodes.createNode(this,config);        
        console.log('config: ', config);
        this.address = config.address;
        const WebSocket = require('ws');
        const socket = new WebSocket('wss://ws.web3api.io?x-api-key=UAK000000000000000000000000demo0001&x-amberdata-blockchain-id=ethereum-rinkeby');

        // Connection opened
        socket.addEventListener('open', (event) => {
            console.log('Connection opened - ');
            this.connect(socket)
        });

        // Listen for messages
        socket.addEventListener('message', (responseHandler) => {
          console.log('message: ', JSON.parse(responseHandler.data))
          node.send(responseHandler.data);
        });

        // Listen for messages
        socket.addEventListener('close', (event) => {
            console.log('Connection closed - ', event);
            //initWebSockets()
        });

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