
import React from 'react'

function SinglePlayer() {

    async function GameBegin(game : any,gamemode : any) {
        try {

            // here i will write the backend logic
            // i will be sending a post request to submit 
            // create gameLobby mai body mai ye sabh daalna parega.

            // if correct then only i will be navigate to playGames page.
            // there also i will have to create a
            // also there i will give the option to recjoin here.
            // and iss case main , i dont have to make any waiting room
            // main direclty hi bana dunga the lobby, also uss wale page mai event listeners bhi lage honge
            // ussme join and leave game lobby kai event listener hoga

            // navigate (/game: /gamemode: /lobbyId : ) ---> jab bhi re join karega --> uss wakt the backend sai state wapis le aao
            
            
        } catch (error) {
            
        }
        
    }
  return (
    <>
        <button onClick={()=> GameBegin }>Play now !!</button>
    </>
  )
}

export default SinglePlayer