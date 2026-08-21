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
  Container,
  Paper
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

// Store actions
import {
  uploadUsersExcel,
  addBusinessUnit,
  addAccessLevel,
  deleteBusinessUnit,
  createUser,
  fetchBusinessUnits,
  fetchAccessLevels,
} from 'Store/Actions/userActions';
import { fetchCompanyDetails } from 'Store/Actions/companyActions';

// Components
import QuickActions from './QuickActions';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '85vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: theme.spacing(4, 0),
  },
  container: {
    maxWidth: 1200,
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
  },
  content: {
    display: 'flex',
    gap: theme.spacing(4),
    flexWrap: 'wrap',
  },
  quickActionsSection: {
    flex: '1 1 400px',
    maxWidth: 500,
  },
  infoSection: {
    flex: '1 1 600px',
  },
  infoCard: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: 16,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
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
    background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.light}15 100%)`,
  },
  modalTitle: {
    fontWeight: 700,
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.primary.main,
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
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: 12,
    border: `1px solid ${theme.palette.divider}`,
  },
  sectionTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontSize: '1.1rem',
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
    marginTop: theme.spacing(2),
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
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: theme.spacing(0.75, 0),
  },

  metaItemContent: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },

  deleteMetaButton: {
    marginLeft: theme.spacing(1),
  },

  confirmDeleteText: {
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  selectedChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
    borderRadius: 8,
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
    borderRadius: 12,
    padding: theme.spacing(1, 3),
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
    },
  },
  cancelButton: {
    borderRadius: 12,
    padding: theme.spacing(1, 3),
    textTransform: 'none',
    border: `2px solid ${theme.palette.divider}`,
    fontWeight: 500,
  },
  infoListCard: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: 16,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
  listHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    fontWeight: 700,
  },
  chipWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  metaChip: {
    borderRadius: 8,
    fontWeight: 500,
  },
  emptyText: {
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
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

export default function QuickActionsContainer({ match }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Redux slices
  const companyState = useSelector(state => state.company);
  const userState = useSelector(state => state.user);

  // Meta lists from store
  const accessLevels = userState?.accessLevels ?? [];
  const businessUnitsMeta = userState?.businessUnits ?? [];

  // UI state
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showAccessLevelModal, setShowAccessLevelModal] = useState(false);
  const [showBusinessUnitModal, setShowBusinessUnitModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteBusinessUnitDialogOpen, setDeleteBusinessUnitDialogOpen] = useState(false);
  const [businessUnitToDelete, setBusinessUnitToDelete] = useState(null);

  // Form states
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    accessLevel: '',
    businessUnits: [],
    contactNumber: '',
    location: ''
  });

  const [newAccessLevel, setNewAccessLevel] = useState('');
  const [newBusinessUnit, setNewBusinessUnit] = useState('');
  const [businessUnitSearch, setBusinessUnitSearch] = useState('');

  // Compute parent base & company details path
  const parentBase = match?.url ? match.url.replace(/\/[^/]+$/, '') : '/app/dashboard';
  const companyDetailsPath = `${parentBase}/company-details`;

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchCompanyDetails());
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

  // Handle business unit selection
  const handleBusinessUnitToggle = (businessUnit) => {
    const label = normalizeMetaLabel(businessUnit);
    setNewEmployee(prev => {
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

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/)) {
      NotificationManager.error('Please upload a valid Excel or CSV file');
      return;
    }

    setUploadLoading(true);

    try {
      await dispatch(uploadUsersExcel(file));
      NotificationManager.success('Employees uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      NotificationManager.error('Failed to upload file. Please check the file format.');
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle add access level
  const handleAddAccessLevel = async () => {
    if (!newAccessLevel.trim()) {
      NotificationManager.warning('Please enter an access level name');
      return;
    }

    try {
      await dispatch(addAccessLevel({ name: newAccessLevel.trim() }));
      setNewAccessLevel('');
      setShowAccessLevelModal(false);
      NotificationManager.success('Access level added successfully!');
    } catch (err) {
      console.error('Add access level error', err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.Message ||
        err?.message ||
        'Failed to add access level';

      // NotificationManager.error(message);
    }
  };

  // Handle add business unit
  const handleAddBusinessUnit = async () => {
    if (!newBusinessUnit.trim()) {
      NotificationManager.warning('Please enter a business unit name');
      return;
    }

    try {
      await dispatch(addBusinessUnit({ name: newBusinessUnit.trim() }));
      setNewBusinessUnit('');
      setShowBusinessUnitModal(false);
      NotificationManager.success('Business unit added successfully!');
    } catch (err) {
      console.error('Add business unit error', err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.Message ||
        err?.message ||
        'Failed to add business unit';

      // NotificationManager.error(message);
    }
  };

  // Handle add employee
  const handleAddEmployee = () => {
    setNewEmployee({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      accessLevel: '',
      businessUnits: [],
      contactNumber: '',
      location: companyLocation
    });
    setBusinessUnitSearch('');
    setShowEmployeeModal(true);
  };

  // Handle save employee
  const handleSaveEmployee = async () => {
    // Basic validation
    if (!newEmployee.firstName?.trim() || !newEmployee.lastName?.trim() || !newEmployee.email?.trim() || !newEmployee.accessLevel?.trim()) {
      NotificationManager.warning('Please fill all required fields');
      return;
    }

    if (!Array.isArray(newEmployee.businessUnits) || newEmployee.businessUnits.length === 0) {
      NotificationManager.warning('Please select at least one business unit');
      return;
    }

    // Prepare payload
    const businessUnitsArray = newEmployee.businessUnits.map(s => String(s));
    const businessUnitString = businessUnitsArray.join(',');

    const dto = {
      FirstName: newEmployee.firstName.trim(),
      MiddleName: newEmployee.middleName?.trim() || null,
      LastName: newEmployee.lastName?.trim() || null,
      Email: newEmployee.email.trim(),
      BusinessUnits: businessUnitsArray,
      BusinessUnit: businessUnitString,
      AccessLevel: newEmployee.accessLevel,
      ContactNumber: newEmployee.contactNumber?.trim() || null,
      Location: companyLocation || null,
      ForcePasswordReset: true
    };

    try {
      await dispatch(createUser(dto));
      setShowEmployeeModal(false);
      setNewEmployee({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        accessLevel: '',
        businessUnits: [],
        contactNumber: '',
        location: companyLocation
      });
      NotificationManager.success('Employee added successfully!');
    } catch (err) {
      console.error('Create user error', err);
      NotificationManager.error('Failed to add employee');
    }
  };

  const getBusinessUnitId = (businessUnit) => {
    return (
      businessUnit?.businessUnitId ??
      businessUnit?.BusinessUnitId ??
      businessUnit?.id ??
      businessUnit?.Id
    );
  };

  const openDeleteBusinessUnitDialog = (businessUnit) => {
    setBusinessUnitToDelete(businessUnit);
    setDeleteBusinessUnitDialogOpen(true);
  };

  const closeDeleteBusinessUnitDialog = () => {
    setDeleteBusinessUnitDialogOpen(false);
    setBusinessUnitToDelete(null);
  };

  const handleDeleteBusinessUnit = async () => {
    if (!businessUnitToDelete) return;

    const id = getBusinessUnitId(businessUnitToDelete);

    if (!id) {
      NotificationManager.error('Unable to identify the Business Unit.');
      return;
    }

    try {
      await dispatch(deleteBusinessUnit(id));

      closeDeleteBusinessUnitDialog();

      // Clear selected unit from employee form if it was selected
      const deletedLabel = normalizeMetaLabel(businessUnitToDelete);

      setNewEmployee(prev => ({
        ...prev,
        businessUnits: (prev.businessUnits || []).filter(
          unit => unit !== deletedLabel
        )
      }));
    } catch (err) {
      console.error('Delete business unit error:', err);
    }
  };
  return (
    <div className={classes.root}>
      <Helmet>
        <title>Quick Actions</title>
        <meta name="description" content="Quick Actions - Manage your organization efficiently" />
      </Helmet>

      <PageTitleBar title={<IntlMessages id="Quick Actions" />} match={match} />

      <Container className={classes.container}>
        <div className={classes.content}>
          {/* Quick Actions Section */}
          <div className={classes.quickActionsSection}>
            <QuickActions
              onFileUpload={handleFileUpload}
              onOpenAddEmployee={handleAddEmployee}
              onOpenAddAccessLevel={() => setShowAccessLevelModal(true)}
              onOpenAddBusinessUnit={() => setShowBusinessUnitModal(true)}
              companyDetailsPath={companyDetailsPath}
              //   onDownloadTemplate={handleDownloadTemplate}
              showTemplateDownload={true}
              uploadLoading={uploadLoading}
            />
          </div>

          {/* Information Section */}
          <div className={classes.infoSection}>
            {/* Current Status */}
            <Paper className={classes.infoCard}>
              <Typography variant="h5" gutterBottom color="primary">
                📊 Current Status
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="h4" color="primary" align="center">
                    {businessUnitsMeta.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    Business Units
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" color="secondary" align="center">
                    {accessLevels.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    Access Levels
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Available Business Units */}
            <Paper className={classes.infoListCard}>
              <Typography variant="h6" className={classes.listHeader} color="primary">
                <BusinessIcon fontSize="small" />
                Available Business Units
              </Typography>

              <Box>
                {businessUnitsMeta.length > 0 ? (
                  businessUnitsMeta.map((bu, index) => {
                    const label = normalizeMetaLabel(bu);
                    const id = getBusinessUnitId(bu);

                    return (
                      <Box key={id || index} className={classes.metaItem}>
                        <Box className={classes.metaItemContent}>
                          <BusinessIcon
                            fontSize="small"
                            color="primary"
                          />

                          <Chip
                            label={label}
                            variant="outlined"
                            color="primary"
                            className={classes.metaChip}
                          />
                        </Box>

                        <IconButton
                          size="small"
                          color="secondary"
                          className={classes.deleteMetaButton}
                          onClick={() => openDeleteBusinessUnitDialog(bu)}
                          disabled={!id || userState.loading}
                          title={`Delete ${label}`}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="body2" className={classes.emptyText}>
                    No business units available
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Available Access Levels */}
            <Paper className={classes.infoListCard}>
              <Typography variant="h6" className={classes.listHeader} color="secondary">
                <SecurityIcon fontSize="small" />
                Available Access Levels
              </Typography>

              <Box className={classes.chipWrap}>
                {accessLevels.length > 0 ? (
                  accessLevels.map((a, index) => {
                    const label = normalizeMetaLabel(a);
                    return (
                      <Chip
                        key={index}
                        label={label}
                        variant="outlined"
                        color="secondary"
                        className={classes.metaChip}
                      />
                    );
                  })
                ) : (
                  <Typography variant="body2" className={classes.emptyText}>
                    No access levels available
                  </Typography>
                )}
              </Box>
            </Paper>
          </div>
        </div>
      </Container>

      {/* Add Employee Modal */}
      <Dialog
        open={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        maxWidth="md"
        fullWidth
        className={classes.modal}
      >
        <DialogTitle className={classes.modalHeader}>
          <Typography className={classes.modalTitle}>
            <PersonIcon color="primary" />
            Add New Employee
          </Typography>
          <IconButton onClick={() => setShowEmployeeModal(false)}>
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
                  value={newEmployee.firstName}
                  onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                  className={classes.textField}
                  variant="outlined"
                  InputLabelProps={{ className: classes.requiredLabel }}
                // required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  value={newEmployee.middleName}
                  onChange={(e) => setNewEmployee({ ...newEmployee, middleName: e.target.value })}
                  className={classes.textField}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={newEmployee.lastName}
                  onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                  className={classes.textField}
                  variant="outlined"
                  InputLabelProps={{ className: classes.requiredLabel }}
                // required
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
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className={classes.textField}
                  variant="outlined"
                  InputLabelProps={{ className: classes.requiredLabel }}
                // required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  value={newEmployee.contactNumber}
                  onChange={(e) => setNewEmployee({ ...newEmployee, contactNumber: e.target.value })}
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
                    value={newEmployee.accessLevel}
                    onChange={(e) => setNewEmployee({ ...newEmployee, accessLevel: e.target.value })}
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
                    const isSelected = newEmployee.businessUnits.includes(label);
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
              {newEmployee.businessUnits.length > 0 && (
                <Box className={classes.selectedChips}>
                  <Typography variant="caption" color="textSecondary" style={{ width: '100%' }}>
                    Selected ({newEmployee.businessUnits.length}):
                  </Typography>
                  {newEmployee.businessUnits.map((unit, index) => (
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
            onClick={() => setShowEmployeeModal(false)}
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
            disabled={!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.accessLevel || newEmployee.businessUnits.length === 0}
          >
            Add Employee
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Access Level Modal */}
      <Dialog
        open={showAccessLevelModal}
        onClose={() => setShowAccessLevelModal(false)}
        maxWidth="sm"
        fullWidth
        className={classes.modal}
      >
        <DialogTitle className={classes.modalHeader}>
          <Typography className={classes.modalTitle}>
            <SecurityIcon color="primary" />
            Add New Access Level
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.modalContent}>
          <TextField
            fullWidth
            label="Access Level Name"
            value={newAccessLevel}
            onChange={(e) => setNewAccessLevel(e.target.value)}
            className={classes.textField}
            variant="outlined"
            placeholder="Enter access level name (e.g., 'Super Admin')"
            InputLabelProps={{ className: classes.requiredLabel }}
          // required
          />
          <Box mt={2} p={2} bgcolor="info.light" borderRadius={8}>
            <Typography variant="body2" color="info.dark">
              This access level will be available when adding new employees.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions className={classes.modalActions}>
          <Button
            onClick={() => setShowAccessLevelModal(false)}
            className={classes.cancelButton}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddAccessLevel}
            variant="contained"
            color="primary"
            className={classes.actionButton}
            disabled={!newAccessLevel.trim()}
          >
            Add Access Level
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Business Unit Modal */}
      <Dialog
        open={showBusinessUnitModal}
        onClose={() => setShowBusinessUnitModal(false)}
        maxWidth="sm"
        fullWidth
        className={classes.modal}
      >
        <DialogTitle className={classes.modalHeader}>
          <Typography className={classes.modalTitle}>
            <BusinessIcon color="primary" />
            Add New Business Unit
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.modalContent}>
          <TextField
            fullWidth
            label="Business Unit Name"
            value={newBusinessUnit}
            onChange={(e) => setNewBusinessUnit(e.target.value)}
            className={classes.textField}
            variant="outlined"
            placeholder="Enter business unit name (e.g., 'Customer Support')"
            InputLabelProps={{ className: classes.requiredLabel }}
          // required
          />
          <Box mt={2} p={2} bgcolor="info.light" borderRadius={8}>
            <Typography variant="body2" color="info.dark">
              This business unit will be available when adding new employees.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions className={classes.modalActions}>
          <Button
            onClick={() => setShowBusinessUnitModal(false)}
            className={classes.cancelButton}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddBusinessUnit}
            variant="contained"
            color="primary"
            className={classes.actionButton}
            disabled={!newBusinessUnit.trim()}
          >
            Add Business Unit
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Business Unit Confirmation */}
      <Dialog
        open={deleteBusinessUnitDialogOpen}
        onClose={closeDeleteBusinessUnitDialog}
        maxWidth="sm"
        fullWidth
        className={classes.modal}
      >
        <DialogTitle className={classes.modalHeader}>
          <Typography className={classes.modalTitle}>
            <DeleteIcon color="primary" />
            Delete Business Unit
          </Typography>

          <IconButton onClick={closeDeleteBusinessUnitDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className={classes.modalContent}>
          <Typography variant="body1">
            Are you sure you want to delete the Business Unit
            {' '}
            <strong>
              {normalizeMetaLabel(businessUnitToDelete)}
            </strong>
            ?
          </Typography>

          <Typography
            variant="body2"
            className={classes.confirmDeleteText}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions className={classes.modalActions}>
          <Button
            onClick={closeDeleteBusinessUnitDialog}
            className={classes.cancelButton}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeleteBusinessUnit}
            variant="contained"
            color="secondary"
            className={classes.actionButton}
            startIcon={<DeleteIcon />}
            disabled={userState.loading || !businessUnitToDelete}
          >
            Delete Business Unit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}