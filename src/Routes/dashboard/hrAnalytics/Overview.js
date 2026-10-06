import React, { useMemo } from 'react';
import { Banknote, Clock3, Users, TrendingUp } from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

// Same department colour order used by the supplied HR Analytix HTML prototype.
const PALETTE = [
  '#1814f3',
  '#16dbcc',
  '#fc7900',
  '#ff82ac',
  '#8e7bff',
  '#41d4a8',
  '#fec53d',
  '#2d60ff',
  '#fe5c73',
  '#00b8d9'
];

const money = (value, currency = 'USD') => {
  const v = Number(value || 0);

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(v);
  } catch (_) {
    return `${currency} ${Math.round(v).toLocaleString()}`;
  }
};

const pct = (value) => `${Number(value || 0).toFixed(1)}%`;
const num = (value) => Number(value || 0).toLocaleString();

const statusClass = (status) => {
  if (status === 'Healthy') return 'good';
  if (status === 'Watch') return 'warn';
  return 'bad';
};

const chartBase = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 500
  },
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 10 }, color: '#718ebf' }
    },
    y: {
      beginAtZero: true,
      grid: { color: '#eef2f9' },
      ticks: { font: { size: 10 }, color: '#718ebf' }
    }
  }
};

function Kpi({
  icon: Icon,
  label,
  value,
  meta,
  color = '#1814f3',
  background = 'rgba(24,20,243,.10)'
}) {
  return (
    <div className="hr-kpi">
      <div className="hr-kpi-icon" style={{ background, color }}>
        <Icon />
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="hr-kpi-label">{label}</div>
        <div className="hr-kpi-value">{value}</div>
        <div className="hr-kpi-meta">{meta}</div>
      </div>
    </div>
  );
}

function Panel({ title, caption, children, className = '' }) {
  return (
    <div>
      <div className="hr-section-title">{title}</div>
      <div className={`hr-card ${className}`}>
        <div className="hr-card-title">{title}</div>
        {caption && <div className="hr-card-caption">{caption}</div>}
        {children}
      </div>
    </div>
  );
}

function normaliseDepartments(value) {
  // Normal API response is an array. The $values fallback keeps the chart
  // resilient if the API is ever configured to use a reference-preserving
  // JSON collection format.
  const raw = Array.isArray(value)
    ? value
    : Array.isArray(value?.$values)
      ? value.$values
      : [];

  return raw
    .map((department) => ({
      ...department,
      name: department?.name || department?.department || department?.label || 'Unassigned',
      headcount: Number(department?.headcount ?? department?.value ?? department?.count ?? 0)
    }))
    .filter((department) => department.headcount > 0);
}

