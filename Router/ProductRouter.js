const express = require('express');
const router = express.Router();
const authenticate = require('../Middleware/authenticate');
const Product = require('../Models/ProductTable');
const { body, validationResult } = require('express-validator')

// Uploading a product 

router.post('/upload', authenticate, [
    body('name').notEmpty().withMessage('Name is required'),
    body('brand').notEmpty().withMessage('Brand is required'),
    body('price').notEmpty().withMessage('Price is required'),
    body('quantity').notEmpty().withMessage('Quantity is required'),
    body('image').notEmpty().withMessage('Image is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('usage').notEmpty().withMessage('Usage is required'),
], async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({ errors: errors.array() })
    }
    try {
        let { name, brand, price, image, quantity, category, description, usage } = request.body; 
        let product = new Product({ name, brand, price, image, quantity, category, description, usage })
        product = await product.save();
        response.status(200).json({
            msg: 'Product is uploaded successfully', 
            product: product
        });
    }
    catch (error) {
        console.error(error);
        response.status(400).json({ 
            errors: [
                { msg: 'Error Occurs' }
            ] 
        })
    }

    // Getting mens collection 

    router.get('/men', async (request, response) => {
        try {
            let products = await Product.find({ category: 'Men' }); 
            response.status(200).json({
                products: products
            });
        }
        catch (error) {
            console.error(error);
            response.status(500).json({ errors: [{ msg: error.message }] })
        }
    });

    // Getting womens collection 

    router.get('/women', async (request, response) => {
        try {
            let products = await Product.find({ category: 'Women' })
            response.status(200).json({
                products: products
            });
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ errors: [{ msg: error.message }] })
        }
    });


    // Getting kids collection 

    router.get('/kids', async (request, response) => {
        try {
            let products = await Product.find({ category: 'Kids' })
            response.status(200).json({
                products: products
            });
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ errors: [{ msg: error.message }] })
        }
    });

    // Getting a single product 

    router.get('/:product_id', async (request, response) => {
        let productId = request.params.product_id;
        try {
            let product = await Product.findById(productId)
            response.status(200).json({
                product: product
            })
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ errors: [{ msg: error.message }] })
        }
    })


});
module.exports = router; 