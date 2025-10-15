"use strict";
import bcrypt from "bcrypt";
import { AppDataSource } from "./configDb.js";
import { User } from "../entities/user.entity.js"


async function encryptPassword(password){
    const saltRounds = 10;
    return await bcrypt.hash(password,saltRounds);
}

export async function createUser() {
    try{
        const userRepository = AppDataSource.getRepository(User);
        const count = await userRepository.count();
        if (count > 0)return;
    
        const now = new Date();

        
        //Crear usuarios iniciales
        await Promise.all([
        userRepository.save(userRepository.create({
            email: "admin@prueba.com",
            password: await encryptPassword("admin123"),
        })),
        userRepository.save(userRepository.create({
            email: "demo1@gmail.com",
            password: await encryptPassword("demo1"),
        })),
    ]);
    console.log("* Usuarios creados exitosamente");
    } catch (error){
        console.error("error al crear usuarios", error);
    }
}
