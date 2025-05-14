/**
 * User Block Component
 */
import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Badge } from 'reactstrap';
// import { NotificationManager } from 'react-notifications';
// components
// import SupportPage from '../Support/Support';
// redux action
import { logoutUserFromFirebase } from 'Store/Actions';
// intl messages
import IntlMessages from 'Util/IntlMessages';

function UserBlock() {
   const [userDropdownMenu, setUserDropdownMenu] = useState(false);
   // const [isSupportModal, setIsSupportModal] = useState(false);
   const dispatch = useDispatch();
	/**
	 * Logout User
	 */
	const logoutUser = (e) =>  {
		e.preventDefault();
		dispatch(logoutUserFromFirebase());
	}

	/**
	 * Toggle User Dropdown Menu
	 */
	const toggleUserDropdownMenu = () => {
      setUserDropdownMenu(!userDropdownMenu);
	}

	// /**
	//  * On Close Support Page
	//  */
	// const onCloseSupportPage = () => {
   //    setIsSupportModal(false);
	// }

   // /**
	//  * On Open Support Page
	//  */
   // const onOpenSupportPage = () => {
   //    setIsSupportModal(true);
   // }

	// /**
	//  * On Submit Support Page
	//  */
	// const onSubmitSupport = () => {
   //    setIsSupportModal(false);
	// 	NotificationManager.success('Message has been sent successfully!');
	// }

   return (
      <div className="top-sidebar">
         <div className="sidebar-user-block">
            <Dropdown
               isOpen={userDropdownMenu}
               toggle={() => toggleUserDropdownMenu()}
               className="rct-dropdown"
            >
               <DropdownToggle
                  tag="div"
                  className="d-flex align-items-center"
               >
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
                     <span className="user-name ml-4">Lucile Beck</span>
                     <i className="zmdi zmdi-chevron-down dropdown-icon mx-4"></i>
                  </div>
               </DropdownToggle>
               <DropdownMenu>
                  <ul className="list-unstyled mb-0">
                     <li className="p-15 border-bottom user-profile-top bg-primary rounded-top">
                        <p className="text-white mb-0 fs-14">Lucile Beck</p>
                        <span className="text-white fs-14">info@example.com</span>
                     </li>
                     <li>
                        <Link to={{
                           pathname: '/app/users/user-profile-1',
                           state: { activeTab: 0 }
                        }}>
                           <i className="zmdi zmdi-account text-primary mr-3"></i>
                           <span><IntlMessages id="widgets.profile" /></span>
                        </Link>
                     </li>
                     <li>
                        <Link to={{
                           pathname: '/app/chat',
                           state: { activeTab: 2 }
                        }}>
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
                        <a href="!#" onClick={(e) => logoutUser(e)}>
                           <i className="zmdi zmdi-power text-danger mr-3"></i>
                           <span><IntlMessages id="widgets.logOut" /></span>
                        </a>
                     </li>
                  </ul>
               </DropdownMenu>
            </Dropdown>
         </div>
         {/* <SupportPage
            isOpen={isSupportModal}
            onCloseSupportPage={() => onCloseSupportPage()}
            onSubmit={() => onSubmitSupport()}
         /> */}
      </div>
   );
}


export default UserBlock;
