import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import { useDispatch, useSelector } from "react-redux";
import IntlMessages from 'Util/IntlMessages';

// Widgets
import HeadcountWidget from 'Components/Widgets/HeadcountWidget';
import NhtAnalysisWidget from 'Components/Widgets/NhtAnalysisWidget';
import TermsAnalysisWidget from "Components/Widgets/TermsAnalysisWidget";
import HeadcountAnalysisChart from 'Components/Widgets/HeadcountAnalysisChart';
import NhtAnalysisChart from 'Components/Widgets/NhtAnalysisChart';
import TermAnalysisChart from 'Components/Widgets/TermsAnalysisChart';

import {
    fetchHistoryList,
    fetchHistoryDetail,
    fetchCeoYtdAnalysis
} from "Store/Actions/historyActions";

import './CEODashboard.css';

export default function AnalysisDetail({ match }) {
    const dispatch = useDispatch();
    const { historyList, loadingList, historyDetail, ceoYtdData } = useSelector((state) => state.history);

    const [viewMode, setViewMode] = useState('chart');
    const [selectedHistoryId, setSelectedHistoryId] = useState("");
    const [mode, setMode] = useState("month"); // "month" | "ytd"

    const [visibleSections, setVisibleSections] = useState({
        headcount: true,
        nht: true,
        terms: true,
    });

    const handleToggleSection = (section) => {
        setVisibleSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    useEffect(() => {
        dispatch(fetchHistoryList());
    }, [dispatch]);

    const handleSelectHistory = (id) => {
        setSelectedHistoryId(id);
        if (mode === "month") {
            dispatch(fetchHistoryDetail(id));
        }
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        if (newMode === "ytd") {
            const currentYear = new Date().getFullYear();
            dispatch(fetchCeoYtdAnalysis(currentYear));
        } else {
            setSelectedHistoryId("");
        }
    };

    const monthNames = [
        "", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const snapshotHeadcount = mode === "ytd" ? ceoYtdData?.headcount : historyDetail?.headcount;
    const snapshotNht = mode === "ytd" ? ceoYtdData?.nht : historyDetail?.nht;
    const snapshotTerms = mode === "ytd" ? ceoYtdData?.terms : historyDetail?.terms;

    // Only Final Analyses for CEO
    const finalHistoryList = historyList.filter((item) => item.isFinal);

    return (
        <div className="modern-dashboard-wrapper">
            <Helmet>
                <title>Detailed Analysis</title>
                <meta name="description" content="Detailed Analysis" />
            </Helmet>

            <div className="dashboard-header">
                <PageTitleBar title={<IntlMessages id="Detailed Analysis" />} match={match} />

                {/* Top Bar Controls */}
                <div className="dashboard-controls">
                    <div className="controls-left">
                        {/* Mode Toggle (Month / YTD) */}
                        <div className="mode-toggle-group">
                            <button
                                className={`toggle-btn ${mode === 'month' ? 'active' : ''}`}
                                onClick={() => handleModeChange("month")}
                            >
                                Monthly
                            </button>
                            <button
                                className={`toggle-btn ${mode === 'ytd' ? 'active' : ''}`}
                                onClick={() => handleModeChange("ytd")}
                            >
                                YTD
                            </button>
                        </div>

                        {/* Global View Toggle */}
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
                        {mode === "month" && (
                            loadingList ? (
                                <div className="loading-indicator">
                                    <span>Loading history...</span>
                                </div>
                            ) : (
                                <div className="custom-select-wrapper">
                                    <select
                                        className="modern-select"
                                        value={selectedHistoryId}
                                        onChange={(e) => handleSelectHistory(e.target.value)}
                                    >
                                        <option value="">Select Previous Analysis</option>
                                        {finalHistoryList.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {`${item.monthName} ${item.year}`}
                                            </option>
                                        ))}
                                    </select>
                                    <i className="select-arrow"></i>
                                </div>
                            )
                        )}

                        {mode === "ytd" && (
                            <div className="ytd-label">
                                Showing YTD Analysis ({new Date().getFullYear()})
                            </div>
                        )}
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
            </div>

            <h1> &nbsp;
                {historyDetail?.month && historyDetail?.year
                    ? `Analysis of ${monthNames[historyDetail.month]} ${historyDetail.year}`
                    : "Analysis Overview"}
            </h1>

            {/* Main Dashboard Content */}
            <div className="dashboard-content">
                <div className="analysis-sections">
                    {visibleSections.headcount && (
                        <div className="analysis-section card">
                            <h3 className="section-title"><i className="icon-headcount"></i> Headcount Analysis</h3>
                            <div className="section-content">
                                {viewMode !== 'chart' && <HeadcountWidget data={snapshotHeadcount} />}
                                {viewMode !== 'table' && <HeadcountAnalysisChart key={selectedHistoryId || mode} data={snapshotHeadcount} />}
                            </div>
                        </div>
                    )}

                    {visibleSections.nht && (
                        <div className="analysis-section card">
                            <h3 className="section-title"><i className="icon-career"></i> Career Management</h3>
                            <div className="section-content">
                                {viewMode !== 'chart' && <NhtAnalysisWidget data={snapshotNht} />}
                                {viewMode !== 'table' && (<NhtAnalysisChart key={selectedHistoryId || mode} data={snapshotNht} />)}
                            </div>
                        </div>
                    )}

                    {visibleSections.terms && (
                        <div className="analysis-section card">
                            <h3 className="section-title"><i className="icon-turnover"></i> Turnover Analysis</h3>
                            <div className="section-content">
                                {viewMode !== 'chart' && <TermsAnalysisWidget data={snapshotTerms} />}
                                {viewMode !== 'table' && <TermAnalysisChart key={selectedHistoryId || mode} data={snapshotTerms} />}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
