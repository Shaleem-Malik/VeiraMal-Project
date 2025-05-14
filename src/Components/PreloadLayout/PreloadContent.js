/**
 * Preload Content
 */

import React, { Fragment } from 'react'

//Pre Loader components
import PreloadWidget from './PreloadWidget';
import PreloadTitlebar from './PreloadTitlebar';

function PreloadContent(){
   return (
      <Fragment>
         <PreloadTitlebar />
         <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-4 w-8-half-block">
               <PreloadWidget />
            </div>
            <div className="col-sm-6 col-md-4 col-lg-4 w-8-half-block">
               <PreloadWidget />
            </div>
            <div className="col-sm-6 col-md-4 col-lg-4 w-8-half-block">
               <PreloadWidget />
            </div>
            <div className="col-sm-6 col-md-4 col-lg-4 w-8-half-block">
               <PreloadWidget />
            </div>
            <div className="col-sm-6 col-md-4 col-lg-4 w-8-half-block">
               <PreloadWidget />
            </div>
            <div className="col-sm-6 col-md-4 col-lg-4 w-8-half-block">
               <PreloadWidget />
            </div>
            <div className="col-sm-6 col-md-4 col-lg-4 w-8-half-block">
               <PreloadWidget />
            </div>
            <div className="col-sm-6 col-md-4 col-lg-4 w-8-half-block">
               <PreloadWidget />
            </div>
            <div className="col-sm-6 col-md-4 col-lg-4 w-8-half-block">
               <PreloadWidget />
            </div>
         </div>
      </Fragment>
   )
}

export default PreloadContent;