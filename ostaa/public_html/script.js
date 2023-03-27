/*
Script for main page
*/

function addUser(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const httpRequest = new XMLHttpRequest();
    const url = '/add/user';
    const data = { username: username, password: password };
    const jsonData = JSON.stringify(data);

    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-Type', 'application/json');

    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const response = httpRequest.responseText;
                console.log('Successfully saved user', response);
            } else {
                console.error('Error saving user:', httpRequest.statusText);
            }
        }
    };

    httpRequest.send(jsonData);
}

function addItem(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').value;
    const price = document.getElementById('price').value;
    const status = document.getElementById('status').value;
    const username = document.getElementById('item-username').value;
    
    const httpRequest = new XMLHttpRequest();
    const url = '/add/item/' + username;
    const data = { title: title, description: description, image: image, price: price, stat: status };
    const jsonData = JSON.stringify(data);

    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-Type', 'application/json');

    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const response = httpRequest.responseText;
                console.log('Successfully saved item', response);
            } else {
                console.error('Error saving item:', httpRequest.statusText);
            }
        }
    };

    httpRequest.send(jsonData);
}
