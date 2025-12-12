import React, { useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchHistoryDetail } from "../../Store/Actions/historyActions";

ChartJS.register(ArcElement, Tooltip, Legend);

const TurnoverByGenderVoluntaryWidget = () => {
  const dispatch = useDispatch();
  const { loadingList, historyList, loadingDetail, historyDetail, error } = useSelector(
    (state) => state.history
  );

  const didRequestDetailRef = useRef(false);
  const didAnimateRef = useRef(false);

  const totals = useMemo(() => {
    const finalData = historyDetail?.terms || [];
    const totalVoluntaryMale = finalData.reduce((sum, row) => sum + (row?.voluntaryMaleCount ?? 0), 0);
    const totalVoluntaryFemale = finalData.reduce((sum, row) => sum + (row?.voluntaryFemaleCount ?? 0), 0);
    return { finalData, totalVoluntaryMale, totalVoluntaryFemale };
  }, [historyDetail]);

  const chartData = useMemo(() => ({
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [totals.totalVoluntaryMale, totals.totalVoluntaryFemale],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#1E88E5", "#E91E63"],
        borderWidth: 1,
      },
    ],
  }), [totals.totalVoluntaryMale, totals.totalVoluntaryFemale]);

  const options = useMemo(() => {
    const base = {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.raw} employees`,
          },
        },
      },
      animation: {
        duration: didAnimateRef.current ? 0 : 700,
      },
    };
    didAnimateRef.current = true;
    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totals.totalVoluntaryMale, totals.totalVoluntaryFemale]);

  useEffect(() => {
    if (
      !didRequestDetailRef.current &&
      Array.isArray(historyList) &&
      historyList.length > 0 &&
      (!historyDetail || historyDetail.id !== historyList[0].id)
    ) {
      didRequestDetailRef.current = true;
      dispatch(fetchHistoryDetail(historyList[0].id));
    }
  }, [historyList, historyDetail, dispatch]);

  if (loadingList || loadingDetail) return <p className="m-2">Loading saved analysis...</p>;
  if (error) return <p className="m-2 text-danger">Error: {error}</p>;
  if (!totals.finalData || totals.finalData.length === 0) return <p className="m-2">No saved turnover analysis available.</p>;

  return (
    <div className="card p-3">
      <h3 className="mb-3">Turnover by Gender (Voluntary)</h3>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default TurnoverByGenderVoluntaryWidget;
