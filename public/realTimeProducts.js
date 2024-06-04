const socket = io();

const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = document.getElementById('productPrice').value;

    socket.emit('newProduct', { title: productName, description: productDescription, price: productPrice });

    document.getElementById('productName').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productPrice').value = '';
});

socket.on('productList', (products) => {
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.id = product.id;
        li.innerHTML = `${product.title} - ${product.description} - $${product.price} <button onclick="deleteProduct('${product.id}')">Delete</button>`;
        productList.appendChild(li);
    });
});

function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
}