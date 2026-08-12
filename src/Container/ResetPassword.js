import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Typography,
  LinearProgress,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  CircularProgress,
  Card,
  CardContent,
  Box,
  Divider,
  Chip,
  Avatar
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import { NotificationManager } from 'react-notifications';
import {
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  LockOutlined as LockOutlinedIcon
} from '@material-ui/icons';
import { Helmet } from 'react-helmet';

import { resetPassword } from 'Store/Actions';

function ResetPassword(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(state => state.loading);

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      NotificationManager.error('Missing authentication token. Please sign in.');
      history.replace('/signin');
    }
  }, [history]);

  const passwordRules = {
    minLength: {
      test: (pwd) => pwd.length >= 8,
      message: 'At least 8 characters'
    },
    hasUppercase: {
      test: (pwd) => /[A-Z]/.test(pwd),
      message: 'At least one uppercase letter'
    },
    hasLowercase: {
      test: (pwd) => /[a-z]/.test(pwd),
      message: 'At least one lowercase letter'
    },
    hasNumber: {
      test: (pwd) => /\d/.test(pwd),
      message: 'At least one number'
    },
    hasSpecialChar: {
      test: (pwd) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(pwd),
      message: 'At least one special character'
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    Object.values(passwordRules).forEach(rule => {
      if (rule.test(password)) strength += 20;
    });
    return strength;
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 20) return 'Weak';
    if (passwordStrength <= 40) return 'Fair';
    if (passwordStrength <= 60) return 'Good';
    if (passwordStrength <= 80) return 'Strong';
    return 'Very strong';
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 20) return '#f44336';
    if (passwordStrength <= 40) return '#ff9800';
    if (passwordStrength <= 60) return '#ffc107';
    if (passwordStrength <= 80) return '#4caf50';
    return '#2e7d32';
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));

    if (field === 'newPassword') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);

      const errors = {};
      Object.entries(passwordRules).forEach(([key, rule]) => {
        if (!rule.test(value)) {
          errors[key] = rule.message;
        }
      });

      if (passwordData.confirmNewPassword && value !== passwordData.confirmNewPassword) {
        errors.confirmNewPassword = 'Passwords do not match';
      }

      setValidationErrors(prev => ({ ...prev, ...errors }));
    }

    if (field === 'confirmNewPassword') {
      if (value && value !== passwordData.newPassword) {
        setValidationErrors(prev => ({
          ...prev,
          confirmNewPassword: 'Passwords do not match'
        }));
      } else {
        setValidationErrors(prev => {
          const updated = { ...prev };
          delete updated.confirmNewPassword;
          return updated;
        });
      }
    }
  };

  const handleClickShowPassword = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const isPasswordValid = () => {
    return Object.values(passwordRules).every(rule => rule.test(passwordData.newPassword));
  };

  const canSubmitPasswordReset = () => {
    return (
      passwordData.newPassword.trim() &&
      passwordData.confirmNewPassword.trim() &&
      isPasswordValid() &&
      passwordData.newPassword === passwordData.confirmNewPassword &&
      !loading
    );
  };

  const onSubmit = async (e) => {
    e?.preventDefault?.();

    const errors = {};

    if (!passwordData.newPassword.trim()) {
      errors.newPassword = 'New password is required';
    }

    if (!passwordData.confirmNewPassword.trim()) {
      errors.confirmNewPassword = 'Confirm password is required';
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }

    Object.entries(passwordRules).forEach(([key, rule]) => {
      if (!rule.test(passwordData.newPassword)) {
        errors[key] = rule.message;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      NotificationManager.error('Please fix the password requirements.');
      return;
    }

    setValidationErrors({});
    dispatch(resetPassword(passwordData.newPassword, history));
  };

  return (
    <QueueAnim type="bottom" duration={250}>
      <div
        className="session-wrapper"
        // style={{
        //   minHeight: '100vh',
        //   background: 'linear-gradient(135deg, #f8fbff 0%, #eef4ff 100%)'
        // }}
      >
        <Helmet>
          <title>Reset Password</title>
        </Helmet>

        <div
          className="session-inner-wrapper"
          style={{
            display: 'flex',
            alignItems: 'center',
            minHeight: 'calc(100vh - 330px)',
            padding: '32px 0'
          }}
        >
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-sm-10 col-md-8 col-lg-6 col-xl-5">
                <Card
                  elevation={10}
                  style={{
                    borderRadius: 24,
                    overflow: 'hidden',
                    border: '1px solid rgba(25, 118, 210, 0.08)'
                  }}
                >
                  <CardContent style={{ padding: 0 }}>
                    <Box
                      style={{
                        padding: '32px 28px 24px',
                        background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                        color: '#fff',
                        textAlign: 'center'
                      }}
                    >
                      <Avatar
                        style={{
                          width: 64,
                          height: 64,
                          margin: '0 auto 14px',
                          background: 'rgba(255,255,255,0.18)'
                        }}
                      >
                        <LockOutlinedIcon style={{ fontSize: 34 }} />
                      </Avatar>

                      <Typography variant="h5" style={{ fontWeight: 700 }}>
                        Reset your password
                      </Typography>

                      <Typography variant="body2" style={{ opacity: 0.92, marginTop: 8 }}>
                        Create a strong new password for your account
                      </Typography>
                    </Box>

                    <Box style={{ padding: '28px' }}>
                      <form onSubmit={onSubmit}>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          className="mb-3"
                          error={!!validationErrors.newPassword}
                        >
                          <InputLabel htmlFor="new-password">New Password</InputLabel>
                          <OutlinedInput
                            id="new-password"
                            type={showPassword.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => handleClickShowPassword('new')}
                                  edge="end"
                                >
                                  {showPassword.new ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="New Password"
                          />
                          {validationErrors.newPassword && (
                            <FormHelperText>{validationErrors.newPassword}</FormHelperText>
                          )}
                        </FormControl>

                        {passwordData.newPassword && (
                          <Box
                            mb={3}
                            p={2}
                            style={{
                              borderRadius: 16,
                              background: '#f8fafc',
                              border: '1px solid #e7eef7'
                            }}
                          >
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={1}
                            >
                              <Typography variant="body2" style={{ fontWeight: 600 }}>
                                Password strength
                              </Typography>
                              <Chip
                                size="small"
                                label={getStrengthLabel()}
                                style={{
                                  background: getStrengthColor(),
                                  color: '#fff',
                                  fontWeight: 600
                                }}
                              />
                            </Box>

                            <LinearProgress
                              variant="determinate"
                              value={passwordStrength}
                              style={{
                                height: 10,
                                borderRadius: 999,
                                backgroundColor: '#e5e7eb'
                              }}
                            />

                            <Box mt={2}>
                              {Object.entries(passwordRules).map(([key, rule]) => {
                                const passed = rule.test(passwordData.newPassword);
                                return (
                                  <Box
                                    key={key}
                                    display="flex"
                                    alignItems="center"
                                    mb={0.75}
                                  >
                                    {passed ? (
                                      <CheckCircleIcon
                                        fontSize="small"
                                        style={{ color: '#2e7d32', marginRight: 6 }}
                                      />
                                    ) : (
                                      <ErrorIcon
                                        fontSize="small"
                                        style={{ color: '#d32f2f', marginRight: 6 }}
                                      />
                                    )}
                                    <Typography
                                      variant="caption"
                                      style={{
                                        color: passed ? '#2e7d32' : '#d32f2f',
                                        fontWeight: 500
                                      }}
                                    >
                                      {rule.message}
                                    </Typography>
                                  </Box>
                                );
                              })}
                            </Box>
                          </Box>
                        )}

                        <FormControl
                          fullWidth
                          variant="outlined"
                          className="mb-2"
                          error={!!validationErrors.confirmNewPassword}
                        >
                          <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                          <OutlinedInput
                            id="confirm-password"
                            type={showPassword.confirm ? 'text' : 'password'}
                            value={passwordData.confirmNewPassword}
                            onChange={(e) => handlePasswordChange('confirmNewPassword', e.target.value)}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => handleClickShowPassword('confirm')}
                                  edge="end"
                                >
                                  {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Confirm Password"
                          />
                          {validationErrors.confirmNewPassword && (
                            <FormHelperText>{validationErrors.confirmNewPassword}</FormHelperText>
                          )}

                          {passwordData.confirmNewPassword &&
                            passwordData.newPassword === passwordData.confirmNewPassword &&
                            passwordData.confirmNewPassword.length > 0 && (
                              <FormHelperText style={{ color: '#2e7d32' }}>
                                <CheckCircleIcon fontSize="small" style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                Passwords match
                              </FormHelperText>
                            )}
                        </FormControl>

                        <Button
                          color="primary"
                          className="btn-block text-white w-100"
                          variant="contained"
                          size="large"
                          type="submit"
                          disabled={!canSubmitPasswordReset()}
                          style={{
                            marginTop: 12,
                            borderRadius: 12,
                            padding: '12px 16px',
                            textTransform: 'none',
                            fontWeight: 700,
                            boxShadow: '0 10px 24px rgba(25, 118, 210, 0.22)'
                          }}
                        >
                          {loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            'Set new password'
                          )}
                        </Button>
                      </form>

                      <Box textAlign="center" mt={3}>
                        <Link
                          to="/signin"
                          style={{
                            textDecoration: 'none',
                            fontWeight: 600,
                            color: '#1976d2'
                          }}
                        >
                          Back to Sign In
                        </Link>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueueAnim>
  );
}

export default ResetPassword;