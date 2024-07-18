import axios from 'axios';

const api = 'http://localhost:8001/api/usuarios';

export const getUsers = async () => {
  const response = await axios.get(api);
  return response.data;
};

export const createUser = async (user) => {
  await axios.post(api + '/guardar', user);
};

export const editUser = async (user) => {
  await axios.put(api + `/editar/${user.id}`, user);
};

export const deleteUser = async (id) => {
  await axios.delete(api + `/eliminar/${id}`);
};
