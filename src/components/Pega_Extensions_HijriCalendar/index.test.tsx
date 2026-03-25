import { render, screen, fireEvent } from '@testing-library/react';
import { HijriCalendar } from './index';

const mockPConnect = {
  getActionsApi: () => ({
    updateFieldValue: jest.fn()
  }),
  getStateProps: () => ({
    value: 'testField'
  })
};

describe('HijriCalendar Component', () => {
  test('renders with correct label', () => {
    render(<HijriCalendar label="Expiry Date" getPConnect={() => mockPConnect} />);
    expect(screen.getByText('Expiry Date')).toBeInTheDocument();
  });

  test('opens calendar on button click', () => {
    render(<HijriCalendar getPConnect={() => mockPConnect} />);
    const toggleBtn = screen.getByLabelText('Toggle Calendar');
    fireEvent.click(toggleBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('formats typed input correctly with slashes', () => {
    render(<HijriCalendar getPConnect={() => mockPConnect} />);
    const input = screen.getByPlaceholderText('DD/MM/YYYY') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '01011445' } });
    expect(input.value).toBe('01/01/1445');
  });
});