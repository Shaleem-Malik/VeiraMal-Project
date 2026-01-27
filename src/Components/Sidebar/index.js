/**
 * Reactify Sidebar
 */
import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

// Material-UI components
import { Button } from '@material-ui/core';
import { TrendingUp } from '@material-ui/icons';

// redux actions
import { collapsedSidebarAction } from 'Store/Actions';

// components
import UserBlock from './UserBlock';
import SidebarContent from './SidebarContent';
import AgencySidebar from '../AgencyMenu/AgencySidebar';

class Sidebar extends Component {

	UNSAFE_componentWillMount() {
		this.updateDimensions();
	}

	shouldComponentUpdate(nextProps) {
		const { enableSidebarBackgroundImage, selectedSidebarImage, isDarkSidenav, locale } = this.props;
		if (enableSidebarBackgroundImage !== nextProps.enableSidebarBackgroundImage || selectedSidebarImage !== nextProps.selectedSidebarImage || isDarkSidenav !== nextProps.isDarkSidenav || locale) {
			return true
		} else {
			return false
		}
	}

	componentDidMount() {
		window.addEventListener("resize", this.updateDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { windowWidth } = this.state;
		if (nextProps.location !== this.props.location) {
			if (windowWidth <= 1199) {
				this.props.collapsedSidebarAction(false);
			}
		}
	}

	updateDimensions = () => {
		this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
	}

	render() {
		const { enableSidebarBackgroundImage, selectedSidebarImage, isDarkSidenav, agencySidebar } = this.props;
		
		// Function to handle upgrade button click
		const handleUpgradeClick = () => {
			// Add your upgrade logic here
			console.log('Upgrade Plan clicked');
			// You might want to navigate to a pricing page or show a modal
			// this.props.history.push('/pricing');
		};

		return (
			<Fragment>
				<div
					className={classNames('rct-sidebar', { 'background-none': !enableSidebarBackgroundImage })}
					style={{ backgroundImage: enableSidebarBackgroundImage ? `url(${selectedSidebarImage})` : 'none' }}
				>
					<div className={classNames("rct-sidebar-content", { "sidebar-overlay-dark": isDarkSidenav, 'sidebar-overlay-light': !isDarkSidenav })}>
						<div className="site-logo">
							<img src={`${process.env.PUBLIC_URL}/assets/images/img/appLogo.png`} className="mr-15" alt="site logo" width="35" height="35" /> 
							<h3 className="d-inline-block align-middle mb-0">HR Analytix</h3>
						</div>
						<div className="rct-sidebar-wrap">
							<Scrollbars
								className="rct-scroll"
								autoHide
								autoHideDuration={100}
								style={{ height: 'calc(100vh - 140px)' }} // Reduced height to accommodate button
							>
								<UserBlock />
								{!agencySidebar ?
									<SidebarContent />
									:
									<AgencySidebar />
								}
							</Scrollbars>
							
							{/* Upgrade Plan Button - Fixed at bottom */}
							<div className="sidebar-footer p-3 border-top">
								<Button
									fullWidth
									variant="contained"
									color="primary"
									startIcon={<TrendingUp />}
									onClick={handleUpgradeClick}
									className="upgrade-plan-btn"
									style={{
										backgroundColor: '#1976d2',
										color: 'white',
										borderRadius: '8px',
										padding: '10px 16px',
										fontWeight: '600',
										textTransform: 'none',
										fontSize: '0.95rem',
										boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
									}}
								>
									Upgrade Plan
								</Button>
								
								{/* Optional: Add a small description */}
								{/* <div className="text-center mt-2 mb-5" style={{ fontSize: '0.75rem', color: isDarkSidenav ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
									Get access to premium features
								</div> */}
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

// map state to props
const mapStateToProps = ({ settings }) => {
	const { enableSidebarBackgroundImage, selectedSidebarImage, collapsedSidebar, isDarkSidenav, locale } = settings;
	return { enableSidebarBackgroundImage, selectedSidebarImage, collapsedSidebar, isDarkSidenav, locale };
};

export default withRouter(connect(mapStateToProps, {
	collapsedSidebarAction,
})(Sidebar));