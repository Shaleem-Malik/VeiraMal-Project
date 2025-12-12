import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserFromFirebase } from 'Store/Actions';
import IntlMessages from 'Util/IntlMessages';

// CSS for better avatar styling
const avatarStyles = `
  .user-block-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .user-block-avatar:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    border-color: #4e73df;
  }
  
  .user-profile {
    position: relative;
  }
  
  .user-profile::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #28a745;
    border: 2px solid #fff;
  }
  
  .user-name {
    font-weight: 600;
    color: #5a5c69;
    font-size: 0.9rem;
  }
  
  .dropdown-icon {
    color: #b7b9cc;
    transition: transform 0.3s ease;
  }
  
  .rct-dropdown.show .dropdown-icon {
    transform: rotate(180deg);
  }
  
  .sidebar-user-block {
    padding: 8px 0;
  }
  
  .user-info {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

function UserBlock() {
   const [userDropdownMenu, setUserDropdownMenu] = useState(false);
   const [fullName, setFullName] = useState('');
   const [email, setEmail] = useState('');
   const [profilePicture, setProfilePicture] = useState(null);
   const [initials, setInitials] = useState('');

   const dispatch = useDispatch();
   const history = useHistory();
   
   // Get user data from Redux store
   const userState = useSelector(state => state.user);

   // Add style tag to head
   useEffect(() => {
     const styleTag = document.createElement('style');
     styleTag.innerHTML = avatarStyles;
     document.head.appendChild(styleTag);
     
     return () => {
       document.head.removeChild(styleTag);
     };
   }, []);

   useEffect(() => {
      const storedFullName = localStorage.getItem('name') || 'User';
      const storedEmail = localStorage.getItem('user_email') || 'info@example.com';
      setFullName(storedFullName);
      setEmail(storedEmail);
      
      // Generate initials for avatar fallback
      if (storedFullName) {
        const nameParts = storedFullName.trim().split(' ');
        let initials = '';
        if (nameParts.length === 1) {
          initials = nameParts[0].charAt(0).toUpperCase();
        } else if (nameParts.length >= 2) {
          initials = (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
        }
        setInitials(initials);
      }
      
      // Get current user ID from localStorage
      const currentUserId = localStorage.getItem('userId');
      
      // Find current user in Redux store to get profile picture
      if (currentUserId && userState.users && Array.isArray(userState.users)) {
         const foundUser = userState.users.find(user => {
            const userId = user.userId || user.id || user.UserId || user.ID;
            return String(userId) === String(currentUserId);
         });
         
         if (foundUser) {
            // Get profile picture URL from user data
            const profilePicUrl = foundUser.profilePictureUrl || foundUser.profilePicUrl || 
                                 foundUser.profilePicture || foundUser.profilePic;
            
            // Only set if there's a profile picture URL
            if (profilePicUrl) {
               // Construct the full URL
               // Remove /api/ from the base URL if present
               const baseUrl = (process.env.REACT_APP_BASE_URL || 'http://localhost:5228/api/')
                  .replace('/api/', '')
                  .replace('/api', '');
               
               // Make sure the URL is complete
               let fullProfilePicUrl;
               if (profilePicUrl.startsWith('http')) {
                  // Already a full URL
                  fullProfilePicUrl = profilePicUrl;
               } else if (profilePicUrl.startsWith('/')) {
                  // Relative URL starting with /
                  fullProfilePicUrl = `${baseUrl}${profilePicUrl}`;
               } else {
                  // Relative URL without starting /
                  fullProfilePicUrl = `${baseUrl}/${profilePicUrl}`;
               }
               
               // Add cache busting parameter to ensure fresh image
               const timestamp = new Date().getTime();
               setProfilePicture(`${fullProfilePicUrl}?t=${timestamp}`);
            }
         }
      }
   }, [userState.users]);

   // Also check localStorage for profile picture URL (fallback)
   useEffect(() => {
      const storedProfilePic = localStorage.getItem('profilePictureUrl');
      if (storedProfilePic && !profilePicture) {
         // Remove /api/ from the base URL if present
         const baseUrl = (process.env.REACT_APP_BASE_URL || 'http://localhost:5228/api/')
            .replace('/api/', '')
            .replace('/api', '');
         
         // Make sure the URL is complete
         let fullProfilePicUrl;
         if (storedProfilePic.startsWith('http')) {
            fullProfilePicUrl = storedProfilePic;
         } else if (storedProfilePic.startsWith('/')) {
            fullProfilePicUrl = `${baseUrl}${storedProfilePic}`;
         } else {
            fullProfilePicUrl = `${baseUrl}/${storedProfilePic}`;
         }
         
         // Add cache busting parameter
         const timestamp = new Date().getTime();
         setProfilePicture(`${fullProfilePicUrl}?t=${timestamp}`);
      }
   }, [profilePicture]);

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
   };

   const toggleUserDropdownMenu = () => {
      setUserDropdownMenu(!userDropdownMenu);
   };

   // Default avatar with initials fallback
   const defaultAvatar = profilePicture || `${process.env.PUBLIC_URL}/assets/images/avatars/user-15.jpg`;

   // Function to handle image error
   const handleImageError = (e) => {
      // Create a colored avatar with initials as fallback
      e.target.style.display = 'none';
      
      const avatarContainer = e.target.parentElement;
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = 'avatar-fallback';
      fallbackDiv.style.cssText = `
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 18px;
        border: 3px solid #fff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      `;
      fallbackDiv.textContent = initials || 'U';
      
      // Check if fallback already exists
      if (!avatarContainer.querySelector('.avatar-fallback')) {
        avatarContainer.appendChild(fallbackDiv);
      }
   };

   return (
      <div className="top-sidebar">
         <div className="sidebar-user-block">
            <Dropdown
               isOpen={userDropdownMenu}
               toggle={toggleUserDropdownMenu}
               className="rct-dropdown"
            >
               <DropdownToggle tag="div" className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                  <div className="user-profile">
                     {profilePicture ? (
                        <img
                           src={profilePicture}
                           alt="user profile"
                           className="user-block-avatar"
                           onError={handleImageError}
                        />
                     ) : (
                        <div className="avatar-fallback" style={{
                           width: '45px',
                           height: '45px',
                           borderRadius: '50%',
                           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                           color: 'white',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           fontWeight: 'bold',
                           fontSize: '18px',
                           border: '3px solid #fff',
                           boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                        }}>
                           {initials || 'U'}
                        </div>
                     )}
                  </div>
                  <div className="user-info ml-3">
                     <span className="user-name d-block" style={{
                        fontWeight: '600',
                        color: '#fff',
                        fontSize: '0.9rem',
                        maxWidth: '120px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                     }}>
                        {fullName}
                     </span>
                     <small className="text-white d-block" style={{
                        fontSize: '0.75rem',
                        maxWidth: '120px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                     }}>
                        {email}
                     </small>
                  </div>
                  <i className="zmdi zmdi-chevron-down dropdown-icon ml-2" style={{
                     color: '#b7b9cc',
                     transition: 'transform 0.3s ease',
                     transform: userDropdownMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}></i>
               </DropdownToggle>
               <DropdownMenu right style={{
                  marginTop: '10px',
                  border: 'none',
                  boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)',
                  borderRadius: '0.35rem',
                  minWidth: '220px'
               }}>
                  <ul className="list-unstyled mb-0">
                     <li className="p-15 border-bottom user-profile-top" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '0.35rem 0.35rem 0 0'
                     }}>
                        <div className="d-flex align-items-center">
                           <div className="mr-3">
                              {profilePicture ? (
                                 <img
                                    src={profilePicture}
                                    alt="user profile"
                                    className="rounded-circle"
                                    style={{
                                       width: '50px',
                                       height: '50px',
                                       objectFit: 'cover',
                                       border: '3px solid rgba(255,255,255,0.3)'
                                    }}
                                    onError={(e) => {
                                       e.target.style.display = 'none';
                                       const parent = e.target.parentElement;
                                       const fallback = document.createElement('div');
                                       fallback.className = 'rounded-circle d-flex align-items-center justify-content-center';
                                       fallback.style.cssText = `
                                         width: 50px;
                                         height: 50px;
                                         background: rgba(255,255,255,0.2);
                                         color: white;
                                         font-weight: bold;
                                         font-size: 20px;
                                         border: 3px solid rgba(255,255,255,0.3)
                                       `;
                                       fallback.textContent = initials || 'U';
                                       parent.appendChild(fallback);
                                    }}
                                 />
                              ) : (
                                 <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                                    width: '50px',
                                    height: '50px',
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '20px',
                                    border: '3px solid rgba(255,255,255,0.3)'
                                 }}>
                                    {initials || 'U'}
                                 </div>
                              )}
                           </div>
                           <div>
                              <p className="text-white mb-0 fs-14 font-weight-bold">{fullName}</p>
                              <span className="text-white fs-12"><small>{email}</small></span>
                           </div>
                        </div>
                     </li>
                     <li>
                        <Link 
                           to={{ pathname: '/app/dashboard/user-profile', state: { activeTab: 0 } }}
                           className="d-block px-4 py-3 text-dark"
                           style={{
                              textDecoration: 'none',
                              transition: 'all 0.2s',
                              borderBottom: '1px solid #f8f9fc'
                           }}
                           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fc'}
                           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                           <i className="zmdi zmdi-account text-primary mr-3"></i>
                           <span><IntlMessages id="widgets.profile" /></span>
                        </Link>
                     </li>
                     <li>
                        <a 
                           href="!#" 
                           onClick={logoutUser}
                           className="d-block px-4 py-3 text-dark"
                           style={{
                              textDecoration: 'none',
                              transition: 'all 0.2s',
                              borderRadius: '0 0 0.35rem 0.35rem'
                           }}
                           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fc'}
                           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
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