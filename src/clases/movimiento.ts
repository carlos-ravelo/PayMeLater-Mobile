export class Movimiento {
    constructor(
        public numeroPrestamo,
        public cliente: string,
        public tipoMovimiento: string,
        public interesDelPago: number,
        public capitalDelPago: number,
        public montoPrestado: number,
        public montoTotal: number,
        public fechaCorrespondiente: any,
        public fechaTransaccion: any,
        public notas: string,
        public id?: string,
        public borrado?: boolean,

    ) { }
}


