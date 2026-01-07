import { useState, type ChangeEvent, type FormEvent, type SelectHTMLAttributes } from 'react';
import './Select.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options?: { value: string; label: string }[];
  errorMessage?: string;
}

export function Select({
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
      <select
        id={id}
        name={name}
        className={`select ${className}`}
        required={required}
        onInvalid={handleInvalid}
        {...props}
        onChange={handleChange}
      >
        <option value="">Select {name}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && !disabled && (
        <span id={`${id}-error`} className="error-message">
          {error}
        </span>
      )}
    </div>
  );
}
