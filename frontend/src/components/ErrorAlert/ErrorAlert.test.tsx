import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorAlert } from './ErrorAlert';

describe('ErrorAlert', () => {
  it('should render correctly', () => {
    render(<ErrorAlert errors={{ countries: 'Error loading countries' }} />);

    expect(screen.getByText('Error loading countries')).toBeInTheDocument();
  });

  it('should not render when there are no errors', () => {
    render(<ErrorAlert errors={{}} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should not render when errors are dismissed', () => {
    render(<ErrorAlert errors={{ countries: 'Error loading countries' }} />);

    const dismissButton = screen.getByRole('button', { name: 'Dismiss all errors' });
    fireEvent.click(dismissButton);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should dismiss errors when the dismiss button is clicked and show them again when errors are added', () => {
    const { rerender } = render(<ErrorAlert errors={{ countries: 'Error loading countries' }} />);

    const dismissButton = screen.getByRole('button', { name: 'Dismiss all errors' });
    fireEvent.click(dismissButton);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    rerender(<ErrorAlert errors={{ regions: 'Error loading regions' }} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error loading regions')).toBeInTheDocument();
  });
});
