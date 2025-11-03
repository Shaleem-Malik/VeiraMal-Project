import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SubCompaniesManagement() {
    const [subCompanies, setSubCompanies] = useState([]);
    const [superUsers, setSuperUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedSubCompany, setSelectedSubCompany] = useState(null);

    // Form states
    const [createForm, setCreateForm] = useState({
        companyName: '',
        companyABN: '',
        contactNumber: '',
        location: '',
        assignedSuperUserIds: []
    });

    const [assignForm, setAssignForm] = useState({
        userIds: []
    });

    // Get parent company ID from user context (you might need to adjust this based on your auth setup)
    const getParentCompanyId = () => {
        // This should come from your authentication context or localStorage
        return localStorage.getItem('companyId') || '';
    };

    // Fetch subcompanies
    const fetchSubCompanies = async () => {
        const parentCompanyId = getParentCompanyId();
        if (!parentCompanyId) {
            setError('Parent company ID not found');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5228/api/company/${parentCompanyId}/subcompanies`);
            setSubCompanies(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch subcompanies: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Fetch superusers for parent company
    const fetchSuperUsers = async () => {
        const parentCompanyId = getParentCompanyId();
        if (!parentCompanyId) return;

        try {
            const response = await axios.get(`http://localhost:5228/api/company/${parentCompanyId}/superusers`);
            setSuperUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch superusers:', err);
        }
    };

    // Create subcompany
    const handleCreateSubCompany = async (e) => {
        e.preventDefault();
        const parentCompanyId = getParentCompanyId();
        
        if (!createForm.companyName.trim()) {
            setError('Company name is required');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                companyName: createForm.companyName.trim(),
                companyABN: createForm.companyABN.trim() || null,
                contactNumber: createForm.contactNumber.trim() || null,
                location: createForm.location.trim() || null,
                assignedSuperUserIds: createForm.assignedSuperUserIds
            };

            await axios.post(`http://localhost:5228/api/company/${parentCompanyId}/subcompanies`, payload);
            
            setSuccess('Subcompany created successfully!');
            setShowCreateModal(false);
            resetCreateForm();
            fetchSubCompanies();
        } catch (err) {
            setError('Failed to create subcompany: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Assign superusers to subcompany
    const handleAssignSuperUsers = async (e) => {
        e.preventDefault();
        const parentCompanyId = getParentCompanyId();

        setLoading(true);
        try {
            const payload = {
                subCompanyId: selectedSubCompany.companyId,
                userIds: assignForm.userIds
            };

            await axios.post(
                `http://localhost:5228/api/company/${parentCompanyId}/subcompanies/${selectedSubCompany.companyId}/assign-superusers`,
                payload
            );

            setSuccess('Superusers assigned successfully!');
            setShowAssignModal(false);
            resetAssignForm();
            fetchSubCompanies();
        } catch (err) {
            setError('Failed to assign superusers: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Reset forms
    const resetCreateForm = () => {
        setCreateForm({
            companyName: '',
            companyABN: '',
            contactNumber: '',
            location: '',
            assignedSuperUserIds: []
        });
    };

    const resetAssignForm = () => {
        setAssignForm({ userIds: [] });
        setSelectedSubCompany(null);
    };

    // Handle form changes
    const handleCreateFormChange = (field, value) => {
        setCreateForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAssignFormChange = (userIds) => {
        setAssignForm({ userIds });
    };

    // Handle superuser selection toggle
    const handleSuperUserToggle = (userId) => {
        setCreateForm(prev => ({
            ...prev,
            assignedSuperUserIds: prev.assignedSuperUserIds.includes(userId)
                ? prev.assignedSuperUserIds.filter(id => id !== userId)
                : [...prev.assignedSuperUserIds, userId]
        }));
    };

    // Open assign modal
    const openAssignModal = (subCompany) => {
        setSelectedSubCompany(subCompany);
        setAssignForm({ userIds: [] });
        setShowAssignModal(true);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Load data on component mount
    useEffect(() => {
        fetchSubCompanies();
        fetchSuperUsers();
    }, []);

    // Clear messages after 5 seconds
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    return (
        <div className="container-fluid">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-gray-800">Sub Companies Management</h1>
                    <p className="text-muted">Manage your subsidiary companies and their superusers</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                    disabled={loading}
                >
                    <i className="fas fa-plus-circle mr-2"></i>
                    Create New Sub Company
                </button>
            </div>

            {/* Alerts */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error!</strong> {error}
                    <button type="button" className="close" onClick={() => setError('')}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}

            {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Success!</strong> {success}
                    <button type="button" className="close" onClick={() => setSuccess('')}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}

            {/* Sub Companies Table */}
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">
                        Sub Companies ({subCompanies.length})
                    </h6>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    ) : subCompanies.length === 0 ? (
                        <div className="text-center py-4">
                            <i className="fas fa-building fa-3x text-muted mb-3"></i>
                            <p className="text-muted">No sub companies found</p>
                            <button 
                                className="btn btn-primary"
                                onClick={() => setShowCreateModal(true)}
                            >
                                Create Your First Sub Company
                            </button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="thead-light">
                                    <tr>
                                        <th>Company Name</th>
                                        <th>ABN</th>
                                        <th>Contact</th>
                                        <th>Location</th>
                                        <th>Created Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subCompanies.map((company) => (
                                        <tr key={company.companyId}>
                                            <td>
                                                <strong>{company.companyName}</strong>
                                            </td>
                                            <td>
                                                {company.companyABN || (
                                                    <span className="text-muted">Not provided</span>
                                                )}
                                            </td>
                                            <td>
                                                {company.contactNumber || (
                                                    <span className="text-muted">Not provided</span>
                                                )}
                                            </td>
                                            <td>
                                                {company.location || (
                                                    <span className="text-muted">Not provided</span>
                                                )}
                                            </td>
                                            <td>
                                                {formatDate(company.createdAt)}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-primary btn-sm mr-2"
                                                    onClick={() => openAssignModal(company)}
                                                    title="Assign Super Users"
                                                >
                                                    <i className="fas fa-users"></i> Manage Users
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Sub Company Modal */}
            {showCreateModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create New Sub Company</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        resetCreateForm();
                                    }}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form onSubmit={handleCreateSubCompany}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="companyName" className="font-weight-bold">
                                                    Company Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="companyName"
                                                    value={createForm.companyName}
                                                    onChange={(e) => handleCreateFormChange('companyName', e.target.value)}
                                                    required
                                                    placeholder="Enter company name"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="companyABN" className="font-weight-bold">
                                                    Company ABN
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="companyABN"
                                                    value={createForm.companyABN}
                                                    onChange={(e) => handleCreateFormChange('companyABN', e.target.value)}
                                                    placeholder="11-digit ABN"
                                                    pattern="\d{11}"
                                                    title="ABN must be exactly 11 digits"
                                                />
                                                <small className="form-text text-muted">
                                                    Must be exactly 11 digits
                                                </small>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="contactNumber" className="font-weight-bold">
                                                    Contact Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    id="contactNumber"
                                                    value={createForm.contactNumber}
                                                    onChange={(e) => handleCreateFormChange('contactNumber', e.target.value)}
                                                    placeholder="Enter contact number"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="location" className="font-weight-bold">
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="location"
                                                    value={createForm.location}
                                                    onChange={(e) => handleCreateFormChange('location', e.target.value)}
                                                    placeholder="Enter location"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Super Users Assignment */}
                                    {superUsers.length > 0 && (
                                        <div className="form-group">
                                            <label className="font-weight-bold">
                                                Assign Super Users (Optional)
                                            </label>
                                            <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                {superUsers.map((user) => (
                                                    <div key={user.userId} className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`user-${user.userId}`}
                                                            checked={createForm.assignedSuperUserIds.includes(user.userId)}
                                                            onChange={() => handleSuperUserToggle(user.userId)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`user-${user.userId}`}>
                                                            {user.fullName} ({user.email})
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            <small className="form-text text-muted">
                                                Select parent company superusers to manage this sub company
                                            </small>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            resetCreateForm();
                                        }}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading || !createForm.companyName.trim()}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm mr-2" role="status"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Sub Company'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Super Users Modal */}
            {showAssignModal && selectedSubCompany && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Assign Super Users to {selectedSubCompany.companyName}
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={() => {
                                        setShowAssignModal(false);
                                        resetAssignForm();
                                    }}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form onSubmit={handleAssignSuperUsers}>
                                <div className="modal-body">
                                    {superUsers.length > 0 ? (
                                        <div className="form-group">
                                            <label className="font-weight-bold">
                                                Select Super Users
                                            </label>
                                            <div className="border rounded p-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                                {superUsers.map((user) => (
                                                    <div key={user.userId} className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`assign-user-${user.userId}`}
                                                            checked={assignForm.userIds.includes(user.userId)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    handleAssignFormChange([...assignForm.userIds, user.userId]);
                                                                } else {
                                                                    handleAssignFormChange(assignForm.userIds.filter(id => id !== user.userId));
                                                                }
                                                            }}
                                                        />
                                                        <label className="form-check-label" htmlFor={`assign-user-${user.userId}`}>
                                                            {user.fullName} ({user.email})
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            <small className="form-text text-muted">
                                                Selected users will be able to manage this sub company
                                            </small>
                                        </div>
                                    ) : (
                                        <div className="text-center py-3">
                                            <i className="fas fa-users fa-2x text-muted mb-2"></i>
                                            <p className="text-muted">No superusers available</p>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowAssignModal(false);
                                            resetAssignForm();
                                        }}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading || superUsers.length === 0}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm mr-2" role="status"></span>
                                                Assigning...
                                            </>
                                        ) : (
                                            'Assign Users'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}