// File: CompanyDetails.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Paper, Typography, TextField, Button, LinearProgress, Grid, IconButton
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBack } from '@material-ui/icons';
import { NotificationManager } from 'react-notifications';
import { useHistory } from 'react-router-dom';
import { fetchCompanyDetails, updateCompanyDetails } from 'Store/Actions/companyActions';

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(4), maxWidth: 1000, margin: '24px auto' },
  paper: { padding: theme.spacing(3), borderRadius: 12 },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing(2) },
  formRow: { marginTop: theme.spacing(2) },
  actions: { marginTop: theme.spacing(3), display: 'flex', gap: theme.spacing(2) }
}));

function isValidAbn(value) {
  if (!value) return true; // optional
  const cleaned = value.toString().trim();
  return /^\d{11}$/.test(cleaned);
}

function getField(obj, ...names) {
  if (!obj) return undefined;
  for (const n of names) {
    if (Object.prototype.hasOwnProperty.call(obj, n) && obj[n] !== undefined && obj[n] !== null) {
      return obj[n];
    }
    const foundKey = Object.keys(obj).find(k => k.toLowerCase() === n.toLowerCase());
    if (foundKey && obj[foundKey] !== undefined && obj[foundKey] !== null) return obj[foundKey];
  }
  return undefined;
}

export default function CompanyDetails() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  // Get company state from Redux store
  const companyState = useSelector(state => state.company);
  const { company, loading, updating, error } = companyState;

  // form fields (local)
  const [companyName, setCompanyName] = useState('');
  const [companyABN, setCompanyABN] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');

  // Load company details on component mount
  useEffect(() => {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) {
      NotificationManager.error('Company Id not found. Please login again.');
      setTimeout(() => history.push('/signin'), 1200);
      return;
    }

    dispatch(fetchCompanyDetails());
  }, [dispatch, history]);

  // Update form fields when company data is loaded
  useEffect(() => {
    if (company) {
      setCompanyName(getField(company, 'companyName', 'CompanyName', 'name') || '');
      setCompanyABN(getField(company, 'companyABN', 'CompanyABN', 'abn') || '');
      setContactNumber(getField(company, 'contactNumber', 'ContactNumber', 'contact') || '');
      setLocation(getField(company, 'location', 'Location', 'companyLocation', 'CompanyLocation', 'address') || '');
    }
  }, [company]);

  // Handle save action using Redux
  const onSave = async () => {
    if (!companyName.trim()) {
      NotificationManager.error('Company name is required.');
      return;
    }
    if (!isValidAbn(companyABN)) {
      NotificationManager.error('ABN must be exactly 11 digits.');
      return;
    }

    const companyId = localStorage.getItem('companyId');
    if (!companyId) {
      NotificationManager.error('Company Id missing. Please login again.');
      return;
    }

    // Prepare payload for Redux action
    const payload = {
      CompanyName: companyName.trim(),
      CompanyABN: companyABN ? companyABN.trim() : null,
      ContactNumber: contactNumber ? contactNumber.trim() : null,
      Location: location ? location.trim() : null
    };

    try {
      // Dispatch the update action
      const result = await dispatch(updateCompanyDetails(payload));
      dispatch(fetchCompanyDetails());
      
      if (result && !result.error) {
        // Success - form fields will be updated via the useEffect when company state changes
        
        // Optional: Reset form to the updated values from store
        const updatedCompany = companyState.company;
        if (updatedCompany) {
          setCompanyName(getField(updatedCompany, 'companyName', 'CompanyName', 'name') || companyName);
          setCompanyABN(getField(updatedCompany, 'companyABN', 'CompanyABN', 'abn') || companyABN);
          setContactNumber(getField(updatedCompany, 'contactNumber', 'ContactNumber', 'contact') || contactNumber);
          setLocation(getField(updatedCompany, 'location', 'Location', 'companyLocation', 'CompanyLocation', 'address') || location);
        }
      }
      // Error handling is done in the Redux action, so no need for catch here
    } catch (err) {
      // This catch block is for any unexpected errors in the dispatch itself
      console.error('Unexpected error in onSave:', err);
      NotificationManager.error('An unexpected error occurred.');
    }
  };

  // Handle reset form
  const onReset = () => {
    if (company) {
      setCompanyName(getField(company, 'companyName', 'CompanyName', 'name') || '');
      setCompanyABN(getField(company, 'companyABN', 'CompanyABN', 'abn') || '');
      setContactNumber(getField(company, 'contactNumber', 'ContactNumber', 'contact') || '');
      setLocation(getField(company, 'location', 'Location', 'companyLocation', 'CompanyLocation', 'address') || '');
    }
  };

  if (loading) return <LinearProgress />;

  const createdAt = getField(company, 'createdAt', 'CreatedAt');

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.header}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={() => history.goBack()}><ArrowBack /></IconButton>
            <Typography variant="h6">Company Details</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="textSecondary">
              Created: {createdAt ? new Date(createdAt).toLocaleString() : '—'}
            </Typography>
          </Box>
        </div>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Name"
              variant="outlined"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company ABN"
              variant="outlined"
              value={companyABN}
              onChange={(e) => setCompanyABN(e.target.value.replace(/\D/g, ''))}
              helperText="11 digits (optional)"
              error={companyABN !== '' && !isValidAbn(companyABN)}
              inputProps={{ maxLength: 11 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Number"
              variant="outlined"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Location / Address"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              helperText="Optional — street/address, city, state"
            />
          </Grid>

          <Grid item xs={12} className={classes.actions}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onSave} 
              disabled={updating}
            >
              {updating ? 'Saving...' : 'Save changes'}
            </Button>
            <Button variant="outlined" onClick={onReset}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}