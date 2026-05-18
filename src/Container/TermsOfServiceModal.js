import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Box,
  Button
} from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';

export default function TermsOfServiceModal({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="terms-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="terms-dialog-title">
        <Box display="flex" alignItems="center">
          <DescriptionIcon color="primary" style={{ marginRight: 8 }} />
          <Typography variant="h5" component="span">
            Terms of Service
          </Typography>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          <strong>Provider:</strong> VeiraMal Consulting Pty Ltd / HR Analytx
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Effective Date:</strong> 26 March 2026
        </Typography>

        <Typography variant="body2" paragraph>
          These Terms govern access to and use of the HR Analytx platform (“Platform”), including all dashboards, analytics outputs, integrations and associated services. By using the Platform, you agree to these Terms and all applicable Australian laws.
        </Typography>

        <Typography variant="h6" gutterBottom>
          1. Overview
        </Typography>
        <Typography variant="body2" paragraph>
          These Terms govern access to and use of the HR Analytx platform (“Platform”), including all dashboards, analytics outputs, integrations and associated services.
        </Typography>
        <Typography variant="body2" paragraph>
          By using the Platform, you agree to these Terms and all applicable Australian laws.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. Platform Purpose
        </Typography>
        <Typography variant="body2" paragraph>
          HR Analytx provides workforce analytics and reporting, data aggregation across HRIS, payroll and related systems, and decision-support insights.
        </Typography>
        <Typography variant="body2" paragraph>
          It is not a payroll engine, a legal or industrial relations advisory tool, or a substitute for human review or compliance validation.
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Acceptable Use
        </Typography>
        <Typography variant="body2" paragraph>
          You must not reverse engineer or replicate the Platform, use it unlawfully or to breach employment/privacy laws, upload data you are not authorised to use, or interfere with system integrity.
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. Data &amp; Privacy
        </Typography>
        <Typography variant="body2" paragraph>
          You retain ownership of all Customer Data. You are responsible for data accuracy, your legal right to use and share employee data, and compliance with the Privacy Act 1988 (Cth).
        </Typography>
        <Typography variant="body2" paragraph>
          VeiraMal processes data solely to deliver the Platform.
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Intellectual Property
        </Typography>
        <Typography variant="body2" paragraph>
          All Platform IP remains with VeiraMal. You receive a limited licence for internal business use only.
        </Typography>

        <Typography variant="h6" gutterBottom>
          6. Platform Outputs
        </Typography>
        <Typography variant="body2" paragraph>
          Outputs are dependent on input data, may include assumptions and modelling, and require validation before action. All decisions remain your responsibility.
        </Typography>

        <Typography variant="h6" gutterBottom>
          7. Fees
        </Typography>
        <Typography variant="body2" paragraph>
          Fees are governed by your proposal or Statement of Work. Non-payment may result in suspension.
        </Typography>

        <Typography variant="h6" gutterBottom>
          8. Liability
        </Typography>
        <Typography variant="body2" paragraph>
          To the maximum extent permitted by law, the Platform is provided “as is”, liability is capped at fees paid in the prior 6 months, and there is no liability for indirect or consequential loss.
        </Typography>

        <Typography variant="h6" gutterBottom>
          9. Termination
        </Typography>
        <Typography variant="body2" paragraph>
          Either party may terminate per agreement. Access ceases upon termination.
        </Typography>

        <Typography variant="h6" gutterBottom>
          10. Governing Law
        </Typography>
        <Typography variant="body2" paragraph>
          Victoria, Australia.
        </Typography>

        <Divider style={{ margin: '24px 0' }} />

        <Typography variant="h5" gutterBottom>
          Schedule 1 – Data Processing &amp; Privacy (DPA)
        </Typography>

        <Typography variant="h6" gutterBottom>
          1. Roles
        </Typography>
        <Typography variant="body2" paragraph>
          You are the Data Controller. VeiraMal is the Data Processor.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. Processing Scope
        </Typography>
        <Typography variant="body2" paragraph>
          We process employee data, workforce metrics, and organisational data only for analytics, reporting, and Platform functionality.
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Compliance
        </Typography>
        <Typography variant="body2" paragraph>
          Both parties must comply with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. Data Security
        </Typography>
        <Typography variant="body2" paragraph>
          We implement encryption in transit and at rest, role-based access controls, secure hosting environments, and audit logging where applicable.
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Data Breach
        </Typography>
        <Typography variant="body2" paragraph>
          If a breach occurs, we will notify you promptly, provide details of impact, and support remediation.
        </Typography>

        <Typography variant="h6" gutterBottom>
          6. Sub-processors
        </Typography>
        <Typography variant="body2" paragraph>
          We may use third-party providers such as hosting and integrations. We remain responsible for their compliance.
        </Typography>

        <Typography variant="h6" gutterBottom>
          7. Data Retention &amp; Deletion
        </Typography>
        <Typography variant="body2" paragraph>
          Upon termination, data is retained for 30–90 days unless otherwise agreed, then securely deleted.
        </Typography>

        <Typography variant="h6" gutterBottom>
          8. Cross-Border Data
        </Typography>
        <Typography variant="body2" paragraph>
          If data leaves Australia, appropriate safeguards will be implemented and you consent to such transfers where required.
        </Typography>

        <Divider style={{ margin: '24px 0' }} />

        <Typography variant="h5" gutterBottom>
          Schedule 2 – Service Levels (SLA)
        </Typography>

        <Typography variant="body2" paragraph>
          Target uptime is 99.5% monthly, excluding scheduled maintenance and third-party outages.
        </Typography>

        <Typography variant="body2" paragraph>
          Support response times: Critical 4 hours, High 1 business day, Medium 2 business days, Low 3–5 business days.
        </Typography>

        <Typography variant="body2" paragraph>
          Maintenance will be scheduled outside business hours where possible and notice will be provided in advance.
        </Typography>

        <Typography variant="body2" paragraph>
          We will investigate incidents promptly, provide updates, and resolve within a reasonable timeframe.
        </Typography>

        <Divider style={{ margin: '24px 0' }} />

        <Typography variant="h5" gutterBottom>
          Schedule 3 – Security Measures
        </Typography>

        <Typography variant="body2" paragraph>
          We use secure cloud hosting, firewalls, intrusion protection, role-based permissions, least privilege access, authentication controls, encryption, secure APIs, staff confidentiality obligations, restricted access, backups, and disaster recovery processes.
        </Typography>

        <Divider style={{ margin: '24px 0' }} />

        <Typography variant="h5" gutterBottom>
          Schedule 4 – Advisory &amp; Analytics Disclaimer
        </Typography>

        <Typography variant="body2" paragraph>
          HR Analytx provides analytical insights only and does not make decisions on your behalf.
        </Typography>
        <Typography variant="body2" paragraph>
          Outputs are not legal advice, not payroll compliance determinations, and do not replace award or EBA interpretation.
        </Typography>
        <Typography variant="body2" paragraph>
          All outputs rely on data accuracy, system configuration, and assumptions applied. You must validate outputs before action and confirm compliance independently.
        </Typography>
        <Typography variant="body2" paragraph>
          Where VeiraMal provides advisory services, those are governed by separate agreements and Platform use does not create advisory liability.
        </Typography>

        <Divider style={{ margin: '24px 0' }} />

        <Typography variant="h5" gutterBottom>
          Schedule 5 – Commercial Model
        </Typography>

        <Typography variant="body2" paragraph>
          The Platform is licensed per organisation, using user-based or data-based pricing as agreed.
        </Typography>
        <Typography variant="body2" paragraph>
          Integrations may require additional setup fees and may depend on third-party systems.
        </Typography>
        <Typography variant="body2" paragraph>
          Additional services such as data cleansing, dashboard customisation, and advisory overlay are billed separately unless included.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}