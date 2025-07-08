import axios from "axios";

// wiil move this to the backend.
// yaha security break ho sakta tha. 
export const getWinner = async ({
  gameId,
  // winnerId,
}: {
  gameId: string;
  // winnerId: string;
}) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.get(
      `https://multiplayer-arena-1.onrender.com/api/v1/games/Gamelobby/${gameId}/getWinner`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("the winner data is  :", response.data)
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
      `https://multiplayer-arena-1.onrender.com/api/v1/games/Gamelobby/${gameId}/updateGameState`,
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