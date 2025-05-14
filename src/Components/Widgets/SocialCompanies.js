/**
 * Social Companines
 */
import React, { useState, useEffect } from 'react';
import { Badge } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';

// api
import api from 'Api';
import { Fab } from '@material-ui/core';

function SocialCompanines() {
   const [socialCompanies, setSocialCompanies] = useState(null)
   
   useEffect(() => {
      getSocialCompanies();
   },[])

	// get social companies
	const getSocialCompanies = () => {
		api.get('socialCompanies.js')
			.then((response) => {
            setSocialCompanies(response.data)
			})
			.catch(error => {
            // error handling
            console.log(error);
			})
	}

   return (
      <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={400} autoHide>
         <div className="table-responsive">
            <table className="table table-hover table-middle">
               <thead>
                  <tr>
                     <th>Media</th>
                     <th>Name</th>
                     <th>Likes</th>
                     <th>Comemnts</th>
                     <th>Share</th>
                     <th>Members</th>
                  </tr>
               </thead>
               <tbody>
                  {socialCompanies && socialCompanies.map((data, key) => (
                     <tr key={key}>
                        <td>
                           <Fab variant="round" className={`btn-${data.icon} mr-15 mb-10 text-white`}>
                              <i className={`zmdi zmdi-${data.icon}`}></i>
                           </Fab>
                        </td>
                        <td>
                           <span className="d-block">{data.title}</span>
                           <a href="!#" onClick={e => e.preventDefault()} className="text-blue">{data.url}</a>
                        </td>
                        <td>{data.likes}</td>
                        <td>{data.comments}</td>
                        <td>{data.share}</td>
                        <td>
                           <Badge color="primary" className="badge-pill badge-lg">{data.members}</Badge>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Scrollbars>
   );
}

export default SocialCompanines;
