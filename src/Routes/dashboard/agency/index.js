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
  Divider,
  CircularProgress,
  Paper,
} from '@material-ui/core';

import {
  Search as SearchIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  InfoOutlined as InfoIcon,
} from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';

import {
  fetchUsers,
  updateUser,
  activateUser,
  inactivateUser,
  fetchBusinessUnits,
  fetchAccessLevels,
} from 'Store/Actions/userActions';

import { fetchCompanyDetails } from 'Store/Actions/companyActions';

import CompanySummary from './CompanySummary';
import EmployeeList from './EmployeeList';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '85vh',
    backgroundColor: '#f6f8fb',
    paddingBottom: theme.spacing(6),
  },

  container: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: theme.spacing(3, 2),

    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2, 1.5),
    },
  },

  // =========================================================
  // PAGE HEADER
  // =========================================================

  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),

    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },

  headerText: {
    marginTop: theme.spacing(1),
  },

  title: {
    color: '#172033',
    fontSize: '1.75rem',
    fontWeight: 800,
    letterSpacing: '-0.4px',

    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem',
    },
  },

  subtitle: {
    color: '#7b8794',
    fontSize: '0.88rem',
    marginTop: theme.spacing(0.6),
    lineHeight: 1.5,
  },

  // =========================================================
  // MAIN GRID
  // =========================================================

  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '310px minmax(0, 1fr)',
    gap: theme.spacing(3),
    alignItems: 'start',

    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },

  summaryColumn: {
    minWidth: 0,
  },

  mainColumn: {
    minWidth: 0,
  },

  // =========================================================
  // STATS
  // =========================================================

  statsGrid: {
    marginBottom: theme.spacing(2.5),
  },

  statCard: {
    position: 'relative',
    borderRadius: 16,
    backgroundColor: '#fff',
    border: '1px solid #e7ecf2',
    boxShadow: '0 5px 20px rgba(31, 41, 55, 0.055)',
    padding: theme.spacing(2),
    overflow: 'hidden',
    transition: 'all 0.25s ease',

    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 27px rgba(31, 41, 55, 0.08)',
    },
  },

  statAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#3f51b5',
  },

  accentGreen: {
    backgroundColor: '#2e9d60',
  },

  accentPurple: {
    backgroundColor: '#7c4dff',
  },

  accentOrange: {
    backgroundColor: '#e79424',
  },

  statTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statValue: {
    fontSize: '1.8rem',
    fontWeight: 800,
    lineHeight: 1,
    color: '#172033',
  },

  statLabel: {
    marginTop: theme.spacing(0.6),
    color: '#727e8c',
    fontSize: '0.76rem',
    fontWeight: 600,
  },

  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
    color: '#3f51b5',
  },

  statIconGreen: {
    backgroundColor: '#edf9f2',
    color: '#2e9d60',
  },

  statIconPurple: {
    backgroundColor: '#f4efff',
    color: '#7c4dff',
  },

  statIconOrange: {
    backgroundColor: '#fff6e9',
    color: '#db8c1c',
  },

  statDescription: {
    marginTop: theme.spacing(1.2),
    color: '#9aa4af',
    fontSize: '0.67rem',
  },

  // =========================================================
  // EDIT MODAL
  // =========================================================

  modal: {
    '& .MuiDialog-paper': {
      borderRadius: 19,
      boxShadow: '0 24px 70px rgba(15, 23, 42, 0.22)',
      overflow: 'hidden',
    },
  },

  modalHeader: {
    padding: theme.spacing(2.25, 2.75),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #edf0f4',
    backgroundColor: '#fff',
  },

  modalHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
  },

  modalIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
    color: '#3f51b5',
  },

  modalTitleBlock: {
    minWidth: 0,
  },

  modalTitle: {
    color: '#202a3b',
    fontSize: '1.08rem',
    fontWeight: 750,
  },

  modalSubtitle: {
    marginTop: 2,
    color: '#8b96a4',
    fontSize: '0.74rem',
  },

  modalClose: {
    color: '#919ba8',

    '&:hover': {
      backgroundColor: '#f4f6f8',
    },
  },

  modalContent: {
    padding: theme.spacing(2.75),

    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },

  formSection: {
    border: '1px solid #edf0f4',
    borderRadius: 14,
    backgroundColor: '#fbfcfe',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.8),
    fontWeight: 700,
    fontSize: '0.86rem',
    color: '#334155',
    marginBottom: theme.spacing(1.75),
  },

  sectionTitleIcon: {
    color: '#6675c4',
    fontSize: 19,
  },

  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 10,
      backgroundColor: '#fff',

      '& fieldset': {
        borderColor: '#dce3ea',
      },

      '&:hover fieldset': {
        borderColor: '#bbc5d0',
      },

      '&.Mui-focused fieldset': {
        borderColor: '#3f51b5',
      },
    },

    '& .MuiInputBase-input': {
      fontSize: '0.84rem',
    },
  },

  requiredLabel: {
    '&::after': {
      content: '" *"',
      color: '#e53935',
    },
  },

  businessUnitsSection: {
    marginTop: theme.spacing(1.5),
    padding: theme.spacing(1.75),
    borderRadius: 13,
    border: '1px solid #e5e9ef',
    backgroundColor: '#fff',
  },

  businessUnitsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1.25),
  },

  businessUnitsTitle: {
    fontSize: '0.82rem',
    color: '#344054',
    fontWeight: 700,
  },

  selectedCount: {
    fontSize: '0.7rem',
    color: '#7f8a97',
    fontWeight: 600,
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
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    border: '1px solid #edf0f4',
    padding: theme.spacing(0.75),

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
    padding: theme.spacing(0.45, 0.8),
    borderRadius: 8,
    minHeight: 40,

    '&:hover': {
      backgroundColor: '#eef2ff',
    },

    '& .MuiFormControlLabel-label': {
      width: '100%',
    },
  },

  selectedChips: {
    marginTop: theme.spacing(1.25),
    padding: theme.spacing(1),
    borderRadius: 9,
    backgroundColor: '#f3f5ff',
    border: '1px solid #e0e5fb',
  },

  chipLabel: {
    display: 'block',
    color: '#7c8794',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    marginBottom: 5,
  },

  chip: {
    borderRadius: 7,
    backgroundColor: '#3f51b5',
    color: '#fff',
    fontWeight: 600,
    marginRight: 5,
    marginBottom: 5,
  },

  infoBox: {
    marginTop: theme.spacing(1.25),
    padding: theme.spacing(1.25),
    borderRadius: 9,
    backgroundColor: '#f5f7ff',
    border: '1px solid #e1e6fb',
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(0.8),
  },

  infoIcon: {
    color: '#6675c4',
    fontSize: 17,
    marginTop: 1,
  },

  infoText: {
    color: '#6b7685',
    fontSize: '0.7rem',
    lineHeight: 1.5,
  },

  modalActions: {
    padding: theme.spacing(1.5, 2.75),
    borderTop: '1px solid #edf0f4',
    backgroundColor: '#fbfcfd',
    gap: theme.spacing(1),
  },

  cancelButton: {
    textTransform: 'none',
    borderRadius: 9,
    fontWeight: 650,
    color: '#687587',
  },

  saveButton: {
    textTransform: 'none',
    borderRadius: 9,
    fontWeight: 700,
    minHeight: 40,
    padding: theme.spacing(0, 2),
    boxShadow: 'none',

    '&:hover': {
      boxShadow: '0 7px 18px rgba(63, 81, 181, 0.2)',
    },
  },
}));

