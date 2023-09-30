const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authenticate = require('../Middleware/authenticate'); 

// STRIPE PAYMENT REQUEST 
// ACCESS - PRIVATE

router.post('/pay', authenticate,  (request, response) => {
    const { product, token } = request.body;
    stripe.customers.create({
        email: token.email,
        source: token.id
    }).then((customer) => {
        {
            stripe.charges.create({
                amount: product.price,
                description: product.name,
                currency: 'inr',
                customer: customer.id
            });
        }
    }).then((charge) => {
        response.status(200).json(charge)
    }).catch((error) => {
        console.error(error);
    });
});

module.exports = router; 