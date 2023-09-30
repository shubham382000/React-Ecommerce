const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../Models/UserTable');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const authenticate = require('../Middleware/authenticate')

// Registering a user 

router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('EMail is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({ errors: errors.array() })
    }
    try {
        let { name, email, password } = request.body;
        // check if user exists 
        let user = await User.findOne({ email: email });
        if (user) {
            return response.status(401).json({ errors: [{ msg: 'User already exists' }] })
        }

        // encoding the password

        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        // gravatar image 

        let avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        // address

        let address = {
            flat: ' ',
            landmark: ' ',
            street: ' ',
            city: ' ',
            state: ' ',
            country: ' ',
            pin: ' ',
            mobile: ' '
        };

        // saving user to database

        user = new User({ name, email, password, avatar, address });
        user = await user.save();
        response.status(200).json({ msg: 'Registration is successful' });

    }
    catch (error) {
        console.error(error);
        response.status(500).json({ errors: [{ msg: error.message }] })
    }
})

// User login 

router.post('/login', [
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({ errors: errors.array() })
    }
    try {

        let { email, password } = request.body;
        let user = await User.findOne({ email: email });
        if (!user) {
            return response.status(401).json({ errors: [{ msg: 'Invalid Credentials' }] })
        }

        // check password 

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response.status(500).json({ errors: [{ msg: 'Invalid Credentials' }] })
        }

        // token creation 

        let payload = {
            user: {
                id: user.id,
                name: user.name
            }
        }
        jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 36000000000 }, (err, token) => {
            if (err) throw err;
            response.status(200).json({
                msg: 'Login is successful',
                token: token
            })
        })
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ errors: [{ msg: error.message }] })
    }


    // get user information 

    router.get('/', authenticate, async (request, response) => {
        try {
            let user = await User.findById(request.user.id).select('-password');
            response.status(200).json({ user: user }); 
        }
        catch (error) {
            console.error(error);
            response.status(500).json({ errors: [{ msg: error.message }] })
        }
    });

    // updating address of a user 

    router.post('/address', authenticate, [
        body('flat').notEmpty().withMessage('Flat is required'),
        body('street').notEmpty().withMessage('Street is required'),
        body('landmark').notEmpty().withMessage('Landmark is required'),
        body('city').notEmpty().withMessage('City is required'),
        body('state').notEmpty().withMessage('State is required'),
        body('country').notEmpty().withMessage('Country is required'),
        body('pin').notEmpty().withMessage('Pin is required'),
        body('mobile').notEmpty().withMessage('Mobile is required'),
    ], async (request, response) => {
        let errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(401).json({ errors: errors.array() })
        }
        try {
            let { flat, street, landmark, city, state, country, pin, mobile } = request.body
            let address = {
                flat: flat,
                street: street,
                landmark: landmark,
                city: city,
                state: state,
                country: country,
                pin: pin,
                mobile: mobile
            }
            let user = await User.findById(request.user.id);
            user.address = address;
            user = await user.save();
            response.status(200).json({
                user: user,
                msg: 'Address is successfully updated'
            }); 

        }
        catch (error) {
            console.error(error);
            response.status(500).json({ errors: [{ msg: error.message }] });
        }
    });


})
module.exports = router; 