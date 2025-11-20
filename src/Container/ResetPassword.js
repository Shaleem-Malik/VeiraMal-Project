import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, AppBar, Toolbar } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import { NotificationManager } from 'react-notifications';
import { Helmet } from "react-helmet";


import AppConfig from 'Constants/AppConfig';
import { resetPassword } from 'Store/Actions';

function ResetPassword(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(state => state.loading); // existing loading flag

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // no token -> redirect to signin
      NotificationManager.error('Missing authentication token. Please sign in.');
      history.replace('/signin'); // adjust prefix if needed
    }
  }, [history]);

  const onSubmit = async (e) => {
    e?.preventDefault?.();

    if (!password || !confirm) {
      NotificationManager.error('Please enter and confirm your new password.');
      return;
    }

    if (password !== confirm) {
      NotificationManager.error('Passwords do not match.');
      return;
    }

    // optional: enforce basic client-side policy
    if (password.length < 8) {
      NotificationManager.error('Password must be at least 8 characters.');
      return;
    }

    dispatch(resetPassword(password, history));
  };

  return (
    <QueueAnim type="bottom" duration={2000}>
      <Helmet>
          <title>Reset Password</title>
      </Helmet>
      <div className="rct-session-wrapper" key="reset">
        {loading && <LinearProgress />}
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
                  <Link to="/signin" className="mr-15 text-white">Back to Sign In</Link>
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
            <div className="row row-eq-height justify-content-center align-items-center">
              <div className="col-sm-7 col-md-7 col-lg-8">
                <div className="session-body text-center shadow">
                  <div className="session-head mb-30">
                    <h2 className="font-weight-bold">Reset your password</h2>
                    <p className="mb-0">Set a strong password for your account</p>
                  </div>

                  <Form onSubmit={onSubmit}>
                    <FormGroup className="has-wrapper">
                      <Input
                        value={password}
                        type="password"
                        name="new-password"
                        id="new-password"
                        className="has-input input-lg"
                        placeholder="New Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span className="has-icon"><i className="ti-lock"></i></span>
                    </FormGroup>

                    <FormGroup className="has-wrapper">
                      <Input
                        value={confirm}
                        type="password"
                        name="confirm-password"
                        id="confirm-password"
                        className="has-input input-lg"
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirm(e.target.value)}
                      />
                      <span className="has-icon"><i className="ti-lock"></i></span>
                    </FormGroup>

                    <FormGroup className="mb-15">
                      <Button
                        color="primary"
                        className="btn-block text-white w-100"
                        variant="contained"
                        size="large"
                        type="submit"
                      >
                        Set new password
                      </Button>
                    </FormGroup>
                  </Form>

                </div>
              </div>

              {/* <div className="col-sm-5 col-md-5 col-lg-4">
                optional right panel
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </QueueAnim>
  );
}

export default ResetPassword;
