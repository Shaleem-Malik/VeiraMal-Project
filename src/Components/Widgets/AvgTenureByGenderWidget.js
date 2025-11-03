import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchHistoryList, fetchHistoryDetail } from "../../Store/Actions/historyActions";

ChartJS.register(ArcElement, Tooltip, Legend);

const AvgTenureByGenderWidget = () => {
  const dispatch = useDispatch();
  const { loadingList, historyList, loadingDetail, historyDetail, error } = useSelector(
    (state) => state.history
  );

  // Load list of saved analyses
  useEffect(() => {
    dispatch(fetchHistoryList());
  }, [dispatch]);

  // Load the most recent saved analysis
  useEffect(() => {
    if (historyList.length > 0) {
      const recentId = historyList[0].id;
      dispatch(fetchHistoryDetail(recentId));
    }
  }, [dispatch, historyList]);

  if (loadingList || loadingDetail) return <p className="m-2">Loading saved analysis...</p>;
  if (error) return <p className="m-2 text-danger">Error: {error}</p>;
  if (!historyDetail || !historyDetail.headcount || !historyDetail.headcount.length)
    return <p className="m-2">No saved demographics analysis available.</p>;

  const finalData = historyDetail.headcount;

  // Weighted averages
  let maleCount = 0,
    femaleCount = 0,
    maleTenureSum = 0,
    femaleTenureSum = 0;

  finalData.forEach((row) => {
    const mCount = row.maleCount ?? 0;
    const fCount = row.femaleCount ?? 0;

    maleCount += mCount;
    femaleCount += fCount;

    maleTenureSum += (row.averageTenure ?? 0) * mCount;
    femaleTenureSum += (row.averageTenure ?? 0) * fCount;
  });

  const avgMaleTenure = maleCount > 0 ? (maleTenureSum / maleCount).toFixed(1) : 0;
  const avgFemaleTenure = femaleCount > 0 ? (femaleTenureSum / femaleCount).toFixed(1) : 0;

  const chartData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [avgMaleTenure, avgFemaleTenure],
        backgroundColor: ["#4BC0C0", "#FF9F40"],
        hoverBackgroundColor: ["#009688", "#F57C00"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`,
        },
      },
    },
  };

  return (
    <div className="card p-3 text-center">
      <h3 className="mb-3">Average Tenure by Gender</h3>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default AvgTenureByGenderWidget;