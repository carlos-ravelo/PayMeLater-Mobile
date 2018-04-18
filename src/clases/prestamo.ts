export class Prestamo {
    constructor(
        public cliente: string,
        public tasa: number,
        public capitalPrestado: number,
        public numeroPrestamo: string,
        public fechaProximoPago: any,
        public montoCuotas: number,
        public cantidadCuotas: number,
        public fechaInicio: any,
        public pagadoCapital: number,
        public capitalPendiente: number,
        public notas?: string,
    ) { }
}

