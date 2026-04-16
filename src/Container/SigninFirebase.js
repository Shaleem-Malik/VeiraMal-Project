import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  AppBar,
  Toolbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Box,
} from '@material-ui/core'; // added Dialog components
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import { Helmet } from 'react-helmet';
import DescriptionIcon from '@material-ui/icons/Description'; // optional icon for modal

// redux action
import { signinUserInFirebase } from 'Store/Actions';

function Signin(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [termsOpen, setTermsOpen] = useState(false); // state for Terms modal
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.authUser.loading);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        onUserLogin();
      }
    };

    const form = formRef.current;
    if (form) {
      form.addEventListener('keypress', handleKeyPress);
    }

    return () => {
      if (form) {
        form.removeEventListener('keypress', handleKeyPress);
      }
    };
  }, [email, password]);

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
    if (loading) return;

    if (validateForm()) {
      dispatch(signinUserInFirebase({ email, password }, props.history));
    }
  };

  /**
   * On User Sign Up
   */
  const onUserSignUp = () => {
    sessionStorage.setItem('cameFromSignIn', 'true');
    props.history.push('/signup');
  };

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

  // Modal handlers
  const openTermsModal = (e) => {
    e.preventDefault(); // prevent any link navigation
    setTermsOpen(true);
  };

  const closeTermsModal = () => {
    setTermsOpen(false);
  };

  return (
    <QueueAnim type="bottom" duration={2000}>
      <Helmet>
        <title>Signin</title>
      </Helmet>
      <div className="rct-session-wrapper" key="reset">
        {loading && <LinearProgress />}

        {/* Terms of Service Modal */}
        <Dialog
          open={termsOpen}
          onClose={closeTermsModal}
          scroll="paper"
          aria-labelledby="terms-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="terms-dialog-title">
            <Box display="flex" alignItems="center">
              <DescriptionIcon color="primary" style={{ marginRight: 8 }} />
              <Typography variant="h5" component="span">
                Terms of Service
              </Typography>
            </Box>
          </DialogTitle>
          <Divider />
          <DialogContent dividers>
            <Typography variant="body1" gutterBottom>
              <strong>Last updated:</strong> January 1, 2025
            </Typography>
            <Typography variant="body2" paragraph>
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the HR Analytix website and software (the "Service") operated by HR Analytix ("us", "we", or "our").
            </Typography>

            <Typography variant="h6" gutterBottom>
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body2" paragraph>
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
            </Typography>

            <Typography variant="h6" gutterBottom>
              2. Accounts
            </Typography>
            <Typography variant="body2" paragraph>
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities under your account.
            </Typography>

            <Typography variant="h6" gutterBottom>
              3. Intellectual Property
            </Typography>
            <Typography variant="body2" paragraph>
              The Service and its original content, features, and functionality are and will remain the exclusive property of HR Analytix and its licensors. The Service is protected by copyright, trademark, and other laws.
            </Typography>

            <Typography variant="h6" gutterBottom>
              4. Termination
            </Typography>
            <Typography variant="body2" paragraph>
              We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users of the Service, us, or third parties, or for any other reason.
            </Typography>

            <Typography variant="h6" gutterBottom>
              5. Limitation of Liability
            </Typography>
            <Typography variant="body2" paragraph>
              In no event shall HR Analytix, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your use or inability to use the Service; (ii) any unauthorized access to or use of our servers and/or any personal information stored therein.
            </Typography>

            <Typography variant="h6" gutterBottom>
              6. Governing Law
            </Typography>
            <Typography variant="body2" paragraph>
              These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
            </Typography>

            <Typography variant="body2" paragraph>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions will remain in effect.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeTermsModal} color="primary" variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <AppBar position="static" className="session-header">
          <Toolbar>
            <div className="container">
              <div className="d-flex justify-content-between">
                <div className="session-logo">
                  <Link to="/">
                    <h1 className="font-weight-bold text-dark">HR Analytix</h1>
                  </Link>
                </div>
                <div>
                  <a href="#!" className="mr-15 text-dark" onClick={(e) => { e.preventDefault(); onUserSignUp(); }}>
                    Create New account?
                  </a>
                  <Button variant="contained" className="btn-light" onClick={onUserSignUp}>
                    Sign Up
                  </Button>
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
            minHeight: 'calc(100vh - 330px)',
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

                  <Form onSubmit={onUserLogin} innerRef={formRef}>
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
                      <span className="has-icon">
                        <i className="ti-email"></i>
                      </span>
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
                      <span className="has-icon">
                        <i className="ti-lock"></i>
                      </span>
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
                        disabled={loading}
                        aria-busy={loading ? 'true' : 'false'}
                      >
                        {loading ? (
                          <>
                            <CircularProgress size={20} style={{ marginRight: 10 }} />
                            Signing In...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </FormGroup>
                  </Form>

                  <p className="text-muted">By signing up you agree to HR Analytix</p>
                  <p className="mb-0">
                    {/* Replace anchor with button styled as link */}
                    <Button
                      onClick={openTermsModal}
                      className="text-muted"
                      style={{
                        textTransform: 'none',
                        fontSize: 'inherit',
                        padding: 0,
                        minWidth: 0,
                        verticalAlign: 'baseline',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      disableRipple
                    >
                      Terms of Service
                    </Button>
                  </p>
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