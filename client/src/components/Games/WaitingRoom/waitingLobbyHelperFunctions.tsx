import axios from "axios";
const token = localStorage.getItem('token');

interface deductAmountType {
  amount : number,
  lobbyId:string
}
export const expireWaitingRoom = async ({
  lobbyId,
}: {
  lobbyId: string;
}) => {
  try {
   
    const response = await axios.patch(
      `https://multiplayer-arena-1.onrender.com/api/v1/games/lobby/${lobbyId}/expireWaitingRoom`,
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

export async function deductAmount(lobbyId:string) {

  try {
    const response = await axios.patch(
      `https://multiplayer-arena-1.onrender.com/api/v1/games/lobby/${lobbyId}/deductAmount`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('deduct Amount : ',response.data);
    return response.data;
  } catch (err) {
    console.error('Error expiring waiting room:', err);
    throw err;
  }
  
} 

