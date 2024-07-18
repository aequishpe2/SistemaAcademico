import React, { useState, useEffect } from 'react';
import { getUsers, createUser, editUser, deleteUser } from '../services/userService';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ nombre: '', email: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersData = await getUsers();
    setUsers(usersData);
  };

  const handleCreateUser = async () => {
    await createUser(newUser);
    setNewUser({ nombre: '', email: '', password: '' });
    fetchUsers();
    setUpdateMessage('Usuario creado correctamente.');
  };

  const handleEditUser = async () => {
    await editUser(editingUser);
    setEditingUser(null);
    fetchUsers();
    setShowEditModal(false); // Cerrar el modal después de editar
    setUpdateMessage('Usuario actualizado correctamente.');
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este usuario?')) {
      await deleteUser(id);
      fetchUsers();
      setUpdateMessage('Usuario eliminado correctamente.');
    }
  };

  const handleChangeNewUser = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const startEditingUser = (user) => {
    setEditingUser(user);
    setShowEditModal(true); // Mostrar el modal al iniciar la edición
  };

  return (
    <div>
      {updateMessage && (
        <div className="alert alert-success" role="alert">
          {updateMessage}
        </div>
      )}

      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Nombre"
          name="nombre"
          value={newUser.nombre}
          onChange={handleChangeNewUser}
        />
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          name="email"
          value={newUser.email}
          onChange={handleChangeNewUser}
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Contraseña"
          name="password"
          value={newUser.password}
          onChange={handleChangeNewUser}
        />
        <button className="btn btn-primary mb-2" onClick={handleCreateUser}>
          Crear Usuario
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Contraseña</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>
                <button className="btn btn-warning mr-2" onClick={() => startEditingUser(user)}>
                  Editar
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para editar usuario */}
      {editingUser && (
        <div className="modal fade show" style={{ display: showEditModal ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Usuario</h5>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="editNombre">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editNombre"
                    name="nombre"
                    value={editingUser.nombre}
                    onChange={(e) => setEditingUser({ ...editingUser, [e.target.name]: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="editEmail">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="editEmail"
                    name="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, [e.target.name]: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="editPassword">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="editPassword"
                    name="password"
                    value={editingUser.password}
                    onChange={(e) => setEditingUser({ ...editingUser, [e.target.name]: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleEditUser}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
