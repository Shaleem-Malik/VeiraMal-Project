/**
 * Session Slider
 */
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";

function SessionSlider() {
   const [sessionUsersData, setSessionUsersData] = useState([]);

   useEffect(() => {
      getSessionUsersData();
   }, []);

   // Fetch session users data (replace with real endpoint later)
   const getSessionUsersData = async () => {
      try {
         const response = await axios.get('/data/testimonials.json'); // ✅ safer path
         setSessionUsersData(response.data);
      } catch (error) {
         console.error("Error fetching session data:", error);
      }
   };

   const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      autoplay: true,
      swipe: true,
      touchMove: true,
      swipeToSlide: true,
      draggable: true
   };

   return (
      <div className="session-slider">
         <Slider {...settings}>
            {sessionUsersData.map((data, key) => (
               <div key={key}>
                  <img
                     src={data.profile}
                     alt="session-slider"
                     className="img-fluid"
                     width="377"
                     height="588"
                  />
                  <div className="rct-img-overlay">
                     <h5 className="client-name">{data.name}</h5>
                     <span>{data.designation}</span>
                     <p className="mb-0 fs-14">{data.body}</p>
                  </div>
               </div>
            ))}
         </Slider>
      </div>
   );
}

export default SessionSlider;
