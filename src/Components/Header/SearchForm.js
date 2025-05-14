/**
 * Search Form
 */
import React from 'react'
import { Input } from 'reactstrap';

function SearchForm(){
   return (
      <div className="search-wrapper">
         <Input type="search" className="search-input-lg" placeholder="Search.." />
      </div>
   )
}

export default SearchForm