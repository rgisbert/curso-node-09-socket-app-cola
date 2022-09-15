// Referencias HTML
const serverStatus = document.querySelector('#serverStatus');
const txtMensaje = document.querySelector('#txtMensaje');
const btnEnviar = document.querySelector('#btnEnviar');

// Socket del cliente que expone la librería socket.io
const socket = io();

/**
 * Cambiar el estado del servidor en la pantalla HTML
 */
const changeStatus = (status = 'off') => {
  if (status === 'on') {
    serverStatus.textContent = 'on line';
    serverStatus.classList = 'text-success';
  } else {
    serverStatus.textContent = 'off line';
    serverStatus.classList = 'text-danger';
  }
};

socket.on('connect', () => {
  console.log('Conectado:', socket.id);

  changeStatus('on');
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor:', socket.id);

  changeStatus('off');
});

socket.on('enviar-mensaje', (payload) => {
  console.log(`${payload.id} dijo: "${payload.mensaje}".`);
});

btnEnviar.addEventListener('click', () => {
  const mensaje = txtMensaje.value;
  const payload = {
    mensaje,
    id: socket.id,
    fecha: new Date().getTime(),
  };

  socket.emit('enviar-mensaje', payload, (data) => {
    console.log(`Desde el server en callback ${data}`);
  });
});
