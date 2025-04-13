import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    id: string;
    username: string;
    avatarUrl: string; // Assuming you have an avatar URL for each user 
}

function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 0) {
      console.log(localStorage.getItem('token'));
      setLoading(true);
      axios.post(
        '/api/v1/search-users',
        { username: searchTerm }, // <-- actual request body
        {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      ).then((response) => {
          setUsers(response.data.users);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
          setLoading(false);
        });
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

// edited the RequestToadd function to use the correct endpoint and request body : 13/4/2025
    const RequestToadd = async (userId: string) => {
        try {
        const response = await axios.post('/api/v1/add-friend',  {friendId: userId },{
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.status === 200) {
            console.log('Friend request sent successfully');
        } else {
            console.error('Failed to send friend request');
            alert('Failed to send friend request');
        }
        } catch (error) {
        console.error('Error sending friend request:', error);
        alert('Error sending friend request');
        }
    };

    const handleAddFriend = (userId: string) => {
        RequestToadd(userId);
    };


  return (
    <div>
      <input
        type="text"
        placeholder="Search for users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <img src={user.avatarUrl} alt={user.username} />
            <span>{user.username}</span>
            <button id={`${user.id}`} onClick={() => handleAddFriend(user.id)}>+Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchUsers;
