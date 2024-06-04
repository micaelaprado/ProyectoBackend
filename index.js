import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let products = [];

app.get('/', (req, res) => {
    res.render('index', { products });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products });
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('productList', products);

    socket.on('newProduct', (product) => {
        product.id = uuidv4();
        products.push(product);
        io.emit('productList', products);
    });

    socket.on('deleteProduct', (productId) => {
        products = products.filter(p => p.id !== productId);
        io.emit('productList', products);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

httpServer.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});