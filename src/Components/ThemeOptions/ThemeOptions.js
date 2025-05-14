/**
 * Theme Options
 */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import { DropdownToggle, DropdownMenu, Dropdown } from 'reactstrap';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Scrollbars } from 'react-custom-scrollbars';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import AppConfig from 'Constants/AppConfig';

import AgencyLayoutBgProvider from "./AgencyLayoutBgProvider";

// redux actions
import {
   toggleSidebarImage,
   setSidebarBgImageAction,
   miniSidebarAction,
   darkModeAction,
   boxLayoutAction,
   rtlLayoutAction,
   changeThemeColor,
   toggleDarkSidebar
} from 'Store/Actions';

// intl messages
import IntlMessages from 'Util/IntlMessages';

function ThemeOptions(props) {
   const [themeOptionPanelOpen, setThemeOptionPanelOpen] = useState(false);
   const settings = useSelector(state => state.settings);
   const {
      themes,
      activeTheme,
      enableSidebarBackgroundImage,
      sidebarBackgroundImages,
      selectedSidebarImage,
      miniSidebar,
      darkMode,
      boxLayout,
      rtlLayout,
      navCollapsed,
      isDarkSidenav
   } = settings;

   const dispatch = useDispatch();

   useEffect(() => {
      if (darkMode) {
         darkModeHanlder(true);
      }
      if (boxLayout) {
         boxLayoutHanlder(true);
      }
      if (rtlLayout) {
         rtlLayoutHanlder(true);
      }
      if (miniSidebar) {
         miniSidebarHanlder(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [darkMode, boxLayout, rtlLayout, miniSidebar])

	/**
	 * Set Sidebar Background Image
	 */
   const setSidebarBgImage = (sidebarImage, e) => {
      e.preventDefault();
      dispatch(setSidebarBgImageAction(sidebarImage));
   }

	/**
	 * Function To Toggle Theme Option Panel
	 */
   const toggleThemePanel = () => {
      setThemeOptionPanelOpen(!themeOptionPanelOpen);
   }

	/**
	 * Mini Sidebar Event Handler
	*/
   const miniSidebarHanlder = (isTrue) => {
      if (isTrue) {
         document.body.classList.add("mini-sidebar");
      }
      else {
         document.body.classList.remove("mini-sidebar");
      }
      setTimeout(() => {
         dispatch(miniSidebarAction(isTrue));
      }, 100)
   }

	/**
	 * Dark Mode Event Hanlder
	 * Use To Enable Dark Mode
	 * @param {*object} event
	*/
   const darkModeHanlder = (isTrue) => {
      if (isTrue) {
         document.body.classList.add("dark-mode");
      }
      else {
         document.body.classList.remove("dark-mode");
      }
      dispatch(darkModeAction(isTrue));
   }

	/**
	 * Box Layout Event Hanlder
	 * Use To Enable Boxed Layout
	 * @param {*object} event
	*/
   const boxLayoutHanlder = (isTrue) => {
      if (isTrue) {
         document.body.classList.add("boxed-layout");
      }
      else {
         document.body.classList.remove("boxed-layout");
      }
      dispatch(boxLayoutAction(isTrue));
   }

	/**
	 * Rtl Layout Event Hanlder
	 * Use to Enable rtl Layout
	 * @param {*object} event
	*/
   const rtlLayoutHanlder = (isTrue) => {
      var root = document.getElementsByTagName('html')[0];
      if (isTrue) {
         root.setAttribute('dir', 'rtl');
         document.body.classList.add("rtl");
      }
      else {
         root.setAttribute('dir', 'ltr');
         document.body.classList.remove("rtl");
      }
      dispatch(rtlLayoutAction(isTrue));
   }

	/**
	 * Change Theme Color Event Handler
	 * @param {*object} theme 
	 */
   const changeThemeColorHandler = (theme) => {
      const { themes } = settings;
      for (const appTheme of themes) {
         if (document.body.classList.contains(`theme-${appTheme.name}`)) {
            document.body.classList.remove(`theme-${appTheme.name}`);
         }
      }
      document.body.classList.add(`theme-${theme.name}`);
      darkModeHanlder(false);
      dispatch(changeThemeColor(theme));
   }


   return (
      <div className="fixed-plugin">
         {AppConfig.enableThemeOptions &&
            <Dropdown isOpen={themeOptionPanelOpen} toggle={() => toggleThemePanel()}>
               <DropdownToggle className="bg-primary">
                  <Tooltip title="Theme Options" placement="left">
                     <i className="zmdi zmdi-settings font-2x tour-step-6 spin-icon"></i>
                  </Tooltip>
               </DropdownToggle>
               <DropdownMenu>
                  <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={530} autoHide autoHideDuration={100}>
                     <ul className="list-unstyled text-center mb-0">
                        <li className="header-title mb-10">
                           <IntlMessages id="themeOptions.themeColor" />
                        </li>
                        <li className="adjustments-line mb-10">
                           <a href="!#" onClick={e => e.preventDefault()}>
                              <div>
                                 {themes && themes.map((theme, key) => (
                                    <Tooltip title={theme.name} placement="top" key={key}>
                                       <img
                                          onClick={() => changeThemeColorHandler(theme)}
                                          src={`${process.env.PUBLIC_URL}/assets/images/img/${theme.name}-theme.png`}
                                          alt="theme"
                                          className={classnames('img-fluid mr-5', { 'active': theme.id === activeTheme.id })}
                                       />
                                    </Tooltip>
                                 ))}
                              </div>
                           </a>
                        </li>
                        <li className="header-title sidebar-overlay">
                           <IntlMessages id="themeOptions.sidebarOverlay" />
                        </li>
                        <li className="sidebar-color">
                           <IntlMessages id="themeOptions.sidebarLight" />
                           <FormControlLabel
                              className="m-0"
                              control={
                                 <Switch
                                    checked={isDarkSidenav}
                                    onClick={() => dispatch(toggleDarkSidebar())}
                                    color="primary"
                                    className="switch-btn"
                                 />
                              }
                           />
                           <IntlMessages id="themeOptions.sidebarDark" />
                        </li>
                        <li className="header-title sidebar-img-check">
                           <FormControlLabel
                              className="m-0"
                              control={
                                 <Switch
                                    checked={enableSidebarBackgroundImage}
                                    onClick={() => dispatch(toggleSidebarImage())}
                                    color="primary"
                                    className="switch-btn"
                                 />
                              }
                              label={<IntlMessages id="themeOptions.sidebarImage" />}
                           />
                        </li>
                        {enableSidebarBackgroundImage &&
                           <li className="background-img">
                              {sidebarBackgroundImages && sidebarBackgroundImages.map((sidebarImage, key) => (
                                 <a className={classnames('img-holder', { 'active': selectedSidebarImage === sidebarImage })} href="!#" key={key} onClick={(e) => setSidebarBgImage(sidebarImage, e)}>
                                    <img src={sidebarImage} alt="sidebar" className="img-fluid" width="" height="" />
                                 </a>
                              ))}
                           </li>
                        }
                     </ul>
                     <AgencyLayoutBgProvider />
                     <ul className="list-unstyled mb-0 p-10 app-settings">
                        <li className="header-title mb-10">
                           <IntlMessages id="themeOptions.appSettings" />
                        </li>
                        <li className="header-title mini-sidebar-option">
                           <FormControlLabel
                              control={
                                 <Switch
                                    disabled={navCollapsed}
                                    checked={miniSidebar}
                                    onChange={(e) => miniSidebarHanlder(e.target.checked)}
                                    className="switch-btn"
                                 />
                              }
                              label={<IntlMessages id="themeOptions.miniSidebar" />}
                              className="m-0"
                           />
                        </li>
                        <li className="header-title box-layout-option">
                           <FormControlLabel
                              control={
                                 <Switch
                                    checked={boxLayout}
                                    onChange={(e) => boxLayoutHanlder(e.target.checked)}
                                    className="switch-btn"
                                 />
                              }
                              label={<IntlMessages id="themeOptions.boxLayout" />}
                              className="m-0"
                           />
                        </li>
                        <li className="header-title">
                           <FormControlLabel
                              control={
                                 <Switch
                                    checked={rtlLayout}
                                    onChange={(e) => rtlLayoutHanlder(e.target.checked)}
                                    className="switch-btn"
                                 />
                              }
                              label={<IntlMessages id="themeOptions.rtlLayout" />}
                              className="m-0"
                           />
                        </li>
                        <li className="header-title">
                           <FormControlLabel
                              control={
                                 <Switch
                                    checked={darkMode}
                                    onChange={(e) => darkModeHanlder(e.target.checked)}
                                    className="switch-btn"
                                 />
                              }
                              label={<IntlMessages id="themeOptions.darkMode" />}
                              className="m-0"
                           />
                        </li>
                     </ul>
                  </Scrollbars>
               </DropdownMenu>
            </Dropdown>
         }
      </div>
   );
}

export default ThemeOptions;
