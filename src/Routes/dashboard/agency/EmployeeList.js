// EmployeeList.jsx
import React from 'react';

export default function EmployeeList({ employees = [], onEdit = () => {}, onToggleStatus = () => {} }) {
  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">👥 Company Employees</h5>
        <div>
          <span className="badge bg-success me-2">Active: {employees.filter(emp => emp.isActive).length}</span>
          <span className="badge bg-secondary">Total: {employees.length}</span>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Access Level</th>
                <th>Business Units</th>
                {/* <th>Location</th> */}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => {
                const key = emp.id ?? emp.userId ?? emp.UserId ?? idx;

                // business units might come in multiple shapes:
                // - array: BusinessUnits
                // - comma string: BusinessUnit
                // - single string: BusinessUnit
                let buLabel = '—';
                if (Array.isArray(emp.businessUnits ?? emp.BusinessUnits)) {
                  buLabel = (emp.businessUnits ?? emp.BusinessUnits).join(', ');
                } else if (typeof (emp.businessUnit ?? emp.BusinessUnit) === 'string') {
                  buLabel = (emp.businessUnit ?? emp.BusinessUnit).split(',').map(s => s.trim()).filter(Boolean).join(', ');
                }

                const accessLabel = typeof emp.accessLevel === 'string' ? emp.accessLevel : (emp.accessLevel?.name ?? emp.accessLevel?.displayName ?? '—');
                // const locationLabel = emp.location ?? emp.Location ?? '—';
                const email = emp.email ?? emp.Email ?? '—';

                return (
                  <tr key={key} className={emp.isActive ? '' : 'table-secondary'}>
                    <td className="fw-bold">{idx + 1}</td>
                    <td>{emp.firstName ?? emp.FirstName}</td>
                    <td>{emp.lastName ?? emp.LastName}</td>
                    <td><a href={`mailto:${email}`} className="text-decoration-none">{email}</a></td>
                    <td><span className="badge bg-info">{accessLabel}</span></td>
                    <td>{buLabel}</td>
                    {/* <td>{locationLabel}</td> */}
                    <td>{emp.isActive ? <span className="badge bg-success">Active</span> : <span className="badge bg-danger">Inactive</span>}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-warning" onClick={() => onEdit(emp)} title="Edit">
                          <i className="fas fa-edit me-1"></i>
                        </button>
                        <button className={`${emp.isActive ? 'btn-outline-danger' : 'btn-outline-success'} btn`} onClick={() => onToggleStatus(emp.id ?? emp.userId ?? emp.UserId)} title={emp.isActive ? 'Deactivate' : 'Activate'}>
                          <i className={`fas ${emp.isActive ? 'fa-times-circle' : 'fa-check-circle'} me-1`}></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
