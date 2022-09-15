const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {
  socket.on('disconnect', () => {});

  // Capturar el emit del front-end, con ese mismo nombre
  // ? El parámetro callback hace referencia al tercer agumento del emit del front-end
  // ? se utiliza, por ejemplo, para poder manejar un comportamiento diferente en
  // ? el cliente que lanzó el evento personalizado.
  socket.on('enviar-mensaje', (payload, callback) => {
    const id = 123456789;

    callback(id);
    // * Broadcast envía mensaje a todos
    socket.broadcast.emit('enviar-mensaje', payload);
  });
};

module.exports = {
  socketController,
};
