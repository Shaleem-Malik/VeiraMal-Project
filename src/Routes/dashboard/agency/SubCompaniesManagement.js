import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

import {
    Box,
    Button,
    Card,
    Checkbox,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from '@material-ui/core';

import {
    Add as AddIcon,
    Business as BusinessIcon,
    Close as CloseIcon,
    DeleteOutline as DeleteIcon,
    EmailOutlined as EmailIcon,
    LocationOnOutlined as LocationIcon,
    PhoneOutlined as PhoneIcon,
    Search as SearchIcon,
    People as PeopleIcon,
    Security as SecurityIcon,
    CheckCircle as CheckCircleIcon,
    ArrowForward as ArrowForwardIcon,
    CalendarTodayOutlined as CalendarIcon,
    InfoOutlined as InfoIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '85vh',
        backgroundColor: '#f6f8fb',
        padding: theme.spacing(3, 0, 6),
    },

    container: {
        maxWidth: 1280,
    },

    // =========================================================
    // PAGE HEADER
    // =========================================================

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

    createButton: {
        minHeight: 44,
        borderRadius: 10,
        padding: theme.spacing(0, 2),
        textTransform: 'none',
        fontWeight: 700,
        boxShadow: '0 6px 16px rgba(63, 81, 181, 0.18)',

        '&:hover': {
            boxShadow: '0 9px 22px rgba(63, 81, 181, 0.23)',
        },
    },

    // =========================================================
    // ALERTS
    // =========================================================

    alert: {
        borderRadius: 12,
        marginBottom: theme.spacing(2),
        padding: theme.spacing(1.25, 1.5),
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },

    errorAlert: {
        backgroundColor: '#fff4f4',
        border: '1px solid #ffd9d9',
        color: '#b42318',
    },

    successAlert: {
        backgroundColor: '#edf9f2',
        border: '1px solid #d3f0dc',
        color: '#18794e',
    },

    alertContent: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: theme.spacing(1),
    },

    alertTitle: {
        fontWeight: 700,
        fontSize: '0.82rem',
        marginBottom: 2,
    },

    alertMessage: {
        fontSize: '0.8rem',
        lineHeight: 1.45,
    },

    alertClose: {
        padding: 4,
        color: 'inherit',
    },

    // =========================================================
    // STATS
    // =========================================================

    statsGrid: {
        marginBottom: theme.spacing(3),
    },

    statCard: {
        height: '100%',
        position: 'relative',
        borderRadius: 16,
        padding: theme.spacing(2.25),
        backgroundColor: '#ffffff',
        border: '1px solid #e8edf3',
        boxShadow: '0 5px 20px rgba(31, 41, 55, 0.055)',
        overflow: 'hidden',
        transition: 'all 0.25s ease',

        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 26px rgba(31, 41, 55, 0.08)',
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

    statAccentPurple: {
        backgroundColor: '#7c4dff',
    },

    statAccentGreen: {
        backgroundColor: '#2e9d60',
    },

    statTop: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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

    statIconPurple: {
        backgroundColor: '#f3ecff',
        color: '#7c4dff',
    },

    statIconGreen: {
        backgroundColor: '#edf9f2',
        color: '#2e9d60',
    },

    statValue: {
        fontSize: '1.95rem',
        fontWeight: 800,
        color: '#172033',
        lineHeight: 1,
    },

    statLabel: {
        marginTop: 6,
        color: '#737f8d',
        fontSize: '0.82rem',
        fontWeight: 600,
    },

    statDescription: {
        marginTop: theme.spacing(1.5),
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        color: '#9aa4af',
        fontSize: '0.71rem',
    },

    // =========================================================
    // MAIN CARD
    // =========================================================

    mainCard: {
        borderRadius: 18,
        backgroundColor: '#ffffff',
        border: '1px solid #e8edf3',
        boxShadow: '0 5px 20px rgba(31, 41, 55, 0.055)',
        overflow: 'hidden',
    },

    cardHeader: {
        padding: theme.spacing(2.25, 2.5),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        [theme.breakpoints.down('sm')]: {
            alignItems: 'flex-start',
            flexDirection: 'column',
            gap: theme.spacing(1.5),
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
    },

    cardTitle: {
        fontSize: '1rem',
        fontWeight: 750,
        color: '#202b3c',
    },

    cardSubtitle: {
        fontSize: '0.74rem',
        color: '#8b96a4',
        marginTop: 2,
    },

    countBadge: {
        minWidth: 30,
        height: 30,
        padding: '0 8px',
        borderRadius: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f4f8',
        color: '#667085',
        fontSize: '0.78rem',
        fontWeight: 700,
    },

    tableWrapper: {
        width: '100%',
        overflowX: 'auto',
    },

    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: 0,
        minWidth: 900,
    },

    tableHead: {
        backgroundColor: '#f8fafc',
    },

    tableHeadCell: {
        padding: theme.spacing(1.5, 2),
        color: '#7c8794',
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #edf0f4',
    },

    tableBodyRow: {
        transition: 'background-color 0.18s ease',

        '&:hover': {
            backgroundColor: '#fafbfe',
        },

        '&:last-child td': {
            borderBottom: 0,
        },
    },

    tableCell: {
        padding: theme.spacing(1.5, 2),
        borderBottom: '1px solid #eef1f5',
        verticalAlign: 'middle',
        color: '#4b5563',
        fontSize: '0.83rem',
    },

    companyCell: {
        display: 'flex',
        alignItems: 'center',
        minWidth: 180,
    },

    companyAvatar: {
        width: 38,
        height: 38,
        borderRadius: 10,
        marginRight: theme.spacing(1.25),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eef2ff',
        color: '#3f51b5',
        flexShrink: 0,
    },

    companyName: {
        color: '#263246',
        fontSize: '0.86rem',
        fontWeight: 700,
        lineHeight: 1.3,
    },

    companySubtext: {
        marginTop: 2,
        color: '#9aa4af',
        fontSize: '0.7rem',
    },

    infoCell: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0.75),
        whiteSpace: 'nowrap',
    },

    cellIcon: {
        fontSize: 17,
        color: '#9aa5b1',
    },

    muted: {
        color: '#a1a9b4',
        fontSize: '0.79rem',
    },

    dateBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 8px',
        borderRadius: 7,
        backgroundColor: '#f6f8fb',
        color: '#657180',
        fontSize: '0.74rem',
        fontWeight: 600,
    },

    manageButton: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 650,
        fontSize: '0.77rem',
        padding: theme.spacing(0.7, 1.15),
        borderColor: '#dbe1e8',
        color: '#4c5c70',
        backgroundColor: '#ffffff',

        '&:hover': {
            borderColor: '#c2cad5',
            backgroundColor: '#f7f9fc',
        },
    },

    // =========================================================
    // EMPTY
    // =========================================================

    emptyState: {
        padding: theme.spacing(7, 3),
        textAlign: 'center',
    },

    emptyIconWrapper: {
        width: 70,
        height: 70,
        margin: '0 auto',
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
        marginBottom: theme.spacing(2),
        color: '#8a96a3',
        fontSize: '0.8rem',
    },

    // =========================================================
    // DIALOG
    // =========================================================

    dialog: {
        '& .MuiDialog-paper': {
            borderRadius: 18,
            boxShadow: '0 24px 70px rgba(15, 23, 42, 0.22)',
            overflow: 'hidden',
        },
    },

    dialogHeader: {
        padding: theme.spacing(2.25, 2.5),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #edf0f4',
        backgroundColor: '#ffffff',
    },

    dialogHeaderLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.25),
    },

    dialogIcon: {
        width: 42,
        height: 42,
        borderRadius: 11,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eef2ff',
        color: '#3f51b5',
    },

    dialogIconPurple: {
        backgroundColor: '#f3ecff',
        color: '#7c4dff',
    },

    dialogTitle: {
        fontSize: '1.06rem',
        fontWeight: 750,
        color: '#202a3b',
    },

    dialogSubtitle: {
        fontSize: '0.75rem',
        color: '#8b96a4',
        marginTop: 2,
    },

    closeButton: {
        color: '#929ca8',
    },

    dialogContent: {
        padding: theme.spacing(2.5),

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2),
        },
    },

    formGroup: {
        marginBottom: theme.spacing(2),
    },

    formLabel: {
        display: 'block',
        marginBottom: theme.spacing(0.75),
        color: '#465266',
        fontSize: '0.78rem',
        fontWeight: 700,
    },

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
        },
    },

    helperText: {
        marginTop: 5,
        color: '#97a1ad',
        fontSize: '0.69rem',
    },

    sectionBox: {
        padding: theme.spacing(1.75),
        borderRadius: 13,
        backgroundColor: '#fafbfd',
        border: '1px solid #edf0f4',
        marginTop: theme.spacing(1),
    },

    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(1.25),
    },

    sectionHeaderLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0.8),
    },

    sectionIcon: {
        color: '#6574c7',
        fontSize: 19,
    },

    sectionTitle: {
        fontSize: '0.82rem',
        fontWeight: 700,
        color: '#364152',
    },

    selectedCount: {
        color: '#6f7b89',
        fontSize: '0.72rem',
        fontWeight: 600,
    },

    userList: {
        maxHeight: 240,
        overflowY: 'auto',
        padding: theme.spacing(0.75),
        borderRadius: 10,
        border: '1px solid #e6eaf0',
        backgroundColor: '#ffffff',

        '&::-webkit-scrollbar': {
            width: 6,
        },

        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#cbd2db',
            borderRadius: 10,
        },
    },

    userItem: {
        margin: 0,
        padding: theme.spacing(0.8, 1),
        borderRadius: 9,
        width: '100%',
        alignItems: 'flex-start',

        '&:hover': {
            backgroundColor: '#f5f7fb',
        },

        '& .MuiFormControlLabel-label': {
            width: '100%',
        },
    },

    userRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },

    userInfo: {
        minWidth: 0,
    },

    userName: {
        color: '#344054',
        fontSize: '0.79rem',
        fontWeight: 650,
    },

    userEmail: {
        color: '#929ca8',
        fontSize: '0.7rem',
        marginTop: 2,
    },

    assignedChip: {
        height: 22,
        borderRadius: 6,
        backgroundColor: '#eaf8f0',
        color: '#23834a',
        fontSize: '0.63rem',
        fontWeight: 700,
        flexShrink: 0,
    },

    infoBox: {
        marginTop: theme.spacing(1.5),
        padding: theme.spacing(1.25),
        borderRadius: 9,
        display: 'flex',
        alignItems: 'flex-start',
        gap: theme.spacing(0.8),
        backgroundColor: '#f5f7ff',
        border: '1px solid #e3e7fb',
    },

    infoIcon: {
        color: '#6574c7',
        fontSize: 17,
        marginTop: 1,
    },

    infoText: {
        color: '#687487',
        fontSize: '0.7rem',
        lineHeight: 1.5,
    },

    dialogActions: {
        padding: theme.spacing(1.5, 2.5),
        borderTop: '1px solid #edf0f4',
        backgroundColor: '#fbfcfd',
        gap: theme.spacing(1),
    },

    cancelButton: {
        textTransform: 'none',
        borderRadius: 9,
        fontWeight: 650,
        color: '#697586',
    },

    saveButton: {
        textTransform: 'none',
        borderRadius: 9,
        fontWeight: 700,
        padding: theme.spacing(0.9, 2),
        boxShadow: 'none',

        '&:hover': {
            boxShadow: '0 6px 16px rgba(63, 81, 181, 0.18)',
        },
    },

    // =========================================================
    // LOADING
    // =========================================================

    loadingState: {
        padding: theme.spacing(7),
        textAlign: 'center',
    },

    loadingText: {
        marginTop: theme.spacing(1.25),
        color: '#87919e',
        fontSize: '0.8rem',
    },
}));

