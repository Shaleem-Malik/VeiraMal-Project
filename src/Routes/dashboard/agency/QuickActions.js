// File: src/Components/QuickActions/QuickActions.js
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Button, 
  Box, 
  LinearProgress, 
  Typography,
  Chip,
  Tooltip,
  Fade
} from '@material-ui/core';
import {
  CloudUpload as UploadIcon,
  PersonAdd as AddEmployeeIcon,
  VpnKey as AccessLevelIcon,
  Business as BusinessUnitIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
//   Rocket as RocketIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: `1px solid ${theme.palette.divider}`,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    overflow: 'visible',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
      transform: 'translateY(-2px)',
    },
  },
  cardHeader: {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: 'white',
    padding: theme.spacing(2.5),
    borderBottom: `1px solid ${theme.palette.primary.light}`,
    '& .MuiCardHeader-title': {
      fontSize: '1.2rem',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
  },
  cardContent: {
    padding: theme.spacing(2.5),
    '&:last-child': {
      paddingBottom: theme.spacing(2.5),
    },
  },
  button: {
    borderRadius: 12,
    padding: theme.spacing(1.5, 2),
    justifyContent: 'flex-start',
    textTransform: 'none',
    fontWeight: 600,
    marginBottom: theme.spacing(1.5),
    border: `2px solid ${theme.palette.divider}`,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    '&:last-child': {
      marginBottom: 0,
    },
  },
  uploadSection: {
    position: 'relative',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: 12,
    border: `1px dashed ${theme.palette.divider}`,
  },
  progressContainer: {
    marginTop: theme.spacing(1.5),
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    border: `1px solid ${theme.palette.divider}`,
  },
  progressText: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  successChip: {
    backgroundColor: theme.palette.success.main,
    color: 'white',
    fontWeight: 600,
  },
  downloadButton: {
    marginTop: theme.spacing(1.5),
    fontSize: '0.8rem',
    borderRadius: 8,
    padding: theme.spacing(0.75, 1.5),
  },
  hiddenInput: {
    display: 'none',
  },
  buttonIcon: {
    marginRight: theme.spacing(1.5),
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.palette.grey[200],
    '& .MuiLinearProgress-bar': {
      borderRadius: 4,
      transition: 'transform 0.4s ease-in-out',
    },
  },
  actionGroup: {
    marginTop: theme.spacing(1),
  },
}));

export default function QuickActions({
  onFileUpload,
  onOpenAddEmployee,
  onOpenAddAccessLevel,
  onOpenAddBusinessUnit,
  companyDetailsPath,
  onDownloadTemplate,
  showTemplateDownload = true,
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

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
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
      setIsUploading(false);
      setUploadProgress(0);
      setUploadComplete(false);
    }
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            {/* <RocketIcon /> */}
            Quick Actions
          </Box>
        }
        className={classes.cardHeader}
      />
      
      <CardContent className={classes.cardContent}>
        {/* Upload Template Section */}
        <Box className={classes.uploadSection}>
          <Tooltip title="Upload employee data via Excel/CSV template" arrow placement="top">
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<UploadIcon className={classes.buttonIcon} />}
              onClick={handleUploadClick}
              disabled={isUploading || uploadLoading}
              className={classes.button}
              size="large"
            >
              {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Template'}
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

          {/* Progress Section */}
          <Fade in={isUploading || uploadComplete} timeout={500}>
            <Box className={classes.progressContainer}>
              <Box className={classes.progressText}>
                <Typography variant="caption" color="textSecondary" fontWeight="500">
                  {uploadComplete ? 'Upload Complete' : 'Processing File...'}
                </Typography>
                <Typography variant="caption" fontWeight="bold" color="primary">
                  {uploadProgress}%
                </Typography>
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress}
                className={classes.progressBar}
                color={uploadComplete ? "primary" : "primary"}
              />

              {uploadComplete && (
                <Fade in={uploadComplete} timeout={800}>
                  <Box mt={1.5} display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                      icon={<CheckIcon />}
                      label="Upload Successful"
                      size="small"
                      className={classes.successChip}
                    />
                    <Typography variant="caption" color="textSecondary">
                      Processing data...
                    </Typography>
                  </Box>
                </Fade>
              )}
            </Box>
          </Fade>

          {/* Download Template Option */}
          {/* {showTemplateDownload && (
            <Tooltip title="Download the template file for bulk employee upload" arrow>
              <Button
                fullWidth
                size="medium"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadTemplate}
                className={classes.downloadButton}
                color="default"
                variant="text"
              >
                📥 Download Template
              </Button>
            </Tooltip>
          )} */}
        </Box>

        {/* Other Action Buttons */}
        <Box className={classes.actionGroup}>
          <Tooltip title="Add a new employee to the system" arrow>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              startIcon={<AddEmployeeIcon className={classes.buttonIcon} />}
              onClick={onOpenAddEmployee}
              className={classes.button}
              size="large"
            >
            Add Employee
            </Button>
          </Tooltip>

          <Tooltip title="Create new access level for employees" arrow>
            <Button
              fullWidth
              variant="outlined"
              color="default"
              startIcon={<AccessLevelIcon className={classes.buttonIcon} />}
              onClick={onOpenAddAccessLevel}
              className={classes.button}
              size="large"
            >
              Add Access Level
            </Button>
          </Tooltip>

          <Tooltip title="Add new business unit to the organization" arrow>
            <Button
              fullWidth
              variant="outlined"
              color="default"
              startIcon={<BusinessUnitIcon className={classes.buttonIcon} />}
              onClick={onOpenAddBusinessUnit}
              className={classes.button}
              size="large"
            >
              Add Business Unit
            </Button>
          </Tooltip>

          <Tooltip title="Manage company settings and details" arrow>
            <Button
              fullWidth
              variant="outlined"
              color="default"
              startIcon={<SettingsIcon className={classes.buttonIcon} />}
              component={Link}
              to={companyDetailsPath}
              className={classes.button}
              size="large"
            >
              Company Details
            </Button>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}