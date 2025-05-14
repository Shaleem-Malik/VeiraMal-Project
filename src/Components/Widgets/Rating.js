/**
 * Rating Component
 */
import React, { useState } from 'react';
import { Input } from 'reactstrap';
import Button from '@material-ui/core/Button';
import StarRatingComponent from 'react-star-rating-component';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// chart config
import AppConfig from 'Constants/AppConfig';

function Rating(){
   const [rating,setRating] = useState(0);

   const onStarClick = (nextValue, prevValue, name) =>  {
      setRating(nextValue);
   }

   return (
      <div className="rating-wrap bg-warning rct-block py-20 px-30">
         <h4 className="text-white mb-3"><IntlMessages id="widgets.howWouldYouRateUs" /></h4>
         <div className="star-rating list-inline">
            <StarRatingComponent
               name="rate1"
               starCount={5}
               value={rating}
               starColor={AppConfig.themeColors.danger}
               emptyStarColor={AppConfig.themeColors.white}
               onStarClick={onStarClick}
               renderStarIcon={() => <i className="zmdi zmdi-star font-2x mr-5"></i>}
               renderStarIconHalf={() => <i className="zmdi zmdi-star-half font-2x mr-5"></i>}
            />
         </div>
         <Input
            type="textarea"
            name="comment"
            id="comment"
            placeholder="Tell us what you think?"
            className="mb-3 fs-14"
         />
         <Button variant="contained" size="small" className="btn-danger text-white btn-icon">
            <i className="zmdi zmdi-mail-send"></i> <IntlMessages id="widgets.send" />
         </Button>
      </div>
   )
};

export default Rating;