export default function SubCompaniesManagement() {
    const classes = useStyles();

    const [subCompanies, setSubCompanies] = useState([]);
    const [superUsers, setSuperUsers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);

    const [selectedSubCompany, setSelectedSubCompany] =
        useState(null);

    const [createForm, setCreateForm] = useState({
        companyName: '',
        companyABN: '',
        contactNumber: '',
        location: '',
        assignedSuperUserIds: [],
    });

    const [assignForm, setAssignForm] = useState({
        userIds: [],
    });

    const [userSearch, setUserSearch] = useState('');

    // =========================================================
    // HELPERS
    // =========================================================

    const getParentCompanyId = () => {
        return localStorage.getItem('companyId') || '';
    };

    const API_BASE_URL =
        `${process.env.REACT_APP_BASE_URL}Company`;

    // =========================================================
    // FETCH SUBCOMPANIES
    // =========================================================

    const fetchSubCompanies = async () => {
        const parentCompanyId = getParentCompanyId();

        if (!parentCompanyId) {
            setError('Parent company ID not found');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.get(
                `${API_BASE_URL}/${parentCompanyId}/subcompanies`
            );

            setSubCompanies(response.data || []);
            setError('');
        } catch (err) {
            setError(
                'Failed to fetch subcompanies: ' +
                (err.response?.data?.error ||
                    err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // FETCH PARENT SUPERUSERS
    // =========================================================

    const fetchSuperUsers = async () => {
        const parentCompanyId = getParentCompanyId();

        if (!parentCompanyId) return;

        try {
            const response = await axios.get(
                `${API_BASE_URL}/${parentCompanyId}/superusers`
            );

            setSuperUsers(response.data || []);
        } catch (err) {
            console.error(
                'Failed to fetch superusers:',
                err
            );
        }
    };

    // =========================================================
    // CREATE SUBCOMPANY
    // =========================================================

    const handleCreateSubCompany = async (e) => {
        e.preventDefault();

        const parentCompanyId =
            getParentCompanyId();

        if (!createForm.companyName.trim()) {
            setError('Company name is required');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                companyName:
                    createForm.companyName.trim(),

                companyABN:
                    createForm.companyABN.trim() || null,

                contactNumber:
                    createForm.contactNumber.trim() ||
                    null,

                location:
                    createForm.location.trim() || null,

                assignedSuperUserIds: [
                    ...new Set(
                        createForm.assignedSuperUserIds
                    ),
                ],
            };

            await axios.post(
                `${API_BASE_URL}/${parentCompanyId}/subcompanies`,
                payload
            );

            setSuccess(
                'Subcompany created successfully!'
            );

            setShowCreateModal(false);

            resetCreateForm();

            await fetchSubCompanies();
        } catch (err) {
            setError(
                'Failed to create subcompany: ' +
                (err.response?.data?.error ||
                    err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // ASSIGN SUPERUSERS
    // =========================================================

    const handleAssignSuperUsers = async (e) => {
        e.preventDefault();

        if (!selectedSubCompany) {
            setError(
                'No subcompany selected.'
            );

            return;
        }

        const parentCompanyId =
            getParentCompanyId();

        const userIds = [
            ...new Set(assignForm.userIds),
        ];

        setLoading(true);

        try {
            const payload = {
                subCompanyId:
                    selectedSubCompany.companyId,

                userIds,
            };

            await axios.post(
                `${API_BASE_URL}/${parentCompanyId}/subcompanies/${selectedSubCompany.companyId}/assign-superusers`,
                payload
            );

            setSuccess(
                'Superusers assigned successfully!'
            );

            setShowAssignModal(false);

            resetAssignForm();

            await fetchSubCompanies();
        } catch (err) {
            setError(
                'Failed to assign superusers: ' +
                (err.response?.data?.error ||
                    err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // RESET
    // =========================================================

    const resetCreateForm = () => {
        setCreateForm({
            companyName: '',
            companyABN: '',
            contactNumber: '',
            location: '',
            assignedSuperUserIds: [],
        });
    };

    const resetAssignForm = () => {
        setAssignForm({
            userIds: [],
        });

        setSelectedSubCompany(null);
        setUserSearch('');
    };

    // =========================================================
    // FORM CHANGES
    // =========================================================

    const handleCreateFormChange = (
        field,
        value
    ) => {
        setCreateForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAssignFormChange = (userIds) => {
        setAssignForm({
            userIds: [
                ...new Set(userIds),
            ],
        });
    };

    const handleSuperUserToggle = (userId) => {
        setCreateForm((prev) => ({
            ...prev,

            assignedSuperUserIds:
                prev.assignedSuperUserIds.includes(
                    userId
                )
                    ? prev.assignedSuperUserIds.filter(
                          (id) => id !== userId
                      )
                    : [
                          ...prev.assignedSuperUserIds,
                          userId,
                      ],
        }));
    };

    // =========================================================
    // OPEN ASSIGN MODAL
    // =========================================================

    const openAssignModal = (subCompany) => {
        setSelectedSubCompany(
            subCompany
        );

        setAssignForm({
            userIds: [
                ...(subCompany.assignedSuperUserIds ||
                    []),
            ],
        });

        setUserSearch('');
        setShowAssignModal(true);
    };

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (dateString) => {
        if (!dateString) {
            return 'Not provided';
        }

        return new Date(
            dateString
        ).toLocaleDateString(
            'en-US',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }
        );
    };

    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {
        fetchSubCompanies();
        fetchSuperUsers();
    }, []);

    // =========================================================
    // CLEAR ALERTS
    // =========================================================

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 5000);

            return () =>
                clearTimeout(timer);
        }
    }, [error, success]);

    // =========================================================
    // FILTER USERS
    // =========================================================

    const filteredSuperUsers =
        superUsers.filter((user) => {
            const search =
                userSearch.toLowerCase();

            return (
                user.fullName
                    ?.toLowerCase()
                    .includes(search) ||
                user.email
                    ?.toLowerCase()
                    .includes(search)
            );
        });

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className={classes.root}>
            <Container className={classes.container}>
                {/* =================================================
                    HEADER
                ================================================= */}

                <Box className={classes.pageHeader}>
                    <Box className={classes.headerLeft}>
                        <Box
                            className={
                                classes.headerIcon
                            }
                        >
                            <BusinessIcon />
                        </Box>

                        <Box>
                            <Typography
                                className={
                                    classes.pageTitle
                                }
                            >
                                Sub Companies
                            </Typography>

                            <Typography
                                className={
                                    classes.pageSubtitle
                                }
                            >
                                Manage subsidiary companies
                                and assign their superusers.
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        className={
                            classes.createButton
                        }
                        startIcon={<AddIcon />}
                        onClick={() =>
                            setShowCreateModal(true)
                        }
                        disabled={loading}
                    >
                        Create Sub Company
                    </Button>
                </Box>

                {/* =================================================
                    ALERTS
                ================================================= */}

                {error && (
                    <Box
                        className={`${classes.alert} ${classes.errorAlert}`}
                    >
                        <Box
                            className={
                                classes.alertContent
                            }
                        >
                            <InfoIcon fontSize="small" />

                            <Box>
                                <Typography
                                    className={
                                        classes.alertTitle
                                    }
                                >
                                    Error
                                </Typography>

                                <Typography
                                    className={
                                        classes.alertMessage
                                    }
                                >
                                    {error}
                                </Typography>
                            </Box>
                        </Box>

                        <IconButton
                            className={
                                classes.alertClose
                            }
                            size="small"
                            onClick={() =>
                                setError('')
                            }
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}

                {success && (
                    <Box
                        className={`${classes.alert} ${classes.successAlert}`}
                    >
                        <Box
                            className={
                                classes.alertContent
                            }
                        >
                            <CheckCircleIcon fontSize="small" />

                            <Box>
                                <Typography
                                    className={
                                        classes.alertTitle
                                    }
                                >
                                    Success
                                </Typography>

                                <Typography
                                    className={
                                        classes.alertMessage
                                    }
                                >
                                    {success}
                                </Typography>
                            </Box>
                        </Box>

                        <IconButton
                            className={
                                classes.alertClose
                            }
                            size="small"
                            onClick={() =>
                                setSuccess('')
                            }
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}

                {/* =================================================
                    STATS
                ================================================= */}

                <Grid
                    container
                    spacing={2}
                    className={
                        classes.statsGrid
                    }
                >
                    <Grid item xs={12} sm={4}>
                        <Card className={classes.statCard}>
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
                                            subCompanies.length
                                        }
                                    </Typography>

                                    <Typography
                                        className={
                                            classes.statLabel
                                        }
                                    >
                                        Total Sub Companies
                                    </Typography>
                                </Box>

                                <Box
                                    className={
                                        classes.statIcon
                                    }
                                >
                                    <BusinessIcon />
                                </Box>
                            </Box>

                            <Typography
                                className={
                                    classes.statDescription
                                }
                            >
                                <ArrowForwardIcon
                                    style={{
                                        fontSize: 13,
                                    }}
                                />
                                Managed under your company
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Card className={classes.statCard}>
                            <Box
                                className={`${classes.statAccent} ${classes.statAccentPurple}`}
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
                                            superUsers.length
                                        }
                                    </Typography>

                                    <Typography
                                        className={
                                            classes.statLabel
                                        }
                                    >
                                        Available Superusers
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
                                <ArrowForwardIcon
                                    style={{
                                        fontSize: 13,
                                    }}
                                />
                                Parent company administrators
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Card className={classes.statCard}>
                            <Box
                                className={`${classes.statAccent} ${classes.statAccentGreen}`}
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
                                            subCompanies.filter(
                                                company =>
                                                    (
                                                        company.assignedSuperUserIds ||
                                                        []
                                                    ).length > 0
                                            ).length
                                        }
                                    </Typography>

                                    <Typography
                                        className={
                                            classes.statLabel
                                        }
                                    >
                                        Assigned Companies
                                    </Typography>
                                </Box>

                                <Box
                                    className={`${classes.statIcon} ${classes.statIconGreen}`}
                                >
                                    <PeopleIcon />
                                </Box>
                            </Box>

                            <Typography
                                className={
                                    classes.statDescription
                                }
                            >
                                <ArrowForwardIcon
                                    style={{
                                        fontSize: 13,
                                    }}
                                />
                                Companies with assigned users
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>

                {/* =================================================
                    SUBCOMPANIES TABLE
                ================================================= */}

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
                                className={
                                    classes.cardHeaderIcon
                                }
                            >
                                <BusinessIcon fontSize="small" />
                            </Box>

                            <Box>
                                <Typography
                                    className={
                                        classes.cardTitle
                                    }
                                >
                                    Sub Companies
                                </Typography>

                                <Typography
                                    className={
                                        classes.cardSubtitle
                                    }
                                >
                                    View and manage all subsidiary companies.
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            className={
                                classes.countBadge
                            }
                        >
                            {subCompanies.length}
                        </Box>
                    </Box>

                    <Divider />

                    {loading ? (
                        <Box
                            className={
                                classes.loadingState
                            }
                        >
                            <CircularProgress
                                size={32}
                                thickness={4}
                                color="primary"
                            />

                            <Typography
                                className={
                                    classes.loadingText
                                }
                            >
                                Loading sub companies...
                            </Typography>
                        </Box>
                    ) : subCompanies.length === 0 ? (
                        <Box
                            className={
                                classes.emptyState
                            }
                        >
                            <Box
                                className={
                                    classes.emptyIconWrapper
                                }
                            >
                                <BusinessIcon fontSize="large" />
                            </Box>

                            <Typography
                                className={
                                    classes.emptyTitle
                                }
                            >
                                No sub companies yet
                            </Typography>

                            <Typography
                                className={
                                    classes.emptyDescription
                                }
                            >
                                Create your first subsidiary company
                                to get started.
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={
                                    <AddIcon />
                                }
                                className={
                                    classes.createButton
                                }
                                onClick={() =>
                                    setShowCreateModal(
                                        true
                                    )
                                }
                            >
                                Create Your First
                                Sub Company
                            </Button>
                        </Box>
                    ) : (
                        <Box
                            className={
                                classes.tableWrapper
                            }
                        >
                            <table
                                className={
                                    classes.table
                                }
                            >
                                <thead
                                    className={
                                        classes.tableHead
                                    }
                                >
                                    <tr>
                                        <th
                                            className={
                                                classes.tableHeadCell
                                            }
                                        >
                                            Company
                                        </th>

                                        <th
                                            className={
                                                classes.tableHeadCell
                                            }
                                        >
                                            ABN
                                        </th>

                                        <th
                                            className={
                                                classes.tableHeadCell
                                            }
                                        >
                                            Contact
                                        </th>

                                        <th
                                            className={
                                                classes.tableHeadCell
                                            }
                                        >
                                            Location
                                        </th>

                                        <th
                                            className={
                                                classes.tableHeadCell
                                            }
                                        >
                                            Created
                                        </th>

                                        <th
                                            className={
                                                classes.tableHeadCell
                                            }
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {subCompanies.map(
                                        (
                                            company
                                        ) => (
                                            <tr
                                                key={
                                                    company.companyId
                                                }
                                                className={
                                                    classes.tableBodyRow
                                                }
                                            >
                                                <td
                                                    className={
                                                        classes.tableCell
                                                    }
                                                >
                                                    <Box
                                                        className={
                                                            classes.companyCell
                                                        }
                                                    >
                                                        <Box
                                                            className={
                                                                classes.companyAvatar
                                                            }
                                                        >
                                                            <BusinessIcon fontSize="small" />
                                                        </Box>

                                                        <Box>
                                                            <Typography
                                                                className={
                                                                    classes.companyName
                                                                }
                                                            >
                                                                {
                                                                    company.companyName
                                                                }
                                                            </Typography>

                                                            <Typography
                                                                className={
                                                                    classes.companySubtext
                                                                }
                                                            >
                                                                Sub Company
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </td>

                                                <td
                                                    className={
                                                        classes.tableCell
                                                    }
                                                >
                                                    {company.companyABN ? (
                                                        company.companyABN
                                                    ) : (
                                                        <span
                                                            className={
                                                                classes.muted
                                                            }
                                                        >
                                                            Not provided
                                                        </span>
                                                    )}
                                                </td>

                                                <td
                                                    className={
                                                        classes.tableCell
                                                    }
                                                >
                                                    {company.contactNumber ? (
                                                        <Box
                                                            className={
                                                                classes.infoCell
                                                            }
                                                        >
                                                            <PhoneIcon
                                                                className={
                                                                    classes.cellIcon
                                                                }
                                                            />

                                                            {
                                                                company.contactNumber
                                                            }
                                                        </Box>
                                                    ) : (
                                                        <span
                                                            className={
                                                                classes.muted
                                                            }
                                                        >
                                                            Not provided
                                                        </span>
                                                    )}
                                                </td>

                                                <td
                                                    className={
                                                        classes.tableCell
                                                    }
                                                >
                                                    {company.location ? (
                                                        <Box
                                                            className={
                                                                classes.infoCell
                                                            }
                                                        >
                                                            <LocationIcon
                                                                className={
                                                                    classes.cellIcon
                                                                }
                                                            />

                                                            {
                                                                company.location
                                                            }
                                                        </Box>
                                                    ) : (
                                                        <span
                                                            className={
                                                                classes.muted
                                                            }
                                                        >
                                                            Not provided
                                                        </span>
                                                    )}
                                                </td>

                                                <td
                                                    className={
                                                        classes.tableCell
                                                    }
                                                >
                                                    <Box
                                                        className={
                                                            classes.dateBadge
                                                        }
                                                    >
                                                        <CalendarIcon
                                                            style={{
                                                                fontSize: 14,
                                                            }}
                                                        />

                                                        {formatDate(
                                                            company.createdAt
                                                        )}
                                                    </Box>
                                                </td>

                                                <td
                                                    className={
                                                        classes.tableCell
                                                    }
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        className={
                                                            classes.manageButton
                                                        }
                                                        startIcon={
                                                            <PeopleIcon />
                                                        }
                                                        endIcon={
                                                            <ArrowForwardIcon />
                                                        }
                                                        onClick={() =>
                                                            openAssignModal(
                                                                company
                                                            )
                                                        }
                                                    >
                                                        Manage Users
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </Box>
                    )}
                </Card>
            </Container>

            {/* =====================================================
                CREATE SUB COMPANY
            ====================================================== */}

            <Dialog
                open={showCreateModal}
                onClose={() => {
                    if (!loading) {
                        setShowCreateModal(
                            false
                        );

                        resetCreateForm();
                    }
                }}
                maxWidth="md"
                fullWidth
                className={classes.dialog}
            >
                <DialogTitle
                    className={
                        classes.dialogHeader
                    }
                >
                    <Box
                        className={
                            classes.dialogHeaderLeft
                        }
                    >
                        <Box
                            className={
                                classes.dialogIcon
                            }
                        >
                            <BusinessIcon />
                        </Box>

                        <Box>
                            <Typography
                                className={
                                    classes.dialogTitle
                                }
                            >
                                Create Sub Company
                            </Typography>

                            <Typography
                                className={
                                    classes.dialogSubtitle
                                }
                            >
                                Add a subsidiary company to your organization.
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton
                        className={
                            classes.closeButton
                        }
                        onClick={() => {
                            setShowCreateModal(
                                false
                            );

                            resetCreateForm();
                        }}
                        disabled={loading}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form
                    onSubmit={
                        handleCreateSubCompany
                    }
                >
                    <DialogContent
                        className={
                            classes.dialogContent
                        }
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Box
                                    className={
                                        classes.formGroup
                                    }
                                >
                                    <Typography
                                        className={
                                            classes.formLabel
                                        }
                                    >
                                        Company Name *
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Enter company name"
                                        value={
                                            createForm.companyName
                                        }
                                        onChange={(e) =>
                                            handleCreateFormChange(
                                                'companyName',
                                                e.target.value
                                            )
                                        }
                                        className={
                                            classes.input
                                        }
                                        required
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box
                                    className={
                                        classes.formGroup
                                    }
                                >
                                    <Typography
                                        className={
                                            classes.formLabel
                                        }
                                    >
                                        Company ABN
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="11-digit ABN"
                                        value={
                                            createForm.companyABN
                                        }
                                        onChange={(e) =>
                                            handleCreateFormChange(
                                                'companyABN',
                                                e.target.value
                                            )
                                        }
                                        className={
                                            classes.input
                                        }
                                        inputProps={{
                                            pattern:
                                                '\\d{11}',
                                            maxLength: 11,
                                        }}
                                    />

                                    <Typography
                                        className={
                                            classes.helperText
                                        }
                                    >
                                        Must be exactly 11 digits.
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box
                                    className={
                                        classes.formGroup
                                    }
                                >
                                    <Typography
                                        className={
                                            classes.formLabel
                                        }
                                    >
                                        Contact Number
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Enter contact number"
                                        value={
                                            createForm.contactNumber
                                        }
                                        onChange={(e) =>
                                            handleCreateFormChange(
                                                'contactNumber',
                                                e.target.value
                                            )
                                        }
                                        className={
                                            classes.input
                                        }
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PhoneIcon
                                                        style={{
                                                            color: '#9aa5b1',
                                                        }}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box
                                    className={
                                        classes.formGroup
                                    }
                                >
                                    <Typography
                                        className={
                                            classes.formLabel
                                        }
                                    >
                                        Location
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Enter location"
                                        value={
                                            createForm.location
                                        }
                                        onChange={(e) =>
                                            handleCreateFormChange(
                                                'location',
                                                e.target.value
                                            )
                                        }
                                        className={
                                            classes.input
                                        }
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocationIcon
                                                        style={{
                                                            color: '#9aa5b1',
                                                        }}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        {/* SUPER USERS */}

                        {superUsers.length > 0 && (
                            <Box
                                className={
                                    classes.sectionBox
                                }
                            >
                                <Box
                                    className={
                                        classes.sectionHeader
                                    }
                                >
                                    <Box
                                        className={
                                            classes.sectionHeaderLeft
                                        }
                                    >
                                        <PeopleIcon
                                            className={
                                                classes.sectionIcon
                                            }
                                        />

                                        <Typography
                                            className={
                                                classes.sectionTitle
                                            }
                                        >
                                            Assign Super Users
                                        </Typography>
                                    </Box>

                                    <Typography
                                        className={
                                            classes.selectedCount
                                        }
                                    >
                                        {
                                            createForm
                                                .assignedSuperUserIds
                                                .length
                                        }{' '}
                                        selected
                                    </Typography>
                                </Box>

                                <Box
                                    className={
                                        classes.userList
                                    }
                                >
                                    {superUsers.map(
                                        (user) => {
                                            const checked =
                                                createForm.assignedSuperUserIds.includes(
                                                    user.userId
                                                );

                                            return (
                                                <FormControlLabel
                                                    key={
                                                        user.userId
                                                    }
                                                    className={
                                                        classes.userItem
                                                    }
                                                    control={
                                                        <Checkbox
                                                            color="primary"
                                                            checked={
                                                                checked
                                                            }
                                                            onChange={() =>
                                                                handleSuperUserToggle(
                                                                    user.userId
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={
                                                        <Box
                                                            className={
                                                                classes.userRow
                                                            }
                                                        >
                                                            <Box
                                                                className={
                                                                    classes.userInfo
                                                                }
                                                            >
                                                                <Typography
                                                                    className={
                                                                        classes.userName
                                                                    }
                                                                >
                                                                    {
                                                                        user.fullName
                                                                    }
                                                                </Typography>

                                                                <Typography
                                                                    className={
                                                                        classes.userEmail
                                                                    }
                                                                >
                                                                    {
                                                                        user.email
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    }
                                                />
                                            );
                                        }
                                    )}
                                </Box>

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
                                        Select parent company
                                        superusers who should
                                        be allowed to manage
                                        this sub company.
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>

                    <DialogActions
                        className={
                            classes.dialogActions
                        }
                    >
                        <Button
                            className={
                                classes.cancelButton
                            }
                            onClick={() => {
                                setShowCreateModal(
                                    false
                                );

                                resetCreateForm();
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={
                                classes.saveButton
                            }
                            disabled={
                                loading ||
                                !createForm.companyName.trim()
                            }
                            startIcon={
                                loading ? (
                                    <CircularProgress
                                        size={16}
                                        color="inherit"
                                    />
                                ) : (
                                    <AddIcon />
                                )
                            }
                        >
                            {loading
                                ? 'Creating...'
                                : 'Create Sub Company'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* =====================================================
                ASSIGN SUPER USERS
            ====================================================== */}

            <Dialog
                open={
                    showAssignModal &&
                    Boolean(selectedSubCompany)
                }
                onClose={() => {
                    if (!loading) {
                        setShowAssignModal(
                            false
                        );

                        resetAssignForm();
                    }
                }}
                maxWidth="sm"
                fullWidth
                className={classes.dialog}
            >
                <DialogTitle
                    className={
                        classes.dialogHeader
                    }
                >
                    <Box
                        className={
                            classes.dialogHeaderLeft
                        }
                    >
                        <Box
                            className={`${classes.dialogIcon} ${classes.dialogIconPurple}`}
                        >
                            <PeopleIcon />
                        </Box>

                        <Box>
                            <Typography
                                className={
                                    classes.dialogTitle
                                }
                            >
                                Manage Super Users
                            </Typography>

                            <Typography
                                className={
                                    classes.dialogSubtitle
                                }
                            >
                                {selectedSubCompany?.companyName}
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton
                        className={
                            classes.closeButton
                        }
                        onClick={() => {
                            setShowAssignModal(
                                false
                            );

                            resetAssignForm();
                        }}
                        disabled={loading}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form
                    onSubmit={
                        handleAssignSuperUsers
                    }
                >
                    <DialogContent
                        className={
                            classes.dialogContent
                        }
                    >
                        {superUsers.length > 0 ? (
                            <Box>
                                <Box
                                    className={
                                        classes.sectionHeader
                                    }
                                >
                                    <Box
                                        className={
                                            classes.sectionHeaderLeft
                                        }
                                    >
                                        <SecurityIcon
                                            className={
                                                classes.sectionIcon
                                            }
                                        />

                                        <Typography
                                            className={
                                                classes.sectionTitle
                                            }
                                        >
                                            Available Super Users
                                        </Typography>
                                    </Box>

                                    <Typography
                                        className={
                                            classes.selectedCount
                                        }
                                    >
                                        {
                                            assignForm
                                                .userIds
                                                .length
                                        }{' '}
                                        selected
                                    </Typography>
                                </Box>

                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Search users..."
                                    value={
                                        userSearch
                                    }
                                    onChange={(e) =>
                                        setUserSearch(
                                            e.target.value
                                        )
                                    }
                                    className={
                                        classes.input
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon
                                                    style={{
                                                        color: '#9aa5b1',
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    style={{
                                        marginBottom: 10,
                                    }}
                                />

                                <Box
                                    className={
                                        classes.userList
                                    }
                                >
                                    {filteredSuperUsers.length >
                                    0 ? (
                                        filteredSuperUsers.map(
                                            (user) => {
                                                const assignedIds =
                                                    selectedSubCompany?.assignedSuperUserIds ||
                                                    [];

                                                const isAlreadyAssigned =
                                                    assignedIds.includes(
                                                        user.userId
                                                    );

                                                const isSelected =
                                                    assignForm.userIds.includes(
                                                        user.userId
                                                    );

                                                return (
                                                    <FormControlLabel
                                                        key={
                                                            user.userId
                                                        }
                                                        className={
                                                            classes.userItem
                                                        }
                                                        control={
                                                            <Checkbox
                                                                color="primary"
                                                                checked={
                                                                    isSelected
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        e
                                                                            .target
                                                                            .checked
                                                                    ) {
                                                                        handleAssignFormChange(
                                                                            [
                                                                                ...assignForm.userIds,
                                                                                user.userId,
                                                                            ]
                                                                        );
                                                                    } else {
                                                                        handleAssignFormChange(
                                                                            assignForm.userIds.filter(
                                                                                (
                                                                                    id
                                                                                ) =>
                                                                                    id !==
                                                                                    user.userId
                                                                            )
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        }
                                                        label={
                                                            <Box
                                                                className={
                                                                    classes.userRow
                                                                }
                                                            >
                                                                <Box
                                                                    className={
                                                                        classes.userInfo
                                                                    }
                                                                >
                                                                    <Typography
                                                                        className={
                                                                            classes.userName
                                                                        }
                                                                    >
                                                                        {
                                                                            user.fullName
                                                                        }
                                                                    </Typography>

                                                                    <Typography
                                                                        className={
                                                                            classes.userEmail
                                                                        }
                                                                    >
                                                                        {
                                                                            user.email
                                                                        }
                                                                    </Typography>
                                                                </Box>

                                                                {isAlreadyAssigned && (
                                                                    <Chip
                                                                        icon={
                                                                            <CheckCircleIcon />
                                                                        }
                                                                        label="Assigned"
                                                                        size="small"
                                                                        className={
                                                                            classes.assignedChip
                                                                        }
                                                                    />
                                                                )}
                                                            </Box>
                                                        }
                                                    />
                                                );
                                            }
                                        )
                                    ) : (
                                        <Box
                                            py={3}
                                            textAlign="center"
                                        >
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                            >
                                                No users match
                                                your search.
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

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
                                        Assigned users are
                                        preselected. Uncheck
                                        a user to remove
                                        their access.
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Box
                                className={
                                    classes.emptyState
                                }
                                style={{
                                    padding:
                                        '30px 0',
                                }}
                            >
                                <Box
                                    className={
                                        classes.emptyIconWrapper
                                    }
                                >
                                    <PeopleIcon fontSize="large" />
                                </Box>

                                <Typography
                                    className={
                                        classes.emptyTitle
                                    }
                                >
                                    No superusers available
                                </Typography>

                                <Typography
                                    className={
                                        classes.emptyDescription
                                    }
                                >
                                    There are currently no
                                    parent company superusers
                                    available for assignment.
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>

                    <DialogActions
                        className={
                            classes.dialogActions
                        }
                    >
                        <Button
                            className={
                                classes.cancelButton
                            }
                            onClick={() => {
                                setShowAssignModal(
                                    false
                                );

                                resetAssignForm();
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={
                                classes.saveButton
                            }
                            disabled={
                                loading ||
                                superUsers.length === 0
                            }
                            startIcon={
                                loading ? (
                                    <CircularProgress
                                        size={16}
                                        color="inherit"
                                    />
                                ) : (
                                    <CheckCircleIcon />
                                )
                            }
                        >
                            {loading
                                ? 'Saving...'
                                : 'Save Changes'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}