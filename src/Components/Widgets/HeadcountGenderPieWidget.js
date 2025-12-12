// HeadcountGenderPieWidget.js (fixed)
import React, { useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchHistoryDetail } from "../../Store/Actions/historyActions";

ChartJS.register(ArcElement, Tooltip, Legend);

const HeadcountGenderPieWidget = () => {
  const dispatch = useDispatch();
  const { historyList, historyDetail, loadingList, loadingDetail, error } = useSelector(
    (state) => state.history
  );

  // ---------------------------------------------------------------------
  // Hooks / refs / memos MUST be declared before any early returns
  // ---------------------------------------------------------------------

  // Guard to ensure we only dispatch fetchHistoryDetail a single time when the list first arrives
  const didRequestDetailRef = useRef(false);

  // Track whether we've already animated to avoid repeated Chart.js animations
  const didAnimateRef = useRef(false);

  // Compute totals inside useMemo so references are stable across renders
  const totals = useMemo(() => {
    const headcountData = historyDetail?.headcount || [];
    const totalMale = headcountData.reduce((sum, row) => sum + (row?.maleCount || 0), 0);
    const totalFemale = headcountData.reduce((sum, row) => sum + (row?.femaleCount || 0), 0);
    return { headcountData, totalMale, totalFemale };
  }, [historyDetail]);

  // Memoize pie data so object identity is stable unless numbers change
  const pieData = useMemo(() => ({
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "Headcount",
        data: [totals.totalMale, totals.totalFemale],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#1E90FF", "#FF1493"],
        borderWidth: 1,
      },
    ],
  }), [totals.totalMale, totals.totalFemale]);

  // Memoize options and control animation: animate only once
  const pieOptions = useMemo(() => {
    const base = {
      responsive: true,
      plugins: {
        legend: { position: "bottom", labels: { font: { size: 14 } } },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw;
              const total = (totals.totalMale + totals.totalFemale) || 1;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
      animation: {
        duration: didAnimateRef.current ? 0 : 700,
      },
    };

    // mark that we've used initial animation so subsequent changes don't reanimate
    didAnimateRef.current = true;
    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totals.totalMale, totals.totalFemale]);

  // ---------------------------------------------------------------------
  // Effects (these can remain below hooks)
  // ---------------------------------------------------------------------

  // When the parent loads the list (AdminDashboard dispatches fetchHistoryList),
  // request the latest detail once (if none present).
  useEffect(() => {
    if (
      !didRequestDetailRef.current &&
      Array.isArray(historyList) &&
      historyList.length > 0 &&
      !historyDetail
    ) {
      const latestId = historyList[0].id;
      didRequestDetailRef.current = true;
      dispatch(fetchHistoryDetail(latestId));
    }
  }, [historyList, historyDetail, dispatch]);

  // ---------------------------------------------------------------------
  // Early returns (safe now because hooks already ran)
  // ---------------------------------------------------------------------
  if (loadingList || loadingDetail) {
    return <p className="m-2">Loading saved headcount analysis...</p>;
  }

  if (error) {
    return <p className="m-2 text-danger">Error: {error}</p>;
  }

  if (!historyDetail || !totals.headcountData || totals.headcountData.length === 0) {
    return <p className="m-2">No saved headcount data available.</p>;
  }

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------
  return (
    <div className="card p-3">
      <h3 className="mb-3">Total Headcount by Gender</h3>
      <Pie data={pieData} options={pieOptions} />
    </div>
  );
};

export default HeadcountGenderPieWidget;
