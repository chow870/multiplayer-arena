import React, { useState } from 'react'

function WaitingRoom() {
    const [lobbyDetails, setLobbyDetails] = useState<any>();
    // i will be geting this in the useLocation that will be passed on passing the page
    // issme join_waiting lobby and leave waiting_lobbby events honge
    // jab sare aa jayenge then i will redirect to the next page
    // idhaar we will be creating to create the game_lobby 
    // ussme accoringly game type send karege etc

  return (
    <div>WaitingRoom</div>
  )
}

export default WaitingRoom