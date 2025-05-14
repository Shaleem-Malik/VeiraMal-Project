/**
 * Product Report 
 */
import React, { useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { Scrollbars } from 'react-custom-scrollbars';

// api
import api from 'Api';

function ProductReportsWidget() {
   const [products, setProducts] = useState(null);

   useEffect(() => {
      getProductsReports();
   },[])

   // get products reports
   const getProductsReports = () =>  {
      api.get('productsReports.js')
         .then((response) => {
            setProducts(response.data);
         })
         .catch(error => {
            // error handling
         })
   }
   return (
      <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={410} autoHide>
         <ul className="list-group ie-flex">
            {products && products.map((product, key) => (
               <li className="list-group-item d-flex justify-content-between border-0" key={key}>
                  <div className="media">
                     <div className="media-left mr-15">
                        <img src={product.photoUrl} alt="project logo" className="media-object" width="40" height="40" />
                     </div>
                     <div className="media-body">
                        <span className="d-block fs-14 fw-semi-bold">{product.name}</span>
                        <span className="d-block fs-12 text-muted">{product.date}</span>
                     </div>
                  </div>
                  <IconButton color="primary" className="import-report">
                     <i className="ti-import"></i>
                  </IconButton>
               </li>
            ))}
         </ul>
      </Scrollbars>
   );
}

export default ProductReportsWidget;
