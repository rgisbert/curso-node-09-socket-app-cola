const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {
  // Conexión de un cliente
  socket.emit('ultimo-ticket', ticketControl.ultimo);
  socket.broadcast.emit('estado-actual', ticketControl.ultimosCuatro);
  socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

  socket.on('siguiente-ticket', (payload, callback) => {
    const siguiente = ticketControl.siguiente();
    callback(siguiente);

    socket.broadcast.emit('estado-actual', ticketControl.ultimosCuatro);
    socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
  });

  socket.on('atender-ticket', ({escritorio}, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: 'El escritorio es obligatorio',
      });
    }

    const ticket = ticketControl.atenderTicket(escritorio);
    socket.broadcast.emit('estado-actual', ticketControl.ultimosCuatro);
    socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

    if (!ticket) {
      callback({
        ok: false,
        msg: 'Ya no hay tickets pendientes',
      });
    } else {
      callback({
        ok: true,
        ticket,
        pendientes: ticketControl.tickets.length,
      });
    }
  });
};

module.exports = {
  socketController,
};
