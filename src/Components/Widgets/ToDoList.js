/**
 * Todo List Widget
 */
import React, { useState, Fragment, useEffect } from 'react';
import { FormControlLabel, Checkbox, List, ListItem, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Fab} from '@material-ui/core';
import update from 'react-addons-update';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
// api
import api from 'Api';
// intl messages
import IntlMessages from 'Util/IntlMessages';
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

function TodoListWidget() {
   const [toDoListData, setToDoListData] = useState(null);
   const [sectionReload, setSectionReload] = useState(false);
   const [addNewTodoDialog, setAddNewTodoDialog] = useState(false);
   const [newTodo, setNewTodo] = useState({
      todoTitle: '',
      time: null,
      date: ''
   });
   const [snackbar, setSnackbar] = useState(false);
   const [snackbarMessage, setSnackbarMessage] = useState('')

   useEffect(() => {
      getTodo();
   },[])

   // get todo
   const getTodo = () =>  {
      setSectionReload(true);
      api.get('todo.js')
         .then((response) => {
            setToDoListData(response.data);
            setSectionReload(false)
         }).catch(error => {
            setToDoListData(null);
            setSectionReload(false);
         })
   }

   /**
    * On Delete Task
    */
   const onDeleteTask = (e, task) => {
      e.stopPropagation();
      setSectionReload(true);
      let todos = toDoListData;
      let index = todos.indexOf(task);

      setTimeout(() => {
         todos.splice(index, 1);
         setToDoListData(todos);
         setSectionReload(false);
         setSnackbar(true);
         setSnackbarMessage('Todo Deleted Successfully');
      }, 1500);
   }

   // on change task status
   const handleChange = (value, data) => {
      let selectedTodoIndex = toDoListData.indexOf(data);
      let newState = update(toDoListData, {
         [selectedTodoIndex]: {
            completed: { $set: value }
         }
      });
      setSectionReload(true);
      setTimeout(() => {
         setToDoListData(newState);
         setSectionReload(false);
         setSnackbar(true);
         setSnackbarMessage('Todo Updated');
      }, 1500);
   }

   // open add new todo dialog
   const opnAddNewTodoDialog = () => {
      setAddNewTodoDialog(true);
      setNewTodo({
         todoTitle: '',
         time: null,
         date: ''
      });
   }

   // handle close add new todo dailog
   const handleClose = () => {
      setAddNewTodoDialog(false);
   }

   // add new todo
   const addNewTodo = () => {
      if (newTodo.todoTitle !== '' && newTodo.date) {
         let todos = toDoListData;
         let todo
         todo = {
            title: newTodo.todoTitle,
            date: newTodo.date,
            completed: false
         }
         setSectionReload(true);
         setAddNewTodoDialog(false);
         setTimeout(() => {
            todos.push(todo);
            
            setToDoListData(todos);
            setSectionReload(false);
            setSnackbar(true);
            setSnackbarMessage('Todo Added Successfully!');
         }, 1500);
      }
   }

   return (
      <Fragment>
         {sectionReload &&
            <RctSectionLoader />
         }
         <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={420} autoHide>
            <List className="p-0">
               {toDoListData && toDoListData.map((data, key) => (
                  <ListItem className="border-bottom" button key={key} onClick={() => handleChange(!data.completed, data)}>
                     <div className={classnames('d-flex justify-content-between align-items-center w-100', { 'strike': data.completed })}>
                        <div className="d-flex align-items-center clearfix">
                           <div className="float-left">
                              <FormControlLabel
                                 className="mb-0"
                                 control={
                                    <Checkbox
                                       checked={data.completed}
                                       color="primary"
                                       onChange={(event) => handleChange(event.target.checked, data)}
                                    />
                                 }
                              />
                           </div>
                           <div className="float-left">
                              <p className="mb-0">{data.title}</p>
                              {data.date && <span className="d-block fs-12 text-muted">{data.date}</span>}
                           </div>
                        </div>
                        <div className="hover-action">
                           <Fab variant="round" size="small" className="btn-danger text-white"
                              onClick={(e) => onDeleteTask(e, data)}
                           >
                              <i className="zmdi zmdi-delete"></i>
                           </Fab>
                        </div>
                     </div>
                  </ListItem>
               ))}
            </List>
         </Scrollbars>
         <div className="d-flex p-3">
            <Button variant="contained" color="primary" className="text-white" onClick={() => opnAddNewTodoDialog()}><IntlMessages id="widgets.addNew" /></Button>
         </div>
         <Dialog
            open={addNewTodoDialog}
            onClose={handleClose}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
               <IntlMessages id="components.addNewTasks" />
            </DialogTitle>
            <DialogContent>
               <DialogContentText>
                  Add New Todo, Add Todo Title And Select Time For Todo.
                  </DialogContentText>
               <TextField
                  margin="dense"
                  id="name"
                  onChange={(e) => setNewTodo({ ...newTodo, todoTitle: e.target.value})}
                  label="Todo Title"
                  type="text"
                  fullWidth
                  value={newTodo.todoTitle}
               />
               <TextField
                  id="date"
                  label="Schedule Date"
                  type="date"
                  InputLabelProps={{
                     shrink: true
                  }}
                  fullWidth
                  onChange={(e) => setNewTodo({ ...newTodo, date: e.target.value })}
               />
            </DialogContent>
            <DialogActions>
               <Button variant="contained" onClick={handleClose} className="btn-danger text-white">
                  <span><IntlMessages id="button.cancel" /></span>
               </Button>
               <Button variant="contained" onClick={addNewTodo} color="primary" className="text-white">
                  <span><IntlMessages id="button.add" /></span>
               </Button>
            </DialogActions>
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
   )
}

export default TodoListWidget;