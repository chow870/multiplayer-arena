// FriendMode.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { socket } from '../../../socket/socket';
import { useSelector } from 'react-redux';

interface FriendObj {
  id: string;
  username: string;
  avatarUrl?: string;
}

function FriendMode() {
  // Full list of friends (accepted)
  const [friends, setFriends] = useState<FriendObj[]>([]);
  // Currently selected for invitation
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const gameType = useSelector((s: any) => s.selectedGameRecord.selectedGameId);
  const betAmount = useSelector((s :any)=>s.selectedGameRecord.betAmount)
  const myId = localStorage.getItem('userId')!;

  // Fetch accepted friends
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const  resp  = await axios.get('https://multiplayer-arena-1.onrender.com/api/v1/friendships', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        // Transform to user objects, excluding yourself
        console.log("the friends that i have frinds as : ", resp)
        let data = resp.data;
        const list: FriendObj[] = [];
        data.acceptedFriends.forEach((f: any) => {
          const candidates = [
            { id: f.senderid, username: f.sendername, avatarUrl: f.avatarUrlSender },
            { id: f.receiverid, username: f.receivername, avatarUrl: f.avatarUrlReceiver }
          ];
          for (const c of candidates) {
            if (c.id !== myId && !list.find(u => u.id === c.id)) {
              list.push(c);
            }
          }
        });
        console.log("on the friend Mode : ", list);
        setFriends(list);
      } catch (e) {
        console.error('Error fetching friends:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [myId]);

  // Select / Deselect friend
  const toggleSelect = (id: string) => {
    setSelectedIds(ids =>
      ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
    );
  };

  // Send invites to all selected
  const sendInvites = async () => {
    if (selectedIds.length === 0) return;

    try {
      // 1) Create Game Lobby : 
      const { data: create } = await axios.post(
        'https://multiplayer-arena-1.onrender.com/api/v1/games/createGame',
        { invitedUserIds: selectedIds, gameType,betAmount },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      const lobbyId = create.id;


      // 2) Send invites
      let resp = await axios.post(
        'https://multiplayer-arena-1.onrender.com/api/v1/games/invite',
        { invitedUserIds: selectedIds, gameMode :"FRIEND",gameLobbyId: lobbyId,betAmount },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // 3) Notify via socket
      console.log('Invites sent: from the frontend and to the waiting lobby', resp.data);
      selectedIds.forEach(id => {
        socket.emit('lobbyCreated', { lobbyId: resp.data.lobbyId, invitedUserId: id });
      });
      socket.emit('lobbyCreatedSelf', {lobbyId: resp.data.lobbyId});

      alert('Invites sent!');
      setSelectedIds([]);
    } catch (e) {
      console.error('Error sending invites:', e);
      alert('Failed to send invites.');
    }
  };

  if (isLoading) return <div>Loading friends…</div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Select Friends to Invite</h2>

      {/* Selected Chips */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedIds.map(id => {
            const friend = friends.find(f => f.id === id)!;
            return (
              <div
                key={id}
                className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
              >
                <span className="mr-2">{friend.username}</span>
                <button
                  onClick={() => toggleSelect(id)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Friends List */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
        {friends.map(friend => {
          const selected = selectedIds.includes(friend.id);
          return (
            <li
              key={friend.id}
              onClick={() => toggleSelect(friend.id)}
              className={`flex items-center justify-between p-3 border rounded cursor-pointer transition ${
                selected ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={friend.avatarUrl || '/default-avatar.png'}
                  alt={friend.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{friend.username}</span>
              </div>
              <div>
                {selected ? (
                  <span className="text-blue-600 font-semibold">Selected</span>
                ) : (
                  <span className="text-gray-400">Tap to select</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Invite Button */}
      <button
        onClick={sendInvites}
        disabled={selectedIds.length === 0}
        className="w-full mt-4 bg-green-600 text-white py-2 rounded disabled:opacity-50"
      >
        Invite {selectedIds.length} Friend
        {selectedIds.length > 1 && 's'}
      </button>
    </div>
  );
}

export default FriendMode;
