import React, { useEffect, useMemo, useState } from 'react';
import { Save, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHrDashboard, updateHrSettings } from 'Store/Actions/hrAnalyticsActions';

const DEFAULTS = {
  turnoverHealthyThreshold: 10,
  turnoverWatchThreshold: 15,
  absenceHealthyThreshold: 2.5,
  absenceWatchThreshold: 4.5,
  workingDaysPerYear: 260,
  rollingAverageWindowMonths: 3,
  currency: 'USD',
  requisitionAgeDays: 45
};

const CURRENCIES = ['AUD', 'USD', 'GBP', 'NZD', 'CAD', 'EUR', 'SGD'];

export default function Settings({ settings: incomingSettings, dashboard }) {
  const dispatch = useDispatch();
  const saving = useSelector((state) => state.hrAnalytics?.savingSettings);
  const [form, setForm] = useState(DEFAULTS);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (incomingSettings) {
      setForm({
        turnoverHealthyThreshold: Number(incomingSettings.turnoverHealthyThreshold ?? DEFAULTS.turnoverHealthyThreshold),
        turnoverWatchThreshold: Number(incomingSettings.turnoverWatchThreshold ?? DEFAULTS.turnoverWatchThreshold),
        absenceHealthyThreshold: Number(incomingSettings.absenceHealthyThreshold ?? DEFAULTS.absenceHealthyThreshold),
        absenceWatchThreshold: Number(incomingSettings.absenceWatchThreshold ?? DEFAULTS.absenceWatchThreshold),
        workingDaysPerYear: Number(incomingSettings.workingDaysPerYear ?? DEFAULTS.workingDaysPerYear),
        rollingAverageWindowMonths: Number(incomingSettings.rollingAverageWindowMonths ?? DEFAULTS.rollingAverageWindowMonths),
        currency: incomingSettings.currency || DEFAULTS.currency,
        requisitionAgeDays: Number(incomingSettings.requisitionAgeDays ?? DEFAULTS.requisitionAgeDays)
      });
      setDirty(false);
    }
  }, [incomingSettings]);

  const errors = useMemo(() => {
    const next = {};
    if (form.turnoverWatchThreshold < form.turnoverHealthyThreshold) next.turnover = 'Watch threshold must be greater than or equal to Healthy threshold.';
    if (form.absenceWatchThreshold < form.absenceHealthyThreshold) next.absence = 'Watch threshold must be greater than or equal to Healthy threshold.';
    if (form.workingDaysPerYear < 1 || form.workingDaysPerYear > 366) next.workingDaysPerYear = 'Enter a value from 1 to 366.';
    if (form.rollingAverageWindowMonths < 1 || form.rollingAverageWindowMonths > 12) next.rolling = 'Enter a value from 1 to 12.';
    if (!/^[A-Za-z]{3}$/.test(form.currency || '')) next.currency = 'Use a 3-letter currency code.';
    if (form.requisitionAgeDays < 1 || form.requisitionAgeDays > 3650) next.req = 'Enter a value from 1 to 3650 days.';
    return next;
  }, [form]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const save = async () => {
    if (Object.keys(errors).length) return;
    try {
      await dispatch(updateHrSettings({ ...form, currency: String(form.currency || '').trim().toUpperCase() }));
      if (dashboard?.reportingDate) await dispatch(fetchHrDashboard(String(dashboard.reportingDate).slice(0, 10)));
      setDirty(false);
    } catch (_) {
      // notification is handled by the thunk
    }
  };

  return (
    <div className="hr-settings-grid">
      <div className="hr-card">
        <div className="hr-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><SettingsIcon size={17} color="#2d60ff" /> Analytics configuration</div>
        <div className="hr-card-caption">These values are saved to the selected company and are used by the HR Analytics dashboard.</div>

        <div className="hr-form-grid">
          <div className="hr-field"><label>Turnover Healthy threshold (%)</label><input type="number" min="0" max="100" step="0.1" value={form.turnoverHealthyThreshold} onChange={(e) => update('turnoverHealthyThreshold', Number(e.target.value))} /><small>Rates at or below this value are shown as Healthy.</small></div>
          <div className="hr-field"><label>Turnover Watch threshold (%)</label><input type="number" min="0" max="100" step="0.1" value={form.turnoverWatchThreshold} onChange={(e) => update('turnoverWatchThreshold', Number(e.target.value))} /><small>Rates above Healthy and at or below this value are Watch.</small>{errors.turnover && <small style={{ color: '#e23c56' }}>{errors.turnover}</small>}</div>
          <div className="hr-field"><label>Absence Healthy threshold (%)</label><input type="number" min="0" max="100" step="0.1" value={form.absenceHealthyThreshold} onChange={(e) => update('absenceHealthyThreshold', Number(e.target.value))} /><small>Used for absence status indicators.</small></div>
          <div className="hr-field"><label>Absence Watch threshold (%)</label><input type="number" min="0" max="100" step="0.1" value={form.absenceWatchThreshold} onChange={(e) => update('absenceWatchThreshold', Number(e.target.value))} /><small>Rates above Healthy and at or below this value are Watch.</small>{errors.absence && <small style={{ color: '#e23c56' }}>{errors.absence}</small>}</div>
          <div className="hr-field"><label>Working days per year</label><input type="number" min="1" max="366" step="1" value={form.workingDaysPerYear} onChange={(e) => update('workingDaysPerYear', Number(e.target.value))} /><small>Used in absence-rate calculations.</small>{errors.workingDaysPerYear && <small style={{ color: '#e23c56' }}>{errors.workingDaysPerYear}</small>}</div>
          <div className="hr-field"><label>Rolling average window (months)</label><input type="number" min="1" max="12" step="1" value={form.rollingAverageWindowMonths} onChange={(e) => update('rollingAverageWindowMonths', Number(e.target.value))} /><small>Used for the headcount trend.</small>{errors.rolling && <small style={{ color: '#e23c56' }}>{errors.rolling}</small>}</div>
          <div className="hr-field"><label>Currency</label><select value={form.currency} onChange={(e) => update('currency', e.target.value)}>{CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}</select><small>3-letter ISO currency code used for monetary KPIs.</small>{errors.currency && <small style={{ color: '#e23c56' }}>{errors.currency}</small>}</div>
          <div className="hr-field"><label>Requisition ageing (days)</label><input type="number" min="1" max="3650" step="1" value={form.requisitionAgeDays} onChange={(e) => update('requisitionAgeDays', Number(e.target.value))} /><small>Roadmap setting ready for Recruitment when that module is enabled.</small>{errors.req && <small style={{ color: '#e23c56' }}>{errors.req}</small>}</div>
        </div>

        <div className="hr-settings-actions">
          <button type="button" className="hr-analytics-btn primary" disabled={saving || !dirty || Object.keys(errors).length > 0} onClick={save}>
            <Save size={15} />
            {saving ? 'Saving...' : 'Save settings'}
          </button>
        </div>
      </div>

      <div className="hr-stack">
        <div className="hr-card">
          <div className="hr-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ShieldCheck size={17} color="#16a37f" /> Tenant-scoped configuration</div>
          <div className="hr-card-caption">Settings are stored against the company context resolved from your authenticated session.</div>
          <div className="hr-settings-note">
            <strong>Data isolation</strong>
            The settings endpoint uses the same company/subcompany resolver as the dashboard and import endpoints. The React client does not send or store another company's settings.
          </div>
        </div>

        <div className="hr-card">
          <div className="hr-card-title">Current defaults</div>
          <div className="hr-card-caption">The prototype defaults supplied for the MVP are retained until changed.</div>
          <div className="hr-table-wrap">
            <table className="hr-table">
              <tbody>
                <tr><td>Turnover Healthy</td><td className="num">10%</td></tr>
                <tr><td>Turnover Watch</td><td className="num">15%</td></tr>
                <tr><td>Absence Healthy</td><td className="num">2.5%</td></tr>
                <tr><td>Absence Watch</td><td className="num">4.5%</td></tr>
                <tr><td>Working days/year</td><td className="num">260</td></tr>
                <tr><td>Rolling average</td><td className="num">3 months</td></tr>
                <tr><td>Currency</td><td className="num">USD</td></tr>
                <tr><td>Requisition ageing</td><td className="num">45 days</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
