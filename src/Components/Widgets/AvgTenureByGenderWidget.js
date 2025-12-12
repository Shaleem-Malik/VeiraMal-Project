import React, { useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchHistoryDetail } from "../../Store/Actions/historyActions";

ChartJS.register(ArcElement, Tooltip, Legend);

const AvgTenureByGenderWidget = () => {
  const dispatch = useDispatch();
  const { loadingList, historyList, loadingDetail, historyDetail, error } = useSelector(
    (state) => state.history
  );

  const didRequestDetailRef = useRef(false);
  const didAnimateRef = useRef(false);

  const totals = useMemo(() => {
    const finalData = historyDetail?.headcount || [];
    let maleCount = 0, femaleCount = 0, maleTenureSum = 0, femaleTenureSum = 0;

    finalData.forEach((row) => {
      const mCount = row?.maleCount ?? 0;
      const fCount = row?.femaleCount ?? 0;
      maleCount += mCount;
      femaleCount += fCount;
      maleTenureSum += (row?.averageTenure ?? 0) * mCount;
      femaleTenureSum += (row?.averageTenure ?? 0) * fCount;
    });

    const avgMaleTenure = maleCount > 0 ? +(maleTenureSum / maleCount).toFixed(1) : 0;
    const avgFemaleTenure = femaleCount > 0 ? +(femaleTenureSum / femaleCount).toFixed(1) : 0;

    return { finalData, avgMaleTenure, avgFemaleTenure };
  }, [historyDetail]);

  const chartData = useMemo(() => ({
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [totals.avgMaleTenure, totals.avgFemaleTenure],
        backgroundColor: ["#4BC0C0", "#FF9F40"],
        hoverBackgroundColor: ["#009688", "#F57C00"],
        borderWidth: 1,
      },
    ],
  }), [totals.avgMaleTenure, totals.avgFemaleTenure]);

  const options = useMemo(() => {
    const base = {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.raw}`,
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
  }, [totals.avgMaleTenure, totals.avgFemaleTenure]);

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
  if (!totals.finalData || totals.finalData.length === 0) return <p className="m-2">No saved demographics analysis available.</p>;

  return (
    <div className="card p-3 text-center">
      <h3 className="mb-3">Average Tenure by Gender</h3>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default AvgTenureByGenderWidget;
