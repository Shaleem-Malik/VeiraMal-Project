import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import { useDispatch, useSelector } from "react-redux";
import IntlMessages from 'Util/IntlMessages';
import { useHistory } from "react-router-dom";

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
import "../../crm/dashboard/CEODashboard.css";

import {
  fetchHistoryList,
  fetchHistoryDetail,
} from "Store/Actions/historyActions";


export default function EcommerceDashboard({ match }) {
  const [iframeWidget, setIframeWidget] = useState(null);
  const dispatch = useDispatch();
  const { historyList, loadingList, historyDetail } = useSelector((state) => state.history);
  const [selectedHistoryId, setSelectedHistoryId] = useState("");

  const history = useHistory();

  useEffect(() => {
    dispatch(fetchHistoryList());
  }, [dispatch]);

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

  return (
    <div className="ecom-dashboard-wrapper">
      <Helmet>
        <title>Admin Dashboard</title>
        <meta name="description" content="Reactify Ecommerce Dashboard" />
      </Helmet>
      <div className="dashboard-header">
        <PageTitleBar title={<IntlMessages id="Admin Dashboard" />} match={match} />

        {/* Top Bar: Dropdown Only */}
        <div className="dashboard-controls">
          <div className="controls-left">
            <button
              className="btn btn-primary"
              onClick={() => history.push("live-analysis-detail")}
            >
              Show Detailed Analysis
            </button>
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
                  <option value="">Select Final Analysis</option>
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
    </div>
  );
}
