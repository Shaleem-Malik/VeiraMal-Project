import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import IntlMessages from 'Util/IntlMessages';
import "../../crm/dashboard/CEODashboard.css";

// Widgets
import HeadcountWidget from 'Components/Widgets/HeadcountWidget';
import NhtAnalysisWidget from 'Components/Widgets/NhtAnalysisWidget';
import TermsAnalysisWidget from "Components/Widgets/TermsAnalysisWidget";
import HeadcountAnalysisChart from 'Components/Widgets/HeadcountAnalysisChart';
import NhtAnalysisChart from 'Components/Widgets/NhtAnalysisChart';
import TermAnalysisChart from 'Components/Widgets/TermsAnalysisChart';

import {
    saveAllAnalysisHistory,
    fetchHistoryList,
    fetchHistoryDetail,
} from "Store/Actions/historyActions";


export default function AnalysisDetail({ match }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { saving, historyList, loadingList, historyDetail } = useSelector((state) => state.history);
    const [viewMode, setViewMode] = useState('chart');
    const [selectedHistoryId, setSelectedHistoryId] = useState("");
    const [showPopup, setShowPopup] = useState(false); // ✅ New state for modal

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);


    const [visibleSections, setVisibleSections] = useState(() => {
        const stored = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
        return {
            headcount: stored.includes("headcount"),
            nht: stored.includes("nht"),
            terms: stored.includes("terms"),
        };
    });

    const handleToggleSection = (section) => {
        setVisibleSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    useEffect(() => {
        dispatch(fetchHistoryList());
    }, [dispatch]);

    useEffect(() => {
        const handleFilesUploaded = (event) => {
            const uploadedTypes = event.detail;
            setVisibleSections({
                headcount: uploadedTypes.includes("headcount"),
                nht: uploadedTypes.includes("nht"),
                terms: uploadedTypes.includes("terms"),
            });
        };

        window.addEventListener("filesUploaded", handleFilesUploaded);
        return () => window.removeEventListener("filesUploaded", handleFilesUploaded);
    }, []);

    const handleSaveHistory = () => {
        setShowPopup(true); // ✅ Show confirmation modal
    };

    const handleConfirmSave = (isFinal) => {
        setShowPopup(false);
        dispatch(saveAllAnalysisHistory(isFinal, year, month)).then(() => {
            dispatch(fetchHistoryList());
        });
    };

    const handleSelectHistory = (id) => {
        setSelectedHistoryId(id);
        dispatch(fetchHistoryDetail(id));
    };

    const snapshotHeadcount = historyDetail?.headcount || null;
    const snapshotNht = historyDetail?.nht || null;
    const snapshotTerms = historyDetail?.terms || null;

    const monthNames = [
        "", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="modern-dashboard-wrapper">
            <Helmet>
                <title>Detailed Analysis</title>
                <meta name="description" content="Detailed Analysis" />
            </Helmet>
            <div className="d-flex">
                <IconButton style={{ marginBottom: '30px' }} onClick={() => history.goBack()}><ArrowBack /></IconButton>
                <PageTitleBar title={<IntlMessages id="Detailed Analysis" />} match={match} />
            </div>

            {/* Top Bar */}
            <div className="dashboard-topbar">
                <button className="btn btn-primary" onClick={handleSaveHistory} disabled={saving}>
                    {saving ? "Saving..." : "Save Analysis Snapshot"}
                </button>
                <div className="dashboard-controls">
                    <div className="controls-left">
                        {/* View Toggle */}
                        <div className="view-toggle-group">
                            <button
                                className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                                onClick={() => setViewMode('table')}
                            >
                                <i className="icon-table"></i> Table
                            </button>
                            <button
                                className={`toggle-btn ${viewMode === 'chart' ? 'active' : ''}`}
                                onClick={() => setViewMode('chart')}
                            >
                                <i className="icon-chart"></i> Chart
                            </button>
                            <button
                                className={`toggle-btn ${viewMode === 'both' ? 'active' : ''}`}
                                onClick={() => setViewMode('both')}
                            >
                                <i className="icon-both"></i> Both
                            </button>
                        </div>
                    </div>

                    <div className="controls-right">
                        {/* Dropdown */}
                        {loadingList ? (
                            <span>Loading history...</span>
                        ) : (
                            <select
                                className="form-select"
                                style={{ width: "260px" }}
                                value={selectedHistoryId}
                                onChange={(e) => handleSelectHistory(e.target.value)}
                            >
                                <option value="">Select Previous Analysis</option>
                                {historyList.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {`${item.monthName} ${item.year}`} {item.isFinal ? "(Final)" : "(Draft)"}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>


            {/* Checkbox Toggle Section */}
            <div className="section-toggle">
                {["headcount", "nht", "terms"].map((section) => (
                    <div className="toggle-item" key={section}>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                id={`${section}Switch`}
                                checked={visibleSections[section]}
                                onChange={() => handleToggleSection(section)}
                            />
                            <span className="slider round"></span>
                        </label>
                        <label className="toggle-label" htmlFor={`${section}Switch`}>
                            {section === "headcount" ? "Headcount" :
                                section === "nht" ? "Career Management" :
                                    "Turnover"}
                        </label>
                    </div>
                ))}
            </div>

            <h1 className="mt-4 mb-3">
                {selectedHistoryId && historyDetail?.month && historyDetail?.year
                    ? `Analysis of ${monthNames[historyDetail.month]} ${historyDetail.year}`
                    : "Live Analysis"}
            </h1>

            {/* Sections */}
            <div className="dashboard-content">
                <div className="analysis-sections">
                    {visibleSections.headcount && (
                        <div className="analysis-section card">
                            <h3 className="section-title"><i className="icon-headcount"></i> Headcount Analysis</h3>
                            <div className="section-content">
                                {viewMode !== 'chart' && <HeadcountWidget data={snapshotHeadcount} />}
                                {viewMode !== 'table' && <HeadcountAnalysisChart data={snapshotHeadcount} />}
                            </div>
                        </div>
                    )}

                    {visibleSections.nht && (
                        <div className="analysis-section card">
                            <h3 className="section-title"><i className="icon-career"></i> Career Management</h3>
                            <div className="section-content">
                                {viewMode !== 'chart' && <NhtAnalysisWidget data={snapshotNht} />}
                                {viewMode !== 'table' && <NhtAnalysisChart data={snapshotNht} />}
                            </div>
                        </div>
                    )}

                    {visibleSections.terms && (
                        <div className="analysis-section card">
                            <h3 className="section-title"><i className="icon-turnover"></i> Turnover Analysis</h3>
                            <div className="section-content">
                                {viewMode !== 'chart' && <TermsAnalysisWidget data={snapshotTerms} />}
                                {viewMode !== 'table' && <TermAnalysisChart data={snapshotTerms} />}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ Confirmation Popup */}
            {showPopup && (
                <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Save</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPopup(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Select <strong>Year</strong> and <strong>Month</strong> for this analysis:</p>

                                <div className="d-flex gap-3 mb-3">
                                    <input
                                        type="number"
                                        min="2025"
                                        value={year}
                                        onChange={(e) => setYear(Number(e.target.value))}
                                        className="form-control"
                                        placeholder="Year"
                                    />
                                    <select
                                        className="form-select"
                                        value={month}
                                        onChange={(e) => setMonth(Number(e.target.value))}
                                    >
                                        <option value="">Select Month</option>
                                        {[
                                            "January", "February", "March", "April", "May", "June",
                                            "July", "August", "September", "October", "November", "December"
                                        ].map((m, idx) => (
                                            <option key={idx + 1} value={idx + 1}>{m}</option>
                                        ))}
                                    </select>
                                </div>

                                <p>Do you want to mark this analysis as <strong>Final</strong> or save as Draft?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowPopup(false)}>Cancel</button>
                                <button
                                    className="btn btn-warning"
                                    onClick={() => handleConfirmSave(false)}
                                    disabled={!year || !month}
                                >
                                    Save as Draft
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleConfirmSave(true)}
                                    disabled={!year || !month}
                                >
                                    Mark as Final
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
