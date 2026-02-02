import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SetDataInput from '@/app/components/SetDataInput';

describe('SetDataInput Component', () => {
  const defaultData = { weight: 135, reps: 10 };

  describe('Rendering', () => {
    it('renders weight and reps inputs', () => {
      render(<SetDataInput data={defaultData} onChange={() => {}} />);
      expect(screen.getByLabelText('Weight (lbs)')).toBeInTheDocument();
      expect(screen.getByLabelText('Reps')).toBeInTheDocument();
    });

    it('renders custom weight unit labels', () => {
      render(<SetDataInput data={defaultData} onChange={() => {}} weightUnit="kg" />);
      expect(screen.getByLabelText('Weight (kg)')).toBeInTheDocument();
    });

    it('displays current weight value', () => {
      render(<SetDataInput data={defaultData} onChange={() => {}} />);
      expect(screen.getByLabelText('Weight (lbs)')).toHaveValue('135');
    });

    it('displays current reps value', () => {
      render(<SetDataInput data={defaultData} onChange={() => {}} />);
      expect(screen.getByLabelText('Reps')).toHaveValue('10');
    });

    it('handles zero values', () => {
      render(<SetDataInput data={{ weight: 0, reps: 0 }} onChange={() => {}} />);
      expect(screen.getByLabelText('Weight (lbs)')).toHaveValue('0');
      expect(screen.getByLabelText('Reps')).toHaveValue('0');
    });
  });

  describe('Weight Input', () => {
    it('calls onChange with new weight when weight changes', () => {
      const onChange = vi.fn();
      render(<SetDataInput data={defaultData} onChange={onChange} />);

      fireEvent.change(screen.getByLabelText('Weight (lbs)'), {
        target: { value: '185' },
      });

      expect(onChange).toHaveBeenCalledWith({ weight: 185, reps: 10 });
    });

    it('sets weight to 0 when input is cleared', () => {
      const onChange = vi.fn();
      render(<SetDataInput data={defaultData} onChange={onChange} />);

      fireEvent.change(screen.getByLabelText('Weight (lbs)'), {
        target: { value: '' },
      });

      expect(onChange).toHaveBeenCalledWith({ weight: 0, reps: 10 });
    });

    it('accepts decimal values for weight', () => {
      const onChange = vi.fn();
      render(<SetDataInput data={defaultData} onChange={onChange} />);

      fireEvent.change(screen.getByLabelText('Weight (lbs)'), {
        target: { value: '135.5' },
      });

      expect(onChange).toHaveBeenCalledWith({ weight: 135.5, reps: 10 });
    });

    it('ignores invalid weight input', () => {
      const onChange = vi.fn();
      render(<SetDataInput data={defaultData} onChange={onChange} />);

      fireEvent.change(screen.getByLabelText('Weight (lbs)'), {
        target: { value: 'abc' },
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Reps Input', () => {
    it('calls onChange with new reps when reps changes', () => {
      const onChange = vi.fn();
      render(<SetDataInput data={defaultData} onChange={onChange} />);

      fireEvent.change(screen.getByLabelText('Reps'), {
        target: { value: '12' },
      });

      expect(onChange).toHaveBeenCalledWith({ weight: 135, reps: 12 });
    });

    it('sets reps to 0 when input is cleared', () => {
      const onChange = vi.fn();
      render(<SetDataInput data={defaultData} onChange={onChange} />);

      fireEvent.change(screen.getByLabelText('Reps'), {
        target: { value: '' },
      });

      expect(onChange).toHaveBeenCalledWith({ weight: 135, reps: 0 });
    });
  });

  describe('Variants', () => {
    it('applies single variant styles by default', () => {
      render(<SetDataInput data={defaultData} onChange={() => {}} />);
      // Single variant uses text-3xl for inputs
      const weightInput = screen.getByLabelText('Weight (lbs)');
      expect(weightInput.className).toContain('text-3xl');
    });

    it('applies b2b variant styles when specified', () => {
      render(<SetDataInput data={defaultData} onChange={() => {}} variant="b2b" />);
      // B2B variant uses text-2xl for inputs
      const weightInput = screen.getByLabelText('Weight (lbs)');
      expect(weightInput.className).toContain('text-2xl');
    });

    it('applies orange accent color by default', () => {
      render(<SetDataInput data={defaultData} onChange={() => {}} />);
      const weightInput = screen.getByLabelText('Weight (lbs)');
      expect(weightInput.className).toContain('focus:ring-orange-500');
    });

    it('applies purple accent color when specified', () => {
      render(<SetDataInput data={defaultData} onChange={() => {}} accentColor="purple" />);
      const weightInput = screen.getByLabelText('Weight (lbs)');
      expect(weightInput.className).toContain('focus:ring-purple-500');
    });
  });
});
