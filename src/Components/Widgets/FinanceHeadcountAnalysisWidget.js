import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFinanceAnalysis } from "../../Store/Actions/headcountActions";

const FinanceHeadcountAnalysisWidget = ({ month = "April", data: snapshotData }) => {
  const dispatch = useDispatch();
  const { financeData = [], financeLoading, financeError } = useSelector(
    (state) => state.headcount
  );

  useEffect(() => {
    if (!snapshotData) {
      dispatch(fetchFinanceAnalysis("April")); // pass month dynamically
    }
  }, [dispatch, snapshotData, month]);

  // If snapshotData exists, use it. Otherwise fallback to redux store
  const finalData = snapshotData || financeData;

  if (!finalData.length) {
    if (financeLoading) return <p className="m-2">Loading Finance Headcount Analysis...</p>;
    if (financeError) return <p className="m-2 text-danger">Error: {financeError}</p>;
    return <p className="m-2">No finance headcount data available.</p>;
  }
  const businessUnit = localStorage.getItem("BusinessUnit") || 'Finance'; 
  return (
    <div className="card p-3">
      <h3 className="mb-3">{businessUnit} Demographics ({month})</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-sm align-middle text-center">
          <thead className="table-light">
            <tr>
              <th rowSpan="2">Organizational Unit</th>
              <th colSpan="3">Headcount</th>
              <th colSpan="2">Male</th>
              <th colSpan="2">Female</th>
              <th rowSpan="2">FTCs (n)</th>
              <th rowSpan="2">Age (Avg)</th>
              <th rowSpan="2">Tenure (Avg)</th>
            </tr>
            <tr>
              <th>HC</th>
              <th>HC %</th>
              <th>FTC %</th>
              <th>M (n)</th>
              <th>M (%)</th>
              <th>F (n)</th>
              <th>F (%)</th>
            </tr>
          </thead>
          <tbody>
            {finalData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.organizationalUnit ?? "-"}</td>
                <td>{row.headcount ?? 0}</td>
                <td>{row.headcountPercentage ?? 0}%</td>
                <td>{row.tempPercentage ?? 0}%</td>
                <td>{row.maleCount ?? 0}</td>
                <td>{row.malePercentage ?? 0}%</td>
                <td>{row.femaleCount ?? 0}</td>
                <td>{row.femalePercentage ?? 0}%</td>
                <td>{row.tempCount ?? 0}</td>
                <td>{row.averageAge ?? "-"}</td>
                <td>{row.averageTenure ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceHeadcountAnalysisWidget;
