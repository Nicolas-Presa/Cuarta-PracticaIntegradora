const chatform = document.querySelector('#chatForm');

chatform.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const user = document.querySelector('#email').value;
    const message = document.querySelector('#message').value

    const data = {user, message};

    fetch('/products/save-message', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then(data => {
        console.log('Mensaje guardado:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    document.querySelector('#email').value = '';
    document.querySelector('#message').value = '';
})