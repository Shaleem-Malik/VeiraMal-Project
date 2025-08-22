import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import { useDispatch, useSelector} from "react-redux";
import IntlMessages from 'Util/IntlMessages';

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

export default function EcommerceDashboard({ match }) {
  const dispatch = useDispatch();
  const { saving, error, savedData, historyList, loadingList, historyDetail } = useSelector((state) => state.history);
  // Single global toggle
  const [viewMode, setViewMode] = useState('chart'); // 'table' | 'chart' | 'both'

  const [selectedHistoryId, setSelectedHistoryId] = useState("");

  useEffect(() => {
    // Fetch history list on component mount
    dispatch(fetchHistoryList());
  }, [dispatch]);

  const handleSaveHistory = () => {
    dispatch(saveAllAnalysisHistory()).then(() => {
      // Refresh list after saving
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

  return (
    <div className="ecom-dashboard-wrapper">
      <Helmet>
        <title>Ecommerce Dashboard</title>
        <meta name="description" content="Reactify Ecommerce Dashboard" />
      </Helmet>
      <PageTitleBar title={<IntlMessages id="sidebar.ecommerce" />} match={match} />

      {/* Top Bar: Save Button & Dropdown */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-primary" onClick={handleSaveHistory} disabled={saving}>
          {saving ? "Saving..." : "Save Analysis Snapshot"}
        </button>

        {/* Dropdown for Analysis History */}
        <div>
          {loadingList ? (
            <span>Loading history...</span>
          ) : (
            <select
              className="form-select"
              style={{ width: "250px" }}
              value={selectedHistoryId}
              onChange={(e) => handleSelectHistory(e.target.value)}
            >
              <option value="">Select Previous Analysis</option>
              {historyList.map((item) => (
                <option key={item.id} value={item.id}>
                  {new Date(item.analysisDate).toLocaleString()} {/* Format Date */}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Global View Toggle */}
      <div className="mb-4 d-flex gap-2">
        <button
          className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setViewMode('table')}
        >
          Table
        </button>
        <button
          className={`btn btn-sm ${viewMode === 'chart' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setViewMode('chart')}
        >
          Chart
        </button>
        <button
          className={`btn btn-sm ${viewMode === 'both' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setViewMode('both')}
        >
          Both
        </button>
      </div>

      <div className="row">
        {/* Headcount Analysis */}
        <div className="col-12">
          <h4 className="mb-2">Headcount Analysis</h4>
          {viewMode !== 'chart' && <HeadcountWidget data={snapshotHeadcount} />}
          {viewMode !== 'table' && <HeadcountAnalysisChart data={snapshotHeadcount} />}
        </div>

        {/* NHT Analysis */}
        <div className="col-12 mt-4">
          <h4 className="mb-2">Career Management</h4>
          {viewMode !== 'chart' && <NhtAnalysisWidget data={snapshotNht} />}
          {viewMode !== 'table' && <NhtAnalysisChart data={snapshotNht} />}
        </div>

        {/* Terms Analysis */}
        <div className="col-12 mt-4">
          <h4 className="mb-2">Turnover Analysis</h4>
          {viewMode !== 'chart' && <TermsAnalysisWidget data={snapshotTerms} />}
          {viewMode !== 'table' && <TermAnalysisChart data={snapshotTerms} />}
        </div>
      </div>
    </div>
  );
}
