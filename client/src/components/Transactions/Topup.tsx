import React, { useState } from 'react';
import checkout from './TranscationshelperFunction';

function Topup() {
  const [amount, setAmount] = useState<number>(49);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTopup = async () => {
    if (amount < 10) {
      setError('Minimum top-up amount is ₹10');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await checkout({ amount, type: 'Topup' });
    } catch (e) {
      console.error('Top-up failed:', e);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-indigo-600">Top-Up Wallet</h1>

      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
        Enter Amount (₹)
      </label>
      <input
        id="amount"
        type="number"
        value={amount}
        min={10}
        step={1}
        className={`w-full p-2 border rounded focus:outline-none focus:ring ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <button
        onClick={handleTopup}
        disabled={isLoading}
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
            Processing…
          </div>
        ) : (
          'Top-Up Now'
        )}
      </button>
    </div>
  );
}

export default Topup;
