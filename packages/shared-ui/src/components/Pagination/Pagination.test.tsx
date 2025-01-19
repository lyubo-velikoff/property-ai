import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';
import { vi } from 'vitest';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
  });

  it('shows correct page info', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} />);
    const prevButton = screen.getByLabelText('Предишна');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    const nextButton = screen.getByLabelText('Следваща');
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange when clicking next', () => {
    render(<Pagination {...defaultProps} />);
    const nextButton = screen.getByLabelText('Следваща');
    fireEvent.click(nextButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking previous', () => {
    render(<Pagination {...defaultProps} currentPage={2} />);
    const prevButton = screen.getByLabelText('Предишна');
    fireEvent.click(prevButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange when clicking a page number', () => {
    render(<Pagination {...defaultProps} />);
    const pageButton = screen.getByText('3');
    fireEvent.click(pageButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
  });

  it('shows ellipsis for many pages', () => {
    render(<Pagination {...defaultProps} totalPages={10} />);
    const ellipses = screen.getAllByText('...');
    expect(ellipses).toHaveLength(1);
  });

  it('handles custom labels', () => {
    const customLabels = {
      previous: 'Previous',
      next: 'Next'
    };
    render(<Pagination {...defaultProps} buttonLabels={customLabels} />);
    expect(screen.getByLabelText('Previous')).toBeInTheDocument();
    expect(screen.getByLabelText('Next')).toBeInTheDocument();
  });
}); 
