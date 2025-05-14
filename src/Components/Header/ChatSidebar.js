import React from 'react';
import { List, ListItem, ListItemText, Avatar, AppBar, Toolbar, Typography } from '@material-ui/core';
// data
import users from 'Assets/data/chat-app/users';
// helpers
import { textTruncate } from 'Helpers/helpers';

const ChatSidebar = () => (
   <div className="chat-sidebar rct-customizer">
      <AppBar position="static" color="primary">
         <Toolbar>
            <Typography variant="h5" color="inherit">
               Chat
            </Typography>
         </Toolbar>
      </AppBar>
      <List>
         {users && users.map((user, key) => (
            <ListItem key={key} button className="chat-list-item">
               <Avatar className="mr-2" src={user.photo_url} />
               <ListItemText
                  primary={user.first_name + ' ' + user.last_name}
                  secondary={textTruncate(user.last_chat, 16)}
               />
            </ListItem>
         ))}
      </List>
   </div>
);

export default ChatSidebar;
