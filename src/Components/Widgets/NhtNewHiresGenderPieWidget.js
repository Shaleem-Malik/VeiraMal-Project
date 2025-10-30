import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchHistoryDetail, fetchHistoryList } from "../../Store/Actions/historyActions";

ChartJS.register(ArcElement, Tooltip, Legend);

const NhtNewHiresGenderPieWidget = () => {
  const dispatch = useDispatch();
  const { loadingList, historyList, loadingDetail, historyDetail, error } = useSelector(
    (state) => state.history
  );

  // On first load → get history list
  useEffect(() => {
    dispatch(fetchHistoryList());
  }, [dispatch]);

  // Once list is loaded → fetch the most recent analysis (first item)
  useEffect(() => {
    if (historyList.length > 0) {
      const recentId = historyList[0].id; // ✅ latest saved analysis
      dispatch(fetchHistoryDetail(recentId));
    }
  }, [dispatch, historyList]);

  if (loadingList || loadingDetail) {
    return <p className="m-2">Loading saved analysis...</p>;
  }

  if (error) {
    return <p className="m-2 text-danger">Error: {error}</p>;
  }

  if (!historyDetail || !historyDetail.nht || !historyDetail.nht.length) {
    return <p className="m-2">No saved New Hire analysis available.</p>;
  }

  const finalData = historyDetail.nht;

  // ✅ Aggregate gender counts across all departments
  const totalMale = finalData.reduce((sum, row) => sum + (row.newHireMale ?? 0), 0);
  const totalFemale = finalData.reduce((sum, row) => sum + (row.newHireFemale ?? 0), 0);

  const chartData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [totalMale, totalFemale],
        backgroundColor: ["#4BC0C0", "#FF9F40"],
        hoverBackgroundColor: ["#009688", "#F57C00"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} hires`,
        },
      },
    },
  };

  return (
    <div className="card p-3">
      <h3 className="mb-3">Total New Hires by Gender</h3>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default NhtNewHiresGenderPieWidget;
