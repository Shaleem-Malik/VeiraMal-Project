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
    DialogTitle,
    Container,
    Grid
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import {
    Visibility,
    VisibilityOff,
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

// Redux actions
import {
    fetchUsers,
    uploadProfilePicture,
    deleteProfilePicture
} from 'Store/Actions/userActions';

import { changePassword } from 'Store/Actions/AuthActions';


// =========================================================
// Helper
// =========================================================

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


// =========================================================
// Password strength helper
// =========================================================

function getPasswordStrengthColor(strength) {
    if (strength <= 20) return '#d64545';
    if (strength <= 40) return '#d99a19';
    if (strength <= 60) return '#2e9d60';
    if (strength <= 80) return '#23834a';

    return '#23834a';
}


// =========================================================
// Styles
// =========================================================

const useStyles = makeStyles((theme) => ({
    // -----------------------------------------------------
    // PAGE ROOT
    // -----------------------------------------------------

    root: {
        /*
         * IMPORTANT:
         * Do not use a fixed/minimal height such as 85vh here.
         * The password section can become taller depending on
         * validation messages and screen size.
         *
         * minHeight allows short pages to fill the screen,
         * while the page can naturally grow beyond the viewport.
         */
        minHeight: '100vh',
        height: 'auto',

        backgroundColor: '#f6f8fb',

        /*
         * Extra bottom padding prevents the footer from
         * visually covering the bottom of the password card.
         */
        padding: theme.spacing(3, 0, 12),

        boxSizing: 'border-box',
        overflow: 'visible',

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2, 0, 10),
        },
    },

    container: {
        maxWidth: 1280,
    },


    // -----------------------------------------------------
    // PAGE HEADER
    // -----------------------------------------------------

    pageHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(3),

        [theme.breakpoints.down('sm')]: {
            alignItems: 'flex-start',
            flexDirection: 'column',
            gap: theme.spacing(2),
        },
    },

    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.5),
    },

    headerIcon: {
        width: 50,
        height: 50,
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eef2ff',
        color: '#3f51b5',
        flexShrink: 0,
    },

    pageTitle: {
        fontSize: '1.8rem',
        lineHeight: 1.2,
        fontWeight: 800,
        color: '#172033',
        letterSpacing: '-0.4px',

        [theme.breakpoints.down('sm')]: {
            fontSize: '1.5rem',
        },
    },

    pageSubtitle: {
        marginTop: 4,
        color: '#7a8593',
        fontSize: '0.88rem',
        lineHeight: 1.5,
    },

    statusChip: {
        fontWeight: 700,
        borderRadius: 8,
    },


    // -----------------------------------------------------
    // GRID
    // -----------------------------------------------------

    grid: {
        /*
         * IMPORTANT:
         * Do not stretch both columns to the same height.
         *
         * The password card can naturally grow because of
         * password validation rules.
         */
        alignItems: 'flex-start',
    },


    // -----------------------------------------------------
    // MAIN CARD
    // -----------------------------------------------------

    mainCard: {
        /*
         * IMPORTANT:
         * Removed height: 100%.
         *
         * This allows the card to use its natural content height
         * instead of creating an artificial equal-height column.
         */
        height: 'auto',

        borderRadius: 18,
        backgroundColor: '#ffffff',
        border: '1px solid #e8edf3',
        boxShadow: '0 5px 20px rgba(31, 41, 55, 0.055)',

        overflow: 'hidden',

        boxSizing: 'border-box',
    },


    // -----------------------------------------------------
    // CARD HEADER
    // -----------------------------------------------------

    cardHeader: {
        padding: theme.spacing(2.25, 2.5),

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2),
        },
    },

    cardHeaderLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.25),
    },

    cardHeaderIcon: {
        width: 40,
        height: 40,
        borderRadius: 11,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: '#eef2ff',
        color: '#3f51b5',

        flexShrink: 0,
    },

    cardHeaderIconPurple: {
        backgroundColor: '#f3ecff',
        color: '#7c4dff',
    },

    cardHeaderIconGreen: {
        backgroundColor: '#edf9f2',
        color: '#2e9d60',
    },

    cardTitle: {
        fontSize: '1rem',
        fontWeight: 700,
        color: '#202b3c',
    },

    cardSubtitle: {
        fontSize: '0.74rem',
        color: '#8b96a4',
        marginTop: 2,
    },


    // -----------------------------------------------------
    // CARD CONTENT
    // -----------------------------------------------------

    cardContent: {
        padding: theme.spacing(2.5),

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2),
        },
    },


    // -----------------------------------------------------
    // FIELDS
    // -----------------------------------------------------

    fieldGroup: {
        marginBottom: theme.spacing(1.75),

        /*
         * Prevent flex/grid shrinking issues from causing
         * password validation content to overflow.
         */
        minWidth: 0,
    },

    fieldLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: theme.spacing(0.75),

        color: '#465266',
        fontSize: '0.76rem',
        fontWeight: 700,
    },

    fieldIcon: {
        color: '#9aa5b1',
        fontSize: 17,
    },


    // -----------------------------------------------------
    // INPUT
    // -----------------------------------------------------

    input: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#ffffff',

            '& fieldset': {
                borderColor: '#dde3ea',
            },

            '&:hover fieldset': {
                borderColor: '#bac4cf',
            },

            '&.Mui-focused fieldset': {
                borderColor: '#3f51b5',
            },
        },

        '& .MuiInputBase-input': {
            fontSize: '0.84rem',
            color: '#344054',
        },
    },

    readOnlyInput: {
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#fafbfd',
        },
    },


    // -----------------------------------------------------
    // VALUE BOX
    // -----------------------------------------------------

    valueBox: {
        minHeight: 44,

        padding: theme.spacing(1, 1.25),

        border: '1px solid #e3e8ef',
        borderRadius: 10,

        backgroundColor: '#fafbfd',

        display: 'flex',
        alignItems: 'center',

        color: '#344054',
        fontSize: '0.84rem',

        wordBreak: 'break-word',
    },


    // -----------------------------------------------------
    // BUSINESS UNIT CHIPS
    // -----------------------------------------------------

    chipsBox: {
        minHeight: 44,

        padding: theme.spacing(0.75),

        border: '1px solid #e3e8ef',
        borderRadius: 10,

        backgroundColor: '#fafbfd',

        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',

        gap: theme.spacing(0.75),
    },

    accessChip: {
        borderRadius: 7,
        fontWeight: 700,
    },


    // -----------------------------------------------------
    // PROFILE PICTURE
    // -----------------------------------------------------

    profileSection: {
        textAlign: 'center',
    },

    avatarWrap: {
        width: 166,
        height: 166,

        margin: '0 auto',
        padding: 5,

        borderRadius: 22,

        backgroundColor: '#eef2ff',
        border: '1px solid #dfe5fb',

        boxSizing: 'border-box',
    },

    avatar: {
        width: '100%',
        height: '100%',

        borderRadius: 18,

        backgroundColor: '#ffffff',
        color: '#6574c7',

        border: '2px solid #ffffff',
    },

    clickableAvatar: {
        cursor: 'pointer',
    },

    profileHint: {
        marginTop: theme.spacing(1.25),

        color: '#8a96a3',
        fontSize: '0.72rem',
        lineHeight: 1.5,
    },


    // -----------------------------------------------------
    // BUTTON ROW
    // -----------------------------------------------------

    actionRow: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',

        gap: theme.spacing(1),

        marginTop: theme.spacing(2),
    },

    actionButton: {
        minHeight: 40,

        borderRadius: 9,

        textTransform: 'none',
        fontWeight: 700,

        padding: theme.spacing(0.75, 1.5),

        boxShadow: 'none',
    },


    // -----------------------------------------------------
    // PASSWORD CARD
    // -----------------------------------------------------

    passwordCard: {
        /*
         * IMPORTANT:
         * The card must grow naturally with its contents.
         */
        height: 'auto',

        marginTop: theme.spacing(2),

        borderRadius: 18,

        backgroundColor: '#ffffff',
        border: '1px solid #e8edf3',

        boxShadow: '0 5px 20px rgba(31, 41, 55, 0.055)',

        overflow: 'hidden',

        boxSizing: 'border-box',

        /*
         * Ensures the password card stays above any
         * surrounding footer/positioned element.
         */
        position: 'relative',
        zIndex: 1,
    },


    // -----------------------------------------------------
    // PASSWORD STRENGTH
    // -----------------------------------------------------

    strengthBox: {
        marginTop: theme.spacing(1),

        padding: theme.spacing(1.25),

        borderRadius: 10,

        backgroundColor: '#fafbfd',
        border: '1px solid #edf0f4',

        /*
         * Allow content to determine height.
         */
        height: 'auto',
        boxSizing: 'border-box',
    },

    strengthLabel: {
        display: 'flex',
        justifyContent: 'space-between',

        marginBottom: 7,

        color: '#667085',

        fontSize: '0.72rem',
        fontWeight: 700,
    },

    progress: {
        height: 7,
        borderRadius: 4,

        backgroundColor: '#e8edf2',

        '& .MuiLinearProgress-bar': {
            backgroundColor: (props) =>
                props.strengthColor || '#3f51b5',

            borderRadius: 4,
        },
    },

    ruleList: {
        marginTop: theme.spacing(1),
    },

    ruleRow: {
        display: 'flex',
        alignItems: 'center',

        marginBottom: 4,

        minHeight: 20,

        /*
         * Prevent text from forcing horizontal overflow.
         */
        minWidth: 0,
    },

    ruleText: {
        fontSize: '0.7rem',

        /*
         * Allow long validation text to wrap safely.
         */
        wordBreak: 'break-word',
    },


    // -----------------------------------------------------
    // UPDATE PASSWORD BUTTON
    // -----------------------------------------------------

    updateButton: {
        minHeight: 44,

        borderRadius: 10,

        textTransform: 'none',
        fontWeight: 700,

        marginTop: theme.spacing(0.5),

        boxShadow:
            '0 6px 16px rgba(63, 81, 181, 0.18)',

        '&:hover': {
            boxShadow:
                '0 9px 22px rgba(63, 81, 181, 0.23)',
        },
    },


    // -----------------------------------------------------
    // SECURITY INFO
    // -----------------------------------------------------

    infoBox: {
        marginTop: theme.spacing(1.5),

        padding: theme.spacing(1.25),

        borderRadius: 10,

        display: 'flex',
        alignItems: 'flex-start',

        gap: theme.spacing(0.8),

        backgroundColor: '#f5f7ff',
        border: '1px solid #e3e7fb',

        color: '#687487',

        fontSize: '0.7rem',
        lineHeight: 1.5,

        /*
         * Important for small screens.
         */
        minWidth: 0,

        wordBreak: 'break-word',
    },


    // -----------------------------------------------------
    // LOADING
    // -----------------------------------------------------

    loadingState: {
        minHeight: 420,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        flexDirection: 'column',

        gap: theme.spacing(1.25),

        color: '#87919e',
    },

    loadingText: {
        fontSize: '0.8rem',
    },


    // -----------------------------------------------------
    // EMPTY STATE
    // -----------------------------------------------------

    emptyState: {
        minHeight: 420,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        flexDirection: 'column',

        textAlign: 'center',

        padding: theme.spacing(5),
    },

    emptyIcon: {
        width: 70,
        height: 70,

        borderRadius: 18,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: '#f1f4f8',
        color: '#9ca6b2',

        marginBottom: theme.spacing(1.5),
    },

    emptyTitle: {
        color: '#344054',
        fontSize: '1rem',
        fontWeight: 700,
    },

    emptyDescription: {
        marginTop: 5,

        color: '#8a96a3',
        fontSize: '0.8rem',
    },
}));


