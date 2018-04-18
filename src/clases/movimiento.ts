export class Movimiento {
    constructor(
        public id: string,
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

    ) { }
}


