import { createStore, applyMiddleware, compose } from 'redux';
import Thunk from 'redux-thunk';
import reducers from './Reducers';

export function configureStore(initialState) {

    const store = createStore(
        reducers,
        initialState,
        compose(applyMiddleware(Thunk))
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./Reducers/index', () => {
            const nextRootReducer = require('./Reducers/index');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
