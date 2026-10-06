import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Redirect, Route, Switch, useLocation, useHistory } from 'react-router-dom';
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  ChevronDown,
  CloudUpload,
  Download,
  FileText,
  Layers3,
  RefreshCw,
  Search,
  Settings as SettingsIcon,
  Users,
  FileClock,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearHrEmployeeSearch,
  fetchHrDashboard,
  fetchHrSettings,
  importHrWorkbook,
  searchHrEmployees
} from 'Store/Actions/hrAnalyticsActions';
import Overview from './Overview';
import WorkforceDiversity from './WorkforceDiversity';
import AttritionRetention from './AttritionRetention';
import Settings from './Settings';
import ComingSoon from './ComingSoon';
import './hrAnalytics.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const TITLES = {
  overview: ['Overview', 'Executive workforce summary'],
  workforce: ['Workforce & Diversity', 'Composition, demographics and equity'],
  attrition: ['Attrition & Retention', 'Turnover patterns and attrition risk'],
  settings: ['Settings', 'Configure thresholds and calculation defaults'],
  placeholder: ['Module roadmap', 'Additional HR Analytix capability']
};

const MVP_TABS = [
  { key: 'overview', label: 'Overview', path: 'overview', icon: BarChart3 },
  { key: 'workforce', label: 'Workforce & Diversity', path: 'workforce-diversity', icon: Users },
  { key: 'attrition', label: 'Attrition & Retention', path: 'attrition-retention', icon: FileClock },
  { key: 'settings', label: 'Settings', path: 'settings', icon: SettingsIcon }
];

const ROADMAP_TABS = [
  ['Labour Cost', 'labour-cost'],
  ['Absenteeism', 'absenteeism'],
  ['Recruitment', 'recruitment'],
  ['Performance', 'performance'],
  ['Scenario Modelling', 'scenario-modelling'],
  ['Engagement', 'engagement'],
  ['Leave Liability', 'leave-liability']
];

