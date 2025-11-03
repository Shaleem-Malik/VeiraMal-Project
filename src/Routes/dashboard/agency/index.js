// File: src/Components/Dashboard/AgencyDashboard.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import IntlMessages from 'Util/IntlMessages';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';

// Material-UI Components
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Chip,
  Box,
  Grid,
  InputAdornment,
  Typography,
  IconButton,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Close as CloseIcon,
  Check as CheckIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

// Store actions
import {
  fetchUsers,
  updateUser,
  activateUser,
  inactivateUser,
  fetchBusinessUnits,
  fetchAccessLevels,
} from 'Store/Actions/userActions';
import { fetchCompanyDetails } from 'Store/Actions/companyActions';

// Components
import CompanySummary from './CompanySummary';
import EmployeeList from './EmployeeList';

const useStyles = makeStyles((theme) => ({
  modal: {
    '& .MuiDialog-paper': {
      borderRadius: 16,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    },
  },
  modalHeader: {
    padding: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontWeight: 700,
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  modalContent: {
    padding: theme.spacing(3),
  },
  modalActions: {
    padding: theme.spacing(2, 3),
    borderTop: `1px solid ${theme.palette.divider}`,
    gap: theme.spacing(1),
  },
  formSection: {
    marginBottom: theme.spacing(3),
  },
  sectionTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  businessUnitsSection: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 12,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  searchBox: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
    },
  },
  businessUnitsGrid: {
    maxHeight: 200,
    overflow: 'auto',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    border: `1px solid ${theme.palette.divider}`,
  },
  businessUnitItem: {
    padding: theme.spacing(0.5, 0),
  },
  selectedChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  chip: {
    borderRadius: 8,
    fontWeight: 500,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  requiredLabel: {
    '&::after': {
      content: '" *"',
      color: theme.palette.error.main,
    },
  },
  actionButton: {
    borderRadius: 8,
    padding: theme.spacing(1, 3),
    fontWeight: 600,
    textTransform: 'none',
  },
  cancelButton: {
    borderRadius: 8,
    padding: theme.spacing(1, 3),
    textTransform: 'none',
    border: `2px solid ${theme.palette.divider}`,
  },
}));

/**
 * Normalize metadata label (access levels / business units) whether they come as strings or objects
 */
function normalizeMetaLabel(item) {
  if (item == null) return '';
  if (typeof item === 'string') return item;
  return item.name ?? item.displayName ?? item.label ?? item.value ?? '';
}

