import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNhtAnalysis } from "../../Store/Actions/nhtActions";

const NhtAnalysisWidget = ({ data: snapshotData }) => {
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector((state) => state.nht);

  useEffect(() => {
    if (!snapshotData) {
      dispatch(fetchNhtAnalysis());
    }
  }, [dispatch, snapshotData]);

  const finalData = snapshotData || data;

  if (!snapshotData && loading) {
    return <p className="m-2">Loading Career Management data...</p>;
  }

  if (!snapshotData && error) {
    return <p className="m-2 text-danger">Error: {error}</p>;
  }

  if (!finalData.length) {
    return <p className="m-2">No Career Management data available.</p>;
  }

  return (
    <div className="card p-3">
      <h3 className="mb-3">Career Management</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-sm align-middle text-center">
          <thead className="table-light">
            <tr>
              <th rowSpan="2">Department</th>
              <th colSpan="3">New Hires</th>
              <th colSpan="3">Promotions</th>
              <th>Int Hires</th>
            </tr>
            <tr>
              <th>Tot (n)</th>
              <th>M (n)</th>
              <th>F (n)</th>
              <th>Tot (n)</th>
              <th>M (n)</th>
              <th>F (n)</th>
              <th>Tot (%)</th>
            </tr>
          </thead>
          <tbody>
            {finalData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.department ?? "-"}</td>
                <td>{row.newHireTotal ?? 0}</td>
                <td>{row.newHireMale ?? 0}</td>
                <td>{row.newHireFemale ?? 0}</td>
                <td>{row.transferTotal ?? 0}</td>
                <td>{row.transferMale ?? 0}</td>
                <td>{row.transferFemale ?? 0}</td>
                <td>{row.internalHireRate != null ? `${row.internalHireRate}%` : "0%"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NhtAnalysisWidget;
