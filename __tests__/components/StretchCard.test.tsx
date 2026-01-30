import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StretchCard from '@/app/components/StretchCard';

describe('StretchCard', () => {
  it('shows a timer when duration includes seconds', () => {
    render(
      <StretchCard
        stretch={{
          name: 'Hamstring Stretch',
          duration: '30 sec each side',
          timerSeconds: 30,
          videoUrl: '',
          tips: '',
        }}
      />
    );

    expect(screen.getByText('0:30')).toBeInTheDocument();
    expect(screen.getByText('Start Timer')).toBeInTheDocument();
  });
});
