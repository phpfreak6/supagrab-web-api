const fs = require('fs');
const Validator = require('validatorjs');
const { ObjectId } = require('mongodb');
const Razorpay = require('razorpay');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const CartService = require('../services').CartService;
const CartServiceObj = new CartService();

const ProductService = require('../services').ProductService;
const ProductServiceObj = new ProductService();

const UserService = require('../services').UserService;
const UserServiceObj = new UserService();

const OrderService = require('../services').OrderService;
const OrderServiceObj = new OrderService();

const CouponService = require('../services').CouponService;
const CouponServiceObj = new CouponService();

let PRODUCT_IMAGE_PATH = require('../config/config').PRODUCT_IMAGE_PATH;

let $this;
module.exports = class OrderController {

    RazorpayObj = new Razorpay({
        key_id: 'rzp_test_48cTOMEXh9OIUO',
        key_secret: '0nUMDEz7Rxo4egwn9gZMHGPe',
    });

    constructor() {
        $this = this;
    }

    get(req, res, next) {

        try {
            let searchTxt = req.query.searchTxt;
            OrderServiceObj
                .get(searchTxt)
                .then(async (result) => {
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Orders Fetched Successfully',
                        data: { 
                            order: result,
                            PRODUCT_IMAGE_PATH: PRODUCT_IMAGE_PATH
                        }
                    });
                })
                .catch(async (ex) => {
                    return await responseServiceObj.sendException(res, {
                        msg: ex.toString()
                    });
                });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    getById( req, res, next ) {

        try {

            let order_id = req.params.order_id;
            let user_id = req.params.user_id;

            OrderServiceObj.getById(order_id)
            .then( async (result) => {
                return await responseServiceObj.sendResponse(res, {
                    msg: 'Record Found.',
                    data: {
                        order: result
                    }
                })
            })
            .catch( async (ex) => {
                return responseServiceObj.sendException(res, {
                    msg: ex.toString()
                });
            } );            
        } catch (ex) {

            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    getByUser( req, res, next ) {

        try {

            let user_id = req.params.user_id;

            OrderServiceObj.getByUser(user_id)
            .then( async (result) => {
                return await responseServiceObj.sendResponse(res, {
                    msg: 'Record Found.',
                    data: {
                        order: result
                    }
                })
            })
            .catch( async (ex) => {
                return responseServiceObj.sendException(res, {
                    msg: ex.toString()
                });
            } );            
        } catch (ex) {

            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    insert(req, res, next) {

        try {

            let products = [];
            let subTotal = parseFloat(0);
            let grandTotal = parseFloat(0);
            let in_data = req.body;

            let couponApplied = false;
            let couponCode = undefined;
            let couponType = undefined;
            let  discountAmount = 0;
            let shippingCost = 0;
            let discountAmt = 0;
            let orderResult;
            
            let userId = undefined;
            let rules = {
                // customer_id: 'required',
                // customer_details: 'required|numeric',

                // payment: 'required|numeric',
                transaction_id: 'required',
                payment_mode: 'required|in:COD,CARD,UPI',
                amount: 'required|numeric',
                transaction_status: 'required|in:SUCCESSED,FAILED,PENDING',

                // address: 'required|numeric',

                // sub_total: 'required|numeric',

                shipping_charge: 'required|numeric',
                // shipping_amount: 'required|numeric',

                // tax_charge: 'required|numeric',
                // tax_amount: 'required|numeric',

                coupon_applied: 'required',
                // coupon_code: 'required',
                // coupon_discount_percent: 'required|numeric',
                // coupon_discount_amount: 'required|numeric',

                // total: 'required|numeric',
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            userId = req.params.user_id;
            couponCode = in_data.coupon_code;
            couponApplied = in_data.coupon_applied;
            let is_valid;

            is_valid = ObjectId.isValid(userId);
            if (!is_valid) {
                throw 'User id not well formed.'
            }

            in_data['customer_id'] = ObjectId( userId );

            CartServiceObj.getCartByUser( userId )
                .then( async (cartDetails) => {
                    
                    cartDetails.forEach(element => {
                        products.push({
                            user_id: element.user_id,
                            product_id: element.product_id,
                            product_detail: element.product_detail,
                            qty: element.qty,
                            product_price:element.product_detail.product_price,
                            status: 'OPEN'
                        });
                    });

                    in_data['products'] = products;
                    return true;
                } )
                .then( async(out) => {

                    let user = await UserServiceObj.getUserById( userId );
                    in_data['customer_details'] = {

                        customer_id: userId,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        profilePic: user.profilePic,
                        contact_number: user.contact_number,
                        gender: user.gender
                    };

                    in_data['address'] = {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        phone: user.contact_number,

                        address: user.addresses[0].address,
                        city: user.addresses[0].city,
                        state: user.addresses[0].state,
                        country: user.addresses[0].country,
                        pincode: user.addresses[0].pincode
                    };
                    return true;
                } )
                .then( async(out) => {
                    let cnt = products.length;
                    let i = 0;
                    subTotal = parseFloat(0);
                    await products.forEach(element => {

                        let new_sub_total = parseFloat(element.product_price) * parseFloat(element.qty)
                        subTotal = subTotal + new_sub_total;
                        i++;
                    });

                    if( cnt == i ) {
                        in_data.sub_total = subTotal;
                        return true;
                    }
                } )
                .then( async(out) => {

                    if( couponApplied ) {

                        in_data.coupon_applied = couponApplied;
                        in_data.coupon_code = couponCode;
                        
                        // get coupon details by coupon code
                        let couponDetails = await CouponServiceObj.getByCode( couponCode );
                        couponType = couponDetails.coupon_type;
                        discountAmount = couponDetails.discount_amount;
                        in_data.coupon_type = couponType;

                        if( couponType == 'FLAT' ) {
                            grandTotal = subTotal - discountAmount;
				            discountAmt = discountAmount;

                            in_data.coupon_discount_percent = 0;
                            in_data.coupon_discount_amount = discountAmount;

                        } else if( couponType == 'PERCENTAGE' ) {
                            discountAmt = ((subTotal * discountAmount)/100);
				            grandTotal = subTotal - discountAmt;

                            in_data.coupon_discount_percent = discountAmount;
                            in_data.coupon_discount_amount = discountAmt;

                        } else {
                            discountAmt = 0;
				            grandTotal = subTotal - discountAmt;
                        }
                    } else {

                        grandTotal = grandTotal + subTotal;
                    }

                    if( subTotal >= 700 ) {
                        shippingCost = 0;
                    
                    } else {
                        shippingCost = 50;
                    }
                    grandTotal = grandTotal + shippingCost;
                    in_data.grand_total = grandTotal;

                    // below check Must be executed
                    if( parseFloat( grandTotal ) != parseFloat( in_data['amount'] ) ) {
                        throw 'Amount calculations are not matched correctly.';
                    }

                    return true;
                } )
                .then( async (out) => {

                    let result = await OrderServiceObj.insert(in_data);
                    orderResult = result;
                    return result;
                })
                .then( async (result) => {

                    let options = {
                        amount: grandTotal * 100,
                        currency: 'INR',
                        receipt: result._id.toString()
                    };

                    $this.RazorpayObj.orders.create(
                        options, 
                        async (err, order) => {
                            
                            if( err ) {
                                return await responseServiceObj.sendException(res, {
                                    msg: "error occured",
                                    data: err
                                });

                            } else {

                                let orderDetailsInData = {
                                    razorpay_order_id: order.id,
                                    razorpay_options: order,
                                    order_id: ObjectId(order.receipt),
                                    amount: (parseFloat(order.amount)/100)
                                };

                                let result = OrderServiceObj.update( orderResult._id, orderDetailsInData );
                                return await responseServiceObj.sendResponse(res, {
                                    msg: 'Order Placed successfully',
                                    data: {
                                        // order: result
                                        order: await OrderServiceObj.getById(orderResult._id),
                                        razorpay_order_id: order.id
                                    }
                                });
                            }
                        }
                    );
                } )
                .catch( async ( ex ) => {
                    return await responseServiceObj.sendException(res, {
                        msg: ex.toString()
                    });
                } );
        } catch (ex) {

            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    update( req, res, next ) {

        try {

            let user_id = ObjectId(req.params.user_id);
            let in_data = req.body;
            let rules = {
                order_id: 'required',
                razorpay_payment_id: 'required',
                razorpay_order_id: 'required',
                razorpay_signature: 'required',
                razorpay_response: 'required',
                razorpay_options: 'required',
            };

            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            $this.RazorpayObj.payments
            .fetch( req.body.razorpay_payment_id )
            .then( async (paymentDocument) => {

                if( paymentDocument.status == 'captured' ) {
                    in_data['payment_document'] = paymentDocument;
                    in_data['amount'] = paymentDocument.amount;
                    in_data['transaction_status'] = 'SUCCESS';

                    let result = OrderServiceObj.update( in_data.order_id, in_data );

                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Payment Successfull',
                        data: {
                            paymentDocument: paymentDocument,
                            result: result
                        }
                    });
                } else {

                    in_data['transaction_status'] = 'FAILED';
                    let result = OrderServiceObj.update( in_data.order_id, in_data );

                    return responseServiceObj.sendException(res, {
                        msg: 'Payment un-successfull',
                        data: paymentDocument
                    });
                }
            } )
            .catch( (ex) => {
                return responseServiceObj.sendException(res, {
                    msg: ex.toString()
                });
            } );

        } catch (ex) {

            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    paymentFailed( req, res, next ) {

        try {

            let order_id = req.params.order_id;

            OrderServiceObj.paymentFailed( order_id, 'FAILED' )
            .then( async (result) => {
                return await responseServiceObj.sendResponse(res, {
                    msg: 'Payment Failed',
                    data: {
                        order: await OrderServiceObj.getById(order_id)
                    }
                });
            } )
            .catch( async (ex) => {
                return responseServiceObj.sendException(res, {
                    msg: ex.toString()
                });
            } );

        } catch (ex) {

            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    setOrderStatus( req, res, next ) {
        try {

            let order_id = ObjectId(req.params.order_id);
            let in_data = req.body;
            let rules = {
                status: 'required|in:OPEN,CLOSE,DELETED'
            };
    
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {
    
                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }
    
            OrderServiceObj.updateStatus( order_id, in_data )
            .then( async(result) => {
                
                return await responseServiceObj.sendResponse(res, {
                    msg: 'Order Updated Successfully',
                    data: {
                        result: await OrderServiceObj.getById(order_id)
                    }
                });
            } )
            .catch( async (ex) => {
                return await responseServiceObj.sendException(res, {
                    msg: ex.toString()
                });
            } );
            
        } catch (ex) {
    
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }
}