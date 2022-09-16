// Capturar todos los huecos donde rellenar la información
const lblTickets = document.querySelectorAll('[id^="lblTicket"]');
const lblEscritorios = document.querySelectorAll('[id^="lblEscritorio"]');

const socket = io();

socket.on('estado-actual', (payload) => {
  lblTickets.forEach((ticket, index) => {
    if (payload[index]) {
      const {numero, escritorio} = payload[index];

      ticket.textContent = `Ticket ${numero}`;
      lblEscritorios[index].textContent = `${escritorio}`;
    } else {
      ticket.textContent = `---`;
      lblEscritorios[index].textContent = `---`;
    }
  });
});
