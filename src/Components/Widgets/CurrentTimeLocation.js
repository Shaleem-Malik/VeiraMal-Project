/**
 * Current Date/Time Location Widget
 */
import React, { useState, useEffect } from 'react';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import { RctCardContent } from 'Components/RctCard';

function checkTime(i) {
	if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
	return i;
}

function CurrentTimeLocation(){
   const [currentTime, setCurrentTime] = useState({
      hours: '',
      minutes: '',
      seconds: ''
   })
   
   useEffect(() => {
      setInterval(() => {
         startTime();
      }, 500);
   },[])

	const startTime = () => {
		let today = new Date();
		let h = today.getHours();
		let m = today.getMinutes();
		let s = today.getSeconds();
		m = checkTime(m);
		s = checkTime(s);
		let time = {
			hours: h,
			minutes: m,
			seconds: s
		}
      setCurrentTime(time);
	}
   const { hours, minutes, seconds } = currentTime;
   return (
      <div className="current-widget bg-info">
         <RctCardContent>
            <div className="d-flex justify-content-between">
               <div className="align-items-start">
                  <h3 className="mb-10"><IntlMessages id="widgets.currentTime" /></h3>
                  <h2 className="mb-0">{`${hours} : ${minutes} : ${seconds}`}</h2>
               </div>
               <div className="align-items-end">
                  <i className="zmdi zmdi-time"></i>
               </div>
            </div>
         </RctCardContent>
      </div>
   );
}

export default CurrentTimeLocation;
