// File: AdminDashboard.js (updated)
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import { useDispatch, useSelector } from "react-redux";
import IntlMessages from 'Util/IntlMessages';
import { useHistory } from "react-router-dom";
import {
  Button,
  LinearProgress,
  Box,
} from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";

// Widgets
import HeadcountWidget from 'Components/Widgets/HeadcountWidget';
import NhtAnalysisWidget from 'Components/Widgets/NhtAnalysisWidget';
import TermsAnalysisWidget from "Components/Widgets/TermsAnalysisWidget";
import HeadcountGenderPieWidget from "Components/Widgets/HeadcountGenderPieWidget";
import NhtNewHiresGenderPieWidget from "Components/Widgets/NhtNewHiresGenderPieWidget";
import TurnoverByGenderVoluntaryWidget from "Components/Widgets/TurnoverByGenderVoluntaryWidget";
import TurnoverByGenderInvoluntaryWidget from "Components/Widgets/TurnoverByGenderInvoluntaryWidget";
import AvgTenureByGenderWidget from "Components/Widgets/AvgTenureByGenderWidget";
import AvgAgeByGenderWidget from "Components/Widgets/AvgAgeByGenderWidget";
import UploadExcelModal from "Components/Widgets/UploadExcelModal";
import "../../crm/dashboard/CEODashboard.css";

import {
  fetchHistoryList,
  fetchHistoryDetail,
  saveAllAnalysisHistory,
} from "Store/Actions/historyActions";

