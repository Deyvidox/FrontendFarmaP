import React, { useEffect, useState } from 'react';
import { CContainer } from '@coreui/react';
import UserList from "./UserList";
import { getUsers } from 'src/services/api';
import '../../css/users/Users.css';

const Users = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getUsers();
        setUsuarios(response?.message?.users || []);
      } catch (err) {
        console.error('Error cargando usuarios:', err);
        setError(err.message || 'Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <CContainer fluid className="users-container">
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <UserList users={usuarios} />
      )}
    </CContainer>
  );
};

export default Users;