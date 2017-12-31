// @flow
import 'font-awesome/css/font-awesome.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {reduxSetup} from 'redux-easy';

import App from './app';
import initialState from './initial-state';
import './reducers';

import './index.css';

const store = reduxSetup({initialState, render});

// Using this to get elements makes Flow happy.
function getElement(id: string): Element {
  return ((document.getElementById(id): any): Element); // type cast
}

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    getElement('root')
  );
}

render();
