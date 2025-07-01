import React, { useEffect, useState } from "react";
import axios from "axios";

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
        const res = await axios.get("/api/v1/pay/balance", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setWallet(res.data.wallet);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to fetch balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (loading) return <div className="text-slate-400 text-sm">Loading...</div>;
  if (error) return <div className="text-red-400 text-sm">{error}</div>;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-slate-600/30 rounded-lg border border-slate-600">
      <div className="flex items-center gap-2">
        <span className="text-lg">💰</span>
        <div className="text-sm">
          <p className="text-slate-300 font-medium">
            {wallet?.balance} {wallet?.currency}
          </p>
          <p className="text-slate-500 text-xs">Wallet Balance</p>
        </div>
      </div>
    </div>
  );
}

export default Balance;
