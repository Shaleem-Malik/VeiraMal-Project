// ForgotPassword.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector  } from 'react-redux';
import { Button, AppBar, Toolbar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import { Helmet } from "react-helmet";


// components
// import { SessionSlider } from 'Components/Widgets';

// app config
import AppConfig from 'Constants/AppConfig';

// redux action
import { forgotPassword } from 'Store/Actions';

function ForgotPassword(props) {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading);

  const onSubmit = async (e) => {
    e && e.preventDefault();
    const trimmed = String(email || '').trim();
    if (!trimmed) {
      // small client-side guard; server/action also validates and notifies
      // we call NotificationManager directly to give immediate feedback
      // but action will also notify on server message
      // Import NotificationManager if you want to show here; otherwise rely on action notifications
      // NotificationManager.error('Please enter your registered email address.');
      return;
    }

    try {
      await dispatch(forgotPassword(trimmed, props.history));
      // the action will show notifications and redirect if configured
    } catch (err) {
      // action already displays errors; optional extra handling here
      console.error('Forgot password dispatch error', err);
    }
  };

  const onBackToSignin = () => {
    if (props.history && typeof props.history.push === 'function') {
      props.history.push('/signin');
    }
  };

  return (
    <QueueAnim type="bottom" duration={2000}>
        <Helmet>
            <title>Forgot Password</title>
        </Helmet>
      <div className="rct-session-wrapper" key="forgot-root">
        {loading && <LinearProgress />}

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
                  <Link to="/signin" className="mr-15 text-dark" style={{ textDecoration: 'none' }}>Sign In</Link>
                  <Button variant="contained" className="btn-light" component={Link} to="/signin">Sign In</Button>
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
                    <h2 className="font-weight-bold">Reset your password</h2>
                    <p className="mb-0">Enter your registered email — we'll send a temporary password to sign in.</p>
                  </div>

                  <Form onSubmit={onSubmit}>
                    <FormGroup className="has-wrapper">
                      <Input
                        type="email"
                        value={email}
                        name="user-mail"
                        id="user-mail"
                        className="has-input input-lg"
                        placeholder="Enter registered email address"
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                      <span className="has-icon"><i className="ti-email"></i></span>
                    </FormGroup>

                    <FormGroup className="mb-15">
                      <Button
                        color="primary"
                        className="btn-block text-white w-100"
                        variant="contained"
                        size="large"
                        onClick={onSubmit}
                        disabled={loading}
                      >
                        Send temporary password
                      </Button>
                    </FormGroup>

                    <FormGroup className="mb-0">
                      <Button
                        variant="outlined"
                        className="btn-block w-100"
                        size="large"
                        onClick={onBackToSignin}
                      >
                        Back to Sign In
                      </Button>
                    </FormGroup>
                  </Form>

                  <p className="text-muted mt-20">By using this service you agree to {AppConfig.brandName}</p>
                  <p className="mb-0"><a target="_blank" rel="noreferrer" href="#/terms-condition" className="text-muted">Terms of Service</a></p>
                </div>
              </div>

              {/* Optional right column: keep session slider if you want */}
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

export default ForgotPassword;
