import DireccionesEnvio from "../models/direcciones.js";
import Clientes from "../models/clientes.js";

class DireccionesController {
    static async obtenerMisDirecciones(req, res) {
        const id_usuario = req.usuario.id_usuario;
        try {
            let cliente = await Clientes.obtenerPorUsuario(id_usuario);
            if (!cliente) {
                // Si no existe el cliente, lo creamos
                cliente = await Clientes.crear(id_usuario);
            }
            const direcciones = await DireccionesEnvio.obtenerPorCliente(cliente.id_cliente);
            res.status(200).json(direcciones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener direcciones" });
        }
    }

    static async guardarDireccion(req, res) {
        const id_usuario = req.usuario.id_usuario;
        const direccionData = req.body;
        try {
            let cliente = await Clientes.obtenerPorUsuario(id_usuario);
            if (!cliente) {
                cliente = await Clientes.crear(id_usuario);
            }

            const direccionesExistentes = await DireccionesEnvio.obtenerPorCliente(cliente.id_cliente);

            let resultado;
            if (direccionesExistentes.length > 0) {
                // Actualizamos la primera (para simplificar este perfil de una sola dirección)
                resultado = await DireccionesEnvio.actualizar(direccionesExistentes[0].id_direccion, direccionData);
            } else {
                // Creamos la primera
                resultado = await DireccionesEnvio.crear(cliente.id_cliente, { ...direccionData, es_predeterminada: true });
            }

            res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al guardar dirección" });
        }
    }
}

export default DireccionesController;
