import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTermsAnalysis } from "../../Store/Actions/termsActions";

const TermsAnalysisWidget = ({ data: snapshotData }) => {
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector((state) => state.terms);

  useEffect(() => {
    if (!snapshotData) {
      dispatch(fetchTermsAnalysis());
    }
  }, [dispatch, snapshotData]);

  const finalData = snapshotData || data;

  if (!snapshotData && loading) return <p>Loading turnover analysis...</p>;
  if (!snapshotData && error) return <p>Error: {error}</p>;

  if (!finalData.length) {
    return <p className="m-2">No turnover data available.</p>;
  }

  return (
    <div className="card p-3">
      <h3 className="mb-3">Turnover Analysis</h3>
      <table className="table table-bordered table-sm align-middle text-center">
        <thead className="table-light">
          <tr>
            <th rowSpan="2">Department</th>
            <th colSpan="6">Voluntary</th>
            <th colSpan="6">Involuntary</th>
          </tr>
          <tr>
            <th colSpan="2">Tot(%) / n</th>
            <th colSpan="2">M(%) / n</th>
            <th colSpan="2">F(%) / n</th>
            <th colSpan="2">Tot(%) / n</th>
            <th colSpan="2">M(%) / n</th>
            <th colSpan="2">F(%) / n</th>
          </tr>
        </thead>
        <tbody>
          {finalData.map((row, idx) => (
            <tr key={idx}>
              <td>{row.department}</td>
              <td>{row.voluntaryTotalRate}</td>
              <td>{row.voluntaryTotalCount}</td>
              <td>{row.voluntaryMaleRate}</td>
              <td>{row.voluntaryMaleCount}</td>
              <td>{row.voluntaryFemaleRate}</td>
              <td>{row.voluntaryFemaleCount}</td>
              <td>{row.involuntaryTotalRate}</td>
              <td>{row.involuntaryTotalCount}</td>
              <td>{row.involuntaryMaleRate}</td>
              <td>{row.involuntaryMaleCount}</td>
              <td>{row.involuntaryFemaleRate}</td>
              <td>{row.involuntaryFemaleCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TermsAnalysisWidget;
