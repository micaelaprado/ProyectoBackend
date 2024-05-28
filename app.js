import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.js';
import { readJSONFile } from './utils/fileUtils.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.static('public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('updateProducts', readJSONFile('./data/products.json'));

  socket.on('newProduct', (product) => {
    const products = readJSONFile('./data/products.json');
    products.push(product);
    writeJSONFile('./data/products.json', products);
    io.emit('updateProducts', products);
  });

  socket.on('deleteProduct', (productId) => {
    let products = readJSONFile('./data/products.json');
    products = products.filter(p => p.id !== productId);
    writeJSONFile('./data/products.json', products);
    io.emit('updateProducts', products);
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});