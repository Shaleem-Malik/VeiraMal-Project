/**
 * Notifications Widget
 */
import React, { useState, useEffect, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Scrollbars } from 'react-custom-scrollbars';
import Typography from '@material-ui/core/Typography';

// api
import api from 'Api';

// intl messages
import IntlMessages from 'Util/IntlMessages';

function TabContainer({ children, dir }) {
   return (
      <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
         {children}
      </Typography>
   );
}

function Notifications(props) {
   const [value, setValue] = useState(0);
   const [messages, setMessages] = useState(null);
   const [notificationTypes, setNotificationTypes] = useState(null);
   const [notifications, setNotifications] = useState(null);

   useEffect(() => {
      getMessages();
      getNotificationTypes();
      getNotifications();
   },[]);

   // get messages
   const getMessages = () => {
      api.get('messages.js')
         .then((response) => {
            setMessages(response.data);
         })
         .catch(error => {
            console.log(error);
         })
   }

   // get notification types
   const getNotificationTypes = () => {
      api.get('notificationTypes.js')
         .then((response) => {
            setNotificationTypes(response.data);
         })
         .catch(error => {
            console.log(error);
         })
   }

   // get notifications
   const getNotifications = () => {
      api.get('notifications.js')
         .then((response) => {
            setNotifications(response.data);
         })
         .catch(error => {
            console.log(error);
         })
   }

   const handleChange = (event, value) => {
      setValue(value);
   };

   const handleChangeIndex = index => {
      setValue(index);
   };

   /**
    * Function to return notification name
    */
   const getNotificationName = (notificationId) => {
      if (notificationTypes) {
         for (const notificationType of notificationTypes) {
            if (notificationId === notificationType.id) {
               return (
                  <span className={`text-${notificationType.class} mr-5`}>
                     <i className={`zmdi zmdi-${notificationType.icon}`}></i> {notificationType.Name}
                  </span>
               );
            }
         }
      }
   }

   const { theme } = props;
   return (
      <Fragment>
         <AppBar position="static" color="default">
            <Tabs
               value={value}
               onChange={handleChange}
               indicatorColor="primary"
               textColor="primary"
               variant="fullWidth"
            >
               <Tab label={<IntlMessages id="widgets.recentNotifications" />} />
               <Tab label={<IntlMessages id="widgets.messages" />} />
            </Tabs>
         </AppBar>
         <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={375} autoHide>
            <SwipeableViews
               axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
               index={value}
               onChangeIndex={handleChangeIndex}>
               <div className="card mb-0 notification-box">
                  <TabContainer dir={theme.direction}>
                     <ul className="list-inline mb-0">
                        {notifications && notifications.map((notification, key) => (
                           <li className="d-flex justify-content-between" key={key}>
                              <div className="align-items-start">
                                 <p className="mb-5 message-head">
                                    {getNotificationName(notification.notificationId)}
                                    {notification.date}
                                 </p>
                                 <h5 className="mb-5">{notification.userName}</h5>
                                 <p className="mb-0 text-muted">{notification.notification}</p>
                              </div>
                              <div className="align-items-end notify-user">
                                 <img src={notification.userAvatar} alt="notify user" className="rounded-circle" width="50" height="50" />
                              </div>
                           </li>
                        ))}
                     </ul>
                  </TabContainer>
               </div>
               <div className="card mb-0 notification-box">
                  <TabContainer dir={theme.direction}>
                     <ul className="list-inline mb-0">
                        {messages && messages.map((message, key) => (
                           <li className="d-flex justify-content-between" key={key}>
                              <div className="align-items-start">
                                 <p className="mb-5 message-head">
                                    <span className="text-primary mr-5">
                                       <i className="zmdi zmdi-comment-alt-text"></i> <IntlMessages id="widgets.messages" /></span> {message.date}
                                 </p>
                                 <h5 className="mb-5">{message.from.userName}</h5>
                                 <p className="mb-0 text-muted">{message.message}</p>
                              </div>
                              <div className="align-items-end notify-user">
                                 <img src={message.from.userAvatar} alt="notify user" className="rounded-circle" width="50" height="50" />
                              </div>
                           </li>
                        ))}
                     </ul>
                  </TabContainer>
               </div>
            </SwipeableViews>
         </Scrollbars>
      </Fragment>
   );
}

export default withStyles(null, { withTheme: true })(Notifications);
