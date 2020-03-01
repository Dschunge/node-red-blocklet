module.exports = function(RED) {    
    function LowerCaseNode(config) {
        var node = this;
        connect = (socket, address) => {
            const BLOCK = 0, UNCLE = 1, TXN = 2, INTERNAL_MSG = 3
            const cmd = `{"jsonrpc":"2.0","id":"${TXN}","method":"subscribe","params":["address:transactions",{"address":"${address}"}]}`
            console.log('jsonrpc: ', cmd)
            socket.send(cmd);           
        }   

        RED.nodes.createNode(this, config);        
        console.log('config: ', config);
        if (config && config.address && config.apikey && config.network) {
            this.address = config.address;
            this.apikey = config.apikey;
            this.network = config.network;
            const WebSocket = require('ws');
            //const socket = new WebSocket(`wss://ws.web3api.io?x-api-key=${this.apikey}&x-amberdata-blockchain-id=ethereum-rinkeby`);
            const socket = new WebSocket(`wss://ws.web3api.io?x-api-key=${this.apikey}&x-amberdata-blockchain-id=${this.network}`);

            // Connection opened
            socket.addEventListener('open', (event) => {
                console.log('Connection opened - ');
                connect(socket, this.address)
                //this.status({fill:"red",shape:"dot",text:"Error: Choose an action"});
                node.status({
                    fill:"green",
                    shape:"dot",
                    text:"Connected..."
                });
            });

            // Listen for messages
            socket.addEventListener('message', (message) => {
                console.log('message: ', JSON.parse(message.data))
                const transaction = JSON.parse(message.data);
                if (transaction.params) {
                    console.log('transaction received: ', transaction.params.result);
                    const msg = { payload: transaction.params.result } ;
                    node.send(msg);
                }
            });

            // Listen for msgs
            socket.addEventListener('close', (event) => {
                console.log('Connection closed - ', event);
                node.status({fill:"red",shape:"dot",text:"Error: Connection closed."});
            });
        } else {
            return callback(RED._("forecastio.error.no-credentials"));
        }        
        
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