import React,{ useState } from 'react';
import Menu from '@material-ui/core/Menu';

//Components
import RctDropdownItem from './RctDropdownItem';

function RctDropdownMenu(props){
   const [anchorEl, setAnchorEl] = useState(null);

   handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };

   handleClose = () => {
      setAnchorEl(null);
   };

   const { children } = props;
   return (
      <div>
         <div
            aria-owns={anchorEl ? 'rct-dropdown-menu' : null}
            aria-haspopup="true"
            onClick={handleClick}
         >
            {children}
         </div>
         <Menu
            id="rct-dropdown-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
         >
            <RctDropdownItem>
               {children}
            </RctDropdownItem>
         </Menu>
      </div>
   );
}

export default RctDropdownMenu;