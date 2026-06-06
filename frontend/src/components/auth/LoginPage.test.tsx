import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from './LoginPage';

describe('LoginPage Component', () => {
  it('renders login fields correctly', () => {
    render(<LoginPage onLogin={vi.fn()} />);
    
    expect(screen.getByPlaceholderText('e.g. T1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login to Sovereign Hub')).toBeInTheDocument();
    // Role selector exists
    expect(screen.getByText('Cashier')).toBeInTheDocument();
  });

  it('calls onLogin with credentials and role when submitted', () => {
    const onLogin = vi.fn();
    render(<LoginPage onLogin={onLogin} />);
    
    fireEvent.change(screen.getByPlaceholderText('e.g. T1'), { target: { value: 'T1' } });
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass1' } });
    
    // Default role is Cashier
    fireEvent.click(screen.getByText('Login to Sovereign Hub'));
    
    expect(onLogin).toHaveBeenCalledWith({
      tenant: 'T1',
      username: 'user1',
      role: 'Cashier'
    });
  });
});
