import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        className={`input ${className}`}
        {...props}
      />
    </div>
  );
}
