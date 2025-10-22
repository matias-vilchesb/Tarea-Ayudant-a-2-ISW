import axios from './root.service.js';
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';






export async function login(dataUser) {
    try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const { email, password } = dataUser;
        const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
    });

        const { token, user } = response.data.data;

        cookies.set('jwt-auth', token, { path: '/' });
        sessionStorage.setItem('usuario', JSON.stringify(user));

        return { token, user, success :true};

    } catch (error) {
        return error.response?.data  || { message: 'Error al conectar con el servidor' };
    }
}

export async function register(data) {
    try {
        const { email, password } = data;
        const response = await axios.post('/auth/register', {
            email,
            password
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al conectar con el servidor' };
    }
}

export async function logout() {
    try {
        sessionStorage.removeItem('usuario');
        cookies.remove('jwt-auth');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}
