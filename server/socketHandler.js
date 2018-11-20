const wsRequestHandlers = (connections, messages) => (ws) => {
  // console.log('Request', Object.keys(ws));
  console.log(ws.constructor);

  // console.log(
  //   connection.remoteAddress,
  //   'connected - Protocol version',
  //   connection.webSocketVersion,
  // );

  // // We send all the message history
  // connection.sendUTF(JSON.stringify({
  //   msg: 'msgHistory',
  //   data: messages,
  // }));

  // // Handler for close
  // connection.on('close', () => {
  //   console.log(connection.remoteAddress, 'disconnected');
  //   const idx = connections.indexOf(connection);

  //   if (index !== -1) {
  //     connections.splice(index, 1);
  //   }
  // });

  // // Handler for incoming messages
  // connection.on('message', (msg) => {
  //   if (message.type === 'utf8') {
  //     try {
  //         messages.push(msg);
  //         connections.forEach((dest) => {
  //         dest.sendUTF(msg.utf8Data);
  //       });
  //     } catch(err) {
  //       console.error(err);
  //     }
  //   }
  // });
}

module.exports = wsRequestHandlers;
