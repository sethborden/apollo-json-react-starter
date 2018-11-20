function SocketController ({
  handleMessage,
  handleSocketClose, 
}) {
  if (!handleMessage || !handleSocketClose) {
    throw new Error('Please provide message and close handlers!');
  }
  this.handleMessage = handleMessage;
  this.handleSocketClose = handleSocketClose;
  return this;
};

SocketController.prototype.connect = function() {
  const url = 'ws://' + document.URL.substr(7).split('/')[0];

  const wsCtor = window['MozWebSocket'] ? window.MozWebSocket: window.WebSocket;
  try {
    this.socket = new wsCtor(url, 'poke-chat');
    console.log(this.socket);
  } catch(err) {
    console.log(`Unable to connect to Sockets. ${err}`);
  }

  this.socket.onmessage = this.handleMessage;
  this.socket.onclose = this.handleSocketClose; 
}

export default SocketController;
