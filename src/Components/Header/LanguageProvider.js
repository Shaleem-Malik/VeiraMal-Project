/**
 * Language Select Dropdown
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownToggle, DropdownMenu, Dropdown } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { Badge } from 'reactstrap';
import Tooltip from '@material-ui/core/Tooltip';

// actions
import { setLanguage, rtlLayoutAction } from 'Store/Actions';

function LanguageProvider(props){
   const [langDropdownOpen, setLangDropdownOpen] =  useState(false);
   const dispatch = useDispatch();
   const settings = useSelector(state => state.settings);
	// function to toggle dropdown menu
	const toggle = () => {
      setLangDropdownOpen(!langDropdownOpen);
	}

	// on change language
	const onChangeLanguage = (lang) => {
      setLangDropdownOpen(false);
      dispatch(setLanguage(lang));
		if (lang.locale === 'ar' || lang.locale === 'he') {
         rtlLayoutHanlder(true);
		} else {
         rtlLayoutHanlder(false);
		}
	}

	/**
	 * Rtl Layout Event Hanlder
	 * Use to Enable rtl Layout
	 * @param {*object} event
 */
	const rtlLayoutHanlder = (isTrue) => {
		var root = document.getElementsByTagName( 'html' )[0];
		if (isTrue) {
			root.setAttribute( 'dir', 'rtl' );
			document.body.classList.add("rtl");
		}
		else {
			root.setAttribute( 'dir', 'ltr' );
			document.body.classList.remove("rtl");
      }
      dispatch(rtlLayoutAction(isTrue));
   }
   
   const { locale, languages } = settings;
   return (
      <Dropdown nav className="list-inline-item language-dropdown tour-step-5" isOpen={langDropdownOpen} toggle={toggle}>
         <DropdownToggle caret nav className="header-icon language-icon">
            <Tooltip title="Languages" placement="bottom">
               <img src={`${process.env.PUBLIC_URL}/assets/images/flag-icons/${locale.icon}.png`} className="mr-10" width="25" height="16" alt="lang-icon" />
            </Tooltip>
         </DropdownToggle>
         <DropdownMenu>
            <div className="dropdown-content">
               <div className="dropdown-top d-flex justify-content-between rounded-top bg-primary">
                  <span className="text-white font-weight-bold">Languages</span>
                  <Badge color="warning">3 NEW</Badge>
               </div>
               <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={280}>
                  <ul className="list-unstyled mb-0 dropdown-list">
                     {languages && languages.map((language, key) => (
                        <li key={key} onClick={() => onChangeLanguage(language)}>
                           <a href="!#" onClick={e => e.preventDefault()}>
                              <img
                                 src={`${process.env.PUBLIC_URL}/assets/images/flag-icons/${language.icon}.png`} className="mr-10"
                                 width="25"
                                 height="16"
                                 alt="lang-icon"
                              />
                              {language.name}
                           </a>
                        </li>
                     ))}
                  </ul>
               </Scrollbars>
            </div>
         </DropdownMenu>
      </Dropdown>
   );
}

export default LanguageProvider;
