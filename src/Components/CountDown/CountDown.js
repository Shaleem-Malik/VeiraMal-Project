/**
 * Countdown Timer
 */
import React, { Fragment, useState, useEffect } from "react";

function CountDownTimer(props) {
   const [time,setTime] = useState({});
   const [seconds, setSeconds] = useState(props.time ? props.time : 3600)
   let timer = 0;
   const secondsToTime = (secs) => {
      let hours = Math.floor(secs / (60 * 60));

      let divisor_for_minutes = secs % (60 * 60);
      let minutes = Math.floor(divisor_for_minutes / 60);

      let divisor_for_seconds = divisor_for_minutes % 60;
      let seconds = Math.ceil(divisor_for_seconds);

      let obj = {
         h: hours,
         m: minutes,
         s: seconds
      };
      return obj;
   }

   useEffect(() => {  
      if (seconds){
         let timeLeftVar = secondsToTime(seconds);
         setTime(timeLeftVar);
         startTimer();
      }
      return () => {
         clearInterval(timer);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [seconds]); 

   const startTimer = () => {
      if (timer === 0) {
         timer = setInterval(countDown, 1000);
      }
   }

   const countDown = () => {
        // Remove one second, set state so a re-render happens.
      let sec = seconds - 1;
      setTime(secondsToTime(sec));
      setSeconds(sec);

        // Check if we're at zero.
      if (sec === 0) {
         clearInterval(timer);
      }
   }
   const { m, s } = time;
   return (
      <Fragment>
            {m} : {s < 10 ? `0${s}` : s}
      </Fragment>
   );
}

export default CountDownTimer;