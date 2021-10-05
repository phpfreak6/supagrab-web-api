const Razorpay = require('razorpay');
let $this;

module.exports = class RazorPayController {

    RazorpayObj = new Razorpay({
        key_id: 'rzp_test_48cTOMEXh9OIUO',
        key_secret: '0nUMDEz7Rxo4egwn9gZMHGPe',
    });

    constructor() {        
        $this = this;
    }

    init( req, res, next ) {

        res.render('index', {
            title: 'razorpay'
        });
    }

    order( req, res, next ) {

        let in_data = req.body;
        let options = {
            amount: in_data.amount * 100,  // amount in the smallest currency unit
            currency: in_data.currency,
            receipt: in_data.receipt
        };

        $this.RazorpayObj.orders.create(
            options, 
            (err, order) => {
                console.log(order);
                
                res.send({
                    order: order
                });
            }
        );
    }

    callbackUrl( req, res, next ) {

        $this.RazorpayObj.payments
        .fetch( req.body.razorpay_payment_id )
        .then( (paymentDocument) => {
            console.log('paymentDocument', paymentDocument);
            if( paymentDocument.status == 'captured' ) {
                res.send({
                    status: true,
                    msg: 'Payment Successfull'
                });
            } else {
                res.send({
                    status: false,
                    msg: 'Payment un-successfull'
                });
            }
        } )
        .catch( (ex) => {
            console.log(ex);
            res.send({
                order: req.body
            });
        } );
    }

    paymentSuccessfull( req, res, next ) {

        $this.RazorpayObj.payments
        .fetch( req.body.razorpay_payment_id )
        .then( (paymentDocument) => {
            console.log('paymentDocument', paymentDocument);
            if( paymentDocument.status == 'captured' ) {
                res.send({
                    status: true,
                    msg: 'Payment Successfull'
                });
            } else {
                res.send({
                    status: false,
                    msg: 'Payment un-successfull'
                });
            }
        } )
        .catch( (ex) => {
            console.log(ex);
        } );
    }
}