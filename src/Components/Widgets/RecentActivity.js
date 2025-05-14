/**
 * Recent Activities
 */
import React, { useState, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Badge } from 'reactstrap';

// api
import api from 'Api';

function RecentActivity() {
   const [activities,setActivities] = useState(null);

   useEffect(() => {
      api.get('recentActivities.js')
         .then((response) => {
            setActivities(response.data);
         })
         .catch(error => {
            // error handling
            console.log(error)
            
         })
   },[])

   return (
      <div className="activity-widget">
         <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={440} autoHide>
            <ul className="list-unstyled px-3">
               {activities && activities.map((activity, key) => (
                  <li key={key}>
                     <Badge color={activity.status} className="rounded-circle p-0">.</Badge>
                     <span className="activity-time font-xs text-muted">{activity.date}</span>
                     <p className="mb-0" dangerouslySetInnerHTML={{ __html: activity.activity }} />
                  </li>
               ))}
            </ul>
         </Scrollbars>
      </div>
   );
}

export default RecentActivity;
