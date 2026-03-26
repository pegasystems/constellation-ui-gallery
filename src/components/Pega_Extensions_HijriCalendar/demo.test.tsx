import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import type { HijriCalendarProps } from './index';
import { HijriCalendar } from './index';
import '@testing-library/jest-dom';

const mockPConnect = {
  getActionsApi: () => ({
    updateFieldValue: jest.fn(),
    triggerFieldChange: jest.fn()
  }),
  getStateProps: () => ({
    value: 'testProp'
  }),
  getComponentConfig: () => ({})
};

describe('HijriCalendar Component', () => {
  test('renders with correct label', () => {
    render(<HijriCalendar getPConnect={() => mockPConnect as any} label="Birth Date" />);
    expect(screen.getByText('Birth Date')).toBeInTheDocument();
  });

  test('opens calendar on button click', () => {
    render(<HijriCalendar getPConnect={() => mockPConnect as any} />);
    
    
    const toggleBtn = screen.getByLabelText('Toggle Hijri Calendar');
    fireEvent.click(toggleBtn);
    
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('formats typed input correctly with slashes', () => {
    render(<HijriCalendar getPConnect={() => mockPConnect as any} />);
    const input = screen.getByPlaceholderText('DD/MM/YYYY') as HTMLInputElement;
    
    
    fireEvent.change(input, { target: { value: '15091447' } });
    expect(input.value).toBe('15/09/1447');
  });
});