const express = require('express');
const router = express.Router({
    mergeParams: true
});

const UserAddressController = new require('../controllers').UserAddressController;
const UserAddressControllerObj = new UserAddressController();

router.get('/:user_id/addresses', [UserAddressControllerObj.getUserAddresses]);

router.post('/:user_id/addresses', [UserAddressControllerObj.insertUserAddress]);

router.delete('/:user_id/addresses/:address_id', [UserAddressControllerObj.deleteUserAddress]);

router.get('/:user_id/addresses/:address_id', [UserAddressControllerObj.getUserAddressByAddressId]);

router.patch('/:user_id/addresses/:address_id', [UserAddressControllerObj.updateUserAddress]);

module.exports = router;