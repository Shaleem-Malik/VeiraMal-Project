import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHeadcountAnalysis } from "../../Store/Actions/headcountActions";

const HeadcountAnalysisWidget = ({ data: snapshotData }) => {
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector((state) => state.headcount);

  useEffect(() => {
     dispatch(fetchHeadcountAnalysis());
  }, [dispatch, snapshotData]);

  const finalData = snapshotData || data;

  if (!snapshotData && loading) {
    return <p className="m-2">Loading Headcount Analysis...</p>;
  }

  if (!snapshotData && error) {
    return <p className="m-2 text-danger">Error: {error}</p>;
  }

  if (!finalData.length) {
    return <p className="m-2">No headcount data available.</p>;
  }

  return (
    <div className="card p-3">
      <h3 className="mb-3">Demographics</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-sm align-middle text-center">
          <thead className="table-light">
            <tr>
              <th rowSpan="2">Department</th>
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
                <td>{row.department ?? "-"}</td>
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

export default HeadcountAnalysisWidget;
