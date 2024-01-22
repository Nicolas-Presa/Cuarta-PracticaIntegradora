const socket = io();

socket.emit('message', 'Hola, me estoy comunicando desde websocket');

const form = document.querySelector('#productForm');
const title = document.querySelector('#productTitle').value;
const description = document.querySelector('#productDescription').value;
const price = document.querySelector('#productPrice').value;

form.addEventListener('submit', (event) => {
    event.preventDefault();

    socket.emit('addProduct', {title, description, price})
})

socket.on('productAdded', (newProduct) => {
    console.log('Nuevo producto añadido:', newProduct);
});


