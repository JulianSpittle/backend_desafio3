const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const productManager = new ProductManager('products.json');

app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts();
    if (limit !== undefined) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.get('/', async (req, res) => {
  res.send('Entregable 3');
});

app.listen(port, () => {
  console.log(`El servidor corre en el puerto http://localhost:${port}`);
});