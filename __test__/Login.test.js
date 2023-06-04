import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Login from '../src/Login';

describe('Login Screen', () => {
  
  it('That Login renders without being crashed', () => {
    render(<Login />);
  });

  test('That Login navigates to the Home Page on successful login', () => {
   
    const navigationMock = {
      navigate: jest.fn(),
    };
    // Render the Login component with the mock navigation object so that its child components can be fetched
    const { getByPlaceholderText, getByText } = render(<Login navigation={navigationMock} />);
    // Get the email and password input components by placeholder text as reference
    const emailInput = getByPlaceholderText('username');
    const passwordInput = getByPlaceholderText('123456');
    // Get login pressable by Text
    const loginButton = getByText('Login');
    // Simulate user interaction by changing the input values
    fireEvent.changeText(emailInput, 'abc@gmail.com');
    fireEvent.changeText(passwordInput, '123456');
    // Simulate the Login button press
    fireEvent.press(loginButton);
    expect(navigationMock.navigate).toHaveBeenCalledWith('Home');

  });
});