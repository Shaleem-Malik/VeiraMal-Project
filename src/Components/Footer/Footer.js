/**
 * Footer
 */
import React from 'react';
import IntlMessages from 'Util/IntlMessages';
import AppConfig from 'Constants/AppConfig';

// Make sure Bootstrap Icons CSS is imported in your project.
// If not, add this line to your index.html or main CSS file:
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

const Footer = () => {
  const companyLocation = localStorage.getItem('companyLocation');

  return (
    <footer className="rct-footer d-flex justify-content-between align-items-center py-3 px-4 border-top">
      {/* Left side: location with icon */}
      <div className="d-flex align-items-center">
        {companyLocation ? (
          <>
            <i className="bi bi-geo-alt-fill me-2 text-primary" style={{ fontSize: '1.2rem' }}></i>
            <span className="fw-light">
              <IntlMessages id="footer.location" defaultMessage="Location" />: <strong>{companyLocation}</strong>
            </span>
          </>
        ) : (
          <span>&nbsp;</span> // keep space when no location
        )}
      </div>

      {/* Right side: copyright text with heart icon */}
      <h5 className="mb-0 d-flex align-items-center fw-normal">
        <i className="bi bi-c-circle me-1"></i> {AppConfig.copyRightText}
      </h5>
    </footer>
  );
};

export default Footer;