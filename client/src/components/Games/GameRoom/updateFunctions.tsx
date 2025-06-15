import axios from "axios";

export const declareWinner = async ({
  gameId,
  winnerId,
}: {
  gameId: string;
  winnerId: string;
}) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.patch(
      `/api/v1/games/Gamelobby/${gameId}/updateWinner`,
      {
        winnerId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error('Error updating winner:', err);
    throw err;
  }
};

export const updateGameMove = async ({
  gameId,
  currentState,
  currentPalyerId,
  index, 
  totalPlayer

}: {
  gameId: string;
  currentState: Record<string, number>;
  currentPalyerId: string;
  index: number;
  totalPlayer: number;
  // nextTurn: number;
}) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.patch(
      `/api/v1/games/Gamelobby/${gameId}/updateGameState`,
      {
        currentState,
        currentPalyerId,
        index, 
        totalPlayer

      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error('Error updating game state:', err);
    throw err;
  }
};