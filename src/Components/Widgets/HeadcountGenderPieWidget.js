import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchHistoryList, fetchHistoryDetail } from "../../Store/Actions/historyActions";

ChartJS.register(ArcElement, Tooltip, Legend);

const HeadcountGenderPieWidget = () => {
  const dispatch = useDispatch();
  const { historyList, historyDetail, loadingList, loadingDetail, error } = useSelector(
    (state) => state.history
  );

  // fetch list once
  useEffect(() => {
    dispatch(fetchHistoryList());
  }, [dispatch]);

  // when list arrives, fetch most recent
  useEffect(() => {
    if (historyList && historyList.length > 0 && !historyDetail) {
      const latestId = historyList[0].id;
      dispatch(fetchHistoryDetail(latestId));
    }
  }, [historyList, historyDetail, dispatch]);

  if (loadingList || loadingDetail) {
    return <p className="m-2">Loading saved headcount analysis...</p>;
  }

  if (error) {
    return <p className="m-2 text-danger">Error: {error}</p>;
  }

  if (!historyDetail || !historyDetail.headcount) {
    return <p className="m-2">No saved headcount data available.</p>;
  }

  // ✅ pull correct camelCase property
  const headcountData = historyDetail.headcount || [];

  const totalMale = headcountData.reduce((sum, row) => sum + (row.maleCount || 0), 0);
  const totalFemale = headcountData.reduce((sum, row) => sum + (row.femaleCount || 0), 0);

  const pieData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "Headcount",
        data: [totalMale, totalFemale],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#1E90FF", "#FF1493"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { font: { size: 14 } } },
      tooltip: {
        callbacks: {
          label: (context) => {
            let value = context.raw;
            let total = totalMale + totalFemale;
            let percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="card p-3">
      <h3 className="mb-3">Total Headcount by Gender</h3>
        <Pie data={pieData} options={pieOptions} />
    </div>
  );
};

export default HeadcountGenderPieWidget;
