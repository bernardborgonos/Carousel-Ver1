import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

describe('UNIT2C Cacousel App', () => {
  it('renders the header with the rebranded name', () => {
    render(<App />);
    const heading = screen.getAllByText(/UNIT@C = Underground Nomadic Information Technology/i);
    expect(heading.length).toBeGreaterThan(0);
  });
});