// =========================================================
// Main Component
// =========================================================

const UserProfileComponent = () => {

    const dispatch = useDispatch();


    // -----------------------------------------------------
    // Redux state
    // -----------------------------------------------------

    const authState = useSelector(
        (state) => state.authUser
    );

    const userState = useSelector(
        (state) => state.user
    );

    const companyState = useSelector(
        (state) => state.company
    );


    // -----------------------------------------------------
    // Local state
    // -----------------------------------------------------

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


    // -----------------------------------------------------
    // Dynamic styles
    // -----------------------------------------------------

    const classes = useStyles({
        strengthColor:
            getPasswordStrengthColor(passwordStrength)
    });


    // -----------------------------------------------------
    // Base URL
    // -----------------------------------------------------

    const BASE_URL = (
        process.env.REACT_APP_BASE_URL ||
        'http://localhost:5228/api/'
    )
        .replace('/api/', '')
        .replace('/api', '');


    // =====================================================
    // Fetch users
    // =====================================================

    useEffect(() => {

        dispatch(fetchUsers());

    }, [dispatch]);


    // =====================================================
    // Extract current user
    // =====================================================

    useEffect(() => {

        const currentUserId =
            localStorage.getItem('userId');


        if (
            currentUserId &&
            userState.users &&
            Array.isArray(userState.users)
        ) {

            const foundUser =
                userState.users.find((user) => {

                    const userId =
                        user.userId ||
                        user.id ||
                        user.UserId ||
                        user.ID;

                    return (
                        String(userId) ===
                        String(currentUserId)
                    );
                });


            if (foundUser) {

                // -------------------------------------------------
                // Business units
                // -------------------------------------------------

                let businessUnitsArray = [];

                const rawBu =
                    foundUser.businessUnits ||
                    foundUser.BusinessUnits ||
                    foundUser.businessUnit ||
                    foundUser.BusinessUnit;


                if (Array.isArray(rawBu)) {

                    businessUnitsArray =
                        rawBu
                            .map((x) =>
                                normalizeMetaLabel(x)
                            )
                            .filter(Boolean);

                } else if (
                    typeof rawBu === 'string'
                ) {

                    businessUnitsArray =
                        rawBu
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean);
                }


                // -------------------------------------------------
                // Access level
                // -------------------------------------------------

                const accessLevel =
                    normalizeMetaLabel(
                        foundUser.accessLevel ||
                        foundUser.AccessLevel
                    );


                // -------------------------------------------------
                // Profile picture
                // -------------------------------------------------

                const profilePicUrl =
                    foundUser.profilePictureUrl ||
                    foundUser.profilePicUrl ||
                    foundUser.profilePicture ||
                    foundUser.profilePic;


                // -------------------------------------------------
                // Map user
                // -------------------------------------------------

                const mappedUserData = {

                    userId:
                        foundUser.userId ||
                        foundUser.id ||
                        foundUser.UserId ||
                        foundUser.ID,

                    firstName:
                        foundUser.firstName ||
                        foundUser.FirstName ||
                        '',

                    middleName:
                        foundUser.middleName ||
                        foundUser.MiddleName ||
                        '',

                    lastName:
                        foundUser.lastName ||
                        foundUser.LastName ||
                        '',

                    email:
                        foundUser.email ||
                        foundUser.Email ||
                        '',

                    businessUnits:
                        businessUnitsArray.length > 0
                            ? businessUnitsArray
                            : ['Not assigned'],

                    accessLevel:
                        accessLevel ||
                        'Not specified',

                    contactNumber:
                        foundUser.contactNumber ||
                        foundUser.ContactNumber ||
                        foundUser.phone ||
                        foundUser.Phone ||
                        'Not provided',

                    location:
                        foundUser.location ||
                        foundUser.Location ||
                        companyState?.company?.location ||
                        'Not specified',

                    profilePic:
                        profilePicUrl
                            ? `${BASE_URL}${profilePicUrl}`
                            : null,

                    isActive:
                        foundUser.isActive !== undefined
                            ? foundUser.isActive
                            : (
                                foundUser.IsActive !== undefined
                                    ? foundUser.IsActive
                                    : true
                            ),

                    companyId:
                        foundUser.companyId ||
                        foundUser.CompanyId
                };


                setUserData(mappedUserData);

            } else {

                // -------------------------------------------------
                // Fallback to localStorage
                // -------------------------------------------------

                const storedUserData =
                    localStorage.getItem('user');


                if (storedUserData) {

                    try {

                        const parsedUser =
                            JSON.parse(storedUserData);


                        setUserData({

                            userId: currentUserId,

                            firstName:
                                parsedUser.firstName ||
                                '',

                            middleName:
                                parsedUser.middleName ||
                                '',

                            lastName:
                                parsedUser.lastName ||
                                '',

                            email:
                                parsedUser.email ||
                                '',

                            businessUnits:
                                parsedUser.businessUnits ||
                                ['Not assigned'],

                            accessLevel:
                                parsedUser.accessLevel ||
                                'Not specified',

                            contactNumber:
                                parsedUser.contactNumber ||
                                'Not provided',

                            location:
                                parsedUser.location ||
                                'Not specified',

                            profilePic: null,

                            isActive: true
                        });

                    } catch (error) {

                        console.error(
                            'Error parsing stored user data:',
                            error
                        );
                    }
                }
            }
        }


        if (!userState.loading) {
            setLoading(false);
        }

    }, [
        userState,
        companyState,
        BASE_URL
    ]);


    // =====================================================
    // Reset password after successful change
    // =====================================================

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

    }, [
        authState.changePasswordSuccess
    ]);


    // =====================================================
    // Password rules
    // =====================================================

    const passwordRules = {

        minLength: {
            test: (pwd) =>
                pwd.length >= 8,

            message:
                'At least 8 characters'
        },

        hasUppercase: {
            test: (pwd) =>
                /[A-Z]/.test(pwd),

            message:
                'At least one uppercase letter'
        },

        hasLowercase: {
            test: (pwd) =>
                /[a-z]/.test(pwd),

            message:
                'At least one lowercase letter'
        },

        hasNumber: {
            test: (pwd) =>
                /\d/.test(pwd),

            message:
                'At least one number'
        },

        hasSpecialChar: {
            test: (pwd) =>
                /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(
                    pwd
                ),

            message:
                'At least one special character'
        }
    };


    // =====================================================
    // Calculate password strength
    // =====================================================

    const calculatePasswordStrength = (
        password
    ) => {

        let strength = 0;

        const rules =
            Object.values(passwordRules);


        rules.forEach((rule) => {

            if (rule.test(password)) {
                strength += 20;
            }

        });


        return strength;
    };


    // =====================================================
    // Password input change
    // =====================================================

    const handlePasswordChange = (
        field,
        value
    ) => {

        setPasswordData((prev) => ({
            ...prev,
            [field]: value
        }));


        if (field === 'newPassword') {

            const strength =
                calculatePasswordStrength(value);


            setPasswordStrength(strength);


            const errors = {};


            Object.entries(passwordRules).forEach(
                ([key, rule]) => {

                    if (!rule.test(value)) {
                        errors[key] = rule.message;
                    }

                }
            );


            setValidationErrors((prev) => ({
                ...prev,
                ...errors
            }));
        }


        if (field === 'confirmNewPassword') {

            setValidationErrors((prev) => {

                const next = {
                    ...prev
                };


                if (
                    value &&
                    value !==
                        passwordData.newPassword
                ) {

                    next.confirmNewPassword =
                        'Passwords do not match';

                } else {

                    delete next.confirmNewPassword;
                }


                return next;
            });
        }


        if (field === 'currentPassword') {

            setValidationErrors((prev) => {

                const next = {
                    ...prev
                };


                if (value.trim()) {
                    delete next.currentPassword;
                }


                return next;
            });
        }
    };


    // =====================================================
    // Password visibility
    // =====================================================

    const handleClickShowPassword = (
        field
    ) => {

        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };


    // =====================================================
    // Profile picture selection
    // =====================================================

    const handleProfilePicUpload = (
        event
    ) => {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        // -------------------------------------------------
        // 5 MB limit
        // -------------------------------------------------

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            setSnackbar({
                open: true,
                message:
                    'File size should be less than 5MB',
                severity: 'error'
            });

            return;
        }


        // -------------------------------------------------
        // Image validation
        // -------------------------------------------------

        if (
            !file.type.match('image.*')
        ) {

            setSnackbar({
                open: true,
                message:
                    'Only image files are allowed',
                severity: 'error'
            });

            return;
        }


        setProfilePicFile(file);


        const reader =
            new FileReader();


        reader.onloadend = () => {

            setProfilePicPreview(
                reader.result
            );
        };


        reader.readAsDataURL(file);


        setSnackbar({
            open: true,
            message:
                'Profile picture selected successfully',
            severity: 'success'
        });
    };


    // =====================================================
    // Trigger file input
    // =====================================================

    const triggerFileInput = () => {

        if (fileInputRef.current) {

            fileInputRef.current.click();
        }
    };


    // =====================================================
    // Save profile picture
    // =====================================================

    const saveProfilePic = async () => {

        if (
            !profilePicFile ||
            !userData
        ) {
            return;
        }


        setUploading(true);


        try {

            const subCompanyId =
                localStorage.getItem(
                    'subCompanyId'
                ) || null;


            await dispatch(
                uploadProfilePicture(
                    userData.userId,
                    profilePicFile,
                    subCompanyId
                )
            );


            setProfilePicFile(null);

            setProfilePicPreview(null);


            if (fileInputRef.current) {

                fileInputRef.current.value =
                    '';
            }


            setSnackbar({
                open: true,
                message:
                    'Profile picture uploaded successfully',
                severity: 'success'
            });

        } catch (error) {

            setSnackbar({
                open: true,
                message:
                    error.message ||
                    'Failed to upload profile picture',
                severity: 'error'
            });

        } finally {

            setUploading(false);
        }
    };


    // =====================================================
    // Cancel profile picture change
    // =====================================================

    const cancelProfilePicChange = () => {

        setProfilePicFile(null);

        setProfilePicPreview(null);


        if (fileInputRef.current) {

            fileInputRef.current.value =
                '';
        }
    };


    // =====================================================
    // Delete profile picture
    // =====================================================

    const handleDeleteProfilePicture = async () => {

        if (!userData) {
            return;
        }


        setUploading(true);


        try {

            const subCompanyId =
                localStorage.getItem(
                    'subCompanyId'
                ) || null;


            await dispatch(
                deleteProfilePicture(
                    userData.userId,
                    subCompanyId
                )
            );


            setUserData((prev) => ({
                ...prev,
                profilePic: null
            }));


            setDeleteDialogOpen(false);


            setSnackbar({
                open: true,
                message:
                    'Profile picture removed successfully',
                severity: 'success'
            });

        } catch (error) {

            setSnackbar({
                open: true,
                message:
                    error.message ||
                    'Failed to remove profile picture',
                severity: 'error'
            });

        } finally {

            setUploading(false);
        }
    };


    // =====================================================
    // Delete dialog
    // =====================================================

    const openDeleteDialog = () => {

        setDeleteDialogOpen(true);
    };


    const closeDeleteDialog = () => {

        setDeleteDialogOpen(false);
    };


    // =====================================================
    // Password update
    // =====================================================

    const handlePasswordUpdate = async (
        e
    ) => {

        e.preventDefault();


        const errors = {};


        // -------------------------------------------------
        // Current password
        // -------------------------------------------------

        if (
            !passwordData.currentPassword.trim()
        ) {

            errors.currentPassword =
                'Current password is required';
        }


        // -------------------------------------------------
        // New password
        // -------------------------------------------------

        if (
            !passwordData.newPassword.trim()
        ) {

            errors.newPassword =
                'New password is required';
        }


        // -------------------------------------------------
        // Confirm password
        // -------------------------------------------------

        if (
            passwordData.newPassword !==
            passwordData.confirmNewPassword
        ) {

            errors.confirmNewPassword =
                'Passwords do not match';
        }


        // -------------------------------------------------
        // Password rules
        // -------------------------------------------------

        Object.entries(passwordRules).forEach(
            ([key, rule]) => {

                if (
                    !rule.test(
                        passwordData.newPassword
                    )
                ) {

                    errors[key] =
                        rule.message;
                }

            }
        );


        if (
            Object.keys(errors).length > 0
        ) {

            setValidationErrors(errors);

            return;
        }


        setValidationErrors({});


        const result =
            await dispatch(
                changePassword(
                    passwordData.currentPassword,
                    passwordData.newPassword
                )
            );


        if (
            result &&
            result.success
        ) {
            // Success handled by Redux action.
        }
    };


    // =====================================================
    // Snackbar
    // =====================================================

    const handleCloseSnackbar = (
        event,
        reason
    ) => {

        if (
            reason === 'clickaway'
        ) {
            return;
        }


        setSnackbar((prev) => ({
            ...prev,
            open: false
        }));
    };


    // =====================================================
    // Password validation
    // =====================================================

    const isPasswordValid = () => {

        return Object.values(
            passwordRules
        ).every(
            (rule) =>
                rule.test(
                    passwordData.newPassword
                )
        );
    };


    const canSubmitPasswordChange = () => {

        return (
            passwordData.currentPassword.trim() &&
            passwordData.newPassword.trim() &&
            passwordData.confirmNewPassword.trim() &&
            isPasswordValid() &&
            passwordData.newPassword ===
                passwordData.confirmNewPassword &&
            !authState.changePasswordLoading
        );
    };


    // =====================================================
    // Loading state
    // =====================================================

    if (
        loading ||
        userState.loading
    ) {

        return (
            <div className={classes.root}>

                <Container
                    maxWidth="lg"
                    className={classes.container}
                >

                    <Box
                        className={
                            classes.loadingState
                        }
                    >

                        <CircularProgress />


                        <Typography
                            className={
                                classes.loadingText
                            }
                        >
                            Loading user information...
                        </Typography>

                    </Box>

                </Container>

            </div>
        );
    }


    // =====================================================
    // User not found
    // =====================================================

    if (!userData) {

        return (
            <div className={classes.root}>

                <Container
                    maxWidth="lg"
                    className={classes.container}
                >

                    <Card
                        className={
                            classes.mainCard
                        }
                    >

                        <Box
                            className={
                                classes.emptyState
                            }
                        >

                            <Box
                                className={
                                    classes.emptyIcon
                                }
                            >

                                <PersonIcon
                                    style={{
                                        fontSize: 38
                                    }}
                                />

                            </Box>


                            <Typography
                                className={
                                    classes.emptyTitle
                                }
                            >
                                User Information Not Available
                            </Typography>


                            <Typography
                                className={
                                    classes.emptyDescription
                                }
                            >
                                Could not find user with ID:{' '}
                                {localStorage.getItem(
                                    'userId'
                                ) || 'Unknown'}
                            </Typography>


                            <Typography
                                className={
                                    classes.emptyDescription
                                }
                            >
                                Please contact your administrator
                                to set up your profile.
                            </Typography>


                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() =>
                                    window.location.reload()
                                }
                                style={{
                                    marginTop: 18,
                                    borderRadius: 9,
                                    textTransform:
                                        'none',
                                    fontWeight: 700
                                }}
                            >
                                Retry
                            </Button>

                        </Box>

                    </Card>

                </Container>

            </div>
        );
    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className={classes.root}>

            <Container
                maxWidth="lg"
                className={classes.container}
            >

                {/* =================================================
                    PAGE HEADER
                ================================================== */}

                <Box
                    className={
                        classes.pageHeader
                    }
                >

                    <Box
                        className={
                            classes.headerLeft
                        }
                    >

                        <Box
                            className={
                                classes.headerIcon
                            }
                        >

                            <PersonIcon />

                        </Box>


                        <Box>

                            <Typography
                                className={
                                    classes.pageTitle
                                }
                            >
                                My Profile
                            </Typography>


                            <Typography
                                className={
                                    classes.pageSubtitle
                                }
                            >
                                View your personal information,
                                profile picture and security settings.
                            </Typography>

                        </Box>

                    </Box>


                    <Chip
                        icon={
                            <CheckCircleIcon
                                style={{
                                    fontSize: 17
                                }}
                            />
                        }
                        label={
                            userData.isActive
                                ? 'Active Account'
                                : 'Inactive Account'
                        }
                        color={
                            userData.isActive
                                ? 'primary'
                                : 'default'
                        }
                        className={
                            classes.statusChip
                        }
                    />

                </Box>


                {/* =================================================
                    MAIN GRID
                ================================================== */}

                <Grid
                    container
                    spacing={3}
                    className={classes.grid}
                >

                    {/* =================================================
                        LEFT COLUMN
                    ================================================== */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Card
                            className={
                                classes.mainCard
                            }
                        >

                            {/* Card Header */}

                            <Box
                                className={
                                    classes.cardHeader
                                }
                            >

                                <Box
                                    className={
                                        classes.cardHeaderLeft
                                    }
                                >

                                    <Box
                                        className={
                                            classes.cardHeaderIcon
                                        }
                                    >

                                        <PersonIcon
                                            fontSize="small"
                                        />

                                    </Box>


                                    <Box>

                                        <Typography
                                            className={
                                                classes.cardTitle
                                            }
                                        >
                                            Personal Information
                                        </Typography>


                                        <Typography
                                            className={
                                                classes.cardSubtitle
                                            }
                                        >
                                            Your account and contact details
                                        </Typography>

                                    </Box>

                                </Box>

                            </Box>


                            <Divider />


                            <CardContent
                                className={
                                    classes.cardContent
                                }
                            >

                                <Grid
                                    container
                                    spacing={2}
                                >

                                    {/* First Name */}

                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                    >

                                        <Box
                                            className={
                                                classes.fieldGroup
                                            }
                                        >

                                            <Typography
                                                className={
                                                    classes.fieldLabel
                                                }
                                            >
                                                First Name
                                            </Typography>


                                            <TextField
                                                fullWidth
                                                value={
                                                    userData.firstName
                                                }
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    readOnly: true
                                                }}
                                                className={`${classes.input} ${classes.readOnlyInput}`}
                                            />

                                        </Box>

                                    </Grid>


                                    {/* Middle Name */}

                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                    >

                                        <Box
                                            className={
                                                classes.fieldGroup
                                            }
                                        >

                                            <Typography
                                                className={
                                                    classes.fieldLabel
                                                }
                                            >
                                                Middle Name
                                            </Typography>


                                            <TextField
                                                fullWidth
                                                value={
                                                    userData.middleName ||
                                                    'N/A'
                                                }
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    readOnly: true
                                                }}
                                                className={`${classes.input} ${classes.readOnlyInput}`}
                                            />

                                        </Box>

                                    </Grid>


                                    {/* Last Name */}

                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                    >

                                        <Box
                                            className={
                                                classes.fieldGroup
                                            }
                                        >

                                            <Typography
                                                className={
                                                    classes.fieldLabel
                                                }
                                            >
                                                Last Name
                                            </Typography>


                                            <TextField
                                                fullWidth
                                                value={
                                                    userData.lastName
                                                }
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    readOnly: true
                                                }}
                                                className={`${classes.input} ${classes.readOnlyInput}`}
                                            />

                                        </Box>

                                    </Grid>


                                    {/* Contact Number */}

                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                    >

                                        <Box
                                            className={
                                                classes.fieldGroup
                                            }
                                        >

                                            <Typography
                                                className={
                                                    classes.fieldLabel
                                                }
                                            >

                                                <PhoneIcon
                                                    className={
                                                        classes.fieldIcon
                                                    }
                                                />

                                                Contact Number

                                            </Typography>


                                            <TextField
                                                fullWidth
                                                value={
                                                    userData.contactNumber
                                                }
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    readOnly: true
                                                }}
                                                className={`${classes.input} ${classes.readOnlyInput}`}
                                            />

                                        </Box>

                                    </Grid>


                                    {/* Email */}

                                    <Grid
                                        item
                                        xs={12}
                                    >

                                        <Box
                                            className={
                                                classes.fieldGroup
                                            }
                                        >

                                            <Typography
                                                className={
                                                    classes.fieldLabel
                                                }
                                            >

                                                <EmailIcon
                                                    className={
                                                        classes.fieldIcon
                                                    }
                                                />

                                                Email Address

                                            </Typography>


                                            <TextField
                                                fullWidth
                                                value={
                                                    userData.email
                                                }
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    readOnly: true
                                                }}
                                                className={`${classes.input} ${classes.readOnlyInput}`}
                                            />

                                        </Box>

                                    </Grid>


                                    {/* Location */}

                                    <Grid
                                        item
                                        xs={12}
                                    >

                                        <Box
                                            className={
                                                classes.fieldGroup
                                            }
                                        >

                                            <Typography
                                                className={
                                                    classes.fieldLabel
                                                }
                                            >

                                                <LocationIcon
                                                    className={
                                                        classes.fieldIcon
                                                    }
                                                />

                                                Location

                                            </Typography>


                                            <TextField
                                                fullWidth
                                                value={
                                                    userData.location
                                                }
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    readOnly: true
                                                }}
                                                className={`${classes.input} ${classes.readOnlyInput}`}
                                            />

                                        </Box>

                                    </Grid>


                                    {/* Business Units */}

                                    <Grid
                                        item
                                        xs={12}
                                    >

                                        <Box
                                            className={
                                                classes.fieldGroup
                                            }
                                        >

                                            <Typography
                                                className={
                                                    classes.fieldLabel
                                                }
                                            >

                                                <BusinessIcon
                                                    className={
                                                        classes.fieldIcon
                                                    }
                                                />

                                                Business Units

                                            </Typography>


                                            <Box
                                                className={
                                                    classes.chipsBox
                                                }
                                            >

                                                {userData.businessUnits.map(
                                                    (
                                                        unit,
                                                        index
                                                    ) => (

                                                        <Chip
                                                            key={
                                                                index
                                                            }
                                                            label={
                                                                unit
                                                            }
                                                            color="primary"
                                                            variant="outlined"
                                                            size="small"
                                                            className={
                                                                classes.accessChip
                                                            }
                                                        />

                                                    )
                                                )}

                                            </Box>

                                        </Box>

                                    </Grid>


                                    {/* Access Level */}

                                    <Grid
                                        item
                                        xs={12}
                                    >

                                        <Box
                                            className={
                                                classes.fieldGroup
                                            }
                                        >

                                            <Typography
                                                className={
                                                    classes.fieldLabel
                                                }
                                            >

                                                <SecurityIcon
                                                    className={
                                                        classes.fieldIcon
                                                    }
                                                />

                                                Access Level

                                            </Typography>


                                            <Box
                                                className={
                                                    classes.valueBox
                                                }
                                            >

                                                <Chip
                                                    label={
                                                        userData.accessLevel
                                                    }
                                                    color="secondary"
                                                    size="small"
                                                    className={
                                                        classes.accessChip
                                                    }
                                                />

                                            </Box>

                                        </Box>

                                    </Grid>

                                </Grid>

                            </CardContent>

                        </Card>

                    </Grid>


                    {/* =================================================
                        RIGHT COLUMN
                    ================================================== */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        {/* =================================================
                            PROFILE PICTURE
                        ================================================== */}

                        <Card
                            className={
                                classes.mainCard
                            }
                        >

                            <Box
                                className={
                                    classes.cardHeader
                                }
                            >

                                <Box
                                    className={
                                        classes.cardHeaderLeft
                                    }
                                >

                                    <Box
                                        className={`${classes.cardHeaderIcon} ${classes.cardHeaderIconGreen}`}
                                    >

                                        <PersonIcon
                                            fontSize="small"
                                        />

                                    </Box>


                                    <Box>

                                        <Typography
                                            className={
                                                classes.cardTitle
                                            }
                                        >
                                            Profile Picture
                                        </Typography>


                                        <Typography
                                            className={
                                                classes.cardSubtitle
                                            }
                                        >
                                            Manage your profile image
                                        </Typography>

                                    </Box>

                                </Box>

                            </Box>


                            <Divider />


                            <CardContent
                                className={
                                    classes.cardContent
                                }
                            >

                                <Box
                                    className={
                                        classes.profileSection
                                    }
                                >

                                    {/* Avatar */}

                                    <Box
                                        className={
                                            classes.avatarWrap
                                        }
                                    >

                                        <Avatar
                                            src={
                                                profilePicPreview ||
                                                userData.profilePic ||
                                                undefined
                                            }
                                            className={`${classes.avatar} ${
                                                userData.profilePic
                                                    ? classes.clickableAvatar
                                                    : ''
                                            }`}
                                            onClick={() => {

                                                if (
                                                    userData.profilePic
                                                ) {

                                                    window.open(
                                                        userData.profilePic,
                                                        '_blank',
                                                        'noopener,noreferrer'
                                                    );
                                                }

                                            }}
                                        >

                                            {!profilePicPreview &&
                                                !userData.profilePic && (

                                                    <PersonIcon
                                                        style={{
                                                            fontSize: 80
                                                        }}
                                                    />

                                                )}

                                        </Avatar>

                                    </Box>


                                    {/* Hidden file input */}

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={
                                            handleProfilePicUpload
                                        }
                                        accept="image/*"
                                        style={{
                                            display: 'none'
                                        }}
                                    />


                                    {/* Buttons */}

                                    <Box
                                        className={
                                            classes.actionRow
                                        }
                                    >

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={
                                                <CloudUploadIcon />
                                            }
                                            onClick={
                                                triggerFileInput
                                            }
                                            className={
                                                classes.actionButton
                                            }
                                            disabled={
                                                uploading
                                            }
                                        >

                                            {uploading ? (
                                                <CircularProgress
                                                    size={20}
                                                    color="inherit"
                                                />
                                            ) : (
                                                'Choose Image'
                                            )}

                                        </Button>


                                        {/* Remove */}

                                        {userData.profilePic &&
                                            !profilePicPreview && (

                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    startIcon={
                                                        <DeleteIcon />
                                                    }
                                                    onClick={
                                                        openDeleteDialog
                                                    }
                                                    className={
                                                        classes.actionButton
                                                    }
                                                    disabled={
                                                        uploading
                                                    }
                                                >
                                                    Remove
                                                </Button>

                                            )}


                                        {/* Save / Cancel */}

                                        {profilePicPreview && (

                                            <>

                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={
                                                        <CheckCircleIcon />
                                                    }
                                                    onClick={
                                                        saveProfilePic
                                                    }
                                                    className={
                                                        classes.actionButton
                                                    }
                                                    disabled={
                                                        uploading
                                                    }
                                                >

                                                    {uploading ? (
                                                        <CircularProgress
                                                            size={20}
                                                            color="inherit"
                                                        />
                                                    ) : (
                                                        'Save'
                                                    )}

                                                </Button>


                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    startIcon={
                                                        <CancelIcon />
                                                    }
                                                    onClick={
                                                        cancelProfilePicChange
                                                    }
                                                    className={
                                                        classes.actionButton
                                                    }
                                                    disabled={
                                                        uploading
                                                    }
                                                >
                                                    Cancel
                                                </Button>

                                            </>

                                        )}

                                    </Box>


                                    <Typography
                                        className={
                                            classes.profileHint
                                        }
                                    >
                                        Supported formats: JPG, PNG,
                                        GIF • Maximum size: 5MB
                                    </Typography>

                                </Box>

                            </CardContent>

                        </Card>


                        {/* =================================================
                            UPDATE PASSWORD
                        ================================================== */}

                        <Card
                            className={
                                classes.passwordCard
                            }
                        >

                            <Box
                                className={
                                    classes.cardHeader
                                }
                            >

                                <Box
                                    className={
                                        classes.cardHeaderLeft
                                    }
                                >

                                    <Box
                                        className={`${classes.cardHeaderIcon} ${classes.cardHeaderIconPurple}`}
                                    >

                                        <SecurityIcon
                                            fontSize="small"
                                        />

                                    </Box>


                                    <Box>

                                        <Typography
                                            className={
                                                classes.cardTitle
                                            }
                                        >
                                            Update Password
                                        </Typography>


                                        <Typography
                                            className={
                                                classes.cardSubtitle
                                            }
                                        >
                                            Change your account password
                                            securely
                                        </Typography>

                                    </Box>

                                </Box>

                            </Box>


                            <Divider />


                            <CardContent
                                className={
                                    classes.cardContent
                                }
                            >

                                <form
                                    onSubmit={
                                        handlePasswordUpdate
                                    }
                                >

                                    {/* =================================================
                                        CURRENT PASSWORD
                                    ================================================== */}

                                    <FormControl
                                        fullWidth
                                        variant="outlined"
                                        className={
                                            classes.fieldGroup
                                        }
                                        error={
                                            !!validationErrors.currentPassword
                                        }
                                    >

                                        <InputLabel
                                            htmlFor="current-password"
                                        >
                                            Current Password
                                        </InputLabel>


                                        <OutlinedInput
                                            id="current-password"
                                            type={
                                                showPassword.current
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={
                                                passwordData.currentPassword
                                            }
                                            onChange={(e) =>
                                                handlePasswordChange(
                                                    'currentPassword',
                                                    e.target.value
                                                )
                                            }
                                            endAdornment={

                                                <InputAdornment
                                                    position="end"
                                                >

                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() =>
                                                            handleClickShowPassword(
                                                                'current'
                                                            )
                                                        }
                                                        edge="end"
                                                    >

                                                        {showPassword.current ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}

                                                    </IconButton>

                                                </InputAdornment>

                                            }
                                            label="Current Password"
                                            className={
                                                classes.input
                                            }
                                        />


                                        {validationErrors.currentPassword && (

                                            <FormHelperText>
                                                {
                                                    validationErrors.currentPassword
                                                }
                                            </FormHelperText>

                                        )}

                                    </FormControl>


                                    {/* =================================================
                                        NEW PASSWORD
                                    ================================================== */}

                                    <FormControl
                                        fullWidth
                                        variant="outlined"
                                        className={
                                            classes.fieldGroup
                                        }
                                        error={
                                            !!validationErrors.newPassword
                                        }
                                    >

                                        <InputLabel
                                            htmlFor="new-password"
                                        >
                                            New Password
                                        </InputLabel>


                                        <OutlinedInput
                                            id="new-password"
                                            type={
                                                showPassword.new
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={
                                                passwordData.newPassword
                                            }
                                            onChange={(e) =>
                                                handlePasswordChange(
                                                    'newPassword',
                                                    e.target.value
                                                )
                                            }
                                            endAdornment={

                                                <InputAdornment
                                                    position="end"
                                                >

                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() =>
                                                            handleClickShowPassword(
                                                                'new'
                                                            )
                                                        }
                                                        edge="end"
                                                    >

                                                        {showPassword.new ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}

                                                    </IconButton>

                                                </InputAdornment>

                                            }
                                            label="New Password"
                                            className={
                                                classes.input
                                            }
                                        />


                                        {/* Password strength */}

                                        {passwordData.newPassword && (

                                            <Box
                                                className={
                                                    classes.strengthBox
                                                }
                                            >

                                                <Box
                                                    className={
                                                        classes.strengthLabel
                                                    }
                                                >

                                                    <span>
                                                        Password Strength
                                                    </span>

                                                    <span>
                                                        {
                                                            passwordStrength
                                                        }%
                                                    </span>

                                                </Box>


                                                <LinearProgress
                                                    variant="determinate"
                                                    value={
                                                        passwordStrength
                                                    }
                                                    className={
                                                        classes.progress
                                                    }
                                                />


                                                <Box
                                                    className={
                                                        classes.ruleList
                                                    }
                                                >

                                                    {Object.entries(
                                                        passwordRules
                                                    ).map(
                                                        (
                                                            [key, rule]
                                                        ) => {

                                                            const valid =
                                                                rule.test(
                                                                    passwordData.newPassword
                                                                );


                                                            return (

                                                                <Box
                                                                    key={
                                                                        key
                                                                    }
                                                                    className={
                                                                        classes.ruleRow
                                                                    }
                                                                >

                                                                    {valid ? (

                                                                        <CheckCircleIcon
                                                                            fontSize="small"
                                                                            style={{
                                                                                color: '#2e9d60',
                                                                                marginRight: 5,
                                                                                flexShrink: 0
                                                                            }}
                                                                        />

                                                                    ) : (

                                                                        <ErrorIcon
                                                                            fontSize="small"
                                                                            style={{
                                                                                color: '#d64545',
                                                                                marginRight: 5,
                                                                                flexShrink: 0
                                                                            }}
                                                                        />

                                                                    )}


                                                                    <Typography
                                                                        className={
                                                                            classes.ruleText
                                                                        }
                                                                        style={{
                                                                            color:
                                                                                valid
                                                                                    ? '#23834a'
                                                                                    : '#b42318'
                                                                        }}
                                                                    >
                                                                        {
                                                                            rule.message
                                                                        }
                                                                    </Typography>

                                                                </Box>

                                                            );
                                                        }
                                                    )}

                                                </Box>

                                            </Box>

                                        )}

                                    </FormControl>


                                    {/* =================================================
                                        CONFIRM PASSWORD
                                    ================================================== */}

                                    <FormControl
                                        fullWidth
                                        variant="outlined"
                                        className={
                                            classes.fieldGroup
                                        }
                                        error={
                                            !!validationErrors.confirmNewPassword
                                        }
                                    >

                                        <InputLabel
                                            htmlFor="confirm-password"
                                        >
                                            Confirm New Password
                                        </InputLabel>


                                        <OutlinedInput
                                            id="confirm-password"
                                            type={
                                                showPassword.confirm
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={
                                                passwordData.confirmNewPassword
                                            }
                                            onChange={(e) =>
                                                handlePasswordChange(
                                                    'confirmNewPassword',
                                                    e.target.value
                                                )
                                            }
                                            endAdornment={

                                                <InputAdornment
                                                    position="end"
                                                >

                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() =>
                                                            handleClickShowPassword(
                                                                'confirm'
                                                            )
                                                        }
                                                        edge="end"
                                                    >

                                                        {showPassword.confirm ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}

                                                    </IconButton>

                                                </InputAdornment>

                                            }
                                            label="Confirm New Password"
                                            className={
                                                classes.input
                                            }
                                        />


                                        {validationErrors.confirmNewPassword && (

                                            <FormHelperText>
                                                {
                                                    validationErrors.confirmNewPassword
                                                }
                                            </FormHelperText>

                                        )}


                                        {passwordData.confirmNewPassword &&
                                            passwordData.newPassword ===
                                                passwordData.confirmNewPassword &&
                                            passwordData.confirmNewPassword
                                                .length > 0 && (

                                                <FormHelperText
                                                    style={{
                                                        color: '#23834a',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >

                                                    <CheckCircleIcon
                                                        fontSize="small"
                                                        style={{
                                                            marginRight: 5
                                                        }}
                                                    />

                                                    Passwords match

                                                </FormHelperText>

                                            )}

                                    </FormControl>


                                    {/* =================================================
                                        UPDATE BUTTON
                                    ================================================== */}

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        className={
                                            classes.updateButton
                                        }
                                        disabled={
                                            !canSubmitPasswordChange()
                                        }
                                    >

                                        {authState.changePasswordLoading ? (

                                            <CircularProgress
                                                size={22}
                                                color="inherit"
                                            />

                                        ) : (

                                            'Update Password'

                                        )}

                                    </Button>

                                </form>


                                {/* =================================================
                                    SECURITY INFORMATION
                                ================================================== */}

                                <Box
                                    className={
                                        classes.infoBox
                                    }
                                >

                                    <SecurityIcon
                                        style={{
                                            color: '#6574c7',
                                            fontSize: 17,
                                            flexShrink: 0
                                        }}
                                    />

                                    <span>
                                        Use a strong password with
                                        uppercase, lowercase, number,
                                        special character, and at least
                                        8 characters.
                                    </span>

                                </Box>

                            </CardContent>

                        </Card>

                    </Grid>

                </Grid>

            </Container>


            {/* =================================================
                DELETE PROFILE PICTURE DIALOG
            ================================================== */}

            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >

                <DialogTitle id="alert-dialog-title">
                    Delete Profile Picture?
                </DialogTitle>


                <DialogContent>

                    <DialogContentText
                        id="alert-dialog-description"
                    >
                        Are you sure you want to remove your
                        profile picture? This action cannot be
                        undone.
                    </DialogContentText>

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={
                            closeDeleteDialog
                        }
                        color="primary"
                        disabled={
                            uploading
                        }
                    >
                        Cancel
                    </Button>


                    <Button
                        onClick={
                            handleDeleteProfilePicture
                        }
                        color="secondary"
                        autoFocus
                        disabled={
                            uploading
                        }
                    >

                        {uploading ? (

                            <CircularProgress
                                size={20}
                            />

                        ) : (

                            'Delete'

                        )}

                    </Button>

                </DialogActions>

            </Dialog>


            {/* =================================================
                SNACKBAR
            ================================================== */}

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={
                    handleCloseSnackbar
                }
                message={
                    snackbar.message
                }
                action={

                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={
                            handleCloseSnackbar
                        }
                    >

                        <CloseIcon
                            fontSize="small"
                        />

                    </IconButton>

                }
            />

        </div>
    );
};


export default UserProfileComponent;