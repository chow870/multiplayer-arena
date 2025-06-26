import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

type Transaction = {
  id: string;
  userId: string;
  user: {
    username: string;
    avatarUrl?: string;
  };
  type: string;
  status: string;
  amount: number;
  createdAt: string;
  orderId?: string;
  referenceId?: string;
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
    const myId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`/api/v1/transactions`,{
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTransactions(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, [myId]);

  useEffect(() => {
    let result = transactions;
    if (status) result = result.filter((tx) => tx.status === status);
    if (type) result = result.filter((tx) => tx.type === type);
    if (dateRange.from && dateRange.to) {
      result = result.filter((tx) => {
        const createdAt = new Date(tx.createdAt);
        return createdAt >= new Date(dateRange.from) && createdAt <= new Date(dateRange.to);
      });
    }
    setFiltered(result);
  }, [status, type, dateRange, transactions]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Transaction History</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Filter by Status</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="FAILED">Failed</option>
        </select>

        <select
          onChange={(e) => setType(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Filter by Type</option>
          <option value="BuyPremium">Buy Premium</option>
          <option value="Bet">Bet</option>
          <option value="Topup">Top-up</option>
        </select>

        <input
          type="date"
          className="p-2 border border-gray-300 rounded"
          onChange={(e) => setDateRange((r) => ({ ...r, from: e.target.value }))}
        />

        <input
          type="date"
          className="p-2 border border-gray-300 rounded"
          onChange={(e) => setDateRange((r) => ({ ...r, to: e.target.value }))}
        />
      </div>

      {/* Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((tx) => (
          <div key={tx.id} className="bg-white shadow-md rounded-xl p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={tx.user.avatarUrl || "/default-avatar.png"}
                alt="avatar"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{tx.user.username}</p>
                <p className="text-sm text-gray-500">User ID: {tx.userId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><strong>Type:</strong> {tx.type}</p>
              <p><strong>Status:</strong> {tx.status}</p>
              <p><strong>Amount:</strong> ₹{tx.amount}</p>
              <p><strong>Date:</strong> {format(new Date(tx.createdAt), "dd MMM yyyy HH:mm")}</p>
              {tx.orderId && <p><strong>Order ID:</strong> {tx.orderId}</p>}
              {tx.referenceId && <p><strong>Reference:</strong> {tx.referenceId}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Bug Report Button */}
      <div className="fixed bottom-4 right-4">
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md flex items-center gap-2">
          🐞 Report a Bug
        </button>
      </div>
    </div>
  );
};

export default TransactionList;