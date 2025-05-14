/**
 * Order Status Widget
 */
import React, { useState, useEffect } from 'react';
// api
import api from 'Api'

function OrderStatus() {
   const [ordersStatus, setOrdersStatus] = useState(null);
   
   useEffect(() => {
      getOrdersStatus();
   },[])

   // get orders status
   const getOrdersStatus = () => {
      api.get('ordersStatus.js')
         .then((response) => {
            setOrdersStatus(response.data);
         })
         .catch(error => {
            console.log(error);
         })
   }
   return (
      <div className="table-responsive">
         <table className="table table-hover">
            <thead>
               <tr>
                  <th>Invoice</th>
                  <th>User</th>
                  <th>Order date</th>
                  <th>Amount ($)</th>
                  <th>Status</th>
                  <th>Tracking Number</th>
               </tr>
            </thead>
            <tbody>
               {ordersStatus && ordersStatus.map((order, key) => (
                  <tr key={key}>
                     <td>{order.invoice}</td>
                     <td>
                        <div className="media">
                              <div className="media-left mr-15">
                                 <img src={order.userAvatar} className="rounded-circle" alt="user profile" width="50" height="50" />
                              </div>
                              <div className="media-body pt-15">
                                 <h4>{order.userName}</h4>
                              </div>
                        </div>
                     </td>
                     <td>{order.orderDate}</td>
                     <td>{order.amount}</td>
                     <td>
                        <span className={`badge badge-${order.badgeClass}`}>{order.status}
                        </span>
                     </td>
                     <td>{order.trackingNumber}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default OrderStatus;