const EXPORTABLE_REPORTS = [
  { route: 'overview', title: 'Overview', subtitle: 'Executive workforce summary' },
  { route: 'workforce-diversity', title: 'Workforce & Diversity', subtitle: 'Composition, demographics and equity' },
  { route: 'attrition-retention', title: 'Attrition & Retention', subtitle: 'Turnover patterns and attrition risk' }
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const waitForRender = async () => {
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  await wait(300);
};

const safeFileName = (value) => String(value || 'HR-Analytics')
  .replace(/[^a-z0-9]+/gi, '-')
  .replace(/^-|-$/g, '') || 'HR-Analytics';

const captureCanvasChunk = (sourceCanvas, startY, chunkHeight) => {
  const chunk = document.createElement('canvas');
  chunk.width = sourceCanvas.width;
  chunk.height = Math.max(1, Math.ceil(chunkHeight));
  const ctx = chunk.getContext('2d');
  ctx.fillStyle = '#f5f7fa';
  ctx.fillRect(0, 0, chunk.width, chunk.height);
  ctx.drawImage(
    sourceCanvas,
    0, startY, sourceCanvas.width, chunkHeight,
    0, 0, sourceCanvas.width, chunk.height
  );
  return chunk;
};

const todayString = () => new Date().toISOString().slice(0, 10);

const initials = (name) => String(name || '?')
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((x) => x[0])
  .join('')
  .toUpperCase();

export default function HrAnalyticsDashboard({ match }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const searchRef = useRef(null);
  const exportRef = useRef(null);
  const exportContentRef = useRef(null);

  const hr = useSelector((state) => state.hrAnalytics || {});
  const { dashboard, settings, loading, importing, searching, searchResults = [], error } = hr;

  const [asOfDate, setAsOfDate] = useState(todayString());
  const [searchText, setSearchText] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const pathKey = useMemo(() => {
    const base = match.url.replace(/\/$/, '');
    const suffix = location.pathname.replace(base, '').replace(/^\//, '');
    if (suffix === 'overview' || suffix === 'workforce-diversity' || suffix === 'attrition-retention' || suffix === 'settings') {
      return suffix;
    }
    return suffix ? 'placeholder' : 'overview';
  }, [location.pathname, match.url]);

  const currentTitle = pathKey === 'workforce-diversity'
    ? TITLES.workforce
    : pathKey === 'attrition-retention'
      ? TITLES.attrition
      : pathKey === 'settings'
        ? TITLES.settings
        : pathKey === 'placeholder'
          ? TITLES.placeholder
          : TITLES.overview;

  useEffect(() => {
    dispatch(fetchHrDashboard(asOfDate)).catch(() => {});
  }, [dispatch, asOfDate]);

  useEffect(() => {
    dispatch(fetchHrSettings()).catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText.trim().length >= 2) {
        dispatch(searchHrEmployees(searchText)).then(() => setSearchOpen(true));
      } else {
        dispatch(clearHrEmployeeSearch());
        setSearchOpen(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, searchText]);

  useEffect(() => {
    const handleClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) setExportOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setExportOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      await dispatch(importHrWorkbook(file));
      await dispatch(fetchHrDashboard(asOfDate));
    } catch (_) {
      // notification is already handled by the thunk
    }
  };

  const handleRefresh = () => dispatch(fetchHrDashboard(asOfDate)).catch(() => {});

  const handleResultClick = (employee) => {
    setSearchText(employee?.name || employee?.employeeId || '');
    setSearchOpen(false);
    history.push(`${match.url}/attrition-retention`);
  };

  const captureReportCanvas = async (route) => {
    const base = match.url.replace(/\/$/, '');
    const currentRoute = location.pathname.replace(base, '').replace(/^\//, '') || 'overview';
    if (currentRoute !== route) {
      history.push(`${base}/${route}`);
    }
    await waitForRender();

    const element = exportContentRef.current;
    if (!element) throw new Error('Report content is not available for export.');

    return html2canvas(element, {
      backgroundColor: '#f5f7fa',
      scale: Math.min(2, window.devicePixelRatio || 1),
      useCORS: true,
      logging: false,
      imageTimeout: 15000
    });
  };

  const addCanvasToPdf = (pdf, canvas, report, pageState) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 24;
    const headerHeight = 34;
    const footerHeight = 18;
    const contentWidth = pageWidth - (margin * 2);
    const scale = contentWidth / canvas.width;
    const firstContentHeight = Math.max(1, pageHeight - (margin * 2) - headerHeight - footerHeight);
    const normalContentHeight = Math.max(1, pageHeight - (margin * 2) - footerHeight);
    let offsetY = 0;
    let first = true;

    while (offsetY < canvas.height) {
      if (pageState.hasPage) pdf.addPage();
      pageState.hasPage = true;
      pageState.pageNumber += 1;

      const availablePdfHeight = first ? firstContentHeight : normalContentHeight;
      const maxChunkPixels = availablePdfHeight / scale;
      const chunkHeight = Math.min(maxChunkPixels, canvas.height - offsetY);
      const chunk = captureCanvasChunk(canvas, offsetY, chunkHeight);
      const imageHeight = chunk.height * scale;
      const imageY = first ? margin + headerHeight : margin;

      pdf.setFillColor(245, 247, 250);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      if (first) {
        pdf.setTextColor(24, 20, 243);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(17);
        pdf.text(report.title, margin, margin + 13);
        pdf.setTextColor(113, 142, 191);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8.5);
        pdf.text(`${report.subtitle}  •  ${asOfDate}`, margin, margin + 26);
      }

      pdf.addImage(chunk.toDataURL('image/jpeg', 0.92), 'JPEG', margin, imageY, contentWidth, imageHeight, undefined, 'FAST');
      pdf.setTextColor(174, 185, 212);
      pdf.setFontSize(7.5);
      pdf.text('VeiraMal HR Analytix', margin, pageHeight - 8);
      pdf.text(`Page ${pageState.pageNumber}`, pageWidth - margin, pageHeight - 8, { align: 'right' });

      offsetY += chunkHeight;
      first = false;
    }
  };

  const exportPdf = async (allReports) => {
    setExportOpen(false);
    setExportError('');
    setExporting(true);
    const startPath = location.pathname;

    try {
      const currentRoute = location.pathname.replace(match.url, '').replace(/^\//, '') || 'overview';
      const currentReport = {
        overview: EXPORTABLE_REPORTS[0],
        'workforce-diversity': EXPORTABLE_REPORTS[1],
        'attrition-retention': EXPORTABLE_REPORTS[2],
        settings: { route: 'settings', title: 'Settings', subtitle: 'Analytics configuration and calculation defaults' }
      }[currentRoute] || { route: currentRoute, title: currentTitle[0], subtitle: currentTitle[1] };
      const reports = allReports ? EXPORTABLE_REPORTS : [currentReport];

      const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4', compress: true });
      const pageState = { hasPage: false, pageNumber: 0 };

      for (const report of reports) {
        const canvas = await captureReportCanvas(report.route);
        addCanvasToPdf(pdf, canvas, report, pageState);
      }

      const suffix = allReports ? 'All-Reports' : safeFileName(reports[0].title);
      pdf.save(`VeiraMal-HR-Analytix-${suffix}-${todayString()}.pdf`);
    } catch (err) {
      console.error('HR Analytics PDF export failed', err);
      setExportError('PDF export failed. Please try again.');
    } finally {
      history.push(startPath);
      setExporting(false);
    }
  };

  const addCanvasToPptx = (pptx, canvas, report, slideState) => {
    const slideWidth = 13.333;
    const slideHeight = 7.5;
    const margin = 0.35;
    const headerHeight = 0.72;
    const footerHeight = 0.22;
    const contentWidth = slideWidth - (margin * 2);
    const contentHeight = slideHeight - margin - headerHeight - footerHeight;
    const scale = contentWidth / canvas.width;
    const maxChunkPixels = contentHeight / scale;
    let offsetY = 0;
    let first = true;

    while (offsetY < canvas.height) {
      const chunkHeight = Math.min(maxChunkPixels, canvas.height - offsetY);
      const chunk = captureCanvasChunk(canvas, offsetY, chunkHeight);
      const imageHeight = chunk.height * scale;
      const slide = pptx.addSlide();
      slide.background = { color: 'F5F7FA' };
      slideState.number += 1;

      slide.addText(first ? report.title : `${report.title} — continued`, {
        x: margin, y: 0.18, w: 9.5, h: 0.3, fontSize: 18, bold: true,
        color: '1814F3', fontFace: 'Arial', margin: 0
      });
      slide.addText(`${report.subtitle}  •  ${asOfDate}`, {
        x: margin, y: 0.5, w: 11.8, h: 0.2, fontSize: 8.5,
        color: '718EBF', fontFace: 'Arial', margin: 0
      });
      slide.addImage({
        data: chunk.toDataURL('image/jpeg', 0.92),
        x: margin, y: margin + headerHeight - 0.08,
        w: contentWidth, h: imageHeight
      });
      slide.addText('VeiraMal HR Analytix', {
        x: margin, y: slideHeight - 0.17, w: 2.2, h: 0.1,
        fontSize: 6.5, color: 'AEB9D4', fontFace: 'Arial', margin: 0
      });
      slide.addText(`Slide ${slideState.number}`, {
        x: 11.5, y: slideHeight - 0.17, w: 1.45, h: 0.1,
        fontSize: 6.5, color: 'AEB9D4', fontFace: 'Arial', margin: 0, align: 'right'
      });

      offsetY += chunkHeight;
      first = false;
    }
  };

  const exportPptx = async (allReports) => {
    setExportOpen(false);
    setExportError('');
    setExporting(true);
    const startPath = location.pathname;

    try {
      const PptxGenJS = window.PptxGenJS;
      if (!PptxGenJS) throw new Error('PowerPoint export library is not loaded.');

      const currentRoute = location.pathname.replace(match.url, '').replace(/^\//, '') || 'overview';
      const currentReport = {
        overview: EXPORTABLE_REPORTS[0],
        'workforce-diversity': EXPORTABLE_REPORTS[1],
        'attrition-retention': EXPORTABLE_REPORTS[2],
        settings: { route: 'settings', title: 'Settings', subtitle: 'Analytics configuration and calculation defaults' }
      }[currentRoute] || { route: currentRoute, title: currentTitle[0], subtitle: currentTitle[1] };
      const reports = allReports ? EXPORTABLE_REPORTS : [currentReport];

      const pptx = new PptxGenJS();
      pptx.defineLayout({ name: 'HR_ANALYTIX_WIDE', width: 13.333, height: 7.5 });
      pptx.layout = 'HR_ANALYTIX_WIDE';
      pptx.author = 'VeiraMal HR Analytix';
      pptx.company = 'VeiraMal';
      pptx.subject = 'HR Analytics report';
      pptx.title = allReports ? 'VeiraMal HR Analytix — All Reports' : `VeiraMal HR Analytix — ${reports[0].title}`;
      pptx.lang = 'en-US';

      const slideState = { number: 0 };
      for (const report of reports) {
        const canvas = await captureReportCanvas(report.route);
        addCanvasToPptx(pptx, canvas, report, slideState);
      }

      const suffix = allReports ? 'All-Reports' : safeFileName(reports[0].title);
      await pptx.writeFile({ fileName: `VeiraMal-HR-Analytix-${suffix}-${todayString()}.pptx` });
    } catch (err) {
      console.error('HR Analytics PowerPoint export failed', err);
      setExportError('PowerPoint export failed. Please make sure your browser allows downloads and try again.');
    } finally {
      history.push(startPath);
      setExporting(false);
    }
  };

  const targetDashboard = dashboard || {
    reportingDate: asOfDate,
    reportingMonth: '',
    settings,
    kpis: {},
    headcountTrend: [],
    hiresVsExits: [],
    departments: [],
    diversity: {},
    labourCost: {},
    attrition: {},
    absenteeism: {},
    recentActivity: [],
    riskWatchlist: []
  };

  return (
    <div className="hr-analytics-root">
      <div className="hr-analytics-topbar">
        <div>
          <h1>{currentTitle[0]}</h1>
          <div className="hr-analytics-sub">{currentTitle[1]}</div>
        </div>

        <div className="hr-analytics-actions">
          {/* <div className="hr-analytics-search" ref={searchRef}>
            <Search className="hr-analytics-search-icon" />
            <input
              value={searchText}
              placeholder="Search employees..."
              autoComplete="off"
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => searchText.trim().length >= 2 && setSearchOpen(true)}
              aria-label="Search employees"
            />
            {searchOpen && searchText.trim().length >= 2 && (
              <div className="hr-analytics-search-results">
                {searching ? (
                  <div className="hr-empty" style={{ padding: '20px 12px', border: 0, boxShadow: 'none' }}>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((employee) => (
                    <button
                      type="button"
                      className="hr-analytics-search-result"
                      key={`${employee.employeeId}-${employee.name}`}
                      onClick={() => handleResultClick(employee)}
                    >
                      <span className="hr-analytics-search-avatar">{initials(employee.name)}</span>
                      <span style={{ minWidth: 0 }}>
                        <span className="hr-analytics-search-name">{employee.name}</span>
                        <span className="hr-analytics-search-meta">
                          {employee.department || 'Unassigned'}{employee.position ? ` · ${employee.position}` : ''}
                        </span>
                      </span>
                      <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#718ebf' }} />
                    </button>
                  ))
                ) : (
                  <div className="hr-empty" style={{ padding: '20px 12px', border: 0, boxShadow: 'none' }}>
                    No employees found.
                  </div>
                )}
              </div>
            )}
          </div> */}

          {/* <div className="hr-analytics-date">
            <CalendarDays size={14} color="#718ebf" />
            <label htmlFor="hr-as-of">As of</label>
            <input id="hr-as-of" type="date" value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} />
          </div> */}

          <button type="button" className="hr-analytics-btn secondary" onClick={handleRefresh} disabled={loading || exporting}>
            <RefreshCw className={loading ? 'hr-spin' : ''} size={15} />
            Refresh
          </button>

          <div className={`hr-export-menu ${exportOpen ? 'open' : ''}`} ref={exportRef}>
            <button
              type="button"
              className="hr-analytics-btn secondary hr-export-toggle"
              onClick={() => !exporting && setExportOpen((open) => !open)}
              disabled={exporting}
              aria-haspopup="menu"
              aria-expanded={exportOpen}
              title="Export report"
            >
              <Download size={15} />
              {exporting ? 'Exporting...' : 'Export'}
              <ChevronDown className="hr-export-chevron" size={14} />
            </button>

            {exportOpen && (
              <div className="hr-export-dropdown" role="menu">
                <div className="hr-export-group-label">This View</div>
                <button type="button" className="hr-export-option" onClick={() => exportPdf(false)} disabled={exporting}>
                  <FileText size={15} />
                  <span>Download as Pdf</span>
                </button>
                <button type="button" className="hr-export-option" onClick={() => exportPptx(false)} disabled={exporting}>
                  <Layers3 size={15} />
                  <span>Download as PowerPoint</span>
                </button>

                <div className="hr-export-divider" />
                <div className="hr-export-group-label">All Reports</div>
                <button type="button" className="hr-export-option" onClick={() => exportPdf(true)} disabled={exporting}>
                  <FileText size={15} />
                  <span>Download all as PDF</span>
                </button>
                <button type="button" className="hr-export-option" onClick={() => exportPptx(true)} disabled={exporting}>
                  <Layers3 size={15} />
                  <span>Download all as PowerPoint</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="hr-analytics-btn primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
          >
            <CloudUpload size={15} />
            {importing ? 'Importing...' : 'Upload data'}
          </button>
          <input ref={fileInputRef} type="file" accept=".xlsx" style={{ display: 'none' }} onChange={handleUpload} />
          {exportError && <span className="hr-export-status" role="alert">{exportError}</span>}
        </div>
      </div>

      <div className="hr-analytics-nav">
        {MVP_TABS.map(({ key, label, path, icon: Icon }) => (
          <Link
            key={key}
            className={`hr-analytics-tab ${pathKey === key || (key === 'workforce' && pathKey === 'workforce-diversity') || (key === 'attrition' && pathKey === 'attrition-retention') ? 'active' : ''}`}
            to={`${match.url}/${path}`}
          >
            <Icon />
            {label}
          </Link>
        ))}
        {ROADMAP_TABS.map(([label, path]) => (
          <Link key={path} className={`hr-analytics-tab placeholder ${pathKey === 'placeholder' && location.pathname.endsWith(`/${path}`) ? 'active' : ''}`} to={`${match.url}/${path}`}>
            <BriefcaseBusiness />
            {label}
          </Link>
        ))}
      </div>

      {error && !dashboard && (
        <div className="hr-error" style={{ marginBottom: 16 }}>
          <strong style={{ display: 'block', color: '#e23c56', marginBottom: 6 }}>Unable to load HR Analytics</strong>
          {error}
        </div>
      )}

      <div ref={exportContentRef} className="hr-analytics-export-content">
        <Switch>
          <Redirect exact from={match.url} to={`${match.url}/overview`} />
          <Route path={`${match.url}/overview`} render={() => <Overview dashboard={targetDashboard} loading={loading} />} />
          <Route path={`${match.url}/workforce-diversity`} render={() => <WorkforceDiversity dashboard={targetDashboard} loading={loading} />} />
          <Route path={`${match.url}/attrition-retention`} render={() => <AttritionRetention dashboard={targetDashboard} loading={loading} />} />
          <Route path={`${match.url}/settings`} render={() => <Settings dashboard={targetDashboard} settings={settings || targetDashboard.settings} />} />
          <Route
            path={`${match.url}/:module`}
            render={({ match: placeholderMatch }) => <ComingSoon moduleName={placeholderMatch.params.module} />}
          />
        </Switch>
      </div>
    </div>
  );
}
