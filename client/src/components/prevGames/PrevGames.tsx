import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

type GameRecord = {
  id: string;
  gameType: string;
  invitedUserIds: string[];
  createdAt: string;
  endedAt?: string;
  betAmount : number;
  gameState: "WAITING" | "ACTIVE" | "COMPLETED" | "EXPIRED" | "ABORTED";
  winner?: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  player: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
};

const GameRecordList = () => {
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [filtered, setFiltered] = useState<GameRecord[]>([]);
  const [gameType, setGameType] = useState("");
  const [gameState, setGameState] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  useEffect(() => {
    console.log('the token is', localStorage.getItem('token'));
    const fetchRecords = async () => {
      try {
        const res = await axios.get("/api/v1/gamerecords", {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setRecords(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.log("Failed to fetch game records:", error);
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    let result = records;

    if (gameType) result = result.filter((r) => r.gameType === gameType);
    if (gameState) result = result.filter((r) => r.gameState === gameState);

    if (dateRange.from && dateRange.to) {
      result = result.filter((r) => {
        const createdAt = new Date(r.createdAt);
        return (
          createdAt >= new Date(dateRange.from) &&
          createdAt <= new Date(dateRange.to)
        );
      });
    }

    setFiltered(result);
  }, [gameType, gameState, dateRange, records]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Your Game History</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          onChange={(e) => setGameType(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Filter by Game Type</option>
          <option value="snakes_ladders">Snakes & Ladders</option>
          <option value="ludo">Ludo</option>
          {/* Add other game types as needed */}
        </select>

        <select
          onChange={(e) => setGameState(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Filter by Game State</option>
          <option value="WAITING">Waiting</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="EXPIRED">Expired</option>
          <option value="ABORTED">Aborted</option>
        </select>

        <input
          type="date"
          className="p-2 border border-gray-300 rounded"
          onChange={(e) =>
            setDateRange((r) => ({ ...r, from: e.target.value }))
          }
        />

        <input
          type="date"
          className="p-2 border border-gray-300 rounded"
          onChange={(e) => setDateRange((r) => ({ ...r, to: e.target.value }))}
        />
      </div>

      {/* Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((g) => (
          <div key={g.id} className="bg-white shadow-md rounded-xl p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={g.player.avatarUrl || "/default-avatar.png"}
                alt="avatar"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{g.player.username}</p>
                <p className="text-sm text-gray-500">Game Type: {g.gameType}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><strong>Status:</strong> {g.gameState}</p>
              <p><strong>Created:</strong> {format(new Date(g.createdAt), "dd MMM yyyy HH:mm")}</p>
              {g.endedAt && (
                <p><strong>Ended:</strong> {format(new Date(g.endedAt), "dd MMM yyyy HH:mm")}</p>
              )}
              <p><strong>Invited:</strong> {g.invitedUserIds.join(", ")}</p>
              {g.winner && <p><strong>Winner:</strong> {g.winner.username}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameRecordList;
