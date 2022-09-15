const fs = require('fs');
const path = require('path');

class Ticket {
  constructor(numero, escritorio) {
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

class TicketControl {
  constructor() {
    // Último ticket atendiendo
    this.ultimo = 0;
    this.hoy = new Date().getDate();
    this.ticket = [];
    this.ultimosCuatro = [];

    this.init();
  }

  /**
   * Preparar el objeto para guardar en archivo db/data.json
   */
  get toJSON() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      ticket: this.ticket,
      ultimosCuatro: this.ultimosCuatro,
    };
  }

  /**
   * Leer db/data.json y preparar data en la clase
   */
  init() {
    const {hoy, tickets, ultimosCuatro, ultimo} = require('../db/data.json');

    // En caso de que se recarge en el mismo día
    if (hoy === this.hoy) {
      this.tickets = tickets;
      this.ultimo = ultimo;
      this.ultimosCuatro = ultimosCuatro;
    } else {
      // Si es un caso diferente, guardar en json
      this.guardarDB();
    }
  }

  /**
   * Guardar las propiedades de la instancia en db/data.json
   */
  guardarDB() {
    const dbPath = path.join(__dirname, '../db/data.json');

    fs.writeFileSync(dbPath, JSON.stringify(this.toJSON));
  }

  /**
   * Al recoger ticket desde el dispensador, crea el siguiente número y lo añade a cola
   * @returns {String} información del último ticket
   */
  siguiente() {
    this.ultimo += 1;
    const ticket = new Ticket(this.ultimo, null);
    this.tickets.push(ticket);

    this.guardarDB();
    return `Ticket ${this.ultimo}`;
  }

  /**
   * En caso de quedar tickets en cola, devuelve el siguiente ticket a atender en el escritorio disponible
   * @param {Number} escritorio - Escritorio que va a atender al siguiente ticket
   * @returns {null | Ticket} Si hay tickets en cola, devuelve el siguiente ticket a atender con la información actualizada
   */
  atenderTicket(escritorio) {
    // No hay tickets
    if (this.tickets.length === 0) {
      return null;
    }

    const ticket = this.tickets.shift();
    ticket.escritorio = escritorio;

    // Añadir al principio de los últimos, para mostrarlos
    this.ultimosCuatro.unshift(ticket);
    this.ultimosCuatro.slice(0, 4);

    this.guardarDB();

    return ticket;
  }
}

module.exports = TicketControl;
