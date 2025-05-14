/**
 * Discover Peoples
 */
import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import update from 'react-addons-update';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

// api
import api from 'Api';

function DiscoverPeoplesWidget(props){
   const [people, setPeople] = useState(null)

   useEffect(() => {
      getDiscoverPeoples();
   },[])
   
   // get discover peoples
   const getDiscoverPeoples = () => {
      api.get('discoverPeoples.js')
         .then((response) => {
            setPeople(response.data)
         })
         .catch(error => {
            // error handling
         })
   }

   /**
    * Function to follow and unfolow people
    * @param {object} data
    */
   const togglePeopleFollow = (key) => {
      let newPeople = people;
      setPeople(update(people, { [key]: { status: { $set: !newPeople[key].status } } }))
   }

   return (
      <List>
         {people && people.map((data, key) => (
            <ListItem button key={key} onClick={() => togglePeopleFollow(key)}>
               <div className="d-flex justify-content-between w-100">
                  <div className="d-flex align-items-center">
                     <div className="media">
                        <div className="media-left mr-20">
                           <img src={data.photo_url} alt="user profile" className="rounded-circle img-fluid" width="55" height="55" />
                        </div>
                        <div className="media-body pt-15">
                           <p className="mb-0 text-muted">{data.name}</p>
                        </div>
                     </div>
                  </div>
                  <div className="d-flex align-items-center">
                     <span className={classnames('badge badge-pill badge-lg', { 'badge-info': data.status, 'badge-dark': !data.status })}>{data.status ? 'Following' : 'Follow'}</span>
                  </div>
               </div>
            </ListItem>
         ))}
      </List>
   );
}

export default DiscoverPeoplesWidget;
