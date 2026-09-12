import React from 'react';
import { Link } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Typography,
} from '@material-ui/core';

import {
  Business as BusinessIcon,
  EditOutlined as EditIcon,
  PhoneOutlined as PhoneIcon,
  AssignmentOutlined as AbnIcon,
  CalendarTodayOutlined as CalendarIcon,
  LocationOnOutlined as LocationIcon,
} from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 18,
    backgroundColor: '#ffffff',
    border: '1px solid #e7ecf2',
    boxShadow: '0 5px 20px rgba(31, 41, 55, 0.055)',
    overflow: 'hidden',

    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(2),
    },
  },

  header: {
    padding: theme.spacing(2.25),
    background:
      'linear-gradient(135deg, #3f51b5 0%, #5d6fd4 100%)',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',

    '&::after': {
      content: '""',
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: '50%',
      right: -40,
      top: -55,
      backgroundColor:
        'rgba(255,255,255,0.08)',
    },
  },

  headerContent: {
    position: 'relative',
    zIndex: 1,
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(1.25),
    backgroundColor:
      'rgba(255,255,255,0.14)',
  },

  title: {
    fontSize: '1rem',
    fontWeight: 750,
    lineHeight: 1.25,
  },

  subtitle: {
    marginTop: 3,
    fontSize: '0.7rem',
    opacity: 0.8,
  },

  body: {
    padding: theme.spacing(1.25, 2),
  },

  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing(1.5, 0),
  },

  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f4f8',
    color: '#738093',
    marginRight: theme.spacing(1.1),
    flexShrink: 0,
  },

  infoText: {
    minWidth: 0,
  },

  label: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#9aa4af',
    fontWeight: 700,
    marginBottom: 3,
  },

  value: {
    fontSize: '0.8rem',
    fontWeight: 650,
    color: '#344054',
    overflowWrap: 'anywhere',
    lineHeight: 1.4,
  },

  muted: {
    color: '#a1a9b4',
    fontWeight: 500,
  },

  footer: {
    padding: theme.spacing(1.75, 2),
    borderTop: '1px solid #edf0f4',
    backgroundColor: '#fbfcfd',
  },

  editButton: {
    width: '100%',
    minHeight: 40,
    borderRadius: 9,
    border: '1px solid #dce2e9',
    color: '#5060b4',
    backgroundColor: '#ffffff',
    textTransform: 'none',
    fontWeight: 700,

    '&:hover': {
      backgroundColor: '#f5f6ff',
      borderColor: '#cdd4ee',
    },
  },

  loading: {
    padding: theme.spacing(5, 2),
    textAlign: 'center',
  },

  loadingText: {
    marginTop: theme.spacing(1),
    color: '#8994a2',
    fontSize: '0.76rem',
  },
}));

export default function CompanySummary({
  companyState,
  companyDetailsPath,
}) {
  const classes = useStyles();

  const company =
    companyState?.company ?? {};

  if (companyState.loading) {
    return (
      <Card className={classes.card}>
        <Box className={classes.loading}>
          <CircularProgress
            size={30}
            thickness={4}
          />

          <Typography
            className={
              classes.loadingText
            }
          >
            Loading company information...
          </Typography>
        </Box>
      </Card>
    );
  }

  const companyName =
    company.companyName ??
    company.CompanyName ??
    '—';

  const companyABN =
    company.companyABN ??
    company.CompanyABN ??
    '—';

  const contactNumber =
    company.contactNumber ??
    company.ContactNumber ??
    '—';

  const location =
    company.location ??
    company.Location ??
    '—';

  const createdAt =
    company.createdAt ??
    company.CreatedAt;

  const formattedDate =
    createdAt
      ? new Date(
          createdAt
        ).toLocaleDateString(
          'en-US',
          {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }
        )
      : '—';

  return (
    <Card className={classes.card}>
      {/* HEADER */}

      <Box className={classes.header}>
        <Box
          className={
            classes.headerContent
          }
        >
          <Box
            className={
              classes.headerIcon
            }
          >
            <BusinessIcon />
          </Box>

          <Typography
            className={classes.title}
          >
            Company Summary
          </Typography>

          <Typography
            className={
              classes.subtitle
            }
          >
            Organization information
          </Typography>
        </Box>
      </Box>

      {/* BODY */}

      <Box className={classes.body}>
        {/* Company */}

        <Box
          className={
            classes.infoItem
          }
        >
          <Box
            className={
              classes.infoIcon
            }
          >
            <BusinessIcon
              fontSize="small"
            />
          </Box>

          <Box
            className={
              classes.infoText
            }
          >
            <Typography
              className={
                classes.label
              }
            >
              Company Name
            </Typography>

            <Typography
              className={
                classes.value
              }
            >
              {companyName}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* ABN */}

        <Box
          className={
            classes.infoItem
          }
        >
          <Box
            className={
              classes.infoIcon
            }
          >
            <AbnIcon
              fontSize="small"
            />
          </Box>

          <Box
            className={
              classes.infoText
            }
          >
            <Typography
              className={
                classes.label
              }
            >
              ABN
            </Typography>

            <Typography
              className={`${classes.value} ${
                companyABN === '—'
                  ? classes.muted
                  : ''
              }`}
            >
              {companyABN}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Contact */}

        <Box
          className={
            classes.infoItem
          }
        >
          <Box
            className={
              classes.infoIcon
            }
          >
            <PhoneIcon
              fontSize="small"
            />
          </Box>

          <Box
            className={
              classes.infoText
            }
          >
            <Typography
              className={
                classes.label
              }
            >
              Contact
            </Typography>

            <Typography
              className={`${classes.value} ${
                contactNumber === '—'
                  ? classes.muted
                  : ''
              }`}
            >
              {contactNumber}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Location */}

        <Box
          className={
            classes.infoItem
          }
        >
          <Box
            className={
              classes.infoIcon
            }
          >
            <LocationIcon
              fontSize="small"
            />
          </Box>

          <Box
            className={
              classes.infoText
            }
          >
            <Typography
              className={
                classes.label
              }
            >
              Location
            </Typography>

            <Typography
              className={`${classes.value} ${
                location === '—'
                  ? classes.muted
                  : ''
              }`}
            >
              {location}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Created */}

        <Box
          className={
            classes.infoItem
          }
        >
          <Box
            className={
              classes.infoIcon
            }
          >
            <CalendarIcon
              fontSize="small"
            />
          </Box>

          <Box
            className={
              classes.infoText
            }
          >
            <Typography
              className={
                classes.label
              }
            >
              Created
            </Typography>

            <Typography
              className={
                classes.value
              }
            >
              {formattedDate}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* FOOTER */}

      <Box
        className={
          classes.footer
        }
      >
        <Button
          component={Link}
          to={companyDetailsPath}
          className={
            classes.editButton
          }
          startIcon={
            <EditIcon />
          }
        >
          Edit Company
        </Button>
      </Box>
    </Card>
  );
}