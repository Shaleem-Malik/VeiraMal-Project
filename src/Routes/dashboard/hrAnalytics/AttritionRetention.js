import React, { useMemo } from 'react';
import { Clock3, LogOut, TrendingDown, UsersRound } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

const pct = (v) => `${Number(v || 0).toFixed(1)}%`;
const num = (v) => Number(v || 0).toLocaleString();
const riskClass = (risk) => risk === 'High' ? 'hr-risk-high' : risk === 'Medium' ? 'hr-risk-medium' : 'hr-risk-low';
const statusClass = (status) => status === 'Healthy' ? 'good' : status === 'Watch' ? 'warn' : 'bad';

function Kpi({ icon: Icon, label, value, meta, color, background }) {
  return <div className="hr-kpi"><div className="hr-kpi-icon" style={{ background, color }}><Icon /></div><div><div className="hr-kpi-label">{label}</div><div className="hr-kpi-value">{value}</div><div className="hr-kpi-meta">{meta}</div></div></div>;
}

export default function AttritionRetention({ dashboard }) {
  const a = dashboard?.attrition || {};
  const k = dashboard?.kpis || {};
  const trend = a.trend || [];
  const byDept = a.byDepartment || [];
  const reasons = a.exitReasons || [];
  const tenure = a.tenureAtExit || [];
  const risk = dashboard?.riskWatchlist || [];

  const trendData = useMemo(() => ({
    labels: trend.map((x) => x.label),
    datasets: [{ data: trend.map((x) => x.rate), borderColor: '#fe5c73', backgroundColor: 'rgba(254,92,115,.10)', fill: true, tension: .4, borderWidth: 2.5, pointRadius: 2 }]
  }), [trend]);

  const deptData = useMemo(() => ({
    labels: byDept.map((x) => x.label),
    datasets: [{ data: byDept.map((x) => x.value), backgroundColor: '#2d60ff', borderRadius: 7 }]
  }), [byDept]);

  const reasonData = useMemo(() => ({
    labels: reasons.map((x) => x.label),
    datasets: [{ data: reasons.map((x) => x.value), backgroundColor: ['#fe5c73', '#fc7900', '#8e7bff', '#2d60ff', '#16dbcc', '#41d4a8', '#fec53d'], borderRadius: 7 }]
  }), [reasons]);

  const tenureData = useMemo(() => ({
    labels: tenure.map((x) => x.label),
    datasets: [{ data: tenure.map((x) => x.value), backgroundColor: '#16dbcc', borderRadius: 7 }]
  }), [tenure]);

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#718ebf' } },
      y: { beginAtZero: true, grid: { color: '#eef2f9' }, ticks: { font: { size: 10 }, color: '#718ebf' } }
    }
  };

  const barOptions = { ...lineOptions, indexAxis: 'y' };
  const exits = Number(k.exits || 0);

  return (
    <>
      <div className="hr-kpis">
        <Kpi icon={TrendingDown} label="Annualised Turnover" value={pct(a.turnoverRate)} meta={a.turnoverStatus || 'Healthy'} color="#fe5c73" background="rgba(254,92,115,.12)" />
        <Kpi icon={LogOut} label="Voluntary Exits" value={pct(a.voluntaryExitPercentage)} meta={`${num(exits)} exits in period`} color="#fc7900" background="rgba(252,121,0,.12)" />
        <Kpi icon={UsersRound} label="Avg Tenure at Exit" value={`${Number(a.averageTenureAtExitYears || 0).toFixed(1)} yrs`} meta="Across leavers" color="#1814f3" background="rgba(24,20,243,.10)" />
        <Kpi icon={Clock3} label="Turnover Trend" value={`${Number(a.turnoverDelta || 0) >= 0 ? '+' : ''}${Number(a.turnoverDelta || 0).toFixed(1)} pts`} meta="Second half vs first half" color="#0fb6a9" background="rgba(22,219,204,.14)" />
      </div>

      <div className="hr-grid-2">
        <div className="hr-stack">
          <div>
            <div className="hr-section-title">Turnover Trend</div>
            <div className="hr-card">
              <div className="hr-card-title">Annualised monthly turnover</div>
              <div className="hr-card-caption">Exits ÷ monthly headcount × 12</div>
              <div className="hr-chart tall"><Line data={trendData} options={lineOptions} /></div>
            </div>
          </div>
          <div>
            <div className="hr-section-title">Turnover by Department</div>
            <div className="hr-card"><div className="hr-chart"><Bar data={deptData} options={barOptions} /></div></div>
          </div>
        </div>

        <div className="hr-stack">
          <div>
            <div className="hr-section-title">Reasons for Leaving</div>
            <div className="hr-card"><div className="hr-chart"><Bar data={reasonData} options={barOptions} /></div></div>
          </div>
          <div>
            <div className="hr-section-title">Tenure at Exit</div>
            <div className="hr-card"><div className="hr-chart"><Bar data={tenureData} options={{ ...lineOptions, plugins: { legend: { display: false } } }} /></div></div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="hr-section-title">Attrition Risk Watchlist <span style={{ fontWeight: 400, color: '#718ebf', fontSize: 10.5 }}>— employees with engagement data, prioritised by department turnover and tenure</span></div>
        <div className="hr-card" style={{ padding: 4 }}>
          <div className="hr-table-wrap">
            <table className="hr-table">
              <thead><tr><th>Employee</th><th>Department</th><th className="num">Tenure</th><th className="num">Engagement</th><th>Risk</th></tr></thead>
              <tbody>
                {risk.length ? risk.map((r) => (
                  <tr key={`${r.employeeId}-${r.name}`}>
                    <td style={{ fontWeight: 600 }}>{r.name}</td>
                    <td>{r.department || 'Unassigned'}</td>
                    <td className="num">{Number(r.tenureYears || 0).toFixed(1)} yrs</td>
                    <td className="num">{Number(r.engagement || 0).toFixed(0)}</td>
                    <td><span className={`hr-risk-badge ${riskClass(r.risk)}`}>{r.risk || 'Low'}{r.riskScore != null ? ` · ${r.riskScore}` : ''}</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" style={{ padding: 18, color: '#718ebf' }}>No employees currently meet the watchlist criteria with available engagement data.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="hr-card">
          <div className="hr-card-title">Thresholds in use</div>
          <div className="hr-card-caption">These values are controlled from Settings and applied to turnover status and department indicators.</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <span className={`hr-status ${statusClass(a.turnoverStatus)}`}>{a.turnoverStatus || 'Healthy'} · {pct(a.turnoverRate)}</span>
            <span style={{ fontSize: 10.5, color: '#718ebf' }}>First half: {pct(a.firstHalfTurnover)} · Second half: {pct(a.secondHalfTurnover)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
