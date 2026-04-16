/**
 * Reactify Sidebar (with company logo & name)
 * - Fetches company details on mount if missing (prevents "No logo" after refresh)
 * - Robust absolute URL construction + cache-busting
 * - Clean fallback avatar on error
 */
import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

// Material-UI components
import { Button, Avatar, Typography } from '@material-ui/core';
import { TrendingUp } from '@material-ui/icons';

// redux actions
import { collapsedSidebarAction } from 'Store/Actions';
import { fetchCompanyDetails } from 'Store/Actions/companyActions'; // <- ensure this path is correct

// components
import UserBlock from './UserBlock';
import SidebarContent from './SidebarContent';
import AgencySidebar from '../AgencyMenu/AgencySidebar';

const API_BASE_CFG = (process.env.REACT_APP_API_BASE || 'http://localhost:5228').replace(/\/$/, '');

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1200,
      windowHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
      logoLoadFailed: false
    };
  }

  UNSAFE_componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);

    // 🛠 FIX: fetch company details if not already present (so logo is available after refresh)
    if (!this.props.company) {
      // fetchCompanyDetails will populate Redux company state used by Sidebar
      try {
        this.props.fetchCompanyDetails();
      } catch (err) {
        // swallow — fetchCompanyDetails handles notifications
        console.warn('fetchCompanyDetails threw', err);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { windowWidth } = this.state;
    if (nextProps.location !== this.props.location) {
      if (windowWidth <= 1199) {
        this.props.collapsedSidebarAction(false);
      }
    }
  }

  updateDimensions = () => {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
  }

  // Build an absolute URL for the logo (prefer same-origin origin if possible)
  buildLogoUrl(rawLogo) {
    if (!rawLogo) return null;

    // already absolute?
    if (/^https?:\/\//i.test(rawLogo)) return rawLogo;

    // If rawLogo starts with '/', prefer window.location.origin (works for same-host setups)
    try {
      const origin = window?.location?.origin || API_BASE_CFG;
      // If API_BASE_CFG is same origin use origin, otherwise prefer API_BASE_CFG
      const useBase = API_BASE_CFG.startsWith(origin) ? origin : API_BASE_CFG;
      const prefix = rawLogo.startsWith('/') ? '' : '/';
      return `${useBase}${prefix}${rawLogo}`;
    } catch (err) {
      // fallback
      return `${API_BASE_CFG}${rawLogo.startsWith('/') ? '' : '/'}${rawLogo}`;
    }
  }

  renderLogoBlock = () => {
    const { company } = this.props;
    const { logoLoadFailed } = this.state;

    const rawLogo = company && (company.logoUrl || company.LogoUrl) ? (company.logoUrl || company.LogoUrl) : null;
    const companyName = company && (company.companyName || company.CompanyName) ? (company.companyName || company.CompanyName) : 'HR Analytix';

    const logoAbsoluteUrl = rawLogo ? this.buildLogoUrl(rawLogo) : null;

    // cache-buster: prefer updatedAt, UpdatedAt, or CreatedAt if available
    const stamp = company?.updatedAt ?? company?.UpdatedAt ?? company?.createdAt ?? company?.CreatedAt ?? null;
    const cacheSuffix = stamp ? `?v=${new Date(stamp).getTime()}` : '';

    // initials fallback
    const initials = companyName.split(/\s+/).slice(0,2).map(s => s[0]?.toUpperCase() || '').join('');

    return (
      <div
        className="site-logo"
        style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '10px 12px' }}
        onClick={() => this.props.history.push('/app/company/details')}
        title={companyName}
      >
        {logoAbsoluteUrl && !logoLoadFailed ? (
          <img
            src={logoAbsoluteUrl + cacheSuffix}
            className="mr-15 ml-15"
            alt={`${companyName} logo`}
            width="50"
            height="50"
            style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)' }}
            onError={(e) => {
              // mark failed so we don't keep trying to show broken image
              this.setState({ logoLoadFailed: true });
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <Avatar
            className="fallback-avatar"
            style={{ width: 40, height: 40, background: '#e6eef8', color: '#0f172a', fontWeight: 700 }}
          >
            {initials || 'HA'}
          </Avatar>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <Typography variant="subtitle1" style={{ fontWeight: 700, color: '#f8f8f8' }}>
            {companyName}
          </Typography>
          <Typography variant="caption" style={{ color: '#f8f8f8' }}>
            {company && company.isSubcompany ? 'Sub Company' : 'Company'}
          </Typography>
        </div>
      </div>
    );
  }

  render() {
    const { enableSidebarBackgroundImage, selectedSidebarImage, isDarkSidenav, agencySidebar } = this.props;

    return (
      <Fragment>
        <div
          className={classNames('rct-sidebar', { 'background-none': !enableSidebarBackgroundImage })}
          style={{ backgroundImage: enableSidebarBackgroundImage ? `url(${selectedSidebarImage})` : 'none' }}
        >
          <div className={classNames("rct-sidebar-content", { "sidebar-overlay-dark": isDarkSidenav, 'sidebar-overlay-light': !isDarkSidenav })}>
            {this.renderLogoBlock()}

            <div className="rct-sidebar-wrap">
              <Scrollbars
                className="rct-scroll"
                autoHide
                autoHideDuration={100}
                style={{ height: 'calc(100vh - 140px)' }}
              >
                <UserBlock />
                {!agencySidebar ? <SidebarContent /> : <AgencySidebar />}
              </Scrollbars>

              <div className="sidebar-footer p-3 border-top">
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<TrendingUp />}
                  onClick={() => console.log('Upgrade Plan clicked')}
                  className="upgrade-plan-btn"
                  style={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontWeight: '600',
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
                  }}
                >
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

// map state to props
const mapStateToProps = ({ settings, company }) => {
  const { enableSidebarBackgroundImage, selectedSidebarImage, collapsedSidebar, isDarkSidenav, locale } = settings;
  return {
    enableSidebarBackgroundImage,
    selectedSidebarImage,
    collapsedSidebar,
    isDarkSidenav,
    locale,
    company: (company && company.company) ? company.company : null
  };
};

export default withRouter(connect(mapStateToProps, {
  collapsedSidebarAction,
  fetchCompanyDetails
})(Sidebar));