/**
 * Project Gallery
 */
import React from 'react';
import Slider from "react-slick";
// rct card box
import { RctCard, RctCardContent } from 'Components/RctCard';

function ProjectGallery(props) {
   const settings = {
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      arrows: false,
   };
   const { slides } = props;
   return (
      <div>
         <RctCard>
            <RctCardContent>
               <h5 className="mb-20">Project Gallery</h5>
               <Slider {...settings}>
                  {slides && slides.map((slide, index) => {
                     return (
                        <div key={index} className="gallery-item">
                           <div className="gallery-img">
                              <img src={`${process.env.PUBLIC_URL}/assets/images/img/${slide}`} height="252" alt="gallery" className="img-fluid d-block" />
                           </div>
                        </div>
                     )
                  })}
               </Slider>
            </RctCardContent>
         </RctCard>
      </div>
   );
}

export default ProjectGallery