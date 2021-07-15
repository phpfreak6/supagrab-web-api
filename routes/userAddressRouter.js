const express = require('express');
const router = express.Router();

const UserAddressController = new require('../controllers').UserAddressController;
const UserAddressControllerObj = new UserAddressController();

router.get('/:user_id/addresses', [UserAddressControllerObj.getUserAddresses]);

router.post('/:user_id/addresses', [UserAddressControllerObj.insertUserAddress]);

module.exports = router;