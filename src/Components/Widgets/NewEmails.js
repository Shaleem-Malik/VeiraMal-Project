/**
 * New Emails Widget
 */
import React, { useEffect, Fragment, useState } from 'react';
import { Media } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import update from 'react-addons-update';
import { Scrollbars } from 'react-custom-scrollbars';
import Avatar from '@material-ui/core/Avatar';
import { withRouter } from 'react-router-dom';
// api
import api from 'Api';
// intl messages
import IntlMessages from 'Util/IntlMessages';
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { Fab } from '@material-ui/core';

function NewEmails(props) {
   const [sectionReload, setSectionReload] = useState(false);
   const [newEmails, setNewEmails] = useState(null);
   const [openConfirmationAlert, setOpenConfirmationAlert] = useState(false);
   const [selectedDeletedEmail, setSelectedDeletedEmail] = useState(null);
   const [snackbar, setSnackbar] = useState(false);
   const [snackbarMessage, setSnackbarMessage] = useState('');
   const [selectedEmail, setSelectedEmail] = useState(null);
   const [viewEmailDialog, setViewEmailDialog] = useState(false);

   useEffect(() => {
      api.get('newEmails.js')
         .then((response) => {
            setNewEmails(response.data);
         })
         .catch(error => {
            console.log(error);
         })
   },[])
   

   // on delete email open confirmation
   const onDeleteEmail = (email) => {
      setOpenConfirmationAlert(true);
      setSelectedDeletedEmail(email);
   }

   // close confirmation dailog
   const handleCloseConfirmationAlert = () => {
      setOpenConfirmationAlert(false);
      setViewEmailDialog(false);
   }

   // delete email if confirmation true
   const deleteEmail = () => {
      let emails = newEmails;
      let deletedEmailIndex = emails.indexOf(selectedDeletedEmail);
      emails.splice(deletedEmailIndex, 1);
      setTimeout(() => {
         setSectionReload(false);
         setNewEmails(emails);
         setOpenConfirmationAlert(false);
         setSnackbar(true);
         setSnackbarMessage('Email Deleted Successfully!');
      }, 1500);
   }

   // show reply text box
   const showReplyTextBox = (email) =>  {
      let indexOfEmail = newEmails.indexOf(email);
      setNewEmails(update(newEmails,
         {
            [indexOfEmail]: {
               replyTextBox: { $set: true }
            }
         }
      ));
   }

   // reply email
   const replyEmail = (email) => {
      let indexOfEmail = newEmails.indexOf(email);
      setSectionReload(true);
      setNewEmails(update(newEmails,
         {
            [indexOfEmail]: {
               replyTextBox: { $set: false }
            }
         }
      ));
      setTimeout(() => {
         setSectionReload(false);
         setSnackbar(true);
         setSnackbarMessage('Reply Sent Successfully!');
      }, 1500);
   }

   /**
    * On View Email
    */
   const onViewEmal = (email) => {
      setSelectedEmail(email);
      setViewEmailDialog(true);
   }


   return (
      <Fragment>
         {sectionReload &&
            <RctSectionLoader />
         }
         <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={400} autoHide>
            <ul className="new-mail mb-0 list-unstyled">
               {newEmails && newEmails.map((email, key) => (
                  <li key={key}>
                     <div className="d-flex justify-content-between">
                        <Media className="mb-10">
                           {email.sender_avatar === '' ?
                              <Avatar className="mr-15">{email.sender_name.charAt(0)}</Avatar>
                              : <Media object src={email.sender_avatar} alt="User Profile 1" className="rounded-circle mr-15" width="40" height="40" />
                           }
                           <Media body>
                              <h5 className="m-0 pt-5 fs-14">{email.sender_name}</h5>
                              <span className="fs-12 align-self-center">{email.from}</span>
                           </Media>
                        </Media>
                        <span className="small align-self-center">19 Mar 2017</span>
                     </div>
                     <div className="d-flex justify-content-between">
                        <div className="text-justify">
                           <p className="subject">{email.subject}</p>
                           <p className="message">{email.message}</p>
                           {email.replyTextBox &&
                              <div className="task-foot d-flex justify-content-between">
                                 <InputGroup>
                                    <Input />
                                    <InputGroupAddon addonType="append">
                                       <Button variant="contained" color="primary" className="text-white" onClick={() => replyEmail(email)}>
                                          <IntlMessages id="button.reply" />
                                       </Button>
                                    </InputGroupAddon>
                                 </InputGroup>
                              </div>
                           }
                        </div>
                        <div className="hover-action text-right w-25 align-self-center">
                           <Fab variant="round" size="small" color="primary" className="text-white mr-5 mb-5"
                              onClick={() => onViewEmal(email)}
                           >
                              <i className="zmdi zmdi-eye"></i>
                           </Fab>
                           <Fab variant="round" size="small" className="btn-danger text-white mr-5 mb-5"
                              onClick={() => onDeleteEmail(email)}
                           >
                              <i className="zmdi zmdi-delete"></i>
                           </Fab>
                           <Fab variant="round" size="small" className="btn-success text-white mr-5 mb-5"
                              onClick={() => showReplyTextBox(email)}
                           >
                              <i className="zmdi zmdi-mail-reply"></i>
                           </Fab>
                        </div>
                     </div>
                  </li>
               ))}
            </ul>
         </Scrollbars>
         <Dialog
            open={openConfirmationAlert}
            onClose={handleCloseConfirmationAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
            <DialogTitle id="alert-dialog-title">{"Are You Sure Want To Delete?"}</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  This will delete the email permanently from your emails.
         </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button variant="contained" className="btn-danger text-white" onClick={handleCloseConfirmationAlert}>
                  <IntlMessages id="button.cancel" />
               </Button>
               <Button variant="contained" color="primary" className="text-white" onClick={() => deleteEmail()}>
                  <IntlMessages id="button.delete" />
               </Button>
            </DialogActions>
         </Dialog>
         <Dialog
            open={viewEmailDialog}
            onClose={handleCloseConfirmationAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
            <DialogContent>
               {selectedEmail !== null &&
                  <div>
                     <div className="d-flex justify-content-between">
                        <Media className="mb-10">
                           {selectedEmail.sender_avatar === '' ?
                              <Avatar className="mr-15">{selectedEmail.sender_name.charAt(0)}</Avatar>
                              : <Media object src={selectedEmail.sender_avatar} alt="User Profile 1" className="rounded-circle mr-15" width="40" height="40" />
                           }
                           <Media body>
                              <h5 className="m-0 pt-5 fs-14">{selectedEmail.sender_name}</h5>
                              <span className="fs-12 align-self-center">{selectedEmail.from}</span>
                           </Media>
                        </Media>
                        <span className="small align-self-center">19 Mar 2017</span>
                     </div>
                     <div className="d-flex justify-content-between">
                        <div className="text-justify">
                           <p className="subject">{selectedEmail.subject}</p>
                           <p className="message">{selectedEmail.message}</p>
                        </div>
                     </div>
                  </div>
               }
            </DialogContent>
         </Dialog>
         <Snackbar
            anchorOrigin={{
               vertical: 'top',
               horizontal: 'center',
            }}
            open={snackbar}
            onClose={() => setSnackbar(false)}
            autoHideDuration={2000}
            snackbarcontentprops={{
               'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{snackbarMessage}</span>}
         />
      </Fragment>
   );
}

export default withRouter(NewEmails);
