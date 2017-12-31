// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {reduxSetup} from 'redux-easy';

import App from './App';
import initialState from './initial-state';

global.fetch = require('jest-fetch-mock');
const body = [
  {id: 1, name: 'root', parentId: 0}
];
fetch.mockResponse(JSON.stringify(body));

test('renders without crashing', () => {
  const store = reduxSetup({initialState, mock: true});
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    div);
});
