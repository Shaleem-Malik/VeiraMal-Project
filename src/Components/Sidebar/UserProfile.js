import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Avatar,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    Card,
    CardContent,
    Divider,
    Typography,
    Chip,
    LinearProgress,
    Snackbar,
    CircularProgress,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';
import {
    Visibility,
    VisibilityOff,
    Edit as EditIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    CloudUpload as CloudUploadIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Business as BusinessIcon,
    Security as SecurityIcon,
    Error as ErrorIcon,
    Close as CloseIcon,
    Delete as DeleteIcon
} from '@material-ui/icons';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import the actions including new ones
import { 
    fetchUsers, 
    uploadProfilePicture, 
    deleteProfilePicture 
} from 'Store/Actions/userActions';
// Import the changePassword action
import { changePassword } from 'Store/Actions/AuthActions';

// Helper function to normalize metadata label
function normalizeMetaLabel(item) {
    if (item == null) return '';
    if (typeof item === 'string') return item;
    return item.name ?? item.displayName ?? item.label ?? item.value ?? '';
}

const UserProfileComponent = () => {
    const dispatch = useDispatch();
    
    // Get auth state from Redux store for change password
    const authState = useSelector(state => state.authUser);
    
    // Get user data from Redux store
    const userState = useSelector(state => state.user);
    const companyState = useSelector(state => state.company);
    
    const [userData, setUserData] = useState(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [validationErrors, setValidationErrors] = useState({});
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const fileInputRef = useRef(null);

    const BASE_URL = (process.env.REACT_APP_BASE_URL || 'http://localhost:5228/api/').replace('/api/', '').replace('/api', '');

    // Fetch users when component mounts
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // Extract current user data from Redux
    useEffect(() => {
        const currentUserId = localStorage.getItem('userId');
        console.log('Current User ID from localStorage:', currentUserId);
        console.log('User State:', userState);
        
        if (currentUserId && userState.users && Array.isArray(userState.users)) {
            // Find the current user in the users list
            const foundUser = userState.users.find(user => {
                // Try different ID property names
                const userId = user.userId || user.id || user.UserId || user.ID;
                return String(userId) === String(currentUserId);
            });
            
            if (foundUser) {
                // Build businessUnits array from multiple possible shapes
                let businessUnitsArray = [];
                const rawBu = foundUser.businessUnits || foundUser.BusinessUnits || foundUser.businessUnit || foundUser.BusinessUnit;
                
                if (Array.isArray(rawBu)) {
                    businessUnitsArray = rawBu.map(x => normalizeMetaLabel(x)).filter(Boolean);
                } else if (typeof rawBu === 'string') {
                    businessUnitsArray = rawBu.split(',').map(s => s.trim()).filter(Boolean);
                }
                
                // Build access level string
                const accessLevel = normalizeMetaLabel(foundUser.accessLevel || foundUser.AccessLevel);
                
                // Get profile picture URL - check multiple possible properties
                const profilePicUrl = foundUser.profilePictureUrl || foundUser.profilePicUrl || foundUser.profilePicture || foundUser.profilePic;
                
                // Map the user data to our component's structure
                const mappedUserData = {
                    userId: foundUser.userId || foundUser.id || foundUser.UserId || foundUser.ID,
                    firstName: foundUser.firstName || foundUser.FirstName || '',
                    middleName: foundUser.middleName || foundUser.MiddleName || '',
                    lastName: foundUser.lastName || foundUser.LastName || '',
                    email: foundUser.email || foundUser.Email || '',
                    businessUnits: businessUnitsArray.length > 0 ? businessUnitsArray : ['Not assigned'],
                    accessLevel: accessLevel || 'Not specified',
                    contactNumber: foundUser.contactNumber || foundUser.ContactNumber || foundUser.phone || foundUser.Phone || 'Not provided',
                    location: foundUser.location || foundUser.Location || companyState?.company?.location || 'Not specified',
                    profilePic: profilePicUrl ? `${BASE_URL}${profilePicUrl}` : null,
                    isActive: foundUser.isActive !== undefined ? foundUser.isActive : (foundUser.IsActive !== undefined ? foundUser.IsActive : true),
                    companyId: foundUser.companyId || foundUser.CompanyId
                };
                
                console.log('Mapped user data:', mappedUserData);
                setUserData(mappedUserData);
            } else {
                console.log('User not found in users list');
                // Fallback: Get user from localStorage
                const storedUserData = localStorage.getItem('user');
                if (storedUserData) {
                    try {
                        const parsedUser = JSON.parse(storedUserData);
                        setUserData({
                            userId: currentUserId,
                            firstName: parsedUser.firstName || '',
                            middleName: parsedUser.middleName || '',
                            lastName: parsedUser.lastName || '',
                            email: parsedUser.email || '',
                            businessUnits: parsedUser.businessUnits || ['Not assigned'],
                            accessLevel: parsedUser.accessLevel || 'Not specified',
                            contactNumber: parsedUser.contactNumber || 'Not provided',
                            location: parsedUser.location || 'Not specified',
                            profilePic: null,
                            isActive: true
                        });
                    } catch (error) {
                        console.error('Error parsing stored user data:', error);
                    }
                }
            }
        } else {
            console.log('No user ID in localStorage or users array not available');
        }
        
        // Check if we're still loading users
        if (!userState.loading) {
            setLoading(false);
        }
    }, [userState, companyState, BASE_URL]);

    // Reset password form on successful change
    useEffect(() => {
        if (authState.changePasswordSuccess) {
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
            setPasswordStrength(0);
            setValidationErrors({});
        }
    }, [authState.changePasswordSuccess]);

    // Password validation rules
    const passwordRules = {
        minLength: { test: (pwd) => pwd.length >= 8, message: 'At least 8 characters' },
        hasUppercase: { test: (pwd) => /[A-Z]/.test(pwd), message: 'At least one uppercase letter' },
        hasLowercase: { test: (pwd) => /[a-z]/.test(pwd), message: 'At least one lowercase letter' },
        hasNumber: { test: (pwd) => /\d/.test(pwd), message: 'At least one number' },
        hasSpecialChar: { test: (pwd) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(pwd), message: 'At least one special character' }
    };

    // Calculate password strength
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        const rules = Object.values(passwordRules);
        rules.forEach(rule => {
            if (rule.test(password)) strength += 20;
        });
        return strength;
    };

    // Handle password input changes
    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));

        if (field === 'newPassword') {
            const strength = calculatePasswordStrength(value);
            setPasswordStrength(strength);

            // Validate new password against rules
            const errors = {};
            Object.entries(passwordRules).forEach(([key, rule]) => {
                if (!rule.test(value)) {
                    errors[key] = rule.message;
                }
            });
            setValidationErrors(prev => ({ ...prev, ...errors }));
        }
    };

    // Toggle password visibility
    const handleClickShowPassword = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    // Handle profile picture upload selection
    const handleProfilePicUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setSnackbar({
                    open: true,
                    message: 'File size should be less than 2MB',
                    severity: 'error'
                });
                return;
            }

            if (!file.type.match('image.*')) {
                setSnackbar({
                    open: true,
                    message: 'Only image files are allowed',
                    severity: 'error'
                });
                return;
            }

            setProfilePicFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setSnackbar({
                open: true,
                message: 'Profile picture selected successfully',
                severity: 'success'
            });
        }
    };

    // Trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Save profile picture to backend
    const saveProfilePic = async () => {
        if (!profilePicFile || !userData) return;

        setUploading(true);
        try {
            // Get subCompanyId if available (you might need to adjust this based on your app structure)
            const subCompanyId = localStorage.getItem('subCompanyId') || null;
            
            await dispatch(uploadProfilePicture(userData.userId, profilePicFile, subCompanyId));
            
            // The Redux state will be updated via fetchUsers in the action
            setProfilePicFile(null);
            setProfilePicPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            setSnackbar({
                open: true,
                message: 'Profile picture uploaded successfully',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to upload profile picture',
                severity: 'error'
            });
        } finally {
            setUploading(false);
        }
    };

    // Cancel profile picture change
    const cancelProfilePicChange = () => {
        setProfilePicFile(null);
        setProfilePicPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle delete profile picture
    const handleDeleteProfilePicture = async () => {
        if (!userData) return;

        setUploading(true);
        try {
            const subCompanyId = localStorage.getItem('subCompanyId') || null;
            await dispatch(deleteProfilePicture(userData.userId, subCompanyId));
            
            // Update local state immediately
            setUserData(prev => ({ ...prev, profilePic: null }));
            setDeleteDialogOpen(false);
            
            setSnackbar({
                open: true,
                message: 'Profile picture removed successfully',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to remove profile picture',
                severity: 'error'
            });
        } finally {
            setUploading(false);
        }
    };

    // Open delete confirmation dialog
    const openDeleteDialog = () => {
        setDeleteDialogOpen(true);
    };

    // Close delete confirmation dialog
    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    // Handle password update
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        // Validation
        const errors = {};

        if (!passwordData.currentPassword.trim()) {
            errors.currentPassword = 'Current password is required';
        }

        if (!passwordData.newPassword.trim()) {
            errors.newPassword = 'New password is required';
        }

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            errors.confirmNewPassword = 'Passwords do not match';
        }

        // Check if new password meets all requirements
        Object.entries(passwordRules).forEach(([key, rule]) => {
            if (!rule.test(passwordData.newPassword)) {
                errors[key] = rule.message;
            }
        });

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        // Clear previous errors
        setValidationErrors({});

        // Call the Redux action
        const result = await dispatch(changePassword(passwordData.currentPassword, passwordData.newPassword));
        
        if (result && result.success) {
            // The notification is already shown by the action
            // Form will be reset by useEffect when changePasswordSuccess is true
        }
    };

    // Close snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // Password strength color
    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 20) return '#ff4444';
        if (passwordStrength <= 40) return '#ffbb33';
        if (passwordStrength <= 60) return '#00C851';
        if (passwordStrength <= 80) return '#007E33';
        return '#007E33';
    };

    // Check if password meets all requirements
    const isPasswordValid = () => {
        return Object.values(passwordRules).every(rule => rule.test(passwordData.newPassword));
    };

    // Check if form can be submitted
    const canSubmitPasswordChange = () => {
        return (
            passwordData.currentPassword.trim() &&
            passwordData.newPassword.trim() &&
            passwordData.confirmNewPassword.trim() &&
            isPasswordValid() &&
            passwordData.newPassword === passwordData.confirmNewPassword &&
            !authState.changePasswordLoading
        );
    };

    // Show loading state
    if (loading || userState.loading) {
        return (
            <div className="container-fluid py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                            <CircularProgress />
                            <Typography variant="body1" className="ms-3">
                                Loading user information...
                            </Typography>
                        </Box>
                    </div>
                </div>
            </div>
        );
    }

    // Show error if user not found
    if (!userData) {
        return (
            <div className="container-fluid py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <Card className="shadow-sm">
                            <CardContent className="text-center p-5">
                                <PersonIcon style={{ fontSize: 60, color: '#dc3545' }} className="mb-3" />
                                <Typography variant="h5" className="mb-3">
                                    User Information Not Available
                                </Typography>
                                <Typography variant="body1" color="textSecondary" className="mb-3">
                                    Could not find user with ID: {localStorage.getItem('userId') || 'Unknown'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Please contact your administrator to set up your profile.
                                </Typography>
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    className="mt-3"
                                    onClick={() => window.location.reload()}
                                >
                                    Retry
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="row">
                        {/* Left Column - User Info */}
                        <div className="col-lg-6 mb-4">
                            <Card className="shadow-sm h-100">
                                <CardContent className="p-4">
                                    <div className="d-flex align-items-center mb-4">
                                        <PersonIcon className="me-3" style={{ fontSize: 40, color: '#1976d2' }} />
                                        <Typography variant="h5" component="h2" className="fw-bold">
                                            User Information
                                        </Typography>
                                        <Chip 
                                            label={userData.isActive ? "Active" : "Inactive"} 
                                            color={userData.isActive ? "primary" : "default"}
                                            size="small"
                                            className="ms-auto"
                                        />
                                    </div>

                                    <Divider className="mb-4" />

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                First Name
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                value={userData.firstName}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Middle Name
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                value={userData.middleName || 'N/A'}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Last Name
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                value={userData.lastName}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Contact Number
                                            </Typography>
                                            <div className="d-flex align-items-center">
                                                <PhoneIcon className="me-2" fontSize="small" color="action" />
                                                <TextField
                                                    fullWidth
                                                    value={userData.contactNumber}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12 mb-3">
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                <EmailIcon fontSize="small" className="me-2" />
                                                Email Address
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                value={userData.email}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </div>

                                        <div className="col-12 mb-3">
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                <LocationIcon fontSize="small" className="me-2" />
                                                Location
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                value={userData.location}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </div>

                                        <div className="col-12 mb-3">
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                <BusinessIcon fontSize="small" className="me-2" />
                                                Business Units
                                            </Typography>
                                            <div className="d-flex flex-wrap gap-2">
                                                {userData.businessUnits.map((unit, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={unit}
                                                        color="primary"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                <SecurityIcon fontSize="small" className="me-2" />
                                                Access Level
                                            </Typography>
                                            <Chip
                                                label={userData.accessLevel}
                                                color="secondary"
                                                className="fw-bold"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Profile Pic & Password */}
                        <div className="col-lg-6">
                            {/* Profile Picture Section */}
                            <Card className="shadow-sm mb-4">
                                <CardContent className="p-4">
                                    <div className="d-flex align-items-center mb-4">
                                        <EditIcon className="me-3" style={{ fontSize: 40, color: '#1976d2' }} />
                                        <Typography variant="h5" component="h2" className="fw-bold">
                                            Profile Picture
                                        </Typography>
                                    </div>

                                    <Divider className="mb-4" />

                                    <div className="text-center mb-4">
                                        <Avatar
                                            src={profilePicPreview || userData.profilePic}
                                            className="mx-auto mb-3"
                                            style={{ 
                                                width: 150, 
                                                height: 150, 
                                                border: '3px solid #e0e0e0',
                                                cursor: userData.profilePic ? 'pointer' : 'default'
                                            }}
                                            onClick={() => userData.profilePic && window.open(userData.profilePic, '_blank')}
                                        >
                                            {!profilePicPreview && !userData.profilePic && (
                                                <PersonIcon style={{ fontSize: 80 }} />
                                            )}
                                        </Avatar>

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleProfilePicUpload}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />

                                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<CloudUploadIcon />}
                                                onClick={triggerFileInput}
                                                className="mb-2"
                                                disabled={uploading}
                                            >
                                                {uploading ? <CircularProgress size={20} /> : 'Choose Image'}
                                            </Button>

                                            {userData.profilePic && !profilePicPreview && (
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={openDeleteDialog}
                                                    className="mb-2"
                                                    disabled={uploading}
                                                >
                                                    Remove
                                                </Button>
                                            )}

                                            {profilePicPreview && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        startIcon={<CheckCircleIcon />}
                                                        onClick={saveProfilePic}
                                                        className="mb-2"
                                                        disabled={uploading}
                                                    >
                                                        {uploading ? <CircularProgress size={20} /> : 'Save'}
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        startIcon={<CancelIcon />}
                                                        onClick={cancelProfilePicChange}
                                                        className="mb-2"
                                                        disabled={uploading}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                        </div>

                                        <Typography variant="caption" color="textSecondary" display="block" className="mt-2">
                                            Supported formats: JPG, PNG, GIF • Max size: 2MB
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Password Update Section */}
                            <Card className="shadow-sm">
                                <CardContent className="p-4">
                                    <div className="d-flex align-items-center mb-4">
                                        <SecurityIcon className="me-3" style={{ fontSize: 40, color: '#1976d2' }} />
                                        <Typography variant="h5" component="h2" className="fw-bold">
                                            Update Password
                                        </Typography>
                                    </div>

                                    <Divider className="mb-4" />

                                    <form onSubmit={handlePasswordUpdate}>
                                        {/* Current Password */}
                                        <FormControl 
                                            fullWidth 
                                            variant="outlined" 
                                            className="mb-3" 
                                            error={!!validationErrors.currentPassword}
                                        >
                                            <InputLabel htmlFor="current-password">Current Password</InputLabel>
                                            <OutlinedInput
                                                id="current-password"
                                                type={showPassword.current ? 'text' : 'password'}
                                                value={passwordData.currentPassword}
                                                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => handleClickShowPassword('current')}
                                                            edge="end"
                                                        >
                                                            {showPassword.current ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Current Password"
                                            />
                                            {validationErrors.currentPassword && (
                                                <FormHelperText>{validationErrors.currentPassword}</FormHelperText>
                                            )}
                                        </FormControl>

                                        {/* New Password */}
                                        <FormControl fullWidth variant="outlined" className="mb-3">
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
                                            {passwordData.newPassword && (
                                                <>
                                                    <div className="mt-2">
                                                        <Typography variant="caption" display="block" gutterBottom>
                                                            Password Strength: {passwordStrength}%
                                                        </Typography>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={passwordStrength}
                                                            style={{
                                                                height: 8,
                                                                borderRadius: 4,
                                                                backgroundColor: '#e0e0e0'
                                                            }}
                                                            classes={{
                                                                bar: {
                                                                    backgroundColor: getPasswordStrengthColor()
                                                                }
                                                            }}
                                                        />
                                                        <div className="mt-2">
                                                            {Object.entries(passwordRules).map(([key, rule]) => (
                                                                <div key={key} className="d-flex align-items-center mb-1">
                                                                    {rule.test(passwordData.newPassword) ? (
                                                                        <CheckCircleIcon fontSize="small" className="me-1" style={{ color: '#4CAF50' }} />
                                                                    ) : (
                                                                        <ErrorIcon fontSize="small" className="me-1" style={{ color: '#f44336' }} />
                                                                    )}
                                                                    <Typography variant="caption" style={{
                                                                        color: rule.test(passwordData.newPassword) ? '#4CAF50' : '#f44336'
                                                                    }}>
                                                                        {rule.message}
                                                                    </Typography>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </FormControl>

                                        {/* Confirm New Password */}
                                        <FormControl 
                                            fullWidth 
                                            variant="outlined" 
                                            className="mb-4" 
                                            error={!!validationErrors.confirmNewPassword}
                                        >
                                            <InputLabel htmlFor="confirm-password">Confirm New Password</InputLabel>
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
                                                label="Confirm New Password"
                                            />
                                            {validationErrors.confirmNewPassword && (
                                                <FormHelperText>{validationErrors.confirmNewPassword}</FormHelperText>
                                            )}
                                            {passwordData.confirmNewPassword &&
                                                passwordData.newPassword === passwordData.confirmNewPassword &&
                                                passwordData.confirmNewPassword.length > 0 && (
                                                    <FormHelperText style={{ color: '#4CAF50' }}>
                                                        <CheckCircleIcon fontSize="small" className="me-1" />
                                                        Passwords match
                                                    </FormHelperText>
                                                )}
                                        </FormControl>

                                        {/* Update Button */}
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            size="large"
                                            disabled={!canSubmitPasswordChange()}
                                        >
                                            {authState.changePasswordLoading ? (
                                                <CircularProgress size={24} color="inherit" />
                                            ) : (
                                                'Update Password'
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Profile Picture?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to remove your profile picture? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary" disabled={uploading}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteProfilePicture} color="error" autoFocus disabled={uploading}>
                        {uploading ? <CircularProgress size={20} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
                style={{
                    backgroundColor: snackbar.severity === 'success' ? '#4CAF50' : '#f44336',
                    color: 'white',
                    borderRadius: '4px',
                    padding: '6px 16px'
                }}
            />
        </div>
    );
}; 

export default UserProfileComponent;