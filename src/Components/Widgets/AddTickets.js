/**
 * Tax Rates Component
*/
import React, { Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Badge } from 'reactstrap';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

const TicketsColumns = ['Sr.No', 'Tickets Code', 'Subject', 'date', 'Department', 'Status'];

function AddTickets(props){
   const { addtickets } = props;
   return (
      <Fragment>
         <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={424} autoHide>
            <Table className="table-wrap" >
               <TableHead>
                  <TableRow>
                     {TicketsColumns && TicketsColumns.map((th, index) => (
                        <TableCell key={index} className="fw-bold">{th}</TableCell>
                     ))}
                  </TableRow>
               </TableHead>
               <TableBody>
                  {addtickets && addtickets.map((list, index) => {
                     return (
                        <TableRow key={index}>
                           <TableCell>{list.srno}</TableCell>
                           <TableCell className="fw-bold">{list.ticketCode}</TableCell>
                           <TableCell>{list.subject}</TableCell>
                           <TableCell>{list.date}</TableCell>
                           <TableCell>{list.department}</TableCell>
                           <TableCell><Badge color={list.statusColor}>{list.status}</Badge></TableCell>
                        </TableRow>
                     )
                  })}
               </TableBody>
            </Table>
         </Scrollbars>
      </Fragment>
   );
}

export default AddTickets;