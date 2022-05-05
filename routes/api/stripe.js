const express = require('express')
const router  = express.Router();
const stripe = require('stripe')('sk_test_51Jdh7KHfmHPaQSPyEdvxhPsA8VMcSm8DIGGxueyA73M7M4tNCc8npIjxFW9flkmIvrC59ncscuyqca9NbmkIyMUR00fjyDRNKI', { apiVersion: "2020-08-27" });

router.post('/stripe/payment', async (req, res) => {
    try{
        let customer = await stripe.customers.create(); // This example just creates a new Customer every time

        // Create an ephemeral key for the Customer; this allows the app to display saved payment methods and save new ones
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2020-08-27' }
        );
    
        // Create a PaymentIntent with the payment amount, currency, and customer
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 973,
            currency: "usd",
            customer: customer.id
        });
    
        // Send the object keys to the client
        res.send({
            publishableKey: 'pk_test_51Jdh7KHfmHPaQSPyxF77evkBiqqMIHpNrwjwlqbavsk4oo3fB6au62gK4ku8nSTvEmrwPNmzjuIv0nO82NEdJ2dp009jm1jf1f', // https://stripe.com/docs/keys#obtain-api-keys
            paymentIntent: paymentIntent.client_secret,
            customer: customer.id,
            ephemeralKey: ephemeralKey.secret
        });
    }catch(err){
        console.log(err)
    }
    // Create or retrieve the Stripe Customer object associated with your user.
    
})


router.post('/payment', async (req, res) => {
    try{
        const { email, amount, package } = req.body;
        console.log(email, amount, package)
        let customer = await stripe.customers.create({
            email: email
        });
    
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: '4242424242424242',
                exp_month: 1,
                exp_year: 2023,
                cvc: '314',
            },
        });
    
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            customer: customer.id,
            description: package,
            automatic_payment_methods: {
                enabled: true,
            },
            payment_method: paymentMethod.id
        })
    
        const cs = paymentIntent.client_secret
    
        console.log(cs)
    
        return res.json({ clientSecret: cs })
    }catch(err){
        console.log(err)
    }
    
})


router.post('/payment-sheet', async (req, res) => {
    try{
        console.log(req.body)
        const customer = await stripe.customers.create();
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2020-03-02' }
        );
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount * 100,
            currency: 'usd',
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true,
            },
        });
    
        res.json({
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
            publishableKey: 'pk_test_51Jdh7KHfmHPaQSPyxF77evkBiqqMIHpNrwjwlqbavsk4oo3fB6au62gK4ku8nSTvEmrwPNmzjuIv0nO82NEdJ2dp009jm1jf1f'
        });
    }catch(err){
        console.log(err)
    }
    // Use an existing Customer ID if this is a returning customer.

});


module.exports = router