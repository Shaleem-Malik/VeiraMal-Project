import React from 'react';
import { Clock3, Rocket } from 'lucide-react';

const LABELS = {
  'labour-cost': 'Labour Cost',
  absenteeism: 'Absenteeism',
  recruitment: 'Recruitment',
  performance: 'Performance',
  'scenario-modelling': 'Scenario Modelling',
  engagement: 'Engagement',
  'leave-liability': 'Leave Liability'
};

export default function ComingSoon({ moduleName }) {
  const title = LABELS[moduleName] || moduleName || 'This module';
  return (
    <div className="hr-placeholder">
      <div className="hr-placeholder-card">
        <div className="hr-placeholder-icon"><Rocket /></div>
        <h2>{title}</h2>
        <p>This module is part of the HR Analytix product build and will be enabled in a future release. The MVP currently prioritises Overview, Workforce & Diversity, Attrition & Retention, and Settings.</p>
        <span className="hr-roadmap-tag"><Clock3 size={12} style={{ marginRight: 5 }} /> Coming soon</span>
      </div>
    </div>
  );
}
