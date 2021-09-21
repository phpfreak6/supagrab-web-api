const fs = require('fs');
const Validator = require('validatorjs');
const { ObjectId } = require('mongodb');

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

module.exports = class OrderController {

    constructor() { }

    insert(req, res, next) {

        try {

            let in_data = req.body;
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

                tax_charge: 'required|numeric',
                // tax_amount: 'required|numeric',

                // coupon_applied: 'required|numeric',
                // coupon_code: 'required|numeric',
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

            let userId = req.params.user_id;

            let is_valid;

            is_valid = ObjectId.isValid(userId);
            if (!is_valid) {
                throw 'User id not well formed.'
            }

            in_data['customer_id'] = ObjectId( userId );

            CartServiceObj.getCartByUser( userId )
                .then( async (cartDetails) => {
                    
                    let data = [];
                    cartDetails.forEach(element => {
                        data.push({
                            user_id: element.user_id,
                            product_id: element.product_id,
                            product_detail: element.product_detail,
                            qty: element.qty,
                            product_price:element.product_price,
                            status: 'OPEN'
                        });
                    });

                    in_data['products'] = data;
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

                    
                    return true;
                } )
                .then( async(out) => {

                    // transaction_id: { type: String, default: null },
                    // payment_mode: { type: String, enum: PAYMENT_MODE, default: 'COD' },
                    // amount: { type: Number, default: 0 },
                    // transaction_status: { type: Number, enum: TRANSACTION_STATUS, default: 'PENDING' },

                    return true;
                } )
                .then( async (out) => {

                    let result = await OrderServiceObj.insert(in_data);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Order Placed successfully',
                        // data: {
                        //     cart: await CartServiceObj.getCartByUser( userId )
                        // }
                    });
                })
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
}