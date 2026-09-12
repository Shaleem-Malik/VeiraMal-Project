import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  Button,
  Box,
  LinearProgress,
  Typography,
  Chip,
  Tooltip,
  Fade,
  Divider,
} from '@material-ui/core';

import {
  CloudUpload as UploadIcon,
  PersonAdd as AddEmployeeIcon,
  VpnKey as AccessLevelIcon,
  Business as BusinessUnitIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowForwardIcon,
} from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 18,
    border: '1px solid #e8edf3',
    backgroundColor: '#ffffff',
    boxShadow: '0 5px 20px rgba(31, 41, 55, 0.06)',
    overflow: 'hidden',
    height: 'fit-content',
  },

  header: {
    padding: theme.spacing(2.5),
    background:
      'linear-gradient(135deg, #3f51b5 0%, #5b6fd8 100%)',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden',

    '&::after': {
      content: '""',
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.08)',
      right: -35,
      top: -50,
    },
  },

  headerContent: {
    position: 'relative',
    zIndex: 1,
  },

  headerTitle: {
    fontSize: '1.15rem',
    fontWeight: 800,
    marginBottom: theme.spacing(0.5),
  },

  headerSubtitle: {
    fontSize: '0.78rem',
    opacity: 0.82,
    lineHeight: 1.5,
  },

  cardContent: {
    padding: theme.spacing(2.5),

    '&:last-child': {
      paddingBottom: theme.spacing(2.5),
    },
  },

  uploadBox: {
    padding: theme.spacing(1.75),
    borderRadius: 14,
    backgroundColor: '#f7f9ff',
    border: '1px dashed #cbd3f3',
    marginBottom: theme.spacing(2),
  },

  uploadTop: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    marginBottom: theme.spacing(1.25),
  },

  uploadIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3f51b5',
    backgroundColor: '#e9edff',
    flexShrink: 0,
  },

  uploadTitle: {
    fontSize: '0.87rem',
    fontWeight: 700,
    color: '#283448',
  },

  uploadDescription: {
    fontSize: '0.73rem',
    color: '#8a96a3',
    marginTop: 2,
    lineHeight: 1.4,
  },

  uploadButton: {
    height: 44,
    borderRadius: 10,
    textTransform: 'none',
    fontWeight: 700,
    boxShadow: '0 5px 14px rgba(63, 81, 181, 0.18)',

    '&:hover': {
      boxShadow: '0 8px 20px rgba(63, 81, 181, 0.23)',
    },
  },

  progressContainer: {
    marginTop: theme.spacing(1.5),
    padding: theme.spacing(1.25),
    borderRadius: 10,
    backgroundColor: '#ffffff',
    border: '1px solid #e6eaf0',
  },

  progressText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0.8),
  },

  progressBar: {
    height: 7,
    borderRadius: 5,
    backgroundColor: '#edf0f5',

    '& .MuiLinearProgress-bar': {
      borderRadius: 5,
    },
  },

  successChip: {
    backgroundColor: '#eaf8f0',
    color: '#23834a',
    fontWeight: 700,
    height: 28,

    '& .MuiChip-icon': {
      color: '#23834a',
    },
  },

  sectionLabel: {
    color: '#98a1ad',
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: theme.spacing(1.25),
  },

  actionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(1.25),

    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr',
    },
  },

  actionButton: {
    minHeight: 86,
    padding: theme.spacing(1.35),
    borderRadius: 12,
    border: '1px solid #e7ebf0',
    backgroundColor: '#ffffff',
    color: '#2f3b4d',
    textTransform: 'none',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlign: 'left',
    transition: 'all 0.22s ease',
    boxShadow: 'none',

    '&:hover': {
      backgroundColor: '#f8f9ff',
      borderColor: '#cfd6f4',
      transform: 'translateY(-2px)',
      boxShadow: '0 7px 18px rgba(31, 41, 55, 0.07)',
    },
  },

  actionInner: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
    backgroundColor: '#f0f3ff',
    color: '#4e61c1',
  },

  actionIconPurple: {
    backgroundColor: '#f4efff',
    color: '#7952c5',
  },

  actionIconGreen: {
    backgroundColor: '#edf9f2',
    color: '#269653',
  },

  actionIconOrange: {
    backgroundColor: '#fff6e9',
    color: '#d68a16',
  },

  actionTitle: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#303b4d',
    lineHeight: 1.3,
  },

  actionSubtext: {
    color: '#98a1ad',
    fontSize: '0.68rem',
    marginTop: 2,
  },

  actionArrow: {
    marginLeft: 'auto',
    marginTop: -2,
    color: '#a3acb8',
  },

  divider: {
    margin: theme.spacing(2.5, 0),
    borderColor: '#edf0f4',
  },

  companyButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: 10,
    border: '1px solid #e4e8ef',
    textTransform: 'none',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 1.5),
    color: '#39465a',
    fontWeight: 650,

    '&:hover': {
      backgroundColor: '#f7f8fb',
      borderColor: '#cfd5df',
    },
  },

  hiddenInput: {
    display: 'none',
  },
}));

