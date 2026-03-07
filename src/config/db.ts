import pkg from 'pg';
import 'dotenv/config';
const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 20, // Máximo de conexiones permitidas en el pool
    idleTimeoutMillis: 30000, // Cierra la conexión si está inactiva por 30s
    connectionTimeoutMillis: 5000, // Espera máxima de 5s para conseguir una conexión nueva
});

export default pool;