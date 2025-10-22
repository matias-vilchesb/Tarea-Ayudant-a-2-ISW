import axios from "./root.service.js";

export async function getProfile() {
  try {
    const response = await axios.get('/profile/private');
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "Error al obtener perfil" };
  }
}

export async function eliminarPerfil(token) {
  const res = await fetch(`${BASE_URL}/profile/private`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export const logOut = () => {
  // borra cookies
  Cookies.remove("jwt-auth", { path: '/' }); 
  
  //manda para el login
  window.location.href = '/login';
};

export const editarPerfil = async (dataUser) => {
  try {
    const response = await axios.get(`/profile/private/`, dataUser);  
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener usuario'
    };
  }
};



export const updatePerfil = async ( dataUser) => {
  try {
    const response = await axios.patch(`/profile/private/`, dataUser);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar usuario'
    };
  }
};


export const deletePerfil = async (dataUser) => {
  try {
    const response = await axios.delete(`/profile/private/`,dataUser);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar piloto'
    };
  }
};