export const constants = {
    keys: {
        city: 'city',
        walkDistance: 'walkDistance',
        layer: 'layer',

    },
    methods: {
        nearRoutes: 'nearRoutes'
    },
    local: {
        result: 'result',
        recents:'recents',
        status:'status',
        
    },
    errors:{
        calculate:[
            'No se puede realizar el calculo, intenta nuevamente',
            'No se envio el codigo de la ciudad',
            'No se envio el codigo de area',
            'No se envio la ubicacion de inicio',
            'No se envio la ubicacion del destino',
            'No se encontro rutas cerca al origen',
            'No se encontro rutas cerca al destino',
            'No se encontro opciones para este recorrido'
          ],
          nearRoutes:[
            'No se puede obtener las rutas cercanas en este momento',
            'No se envio la ubicacion',
            'No se envio el codigo de la ciudad',
            'No se envio el codigo de area'
          ]
    }
}