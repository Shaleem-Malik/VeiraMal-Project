// File: CompanyDetails.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Paper, Typography, TextField, Button, LinearProgress, Grid, IconButton, Avatar, CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBack, Delete as DeleteIcon } from '@material-ui/icons';
import { NotificationManager } from 'react-notifications';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { fetchCompanyDetails, updateCompanyDetails } from 'Store/Actions/companyActions';
import { apiWithCompany } from 'Api/apiHelpers';

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(4), maxWidth: 1000, margin: '24px auto' },
  paper: { padding: theme.spacing(3), borderRadius: 12 },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing(2) },
  formRow: { marginTop: theme.spacing(2) },
  actions: { marginTop: theme.spacing(3), display: 'flex', gap: theme.spacing(2) },
  logoBox: { display: 'flex', alignItems: 'center', gap: theme.spacing(2) },
  logoPreview: { width: 96, height: 96, borderRadius: 8, objectFit: 'cover', border: '1px solid #e6eef8' },
  uploadInput: { display: 'none' }
}));

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5228';
const api = axios.create({ baseURL: API_BASE, withCredentials: true });

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

  // Redux company state
  const companyState = useSelector(state => state.company);
  const { company, loading, updating } = companyState || {};

  // local form fields
  const [companyName, setCompanyName] = useState('');
  const [companyABN, setCompanyABN] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');

  // logo upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoDeleting, setLogoDeleting] = useState(false);

  useEffect(() => {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) {
      NotificationManager.error('Company Id not found. Please login again.');
      setTimeout(() => history.push('/signin'), 1200);
      return;
    }
    dispatch(fetchCompanyDetails());
  }, [dispatch, history]);

  useEffect(() => {
    if (company) {
      setCompanyName(getField(company, 'companyName', 'CompanyName', 'name') || '');
      setCompanyABN(getField(company, 'companyABN', 'CompanyABN', 'abn') || '');
      setContactNumber(getField(company, 'contactNumber', 'ContactNumber', 'contact') || '');
      setLocation(getField(company, 'location', 'Location', 'companyLocation', 'CompanyLocation', 'address') || '');
    }
  }, [company]);

  useEffect(() => {
    // cleanup preview URL when component unmounts or file changes
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onSave = async () => {
    if (!companyName.trim()) {
      NotificationManager.error('Company name is required.');
      return;
    }
    if (!isValidAbn(companyABN)) {
      NotificationManager.error('ABN must be exactly 11 digits.');
      return;
    }
    const payload = {
      CompanyName: companyName.trim(),
      CompanyABN: companyABN ? companyABN.trim() : null,
      ContactNumber: contactNumber ? contactNumber.trim() : null,
      Location: location ? location.trim() : null
    };

    try {
      const result = await dispatch(updateCompanyDetails(payload));
      // refetch
      await dispatch(fetchCompanyDetails());
      NotificationManager.success('Company details updated.');
    } catch (err) {
      console.error('Update error', err);
      NotificationManager.error('Failed to update company.');
    }
  };

  const onReset = () => {
    if (company) {
      setCompanyName(getField(company, 'companyName', 'CompanyName', 'name') || '');
      setCompanyABN(getField(company, 'companyABN', 'CompanyABN', 'abn') || '');
      setContactNumber(getField(company, 'contactNumber', 'ContactNumber', 'contact') || '');
      setLocation(getField(company, 'location', 'Location', 'companyLocation', 'CompanyLocation', 'address') || '');
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  // when file selected
  const onFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    // basic validation
    const permitted = ['image/jpeg', 'image/png', 'image/webp'];
    if (!permitted.includes(f.type)) {
      NotificationManager.error('Invalid file type. Allowed: jpg, png, webp.');
      return;
    }
    const maxBytes = 2 * 1024 * 1024;
    if (f.size > maxBytes) {
      NotificationManager.error('File too large. Max 2 MB.');
      return;
    }
    setSelectedFile(f);

    // create preview
    try {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } catch (err) {
      setPreviewUrl(null);
    }
  };

  const uploadLogo = async () => {
    if (!selectedFile) {
      NotificationManager.error('Select a file first.');
      return;
    }

    setLogoUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', selectedFile);

      // Use apiWithCompany – token and subCompanyId are added automatically
      const res = await apiWithCompany.post(`${API_BASE}/api/Company/effective/logo`, fd);

      NotificationManager.success(res.data?.message || 'Logo uploaded.');
      await dispatch(fetchCompanyDetails());
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error('Logo upload failed', err);
      NotificationManager.error(err?.response?.data?.message || 'Logo upload failed.');
    } finally {
      setLogoUploading(false);
    }
  };

  const deleteLogo = async () => {
    if (!company || (!company.logoUrl && !company.LogoUrl)) {
      NotificationManager.error('No logo to delete.');
      return;
    }

    if (!window.confirm('Remove current company logo?')) return;

    setLogoDeleting(true);
    try {
      const res = await apiWithCompany.delete(`${API_BASE}/api/Company/effective/logo`);
      NotificationManager.success(res.data?.message || 'Logo removed.');
      await dispatch(fetchCompanyDetails());
    } catch (err) {
      console.error('Logo delete failed', err);
      NotificationManager.error(err?.response?.data?.message || 'Failed to remove logo.');
    } finally {
      setLogoDeleting(false);
    }
  };

  if (loading) return <LinearProgress />;

  const createdAt = getField(company, 'createdAt', 'CreatedAt');
  // Logo URL field: some APIs use logoUrl or LogoUrl depending on DTO mapping
  const rawLogoUrl = company?.logoUrl ?? company?.LogoUrl ?? null;
  const apiBaseTrim = (process.env.REACT_APP_API_BASE || API_BASE).replace(/\/$/, '');
  const logoAbsoluteUrl = rawLogoUrl ? `${apiBaseTrim}${rawLogoUrl}` : null;

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

          {/* Logo upload area */}
          <Grid item xs={12}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* show existing logo (if any) */}
                {logoAbsoluteUrl ? (
                  <img
                    src={logoAbsoluteUrl}
                    alt="company logo"
                    className={classes.logoPreview}
                    onError={(e) => {
                      // fallback if image fails to load
                      e.currentTarget.style.display = 'none';
                      // optionally set a state flag to show "No logo"
                    }}
                  />
                ) : (
                  <div style={{ width: 96, height: 96, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    No logo
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    accept=".png,.jpg,.jpeg,.webp"
                    id="company-logo-file"
                    type="file"
                    className={classes.uploadInput}
                    onChange={onFileChange}
                  />
                  <label htmlFor="company-logo-file">
                    <Button variant="outlined" component="span" size="small">Choose file</Button>
                  </label>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={uploadLogo}
                      disabled={logoUploading || !selectedFile}
                    >
                      {logoUploading ? <><CircularProgress size={16} /> &nbsp;Uploading</> : 'Upload / Update Logo'}
                    </Button>

                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={deleteLogo}
                      disabled={logoDeleting || !logoAbsoluteUrl}
                      startIcon={<DeleteIcon />}
                    >
                      {logoDeleting ? 'Removing...' : 'Remove Logo'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* preview of selected file */}
              <div style={{ textAlign: 'right' }}>
                {previewUrl ? (
                  <>
                    <div style={{ marginBottom: 8 }}>
                      <Typography variant="caption">Preview of selected file</Typography>
                    </div>
                    <img src={previewUrl} alt="preview" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }} />
                  </>
                ) : null}
              </div>
            </div>
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