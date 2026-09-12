import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import IntlMessages from 'Util/IntlMessages';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';

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
  Paper,
  Divider,
} from '@material-ui/core';

import {
  Search as SearchIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  ArrowForward as ArrowForwardIcon,
  LocationOn as LocationIcon,
  InfoOutlined as InfoIcon,
} from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';

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

import QuickActions from './QuickActions';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '85vh',
    backgroundColor: '#f6f8fb',
    paddingBottom: theme.spacing(6),
  },

  container: {
    maxWidth: 1280,
    margin: '0 auto',
    paddingTop: theme.spacing(3),
  },

  pageIntro: {
    marginBottom: theme.spacing(4),
  },

  introTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#172033',
    letterSpacing: '-0.5px',

    [theme.breakpoints.down('sm')]: {
      fontSize: '1.6rem',
    },
  },

  introSubtitle: {
    marginTop: theme.spacing(0.75),
    color: '#718096',
    fontSize: '0.98rem',
    maxWidth: 720,
  },

  content: {
    display: 'grid',
    gridTemplateColumns: 'minmax(320px, 390px) minmax(0, 1fr)',
    gap: theme.spacing(3),

    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },

  quickActionsSection: {
    minWidth: 0,
  },

  infoSection: {
    minWidth: 0,
  },

  statsGrid: {
    marginBottom: theme.spacing(3),
  },

  statCard: {
    position: 'relative',
    height: '100%',
    padding: theme.spacing(2.5),
    borderRadius: 18,
    backgroundColor: '#ffffff',
    border: '1px solid #e8edf3',
    boxShadow: '0 5px 20px rgba(31, 41, 55, 0.06)',
    overflow: 'hidden',
    transition: 'all 0.25s ease',

    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 12px 28px rgba(31, 41, 55, 0.09)',
    },
  },

  statAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    background: '#3f51b5',
  },

  statAccentSecondary: {
    background: '#7c4dff',
  },

  statTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },

  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
    color: '#3f51b5',
  },

  statIconSecondary: {
    backgroundColor: '#f3ecff',
    color: '#7c4dff',
  },

  statValue: {
    fontSize: '2rem',
    fontWeight: 800,
    lineHeight: 1,
    color: '#172033',
    marginBottom: theme.spacing(0.5),
  },

  statLabel: {
    fontSize: '0.85rem',
    color: '#718096',
    fontWeight: 500,
  },

  statDescription: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: theme.spacing(1.5),
    color: '#9aa5b1',
    fontSize: '0.75rem',
  },

  listCard: {
    borderRadius: 18,
    backgroundColor: '#ffffff',
    border: '1px solid #e8edf3',
    boxShadow: '0 5px 20px rgba(31, 41, 55, 0.06)',
    marginBottom: theme.spacing(3),
    overflow: 'hidden',
  },

  listCardHeader: {
    padding: theme.spacing(2.25, 2.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  listTitleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
  },

  listTitleIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
    color: '#3f51b5',
  },

  listTitleIconSecondary: {
    backgroundColor: '#f3ecff',
    color: '#7c4dff',
  },

  listTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#172033',
  },

  listSubtitle: {
    fontSize: '0.77rem',
    color: '#8a96a3',
    marginTop: 2,
  },

  countBadge: {
    minWidth: 28,
    height: 28,
    padding: '0 8px',
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f4f8',
    color: '#5d6875',
    fontWeight: 700,
    fontSize: '0.78rem',
  },

  listBody: {
    padding: theme.spacing(0, 2.5, 2.5),
  },

  businessUnitRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1.25, 1.5),
    marginBottom: theme.spacing(1),
    border: '1px solid #edf0f4',
    borderRadius: 12,
    backgroundColor: '#fbfcfe',
    transition: 'all 0.2s ease',

    '&:hover': {
      backgroundColor: '#f6f8ff',
      borderColor: '#dfe5f5',
    },

    '&:last-child': {
      marginBottom: 0,
    },
  },

  businessUnitLeft: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
  },

  businessUnitIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1.25),
    backgroundColor: '#eef2ff',
    color: '#3f51b5',
    flexShrink: 0,
  },

  businessUnitName: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#263246',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  businessUnitDelete: {
    color: '#9ba5b1',
    transition: 'all 0.2s ease',

    '&:hover': {
      color: '#e53935',
      backgroundColor: '#fff1f1',
    },
  },

  accessChipWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },

  accessChip: {
    height: 34,
    borderRadius: 9,
    border: '1px solid #ddd8fb',
    backgroundColor: '#f8f6ff',
    color: '#6547b8',
    fontWeight: 600,
    fontSize: '0.78rem',
    padding: '0 3px',

    '& .MuiChip-label': {
      paddingLeft: 10,
      paddingRight: 10,
    },
  },

  emptyState: {
    padding: theme.spacing(3),
    textAlign: 'center',
    border: '1px dashed #dce2e9',
    borderRadius: 12,
    backgroundColor: '#fafbfc',
  },

  emptyIcon: {
    color: '#b6bec8',
    fontSize: 34,
    marginBottom: theme.spacing(0.75),
  },

  emptyText: {
    color: '#8a96a3',
    fontSize: '0.85rem',
  },

  modal: {
    '& .MuiDialog-paper': {
      borderRadius: 20,
      boxShadow: '0 24px 70px rgba(15, 23, 42, 0.22)',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
    },
  },

  modalHeader: {
    padding: theme.spacing(2.5, 3),
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #edf0f4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
  },

  modalHeaderIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    color: '#3f51b5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalHeaderIconDanger: {
    backgroundColor: '#fff1f1',
    color: '#e53935',
  },

  modalTitle: {
    color: '#172033',
    fontSize: '1.15rem',
    fontWeight: 750,
  },

  modalSubtitle: {
    color: '#8a96a3',
    fontSize: '0.8rem',
    marginTop: 2,
  },

  modalClose: {
    color: '#8e98a5',

    '&:hover': {
      backgroundColor: '#f5f6f8',
      color: '#4a5568',
    },
  },

  modalContent: {
    padding: theme.spacing(3),

    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },

  formSection: {
    marginBottom: theme.spacing(2.5),
    padding: theme.spacing(2),
    border: '1px solid #edf0f4',
    borderRadius: 14,
    backgroundColor: '#fbfcfe',
  },

  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.8),
    color: '#283448',
    fontSize: '0.9rem',
    fontWeight: 700,
    marginBottom: theme.spacing(1.75),
  },

  sectionTitleIcon: {
    color: '#6675c4',
    fontSize: 19,
  },

  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 10,
      backgroundColor: '#ffffff',
      transition: 'all 0.2s ease',

      '& fieldset': {
        borderColor: '#dde3ea',
      },

      '&:hover fieldset': {
        borderColor: '#b8c2cf',
      },

      '&.Mui-focused fieldset': {
        borderColor: '#3f51b5',
      },
    },

    '& .MuiInputLabel-outlined': {
      color: '#7a8592',
    },
  },

  requiredLabel: {
    '&::after': {
      content: '" *"',
      color: '#e53935',
    },
  },

  businessUnitsSection: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.75),
    backgroundColor: '#ffffff',
    border: '1px solid #e6eaf0',
    borderRadius: 14,
  },

  businessUnitSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1.25),
  },

  businessUnitSectionTitle: {
    fontSize: '0.87rem',
    fontWeight: 700,
    color: '#2f3b4d',
  },

  requiredIndicator: {
    color: '#e53935',
  },

  searchBox: {
    marginBottom: theme.spacing(1.5),

    '& .MuiOutlinedInput-root': {
      borderRadius: 10,
      backgroundColor: '#fbfcfe',
    },
  },

  businessUnitsGrid: {
    maxHeight: 210,
    overflowY: 'auto',
    padding: theme.spacing(0.75),
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    border: '1px solid #edf0f4',

    '&::-webkit-scrollbar': {
      width: 6,
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#cbd2db',
      borderRadius: 10,
    },
  },

  businessUnitItem: {
    margin: 0,
    padding: theme.spacing(0.5, 1),
    minHeight: 42,
    borderRadius: 8,

    '&:hover': {
      backgroundColor: '#eef2ff',
    },

    '& .MuiFormControlLabel-label': {
      width: '100%',
    },
  },

  selectedChips: {
    marginTop: theme.spacing(1.5),
    padding: theme.spacing(1.25),
    backgroundColor: '#f3f5ff',
    borderRadius: 10,
    border: '1px solid #e2e6fb',
  },

  selectedLabel: {
    fontSize: '0.72rem',
    color: '#737e8c',
    fontWeight: 600,
    marginBottom: theme.spacing(0.8),
  },

  chip: {
    borderRadius: 7,
    backgroundColor: '#3f51b5',
    color: '#ffffff',
    fontWeight: 600,
    marginRight: 5,
    marginBottom: 5,
  },

  modalInfoBox: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: 10,
    backgroundColor: '#f4f7ff',
    border: '1px solid #e0e6ff',
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
  },

  modalInfoIcon: {
    color: '#6675c4',
    marginTop: 1,
  },

  modalInfoText: {
    color: '#667085',
    fontSize: '0.78rem',
    lineHeight: 1.5,
  },

  modalActions: {
    padding: theme.spacing(1.75, 3),
    borderTop: '1px solid #edf0f4',
    backgroundColor: '#fbfcfd',
    gap: theme.spacing(1),
  },

  cancelButton: {
    textTransform: 'none',
    borderRadius: 10,
    padding: theme.spacing(1, 2.2),
    color: '#667085',
    fontWeight: 600,
  },

  actionButton: {
    textTransform: 'none',
    borderRadius: 10,
    padding: theme.spacing(1, 2.2),
    fontWeight: 700,
    boxShadow: 'none',

    '&:hover': {
      boxShadow: '0 7px 18px rgba(63, 81, 181, 0.18)',
    },
  },

  dangerButton: {
    backgroundColor: '#e53935',
    color: '#ffffff',

    '&:hover': {
      backgroundColor: '#d32f2f',
      boxShadow: '0 7px 18px rgba(229, 57, 53, 0.18)',
    },
  },

  deleteText: {
    color: '#4b5563',
    fontSize: '0.95rem',
    lineHeight: 1.6,
  },

  deleteWarning: {
    marginTop: theme.spacing(1.5),
    color: '#8a96a3',
    fontSize: '0.82rem',
  },
}));

