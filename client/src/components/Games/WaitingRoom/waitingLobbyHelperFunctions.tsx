import axios from "axios";

export const expireWaitingRoom = async ({
  lobbyId,
}: {
  lobbyId: string;
}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(
      `/api/v1/games/lobby/${lobbyId}/expireWaitingRoom`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error('Error expiring waiting room:', err);
    throw err;
  }
};

