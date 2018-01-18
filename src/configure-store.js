/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */

import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

let composeEnhancers = composeWithDevTools({});

function configureStore(isHotLoaderRequired = false) {
  return (initState = {}, history = null) => {
    let middlewares = [thunk, routerMiddleware(history)];

    const store = createStore(
      reducers,
      initState,
      composeEnhancers(applyMiddleware(...middlewares))
    );

    if (isHotLoaderRequired && module.hot) {
      module.hot.accept('./reducers/app-reducer', () => {
        store.replaceReducer(require('./reducers').default);
      });
    }

    return store;
  };
}

export default configureStore;
