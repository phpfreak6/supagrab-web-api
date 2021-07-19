var express = require('express');
var router = express.Router();

const authRouter = require('./authRouter');
const userRouter = require('./usersRouter');
const userAddressRouter = require('./userAddressRouter');
const WishlistRouter = require('./WishlistRouter');

const AuthController = require('../controllers/').AuthController;
const AuthControllerObj = new AuthController();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.use('/auth', authRouter);

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

module.exports = router;
