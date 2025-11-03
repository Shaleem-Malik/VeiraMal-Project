import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchHistoryList, fetchHistoryDetail } from "../../Store/Actions/historyActions";

ChartJS.register(ArcElement, Tooltip, Legend);

const TurnoverByGenderInvoluntaryWidget = () => {
  const dispatch = useDispatch();
  const { loadingList, historyList, loadingDetail, historyDetail, error } = useSelector(
    (state) => state.history
  );

  useEffect(() => {
    dispatch(fetchHistoryList());
  }, [dispatch]);

  useEffect(() => {
    if (historyList.length > 0) {
      const recentId = historyList[0].id;
      dispatch(fetchHistoryDetail(recentId));
    }
  }, [dispatch, historyList]);

  if (loadingList || loadingDetail) return <p className="m-2">Loading saved analysis...</p>;
  if (error) return <p className="m-2 text-danger">Error: {error}</p>;
  if (!historyDetail?.terms?.length) return <p className="m-2">No saved turnover analysis available.</p>;

  const finalData = historyDetail.terms;

  const totalInvoluntaryMale = finalData.reduce((sum, row) => sum + (row.involuntaryMaleCount ?? 0), 0);
  const totalInvoluntaryFemale = finalData.reduce((sum, row) => sum + (row.involuntaryFemaleCount ?? 0), 0);

  const chartData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [totalInvoluntaryMale, totalInvoluntaryFemale],
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
          label: (context) => `${context.label}: ${context.raw} employees`,
        },
      },
    },
  };

  return (
    <div className="card p-3">
      <h3 className="mb-3">Turnover by Gender (Involuntary)</h3>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default TurnoverByGenderInvoluntaryWidget;
