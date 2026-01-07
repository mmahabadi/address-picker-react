import { useState, useEffect } from 'react';
import './ErrorAlert.css';

interface ErrorAlertProps {
  errors: Record<string, string | undefined>;
  title?: string;
}

export function ErrorAlert({ errors, title = 'Error loading data:' }: ErrorAlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDismissed(false);
    }
  }, [errors]);

  const handleDismissAll = () => {
    setIsDismissed(true);
  };

  const activeErrors = Object.entries(errors).filter(([, value]) => value);

  if (activeErrors.length === 0 || isDismissed) {
    return null;
  }

  return (
    <div className="alert alert-error" role="alert">
      <div className="alert-content">
        <div className="alert-header">
          <strong>{title}</strong>
          <button
            type="button"
            className="alert-dismiss"
            onClick={handleDismissAll}
            aria-label="Dismiss all errors"
          >
            ×
          </button>
        </div>
        <ul className="alert-list">
          {activeErrors.map(([key, message]) => (
            <li key={key}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