function normalizeMetaLabel(item) {
  if (item == null) return '';
  if (typeof item === 'string') return item;
  return item.name ?? item.displayName ?? item.label ?? item.value ?? '';
}

export default function QuickActionsContainer({ match }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const companyState = useSelector((state) => state.company);
  const userState = useSelector((state) => state.user);

  const accessLevels = userState?.accessLevels ?? [];
  const businessUnitsMeta = userState?.businessUnits ?? [];

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showAccessLevelModal, setShowAccessLevelModal] = useState(false);
  const [showBusinessUnitModal, setShowBusinessUnitModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteBusinessUnitDialogOpen, setDeleteBusinessUnitDialogOpen] = useState(false);
  const [businessUnitToDelete, setBusinessUnitToDelete] = useState(null);

  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    accessLevel: '',
    businessUnits: [],
    contactNumber: '',
    location: '',
  });

  const [newAccessLevel, setNewAccessLevel] = useState('');
  const [newBusinessUnit, setNewBusinessUnit] = useState('');
  const [businessUnitSearch, setBusinessUnitSearch] = useState('');

  const parentBase = match?.url
    ? match.url.replace(/\/[^/]+$/, '')
    : '/app/dashboard';

  const companyDetailsPath = `${parentBase}/company-details`;

  useEffect(() => {
    dispatch(fetchCompanyDetails());
    dispatch(fetchBusinessUnits());
    dispatch(fetchAccessLevels());
  }, [dispatch]);

  const companyLocation =
    companyState?.company?.location ??
    companyState?.company?.Location ??
    '';

  const filteredBusinessUnits = businessUnitsMeta.filter((bu) => {
    const label = normalizeMetaLabel(bu);

    return label
      .toLowerCase()
      .includes(businessUnitSearch.toLowerCase());
  });

  const handleBusinessUnitToggle = (businessUnit) => {
    const label = normalizeMetaLabel(businessUnit);

    setNewEmployee((prev) => {
      const currentUnits = prev.businessUnits || [];

      if (currentUnits.includes(label)) {
        return {
          ...prev,
          businessUnits: currentUnits.filter(
            (unit) => unit !== label
          ),
        };
      }

      return {
        ...prev,
        businessUnits: [...currentUnits, label],
      };
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];

    if (
      !validTypes.includes(file.type) &&
      !file.name.match(/\.(xlsx|xls|csv)$/)
    ) {
      NotificationManager.error(
        'Please upload a valid Excel or CSV file'
      );

      return;
    }

    setUploadLoading(true);

    try {
      await dispatch(uploadUsersExcel(file));

      NotificationManager.success(
        'Employees uploaded successfully!'
      );
    } catch (err) {
      console.error('Upload error:', err);

      NotificationManager.error(
        'Failed to upload file. Please check the file format.'
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const handleAddAccessLevel = async () => {
    if (!newAccessLevel.trim()) {
      NotificationManager.warning(
        'Please enter an access level name'
      );

      return;
    }

    try {
      await dispatch(
        addAccessLevel({
          name: newAccessLevel.trim(),
        })
      );

      setNewAccessLevel('');
      setShowAccessLevelModal(false);

      NotificationManager.success(
        'Access level added successfully!'
      );
    } catch (err) {
      console.error('Add access level error', err);
    }
  };

  const handleAddBusinessUnit = async () => {
    if (!newBusinessUnit.trim()) {
      NotificationManager.warning(
        'Please enter a business unit name'
      );

      return;
    }

    try {
      await dispatch(
        addBusinessUnit({
          name: newBusinessUnit.trim(),
        })
      );

      setNewBusinessUnit('');
      setShowBusinessUnitModal(false);

      NotificationManager.success(
        'Business unit added successfully!'
      );
    } catch (err) {
      console.error('Add business unit error', err);
    }
  };

  const handleAddEmployee = () => {
    setNewEmployee({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      accessLevel: '',
      businessUnits: [],
      contactNumber: '',
      location: companyLocation,
    });

    setBusinessUnitSearch('');
    setShowEmployeeModal(true);
  };

  const handleSaveEmployee = async () => {
    if (
      !newEmployee.firstName?.trim() ||
      !newEmployee.lastName?.trim() ||
      !newEmployee.email?.trim() ||
      !newEmployee.accessLevel?.trim()
    ) {
      NotificationManager.warning(
        'Please fill all required fields'
      );

      return;
    }

    if (
      !Array.isArray(newEmployee.businessUnits) ||
      newEmployee.businessUnits.length === 0
    ) {
      NotificationManager.warning(
        'Please select at least one business unit'
      );

      return;
    }

    const businessUnitsArray =
      newEmployee.businessUnits.map((s) => String(s));

    const businessUnitString =
      businessUnitsArray.join(',');

    const dto = {
      FirstName: newEmployee.firstName.trim(),
      MiddleName:
        newEmployee.middleName?.trim() || null,
      LastName:
        newEmployee.lastName?.trim() || null,
      Email: newEmployee.email.trim(),
      BusinessUnits: businessUnitsArray,
      BusinessUnit: businessUnitString,
      AccessLevel: newEmployee.accessLevel,
      ContactNumber:
        newEmployee.contactNumber?.trim() || null,
      Location: companyLocation || null,
      ForcePasswordReset: true,
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
        location: companyLocation,
      });

      NotificationManager.success(
        'Employee added successfully!'
      );
    } catch (err) {
      console.error('Create user error', err);

      NotificationManager.error(
        'Failed to add employee'
      );
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

    const id = getBusinessUnitId(
      businessUnitToDelete
    );

    if (!id) {
      NotificationManager.error(
        'Unable to identify the Business Unit.'
      );

      return;
    }

    try {
      await dispatch(deleteBusinessUnit(id));

      closeDeleteBusinessUnitDialog();

      const deletedLabel =
        normalizeMetaLabel(businessUnitToDelete);

      setNewEmployee((prev) => ({
        ...prev,
        businessUnits: (prev.businessUnits || []).filter(
          (unit) => unit !== deletedLabel
        ),
      }));
    } catch (err) {
      console.error(
        'Delete business unit error:',
        err
      );
    }
  };

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Quick Actions</title>
        <meta
          name="description"
          content="Quick Actions - Manage your organization efficiently"
        />
      </Helmet>

      {/* <PageTitleBar
        title={<IntlMessages id="Quick Actions" />}
        match={match}
      /> */}

      <Container className={classes.container}>
        <Box className={classes.pageIntro}>
          <Typography className={classes.introTitle}>
            Organization Overview
          </Typography>

          <Typography className={classes.introSubtitle}>
            Manage employees, business units, access levels,
            and company information from one place.
          </Typography>
        </Box>

        <Box className={classes.content}>
          <Box className={classes.quickActionsSection}>
            <QuickActions
              onFileUpload={handleFileUpload}
              onOpenAddEmployee={handleAddEmployee}
              onOpenAddAccessLevel={() =>
                setShowAccessLevelModal(true)
              }
              onOpenAddBusinessUnit={() =>
                setShowBusinessUnitModal(true)
              }
              companyDetailsPath={companyDetailsPath}
              showTemplateDownload={true}
              uploadLoading={uploadLoading}
            />
          </Box>

          <Box className={classes.infoSection}>
            {/* Statistics */}
            <Grid
              container
              spacing={2}
              className={classes.statsGrid}
            >
              <Grid item xs={12} sm={6}>
                <Paper className={classes.statCard}>
                  <Box
                    className={classes.statAccent}
                  />

                  <Box className={classes.statTop}>
                    <Box>
                      <Typography
                        className={classes.statValue}
                      >
                        {businessUnitsMeta.length}
                      </Typography>

                      <Typography
                        className={classes.statLabel}
                      >
                        Business Units
                      </Typography>
                    </Box>

                    <Box className={classes.statIcon}>
                      <BusinessIcon />
                    </Box>
                  </Box>

                  <Typography className={classes.statDescription}>
                    <ArrowForwardIcon
                      style={{ fontSize: 13 }}
                    />
                    Available for employee assignment
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper className={classes.statCard}>
                  <Box
                    className={`${classes.statAccent} ${classes.statAccentSecondary}`}
                  />

                  <Box className={classes.statTop}>
                    <Box>
                      <Typography
                        className={classes.statValue}
                      >
                        {accessLevels.length}
                      </Typography>

                      <Typography
                        className={classes.statLabel}
                      >
                        Access Levels
                      </Typography>
                    </Box>

                    <Box
                      className={`${classes.statIcon} ${classes.statIconSecondary}`}
                    >
                      <SecurityIcon />
                    </Box>
                  </Box>

                  <Typography className={classes.statDescription}>
                    <ArrowForwardIcon
                      style={{ fontSize: 13 }}
                    />
                    Permission levels currently configured
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Business Units */}
            <Paper className={classes.listCard}>
              <Box className={classes.listCardHeader}>
                <Box className={classes.listTitleWrap}>
                  <Box className={classes.listTitleIcon}>
                    <BusinessIcon fontSize="small" />
                  </Box>

                  <Box>
                    <Typography
                      className={classes.listTitle}
                    >
                      Business Units
                    </Typography>

                    <Typography
                      className={classes.listSubtitle}
                    >
                      Manage available organizational units
                    </Typography>
                  </Box>
                </Box>

                <Box className={classes.countBadge}>
                  {businessUnitsMeta.length}
                </Box>
              </Box>

              <Divider />

              <Box className={classes.listBody}>
                {businessUnitsMeta.length > 0 ? (
                  businessUnitsMeta.map((bu, index) => {
                    const label =
                      normalizeMetaLabel(bu);

                    const id =
                      getBusinessUnitId(bu);

                    return (
                      <Box
                        key={id || index}
                        className={classes.businessUnitRow}
                      >
                        <Box
                          className={
                            classes.businessUnitLeft
                          }
                        >
                          <Box
                            className={
                              classes.businessUnitIcon
                            }
                          >
                            <BusinessIcon fontSize="small" />
                          </Box>

                          <Typography
                            className={
                              classes.businessUnitName
                            }
                          >
                            {label}
                          </Typography>
                        </Box>

                        <IconButton
                          size="small"
                          className={
                            classes.businessUnitDelete
                          }
                          onClick={() =>
                            openDeleteBusinessUnitDialog(
                              bu
                            )
                          }
                          disabled={
                            !id || userState.loading
                          }
                          title={`Delete ${label}`}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    );
                  })
                ) : (
                  <Box className={classes.emptyState}>
                    <BusinessIcon
                      className={classes.emptyIcon}
                    />

                    <Typography
                      className={classes.emptyText}
                    >
                      No business units available yet.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Access Levels */}
            <Paper className={classes.listCard}>
              <Box className={classes.listCardHeader}>
                <Box className={classes.listTitleWrap}>
                  <Box
                    className={`${classes.listTitleIcon} ${classes.listTitleIconSecondary}`}
                  >
                    <SecurityIcon fontSize="small" />
                  </Box>

                  <Box>
                    <Typography
                      className={classes.listTitle}
                    >
                      Access Levels
                    </Typography>

                    <Typography
                      className={classes.listSubtitle}
                    >
                      Roles available for employee access
                    </Typography>
                  </Box>
                </Box>

                <Box className={classes.countBadge}>
                  {accessLevels.length}
                </Box>
              </Box>

              <Divider />

              <Box className={classes.listBody}>
                {accessLevels.length > 0 ? (
                  <Box
                    className={classes.accessChipWrap}
                  >
                    {accessLevels.map((a, index) => {
                      const label =
                        normalizeMetaLabel(a);

                      return (
                        <Chip
                          key={index}
                          label={label}
                          className={classes.accessChip}
                        />
                      );
                    })}
                  </Box>
                ) : (
                  <Box className={classes.emptyState}>
                    <SecurityIcon
                      className={classes.emptyIcon}
                    />

                    <Typography
                      className={classes.emptyText}
                    >
                      No access levels available yet.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* =========================================================
          ADD EMPLOYEE
      ========================================================= */}
      <Dialog
        open={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        maxWidth="md"
        fullWidth
        className={classes.modal}
      >
        <DialogTitle className={classes.modalHeader}>
          <Box className={classes.modalHeaderLeft}>
            <Box className={classes.modalHeaderIcon}>
              <PersonIcon />
            </Box>

            <Box>
              <Typography
                className={classes.modalTitle}
              >
                Add New Employee
              </Typography>

              <Typography
                className={classes.modalSubtitle}
              >
                Create an employee account and assign access.
              </Typography>
            </Box>
          </Box>

          <IconButton
            className={classes.modalClose}
            onClick={() =>
              setShowEmployeeModal(false)
            }
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className={classes.modalContent}>
          {/* Personal */}
          <Box className={classes.formSection}>
            <Typography className={classes.sectionTitle}>
              <PersonIcon
                className={classes.sectionTitleIcon}
              />
              Personal Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={newEmployee.firstName}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      firstName: e.target.value,
                    })
                  }
                  className={classes.textField}
                  variant="outlined"
                  InputLabelProps={{
                    className:
                      classes.requiredLabel,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  value={newEmployee.middleName}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      middleName: e.target.value,
                    })
                  }
                  className={classes.textField}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={newEmployee.lastName}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      lastName: e.target.value,
                    })
                  }
                  className={classes.textField}
                  variant="outlined"
                  InputLabelProps={{
                    className:
                      classes.requiredLabel,
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Contact */}
          <Box className={classes.formSection}>
            <Typography className={classes.sectionTitle}>
              <EmailIcon
                className={classes.sectionTitleIcon}
              />
              Contact Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      email: e.target.value,
                    })
                  }
                  className={classes.textField}
                  variant="outlined"
                  InputLabelProps={{
                    className:
                      classes.requiredLabel,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  value={newEmployee.contactNumber}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      contactNumber:
                        e.target.value,
                    })
                  }
                  className={classes.textField}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Access */}
          <Box className={classes.formSection}>
            <Typography className={classes.sectionTitle}>
              <SecurityIcon
                className={classes.sectionTitleIcon}
              />
              Access & Organization
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className={classes.textField}
                >
                  <InputLabel
                    className={
                      classes.requiredLabel
                    }
                  >
                    Access Level
                  </InputLabel>

                  <Select
                    value={newEmployee.accessLevel}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        accessLevel:
                          e.target.value,
                      })
                    }
                    label="Access Level"
                    required
                  >
                    <MenuItem value="">
                      <em>Select Access Level</em>
                    </MenuItem>

                    {accessLevels.map((a, i) => {
                      const label =
                        normalizeMetaLabel(a);

                      return (
                        <MenuItem
                          key={i}
                          value={label}
                        >
                          {label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={
                    companyLocation ||
                    'No company location set'
                  }
                  className={classes.textField}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon
                          style={{
                            color: '#8994a3',
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Employee location follows the company location."
                />
              </Grid>
            </Grid>

            {/* Business Units */}
            <Box
              className={
                classes.businessUnitsSection
              }
            >
              <Box
                className={
                  classes.businessUnitSectionHeader
                }
              >
                <Typography
                  className={
                    classes.businessUnitSectionTitle
                  }
                >
                  Business Units{' '}
                  <span
                    className={
                      classes.requiredIndicator
                    }
                  >
                    *
                  </span>
                </Typography>

                {newEmployee.businessUnits.length >
                  0 && (
                  <Typography
                    variant="caption"
                    color="textSecondary"
                  >
                    {
                      newEmployee.businessUnits
                        .length
                    }{' '}
                    selected
                  </Typography>
                )}
              </Box>

              <TextField
                fullWidth
                placeholder="Search business units..."
                value={businessUnitSearch}
                onChange={(e) =>
                  setBusinessUnitSearch(
                    e.target.value
                  )
                }
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

              <Box
                className={
                  classes.businessUnitsGrid
                }
              >
                <FormGroup>
                  {filteredBusinessUnits.map(
                    (bu, i) => {
                      const label =
                        normalizeMetaLabel(bu);

                      const isSelected =
                        newEmployee.businessUnits.includes(
                          label
                        );

                      return (
                        <FormControlLabel
                          key={i}
                          control={
                            <Checkbox
                              checked={isSelected}
                              onChange={() =>
                                handleBusinessUnitToggle(
                                  bu
                                )
                              }
                              color="primary"
                              icon={
                                <CheckIcon
                                  style={{
                                    visibility:
                                      'hidden',
                                  }}
                                />
                              }
                              checkedIcon={
                                <CheckIcon />
                              }
                            />
                          }
                          label={
                            <Box
                              display="flex"
                              alignItems="center"
                            >
                              <BusinessIcon
                                fontSize="small"
                                style={{
                                  marginRight: 8,
                                  color: isSelected
                                    ? '#3f51b5'
                                    : '#9ba5b1',
                                }}
                              />

                              <Typography
                                variant="body2"
                                style={{
                                  fontWeight:
                                    isSelected
                                      ? 600
                                      : 400,
                                  color:
                                    isSelected
                                      ? '#283448'
                                      : '#667085',
                                }}
                              >
                                {label}
                              </Typography>
                            </Box>
                          }
                          className={
                            classes.businessUnitItem
                          }
                        />
                      );
                    }
                  )}

                  {filteredBusinessUnits.length ===
                    0 && (
                    <Box p={2}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        align="center"
                      >
                        No business units found.
                      </Typography>
                    </Box>
                  )}
                </FormGroup>
              </Box>

              {newEmployee.businessUnits.length >
                0 && (
                <Box
                  className={
                    classes.selectedChips
                  }
                >
                  <Typography
                    className={
                      classes.selectedLabel
                    }
                  >
                    SELECTED BUSINESS UNITS
                  </Typography>

                  {newEmployee.businessUnits.map(
                    (unit, index) => (
                      <Chip
                        key={index}
                        label={unit}
                        className={classes.chip}
                        size="small"
                        onDelete={() =>
                          handleBusinessUnitToggle(
                            unit
                          )
                        }
                      />
                    )
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          className={classes.modalActions}
        >
          <Button
            onClick={() =>
              setShowEmployeeModal(false)
            }
            className={classes.cancelButton}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSaveEmployee}
            variant="contained"
            color="primary"
            className={classes.actionButton}
            startIcon={<CheckIcon />}
            disabled={
              !newEmployee.firstName ||
              !newEmployee.lastName ||
              !newEmployee.email ||
              !newEmployee.accessLevel ||
              newEmployee.businessUnits.length === 0
            }
          >
            Add Employee
          </Button>
        </DialogActions>
      </Dialog>

      {/* =========================================================
          ADD ACCESS LEVEL
      ========================================================= */}
      <Dialog
        open={showAccessLevelModal}
        onClose={() =>
          setShowAccessLevelModal(false)
        }
        maxWidth="sm"
        fullWidth
        className={classes.modal}
      >
        <DialogTitle
          className={classes.modalHeader}
        >
          <Box className={classes.modalHeaderLeft}>
            <Box className={classes.modalHeaderIcon}>
              <SecurityIcon />
            </Box>

            <Box>
              <Typography
                className={classes.modalTitle}
              >
                Add Access Level
              </Typography>

              <Typography
                className={classes.modalSubtitle}
              >
                Create a new permission level for employees.
              </Typography>
            </Box>
          </Box>

          <IconButton
            className={classes.modalClose}
            onClick={() =>
              setShowAccessLevelModal(false)
            }
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          className={classes.modalContent}
        >
          <TextField
            fullWidth
            label="Access Level Name"
            value={newAccessLevel}
            onChange={(e) =>
              setNewAccessLevel(e.target.value)
            }
            className={classes.textField}
            variant="outlined"
            placeholder="e.g. Super Admin"
            InputLabelProps={{
              className: classes.requiredLabel,
            }}
          />

          <Box className={classes.modalInfoBox}>
            <InfoIcon
              className={classes.modalInfoIcon}
              fontSize="small"
            />

            <Typography
              className={classes.modalInfoText}
            >
              This access level will become available
              when creating or managing employees.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions
          className={classes.modalActions}
        >
          <Button
            onClick={() =>
              setShowAccessLevelModal(false)
            }
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

      {/* =========================================================
          ADD BUSINESS UNIT
      ========================================================= */}
      <Dialog
        open={showBusinessUnitModal}
        onClose={() =>
          setShowBusinessUnitModal(false)
        }
        maxWidth="sm"
        fullWidth
        className={classes.modal}
      >
        <DialogTitle
          className={classes.modalHeader}
        >
          <Box className={classes.modalHeaderLeft}>
            <Box className={classes.modalHeaderIcon}>
              <BusinessIcon />
            </Box>

            <Box>
              <Typography
                className={classes.modalTitle}
              >
                Add Business Unit
              </Typography>

              <Typography
                className={classes.modalSubtitle}
              >
                Create a new organizational business unit.
              </Typography>
            </Box>
          </Box>

          <IconButton
            className={classes.modalClose}
            onClick={() =>
              setShowBusinessUnitModal(false)
            }
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          className={classes.modalContent}
        >
          <TextField
            fullWidth
            label="Business Unit Name"
            value={newBusinessUnit}
            onChange={(e) =>
              setNewBusinessUnit(e.target.value)
            }
            className={classes.textField}
            variant="outlined"
            placeholder="e.g. Customer Support"
            InputLabelProps={{
              className: classes.requiredLabel,
            }}
          />

          <Box className={classes.modalInfoBox}>
            <InfoIcon
              className={classes.modalInfoIcon}
              fontSize="small"
            />

            <Typography
              className={classes.modalInfoText}
            >
              The new business unit can be assigned
              to employees from the employee form.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions
          className={classes.modalActions}
        >
          <Button
            onClick={() =>
              setShowBusinessUnitModal(false)
            }
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

      {/* =========================================================
          DELETE BUSINESS UNIT
      ========================================================= */}
      <Dialog
        open={deleteBusinessUnitDialogOpen}
        onClose={closeDeleteBusinessUnitDialog}
        maxWidth="sm"
        fullWidth
        className={classes.modal}
      >
        <DialogTitle
          className={classes.modalHeader}
        >
          <Box className={classes.modalHeaderLeft}>
            <Box
              className={`${classes.modalHeaderIcon} ${classes.modalHeaderIconDanger}`}
            >
              <DeleteIcon />
            </Box>

            <Box>
              <Typography
                className={classes.modalTitle}
              >
                Delete Business Unit
              </Typography>

              <Typography
                className={classes.modalSubtitle}
              >
                This action will remove the selected unit.
              </Typography>
            </Box>
          </Box>

          <IconButton
            className={classes.modalClose}
            onClick={closeDeleteBusinessUnitDialog}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          className={classes.modalContent}
        >
          <Typography
            className={classes.deleteText}
          >
            Are you sure you want to delete{' '}
            <strong>
              {normalizeMetaLabel(
                businessUnitToDelete
              )}
            </strong>
            ?
          </Typography>

          <Typography
            className={classes.deleteWarning}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions
          className={classes.modalActions}
        >
          <Button
            onClick={closeDeleteBusinessUnitDialog}
            className={classes.cancelButton}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeleteBusinessUnit}
            variant="contained"
            className={`${classes.actionButton} ${classes.dangerButton}`}
            startIcon={<DeleteIcon />}
            disabled={
              userState.loading ||
              !businessUnitToDelete
            }
          >
            Delete Business Unit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}