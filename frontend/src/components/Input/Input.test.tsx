import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('should render with label and input element', () => {
    render(<Input label="Test Label" id="test-input" />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'test-input');
  });

  it('should render asterisk when required is true', () => {
    render(<Input label="Test Label" id="test-input" required />);

    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
  });

  it('should not render asterisk when required is false', async () => {
    render(<Input label="Test Label" id="test-input" />);

    const asterisk = await screen.queryByText('*');
    expect(asterisk).toBeFalsy();
  });

  it('should render input with custom className', () => {
    render(<Input label="Test Label" id="test-input" className="custom-class" />);

    const input = screen.getByRole('textbox', { name: /test label/i });
    expect(input).toHaveClass('custom-class');
  });

  it('should pass through standard input props', () => {
    render(
      <Input label="Test Label" id="test-input" type="email" placeholder="Enter email" disabled />
    );

    const input = screen.getByRole('textbox', { name: /test label/i });
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
    expect(input).toBeDisabled();
  });

  it('should call onChange handler when input value changes', async () => {
    const changeSpy = vi.fn();
    render(<Input label="Test Label" id="test-input" onChange={changeSpy} />);

    const input = screen.getByRole('textbox', { name: /test label/i });
    await userEvent.type(input, 'test value');

    expect(changeSpy).toHaveBeenCalled();
  });

  it('should display custom error message when provided', async () => {
    render(<Input label="Test Label" id="test-input" errorMessage="Custom error message" />);

    const input = screen.getByRole('textbox', { name: /test label/i });
    fireEvent.invalid(input);

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should clear error when input value changes', async () => {
    render(<Input label="Test Label" id="test-input" required />);

    const input = screen.getByRole('textbox', { name: /test label/i });
    fireEvent.invalid(input);

    expect(screen.getByText('Please fill out this field')).toBeInTheDocument();

    await userEvent.type(input, 'test value');

    expect(screen.queryByText('Please fill out this field')).not.toBeInTheDocument();
  });

  it('should add has-error class to container when error is present', () => {
    render(<Input label="Test Label" id="test-input" required />);

    const input = screen.getByRole('textbox', { name: /test label/i });
    fireEvent.invalid(input);
    const container = input.closest('div');

    expect(container).toHaveClass('has-error');
  });

  it('should remove has-error class from container when error is cleared', async () => {
    render(<Input label="Test Label" id="test-input" required />);

    const input = screen.getByRole('textbox', { name: /test label/i });
    fireEvent.invalid(input);
    const container = input.closest('div');

    await userEvent.type(input, 'test value');

    expect(container).not.toHaveClass('has-error');
  });
});
