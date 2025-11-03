import React from 'react';
import { Link } from 'react-router-dom';


export default function CompanySummary({ companyState, companyDetailsPath }) {
    return (
        <div className="card shadow-sm mt-4">
            <div className="card-header bg-info text-white">
                <h6 className="mb-0">🏢 Company Summary</h6>
            </div>
            <div className="card-body">
                {companyState.loading ? (
                    <div className="text-center">
                        <div className="spinner-border spinner-border-sm" role="status"></div>
                        <span className="ms-2">Loading...</span>
                    </div>
                ) : (
                    <>
                        <div className="mb-3">
                            <small className="text-muted">Company Name</small>
                            <div className="fw-bold">{companyState.company?.companyName || '—'}</div>
                        </div>
                        <div className="mb-3">
                            <small className="text-muted">ABN</small>
                            <div className="fw-bold">{companyState.company?.companyABN || '—'}</div>
                        </div>
                        <div className="mb-3">
                            <small className="text-muted">Contact</small>
                            <div className="fw-bold">{companyState.company?.contactNumber || '—'}</div>
                        </div>
                        <div className="mb-3">
                            <small className="text-muted">Created</small>
                            <div className="fw-bold">{companyState.company?.createdAt ? new Date(companyState.company.createdAt).toLocaleDateString() : '—'}</div>
                        </div>
                        <Link to={companyDetailsPath} className="btn btn-outline-primary btn-sm w-100">
                            Edit Company
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}