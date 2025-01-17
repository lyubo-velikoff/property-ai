import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders pagination controls when totalPages is greater than 1', () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />
    );
    expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />
    );
    const prevButton = screen.getByLabelText('Предишна');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination currentPage={3} totalPages={3} onPageChange={() => {}} />
    );
    const nextButton = screen.getByLabelText('Следваща');
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange with correct page number when clicking next', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={handlePageChange} />
    );
    
    const nextButton = screen.getByLabelText('Следваща');
    fireEvent.click(nextButton);
    
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with correct page number when clicking previous', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={handlePageChange} />
    );
    
    const prevButton = screen.getByLabelText('Предишна');
    fireEvent.click(prevButton);
    
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it('displays custom button labels when provided', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={() => {}}
        buttonLabels={{ previous: 'Prev', next: 'Next' }}
      />
    );
    
    const prevButton = screen.getByLabelText('Prev');
    const nextButton = screen.getByLabelText('Next');
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('displays custom page info text when provided', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={() => {}}
        pageInfoText={{ page: 'Page', of: 'of' }}
      />
    );
    
    const pageInfo = container.querySelector('p');
    expect(pageInfo).toHaveTextContent('Page 1 of 3');
  });

  it('hides page info when showPageInfo is false', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={() => {}}
        showPageInfo={false}
      />
    );
    
    expect(container.textContent).not.toContain('Страница');
    expect(container.textContent).not.toContain('от');
  });
}); 
