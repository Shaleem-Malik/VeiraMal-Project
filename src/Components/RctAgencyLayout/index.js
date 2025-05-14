/**
 * Rct Horizontal Menu Layout
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';

// Components
import Header from 'Components/Header/Header';
import Footer from 'Components/Footer/Footer';
import AgencyMenu from '../AgencyMenu/AgencyMenu';

function RctAgencyLayout(props){
   const settings = useSelector(state => state.settings);
   const { agencyLayoutBgColors, enableBgImage } = settings;
   const renderPage = () => {
      const { pathname } = props.location;
      const { children, match } = props;
      if (pathname === `${match.url}/chat` || pathname.startsWith(`${match.url}/mail`) || pathname === `${match.url}/todo`) {
         return (
            <div className="rct-page-content p-0" style={{ height: 'calc(100vh - 15.5rem)' }}>
               {children}
            </div>
         );
      }
      return (
         <Scrollbars
            className="rct-scroll"
            autoHide
            autoHideDuration={100}
            style={{ height: 'calc(100vh - 15.5rem)' }}
         >
            <div className="rct-page-content">
               {children}
            </div>
         </Scrollbars>
      );
   }
   const getActiveLayoutBg = () => {
      if(!enableBgImage) {
         for (const layoutBg of agencyLayoutBgColors) {
            if (layoutBg.active) {
               return layoutBg.class
            }
         }
      } else {
         return "app-boxed-v2"
      }
   }

   return (
      <div className={`app-boxed ${getActiveLayoutBg()}`} >
         <div className="app-container">
            <div className="rct-page-wrapper">
               <div className="rct-app-content">
                  <div className="app-header">
                     <Header agencyMenu />
                  </div>
                  <div className="rct-page">
                     <AgencyMenu />
                     {renderPage()}
                  </div>
                  <Footer />
               </div>
            </div>
         </div>
      </div>
   );
}

export default withRouter(RctAgencyLayout);
