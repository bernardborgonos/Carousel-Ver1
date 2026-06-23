import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NavigationCarouselPage from '../NavigationCarouselPage';
import { CarouselItem } from '../../types';

// Mock items
const createMockItems = (count: number): CarouselItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    title: `Item ${i + 1}`,
    category: 'Test',
    imageUrl: '',
    color: 'red',
  }));
};

describe('NavigationCarouselPage', () => {
  it('renders correct number of items based on itemsPerPage', () => {
    const items = createMockItems(12);
    const setItemsPerPage = vi.fn();
    const onNavigate = vi.fn();

    render(
      <NavigationCarouselPage
        items={items}
        activeIndex={0}
        onNavigate={onNavigate}
        itemsPerPage={5}
        setItemsPerPage={setItemsPerPage}
      />
    );

    // Should render 5 items
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 5')).toBeInTheDocument();
    expect(screen.queryByText('Item 6')).not.toBeInTheDocument();

    // Page info
    expect(screen.getByText('Page 1 / 3')).toBeInTheDocument();
  });

  it('calculates the correct current page based on activeIndex', () => {
    const items = createMockItems(12);
    const setItemsPerPage = vi.fn();
    const onNavigate = vi.fn();

    // activeIndex 6 means page 2 (index 5-9) when itemsPerPage is 5
    render(
      <NavigationCarouselPage
        items={items}
        activeIndex={6}
        onNavigate={onNavigate}
        itemsPerPage={5}
        setItemsPerPage={setItemsPerPage}
      />
    );

    expect(screen.getByText('Item 6')).toBeInTheDocument();
    expect(screen.getByText('Item 10')).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    expect(screen.getByText('Page 2 / 3')).toBeInTheDocument();
  });

  it('handles activeIndex out of bounds', () => {
    const items = createMockItems(12);
    const setItemsPerPage = vi.fn();
    const onNavigate = vi.fn();

    // activeIndex 20 is greater than length, so should show last page
    render(
      <NavigationCarouselPage
        items={items}
        activeIndex={20}
        onNavigate={onNavigate}
        itemsPerPage={5}
        setItemsPerPage={setItemsPerPage}
      />
    );

    expect(screen.getByText('Item 11')).toBeInTheDocument();
    expect(screen.getByText('Item 12')).toBeInTheDocument();
    expect(screen.getByText('Page 3 / 3')).toBeInTheDocument();
  });

  it('handles empty items array', () => {
    const setItemsPerPage = vi.fn();
    const onNavigate = vi.fn();

    render(
      <NavigationCarouselPage
        items={[]}
        activeIndex={0}
        onNavigate={onNavigate}
        itemsPerPage={5}
        setItemsPerPage={setItemsPerPage}
      />
    );

    expect(screen.getByText('Page 1 / 0')).toBeInTheDocument();
  });

  it('calls onNavigate with the correct index when clicking Next and First', () => {
    const items = createMockItems(12);
    const setItemsPerPage = vi.fn();
    const onNavigate = vi.fn();

    const { rerender } = render(
      <NavigationCarouselPage
        items={items}
        activeIndex={0}
        onNavigate={onNavigate}
        itemsPerPage={5}
        setItemsPerPage={setItemsPerPage}
      />
    );

    const nextBtn = screen.getByText('Next');
    fireEvent.click(nextBtn);

    // Should navigate to first item of next page (index 5)
    expect(onNavigate).toHaveBeenCalledWith(5);

    // Rerender on page 2
    rerender(
      <NavigationCarouselPage
        items={items}
        activeIndex={6} // middle of page 2
        onNavigate={onNavigate}
        itemsPerPage={5}
        setItemsPerPage={setItemsPerPage}
      />
    );

    const firstBtn = screen.getByText('First');
    fireEvent.click(firstBtn);

    // Should navigate to first item of first page (index 0)
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  it('disables First and Next buttons correctly', () => {
    const items = createMockItems(12);
    const setItemsPerPage = vi.fn();
    const onNavigate = vi.fn();

    const { rerender } = render(
      <NavigationCarouselPage
        items={items}
        activeIndex={0}
        onNavigate={onNavigate}
        itemsPerPage={5}
        setItemsPerPage={setItemsPerPage}
      />
    );

    const firstBtn = screen.getByText('First') as HTMLButtonElement;
    const nextBtn = screen.getByText('Next') as HTMLButtonElement;

    expect(firstBtn.disabled).toBe(true);
    expect(nextBtn.disabled).toBe(false);

    // Page 3 (last page)
    rerender(
      <NavigationCarouselPage
        items={items}
        activeIndex={11}
        onNavigate={onNavigate}
        itemsPerPage={5}
        setItemsPerPage={setItemsPerPage}
      />
    );

    expect(firstBtn.disabled).toBe(false);
    expect(nextBtn.disabled).toBe(true);
  });

  it('highlights the active item', () => {
    const items = createMockItems(12);
    const setItemsPerPage = vi.fn();
    const onNavigate = vi.fn();

    render(
      <NavigationCarouselPage
        items={items}
        activeIndex={2}
        onNavigate={onNavigate}
        itemsPerPage={5}
        setItemsPerPage={setItemsPerPage}
      />
    );

    const activeButton = screen.getByText('Item 3').closest('button');
    expect(activeButton).toHaveClass('bg-indigo-900/50');

    const inactiveButton = screen.getByText('Item 2').closest('button');
    expect(inactiveButton).not.toHaveClass('bg-indigo-900/50');
  });

  it('calls onNavigate and sets window.location.hash when an item is clicked', () => {
    const items = createMockItems(12);
    const setItemsPerPage = vi.fn();
    const onNavigate = vi.fn();

    render(
      <NavigationCarouselPage
        items={items}
        activeIndex={0}
        onNavigate={onNavigate}
        itemsPerPage={5}
        setItemsPerPage={setItemsPerPage}
      />
    );

    const itemBtn = screen.getByText('Item 4');
    fireEvent.click(itemBtn);

    expect(onNavigate).toHaveBeenCalledWith(3);
    expect(window.location.hash).toBe('#item-3');
  });

  it('calls setItemsPerPage when select value changes', () => {
    const items = createMockItems(12);
    const setItemsPerPage = vi.fn();
    const onNavigate = vi.fn();

    render(
      <NavigationCarouselPage
        items={items}
        activeIndex={0}
        onNavigate={onNavigate}
        itemsPerPage={5}
        setItemsPerPage={setItemsPerPage}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '10' } });

    expect(setItemsPerPage).toHaveBeenCalledWith(10);
  });
});