export default function QuickActions({
  onFileUpload,
  onOpenAddEmployee,
  onOpenAddAccessLevel,
  onOpenAddBusinessUnit,
  companyDetailsPath,
  uploadLoading = false,
}) {
  const classes = useStyles();

  const fileInputRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);

    let progressInterval;

    try {
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 80) {
            clearInterval(progressInterval);
            return 80;
          }

          return prev + 20;
        });
      }, 300);

      await onFileUpload(event);

      clearInterval(progressInterval);

      setUploadProgress(100);
      setUploadComplete(true);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadComplete(false);

        event.target.value = '';
      }, 2500);
    } catch (error) {
      console.error('Upload error:', error);

      if (progressInterval) {
        clearInterval(progressInterval);
      }

      setIsUploading(false);
      setUploadProgress(0);
      setUploadComplete(false);
    }
  };

  return (
    <Card className={classes.card}>
      {/* Header */}
      <Box className={classes.header}>
        <Box className={classes.headerContent}>
          <Typography className={classes.headerTitle}>
            Quick Actions
          </Typography>

          <Typography className={classes.headerSubtitle}>
            Manage employees and organization settings
            from the actions below.
          </Typography>
        </Box>
      </Box>

      <CardContent className={classes.cardContent}>
        {/* Upload */}
        <Box className={classes.uploadBox}>
          <Box className={classes.uploadTop}>
            <Box className={classes.uploadIcon}>
              <UploadIcon />
            </Box>

            <Box>
              <Typography className={classes.uploadTitle}>
                Bulk Employee Upload
              </Typography>

              <Typography
                className={classes.uploadDescription}
              >
                Import employee information using Excel
                or CSV.
              </Typography>
            </Box>
          </Box>

          <Tooltip
            title="Upload employee data via Excel/CSV template"
            arrow
          >
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<UploadIcon />}
              onClick={handleUploadClick}
              disabled={isUploading || uploadLoading}
              className={classes.uploadButton}
            >
              {isUploading
                ? `Uploading... ${uploadProgress}%`
                : 'Upload Employee Template'}
            </Button>
          </Tooltip>

          <input
            ref={fileInputRef}
            type="file"
            className={classes.hiddenInput}
            onChange={handleFileUpload}
            accept=".xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
            disabled={isUploading || uploadLoading}
          />

          <Fade
            in={isUploading || uploadComplete}
            timeout={400}
          >
            <Box
              className={
                classes.progressContainer
              }
            >
              <Box className={classes.progressText}>
                <Typography
                  variant="caption"
                  color="textSecondary"
                >
                  {uploadComplete
                    ? 'Upload Complete'
                    : 'Processing File...'}
                </Typography>

                <Typography
                  variant="caption"
                  color="primary"
                  style={{ fontWeight: 700 }}
                >
                  {uploadProgress}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                className={classes.progressBar}
              />

              {uploadComplete && (
                <Fade
                  in={uploadComplete}
                  timeout={700}
                >
                  <Box
                    mt={1.25}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Chip
                      icon={<CheckIcon />}
                      label="Upload Successful"
                      size="small"
                      className={
                        classes.successChip
                      }
                    />
                  </Box>
                </Fade>
              )}
            </Box>
          </Fade>
        </Box>

        <Typography className={classes.sectionLabel}>
          Organization Management
        </Typography>

        <Box className={classes.actionGrid}>
          {/* Employee */}
          <Tooltip
            title="Add a new employee to the system"
            arrow
          >
            <Button
              className={classes.actionButton}
              onClick={onOpenAddEmployee}
            >
              <Box className={classes.actionInner}>
                <Box className={classes.actionIcon}>
                  <AddEmployeeIcon fontSize="small" />
                </Box>

                <Typography
                  className={classes.actionTitle}
                >
                  Add Employee
                </Typography>

                <Typography
                  className={classes.actionSubtext}
                >
                  Create employee account
                </Typography>
              </Box>

              <ArrowForwardIcon
                className={classes.actionArrow}
                style={{ fontSize: 17 }}
              />
            </Button>
          </Tooltip>

          {/* Access Level */}
          <Tooltip
            title="Create a new access level"
            arrow
          >
            <Button
              className={classes.actionButton}
              onClick={onOpenAddAccessLevel}
            >
              <Box className={classes.actionInner}>
                <Box
                  className={`${classes.actionIcon} ${classes.actionIconPurple}`}
                >
                  <AccessLevelIcon fontSize="small" />
                </Box>

                <Typography
                  className={classes.actionTitle}
                >
                  Access Level
                </Typography>

                <Typography
                  className={classes.actionSubtext}
                >
                  Manage permissions
                </Typography>
              </Box>

              <ArrowForwardIcon
                className={classes.actionArrow}
                style={{ fontSize: 17 }}
              />
            </Button>
          </Tooltip>

          {/* Business Unit */}
          <Tooltip
            title="Create a new business unit"
            arrow
          >
            <Button
              className={classes.actionButton}
              onClick={onOpenAddBusinessUnit}
            >
              <Box className={classes.actionInner}>
                <Box
                  className={`${classes.actionIcon} ${classes.actionIconGreen}`}
                >
                  <BusinessUnitIcon fontSize="small" />
                </Box>

                <Typography
                  className={classes.actionTitle}
                >
                  Business Unit
                </Typography>

                <Typography
                  className={classes.actionSubtext}
                >
                  Organize your company
                </Typography>
              </Box>

              <ArrowForwardIcon
                className={classes.actionArrow}
                style={{ fontSize: 17 }}
              />
            </Button>
          </Tooltip>

          {/* Company Details */}
          <Tooltip
            title="Manage company settings and details"
            arrow
          >
            <Button
              className={classes.actionButton}
              component={Link}
              to={companyDetailsPath}
            >
              <Box className={classes.actionInner}>
                <Box
                  className={`${classes.actionIcon} ${classes.actionIconOrange}`}
                >
                  <SettingsIcon fontSize="small" />
                </Box>

                <Typography
                  className={classes.actionTitle}
                >
                  Company Details
                </Typography>

                <Typography
                  className={classes.actionSubtext}
                >
                  Update company settings
                </Typography>
              </Box>

              <ArrowForwardIcon
                className={classes.actionArrow}
                style={{ fontSize: 17 }}
              />
            </Button>
          </Tooltip>
        </Box>

        <Divider className={classes.divider} />

        <Button
          component={Link}
          to={companyDetailsPath}
          className={classes.companyButton}
          endIcon={<ArrowForwardIcon />}
        >
          <Box display="flex" alignItems="center">
            <SettingsIcon
              style={{
                marginRight: 9,
                fontSize: 19,
                color: '#667085',
              }}
            />

            Company Settings
          </Box>
        </Button>
      </CardContent>
    </Card>
  );
}