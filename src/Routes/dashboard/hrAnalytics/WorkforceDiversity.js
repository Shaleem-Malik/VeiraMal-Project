import React, { useMemo } from 'react';
import { Users, UserRound, Layers3, CalendarDays } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const COLORS = ['#ff82ac', '#2d60ff', '#8e7bff', '#aeb9d4', '#16dbcc', '#fc7900', '#41d4a8', '#fec53d'];
const pct = (v) => `${Number(v || 0).toFixed(1)}%`;
const num = (v) => Number(v || 0).toLocaleString();

const horizontalOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: { legend: { display: false } },
  scales: {
    x: { beginAtZero: true, grid: { color: '#eef2f9' }, ticks: { font: { size: 10 }, color: '#718ebf' } },
    y: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#718ebf' } }
  }
};

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: { legend: { display: false } }
};

function BreakdownChart({ title, items, type = 'bar', colorIndex = 0 }) {
  const data = useMemo(() => ({
    labels: (items || []).map((x) => x.label),
    datasets: [{ data: (items || []).map((x) => x.value), backgroundColor: (items || []).map((_, i) => COLORS[(i + colorIndex) % COLORS.length]), borderRadius: 7, borderWidth: 0 }]
  }), [items, colorIndex]);

  const options = type === 'donut' ? donutOptions : horizontalOptions;
  return (
    <div className="hr-card">
      <div className="hr-card-title">{title}</div>
      <div className="hr-card-caption">Active workforce distribution</div>
      <div className="hr-chart small">{type === 'donut' ? <Doughnut data={data} options={options} /> : <Bar data={data} options={options} />}</div>
      <div className="hr-legend">
        {(items || []).slice(0, 8).map((item, index) => (
          <span className="hr-legend-item" key={`${item.label}-${index}`}>
            <span className="hr-legend-dot" style={{ background: COLORS[(index + colorIndex) % COLORS.length] }} />
            {item.label}: {num(item.value)}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function WorkforceDiversity({ dashboard }) {
  const k = dashboard?.kpis || {};
  const d = dashboard?.diversity || {};
  const genderDept = d.genderByDepartment || [];

  const genderDeptData = useMemo(() => ({
    labels: genderDept.map((x) => x.department),
    datasets: [
      { label: 'Female', data: genderDept.map((x) => x.female), backgroundColor: '#ff82ac', borderRadius: 5 },
      { label: 'Male', data: genderDept.map((x) => x.male), backgroundColor: '#2d60ff', borderRadius: 5 },
      { label: 'Other', data: genderDept.map((x) => x.other), backgroundColor: '#8e7bff', borderRadius: 5 }
    ]
  }), [genderDept]);

  return (
    <>
      <div className="hr-kpis">
        <div className="hr-kpi"><div className="hr-kpi-icon" style={{ background: 'rgba(24,20,243,.10)', color: '#1814f3' }}><Users /></div><div><div className="hr-kpi-label">Headcount</div><div className="hr-kpi-value">{num(k.activeHeadcount)}</div><div className="hr-kpi-meta">{Number(k.activeFte || 0).toFixed(1)} FTE</div></div></div>
        <div className="hr-kpi"><div className="hr-kpi-icon" style={{ background: 'rgba(255,130,172,.14)', color: '#ff82ac' }}><UserRound /></div><div><div className="hr-kpi-label">Female workforce</div><div className="hr-kpi-value">{pct(k.femalePercentage)}</div><div className="hr-kpi-meta">Current active workforce</div></div></div>
        <div className="hr-kpi"><div className="hr-kpi-icon" style={{ background: 'rgba(142,123,255,.14)', color: '#8e7bff' }}><CalendarDays /></div><div><div className="hr-kpi-label">Average tenure</div><div className="hr-kpi-value">{Number(k.averageTenureYears || 0).toFixed(1)} yrs</div><div className="hr-kpi-meta">Years of service</div></div></div>
        <div className="hr-kpi"><div className="hr-kpi-icon" style={{ background: 'rgba(22,219,204,.14)', color: '#0fb6a9' }}><Layers3 /></div><div><div className="hr-kpi-label">Departments</div><div className="hr-kpi-value">{num((dashboard?.departments || []).length)}</div><div className="hr-kpi-meta">Active workforce coverage</div></div></div>
      </div>

      <div className="hr-grid-2">
        <div className="hr-stack">
          <BreakdownChart title="Gender" items={d.gender} type="donut" />
          <BreakdownChart title="Age Bands" items={d.age} colorIndex={2} />
          <BreakdownChart title="Tenure Bands" items={d.tenure} colorIndex={4} />
          <BreakdownChart title="Ethnicity" items={d.ethnicity} colorIndex={5} />
        </div>
        <div className="hr-stack">
          <BreakdownChart title="Employment Type" items={d.employmentType} type="donut" colorIndex={2} />
          <BreakdownChart title="Work Arrangement" items={d.workArrangement} type="donut" colorIndex={4} />
          <BreakdownChart title="Location" items={d.location} colorIndex={5} />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="hr-section-title">Gender by Department</div>
        <div className="hr-card">
          <div className="hr-card-caption">Top departments with current gender counts</div>
          <div className="hr-chart tall">
            <Bar
              data={genderDeptData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10 }, color: '#718ebf' } },
                  y: { stacked: true, beginAtZero: true, grid: { color: '#eef2f9' }, ticks: { font: { size: 10 }, color: '#718ebf' } }
                },
                plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 9, font: { size: 10 } } } }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
