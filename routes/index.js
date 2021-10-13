var express = require('express');
var router = express.Router({
    mergeParams: true
});

const authRouter = require('./authRouter');
const NewsletterRouter = require('./NewsletterRouter');
const userRouter = require('./UsersRouter');
const userAddressRouter = require('./UserAddressRouter');
const WishlistRouter = require('./WishlistRouter');
const FaqRouter = require('./FaqRouter');
const CmsRouter = require('./CmsRouter');
const SiteSettingRouter = require('./SiteSettingRouter');
const DepartmentRouter = require('./DepartmentRouter');
const ContactUsRouter = require('./ContactUsRouter');
const CategoryRouter = require('./CategoryRouter');
const ProductRouter = require('./ProductRouter');
const ProductReviewRouter = require('./ProductReviewRouter');
const ProductRatingRouter = require('./ProductRatingRouter');
const ProductAttributeRouter = require('./ProductAttributeRouter');
const CartRouter = require('./CartRouter');
const OrderRouter = require('./OrderRouter');
const CouponRouter = require('./CouponRouter');
const UsersOrderRouter = require('./UsersOrderRouter');

const AuthController = require('../controllers/').AuthController;
const AuthControllerObj = new AuthController();

var { basePath } = require('../config/config');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { base_path: basePath });
});


router.use('/', ContactUsRouter);
router.use('/auth', authRouter);
router.use('/faqs', FaqRouter);
router.use('/cms', CmsRouter);
router.use('/newsletter', NewsletterRouter);

router.use('/site-settings', SiteSettingRouter);
router.use('/departments', DepartmentRouter);
router.use('/departments', CategoryRouter);

router.use('/products/:productId/attributes', ProductAttributeRouter);
router.use('/products/:productId/reviews', ProductReviewRouter);
router.use('/products/:productId/ratings', ProductRatingRouter);
router.use('/products', ProductRouter);

router.use('/coupons', CouponRouter);

/**
 * auth middleware starts
 */
// router.use(AuthControllerObj.verifyToken);
/**
 * auth middleware ends
 */

router.use('/orders', OrderRouter);

router.use('/users', userRouter);
router.use('/users', userAddressRouter);
router.use('/users', WishlistRouter);
router.use('/users', CartRouter);
router.use('/users', UsersOrderRouter);

module.exports = router;