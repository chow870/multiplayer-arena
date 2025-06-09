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
  nextTurn,
}: {
  gameId: string;
  currentState: Record<string, number>;
  nextTurn: number;
}) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.patch(
      `/api/v1/games/Gamelobby/${gameId}/updateGameState`,
      {
        currentState,
        nextTurn,
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