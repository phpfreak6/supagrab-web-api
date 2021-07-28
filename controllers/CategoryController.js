const fs = require('fs');
const Validator = require('validatorjs');
const {ObjectId} = require('mongodb');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const CategoryService = require('../services').CategoryService;
const CategoryServiceObj = new CategoryService();

let CATEGORY_IMAGE_PATH = require('../config/config').CATEGORY_IMAGE_PATH;
let CATEGORY_IMAGE_UPLOAD_PATH = require('../config/config').CATEGORY_IMAGE_UPLOAD_PATH;

module.exports = class CategoryController {

    constructor() {

    }

    get(req, res, next) {
        try {
            let searchTxt = req.query.searchTxt;
            CategoryServiceObj.get(searchTxt, req.params.department_id)
                    .then(async (result) => {
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Categories Fetched Successfully',
                            data: {categories: result}
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

    getById(req, res, next) {
        try {
            let id = ObjectId(req.params.id);
            CategoryServiceObj.getById(id)
                    .then(async (result) => {
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Category Fetched Successfully',
                            data: {category: result}
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

    exists(req, res, next) {
        try {
            let title = req.params.title;
            let id = (req.params.id) ? ObjectId(req.params.id) : null;
            CategoryServiceObj.exists(title, id)
                    .then(async (result) => {
                        if (result) {
                            return await responseServiceObj.sendResponse(res, {
                                data: {msg: 'Category Already Exists', category: true}
                            });
                        } else {
                            return await responseServiceObj.sendResponse(res, {
                                data: {msg: 'Category Available', category: false}
                            });
                        }
                    }).catch(async (ex) => {
                return await responseServiceObj.sendException(res, {msg: ex.toString()});
            });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    insert(req, res, next) {
        try {
            let data = req.body;
            let department_id = ObjectId(req.params.department_id);
            let rules = {title: 'required'};
            let validation = new Validator(data, rules);
            if (validation.fails()) {
                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }
            CategoryServiceObj.exists(data, department_id)
                    .then((result) => {
                        if (result) {
                            throw 'Title Already exists';
                        }
                    })
                    .then(async(result) => {
                        let category = await CategoryServiceObj.insert(data, department_id);
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Category Inserted Successfully',
                            data: {category: category}
                        });
                    })
                    .catch(async (ex) => {
                        return await responseServiceObj.sendException(res, {msg: ex.toString()});
                    });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    update(req, res, next) {
        try {
            let in_data = req.body;
            let id = ObjectId(req.params.id);
            let rules = {id: id};
            in_data.title ? rules.title = 'required' : '';
            in_data.status ? rules.status = 'required' : '';
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {
                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }
            CategoryServiceObj.exists(in_data.title, id)
                    .then((result) => {
                        if (result) {
                            throw 'Title Already exists';
                        }
                    })
                    .then(async(result) => {
                        let category = await CategoryServiceObj.update(in_data, id);
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Category Updated Successfully',
                            data: {category: await CategoryServiceObj.getById(id)}
                        });
                    })
                    .catch(async (ex) => {
                        return await responseServiceObj.sendException(res, {msg: ex.toString()});
                    });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    delete(req, res, next) {
        try {
            let id = ObjectId(req.params.id);
            CategoryServiceObj.isIdExists(id)
                    .then(async (isExists) => {
                        if (!isExists) {
                            throw 'Invalid Id Provided';
                        }
                        return true;
                    })
                    .then(async (inResult) => {
                        let in_data = {
                            status: 'DELETED',
                            deleted_at: new Date()
                        };
                        let result = await CategoryServiceObj.update(in_data, id);
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Category Deleted Successfully'
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

    uploadImage(req, res, next) {
        try {
            let id = ObjectId(req.params.id);
            CategoryServiceObj.isIdExists(id)
                    .then(async (isExists) => {
                        if (!isExists) {
                            throw 'Invalid category id.'
                        }
                    })
                    .then(async (isExists) => {
                        let imageDetails = req.params.imageDetails;
                        let result = await CategoryServiceObj.update({image: imageDetails.fullFileName, updated_at: new Date()}, id);
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Category image uploaded successfully',
                            data: {
                                category: await CategoryServiceObj.getById(id),
                                category_image_path: CATEGORY_IMAGE_PATH
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

    deleteImage(req, res, next) {
        try {
            let id = ObjectId(req.params.id);
            let image_name = req.params.image;
            CategoryServiceObj.isIdExists(id)
                    .then(async (isExists) => {
                        if (!isExists) {
                            throw 'Invalid category id';
                        }
                        return true;
                    })
                    .then(async(inResult) => {
                        let file = CATEGORY_IMAGE_UPLOAD_PATH + '/' + image_name;
                        if (!fs.existsSync(file)) {
                            throw 'File not exists.';
                        }
                        fs.unlinkSync(file);
                    })
                    .then(async (inResult) => {
                        let result = await CategoryServiceObj.update({image: null}, id);
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Image deleted successfully',
                            data: {
                                category: await CategoryServiceObj.getById(id),
                                category_image_path: CATEGORY_IMAGE_PATH
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

};