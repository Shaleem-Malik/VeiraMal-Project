/**
 * Employ Payroll
 */
import React, { Fragment, useState, useEffect } from 'react';
import update from 'react-addons-update';
import { Badge } from 'reactstrap';

// api
import api from 'Api';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

// intl messages
import IntlMessages from 'Util/IntlMessages';

function EmployPayroll() {
   const [employPayrollReload, setEmployPayrollReload] = useState(false);
   const [employeePayroll, setEmployeePayroll] = useState(null);

   useEffect(() => {
      getEmployeePayrolls();
   },[])

	// get employee payrols
	const getEmployeePayrolls = () => {
		api.get('employeePayrols.js')
			.then((response) => {
				setEmployeePayroll(response.data);
			})
			.catch(error => {
				console.log(error);
			})
	}

	// delete employee payroll
	const deleteEmployePayroll = (e, employee) => {
		e.preventDefault();
		setEmployPayrollReload(true);
		let index = employeePayroll.indexOf(employee);
		setTimeout(() => {
			setEmployeePayroll(update(employeePayroll, { $splice: [[index, 1]] }));
         setEmployPayrollReload(false)
      }, 1500);
	}

	// on check box click
	const onCheckBoxClick = (e, employee) => {
      e.preventDefault();
      setEmployPayrollReload(true);
      let index = employeePayroll.indexOf(employee);
      setTimeout(() => {
         setEmployeePayroll(update(employeePayroll, { [index]: { status: { $set: 1 } } }));
         setEmployPayrollReload(false)
      }, 1500);
      
   }
   
   return (
      <Fragment>
         {employPayrollReload &&
            <RctSectionLoader />
         }
         <div className="table-responsive">
            <table className="table table-hover table-middle mb-0">
               <thead>
                  <tr>
                     <th>Name</th>
                     <th>Designation</th>
                     <th>Salary</th>
                     <th>Status</th>
                     <th>Action</th>
                  </tr>
               </thead>
               <tbody>
                  {employeePayroll && employeePayroll.map((employee, key) => (
                     <tr key={key}>
                        <td>
                           <div className="media">
                              <div className="media-left media-middle mr-15">
                                 <img src={employee.employeeAvatar} alt="user profile" className="media-object rounded-circle" width="35" height="35" />
                              </div>
                              <div className="media-body pt-10">
                                 <h6 className="m-0 fw-bold text-dark">{employee.employeeName}</h6>
                              </div>
                           </div>
                        </td>
                        <td>{employee.designation}</td>
                        <td>${employee.salary}</td>
                        <td>
                           {employee.status === 1 ?
                              <Badge color="primary"><IntlMessages id="widgets.done" /></Badge>
                              : <Badge color="warning"><IntlMessages id="widgets.pending" /></Badge>
                           }
                        </td>
                        <td className="table-action">
                           {employee.status === 0 && <a href="!#" onClick={(e) => onCheckBoxClick(e, employee)}><i className="ti-check"></i></a>}
                           <a href="!#" onClick={(e) => deleteEmployePayroll(e, employee)}><i className="ti-close"></i></a>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Fragment>
   );
}

export default EmployPayroll;
