import React, { useState, useEffect } from 'react';
import { getCourses, createCourse, editCourse, deleteCourse } from '../services/courseService';
import 'bootstrap/dist/css/bootstrap.min.css';

const CourseTable = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ nombre: '' });
  const [editingCourse, setEditingCourse] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const coursesData = await getCourses();
    setCourses(coursesData);
  };

  const handleCreateCourse = async () => {
    await createCourse(newCourse);
    setNewCourse({ nombre: '' });
    fetchCourses();
    setUpdateMessage('Curso creado correctamente.');
  };

  const handleEditCourse = async () => {
    await editCourse(editingCourse);
    setEditingCourse(null);
    fetchCourses();
    setShowEditModal(false); // Cerrar el modal después de editar
    setUpdateMessage('Curso actualizado correctamente.');
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este curso?')) {
      await deleteCourse(id);
      fetchCourses();
      setUpdateMessage('Curso eliminado correctamente.');
    }
  };

  const handleChangeNewCourse = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const startEditingCourse = (course) => {
    setEditingCourse(course);
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
          placeholder="Nombre del Curso"
          name="nombre"
          value={newCourse.nombre}
          onChange={handleChangeNewCourse}
        />
        <button className="btn btn-primary mb-2" onClick={handleCreateCourse}>
          Crear Curso
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.nombre}</td>
              <td>
                <button className="btn btn-warning mr-2" onClick={() => startEditingCourse(course)}>
                  Editar
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteCourse(course.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para editar curso */}
      {editingCourse && (
        <div className="modal fade show" style={{ display: showEditModal ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Curso</h5>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="editNombre">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editNombre"
                    name="nombre"
                    value={editingCourse.nombre}
                    onChange={(e) => setEditingCourse({ ...editingCourse, [e.target.name]: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleEditCourse}>
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

export default CourseTable;
