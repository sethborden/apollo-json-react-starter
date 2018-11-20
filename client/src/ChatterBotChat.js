import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const chatterBotContainerStyle = {
  margin: '12px',
  width: '302px',
}

const ENTER_KEY = 13;

const ChatterBotChat = (props) => (
  <div
    className="chatter-bot__container"
    style={chatterBotContainerStyle}
  >
    <TextField
      style={{
        width: '100%',
      }}
      label="Outgoing Message"
      placeholder="Enter you outgoing message here"
      multiline
      margin="normal"
      variant="outlined"
      value={props.outgoingMessage}
      onChange={props.updateMessage}
      onKeyDown={(event) => {
        if (event.keyCode === ENTER_KEY && !event.shiftKey) {
          props.sendMessage();
        }
      }}
    />
    <Button
      color="primary"
      onClick={props.sendMessage}
    >
      Send
    </Button>
    <Divider style={{ margin: '12px 0' }}/>
    <List>
      {
        props.messages.map((item, idx) => {
          const isSelf = item.sender === props.myName;
          return(
            <ListItem
              key={idx}
              style={{
                textAlign: isSelf ? 'right' : 'left',
                borderRadius: '5px',
                border: `1px solid ${isSelf ? 'green' : 'red'}`,
                background: `linear-gradient(${isSelf ? 'green' : 'grey'}80%, ${isSelf ? 'lightgreen' : 'lightgrey'}90%, white)`,
                margin: '12px 0',
              }}
            >
              <ListItemText
                primary={item.message}
                secondary={item.sender}
              />
            </ListItem>
          )
        })
      }
    </List>
  </div>
);

export default ChatterBotChat;
