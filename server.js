const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Example product data
const products = [
    { id: 1, name: 'Product 1', description: 'Description 1', price: 199 },
    { id: 2, name: 'Product 2', description: 'Description 2', price: 299 },
    { id: 3, name: 'Product 3', description: 'Description 3', price: 3999 },
];

// API route to get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// API route to get a specific product by ID
app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
