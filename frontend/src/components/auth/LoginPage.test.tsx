import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from './LoginPage';

describe('LoginPage Component', () => {
  it('renders login fields correctly', () => {
    render(<LoginPage onLogin={vi.fn()} />);
    
    expect(screen.getByPlaceholderText('Tenant ID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login to Sovereign Hub')).toBeInTheDocument();
  });

  it('calls onLogin with credentials when submitted', () => {
    const onLogin = vi.fn();
    render(<LoginPage onLogin={onLogin} />);
    
    fireEvent.change(screen.getByPlaceholderText('Tenant ID'), { target: { value: 'T1' } });
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass1' } });
    
    fireEvent.click(screen.getByText('Login to Sovereign Hub'));
    
    expect(onLogin).toHaveBeenCalledWith({
      tenant_id: 'T1',
      username: 'user1',
      password: 'pass1'
    });
  });
});
