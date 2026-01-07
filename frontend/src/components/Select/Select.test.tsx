import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

describe('Select', () => {
  const props = {
    label: 'Test Label',
    id: 'test-select',
    name: 'test-select',
  };
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ];

  it('should render with label and select element', () => {
    render(<Select {...props} />);

    const select = screen.getByLabelText('Test Label');
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('id', 'test-select');
  });

  it('should render select with default option', () => {
    render(<Select {...props} />);

    const select = screen.getByRole('combobox', { name: /test label/i });
    expect(select).toHaveTextContent('Select test-select');
    expect(select).toHaveValue('');
  });

  it('should render asterisk when required is true', () => {
    render(<Select {...props} required />);

    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
  });

  it('should not render asterisk when required is false', async () => {
    render(<Select {...props} />);

    const asterisk = await screen.queryByText('*');
    expect(asterisk).toBeFalsy();
  });

  it('should render select with custom className', () => {
    render(<Select {...props} className="custom-class" />);

    const select = screen.getByRole('combobox', { name: /test label/i });
    expect(select).toHaveClass('custom-class');
  });

  it('should pass through standard select props', () => {
    render(<Select {...props} disabled />);

    const select = screen.getByRole('combobox', { name: /test label/i });
    expect(select).toBeDisabled();
  });

  it('should render options when provided', () => {
    render(<Select {...props} options={options} />);

    const select = screen.getByRole('combobox', { name: /test label/i });
    expect(select).toHaveTextContent('Option 1');
  });

  it('should call onChange handler when select value changes', async () => {
    const changeSpy = vi.fn();
    render(<Select {...props} options={options} onChange={changeSpy} />);

    const select = screen.getByRole('combobox', { name: /test label/i });
    await userEvent.selectOptions(select, 'Option 1');

    expect(changeSpy).toHaveBeenCalled();
  });

  it('should display custom error message when provided', async () => {
    render(<Select {...props} options={options} errorMessage="Custom error message" />);

    const select = screen.getByRole('combobox', { name: /test label/i });
    fireEvent.invalid(select);
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should clear error when select value changes', async () => {
    render(<Select {...props} options={options} required />);

    const select = screen.getByRole('combobox', { name: /test label/i });
    fireEvent.invalid(select);
    expect(screen.getByText('Please select an option')).toBeInTheDocument();

    await userEvent.selectOptions(select, 'Option 1');
    expect(screen.queryByText('Please select an option')).not.toBeInTheDocument();
  });

  it('should add has-error class to container when error is present', () => {
    render(<Select {...props} options={options} required />);

    const select = screen.getByRole('combobox', { name: /test label/i });
    fireEvent.invalid(select);
    const container = select.closest('.select-wrapper')?.parentElement;
    expect(container).toHaveClass('has-error');
  });

  it('should remove has-error class from container when error is cleared', async () => {
    render(<Select {...props} options={options} required />);

    const select = screen.getByRole('combobox', { name: /test label/i });
    fireEvent.invalid(select);
    const container = select.closest('.select-wrapper')?.parentElement;
    await userEvent.selectOptions(select, 'Option 1');

    expect(container).not.toHaveClass('has-error');
  });

  it('should show loading indicator when loading is true', () => {
    render(<Select {...props} loading />);

    const select = screen.getByRole('combobox', { name: /test label/i });
    expect(select).toBeDisabled();
    expect(select).toHaveTextContent('Loading...');
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('should not show loading indicator when loading is false', () => {
    render(<Select {...props} loading={false} />);

    const select = screen.getByRole('combobox', { name: /test label/i });
    expect(select).not.toBeDisabled();
    expect(select).toHaveTextContent('Select test-select');
    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument();
  });
});
