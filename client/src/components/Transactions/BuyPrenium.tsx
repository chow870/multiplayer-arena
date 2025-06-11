import React, { useState } from 'react';
import checkout from './TranscationshelperFunction';

function BuyPremium() {
  const [amount] = useState<number>(49);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await checkout({ amount, type: 'BuyPremium' });
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold mb-4">Upgrade to Premium</h2>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Premium Plan Price
        </label>
        <input
          type="number"
          disabled
          defaultValue={amount}
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-center cursor-not-allowed"
        />
      </div>

      <button
        onClick={handlePurchase}
        disabled={loading}
        className={`w-full py-2 px-4 rounded font-medium transition duration-300 ${
          loading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? (
          <div className="flex justify-center items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
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
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Processing...
          </div>
        ) : (
          'Buy Premium'
        )}
      </button>

      <p className="mt-4 text-sm text-gray-500">Enjoy ad-free experience & exclusive features</p>
    </div>
  );
}

export default BuyPremium;
