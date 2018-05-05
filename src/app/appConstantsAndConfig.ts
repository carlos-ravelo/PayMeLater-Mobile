
import * as moment from 'moment'

export const dateList = [
    //This is the avalaible range of dates  the user can search in the reports view
    { nombre: "Ultimo 6 Meses", fechaInicial: moment().subtract(6, "month").format(), fechaFinal: moment().format() },
    { nombre: "Este año", fechaInicial: moment().startOf("year").format(), fechaFinal: moment().format() },
    { nombre: "Año pasado", fechaInicial: moment().subtract(1, "year").startOf("year").format(), fechaFinal: moment().subtract(1, "year").endOf("year").format() },
    { nombre: moment().subtract(2, "year").format("YYYY"), fechaInicial: moment().subtract(2, "year").startOf("year").format(), fechaFinal: moment().subtract(2, "year").endOf("year").format() },
    { nombre: moment().subtract(3, "year").format("YYYY"), fechaInicial: moment().subtract(3, "year").startOf("year").format(), fechaFinal: moment().subtract(3, "year").endOf("year").format() },
    { nombre: moment().subtract(4, "year").format("YYYY"), fechaInicial: moment().subtract(4, "year").startOf("year").format(), fechaFinal: moment().subtract(4, "year").endOf("year").format() },
]



