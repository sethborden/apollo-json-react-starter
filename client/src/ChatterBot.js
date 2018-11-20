import React from 'react';
import ReactDOM from 'react-dom';
import Drawer from '@material-ui/core/Drawer';

import ChatterBotChat from './ChatterBotChat';
import SocketsController from './socketsController';

const chatterBotLauncherStyle = {
  display: 'block',
  position: 'fixed',
  left: '48px',
  bottom: '0',
  width: '120px',
  height: '36px',
  borderTopRightRadius: '12px',
  borderTopLeftRadius: '12px',
  lineHeight: '36px',
  textAlign: 'center',
  background: 'grey',
  cursor: 'pointer',
};

class ChatterBot extends React.Component {
  constructor() {
    super()
    this.state = {
      showBuddyList: false,
      outgoingMessage: '',
      messages: [],
      name: null,
    }
  }

  componentDidMount() {
    const name = prompt('Please enter your name.');
    this.setState({
      name,
    });

    this.socketsController = new SocketsController({
      handleMessage: (msg) => {
        let message;
        try {
          console.log(msg);
          message = JSON.parse(msg.data); 
        } catch (e) {
          console.error(`Unable to parse incoming message. (${e}))`);
        }
        this.setState((prevState) => ({
          messages: [...prevState.messages, message],
        }))
      },
      handleSocketClose: () => {
        console.log('Connection to message server closed.');
      }
    });
    this.socketsController.connect();
  }

  showBuddyList = () => {
    console.log('trying to show');
    this.setState((prevState) => ({
      showBuddyList: !prevState.showBuddyList,
    }));
  }

  updateOutGoingMessage = (event) => {
    this.setState({
      outgoingMessage: event.target.value,
    });
  }

  sendMessage = () => {
    const outgoing = {
      message: this.state.outgoingMessage,
      sender: this.state.name,
      status: 'sent',
    };
    this.socketsController.socket.send(JSON.stringify(outgoing));
    this.setState((prevState) => ({
      outgoingMessage: '',
      messages: [...prevState.messages, outgoing], 
    }));
  }

  render() {
    return (
      <div className="chatterbot__container">
        <button
          className="chatterbot"
          style={chatterBotLauncherStyle}
          onClick={this.showBuddyList}
        >
          ChatterBot!
        </button>
        <ChatterBotBuddyList>
          <Drawer
            anchor="right"
            open={this.state.showBuddyList}
            onClose={this.showBuddyList}
          >
            <ChatterBotChat
              sendMessage={this.sendMessage}
              updateMessage={this.updateOutGoingMessage}
              outgoingMessage={this.state.outgoingMessage}
              messages={this.state.messages}
              myName={this.state.name}
            />
          </Drawer>
        </ChatterBotBuddyList>
      </div>
    );
  }
}

class ChatterBotBuddyList extends React.Component {
  render() {
    return ReactDOM.createPortal(
      this.props.children,
      document.getElementById('chatter-bot-anchor'),
    );
  }
}

export default ChatterBot;
