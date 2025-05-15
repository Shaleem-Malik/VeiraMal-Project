/**
* Main App
*/
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

// css
import 'Assets/scss/reactifyCss';

// firebase
import './Firebase';

// app component
import App from 'Container/App';

import { configureStore } from 'Store';

function MainApp() {
	return (
		<Provider store={configureStore()}>
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<Router basename="/VeiraMal-Project">
					<Switch>
						<Route path="/" component={App} />
					</Switch>
				</Router>
			</MuiPickersUtilsProvider>
		</Provider>
	);
}

export default MainApp;