export default function EcommerceDashboard({ match }) {
  const [iframeWidget, setIframeWidget] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { historyList, loadingList, historyDetail, saving } = useSelector((state) => state.history);
  const [selectedHistoryId, setSelectedHistoryId] = useState("");
  
  // New states for save functionality
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [showSaveOptionsModal, setShowSaveOptionsModal] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const history = useHistory();

  // Get upload progress for the button
  const headcountProgress = useSelector((state) => state.headcount.uploadProgress);
  const nhtProgress = useSelector((state) => state.nht.uploadProgress);
  const termsProgress = useSelector((state) => state.terms.uploadProgress);

  const headcountUploading = useSelector((state) => state.headcount.uploading);
  const nhtUploading = useSelector((state) => state.nht.uploading);
  const termsUploading = useSelector((state) => state.terms.uploading);

  const isUploading = headcountUploading || nhtUploading || termsUploading;

  // Check user role for superuser
  const getUserRoles = () => {
    const raw = localStorage.getItem("access") || "";
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, ""))
      .filter(Boolean);
  };

  const userRoles = getUserRoles();
  const isSuperUser = userRoles.includes("superuser");

  useEffect(() => {
    dispatch(fetchHistoryList());
  }, [dispatch]);

  // Listen for upload completion to show save prompt
  useEffect(() => {
    const handleFilesUploaded = (event) => {
      // Show save prompt when files are uploaded successfully
      setTimeout(() => {
        setShowSavePrompt(true);
      }, 500);
    };

    window.addEventListener("filesUploaded", handleFilesUploaded);
    
    return () => {
      window.removeEventListener("filesUploaded", handleFilesUploaded);
    };
  }, []);

  // Effect to handle upload completion in modal
  useEffect(() => {
    if (uploadModalOpen && isUploading && allUploadsComplete()) {
      // Close modal after upload completes
      setTimeout(() => {
        setUploadModalOpen(false);
      }, 1000);
    }
  }, [uploadModalOpen, isUploading]);

  const handleSelectHistory = (id) => {
    setSelectedHistoryId(id);
    dispatch(fetchHistoryDetail(id));
  };

  const monthNames = [
    "", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const snapshotHeadcount = historyDetail?.headcount || null;
  const snapshotNht = historyDetail?.nht || null;
  const snapshotTerms = historyDetail?.terms || null;

  // Filter only Final Analyses
  const finalHistoryList = historyList.filter((item) => item.isFinal);

  const getIframeContent = () => {
    switch (iframeWidget) {
      case "HeadcountGenderPieWidget":
      case "AvgTenureByGenderWidget":
      case "AvgAgeByGenderWidget":
        return <HeadcountWidget data={snapshotHeadcount} />;
      case "NhtNewHiresGenderPieWidget":
        return <NhtAnalysisWidget data={snapshotNht} />;
      case "TurnoverByGenderVoluntaryWidget":
      case "TurnoverByGenderInvoluntaryWidget":
        return <TermsAnalysisWidget data={snapshotTerms} />;
      default:
        return null;
    }
  };

  const handleShowDetailedAnalysis = () => {
    if (selectedHistoryId) {
      history.push(`/app/dashboard/live-analysis-detail?historyId=${selectedHistoryId}`);
    } else {
      history.push('/app/dashboard/live-analysis-detail');
    }
  };

  const calculateOverallProgress = () => {
    let total = 0;
    let count = 0;

    if (headcountUploading) {
      total += headcountProgress || 0;
      count++;
    }
    if (nhtUploading) {
      total += nhtProgress || 0;
      count++;
    }
    if (termsUploading) {
      total += termsProgress || 0;
      count++;
    }

    return count > 0 ? Math.round(total / count) : 0;
  };

  const allUploadsComplete = () => {
    return !headcountUploading && !nhtUploading && !termsUploading;
  };

  const overallProgress = calculateOverallProgress();

  // Save analysis handlers
  const handleSavePrompt = (save) => {
    setShowSavePrompt(false);
    if (save) {
      setShowSaveOptionsModal(true);
    }
  };

  const handleConfirmSave = (isFinal) => {
    setShowSaveOptionsModal(false);
    dispatch(saveAllAnalysisHistory(isFinal, year, month)).then(() => {
      dispatch(fetchHistoryList());
      // Reset year and month to current after save
      setYear(new Date().getFullYear());
      setMonth(new Date().getMonth() + 1);
    });
  };

  return (
    <div className="ecom-dashboard-wrapper">
      <Helmet>
        <title>Admin Dashboard</title>
        <meta name="description" content="Reactify Ecommerce Dashboard" />
      </Helmet>
      <div className="dashboard-header">
        <div className="d-flex">
          <PageTitleBar title={<IntlMessages id="Admin Dashboard" />} match={match} />
          <div></div>
        </div>
        {/* Top Bar: Buttons and Dropdown */}
        <div className="dashboard-controls">
          <div className="controls-left" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={handleShowDetailedAnalysis}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <i className="icon-chart"></i> Show Detailed Analysis
            </button>

            {/* Upload Excel Button - Only for Super Users */}
            {isSuperUser && (
              <Button
                variant="contained"
                color="secondary"
                style={{
                  borderRadius: "10px",
                  fontWeight: "600",
                  position: "relative",
                  overflow: "hidden",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                onClick={() => setUploadModalOpen(true)}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Box width="100%" textAlign="center">
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      height="100%"
                      bgcolor="rgba(0, 0, 0, 0.1)"
                    >
                      <LinearProgress
                        variant="determinate"
                        value={overallProgress}
                        style={{ height: "100%" }}
                      />
                    </Box>
                    <Box position="relative" zIndex={1} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <CloudUpload fontSize="small" />
                      Uploading... {overallProgress}%
                    </Box>
                  </Box>
                ) : (
                  <>
                    <CloudUpload fontSize="small" />
                    &nbsp; Upload File
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="controls-right">
            {loadingList ? (
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
                  <option disabled value="">Select Final Analysis</option>
                  {finalHistoryList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {`${item.monthName} ${item.year}`}
                    </option>
                  ))}
                </select>
                <i className="select-arrow"></i>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Show pie chart widgets only when no analysis is selected */}
      <h1> &nbsp;
        {historyDetail?.month && historyDetail?.year
          ? `Analysis of ${monthNames[historyDetail.month]} ${historyDetail.year}`
          : "Analysis Overview"}
      </h1>

      <div className="widgets-grid">
        <div className="widget-card card">
          <HeadcountGenderPieWidget />
          <button
            className="btn btn-sm btn-outline-info mt-2 d-flex justify-content-center align-items-center gap-2 px-3"
            onClick={() => setIframeWidget("HeadcountGenderPieWidget")}
          >
            Details View
          </button>
        </div>

        <div className="widget-card card">
          <NhtNewHiresGenderPieWidget />
          <button
            className="btn btn-sm btn-outline-info mt-2 d-flex justify-content-center align-items-center gap-2 px-3"
            onClick={() => setIframeWidget("NhtNewHiresGenderPieWidget")}
          >
            Details View
          </button>
        </div>

        <div className="widget-card card">
          <TurnoverByGenderVoluntaryWidget />
          <button
            className="btn btn-sm btn-outline-info mt-2 d-flex justify-content-center align-items-center gap-2 px-3"
            onClick={() => setIframeWidget("TurnoverByGenderVoluntaryWidget")}
          >
            Details View
          </button>
        </div>

        <div className="widget-card card">
          <TurnoverByGenderInvoluntaryWidget />
          <button
            className="btn btn-sm btn-outline-info mt-2 d-flex justify-content-center align-items-center gap-2 px-3"
            onClick={() => setIframeWidget("TurnoverByGenderInvoluntaryWidget")}
          >
            Details View
          </button>
        </div>

        <div className="widget-card card">
          <AvgAgeByGenderWidget />
          <button
            className="btn btn-sm btn-outline-info mt-2 d-flex justify-content-center align-items-center gap-2 px-3"
            onClick={() => setIframeWidget("AvgAgeByGenderWidget")}
          >
            Details View
          </button>
        </div>

        <div className="widget-card card">
          <AvgTenureByGenderWidget />
          <button
            className="btn btn-sm btn-outline-info mt-2 d-flex justify-content-center align-items-center gap-2 px-3"
            onClick={() => setIframeWidget("AvgTenureByGenderWidget")}
          >
            Details View
          </button>
        </div>
      </div>

      {iframeWidget && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" style={{ width: "60vw", maxWidth: "60vw" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Details View</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIframeWidget(null)}
                ></button>
              </div>
              <div
                className="modal-body"
                style={{ height: "60vh", overflow: "auto" }}
              >
                {getIframeContent()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Excel Modal */}
      <UploadExcelModal 
        open={uploadModalOpen} 
        onClose={() => setUploadModalOpen(false)} 
      />

      {/* ✅ First Modal: Save Analysis Prompt */}
      {showSavePrompt && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Save Analysis</h5>
                <button type="button" className="btn-close" onClick={() => handleSavePrompt(false)}></button>
              </div>
              <div className="modal-body text-center">
                <p className="mb-3">Files uploaded successfully!</p>
                <p className="mb-0">Do you want to save this analysis?</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button className="btn btn-secondary" onClick={() => handleSavePrompt(false)}>No</button>
                <button className="btn btn-primary" onClick={() => handleSavePrompt(true)}>Yes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Second Modal: Save Options (Final/Draft) */}
      {showSaveOptionsModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Save Analysis Snapshot</h5>
                <button type="button" className="btn-close" onClick={() => setShowSaveOptionsModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Select <strong>Year</strong> and <strong>Month</strong> for this analysis:</p>

                <div className="d-flex gap-3 mb-3">
                  <input
                    type="number"
                    min="2020"
                    max="2030"
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
                <button className="btn btn-secondary" onClick={() => setShowSaveOptionsModal(false)}>Cancel</button>
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