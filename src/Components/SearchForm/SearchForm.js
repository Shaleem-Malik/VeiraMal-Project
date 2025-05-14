/**
 * Search Form Component
 */
import React from 'react';
import { useDispatch } from 'react-redux';
// actions
import { toggleSearchForm } from 'Store/Actions';
function SearchForm(props){
  /**
   * It is used to close the search form
   */
   const onCloseIcon = (event) => {
      event.preventDefault(); // preventing default actions
      useDispatch(toggleSearchForm()) // calling redux action
   }
   return (
      <div className="search-box">
         <a onClick={(event) => onCloseIcon(event)}>
            <i className="search-form-close icon-close"></i>
         </a>
         <form action="#" className="search-form-overlay">
            <div className="search-input">
               <input type="text" name="input-search" className="input-search" placeholder="Enter your search..." />
               <button type="submit" className="submit">
                  <i className="icon-arrow-right"></i>
               </button>
            </div>
         </form>
      </div>
   );
}

export default SearchForm;