export default function AgencyDashboard({ match }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Redux slices
  const companyState = useSelector(state => state.company);
  const userState = useSelector(state => state.user);

  // Meta lists from store
  const accessLevels = userState?.accessLevels ?? [];
  const businessUnitsMeta = userState?.businessUnits ?? [];
  const users = userState?.users ?? [];

  // UI state - ONLY EDIT MODAL (no add/create modals)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Edit employee form state
  const emptyEmployee = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    accessLevel: '',
    businessUnits: [],
    contactNumber: '',
    location: ''
  };
  const [editEmployee, setEditEmployee] = useState({ ...emptyEmployee });
  const [businessUnitSearch, setBusinessUnitSearch] = useState('');

  // Compute parent base & company details path
  const parentBase = match?.url ? match.url.replace(/\/[^/]+$/, '') : '/app/dashboard';
  const companyDetailsPath = `${parentBase}/company-details`;

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchCompanyDetails());
    dispatch(fetchUsers());
    dispatch(fetchBusinessUnits());
    dispatch(fetchAccessLevels());
  }, [dispatch]);

  // Keep companyLocation handy
  const companyLocation = companyState?.company?.location ?? companyState?.company?.Location ?? '';

  // Filter business units based on search
  const filteredBusinessUnits = businessUnitsMeta.filter(bu => {
    const label = normalizeMetaLabel(bu);
    return label.toLowerCase().includes(businessUnitSearch.toLowerCase());
  });

  // Handle business unit selection for edit
  const handleBusinessUnitToggle = (businessUnit) => {
    const label = normalizeMetaLabel(businessUnit);
    setEditEmployee(prev => {
      const currentUnits = prev.businessUnits || [];
      if (currentUnits.includes(label)) {
        return {
          ...prev,
          businessUnits: currentUnits.filter(unit => unit !== label)
        };
      } else {
        return {
          ...prev,
          businessUnits: [...currentUnits, label]
        };
      }
    });
  };

  // Toggle active/inactive
  const handleToggleStatus = async (id) => {
    try {
      const found = users.find(u => Number(u.userId ?? u.id ?? u.UserId ?? -1) === Number(id));
      const isActive = found?.isActive ?? found?.IsActive ?? true;
      if (isActive) {
        await dispatch(inactivateUser(id));
      } else {
        await dispatch(activateUser(id));
      }
    } catch (err) {
      console.error('Toggle status error', err);
    }
  };

  // Edit user: prefill modal and go into edit mode
  const handleEdit = (userObj) => {
    setEditingUser(userObj);

    // Build businessUnits array from multiple possible shapes
    let buArray = [];
    const rawBu = userObj.businessUnits ?? userObj.BusinessUnits ?? userObj.businessUnit ?? userObj.BusinessUnit;
    if (Array.isArray(rawBu)) {
      buArray = rawBu.map(x => (typeof x === 'string' ? x : normalizeMetaLabel(x))).filter(Boolean);
    } else if (typeof rawBu === 'string') {
      buArray = rawBu.split(',').map(s => s.trim()).filter(Boolean);
    }

    setEditEmployee({
      firstName: userObj.firstName ?? userObj.FirstName ?? '',
      middleName: userObj.middleName ?? userObj.MiddleName ?? '',
      lastName: userObj.lastName ?? userObj.LastName ?? '',
      email: userObj.email ?? userObj.Email ?? '',
      accessLevel: (userObj.accessLevel ?? userObj.AccessLevel) ? String(userObj.accessLevel ?? userObj.AccessLevel) : '',
      businessUnits: buArray.length ? buArray : [],
      contactNumber: userObj.contactNumber ?? userObj.ContactNumber ?? '',
      location: companyLocation
    });

    setBusinessUnitSearch('');
    setShowEditModal(true);
  };

  // Save employee (update only - no create functionality)
  const handleSaveEmployee = async () => {
    // Basic validation
    if (!editEmployee.firstName?.trim() || !editEmployee.lastName?.trim() || !editEmployee.email?.trim() || !editEmployee.accessLevel?.trim()) {
      NotificationManager.warning('Please fill all required fields');
      return;
    }

    if (!Array.isArray(editEmployee.businessUnits) || editEmployee.businessUnits.length === 0) {
      NotificationManager.warning('Please select at least one business unit');
      return;
    }

    // Prepare payload for update
    const businessUnitsArray = editEmployee.businessUnits.map(s => String(s));
    const businessUnitString = businessUnitsArray.join(',');

    const userId = Number(editingUser.userId ?? editingUser.id ?? editingUser.UserId ?? 0);
    if (!userId) {
      NotificationManager.error('Edit failed: missing user identifier');
      return;
    }

    const dto = {
      UserId: userId,
      FirstName: editEmployee.firstName.trim(),
      MiddleName: editEmployee.middleName?.trim() || null,
      LastName: editEmployee.lastName?.trim() || null,
      Email: editEmployee.email.trim(),
      BusinessUnits: businessUnitsArray,
      BusinessUnit: businessUnitString,
      AccessLevel: editEmployee.accessLevel,
      ContactNumber: editEmployee.contactNumber?.trim() || null,
      Location: companyLocation || null,
      IsActive: editingUser.isActive ?? editingUser.IsActive ?? true
    };

    try {
      await dispatch(updateUser(dto));
      setShowEditModal(false);
      setEditingUser(null);
      setEditEmployee({ ...emptyEmployee });
    } catch (err) {
      console.error('[userActions] updateUser error:', err);
    }
  };

  // Compute counts for stat cards
  const totalEmployees = users.length;
  const activeEmployees = users.filter(u => u.isActive ?? u.IsActive ?? true).length;
  const accessLevelsCount = accessLevels.length;
  const businessUnitsCount = businessUnitsMeta.length;

  return (
    <div className="agency-dashboard-wrapper">
      <Helmet>
        <title>Employee Management Dashboard</title>
        <meta name="description" content="Employee Management Dashboard - View and Manage Employees" />
      </Helmet>

      <PageTitleBar title={<IntlMessages id="Company Profile" />} match={match} />

      <div className="row">
        {/* Left Sidebar - Only Company Summary */}
        <div className="col-lg-3 mb-4">
          <CompanySummary companyState={companyState} companyDetailsPath={companyDetailsPath} />
        </div>

        {/* Main Content - Employee List and Stats */}
        <div className="col-lg-9">
          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-primary shadow-sm h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Employees</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">{totalEmployees}</div>
                    </div>
                    <div className="col-auto"><i className="fas fa-users fa-2x text-gray-300"></i></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow-sm h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Active Employees</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">{activeEmployees}</div>
                    </div>
                    <div className="col-auto"><i className="fas fa-user-check fa-2x text-gray-300"></i></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-warning shadow-sm h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Access Levels</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">{accessLevelsCount}</div>
                    </div>
                    <div className="col-auto"><i className="fas fa-key fa-2x text-gray-300"></i></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-info shadow-sm h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Business Units</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">{businessUnitsCount}</div>
                    </div>
                    <div className="col-auto"><i className="fas fa-building fa-2x text-gray-300"></i></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employee List */}
          <EmployeeList employees={users} onEdit={handleEdit} onToggleStatus={handleToggleStatus} />
        </div>
      </div>

      {/* Edit Employee Modal Only - No Add Modal */}
      <Dialog 
        open={showEditModal} 
        onClose={() => { setShowEditModal(false); setEditingUser(null); setEditEmployee({ ...emptyEmployee }); }}
        maxWidth="md"
        fullWidth
        className={classes.modal}
      >
        <DialogTitle className={classes.modalHeader}>
          <Typography className={classes.modalTitle}>
            <PersonIcon color="primary" />
            Edit Employee
          </Typography>
          <IconButton onClick={() => { setShowEditModal(false); setEditingUser(null); }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className={classes.modalContent}>
          {/* Personal Information Section */}
          <Box className={classes.formSection}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <PersonIcon fontSize="small" />
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={editEmployee.firstName}
                  onChange={(e) => setEditEmployee({ ...editEmployee, firstName: e.target.value })}
                  className={classes.textField}
                  variant="outlined"
                  InputLabelProps={{ className: classes.requiredLabel }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  value={editEmployee.middleName}
                  onChange={(e) => setEditEmployee({ ...editEmployee, middleName: e.target.value })}
                  className={classes.textField}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={editEmployee.lastName}
                  onChange={(e) => setEditEmployee({ ...editEmployee, lastName: e.target.value })}
                  className={classes.textField}
                  variant="outlined"
                  InputLabelProps={{ className: classes.requiredLabel }}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* Contact Information Section */}
          <Box className={classes.formSection}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <EmailIcon fontSize="small" />
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={editEmployee.email}
                  onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
                  className={classes.textField}
                  variant="outlined"
                  InputLabelProps={{ className: classes.requiredLabel }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  value={editEmployee.contactNumber}
                  onChange={(e) => setEditEmployee({ ...editEmployee, contactNumber: e.target.value })}
                  className={classes.textField}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Access & Business Units Section */}
          <Box className={classes.formSection}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <SecurityIcon fontSize="small" />
              Access & Business Units
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" className={classes.textField}>
                  <InputLabel className={classes.requiredLabel}>Access Level</InputLabel>
                  <Select
                    value={editEmployee.accessLevel}
                    onChange={(e) => setEditEmployee({ ...editEmployee, accessLevel: e.target.value })}
                    label="Access Level"
                    required
                  >
                    <MenuItem value=""><em>Select Access Level</em></MenuItem>
                    {accessLevels.map((a, i) => {
                      const label = normalizeMetaLabel(a);
                      return <MenuItem key={i} value={label}>{label}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={companyLocation || 'No company location set'}
                  className={classes.textField}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="User location is set to company location"
                />
              </Grid>
            </Grid>

            {/* Business Units Section with Search and Checkboxes */}
            <Box className={classes.businessUnitsSection}>
              <Typography variant="subtitle1" gutterBottom>
                Business Units *
              </Typography>
              
              {/* Search Box */}
              <TextField
                fullWidth
                placeholder="Search business units..."
                value={businessUnitSearch}
                onChange={(e) => setBusinessUnitSearch(e.target.value)}
                className={classes.searchBox}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Business Units Checkboxes */}
              <Box className={classes.businessUnitsGrid}>
                <FormGroup>
                  {filteredBusinessUnits.map((bu, i) => {
                    const label = normalizeMetaLabel(bu);
                    const isSelected = editEmployee.businessUnits.includes(label);
                    return (
                      <FormControlLabel
                        key={i}
                        control={
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleBusinessUnitToggle(bu)}
                            color="primary"
                            icon={<CheckIcon style={{ visibility: 'hidden' }} />}
                            checkedIcon={<CheckIcon />}
                          />
                        }
                        label={
                          <Box display="flex" alignItems="center">
                            <BusinessIcon fontSize="small" style={{ marginRight: 8, color: isSelected ? '#1976d2' : '#666' }} />
                            <Typography variant="body2" style={{ fontWeight: isSelected ? 600 : 400 }}>
                              {label}
                            </Typography>
                          </Box>
                        }
                        className={classes.businessUnitItem}
                      />
                    );
                  })}
                  {filteredBusinessUnits.length === 0 && (
                    <Typography variant="body2" color="textSecondary" align="center" style={{ padding: 16 }}>
                      No business units found
                    </Typography>
                  )}
                </FormGroup>
              </Box>

              {/* Selected Business Units Chips */}
              {editEmployee.businessUnits.length > 0 && (
                <Box className={classes.selectedChips}>
                  <Typography variant="caption" color="textSecondary" style={{ width: '100%' }}>
                    Selected ({editEmployee.businessUnits.length}):
                  </Typography>
                  {editEmployee.businessUnits.map((unit, index) => (
                    <Chip
                      key={index}
                      label={unit}
                      className={classes.chip}
                      size="small"
                      onDelete={() => handleBusinessUnitToggle(unit)}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions className={classes.modalActions}>
          <Button 
            onClick={() => { setShowEditModal(false); setEditingUser(null); }}
            className={classes.cancelButton}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEmployee}
            variant="contained"
            color="primary"
            className={classes.actionButton}
            startIcon={<CheckIcon />}
            disabled={!editEmployee.firstName || !editEmployee.lastName || !editEmployee.email || !editEmployee.accessLevel || editEmployee.businessUnits.length === 0}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}