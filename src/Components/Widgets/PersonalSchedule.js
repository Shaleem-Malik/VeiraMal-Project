/**
 * Personal Schedule Component
 */
import React, { Fragment, useState, useEffect } from 'react';
import { Media } from 'reactstrap';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Snackbar from '@material-ui/core/Snackbar';
import { Scrollbars } from 'react-custom-scrollbars';
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
// api
import api from 'Api';
//Helper
import { getTheDate, convertDateToTimeStamp } from 'Helpers/helpers';
//rct card component
import { RctCardFooter } from "Components/RctCard";
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
// intl messages
import IntlMessages from 'Util/IntlMessages';

function PersonalSchedule(props) {
   const [sectionReload,setSectionReload] = useState(false);
   const [modal, setModal] = useState(false);
   const [schedulesData, setSchedulesData] = useState(null);
   const [snackbar, setSnackbar] = useState(false);
   const [snackbarMessage, setSanackbarMessage] = useState('');
   const [newSchedule, setNewSchedule] = useState({
      title: '',
      message: '',
      date: null
   });

   useEffect(() => {
      getPersonalSchedules();
   },[])

   /**
    * Get Personal Schedules
    */
   const getPersonalSchedules = () => {
      setSectionReload(true);
      api.get('personalSchedule.js')
         .then((response) => {
            setSchedulesData(response.data);
            setSectionReload(false);
         })
         .catch(error => {
            console.log(error)
         })
   }

   //ADD new Schedule
   const addNewSchedule = () =>  {
      if (newSchedule.title !== '' && newSchedule.date) {
         let schedules = schedulesData;
         let schedule;
         schedule = {
            title: newSchedule.title,
            message: newSchedule.message,
            date: newSchedule.date,
         }
         schedules.push(schedule);
         setSectionReload(true);
         setModal(false);
         setTimeout(() => {
            setSchedulesData(schedules);
            setSectionReload(false);
            setModal(false);
            setSnackbar(true);
            setSanackbarMessage('Schedule Added Successfully!');
            setNewSchedule({
               title: '',
               message: '',
               date: null
            })           
         }, 1500);
      }
   }

   //Open Modal add new Schedule dailog
   const openModal = () => {
      setModal(true)
   }

   // handle close add new Schedule dailog
   const handleClose = () => {
      setModal(false)
   }

   // on change schedule
   const onChangeSchedule = (e) => {
      let timestamp = convertDateToTimeStamp(e.target.value);
      setNewSchedule({ ...newSchedule, date: timestamp });
   }
   return (
      <Fragment>
         {sectionReload && <RctSectionLoader />}
         <div className="personal-schedule-wrap">
            <div className="rct-block-title border-0 d-flex justify-content-between align-items-center">
               <h4 className="mb-0"><IntlMessages id="widgets.personalSchedule" /></h4>
               <Button variant="contained" className="bg-warning text-white btn-xs" onClick={() => openModal()}>
                  <IntlMessages id="widgets.addNew" />
               </Button>
            </div>
            <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={320} autoHide >
               <List className="list-unstyled p-0">
                  {schedulesData !== null && schedulesData.map((schedule, key) => (
                     <ListItem key={key} className="border-bottom border-warning d-flex align-items-center px-20 py-10">
                        <Media>
                           <Media className="text-white bg-warning mr-20 p-10">
                              <h3 className="mb-0">{getTheDate(schedule.date, 'DD')}<span className="d-block fs-14">{getTheDate(schedule.date, 'MMM')}</span></h3>
                           </Media>
                           <Media body>
                              <Media heading>
                                 {schedule.title}
                              </Media>
                              <p className="fs-12 mb-0 text-muted">{schedule.message}</p>
                           </Media>
                        </Media>
                     </ListItem>
                  ))}
               </List>
            </Scrollbars>
            <RctCardFooter customClasses="d-flex border-0 justify-content-between bg-light-yellow rounded-bottom align-items-center">
               <Button variant="contained" className="bg-warning text-white btn-xs">
                  <IntlMessages id="button.viewAll" />
               </Button>
               <p className="fs-12 mb-0 text-base">
                  <span><i className="mr-5 zmdi zmdi-refresh"></i></span>
                  <IntlMessages id="widgets.updated10Minago" />
               </p>
            </RctCardFooter>
         </div>
         <Modal
            isOpen={modal}
         >
            <ModalHeader>
               Add New Schedule
                  </ModalHeader>
            <ModalBody>
               <Form>
                  <FormGroup>
                     <Label for="scheduleTitle">Schedule Title</Label>
                     <Input
                        type="text"
                        name="title"
                        id="scheduleTitle"
                        onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                        value={newSchedule.title}
                     />
                  </FormGroup>
                  <FormGroup>
                     <Label for="scheduleBody">Schedule Body</Label>
                     <Input
                        type="textarea"
                        name="text"
                        id="scheduleBody"
                        onChange={(e) => setNewSchedule({...newSchedule, message: e.target.value })}
                        value={newSchedule.message}
                     />
                  </FormGroup>
                  <FormGroup>
                     <Label for="scheduleDate">Schedule Date</Label>
                     <Input
                        type="date"
                        name="date"
                        id="scheduleDate"
                        onChange={(e) => onChangeSchedule(e)}
                     />
                  </FormGroup>
               </Form>
            </ModalBody>
            <ModalFooter>
               <Button variant="contained" onClick={() => addNewSchedule()} color="primary" className="text-white">
                  <span>Add</span>
               </Button>
               <Button variant="contained" onClick={() => handleClose()} className="btn-danger text-white">
                  <span><IntlMessages id="button.cancel" /></span>
               </Button>
            </ModalFooter>
         </Modal>
         <Snackbar
            anchorOrigin={{
               vertical: 'top',
               horizontal: 'center',
            }}
            open={snackbar}
            onClose={() => setSnackbar(false)}
            autoHideDuration={2000}
            message={<span id="message-id">{snackbarMessage}</span>}
         />
      </Fragment>
   )
}

export default PersonalSchedule;