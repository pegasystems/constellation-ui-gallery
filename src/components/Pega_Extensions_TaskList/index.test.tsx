
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskList from './TaskList'; // Correct import for the TaskList component
import '@testing-library/jest-dom/extend-expect'; // For assertions like .toBeInTheDocument

// Mocking PCore for API calls since we're not actually hitting an API in the test
jest.mock('@pega/cosmos-react-core', () => ({
  ...jest.requireActual('@pega/cosmos-react-core'),
  PCore: {
    getRestClient: jest.fn().mockReturnValue({
      invokeRestApi: jest.fn().mockResolvedValue({ status: 200 }),
    }),
  },
}));

describe('TaskList Component', () => {
  it('renders Task List correctly', async () => {
    const mockData = [
      { Id: 1, Label: 'Task 1', Status: false },
      { Id: 2, Label: 'Task 2', Status: true },
    ];

    render(<TaskList data={mockData} />);

    // Verify if tasks are rendered
    expect(screen.getByText('Task List')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('updates task status when checkbox is clicked', async () => {
    const mockData = [
      { Id: 1, Label: 'Task 1', Status: false },
    ];

    render(<TaskList data={mockData} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Wait for the status to update
    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });
});
