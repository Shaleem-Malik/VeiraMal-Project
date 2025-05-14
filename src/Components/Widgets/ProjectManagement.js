/**
 * Project Management Widget
 */

import React, { useState, Fragment, useEffect } from 'react';
import { Progress, Table, Collapse } from 'reactstrap';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { Scrollbars } from 'react-custom-scrollbars';
import Tooltip from '@material-ui/core/Tooltip';

// api
import api from 'Api';

// card component
import { RctCardFooter } from 'Components/RctCard';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

//Helper
import { getTheDate } from 'Helpers/helpers';

// intl messages
import IntlMessages from 'Util/IntlMessages';

function ProjectItem(props) {
   const [collapse, setCollapse] = useState(false);
	
	//On collapse project description
	const OnCollapseProject = () => {
      setCollapse(!collapse);
	}

   const { data } = props;
   return (
      <Fragment>
         <tr>
            <td>{data.name}</td>
            <td>{getTheDate(data.date, 'DD MMM YYYY')}</td>
            <td>
               <Progress color={data.progress.color} className="mt-10 w-90" value={data.progress.value} />
               <p className="mb-0 fs-12 text-muted">{data.status}</p>
            </td>
            <td className="d-flex justify-content-between">
               <div className="team-avatar w-100">
                  <ul className="mb-0 list-inline">
                     {data.team.map((member, subkey) => (
                        <li className="list-inline-item" key={subkey}>
                           <Tooltip id="tooltip-top" title={member.name} placement="top">
                              <Avatar alt="user 4" src={member.avatar} className="rounded-circle" />
                           </Tooltip>
                        </li>
                     ))}
                  </ul>
               </div>
               <IconButton onClick={() => OnCollapseProject()}>
                  {collapse ?
                     <i className="material-icons">remove_circle</i>
                     :
                     <i className="material-icons">add_circle</i>
                  }
               </IconButton>
            </td>
         </tr>
         {collapse &&
            <tr>
               <td colSpan="4">
                  <Collapse isOpen={collapse}>
                     <div className="p-10">
                        <h6><IntlMessages id="widgets.description" /></h6>
                        <p>{data.description}</p>
                     </div>
                  </Collapse>
               </td>
            </tr>
         }
      </Fragment>
   )
}

function ProjectManagement() {
   const [projectListData, setProjectListData] = useState(null);
   const [sectionReload, setSectionReload] = useState(false);
	
	useEffect(() => {
		getProjectData();
	},[])

	// Project Data

	const getProjectData =()=>  {
      setSectionReload(true);
		api.get('ProjectData.js')
			.then((response) => {
            setProjectListData(response.data)
            setSectionReload(false);
			}).catch(error => {
            setProjectListData(null)
            setSectionReload(false);
			})
	}

   return (
      <div className="project-managemnet-wrapper">
         {sectionReload &&
            <RctSectionLoader />
         }
         <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={620} autoHide>
            <Table hover className="mb-0" responsive>
               <thead>
                  <tr>
                     <th><IntlMessages id="components.projectName" /></th>
                     <th><IntlMessages id="widgets.deadline" /></th>
                     <th><IntlMessages id="widgets.status" /></th>
                     <th><IntlMessages id="widgets.team" /></th>
                  </tr>
               </thead>
               <tbody>
                  {projectListData && projectListData.map((data, key) => (
                     <ProjectItem
                        key={key}
                        data={data}
                     />
                  ))}
               </tbody>
            </Table>
         </Scrollbars>
         <RctCardFooter>
            <span className="fs-12 text-base">
               <i className="mr-15 zmdi zmdi-refresh"></i>
               <IntlMessages id="widgets.updated10Minago" />
            </span>
         </RctCardFooter>
      </div>
   )
}

export default ProjectManagement