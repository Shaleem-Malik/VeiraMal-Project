/**
 * Signin Firebase
 */

import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector  } from 'react-redux';
import { Button, AppBar, Toolbar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import { Helmet } from "react-helmet";

// redux action
import {
   signinUserInFirebase
} from 'Store/Actions';

function Signin(props) {

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [formErrors, setFormErrors] = useState({});
   const formRef = useRef(null);
   const dispatch = useDispatch();
   const loading = useSelector(state => state.loading);

   // Handle Enter key press
   useEffect(() => {
      const handleKeyPress = (event) => {
         if (event.key === 'Enter') {
            event.preventDefault();
            onUserLogin();
         }
      };

      // Add event listener to form
      const form = formRef.current;
      if (form) {
         form.addEventListener('keypress', handleKeyPress);
      }

      // Clean up
      return () => {
         if (form) {
            form.removeEventListener('keypress', handleKeyPress);
         }
      };
   }, [email, password]); // Re-run when email or password changes

   // Validate form
   const validateForm = () => {
      const errors = {};
      
      if (!email) {
         errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
         errors.email = 'Email is invalid';
      }
      
      if (!password) {
         errors.password = 'Password is required';
      } else if (password.length < 6) {
         errors.password = 'Password must be at least 6 characters';
      }
      
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
   };

   /**
    * On User Login
    */
   const onUserLogin = (e) => {
      if (e) e.preventDefault();
      
      if (validateForm()) {
         dispatch(signinUserInFirebase({email,password}, props.history));
      }
   }

   /**
    * On User Sign Up
    */
   const onUserSignUp = () =>  {
      props.history.push('/signup');
   }

   const onForgotPassword = (e) => {
      e && e.preventDefault();
      if (props.history && typeof props.history.push === 'function') {
         props.history.push('/forgot-password');
      }
   };

   // Handle Enter key in input fields
   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
         e.preventDefault();
         onUserLogin();
      }
   };

   return (
      <QueueAnim type="bottom" duration={2000}>
         <Helmet>
            <title>Signin</title>
         </Helmet>
         <div className="rct-session-wrapper" key="reset">

            {loading &&
               <LinearProgress />
            }
            <AppBar position="static" className="session-header">
               <Toolbar>
                  <div className="container">
                     <div className="d-flex justify-content-between">
                        <div className="session-logo">
                           <Link to="/">
                              <h1 className='font-weight-bold text-dark'>HR Analytix</h1>
                           </Link>
                        </div>
                        <div>
                           <a href="#!" className="mr-15 text-dark" onClick={(e) => { e.preventDefault(); onUserSignUp(); }}>Create New account?</a>
                           <Button variant="contained" className="btn-light" onClick={onUserSignUp}>Sign Up</Button>
                        </div>
                     </div>
                  </div>
               </Toolbar>
            </AppBar>
            <div
               className="session-inner-wrapper"
               style={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 'calc(100vh - 330px)'
               }}
            >
               <div className="container">
                  <div className="row row-eq-height justify-content-center">
                     <div className="col-sm-7 col-md-7 col-lg-8">
                        <div className="session-body text-center shadow">
                           <div className="session-head mb-30">
                              <h2 className="font-weight-bold">HR Analytix Portal</h2>
                              <p className="mb-0">Most powerful HR Analysis Software</p>
                           </div>
                           {/* Form with onSubmit handler */}
                           <Form 
                              onSubmit={onUserLogin} 
                              innerRef={formRef}
                           >
                              <FormGroup className="has-wrapper">
                                 <Input
                                    type="email"
                                    value={email}
                                    name="user-mail"
                                    id="user-mail"
                                    className="has-input input-lg"
                                    placeholder="Enter Email Address"
                                    onChange={(event) => setEmail(event.target.value)}
                                    onKeyDown={handleKeyDown}
                                    invalid={formErrors.email}
                                 />
                                 <span className="has-icon"><i className="ti-email"></i></span>
                                 {formErrors.email && (
                                    <div className="text-danger text-left mt-1 small">
                                       {formErrors.email}
                                    </div>
                                 )}
                              </FormGroup>
                              <FormGroup className="has-wrapper">
                                 <Input
                                    value={password}
                                    type="password"
                                    name="user-pwd"
                                    id="pwd"
                                    className="has-input input-lg"
                                    placeholder="Password"
                                    onChange={(event) => setPassword(event.target.value)}
                                    onKeyDown={handleKeyDown}
                                    invalid={formErrors.password}
                                 />
                                 <span className="has-icon"><i className="ti-lock"></i></span>
                                 {formErrors.password && (
                                    <div className="text-danger text-left mt-1 small">
                                       {formErrors.password}
                                    </div>
                                 )}
                              </FormGroup>

                              <div style={{ textAlign: 'right', marginBottom: 12 }}>
                                 <Link to="/forgot-password" onClick={onForgotPassword} className="text-dark" style={{ textDecoration: 'none' }}>
                                    Forgot password?
                                 </Link>
                              </div>

                              <FormGroup className="mb-15">
                                 <Button
                                    type="submit"
                                    color="primary"
                                    className="btn-block text-white w-100"
                                    variant="contained"
                                    size="large"
                                    // onClick handler removed since we're using form onSubmit
                                 >
                                    Sign In
                                 </Button>
                              </FormGroup>
                           </Form>
                           <p className="text-muted">By signing up you agree to HR Analytix</p>
                           <p className="mb-0"><a target="_blank" href="#/terms-condition" className="text-muted" rel="noreferrer">Terms of Service</a></p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </QueueAnim>
   );
}

export default Signin;