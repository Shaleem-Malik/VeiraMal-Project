/**
 * Activity Board
 */
import React, { useState, useEffect } from 'react'
import { Progress } from 'reactstrap';
import Checkbox from '@material-ui/core/Checkbox';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from 'classnames';
import update from 'react-addons-update';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// api
import api from 'Api';
// card component
import { RctCardFooter } from 'Components/RctCard';
// intl messages
import IntlMessages from 'Util/IntlMessages';
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

function ActivityBoard() {
   const [activityData, setActivityData] = useState(null);
   const [sectionReload, setSectionReload] = useState(false)
   const [assetsData, setAssetsData] = useState(null)

   useEffect(() => {
      getAssetstData();
      getChecklistData();
   },[])

	// assets Data

	const getAssetstData = () => {
      setSectionReload(true)
		api.get('galleryImages.js')
			.then((response) => {
            setAssetsData(response.data);
            setSectionReload(false)
			}).catch(error => {
            setAssetsData(null);
            setSectionReload(false)
			})
	}

	// Checklist Data

	const getChecklistData = () => {
      setSectionReload(true)
		api.get('ActivityBoardData.js')
			.then((response) => {
            setActivityData(response.data);
            setSectionReload(false)
			}).catch(error => {
            setActivityData(null);
            setSectionReload(false)
			})
	}

	// on handle change task
	const handleChange = (value, task) => {
		let selectedTaskIndex = activityData.indexOf(task);
      let newState = update(activityData, {
				[selectedTaskIndex]: {
					completed: { $set: value }
			}
      });
      setSectionReload(true)
		setTimeout(() => {
         setActivityData(newState);
         setSectionReload(false)
		}, 1500);
	}


   return (
      <div className="activity-board-wrapper">
         {sectionReload &&
            <RctSectionLoader />
         }
         <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={600} autoHide>
            <ul className="mb-0 list-unstyled">
               <li className="border-bottom">
                  <div className="activity-heading d-flex p-4 border-bottom">
                     <h3 className="mb-0">Reactify Redesign</h3>
                  </div>
                  <div className="activity-description p-4">
                     <h4 className="mb-4"><IntlMessages id="widgets.description" /></h4>
                     <div className="comment-box mb-4">
                        <p className="small-text">
                           Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                           tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                           quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        </p>
                     </div>
                     <h4 className="mb-4">Reactify Redesign Assets</h4>
                     <ul className="mb-0 list-inline attachment-wrap">
                        {assetsData && assetsData.map((data, key) => (
                           <li key={key} className="list-inline-item overlay-wrap overflow-hidden rounded">
                              <img src={data.imageUrl} className="size-120 rounded img-fluid" alt="img" />
                              <div className="overlay-content">
                                 <a href="!#" onClick={e => e.preventDefault()} className="d-flex align-items-center justify-content-center h-100 font-2x text-white">
                                    <i className="zmdi zmdi-download"></i>
                                 </a>
                              </div>
                           </li>
                        ))}
                     </ul>
                  </div>
               </li>
               <li>
                  <div className="activity-heading d-flex p-4 border-bottom">
                     <h3 className="mb-0"><IntlMessages id="widgets.checklist" /></h3>
                  </div>
                  <div className="p-4">
                     <Progress color="primary" className="mb-3" value="80">80% Completed</Progress>
                     <List className="p-0">
                        {activityData && activityData.map((task, key) => (
                           <ListItem key={key} onClick={(e) => handleChange(!task.completed, task)} button className="p-0">
                              <div className={classnames('d-flex  align-items-center', { 'strike': task.completed })}>
                                 <Checkbox
                                    color="primary"
                                    checked={task.completed}
                                    className="mr-20 "
                                    onChange={(e) => handleChange(e.target.checked, task)}
                                 />
                                 <p className="mb-0">{task.title}</p>
                              </div>
                           </ListItem>
                        ))}
                     </List>
                  </div>
               </li>
            </ul>
         </Scrollbars>
         <RctCardFooter className="bg-light">
            <span className="fs-12 text-base">
               <i className="mr-15 zmdi zmdi-refresh"></i>
               <IntlMessages id="widgets.updated10Minago" />
            </span>
         </RctCardFooter>
      </div>
   )
}

export default ActivityBoard;