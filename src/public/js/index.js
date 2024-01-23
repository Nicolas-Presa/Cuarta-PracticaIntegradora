const socket = io();

const form = document.querySelector('#productForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.querySelector('#productTitle').value;
    const description = document.querySelector('#productDescription').value;
    const price = document.querySelector('#productPrice').value;
    const code = document.querySelector('#productCode').value;
    const stock = document.querySelector('#productStock').value;
    const category = document.querySelector('#productCategory').value;
    const thumbnails = document.querySelector('#productThumbnails').value;

    socket.emit('addProduct', { title, description, price, code, stock, category, thumbnails, });
});

socket.on('productAdded', (newProduct) => {
    console.log('Nuevo producto añadido:', newProduct);
});

const buttonsEliminar = document.querySelectorAll('.buttonEliminar');

buttonsEliminar.forEach(button => {
    button.addEventListener('click', (event) => {
        const productId = parseInt(event.target.id);
        socket.emit('deleteProduct', productId);
    });
});