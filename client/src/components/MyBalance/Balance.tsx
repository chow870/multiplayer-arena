import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Wallet {
  id: string;
  balance: number;
  currency: string;
  updatedAt: string;
}

function Balance() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get('/api/v1/pay/balance', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setWallet(res.data.wallet);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || 'Failed to fetch balance');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (loading) return <div>Loading balance...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Wallet Balance</h2>
      <p><strong>Balance:</strong> {wallet?.balance} {wallet?.currency}</p>
      <p><strong>Last Updated:</strong> {new Date(wallet?.updatedAt || '').toLocaleString()}</p>
    </div>
  );
}

export default Balance;
