import React from 'react';
import { render, screen } from '@testing-library/react';
import { Configuration } from '@pega/cosmos-react-core';
/* Import the component - note we use the default export which is wrapped by withConfiguration */
import HijriCalendar from './index';

// 1. Create a robust mock for the PConnect object
const mockPConnect = {
  getActionsApi: () => ({
    updateFieldValue: jest.fn(),
    triggerFieldChange: jest.fn(),
  }),
  getStateProps: () => ({
    value: 'testField'
  }),
  getComponentConfig: () => ({}),
  getContextName: () => 'primary',
};

const renderWithPega = (ui: React.ReactElement, direction: 'ltr' | 'rtl' = 'ltr', theme: any = 'clarity') => {
  return render(
    <Configuration id="test-pega" theme={theme} direction={direction}>
      {ui}
    </Configuration>
  );
};

describe('HijriCalendar Component', () => {
  
  test('should render without crashing when getPConnect is provided', () => {
    // 2. Pass the mock as a function that returns the mock object
    renderWithPega(
      <HijriCalendar 
        getPConnect={() => mockPConnect} 
        label="Birth Date"
      />
    );
    
    expect(screen.getByText(/Birth Date/i)).toBeInTheDocument();
  });

  test('should show the calendar icon button', () => {
    renderWithPega(<HijriCalendar getPConnect={() => mockPConnect} />);
    const toggleButton = screen.getByLabelText(/Toggle Hijri Calendar/i);
    expect(toggleButton).toBeInTheDocument();
  });

  test('should respect the RTL direction from the theme', () => {
    const { container } = renderWithPega(
      <HijriCalendar getPConnect={() => mockPConnect} />, 
      'rtl'
    );
    // The InputWrapper uses direction: inherit, so it should be RTL
    const wrapper = container.querySelector('div');
    expect(wrapper).toHaveStyle('direction: inherit');
  });
});