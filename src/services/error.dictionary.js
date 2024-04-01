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
    INVALID_ROLE: {code: 400, message: 'No tienes permisos suficientes para realizar esta accion'}
}

export default errorsDictionary;