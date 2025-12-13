import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../ui';
import styles from './AuthForms.module.css';

interface LoginFormProps {
  onSwitchToSignUp: () => void;
  onClose?: () => void;
}

export function LoginForm({ onSwitchToSignUp, onClose }: LoginFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('farm-plus-users') || '[]');

    // Find user
    const user = users.find(
      (u: { email: string; password: string }) =>
        u.email === formData.email && u.password === formData.password
    );

    if (!user) {
      setError('Invalid email or password');
      return;
    }

    // Save current user session
    localStorage.setItem('farm-plus-current-user', JSON.stringify(user));

    // Close modal and redirect
    if (onClose) {
      onClose();
    }
    navigate('/admin');
  };

  return (
    <div className={styles.form}>
      <h2 className={styles.title}>Welcome Back</h2>
      <p className={styles.subtitle}>Sign in to your account</p>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.fields}>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="outlined" size="lg" fullWidth>
          Log In
        </Button>
      </form>

      <p className={styles.switch}>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignUp} className={styles.switchBtn}>
          Sign up
        </button>
      </p>
    </div>
  );
}
