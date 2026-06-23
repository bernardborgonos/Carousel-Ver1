import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SystemEvaluator from '../SystemEvaluator';

describe('SystemEvaluator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders initial state correctly with default health certificate', () => {
    render(<SystemEvaluator currentFPS={60} />);

    // Verify introductory text and start button are present
    expect(screen.getByText('Evaluate & Rate')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start carousel benchmarks/i })).toBeInTheDocument();

    // Verify initial report values
    expect(screen.getByText('Automatic Health Certificate')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument(); // FPS
    expect(screen.getByText('3.5')).toBeInTheDocument(); // Drag latency
    expect(screen.getByText('98%')).toBeInTheDocument(); // Convergence
    expect(screen.getByText('100%')).toBeInTheDocument(); // API Compliance
  });

  it('starts tests and updates progress when clicking the button', async () => {
    render(<SystemEvaluator currentFPS={120} />);

    // Click start button
    const startButton = screen.getByRole('button', { name: /start carousel benchmarks/i });
    fireEvent.click(startButton);

    // Button should be replaced by progress
    expect(screen.queryByRole('button', { name: /start carousel benchmarks/i })).not.toBeInTheDocument();
    expect(screen.getByText(/RUNNING:/)).toBeInTheDocument();

    // Results should be hidden while running
    expect(screen.queryByText('Automatic Health Certificate')).not.toBeInTheDocument();
    expect(screen.getByText('Awaiting Performance Test Initiation')).toBeInTheDocument();
  });

  it('completes the testing suite and shows updated results', async () => {
    render(<SystemEvaluator currentFPS={144} />);

    const startButton = screen.getByRole('button', { name: /start carousel benchmarks/i });
    fireEvent.click(startButton);

    // Fast-forward through all test timeouts
    // Total duration: 400 + 600 + 500 + 600 + 400 = 2500ms
    act(() => {
      vi.advanceTimersByTime(2500);
    });

    // Check that tests have finished
    expect(screen.getByRole('button', { name: /start carousel benchmarks/i })).toBeInTheDocument();
    expect(screen.queryByText(/RUNNING:/)).not.toBeInTheDocument();

    // Check that the updated results are displayed
    expect(screen.getByText('Automatic Health Certificate')).toBeInTheDocument();
    expect(screen.getByText('144')).toBeInTheDocument(); // Based on passed currentFPS (144)

    // Check that drag latency and convergence are displayed (values are randomized so we just check for their presence)
    expect(screen.getByText('Touch Grab Latency')).toBeInTheDocument();
    expect(screen.getByText('Projection Math Matrix')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument(); // API Compliance stays at 100%
  });
});
