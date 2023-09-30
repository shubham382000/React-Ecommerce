const express = require('express');
const app = express();
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');


// configuring cors 
app.use(cors());

// configuring express to receive form data 
app.use(express.json());

// app.use(express.bodyParser({limit : '100mb'})); 
// app.use(express.limit(100000000));

// configure dotenv 

dotEnv.config({ path: './.env' });

const port = process.env.PORT || 5000;

// configuring mongodb connection // cloud configuration of mongo DB 

mongoose.connect(process.env.MONGODB_CLOUD_URL).then((response) => {
    console.log('Connected to Mongo db cloud successfully'); 

}).catch((error) => {
    console.error(error);
    process.exit(1);
})

// simple request 

app.get('/', (request, response) => {
    response.send(`<h2>Welcome to online shoppping aplication backend</h2>`);
});

// router configuration 

app.use('/api/users', require('./Router/userRouter'));
app.use('/api/products', require('./Router/ProductRouter'));
app.use('/api/payments', require('./Router/PaymentRouter'));
app.use('/api/orders', require('./Router/orderRouter'));

app.listen(port, () => {
    console.log(`Express server is started at ${port}`);
});
