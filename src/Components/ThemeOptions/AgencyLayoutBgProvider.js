import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import classnames from "classnames";
//Actions
import { agencyLayoutBgHandler } from 'Store/Actions';

function AgencyLayoutBgProvider(props){
   const settings = useSelector(state => state.settings);
   const dispatch = useDispatch();
   const { agencyLayoutBgColors } = settings;

   const changeLayoutBg = (color) => {
      dispatch(agencyLayoutBgHandler(color))
   }

   return (
      <div>
         <ul className="list-unstyled agency-bg mb-0 p-10 text-center">
            <li className="header-title mb-10">
               <span>Background Color </span>
            </li>
            {agencyLayoutBgColors && agencyLayoutBgColors.length > 0 && agencyLayoutBgColors.map((color, key) => (
               <li
                  className={classnames("list-inline-item", {
                     'active': color.active
                  })}
                  key={key}
                  onClick={() => changeLayoutBg(color)}
               >
                  <span className={classnames("badge", color.class)}></span>
               </li>
            ))}
         </ul>
      </div>
   )
}

export default AgencyLayoutBgProvider;