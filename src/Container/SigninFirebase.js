/**
 * Signin Page - VeiraMal HR Portal
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, AppBar, Toolbar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import { login } from '../Api';

// Config
import AppConfig from 'Constants/AppConfig';

function Signin(props) {
   const [email, setEmail] = useState('shaleem.malik@veiramal.com');
   const [password, setPassword] = useState('SecurePassword123');
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading);

const onUserLogin = async () => {
  if (email && password) {
    try {
      const result = await login(email, password);
      console.log("Token received:", result.token); // ✅ See what comes back
      localStorage.setItem('token', result.token);
      props.history.push('/app/dashboard/ecommerce');
    } catch (err) {
      console.error("Login error:", err); // ✅ Better visibility
      alert(err.message || 'Invalid login');
    }
  }
};


  return (
    <QueueAnim type="bottom" duration={2000}>
      <div className="rct-session-wrapper">
        {loading && <LinearProgress />}
        <AppBar position="static" className="session-header">
          <Toolbar>
            <div className="container">
              <div className="d-flex justify-content-between">
                <div className="session-logo">
                  <Link to="/">
                    <img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35" />
                  </Link>
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
                  <div className="session-head mb-30">
                    <h2 className="font-weight-bold">VeiraMal HR Portal</h2>
                    <p className="mb-0">Most powerful HR Analysis Software</p>
                  </div>
                  <Form>
                    <FormGroup className="has-wrapper">
                      <Input
                        type="email"
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
                        type="password"
                        value={password}
                        name="user-pwd"
                        id="pwd"
                        className="has-input input-lg"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span className="has-icon"><i className="ti-lock"></i></span>
                    </FormGroup>

                    <div className="text-right mb-3">
                      <Link to="/forgot-password" className="text-muted">Forgot Password?</Link>
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
                  </Form>
                </div>
              </div>

              <div className="col-sm-5 col-md-5 col-lg-4 d-flex align-items-center justify-content-center">
                <img
                  src="/static/login-side.jpg" // ✅ Put your image in /public/static/
                  alt="HR Portal"
                  className="img-fluid rounded"
                  style={{ maxHeight: '450px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueueAnim>
  );
}

export default Signin;
