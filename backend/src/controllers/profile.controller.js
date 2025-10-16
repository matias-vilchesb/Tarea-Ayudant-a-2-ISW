import { handleSuccess } from "../Handlers/responseHandlers.js";
import { AppDataSource } from "../config/configDb.js";
import bcrypt from "bcrypt";
import { User } from "../entities/user.entity.js";
import { usuariovalidation } from "../validations/usuario.validation.js";



export async function updateProfile(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userId = req.user.sub;
    const { email, password } = req.body;

    // Requerir al menos un campo para actualizar
    if (!email && !password) {
      return res.status(400).json({ message: "Debe enviar email y/o password para actualizar." });
    }

    // Validar permitiendo campos opcionales (si tu esquema soporta opciones)
    const { error } = usuariovalidation.validate({ email, password }, { presence: "optional" });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await userRepository.save(user);

    return res.status(200).json({ message: "Perfil actualizado correctamente", data: { email: user.email, id: user.id } });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al actualizar perfil", error: error.message });
  }
}

export async function deleteProfile(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userId = req.user.sub;
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await userRepository.remove(user);
    return res.status(200).json({ message: "Perfil eliminado correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar perfil", error: error.message });
  }
}

export async function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export async function getPrivateProfile(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userId = req.user.sub;
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // No devolver la contraseña
    const { password, ...userSafe } = user;
    handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
      message: `Perfil privado obtenido`,
      userData: userSafe,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener perfil privado", error: error.message });
  }
}