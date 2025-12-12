import { fireEvent, render, screen } from '@testing-library/react';

import { Counter } from '../../../components/Counter/Counter';

describe('Counter Component', () => {
	describe('Initial Render', () => {
		it('should render counter component', () => {
			render(<Counter />);
			expect(screen.getByTestId('counter')).toBeInTheDocument();
		});

		it('should display title', () => {
			render(<Counter />);
			expect(screen.getByTestId('counter-title')).toHaveTextContent('Counter');
		});

		it('should initialize with zero', () => {
			render(<Counter />);
			expect(screen.getByTestId('counter-display')).toHaveTextContent('0');
		});

		it('should render all control buttons', () => {
			render(<Counter />);
			expect(screen.getByTestId('counter-increment')).toBeInTheDocument();
			expect(screen.getByTestId('counter-decrement')).toBeInTheDocument();
			expect(screen.getByTestId('counter-reset')).toBeInTheDocument();
		});

		it('should have correct button labels', () => {
			render(<Counter />);
			expect(screen.getByTestId('counter-increment')).toHaveTextContent('+');
			expect(screen.getByTestId('counter-decrement')).toHaveTextContent('-');
			expect(screen.getByTestId('counter-reset')).toHaveTextContent('Reset');
		});
	});

	describe('Increment Functionality', () => {
		it('should increment counter by one when increment button is clicked', () => {
			render(<Counter />);

			fireEvent.click(screen.getByTestId('counter-increment'));
			expect(screen.getByTestId('counter-display')).toHaveTextContent('1');
		});

		it('should increment multiple times', () => {
			render(<Counter />);

			fireEvent.click(screen.getByTestId('counter-increment'));
			fireEvent.click(screen.getByTestId('counter-increment'));
			fireEvent.click(screen.getByTestId('counter-increment'));
			expect(screen.getByTestId('counter-display')).toHaveTextContent('3');
		});

		it('should handle rapid increment clicks', () => {
			render(<Counter />);

			const incrementBtn = screen.getByTestId('counter-increment');
			for (let i = 0; i < 10; i++) {
				fireEvent.click(incrementBtn);
			}
			expect(screen.getByTestId('counter-display')).toHaveTextContent('10');
		});

		it('should increment to positive numbers', () => {
			render(<Counter />);

			const incrementBtn = screen.getByTestId('counter-increment');
			for (let i = 0; i < 50; i++) {
				fireEvent.click(incrementBtn);
			}
			expect(screen.getByTestId('counter-display')).toHaveTextContent('50');
		});
	});

	describe('Decrement Functionality', () => {
		it('should decrement counter by one when decrement button is clicked', () => {
			render(<Counter />);

			fireEvent.click(screen.getByTestId('counter-decrement'));
			expect(screen.getByTestId('counter-display')).toHaveTextContent('-1');
		});

		it('should decrement multiple times', () => {
			render(<Counter />);

			fireEvent.click(screen.getByTestId('counter-decrement'));
			fireEvent.click(screen.getByTestId('counter-decrement'));
			fireEvent.click(screen.getByTestId('counter-decrement'));
			expect(screen.getByTestId('counter-display')).toHaveTextContent('-3');
		});

		it('should handle rapid decrement clicks', () => {
			render(<Counter />);

			const decrementBtn = screen.getByTestId('counter-decrement');
			for (let i = 0; i < 10; i++) {
				fireEvent.click(decrementBtn);
			}
			expect(screen.getByTestId('counter-display')).toHaveTextContent('-10');
		});

		it('should decrement to negative numbers', () => {
			render(<Counter />);

			const decrementBtn = screen.getByTestId('counter-decrement');
			for (let i = 0; i < 50; i++) {
				fireEvent.click(decrementBtn);
			}
			expect(screen.getByTestId('counter-display')).toHaveTextContent('-50');
		});
	});

	describe('Reset Functionality', () => {
		it('should reset counter to zero from positive number', () => {
			render(<Counter />);

			fireEvent.click(screen.getByTestId('counter-increment'));
			fireEvent.click(screen.getByTestId('counter-increment'));
			fireEvent.click(screen.getByTestId('counter-reset'));
			expect(screen.getByTestId('counter-display')).toHaveTextContent('0');
		});

		it('should reset counter to zero from negative number', () => {
			render(<Counter />);

			fireEvent.click(screen.getByTestId('counter-decrement'));
			fireEvent.click(screen.getByTestId('counter-decrement'));
			fireEvent.click(screen.getByTestId('counter-reset'));
			expect(screen.getByTestId('counter-display')).toHaveTextContent('0');
		});

		it('should reset counter when already at zero', () => {
			render(<Counter />);

			fireEvent.click(screen.getByTestId('counter-reset'));
			expect(screen.getByTestId('counter-display')).toHaveTextContent('0');
		});

		it('should reset after multiple operations', () => {
			render(<Counter />);

			fireEvent.click(screen.getByTestId('counter-increment'));
			fireEvent.click(screen.getByTestId('counter-increment'));
			fireEvent.click(screen.getByTestId('counter-decrement'));
			fireEvent.click(screen.getByTestId('counter-reset'));
			expect(screen.getByTestId('counter-display')).toHaveTextContent('0');
		});
	});

	describe('Combined Operations', () => {
		it('should handle increment then decrement', () => {
			render(<Counter />);

			fireEvent.click(screen.getByTestId('counter-increment'));
			fireEvent.click(screen.getByTestId('counter-increment'));
			fireEvent.click(screen.getByTestId('counter-decrement'));
			expect(screen.getByTestId('counter-display')).toHaveTextContent('1');
		});

		it('should handle decrement then increment', () => {
			render(<Counter />);

			fireEvent.click(screen.getByTestId('counter-decrement'));
			fireEvent.click(screen.getByTestId('counter-decrement'));
			fireEvent.click(screen.getByTestId('counter-increment'));
			expect(screen.getByTestId('counter-display')).toHaveTextContent('-1');
		});

		it('should handle complex sequence of operations', () => {
			render(<Counter />);

			fireEvent.click(screen.getByTestId('counter-increment'));
			fireEvent.click(screen.getByTestId('counter-increment'));
			fireEvent.click(screen.getByTestId('counter-increment'));
			fireEvent.click(screen.getByTestId('counter-decrement'));
			fireEvent.click(screen.getByTestId('counter-increment'));
			fireEvent.click(screen.getByTestId('counter-decrement'));
			fireEvent.click(screen.getByTestId('counter-decrement'));
			expect(screen.getByTestId('counter-display')).toHaveTextContent('1');
		});

		it('should maintain correct state after reset and new operations', () => {
			render(<Counter />);

			fireEvent.click(screen.getByTestId('counter-increment'));
			fireEvent.click(screen.getByTestId('counter-increment'));
			fireEvent.click(screen.getByTestId('counter-reset'));
			fireEvent.click(screen.getByTestId('counter-decrement'));
			expect(screen.getByTestId('counter-display')).toHaveTextContent('-1');
		});

		it('should handle multiple resets in sequence', () => {
			render(<Counter />);

			fireEvent.click(screen.getByTestId('counter-increment'));
			fireEvent.click(screen.getByTestId('counter-reset'));
			fireEvent.click(screen.getByTestId('counter-reset'));
			fireEvent.click(screen.getByTestId('counter-reset'));
			expect(screen.getByTestId('counter-display')).toHaveTextContent('0');
		});
	});

	describe('Edge Cases', () => {
		it('should handle alternating increment and decrement', () => {
			render(<Counter />);

			for (let i = 0; i < 10; i++) {
				fireEvent.click(screen.getByTestId('counter-increment'));
				fireEvent.click(screen.getByTestId('counter-decrement'));
			}
			expect(screen.getByTestId('counter-display')).toHaveTextContent('0');
		});

		it('should handle large positive numbers', () => {
			render(<Counter />);

			const incrementBtn = screen.getByTestId('counter-increment');
			for (let i = 0; i < 100; i++) {
				fireEvent.click(incrementBtn);
			}
			expect(screen.getByTestId('counter-display')).toHaveTextContent('100');
		});

		it('should handle large negative numbers', () => {
			render(<Counter />);

			const decrementBtn = screen.getByTestId('counter-decrement');
			for (let i = 0; i < 100; i++) {
				fireEvent.click(decrementBtn);
			}
			expect(screen.getByTestId('counter-display')).toHaveTextContent('-100');
		});

		it('should maintain state through many operations', () => {
			render(<Counter />);

			const incrementBtn = screen.getByTestId('counter-increment');
			const decrementBtn = screen.getByTestId('counter-decrement');

			for (let i = 0; i < 25; i++) {
				fireEvent.click(incrementBtn);
			}
			for (let i = 0; i < 10; i++) {
				fireEvent.click(decrementBtn);
			}
			expect(screen.getByTestId('counter-display')).toHaveTextContent('15');
		});
	});

	describe('Button Accessibility', () => {
		it('should have correct button types', () => {
			render(<Counter />);
			expect(screen.getByTestId('counter-increment')).toHaveAttribute('type', 'button');
			expect(screen.getByTestId('counter-decrement')).toHaveAttribute('type', 'button');
			expect(screen.getByTestId('counter-reset')).toHaveAttribute('type', 'button');
		});

		it('should render buttons with proper classes', () => {
			render(<Counter />);
			expect(screen.getByTestId('counter-increment')).toHaveClass(
				'counter-button',
				'counter-button--increment',
			);
			expect(screen.getByTestId('counter-decrement')).toHaveClass(
				'counter-button',
				'counter-button--decrement',
			);
			expect(screen.getByTestId('counter-reset')).toHaveClass(
				'counter-button',
				'counter-button--reset',
			);
		});
	});

	describe('Component Structure', () => {
		it('should render with correct main class', () => {
			render(<Counter />);
			expect(screen.getByTestId('counter')).toHaveClass('counter');
		});

		it('should render title with correct class', () => {
			render(<Counter />);
			expect(screen.getByTestId('counter-title')).toHaveClass('counter-title');
		});

		it('should render display with correct class', () => {
			render(<Counter />);
			expect(screen.getByTestId('counter-display')).toHaveClass('counter-display');
		});

		it('should have buttons container', () => {
			const { container } = render(<Counter />);
			const buttonsContainer = container.querySelector('.counter-buttons');
			expect(buttonsContainer).toBeInTheDocument();
		});
	});
});
