import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByText('Click Me');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-pos-primary');
  });

  it('renders correctly with secondary variant', () => {
    render(<Button variant="secondary">Warning</Button>);
    const button = screen.getByText('Warning');
    expect(button).toHaveClass('bg-pos-secondary');
  });

  it('renders correctly with xl size', () => {
    render(<Button size="xl">Huge</Button>);
    const button = screen.getByText('Huge');
    expect(button).toHaveClass('px-8');
  });
});
