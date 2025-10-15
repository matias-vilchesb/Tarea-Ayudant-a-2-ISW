"use strict";
import Joi from "joi";


export const usuariovalidation = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.empty": "El email no puede estar vacío",
            "string.email": "El email debe ser una dirección de correo electrónico válida",
            "any.required": "El email es obligatorio",})
    ,
    password: Joi.string()
        .min(8)
        .max(30)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,30}$"))
        .required()
        .messages({
            "string.empty": "La contraseña no puede estar vacía",
            "string.min": "La contraseña debe tener al menos 8 caracteres",
            "string.max": "La contraseña no debe exceder los 30 caracteres",
            "string.pattern.base": "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número",
            "any.required": "La contraseña es obligatoria",})
})
