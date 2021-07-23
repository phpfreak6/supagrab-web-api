const express = require('express');
const router = express.Router();

const DepartmentController = new require('../controllers').DepartmentController;
const DepartmentControllerObj = new DepartmentController();

router.get('/exists/:title/:id?', [DepartmentControllerObj.exists]);
router.get('/', [DepartmentControllerObj.get]);
router.get('/:id', [DepartmentControllerObj.getById]);
router.post('/', [DepartmentControllerObj.insert]);
router.patch('/:id', [DepartmentControllerObj.update]);
router.delete('/:id', [DepartmentControllerObj.delete]);
router.post('image/:id', [DepartmentControllerObj.uploadImage]);

module.exports = router;