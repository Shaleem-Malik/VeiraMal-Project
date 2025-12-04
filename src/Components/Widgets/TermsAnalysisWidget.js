import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTermsAnalysis, exportTermsAnalysis } from "../../Store/Actions/termsActions";

const TermsAnalysisWidget = ({ data: snapshotData }) => {
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector((state) => state.terms);

  useEffect(() => {
    if (!snapshotData) {
      dispatch(fetchTermsAnalysis());
    }
  }, [dispatch, snapshotData]);

  const handleExport = () => {
    dispatch(exportTermsAnalysis());
  };

  const finalData = snapshotData || data;

  if (!snapshotData && loading) return <p className="m-2">Loading turnover analysis...</p>;
  if (!snapshotData && error) return <p className="m-2 text-danger">Error: {error}</p>;

  if (!finalData || finalData.length === 0) {
    return <p className="m-2">No turnover data available.</p>;
  }

  const fmtRate = (v) => (v == null ? "0%" : `${Number(v).toFixed(2)}%`);
  const fmtNum = (v) => (v == null ? 0 : v);

  return (
    <div className="card p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Turnover Analysis</h3>
        <div>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={handleExport}
            title="Download turnover analysis as Excel"
          >
            Download Excel
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-sm align-middle text-center">
          <thead className="table-light">
            <tr>
              <th rowSpan="2">Department</th>
              <th colSpan="6">Voluntary</th>
              <th colSpan="6">Involuntary</th>
            </tr>
            <tr>
              <th>Tot (%)</th>
              <th>Tot (n)</th>
              <th>M (%)</th>
              <th>M (n)</th>
              <th>F (%)</th>
              <th>F (n)</th>

              <th>Tot (%)</th>
              <th>Tot (n)</th>
              <th>M (%)</th>
              <th>M (n)</th>
              <th>F (%)</th>
              <th>F (n)</th>
            </tr>
          </thead>
          <tbody>
            {finalData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.department ?? "-"}</td>

                <td>{fmtRate(row.voluntaryTotalRate)}</td>
                <td>{fmtNum(row.voluntaryTotalCount)}</td>
                <td>{fmtRate(row.voluntaryMaleRate)}</td>
                <td>{fmtNum(row.voluntaryMaleCount)}</td>
                <td>{fmtRate(row.voluntaryFemaleRate)}</td>
                <td>{fmtNum(row.voluntaryFemaleCount)}</td>

                <td>{fmtRate(row.involuntaryTotalRate)}</td>
                <td>{fmtNum(row.involuntaryTotalCount)}</td>
                <td>{fmtRate(row.involuntaryMaleRate)}</td>
                <td>{fmtNum(row.involuntaryMaleCount)}</td>
                <td>{fmtRate(row.involuntaryFemaleRate)}</td>
                <td>{fmtNum(row.involuntaryFemaleCount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TermsAnalysisWidget;
