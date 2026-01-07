import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  errorMessage?: string;
}

export function Input({ label, id, onChange, required, errorMessage = 'Please fill out this field', className = '', ...props }: InputProps) {
  const [error, setError] = useState('');

  const handleInvalid = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(errorMessage);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    onChange?.(e);
  };

  return (
    <div className={`${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="label">
        {label} {required && <span>*</span>}
      </label>
      <input
        id={id}
        className={`input ${className}`}
        onChange={handleChange}
        onInvalid={handleInvalid}
        required={required}
        {...props}
      />
      {error && <span id={`${id}-error`} className="error-message">{error}</span>}
    </div>
  );
}
