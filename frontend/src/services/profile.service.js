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