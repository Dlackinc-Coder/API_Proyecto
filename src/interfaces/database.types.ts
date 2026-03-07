// ====================== ENUMS ======================

export enum GrainType {
    ARABICA = "arabica",
    ROBUSTA = "robusta",
    MEZCLADA = "mezclada",
}

export enum RoastLevel {
    LIGERO = "ligero",
    MEDIO = "medio",
    MEDIO_OSCURO = "medio_oscuro",
    OSCURO = "oscuro",
}

export enum ProductStatus {
    ACTIVO = "activo",
    DESCONTINUADO = "descontinuado",
    SIN_STOCK = "sin_stock",
}

export enum MovementType {
    COMPRA_PROVEEDOR = "compra_proveedor",
    VENTA_CLIENTE = "venta_cliente",
    MERMA = "merma",
    AJUSTE_INVENTARIO = "ajuste_inventario",
    DEVOLUCION = "devolucion",
}

export enum DocType {
    INE_FRENTE = "ine_frente",
    INE_REVERSO = "ine_reverso",
    RFC = "rfc",
    CURP = "curp",
    ACTA_NACIMIENTO = "acta_nacimiento",
    COMPROBANTE_DOMICILIO = "comprobante_domicilio",
    ALTA_IMSS = "alta_imss",
    CONTRATO = "contrato",
}

export enum ValidationStatus {
    PENDIENTE = "pendiente",
    BAJO_REVISION = "bajo_revision",
    APROBADO = "aprobado",
    RECHAZADO = "rechazado",
    EXPIRADO = "expirado",
}

export enum OrderStatus {
    PAGADO = "pagado",
    PREPARADO = "preparado",
    ENVIADA = "enviada",
    ENTREGADA = "entregada",
    CANCELADA = "cancelada",
}

export enum PaymentProvider {
    PAYPAL = "paypal",
    MERCADOPAGO = "mercadopago",
    EFECTIVO = "efectivo",
}

// ====================== TABLAS ======================

export interface Rol {
    id_rol: number;
    nombre_rol: string;
    descripcion: string | null;
}

export interface Usuario {
    id_usuario: number;
    email: string;
    password_hash: string;
    nombre: string;
    telefono: string | null;
    email_verificado: boolean;
    token_verificacion: string | null;
    intentos_login_fallidos: number;
    bloqueado_hasta: Date | null;
    ultimo_login: Date | null;
    activo: boolean;
    fecha_creacion: Date;
}

export interface UsuarioRol {
    id_usuario: number;
    id_rol: number;
    asignado_por: number | null;
    fecha_asignacion: Date;
}

export interface Empleado {
    id_empleado: number;
    id_usuario: number;
    rfc: string;
    curp: string;
    nss: string | null;
    puesto: string;
    fecha_ingreso: Date;
    fecha_baja: Date | null;
    motivo_baja: string | null;
}

export interface DocumentoEmpleado {
    id_documento: number;
    id_empleado: number;
    tipo_documento: DocType;
    cloudinary_url: string;
    cloudinary_public_id: string;
    estado_validacion: ValidationStatus;
    validado_por: number | null;
    fecha_subida: Date;
    fecha_validacion: Date | null;
    notas_rechazo: string | null;
    fecha_expiracion: Date | null;
}

export interface RegionCafe {
    id_region: number;
    nombre: string;
    estado: string;
    altitud_min_: number | null;
    altitud_max_: number | null;
    descripcion_terr: string | null;
}

export interface Producto {
    id_producto: number;
    sku: string;
    nombre: string;
    id_region: number;
    tipo_grano: GrainType;
    nivel_tostado: RoastLevel;
    notas_cata_texto: string | null;
    precio_actual: number; // Decimal mapped to number in JS
    stock_actual: number;
    stock_minimo: number;
    estado: ProductStatus;
    fecha_creacion: Date;
}

export interface InventarioKardex {
    id_movimiento: number;
    id_producto: number;
    cantidad_movimiento: number;
    stock_anterior: number;
    stock_resultante: number;
    tipo_movimiento: MovementType;
    referencia_documento: string | null;
    id_usuario_responsable: number | null;
    fecha: Date;
}

export interface Cliente {
    id_cliente: number;
    id_usuario: number | null;
    fecha_registro: Date;
}

export interface DireccionEnvio {
    id_direccion: number;
    id_cliente: number;
    calle: string;
    codigo_postal: string;
    ciudad: string;
    estado: string;
    es_predeterminada: boolean;
}

export interface Pedido {
    id_pedido: number;
    folio: string;
    id_cliente: number;
    total: number;
    estado_pedido: OrderStatus;
    fecha_creacion: Date;
}

export interface DetallePedido {
    id_detalle: number;
    id_pedido: number;
    id_producto: number;
    cantidad: number;
    precio_unitario_venta: number;
}

export interface TransaccionPago {
    id_transaccion: number;
    id_pedido: number;
    proveedor: PaymentProvider;
    proveedor_order_id: string;
    monto: number;
    fecha_creacion: Date;
}

export interface BitacoraSistema {
    id_log: number;
    id_usuario: number | null;
    accion: string | null;
    tabla_afectada: string | null;
    id_registro_afectado: number | null;
    fecha: Date;
}
