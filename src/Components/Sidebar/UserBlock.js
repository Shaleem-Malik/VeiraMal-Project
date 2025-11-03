import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom'; // <-- useHistory for react-router-dom v5
import { useDispatch } from 'react-redux';
import { Badge } from 'reactstrap';
import { logoutUserFromFirebase } from 'Store/Actions';
import IntlMessages from 'Util/IntlMessages';

function UserBlock() {
   const [userDropdownMenu, setUserDropdownMenu] = useState(false);
   const [fullName, setFullName] = useState('');
   const [email, setEmail] = useState('');

   const dispatch = useDispatch();
   const history = useHistory(); // v5 history

   useEffect(() => {
      const storedFullName = localStorage.getItem('access') || 'User';
      const storedEmail = localStorage.getItem('user_email') || 'info@example.com';
      setFullName(storedFullName);
      setEmail(storedEmail);
   }, []);

   const logoutUser = async (e) => {
      e.preventDefault();

      try {
         // pass history into the thunk so it can navigate when done
         await dispatch(logoutUserFromFirebase(history));
      } catch (err) {
         // If the thunk throws, still navigate away to signin to ensure user is logged out client-side.
         console.warn('Logout thunk error:', err);
         history.push('/signin');
      }
      // Note: your thunk already does navigation if it receives history, so this is defensive.
   };

   const toggleUserDropdownMenu = () => {
      setUserDropdownMenu(!userDropdownMenu);
   };

   return (
      <div className="top-sidebar">
         <div className="sidebar-user-block">
            <Dropdown
               isOpen={userDropdownMenu}
               toggle={toggleUserDropdownMenu}
               className="rct-dropdown"
            >
               <DropdownToggle tag="div" className="d-flex align-items-center">
                  <div className="user-profile">
                     <img
                        src={`${process.env.PUBLIC_URL}/assets/images/avatars/user-15.jpg`}
                        alt="user profile"
                        className="img-fluid rounded-circle"
                        width="50"
                        height="100"
                     />
                  </div>
                  <div className="user-info">
                     <span className="user-name ml-4">{fullName}</span>
                     <i className="zmdi zmdi-chevron-down dropdown-icon mx-4"></i>
                  </div>
               </DropdownToggle>
               <DropdownMenu>
                  <ul className="list-unstyled mb-0">
                     <li className="p-15 border-bottom user-profile-top bg-primary rounded-top">
                        <p className="text-white mb-0 fs-14">{fullName}</p>
                        <span className="text-white fs-14"><small>{email}</small></span>
                     </li>
                     <li>
                        <Link to={{ pathname: '/app/users/user-profile-1', state: { activeTab: 0 } }}>
                           <i className="zmdi zmdi-account text-primary mr-3"></i>
                           <span><IntlMessages id="widgets.profile" /></span>
                        </Link>
                     </li>
                     <li>
                        <Link to={{ pathname: '/app/chat', state: { activeTab: 2 } }}>
                           <i className="zmdi zmdi-comment-text-alt text-success mr-3"></i>
                           <span><IntlMessages id="widgets.messages" /></span>
                           <Badge color="danger" className="pull-right">3</Badge>
                        </Link>
                     </li>
                     <li>
                        <Link to="/app/pages/feedback">
                           <i className="zmdi zmdi-edit text-warning mr-3"></i>
                           <span><IntlMessages id="sidebar.feedback" /></span>
                           <Badge color="info" className="pull-right">1</Badge>
                        </Link>
                     </li>
                     <li className="border-top">
                        <a href="!#" onClick={logoutUser}>
                           <i className="zmdi zmdi-power text-danger mr-3"></i>
                           <span><IntlMessages id="widgets.logOut" /></span>
                        </a>
                     </li>
                  </ul>
               </DropdownMenu>
            </Dropdown>
         </div>
      </div>
   );
}

export default UserBlock;
