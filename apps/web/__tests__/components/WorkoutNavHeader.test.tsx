import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WorkoutNavHeader from '@/app/components/WorkoutNavHeader';

// Mock useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('WorkoutNavHeader Component', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  describe('Exit Button', () => {
    it('renders Exit link with correct href', () => {
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl={null}
        />
      );
      const exitLink = screen.getByText('Exit');
      expect(exitLink).toBeInTheDocument();
      expect(exitLink.closest('a')).toHaveAttribute('href', '/workout/test');
    });
  });

  describe('Previous Button', () => {
    it('renders Previous button', () => {
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl={null}
        />
      );
      expect(screen.getByText('← Previous')).toBeInTheDocument();
    });

    it('disables Previous button when no previousUrl and no onPrevious', () => {
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl={null}
        />
      );
      const prevButton = screen.getByText('← Previous');
      expect(prevButton).toBeDisabled();
      expect(prevButton).toHaveClass('text-zinc-600');
    });

    it('enables Previous button when previousUrl is provided', () => {
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl="/workout/test/previous"
        />
      );
      const prevButton = screen.getByText('← Previous');
      expect(prevButton).not.toBeDisabled();
      expect(prevButton).toHaveClass('text-blue-400');
    });

    it('enables Previous button when onPrevious callback is provided', () => {
      const onPrevious = vi.fn();
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl={null}
          onPrevious={onPrevious}
        />
      );
      const prevButton = screen.getByText('← Previous');
      expect(prevButton).not.toBeDisabled();
    });

    it('calls onPrevious callback when clicked (preferred over URL)', () => {
      const onPrevious = vi.fn();
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl="/workout/test/previous"
          onPrevious={onPrevious}
        />
      );
      fireEvent.click(screen.getByText('← Previous'));
      expect(onPrevious).toHaveBeenCalledTimes(1);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('navigates to previousUrl when clicked and no callback', () => {
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl="/workout/test/previous"
        />
      );
      fireEvent.click(screen.getByText('← Previous'));
      expect(mockPush).toHaveBeenCalledWith('/workout/test/previous');
    });
  });

  describe('Skip Button', () => {
    it('does not render skip button by default', () => {
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl={null}
        />
      );
      expect(screen.queryByText(/Skip/)).not.toBeInTheDocument();
    });

    it('renders skip button when skipUrl is provided', () => {
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl={null}
          skipUrl="/workout/test/skip"
        />
      );
      expect(screen.getByText('Skip →')).toBeInTheDocument();
    });

    it('renders skip button when onSkip is provided', () => {
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl={null}
          onSkip={() => {}}
        />
      );
      expect(screen.getByText('Skip →')).toBeInTheDocument();
    });

    it('uses custom skipLabel', () => {
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl={null}
          onSkip={() => {}}
          skipLabel="Skip All"
        />
      );
      expect(screen.getByText('Skip All →')).toBeInTheDocument();
    });

    it('calls onSkip callback when clicked', () => {
      const onSkip = vi.fn();
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl={null}
          onSkip={onSkip}
        />
      );
      fireEvent.click(screen.getByText('Skip →'));
      expect(onSkip).toHaveBeenCalledTimes(1);
    });

    it('navigates to skipUrl when clicked and no callback', () => {
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl={null}
          skipUrl="/workout/test/skip"
        />
      );
      fireEvent.click(screen.getByText('Skip →'));
      expect(mockPush).toHaveBeenCalledWith('/workout/test/skip');
    });
  });

  describe('Next Button (Review Mode)', () => {
    it('does not render Next button by default', () => {
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl={null}
        />
      );
      expect(screen.queryByText(/Next/)).not.toBeInTheDocument();
    });

    it('renders Next button when onNext is provided', () => {
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl={null}
          onNext={() => {}}
        />
      );
      expect(screen.getByText('Next →')).toBeInTheDocument();
    });

    it('uses custom nextLabel', () => {
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl={null}
          onNext={() => {}}
          nextLabel="Continue"
        />
      );
      expect(screen.getByText('Continue →')).toBeInTheDocument();
    });

    it('calls onNext callback when clicked', () => {
      const onNext = vi.fn();
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl={null}
          onNext={onNext}
        />
      );
      fireEvent.click(screen.getByText('Next →'));
      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('shows Next button instead of Skip when both are provided', () => {
      render(
        <WorkoutNavHeader
          exitUrl="/workout/test"
          previousUrl={null}
          onSkip={() => {}}
          skipLabel="Skip"
          onNext={() => {}}
          nextLabel="Next"
        />
      );
      expect(screen.getByText('Next →')).toBeInTheDocument();
      expect(screen.queryByText('Skip →')).not.toBeInTheDocument();
    });
  });
});
