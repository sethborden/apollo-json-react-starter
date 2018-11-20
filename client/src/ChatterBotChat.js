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
        props.messages.map((item, idx) => (
          <ListItem key={idx}>
            <ListItemText
              style={{
                textAlign: item.sender === props.myName ? 'right' : 'left',
              }}
              primary={item.message}
              secondary={item.sender}
            />
          </ListItem>
        ))
      }
    </List>
  </div>
);

export default ChatterBotChat;
