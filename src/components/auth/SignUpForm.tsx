import { useState } from 'react';
import { Button, Input } from '../ui';
import styles from './AuthForms.module.css';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

export function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('farm-plus-users') || '[]');

    // Check if user already exists
    if (existingUsers.some((user: { email: string }) => user.email === formData.email)) {
      setError('User with this email already exists');
      return;
    }

    // Add new user
    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      password: formData.password, // In real app, this should be hashed
      createdAt: new Date().toISOString(),
    };

    existingUsers.push(newUser);
    localStorage.setItem('farm-plus-users', JSON.stringify(existingUsers));

    // Switch to login
    alert('Account created successfully! Please log in.');
    onSwitchToLogin();
  };

  return (
    <div className={styles.form}>
      <h2 className={styles.title}>Create Account</h2>
      <p className={styles.subtitle}>Join FARM+ today</p>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.fields}>
        <Input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
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
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="outlined" size="lg" fullWidth>
          Sign Up
        </Button>
      </form>

      <p className={styles.switch}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className={styles.switchBtn}>
          Log in
        </button>
      </p>
    </div>
  );
}
