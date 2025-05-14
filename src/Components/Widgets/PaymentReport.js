/**
 * payment reports Component
*/
import React, { Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Badge } from 'reactstrap';
import { Table, TableBody, TableCell, TableHead, TableRow }from '@material-ui/core';

const paymentColumns = ['Payment Id', 'Client Name', 'Payment Type', 'Paid Date', 'Amount'];

function Paymentreport(props) {
   const { paymentlist } = props
   return (
      <Fragment>
         <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={424} autoHide>
            <Table className="table-wrap" >
               <TableHead>
                  <TableRow>
                     {paymentColumns.map((th, index) => (
                        <TableCell key={index} className="fw-bold">{th}</TableCell>
                     ))}
                  </TableRow>
               </TableHead>
               <TableBody>
                  {paymentlist.map((list, index) => {
                     return (
                        <TableRow key={index}>
                           <TableCell>{list.payid}</TableCell>
                           <TableCell className="fw-bold">{list.firstName} {list.lastName}</TableCell>
                           <TableCell><Badge color={list.typeColor}>{list.paymentType}</Badge></TableCell>
                           <TableCell>{list.paidDate}</TableCell>
                           <TableCell>{list.amount}</TableCell>
                        </TableRow>
                     )
                  })}
               </TableBody>
            </Table>
         </Scrollbars>
      </Fragment>
   );
}

export default Paymentreport;