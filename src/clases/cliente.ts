export class Cliente {
    constructor(public nombre: string, public telefonos?: Telefono[],
        public cuentas?: Cuenta[], public emails?: string[], public notas?: String,
        public id?: string) { }
    getData(): object {
        const result = {};
        Object.keys(this).map(key => result[key] = this[key]);
        return result;
    }
}

class Cuenta {
    constructor(public banco: string, public numero: string) { }
}

class Telefono {
    constructor(public tipo: string, public numero: string) {
    }
}
