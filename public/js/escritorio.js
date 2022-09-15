const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
  window.location = 'index.html';
  throw new Error('El escritorio es obligatorio');
}

const socket = io();
const escritorio = searchParams.get('escritorio');

// Referencias HTML
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');

lblEscritorio.innerText = escritorio;
divAlerta.style.display = 'none';

socket.on('connect', () => {
  btnAtender.disabled = false;
});

socket.on('disconnect', () => {
  btnAtender.disabled = true;
});

socket.on('ultimo-ticket', (ultimo) => {});

btnAtender.addEventListener('click', () => {
  socket.emit('atender-ticket', {escritorio}, ({ok, msg, ticket}) => {
    if (!ok) {
      lblTicket.innerText = 'nadie';
      divAlerta.style.display = '';
      return;
    }

    lblTicket.innerText = `Ticket ${ticket.numero}`;
  });
});
