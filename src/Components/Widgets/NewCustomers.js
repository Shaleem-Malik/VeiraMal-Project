/**
 * New Customers Widget
 */
import React, { useState, Fragment, useEffect, useRef } from 'react';
import update from 'react-addons-update';
import {
   Modal,
   ModalHeader,
   ModalBody,
   ModalFooter,
   Form,
   FormGroup,
   Label,
   Input
} from 'reactstrap';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Avatar from '@material-ui/core/Avatar';
import { Scrollbars } from 'react-custom-scrollbars';
// api
import api from 'Api';
// intl messages
import IntlMessages from 'Util/IntlMessages';
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

function NewCustomers(props) {
   const deleteConfirmationDialogRef = useRef();
   const [sectionReload, setSectionReload] = useState(false);
   const [newCustomers, setNewCustomers] = useState(null);
   const [selectedDeletedCustomer, setSelectedDeletedCustomer] = useState(null);
   const [editCustomerModal, setEditCustomerModal] = useState(false);
   const [editCustomer, setEditCustomer] = useState(null);
   const [snackbar, setSnackbar] = useState(false);
   const [successMessage, setSuccessMessage] = useState('');
   const [addNewCustomerForm, setAddNewCustomerForm] = useState(false);
   const [addNewCustomerDetails, setAddNewCustomerDetails] = useState({
      customer_email: '',
      customer_name: '',
      id: '',
      photo_url: ''
   });

   useEffect(() => {
      getNewCustomers();
   },[])

   // get new customers
   const getNewCustomers = () => {
      setSectionReload(true);
      api.get('newCustomers.js')
         .then((response) => {
            setNewCustomers(response.data);
            setSectionReload(false);
         })
         .catch(error => {
            setNewCustomers(null);
            setSectionReload(false);
         })
   }

   // on delete customer
   const onDeleteCustomer = (customer) =>  {
      deleteConfirmationDialogRef.current.open();
      setSelectedDeletedCustomer(customer);
   }

   // delete customer
   const deleteCustomer = () => {
      deleteConfirmationDialogRef.current.close();
      setSectionReload(true)
      let customers = newCustomers;
      let index = customers.indexOf(selectedDeletedCustomer);
      setTimeout(() => {
         customers.splice(index, 1);
         setNewCustomers(customers);
         setSectionReload(false);
         setSnackbar(true);
         setSuccessMessage('Customer Deleted Successfully');
      }, 1500);
   }

   // edit customer
   const onEditCustomer = (customer) => {
      setEditCustomerModal(true);
      setEditCustomer(customer);
      setAddNewCustomerForm(false);
   }

   // toggle edit customer modal
   const toggleEditCustomerModal = () => {
      setEditCustomerModal(!editCustomerModal);
   }

   // submit customer edit form
   const onSubmitCustomerEditDetailForm = () => {
      if (editCustomer.customer_name !== '' && editCustomer.customer_email !== ''){
         setEditCustomer(false);
         setSectionReload(true);
         let indexOfCustomer;
         for (let i = 0; i < newCustomers.length; i++) {
            const customer = newCustomers[i];
            if (customer.customer_id === editCustomer.customer_id) {
               indexOfCustomer = i;
            }
         }
         setTimeout(() => {
            setSectionReload(false);
            setSnackbar(true);
            setEditCustomerModal(false);
            setSuccessMessage('Customer Updated Success');
            setNewCustomers(update(newCustomers,
               {
                  [indexOfCustomer]: { $set: editCustomer }
               }
            ))
         }, 1500);
      }
   }

   // on change customer details
   const onChangeCustomerDetails = (key, value) => {
      setEditCustomer({
         ...editCustomer,
         [key]: value
      })
   }

   // add new customer
   const addNewCustomer = () => {
      setEditCustomerModal(true);
      setAddNewCustomerForm(true);
      setEditCustomer(null);
      setAddNewCustomerDetails({
         customer_email: '',
         customer_name: '',
         id: '',
         photo_url: ''
      });
   }

   // on change customer add new form value
   const onChangeCustomerAddNewForm = (key, value) => {
      setAddNewCustomerDetails({
         ...addNewCustomerDetails,
         [key]: value
      })
   }

   // on submit add new customer form
   const onSubmitAddNewCustomerForm = () =>  {
      if (addNewCustomerDetails.customer_name !== '' && addNewCustomerDetails.customer_email !== ''){
         setEditCustomerModal(false);
         setSectionReload(true);
        
         let newCustomer = addNewCustomerDetails;
            newCustomer.id = new Date();
            newCustomer.photo_url = '';
         let newAllCustomers = newCustomers;
         setTimeout(() => {
            newAllCustomers.push(newCustomer);
            setNewCustomers(newAllCustomers);
            setSectionReload(false);
            setSnackbar(true);
            setSuccessMessage('Customer Added Successfully');
         }, 1500);
      }
   }

   return (
      <Fragment>
         {sectionReload &&
            <RctSectionLoader />
         }
         <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={290} autoHide>
            <ul className="list-group new-customer-list">
               {newCustomers && newCustomers.map((customer, key) => (
                  <li className="list-group-item d-flex justify-content-between" key={key}>
                     <div className="d-flex align-items-start">
                        <div className="media">
                           <div className="media-left mr-15">
                              {customer.photo_url === '' ?
                                 <Avatar>{customer.customer_name.charAt(0)}</Avatar>
                                 : <img src={customer.photo_url} alt="project logo" className="media-object rounded-circle" width="40" height="40" />
                              }
                           </div>
                           <div className="media-body">
                              <span className="d-block fs-14">{customer.customer_name}</span>
                              <span className="d-block fs-12 text-muted">{customer.customer_email}</span>
                           </div>
                        </div>
                     </div>
                     <div className="d-flex align-items-end">
                        <button type="button" className="text-primary" onClick={() => onEditCustomer(customer)}>
                           <i className="zmdi zmdi-edit"></i>
                        </button>
                        <button type="button" className="text-danger" onClick={() => onDeleteCustomer(customer)}>
                           <i className="zmdi zmdi-close"></i>
                        </button>
                     </div>
                  </li>
               ))}
            </ul>
         </Scrollbars>
         <div className="d-flex p-3">
            <Button variant="contained" color="primary" className="text-white" onClick={() => addNewCustomer()}><IntlMessages id="widgets.addNew" /></Button>
         </div>
         {/* Delete Customer Confirmation Dialog */}
         <DeleteConfirmationDialog
            ref={deleteConfirmationDialogRef}
            title="Are You Sure Want To Delete?"
            message="Are You Sure Want To Delete Permanently This Customer."
            onConfirm={() => deleteCustomer()}
         />
         {/* Customer Edit Modal*/}
         {editCustomerModal &&
            <Modal
               isOpen={editCustomerModal}
               toggle={toggleEditCustomerModal}
            >
               <ModalHeader toggle={toggleEditCustomerModal}>
                  {addNewCustomerForm ? 'Add New Customer' : 'Edit Customer'}
               </ModalHeader>
               <ModalBody>
                  {addNewCustomerForm ?
                     <Form>
                        <FormGroup>
                           <Label for="customerName">Name</Label>
                           <Input
                              type="text"
                              name="name"
                              id="customerName"
                              value={addNewCustomerDetails.customer_name}
                              onChange={(e) => onChangeCustomerAddNewForm('customer_name', e.target.value)}
                           />
                        </FormGroup>
                        <FormGroup>
                           <Label for="customerEmail">Email</Label>
                           <Input
                              type="email"
                              name="email"
                              id="customerEmail"
                              value={addNewCustomerDetails.customer_email}
                              onChange={(e) => onChangeCustomerAddNewForm('customer_email', e.target.value)}
                           />
                        </FormGroup>
                     </Form>
                     : <Form>
                        <FormGroup>
                           <Label for="customerId">Id</Label>
                           <Input
                              type="text"
                              name="name"
                              id="customerId"
                              defaultValue={editCustomer.customer_id}
                              readOnly
                           />
                        </FormGroup>
                        <FormGroup>
                           <Label for="customerName">Name</Label>
                           <Input
                              type="text"
                              name="name"
                              id="customerName"
                              value={editCustomer.customer_name}
                              onChange={(e) => onChangeCustomerDetails('customer_name', e.target.value)}
                           />
                        </FormGroup>
                        <FormGroup>
                           <Label for="customerEmail">Email</Label>
                           <Input
                              type="email"
                              name="email"
                              id="customerEmail"
                              value={editCustomer.customer_email}
                              onChange={(e) => onChangeCustomerDetails('customer_email', e.target.value)}
                           />
                        </FormGroup>
                     </Form>
                  }
               </ModalBody>
               <ModalFooter>
                  {addNewCustomerForm ?
                     <div>
                        <Button variant="contained" color="primary" className="text-white" onClick={() => onSubmitAddNewCustomerForm()}><IntlMessages id="button.add" /></Button>{' '}
                        <Button variant="contained" className="btn-danger text-white" onClick={toggleEditCustomerModal}><IntlMessages id="button.cancel" /></Button>
                     </div>
                     : <div><Button variant="contained" color="primary" className="text-white" onClick={() => onSubmitCustomerEditDetailForm()}><IntlMessages id="button.update" /></Button>{' '}
                        <Button variant="contained" className="btn-danger text-white" onClick={toggleEditCustomerModal}><IntlMessages id="button.cancel" /></Button></div>
                  }
               </ModalFooter>
            </Modal>
         }
         <Snackbar
            anchorOrigin={{
               vertical: 'top',
               horizontal: 'center',
            }}
            open={snackbar}
            onClose={() => setSnackbar(false)}
            autoHideDuration={2000}
            message={<span id="message-id">{successMessage}</span>}
         />
      </Fragment>
   );
}

export default NewCustomers;
