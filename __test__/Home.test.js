import React from 'react';
import { render } from '@testing-library/react-native';
import Home from '../src/Home';

describe('Home Page', () => {
  
  it('That Home page Working Properly', () => {
    render(<Home />);
  });
});