import { type SelectHTMLAttributes } from 'react';
import './Select.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options?: { value: string; label: string }[];
}

export function Select({ label, name, id, options = [], className = '', ...props }: SelectProps) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <select
        id={id}
        name={name}
        className={`select ${className}`}
        {...props}
      >
        <option value="">Select {name}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
