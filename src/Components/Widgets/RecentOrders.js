/**
 * Recent Orders
 */
import React, { useEffect, useState } from 'react';

// api
import api from 'Api';

function RecentOrders() {
   const [recentOrders, setRecentOrders] = useState(null)

   useEffect(() => {
      getRecentOrders();
   },[])

	// recent orders
	const getRecentOrders = () =>  {
		api.get('recentOrders.js')
			.then((response) => {
				setRecentOrders(response.data);
			})
			.catch(error => {
            // error hanlding
            console.log(error);
			})
	}
   return (
      <div className="table-responsive">
         <table className="table table-hover mb-0">
            <thead>
               <tr>
                  <th>Order ID</th>
                  <th>Invoice</th>
                  <th>Customer Name</th>
                  <th>Profitment</th>
                  <th>Status</th>
               </tr>
            </thead>
            <tbody>
               {recentOrders && recentOrders.map((order, key) => (
                  <tr key={key}>
                     <td>{order.id}</td>
                     <td>{order.invoice}</td>
                     <td>
                        <span className="d-block fw-normal">{order.customerName}</span>
                        <span className="fs-12">{order.customerEmail}</span>
                     </td>
                     <td>${order.amount}</td>
                     <td>
                        <span className={`badge ${order.labelClass}`}>{order.status}</span>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default RecentOrders;
