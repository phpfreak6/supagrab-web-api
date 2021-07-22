var express = require('express');
var router = express.Router();

const authRouter = require('./authRouter');
const NewsletterRouter = require('./NewsletterRouter');
const userRouter = require('./usersRouter');
const userAddressRouter = require('./userAddressRouter');
const WishlistRouter = require('./WishlistRouter');
const FaqRouter = require('./FaqRouter');
const CmsRouter = require('./CmsRouter');
const SiteSettingRouter = require('./SiteSettingRouter');

const AuthController = require('../controllers/').AuthController;
const AuthControllerObj = new AuthController();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.use('/auth', authRouter);
router.use('/faqs', FaqRouter);
router.use('/cms', CmsRouter);

router.use('/newsletter', NewsletterRouter);

/**
 * auth middleware starts
 */
router.use(AuthControllerObj.verifyToken);
/**
 * auth middleware ends
 */

router.use('/users', userRouter);
router.use('/users', userAddressRouter);
router.use('/users', WishlistRouter);

router.use('/site-settings', SiteSettingRouter);

module.exports = router;
