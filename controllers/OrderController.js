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

const CouponService = require('../services').CouponService;
const CouponServiceObj = new CouponService();

module.exports = class OrderController {

    constructor() { }

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
				            grandTotal = subTotal - ( discountAmt );
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
                    }

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