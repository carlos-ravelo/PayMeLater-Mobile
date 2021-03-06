export class Prestamo {
    constructor(
        public cliente: string,
        public estado: string,
        public tasa: number,
        public tipoTasa: string,
        public capitalPrestado: number,
        public numeroPrestamo: string,
        public fechaProximoPago: any,
        public montoCuotas: number,
        public cantidadCuotas: number,
        public fechaInicio: any,
        public pagadoCapital: number,
        public capitalPendiente: number,
        public notas?: string,
        public autoCalculate?: boolean,
    ) { }
}

