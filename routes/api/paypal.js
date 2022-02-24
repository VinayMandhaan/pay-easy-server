const express = require('express')
const router  = express.Router();
const paypal = require("paypal-rest-sdk");

paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id:
        "Af6f-lgva33MZiMBU8hcIzXZdWVjfC1_fHnDr53REFfS8c2mFvFr4sO6kKloboH0LQGhQJj1vwPzmDtq",
    client_secret:
        "ECDv8yqCEV0DWOPQaosZPrAmejmAnW9boC3TNf9n6MVjWjOx-7CDgBNMyJ6MCBQvv5Pn1LVvvEAkhDz5"
  });


  router.get('/payment/:price',(req, res) => {
      console.log(req.params.price)
    var create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal"
        },
        redirect_urls: {
            return_url: `https://pay-easy-server.herokuapp.com/api/paypal/success/${req.params.price}`,
            cancel_url: "https://pay-easy-server.herokuapp.com/api/paypal/cancel"
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: "item",
                            sku: "item",
                            price: req.params.price,
                            currency: "USD",
                            quantity: 1
                        }
                    ]
                },
                amount: {
                    currency: "USD",
                    total: req.params.price
                },
                description: "This is the payment description."
            }
        ]
    };

    paypal.payment.create(create_payment_json, function(error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            res.redirect(`${payment.links[1].href}`);
        }
    });
})



router.get("/success/:total",async(req, res) => {
  try {
    var PayerID = req.query.PayerID;
    var paymentId = req.query.paymentId;
    
    var execute_payment_json = {
        payer_id: PayerID,
        transactions: [
            {
                amount: {
                    currency: "USD",
                    total: req.params.total
                }
            }
        ]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function(
        error,
        payment
    ) {
        if (error) {
            console.log(error.response);
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.render("success");
        }
    });
    // res.render("success");
    // return res.status(201).send({ message: 'Payment Done Successfully', payment:paymentLog });
  } catch (error) {
    return res.json({"error":error})
  }
  // res.send("Success");

});


  
module.exports=  router