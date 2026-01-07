import { useState, type ChangeEvent, type FormEvent, type SelectHTMLAttributes } from 'react';
import './Select.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  loading?: boolean;
  label: string;
  name: string;
  options?: { value: string; label: string }[];
  errorMessage?: string;
}

export function Select({
  loading,
  label,
  name,
  id,
  required,
  disabled,
  onChange,
  options = [],
  errorMessage = 'Please select an option',
  className = '',
  ...props
}: SelectProps) {
  const [error, setError] = useState('');

  const handleInvalid = (e: FormEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setError(errorMessage);
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setError('');
    onChange?.(e);
  };

  return (
    <div className={`${error && !disabled ? 'has-error' : ''}`}>
      <label htmlFor={id} className="label">
        {label} {required && <span>*</span>}
      </label>
      <div className="select-wrapper">
        <select
          id={id}
          name={name}
          className={`select ${className}`}
          required={required}
          onInvalid={handleInvalid}
          disabled={disabled || loading}
          {...props}
          onChange={handleChange}
        >
          <option value="">{loading ? 'Loading...' : `Select ${name}`}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {loading && (
          <span className="loading-indicator" aria-label="Loading">
            <span className="spinner"></span>
          </span>
        )}
      </div>
      {error && !disabled && (
        <span id={`${id}-error`} className="error-message">
          {error}
        </span>
      )}
    </div>
  );
}
