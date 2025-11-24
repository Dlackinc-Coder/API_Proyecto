// generate_hash.js
import bcrypt from 'bcrypt';

// 🚨 1. DEFINE LA NUEVA CONTRASEÑA AQUÍ 🚨
const NUEVA_CONTRASENA = 'analaura2016'; 

const generateHash = async () => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(NUEVA_CONTRASENA, salt);
        
        console.log("=========================================");
        console.log(`Contraseña: ${NUEVA_CONTRASENA}`);
        console.log(`Hash cifrado (CÓPIALO):`);
        console.log(hash);
        console.log("=========================================");
        
    } catch (error) {
        console.error('Error al generar el hash:', error);
    }
};

generateHash();
