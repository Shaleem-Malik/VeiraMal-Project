/**
 * Delete Confirmation Dialog
 */
import React, { Component } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@material-ui/core';

class DeleteConfirmationDialog extends Component {

   state = {
      open: false
   }

   // open dialog
   open() {
      this.setState({ open: true });
   }

   // close dialog
   close() {
      this.setState({ open: false });
   }

   render() {
      const { title, message, onConfirm } = this.props;
      return (
         <Dialog
            open={this.state.open}
            onClose={() => this.close()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  {message}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={() => this.close()} className="btn-danger text-white">
                  Cancel
               </Button>
               <Button onClick={onConfirm} className="btn-primary text-white" autoFocus>
                  Yes
               </Button>
            </DialogActions>
         </Dialog>
      );
   }
}

export default DeleteConfirmationDialog;
