import { useState } from 'react';
import './styles.css';

export const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div className="counter" data-testid="counter">
      <h2 className="counter-title" data-testid="counter-title">Counter</h2>
      <div className="counter-display" data-testid="counter-display">
        {count}
      </div>
      <div className="counter-buttons">
        <button
          className="counter-button counter-button--decrement"
          onClick={decrement}
          data-testid="counter-decrement"
        >
          -
        </button>
        <button
          className="counter-button counter-button--reset"
          onClick={reset}
          data-testid="counter-reset"
        >
          Reset
        </button>
        <button
          className="counter-button counter-button--increment"
          onClick={increment}
          data-testid="counter-increment"
        >
          +
        </button>
      </div>
    </div>
  );
};