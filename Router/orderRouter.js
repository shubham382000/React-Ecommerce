const express = require('express');
const router = express.Router();
const authenticate = require('../Middleware/authenticate');
const Order = require('../Models/OrdersTable');
const User = require('../Models/UserTable');
const { body, validationResult } = require('express-validator')

// Placing an order 

router.post('/', authenticate, [
    body('items').notEmpty().withMessage('Items Required'),
    body('tax').notEmpty().withMessage('Tax Required'),
    body('total').notEmpty().withMessage('Total Required'),
], async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({ errors: errors.array() })
    }
    try {
        let { items, tax, total } = request.body

        let user = await User.findById(request.user.id)
        let order = new Order({
            name: user.name,
            email: user.email,
            mobile: user.address.mobile,
            total: total,
            tax: tax,
            items: items
        });
        order = await order.save();
        response.status(200).json({
            msg: 'Order is placed',
            order: order
        })
    }
    catch (error) {
        console.log(error);
        response.status(400).json({ errors: [{ msg: error.message }] })
    }
})

// Getting all orders 

router.get('/all', authenticate, async (request, response) => {
    try {
        let user = await User.findById(request.user.id)
        let orders = await Order.find({ email: user.email });
        response.status(200).json({ orders: orders });
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ errors: [{ msg: error.message }] })
    }
})

module.exports = router; 