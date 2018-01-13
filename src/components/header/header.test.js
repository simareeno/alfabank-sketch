import React from 'react';
import ReactDOM from 'react-dom';
import Header from './header';

test('Header should render correctly', () => {
  const header = document.createElement('div');
  ReactDOM.render(<Header />, header);
});
