
import * as moment from 'moment'

export const dateList = [
    //This is the avalaible range of dates  the user can search in the reports view
    { nombre: "Ultimos 6 Meses", fechaInicial: moment().subtract(5, "month").format(), fechaFinal: moment().format('YYYY-MM-DD') },
    { nombre: "Este año", fechaInicial: moment().startOf("year").format(), fechaFinal: moment().format('YYYY-MM-DD') },
    { nombre: "Año pasado", fechaInicial: moment().subtract(1, "year").startOf("year").format(), fechaFinal: moment().subtract(1, "year").endOf("year").format() },
    { nombre: moment().subtract(2, "year").format("YYYY"), fechaInicial: moment().subtract(2, "year").startOf("year").format(), fechaFinal: moment().subtract(2, "year").endOf("year").format('YYYY-MM-DD') },
    { nombre: moment().subtract(3, "year").format("YYYY"), fechaInicial: moment().subtract(3, "year").startOf("year").format(), fechaFinal: moment().subtract(3, "year").endOf("year").format('YYYY-MM-DD') },
    { nombre: moment().subtract(4, "year").format("YYYY"), fechaInicial: moment().subtract(4, "year").startOf("year").format(), fechaFinal: moment().subtract(4, "year").endOf("year").format('YYYY-MM-DD') },
]