export default function Overview({ dashboard, loading }) {
  const k = dashboard?.kpis || {};
  const settings = dashboard?.settings || {};
  const trends = dashboard?.headcountTrend || [];
  const hiresExits = dashboard?.hiresVsExits || [];

  const departments = useMemo(
    () => normaliseDepartments(dashboard?.departments),
    [dashboard?.departments]
  );

  const currency = settings.currency || 'USD';

  const headcountData = useMemo(() => ({
    labels: trends.map((x) => x.label),
    datasets: [
      {
        label: 'Headcount',
        data: trends.map((x) => x.headcount),
        borderColor: '#2d60ff',
        backgroundColor: 'rgba(45,96,255,.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 2
      },
      {
        label: '3-month rolling average',
        data: trends.map((x) => x.rollingAverageHeadcount),
        borderColor: '#16dbcc',
        borderDash: [5, 4],
        fill: false,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0
      }
    ]
  }), [trends]);

  const hiresExitsData = useMemo(() => ({
    labels: hiresExits.map((x) => x.label),
    datasets: [
      {
        label: 'Hires',
        data: hiresExits.map((x) => x.hires),
        backgroundColor: '#2d60ff',
        borderRadius: 5
      },
      {
        label: 'Exits',
        data: hiresExits.map((x) => x.exits),
        backgroundColor: '#ff82ac',
        borderRadius: 5
      }
    ]
  }), [hiresExits]);

  // The supplied HTML prototype uses a doughnut chart for Workforce by
  // Department, not a horizontal bar chart.
  const departmentData = useMemo(() => ({
    labels: departments.map((x) => x.name),
    datasets: [
      {
        data: departments.map((x) => x.headcount),
        backgroundColor: departments.map((_, i) => PALETTE[i % PALETTE.length]),
        borderWidth: 0,
        hoverOffset: 8
      }
    ]
  }), [departments]);

  const departmentChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    animation: {
      duration: 500
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'start',
        labels: {
          color: '#718ebf',
          boxWidth: 10,
          boxHeight: 10,
          padding: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 11,
            weight: '500'
          }
        }
      },
      tooltip: {
        callbacks: {
          label(context) {
            const label = context.label || '';
            const value = Number(context.raw || 0);
            const total = context.dataset.data.reduce(
              (sum, item) => sum + Number(item || 0),
              0
            );
            const share = total ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${label}: ${value.toLocaleString()} (${share}%)`;
          }
        }
      }
    }
  }), []);

  if (loading && !dashboard?.reportingDate) {
    return (
      <div className="hr-loading">
        <strong>Loading HR Analytics…</strong>
        Fetching tenant-scoped workforce data.
      </div>
    );
  }

  return (
    <>
      <div className="hr-kpis">
        <Kpi
          icon={Users}
          label="Total Headcount"
          value={num(k.activeHeadcount)}
          meta={`${num(k.activeFte)} FTE`}
        />

        <Kpi
          icon={Banknote}
          label="Annual Labour Cost"
          value={money(k.labourCost, currency)}
          meta="FTE-adjusted base salary"
          color="#2d60ff"
          background="rgba(45,96,255,.10)"
        />

        <Kpi
          icon={TrendingUp}
          label="Annualised Turnover"
          value={pct(k.turnoverRate)}
          meta={k.turnoverStatus || 'Healthy'}
          color="#fe5c73"
          background="rgba(254,92,115,.12)"
        />

        <Kpi
          icon={Clock3}
          label="Average Tenure"
          value={`${Number(k.averageTenureYears || 0).toFixed(1)} yrs`}
          meta={`${num(k.hires)} hires · ${num(k.exits)} exits`}
          color="#0fb6a9"
          background="rgba(22,219,204,.14)"
        />
      </div>

      <div className="hr-grid-2">
        <div className="hr-stack">
          <Panel
            title="Headcount Trend"
            caption={`Active employees by month · ${settings.rollingAverageWindowMonths || 3}-month rolling average`}
          >
            <div className="hr-chart tall">
              <Line data={headcountData} options={chartBase} />
            </div>
          </Panel>

          <Panel
            title="Hires vs Exits"
            caption="Monthly movements across the reporting window"
          >
            <div className="hr-chart">
              <Bar
                data={hiresExitsData}
                options={{
                  ...chartBase,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: {
                        boxWidth: 9,
                        font: { size: 10 }
                      }
                    }
                  }
                }}
              />
            </div>
          </Panel>
        </div>

        <div className="hr-stack">
          <Panel
            title="Workforce by Department"
            caption="Current active headcount by department"
          >
            <div className="hr-chart">
              {departments.length > 0 ? (
                <Doughnut
                  data={departmentData}
                  options={departmentChartOptions}
                />
              ) : (
                <div
                  className="hr-empty"
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  No department data available.
                </div>
              )}
            </div>
          </Panel>

          <Panel
            title="Executive Snapshot"
            caption={`Reporting ${dashboard?.reportingMonth || ''}`}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10 }}>
              <div className="hr-card" style={{ boxShadow: 'none', padding: 12, background: '#f8fafc' }}>
                <div className="hr-kpi-label">Female workforce</div>
                <div className="hr-kpi-value" style={{ fontSize: 18 }}>{pct(k.femalePercentage)}</div>
              </div>

              <div className="hr-card" style={{ boxShadow: 'none', padding: 12, background: '#f8fafc' }}>
                <div className="hr-kpi-label">Open roles</div>
                <div className="hr-kpi-value" style={{ fontSize: 18 }}>{num(k.openRoles)}</div>
              </div>

              <div className="hr-card" style={{ boxShadow: 'none', padding: 12, background: '#f8fafc' }}>
                <div className="hr-kpi-label">Absence rate</div>
                <div className="hr-kpi-value" style={{ fontSize: 18 }}>{pct(k.absenceRate)}</div>
              </div>

              <div className="hr-card" style={{ boxShadow: 'none', padding: 12, background: '#f8fafc' }}>
                <div className="hr-kpi-label">Unplanned leave</div>
                <div className="hr-kpi-value" style={{ fontSize: 18 }}>{num(k.unplannedLeaveDays)}</div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 7 }}>
                Turnover status
              </div>

              <span className={`hr-status ${statusClass(k.turnoverStatus)}`}>
                {k.turnoverStatus || 'Healthy'}
              </span>

              <span style={{ marginLeft: 8, fontSize: 10.5, color: '#718ebf' }}>
                Healthy ≤ {settings.turnoverHealthyThreshold ?? 10}% · Watch ≤ {settings.turnoverWatchThreshold ?? 15}%
              </span>
            </div>
          </Panel>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="hr-section-title">Department Breakdown</div>
        <div className="hr-card" style={{ padding: 4 }}>
          <div className="hr-table-wrap">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th className="num">Headcount</th>
                  <th>Share</th>
                  <th className="num">Avg Salary</th>
                  <th className="num">Turnover</th>
                  <th className="num">Female</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {departments.length ? departments.map((d, i) => {
                  const share = k.activeHeadcount
                    ? (d.headcount / k.activeHeadcount) * 100
                    : 0;

                  return (
                    <tr key={d.name}>
                      <td>
                        <span
                          className="hr-dept-dot"
                          style={{ background: PALETTE[i % PALETTE.length] }}
                        />
                        {d.name}
                      </td>

                      <td className="num">{num(d.headcount)}</td>

                      <td>
                        <span className="hr-share-track">
                          <span
                            className="hr-share-fill"
                            style={{
                              width: `${Math.min(100, share)}%`,
                              background: PALETTE[i % PALETTE.length]
                            }}
                          />
                        </span>
                        {pct(share)}
                      </td>

                      <td className="num">{money(d.averageSalary, currency)}</td>
                      <td className="num">{pct(d.turnover)}</td>
                      <td className="num">{pct(d.femalePercentage)}</td>

                      <td>
                        <span className={`hr-status ${statusClass(d.turnoverStatus)}`}>
                          {d.turnoverStatus}
                        </span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="7" style={{ color: '#718ebf', padding: 16 }}>
                      No department data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