function normalizeMetaLabel(item) {
  if (item == null) return '';

  if (typeof item === 'string') {
    return item;
  }

  return (
    item.name ??
    item.displayName ??
    item.label ??
    item.value ??
    ''
  );
}

export default function AgencyDashboard({ match }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const companyState = useSelector(
    (state) => state.company
  );

  const userState = useSelector(
    (state) => state.user
  );

  const accessLevels =
    userState?.accessLevels ?? [];

  const businessUnitsMeta =
    userState?.businessUnits ?? [];

  const users =
    userState?.users ?? [];

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState(null);

  const emptyEmployee = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    accessLevel: '',
    businessUnits: [],
    contactNumber: '',
    location: '',
  };

  const [editEmployee, setEditEmployee] =
    useState({ ...emptyEmployee });

  const [businessUnitSearch, setBusinessUnitSearch] =
    useState('');

  const parentBase = match?.url
    ? match.url.replace(/\/[^/]+$/, '')
    : '/app/dashboard';

  const companyDetailsPath =
    `${parentBase}/company-details`;

  useEffect(() => {
    dispatch(fetchCompanyDetails());
    dispatch(fetchUsers());
    dispatch(fetchBusinessUnits());
    dispatch(fetchAccessLevels());
  }, [dispatch]);

  const companyLocation =
    companyState?.company?.location ??
    companyState?.company?.Location ??
    '';

  const filteredBusinessUnits =
    businessUnitsMeta.filter((bu) => {
      const label =
        normalizeMetaLabel(bu);

      return label
        .toLowerCase()
        .includes(
          businessUnitSearch.toLowerCase()
        );
    });

  const handleBusinessUnitToggle = (
    businessUnit
  ) => {
    const label =
      normalizeMetaLabel(businessUnit);

    setEditEmployee((prev) => {
      const currentUnits =
        prev.businessUnits || [];

      if (
        currentUnits.includes(label)
      ) {
        return {
          ...prev,
          businessUnits:
            currentUnits.filter(
              (unit) =>
                unit !== label
            ),
        };
      }

      return {
        ...prev,
        businessUnits: [
          ...currentUnits,
          label,
        ],
      };
    });
  };

  const handleToggleStatus =
    async (id) => {
      try {
        const found = users.find(
          (u) =>
            Number(
              u.userId ??
                u.id ??
                u.UserId ??
                -1
            ) === Number(id)
        );

        const isActive =
          found?.isActive ??
          found?.IsActive ??
          true;

        if (isActive) {
          await dispatch(
            inactivateUser(id)
          );
        } else {
          await dispatch(
            activateUser(id)
          );
        }
      } catch (err) {
        console.error(
          'Toggle status error',
          err
        );
      }
    };

  const handleEdit = (userObj) => {
    setEditingUser(userObj);

    let buArray = [];

    const rawBu =
      userObj.businessUnits ??
      userObj.BusinessUnits ??
      userObj.businessUnit ??
      userObj.BusinessUnit;

    if (Array.isArray(rawBu)) {
      buArray = rawBu
        .map((x) =>
          typeof x === 'string'
            ? x
            : normalizeMetaLabel(x)
        )
        .filter(Boolean);
    } else if (
      typeof rawBu === 'string'
    ) {
      buArray = rawBu
        .split(',')
        .map((s) =>
          s.trim()
        )
        .filter(Boolean);
    }

    setEditEmployee({
      firstName:
        userObj.firstName ??
        userObj.FirstName ??
        '',

      middleName:
        userObj.middleName ??
        userObj.MiddleName ??
        '',

      lastName:
        userObj.lastName ??
        userObj.LastName ??
        '',

      email:
        userObj.email ??
        userObj.Email ??
        '',

      accessLevel: (
        userObj.accessLevel ??
        userObj.AccessLevel
      )
        ? String(
            userObj.accessLevel ??
              userObj.AccessLevel
          )
        : '',

      businessUnits:
        buArray.length
          ? buArray
          : [],

      contactNumber:
        userObj.contactNumber ??
        userObj.ContactNumber ??
        '',

      location:
        companyLocation,
    });

    setBusinessUnitSearch('');
    setShowEditModal(true);
  };

  const handleSaveEmployee =
    async () => {
      if (
        !editEmployee.firstName?.trim() ||
        !editEmployee.lastName?.trim() ||
        !editEmployee.email?.trim() ||
        !editEmployee.accessLevel?.trim()
      ) {
        NotificationManager.warning(
          'Please fill all required fields'
        );

        return;
      }

      if (
        !Array.isArray(
          editEmployee.businessUnits
        ) ||
        editEmployee
          .businessUnits
          .length === 0
      ) {
        NotificationManager.warning(
          'Please select at least one business unit'
        );

        return;
      }

      const businessUnitsArray =
        editEmployee.businessUnits.map(
          (s) => String(s)
        );

      const businessUnitString =
        businessUnitsArray.join(',');

      const userId = Number(
        editingUser.userId ??
          editingUser.id ??
          editingUser.UserId ??
          0
      );

      if (!userId) {
        NotificationManager.error(
          'Edit failed: missing user identifier'
        );

        return;
      }

      const dto = {
        UserId: userId,
        FirstName:
          editEmployee.firstName.trim(),
        MiddleName:
          editEmployee.middleName?.trim() ||
          null,
        LastName:
          editEmployee.lastName?.trim() ||
          null,
        Email:
          editEmployee.email.trim(),
        BusinessUnits:
          businessUnitsArray,
        BusinessUnit:
          businessUnitString,
        AccessLevel:
          editEmployee.accessLevel,
        ContactNumber:
          editEmployee.contactNumber?.trim() ||
          null,
        Location:
          companyLocation || null,
        IsActive:
          editingUser.isActive ??
          editingUser.IsActive ??
          true,
      };

      try {
        await dispatch(
          updateUser(dto)
        );

        setShowEditModal(false);
        setEditingUser(null);
        setEditEmployee({
          ...emptyEmployee,
        });
      } catch (err) {
        console.error(
          '[userActions] updateUser error:',
          err
        );
      }
    };

  const totalEmployees =
    users.length;

  const activeEmployees =
    users.filter(
      (u) =>
        u.isActive ??
        u.IsActive ??
        true
    ).length;

  const accessLevelsCount =
    accessLevels.length;

  const businessUnitsCount =
    businessUnitsMeta.length;

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditEmployee({
      ...emptyEmployee,
    });
    setBusinessUnitSearch('');
  };

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Company Profile</title>

        <meta
          name="description"
          content="Employee Management Dashboard - View and Manage Employees"
        />
      </Helmet>

      {/* <PageTitleBar
        title={
          <IntlMessages id="Company Profile" />
        }
        match={match}
      /> */}

      <div className={classes.container}>
        {/* =====================================================
            HEADER
        ====================================================== */}

        <Box
          className={
            classes.pageHeader
          }
        >
          <Box className={classes.headerText}>
            <Typography
              className={classes.title}
            >
              Company Employees
            </Typography>

            <Typography
              className={classes.subtitle}
            >
              Manage employees, access levels,
              business units, and account status.
            </Typography>
          </Box>
        </Box>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <Box className={classes.mainGrid}>
          {/* COMPANY SUMMARY */}

          <Box
            className={
              classes.summaryColumn
            }
          >
            <CompanySummary
              companyState={
                companyState
              }
              companyDetailsPath={
                companyDetailsPath
              }
            />
          </Box>

          {/* MAIN */}

          <Box
            className={
              classes.mainColumn
            }
          >
            {/* =================================================
                STATISTICS
            ================================================= */}

            <Grid
              container
              spacing={2}
              className={
                classes.statsGrid
              }
            >
              {/* Total */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Paper
                  className={
                    classes.statCard
                  }
                >
                  <Box
                    className={
                      classes.statAccent
                    }
                  />

                  <Box
                    className={
                      classes.statTop
                    }
                  >
                    <Box>
                      <Typography
                        className={
                          classes.statValue
                        }
                      >
                        {
                          totalEmployees
                        }
                      </Typography>

                      <Typography
                        className={
                          classes.statLabel
                        }
                      >
                        Total Employees
                      </Typography>
                    </Box>

                    <Box
                      className={
                        classes.statIcon
                      }
                    >
                      <PeopleIcon />
                    </Box>
                  </Box>

                  <Typography
                    className={
                      classes.statDescription
                    }
                  >
                    All company employees
                  </Typography>
                </Paper>
              </Grid>

              {/* Active */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Paper
                  className={
                    classes.statCard
                  }
                >
                  <Box
                    className={`${classes.statAccent} ${classes.accentGreen}`}
                  />

                  <Box
                    className={
                      classes.statTop
                    }
                  >
                    <Box>
                      <Typography
                        className={
                          classes.statValue
                        }
                      >
                        {
                          activeEmployees
                        }
                      </Typography>

                      <Typography
                        className={
                          classes.statLabel
                        }
                      >
                        Active Employees
                      </Typography>
                    </Box>

                    <Box
                      className={`${classes.statIcon} ${classes.statIconGreen}`}
                    >
                      <CheckIcon />
                    </Box>
                  </Box>

                  <Typography
                    className={
                      classes.statDescription
                    }
                  >
                    Currently active accounts
                  </Typography>
                </Paper>
              </Grid>

              {/* Access */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Paper
                  className={
                    classes.statCard
                  }
                >
                  <Box
                    className={`${classes.statAccent} ${classes.accentPurple}`}
                  />

                  <Box
                    className={
                      classes.statTop
                    }
                  >
                    <Box>
                      <Typography
                        className={
                          classes.statValue
                        }
                      >
                        {
                          accessLevelsCount
                        }
                      </Typography>

                      <Typography
                        className={
                          classes.statLabel
                        }
                      >
                        Access Levels
                      </Typography>
                    </Box>

                    <Box
                      className={`${classes.statIcon} ${classes.statIconPurple}`}
                    >
                      <SecurityIcon />
                    </Box>
                  </Box>

                  <Typography
                    className={
                      classes.statDescription
                    }
                  >
                    Permission levels configured
                  </Typography>
                </Paper>
              </Grid>

              {/* Business units */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Paper
                  className={
                    classes.statCard
                  }
                >
                  <Box
                    className={`${classes.statAccent} ${classes.accentOrange}`}
                  />

                  <Box
                    className={
                      classes.statTop
                    }
                  >
                    <Box>
                      <Typography
                        className={
                          classes.statValue
                        }
                      >
                        {
                          businessUnitsCount
                        }
                      </Typography>

                      <Typography
                        className={
                          classes.statLabel
                        }
                      >
                        Business Units
                      </Typography>
                    </Box>

                    <Box
                      className={`${classes.statIcon} ${classes.statIconOrange}`}
                    >
                      <BusinessIcon />
                    </Box>
                  </Box>

                  <Typography
                    className={
                      classes.statDescription
                    }
                  >
                    Organizational units
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* =================================================
                EMPLOYEE LIST
            ================================================= */}

            <EmployeeList
              employees={users}
              onEdit={handleEdit}
              onToggleStatus={
                handleToggleStatus
              }
            />
          </Box>
        </Box>
      </div>

      {/* =====================================================
          EDIT EMPLOYEE MODAL
      ====================================================== */}

      <Dialog
        open={showEditModal}
        onClose={closeEditModal}
        maxWidth="md"
        fullWidth
        className={classes.modal}
      >
        <DialogTitle
          className={
            classes.modalHeader
          }
        >
          <Box
            className={
              classes.modalHeaderLeft
            }
          >
            <Box
              className={
                classes.modalIcon
              }
            >
              <PersonIcon />
            </Box>

            <Box
              className={
                classes.modalTitleBlock
              }
            >
              <Typography
                className={
                  classes.modalTitle
                }
              >
                Edit Employee
              </Typography>

              <Typography
                className={
                  classes.modalSubtitle
                }
              >
                Update employee information and access.
              </Typography>
            </Box>
          </Box>

          <IconButton
            className={
              classes.modalClose
            }
            onClick={closeEditModal}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          className={
            classes.modalContent
          }
        >
          {/* =================================================
              PERSONAL
          ================================================== */}

          <Box
            className={
              classes.formSection
            }
          >
            <Typography
              className={
                classes.sectionTitle
              }
            >
              <PersonIcon
                className={
                  classes.sectionTitleIcon
                }
              />
              Personal Information
            </Typography>

            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={4}
              >
                <TextField
                  fullWidth
                  label="First Name"
                  value={
                    editEmployee.firstName
                  }
                  onChange={(e) =>
                    setEditEmployee({
                      ...editEmployee,
                      firstName:
                        e.target.value,
                    })
                  }
                  variant="outlined"
                  className={
                    classes.textField
                  }
                  InputLabelProps={{
                    className:
                      classes.requiredLabel,
                  }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
              >
                <TextField
                  fullWidth
                  label="Middle Name"
                  value={
                    editEmployee.middleName
                  }
                  onChange={(e) =>
                    setEditEmployee({
                      ...editEmployee,
                      middleName:
                        e.target.value,
                    })
                  }
                  variant="outlined"
                  className={
                    classes.textField
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
              >
                <TextField
                  fullWidth
                  label="Last Name"
                  value={
                    editEmployee.lastName
                  }
                  onChange={(e) =>
                    setEditEmployee({
                      ...editEmployee,
                      lastName:
                        e.target.value,
                    })
                  }
                  variant="outlined"
                  className={
                    classes.textField
                  }
                  InputLabelProps={{
                    className:
                      classes.requiredLabel,
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* =================================================
              CONTACT
          ================================================== */}

          <Box
            className={
              classes.formSection
            }
          >
            <Typography
              className={
                classes.sectionTitle
              }
            >
              <EmailIcon
                className={
                  classes.sectionTitleIcon
                }
              />
              Contact Information
            </Typography>

            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={8}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={
                    editEmployee.email
                  }
                  onChange={(e) =>
                    setEditEmployee({
                      ...editEmployee,
                      email:
                        e.target.value,
                    })
                  }
                  variant="outlined"
                  className={
                    classes.textField
                  }
                  InputLabelProps={{
                    className:
                      classes.requiredLabel,
                  }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
              >
                <TextField
                  fullWidth
                  label="Contact Number"
                  value={
                    editEmployee.contactNumber
                  }
                  onChange={(e) =>
                    setEditEmployee({
                      ...editEmployee,
                      contactNumber:
                        e.target.value,
                    })
                  }
                  variant="outlined"
                  className={
                    classes.textField
                  }
                />
              </Grid>
            </Grid>
          </Box>

          {/* =================================================
              ACCESS
          ================================================== */}

          <Box
            className={
              classes.formSection
            }
          >
            <Typography
              className={
                classes.sectionTitle
              }
            >
              <SecurityIcon
                className={
                  classes.sectionTitleIcon
                }
              />
              Access & Organization
            </Typography>

            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={6}
              >
                <FormControl
                  fullWidth
                  variant="outlined"
                  className={
                    classes.textField
                  }
                >
                  <InputLabel
                    className={
                      classes.requiredLabel
                    }
                  >
                    Access Level
                  </InputLabel>

                  <Select
                    value={
                      editEmployee.accessLevel
                    }
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        accessLevel:
                          e.target.value,
                      })
                    }
                    label="Access Level"
                  >
                    <MenuItem value="">
                      <em>
                        Select Access Level
                      </em>
                    </MenuItem>

                    {accessLevels.map(
                      (a, i) => {
                        const label =
                          normalizeMetaLabel(
                            a
                          );

                        return (
                          <MenuItem
                            key={i}
                            value={label}
                          >
                            {label}
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  label="Location"
                  value={
                    companyLocation ||
                    'No company location set'
                  }
                  variant="outlined"
                  className={
                    classes.textField
                  }
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon
                          style={{
                            color:
                              '#9aa5b1',
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Employee location follows the company location."
                />
              </Grid>
            </Grid>

            {/* BUSINESS UNITS */}

            <Box
              className={
                classes.businessUnitsSection
              }
            >
              <Box
                className={
                  classes.businessUnitsHeader
                }
              >
                <Typography
                  className={
                    classes.businessUnitsTitle
                  }
                >
                  Business Units *
                </Typography>

                <Typography
                  className={
                    classes.selectedCount
                  }
                >
                  {
                    editEmployee
                      .businessUnits
                      .length
                  }{' '}
                  selected
                </Typography>
              </Box>

              <TextField
                fullWidth
                placeholder="Search business units..."
                value={
                  businessUnitSearch
                }
                onChange={(e) =>
                  setBusinessUnitSearch(
                    e.target.value
                  )
                }
                className={
                  classes.searchBox
                }
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
                        normalizeMetaLabel(
                          bu
                        );

                      const isSelected =
                        editEmployee.businessUnits.includes(
                          label
                        );

                      return (
                        <FormControlLabel
                          key={i}
                          className={
                            classes.businessUnitItem
                          }
                          control={
                            <Checkbox
                              checked={
                                isSelected
                              }
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
                                  color:
                                    isSelected
                                      ? '#3f51b5'
                                      : '#9ca6b2',
                                }}
                              />

                              <Typography
                                variant="body2"
                                style={{
                                  color:
                                    isSelected
                                      ? '#344054'
                                      : '#687587',
                                  fontWeight:
                                    isSelected
                                      ? 600
                                      : 400,
                                }}
                              >
                                {label}
                              </Typography>
                            </Box>
                          }
                        />
                      );
                    }
                  )}

                  {filteredBusinessUnits.length ===
                    0 && (
                    <Box
                      p={2}
                      textAlign="center"
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                      >
                        No business units found.
                      </Typography>
                    </Box>
                  )}
                </FormGroup>
              </Box>

              {editEmployee.businessUnits
                .length > 0 && (
                <Box
                  className={
                    classes.selectedChips
                  }
                >
                  <Typography
                    className={
                      classes.chipLabel
                    }
                  >
                    SELECTED BUSINESS UNITS
                  </Typography>

                  {editEmployee.businessUnits.map(
                    (
                      unit,
                      index
                    ) => (
                      <Chip
                        key={index}
                        label={unit}
                        className={
                          classes.chip
                        }
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

              <Box
                className={
                  classes.infoBox
                }
              >
                <InfoIcon
                  className={
                    classes.infoIcon
                  }
                />

                <Typography
                  className={
                    classes.infoText
                  }
                >
                  Select at least one business
                  unit for this employee.
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          className={
            classes.modalActions
          }
        >
          <Button
            onClick={
              closeEditModal
            }
            className={
              classes.cancelButton
            }
          >
            Cancel
          </Button>

          <Button
            onClick={
              handleSaveEmployee
            }
            variant="contained"
            color="primary"
            className={
              classes.saveButton
            }
            startIcon={<CheckIcon />}
            disabled={
              !editEmployee.firstName ||
              !editEmployee.lastName ||
              !editEmployee.email ||
              !editEmployee.accessLevel ||
              editEmployee.businessUnits
                .length === 0
            }
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}