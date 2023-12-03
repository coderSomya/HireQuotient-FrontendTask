import React, { useState, useEffect } from 'react';
import "./App.css"
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const handleDeleteUser = (id: string) => {
    setUsers(prevUsers => 
      prevUsers.filter(user => user.id !== id)
    );
  }

  const handleEditClick = (id: string) => {
    setEditingUserId(id);
  }  

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === editingUserId 
          ? {...user, [name]: value}
          : user
      )  
    );
  }

  useEffect(() => {
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  const displayUsers = filteredUsers.slice((page - 1) * 10, page * 10);

  return (
    <div className='overall'>
      <input 
        type="text" 
        placeholder="Search" 
        className="search-input"
        onChange={e => setSearch(e.target.value)} 
      />

      <table className='user-table'>
        <thead className='user-thead'>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Delete / Edit</th>
          </tr>
        </thead>  
        <tbody className='user-tbody'>
          {displayUsers.map(user => (
            <tr key={user.id} className='user-row'
            >
              {editingUserId === user.id ?

(
              <> <div>
                <td>
                  <input 
                    value={user.name}
                    name="name"
                    className='editing-user-name'
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <input
                    value={user.email} 
                    name="email"
                    onChange={handleEditChange}
                    className='editing-user-email'
                  />
                </td>
                </div>
              </>
            ) :    
              (
                <>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
          
                <button className="delete" onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td></>)}
              <>
              {editingUserId === user.id ? (
                <button className="save" onClick={() => setEditingUserId(null)}>
                  Save
                </button>  
              ) : (
                <button onClick={() => handleEditClick(user.id)} className='edit'>
                  Edit  
                </button>
              )}</>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button 
          className="first-page"
          onClick={() => setPage(1)}
        >
          First
        </button>
        <button
          className="previous-page"
          onClick={() => setPage(page - 1)}  
        >
          Prev
        </button>

        <div>
          Page {page} of {Math.ceil(filteredUsers.length / 10)}  
        </div>

        <button
          className="next-page"
          onClick={() => setPage(page + 1)} 
        >
          Next
        </button>
        <button
          className="last-page" 
          onClick={() => setPage(Math.ceil(filteredUsers.length / 10))}  
        >
          Last
        </button>
      </div>
    </div>
  );
}

export default App;