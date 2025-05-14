/**
 * Sign Up With Firebase
 */
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import { Fab } from '@material-ui/core';
// components
import { SessionSlider } from 'Components/Widgets';
// app config
import AppConfig from 'Constants/AppConfig';
// redux action
import {
   signupUserInFirebase,
   signinUserWithFacebook,
   signinUserWithGoogle,
   signinUserWithGithub,
   signinUserWithTwitter
} from 'Store/Actions';

function SignupFirebase(props){
   const [name, setName] = useState();
   const [email, setEmail] = useState();
   const [password, setPassword] = useState();
   const dispatch = useDispatch();
   const loading = useSelector(state => state.loading);

	/**
	 * On User Signup
	 */
   const onUserSignUp = () => {
      if (email !== '' && password !== '') {
         dispatch(signupUserInFirebase({ email, password }, props.history));
      }
   }

   return (
      <QueueAnim type="bottom" duration={2000}>
         <div className="rct-session-wrapper">
            {loading &&
               <LinearProgress />
            }
            <AppBar position="static" className="session-header">
               <Toolbar>
                  <div className="container">
                     <div className="d-flex justify-content-between">
                        <div className="session-logo">
                           <Link to="/">
                              <img src={AppConfig.appLogo} alt="session-logo" width="110" height="35" />
                           </Link>
                        </div>
                        <div>
                           <Link to="/signin" className="mr-15 text-white">Already have an account?</Link>
                           <Button
                              component={Link}
                              to="/signin"
                              variant="contained"
                              className="btn-light"
                           >
                              Sign In
                           </Button>
                        </div>
                     </div>
                  </div>
               </Toolbar>
            </AppBar>
            <div className="session-inner-wrapper">
               <div className="container">
                  <div className="row row-eq-height">
                     <div className="col-sm-7 col-md-7 col-lg-8">
                        <div className="session-body text-center">
                           <div className="session-head mb-15">
                              <h2>Get started with {AppConfig.brandName}</h2>
                           </div>
                           <Form>
                              <FormGroup className="has-wrapper">
                                 <Input
                                    type="text"
                                    value={name}
                                    name="user-name"
                                    id="user-name"
                                    className="has-input input-lg"
                                    placeholder="Enter Your Name"
                                    onChange={(e) => setName(e.target.value)}
                                 />
                                 <span className="has-icon"><i className="ti-user"></i></span>
                              </FormGroup>
                              <FormGroup className="has-wrapper">
                                 <Input
                                    type="mail"
                                    value={email}
                                    name="user-mail"
                                    id="user-mail"
                                    className="has-input input-lg"
                                    placeholder="Enter Email Address"
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    onChange={(e) => setPassword(e.target.value)}
                                 />
                                 <span className="has-icon"><i className="ti-lock"></i></span>
                              </FormGroup>
                              <FormGroup className="mb-15">
                                 <Button
                                    className="btn-info text-white btn-block w-100"
                                    variant="contained"
                                    size="large"
                                    onClick={onUserSignUp}>
                                    Sign Up
                                 </Button>
                              </FormGroup>
                           </Form>
                           <p className="mb-20">or sign in with</p>
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
                           </Fab>
                           <p className="text-muted">By signing up you agree to {AppConfig.brandName}</p>
                           <p><Link to="/terms-condition" className="text-muted">Terms of Service</Link></p>
                        </div>
                     </div>
                     <div className="col-sm-5 col-md-5 col-lg-4">
                        <SessionSlider />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </QueueAnim>
   );
}

export default SignupFirebase;
