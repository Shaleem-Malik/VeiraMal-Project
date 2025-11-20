/**
 * Signin Firebase
 */

import React, { useState } from 'react';
import { useDispatch, useSelector  } from 'react-redux';
import { Button, AppBar, Toolbar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import { Helmet } from "react-helmet";

// import { Fab } from "@material-ui/core";

// components
// import { SessionSlider } from 'Components/Widgets';

// app config
import AppConfig from 'Constants/AppConfig';

// redux action
import {
   signinUserInFirebase
} from 'Store/Actions';

//Auth File
// import Auth from 'Auth/Auth';

// const auth = new Auth();

function Signin(props) {

   const [email, setEmail] = useState('mujahidnawaz686@gmail.com');
   const [password, setPassword] = useState('mujahidnawaz');
   const dispatch = useDispatch();
   const loading = useSelector(state => state.loading);

	/**
	 * On User Login
	 */
   const onUserLogin = () => {
      if (email !== '' && password !== '') {
         dispatch(signinUserInFirebase({email,password}, props.history));
      }
   }

	/**
	 * On User Sign Up
	 */
   const onUserSignUp = () =>  {
      props.history.push('/signup');
   }

   //Auth0 Login
   // const loginAuth0 = () => {
   //    auth.login();
   // }

   const onForgotPassword = (e) => {
     e && e.preventDefault();
     if (props.history && typeof props.history.push === 'function') {
       props.history.push('/forgot-password');
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
                              {/* <img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35" /> */}
                              <h1 className='font-weight-bold text-dark'>HR Analytix</h1>
                           </Link>
                        </div>
                        <div>
                           <a href="!#" className="mr-15 text-dark" onClick={onUserSignUp}>Create New account?</a>
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
                           <Form>
                              <FormGroup className="has-wrapper">
                                 <Input
                                    type="mail"
                                    value={email}
                                    name="user-mail"
                                    id="user-mail"
                                    className="has-input input-lg"
                                    placeholder="Enter Email Address"
                                    onChange={(event) => setEmail(event.target.value)}
                                 />
                                 <span className="has-icon"><i className="ti-email"></i></span>
                              </FormGroup>
                              <FormGroup className="has-wrapper">
                                 <Input
                                    value={password}
                                    type="Password"
                                    name="user-pwd"
                                    id="pwd"
                                    className="has-input input-lg"
                                    placeholder="Password"
                                    onChange={(event) => setPassword(event.target.value)}
                                 />
                                 <span className="has-icon"><i className="ti-lock"></i></span>
                              </FormGroup>

                              {/* ADD: Forgot password link */}
                              <div style={{ textAlign: 'right', marginBottom: 12 }}>
                                {/* Using Link for client-side routing; also keep handler for consistency */}
                                <Link to="/forgot-password" onClick={onForgotPassword} className="text-dark" style={{ textDecoration: 'none' }}>
                                  Forgot password?
                                </Link>
                              </div>

                              <FormGroup className="mb-15">
                                 <Button
                                    color="primary"
                                    className="btn-block text-white w-100"
                                    variant="contained"
                                    size="large"
                                    onClick={onUserLogin}
                                 >
                                    Sign In
                                 </Button>
                              </FormGroup>
                              {/* <FormGroup className="mb-15">
                                 <Button
                                    variant="contained"
                                    className="btn-info btn-block text-white w-100"
                                    size="large"
                                    onClick={loginAuth0}
                                 >
                                    Sign In With Auth0
                                 </Button>
                              </FormGroup> */}
                           </Form>
                           {/* <p className="mb-20">or sign in with</p>
                           <Fab size="small" variant="round" className="btn-facebook mr-15 mb-20 text-white"
                              onClick={() => dispatch(signinUserWithFacebook(props.history))}
                           >
                              <i className="zmdi zmdi-facebook"></i>
                           </Fab>
                           <Fab size="small" variant="round" className="btn-google mr-15 mb-20 text-white"
                              onClick={() => dispatch(signinUserWithGoogle(props.history))}
                           >
                              <i className="zmdi zmdi-google"></i>
                           </Fab>
                           <Fab size="small" variant="round" className="btn-twitter mr-15 mb-20 text-white"
                              onClick={() => dispatch(signinUserWithTwitter(props.history))}
                           >
                              <i className="zmdi zmdi-twitter"></i>
                           </Fab>
                           <Fab size="small" variant="round" className="btn-instagram mr-15 mb-20 text-white"
                              onClick={() => dispatch(signinUserWithGithub(props.history))}
                           >
                              <i className="zmdi zmdi-github-alt"></i>
                           </Fab> */}
                           <p className="text-muted">By signing up you agree to {AppConfig.brandName}</p>
                           <p className="mb-0"><a target="_blank" href="#/terms-condition" className="text-muted" rel="noreferrer">Terms of Service</a></p>
                        </div>
                     </div>
                     {/* <div className="col-sm-5 col-md-5 col-lg-4">
                        <SessionSlider />
                     </div> */}
                  </div>
               </div>
            </div>
         </div>
      </QueueAnim>
   );
}

export default Signin;
