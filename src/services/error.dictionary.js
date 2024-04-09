const errorsDictionary = {
    ROUTING_ERROR: { code: 404, message: 'No se encuentra el endpoint solicitado' },
    FEW_PARAMETERS: { code: 400, message: 'Faltan parámetros obligatorios o están vacíos' },
    FEW_FILTERS: {code: 400, message: 'Faltan filtros obligatorios para completar la busqueda'},
    INVALID_MONGOID_FORMAT: { code: 400, message: 'El ID no contiene un formato válido de MongoDB' },
    INVALID_PARAMETER: { code: 400, message: 'El parámetro ingresado no es válido' },
    INVALID_TYPE_ERROR: { code: 400, message: 'No corresponde el tipo de dato' },
    ID_NOT_FOUND: { code: 400, message: 'No existe registro con ese ID' },
    PAGE_NOT_FOUND: { code: 404, message: 'No se encuentra la página solicitada' },
    DATABASE_ERROR: { code: 500, message: 'No se puede conectar a la base de datos' },
    INVALID_ROLE: {code: 400, message: 'No tienes permisos suficientes para realizar esta accion'},
    USER_NOT_FOUND: {code: 500, message: 'No existe un usuario que haya adquirido este carrito'},
    PURCHASE_RESTRICTION: {code: 400, message: 'Usted no puede comprar el mismo producto que esta vendiendo'},
    ERROR_ADDING: {code: 400, message: 'Error al intentar agregar este producto al carrito'},
    PRODUCT_NOT_FOUND: {code: 500, message: 'No se encuentra este producto en el carrito'},
    EMPTY_CART: {code: 400, message: 'Este carrito esta vacio'},
    NO_ACTIVE_USERS: {date: 400, message: 'No hay usuarios con inactividad de 2 dias'}
}

export default errorsDictionary;