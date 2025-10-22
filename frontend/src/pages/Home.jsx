import { useState } from 'react';
import Cookies from 'js-cookie';
import axios from '../services/root.service.js';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({email: '',password: '',});
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  
  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleGet = async () => {
    const token = Cookies.get('jwt-auth');
    console.log('Token retrieved from cookies:', token);
    if (!token) {
      alert('No se encontró el token.');
      return;
    } 
    setIsEditing(false);
    try {
      const response = await axios.get(`${API_URL}/profile/private`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      setProfileData(response.data);
      alert('Perfil obtenido con éxito.');
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      alert('Error al obtener el perfil.');
    }
  };

  const handleEdit = async () => {
    const token = Cookies.get('jwt-auth');
    if (!token) {
      alert('No se encontró el token.');
      return;
    }
    // obtengo datos del perfil
    try {
      const response = await axios.get(`${API_URL}/profile/private`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      const { email} = response.data;
      setEditForm({ email: email || '', password: '' });
      setIsEditing(true);
      alert('Perfil obtenido para edición');
    } catch (error) {
      console.error('Error al obtener el perfil para edición:', error);
      alert('Error al obtener el perfil para edición.');
    }
  };
  
  

  const handleUpdate = async () => {
    const token = Cookies.get('jwt-auth');
    if (!token) {
      alert('No se encontró el token.');
      return;
    }
    const updatedData = {};

    if (editForm.email) {
        updatedData.email = editForm.email;
    }
   
    if (editForm.password) {
        updatedData.password = editForm.password;
    }
    
    if (Object.keys(updatedData).length === 0) {
        alert('No hay datos para actualizar.');
        return;
    }
    try {
      const response = await axios.patch(`${API_URL}/profile/private`, updatedData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      setProfileData(response.data);
      setIsEditing(false);
      setEditForm({ email: '', password: '' }); // que quede vacio
      alert('Perfil actualizado con éxito.');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Error al actualizar el perfil.');
    }
  };



  const handleDelete = async () => {
    const token = Cookies.get('jwt-auth');
    if (!token) {
      alert('No se encontró el token.');
      return;
    }
    try {
      const response = await axios.delete(`${API_URL}/profile/private`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      alert('Perfil eliminado con éxito.');
      // borrar todo para que funcione el navigate
      setProfileData(null); 
      Cookies.remove('jwt-auth', { path: '/' });
      navigate('/');
    } catch (error) {
      console.error('Error al eliminar el perfil:', error);
      alert('Error al eliminar el perfil.');
    }
  }
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-2xl transform transition-all hover:scale-105">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Página de Perfil
        </h1>
        
        {/* version editando*/}
        {isEditing && (
            <div className="mb-8 p-6 bg-indigo-50 rounded-xl shadow-inner border border-indigo-200">
                <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Editar Perfil</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Nuevo Email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full mb-3 p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Nueva Contraseña (dejar vacío para no cambiar)"
                    value={editForm.password}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                />
                <div className='flex space-x-4'>
                    <button 
                        onClick={handleUpdate} 
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                    >
                        Guardar Cambios
                    </button>
                    <button 
                        onClick={() => setIsEditing(false)} 
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        )}
        <div className="space-y-4">
            <button 
                onClick={handleGet} 
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300"
            >
                Obtener/Refrescar Perfil
            </button>
            <button 
                onClick={handleEdit} 
                // desactivar el editando
                disabled={isEditing} 
                className={`w-full font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 ${
                    isEditing 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white focus:ring-blue-300'
                }`}
            >
                Editar Perfil
            </button>

            <button 
                onClick={handleDelete} 
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300"
            >
                Borrar Perfil
            </button>
        </div>

        {profileData && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Datos del Perfil Obtenido:</h2>
            <pre className="text-sm text-gray-700 overflow-auto bg-white p-4 rounded-lg border">
                {JSON.stringify(profileData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
