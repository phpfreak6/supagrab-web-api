const fs = require('fs');
const Validator = require('validatorjs');
const { ObjectId } = require('mongodb');

const ResponseService = require('../services').ResponseService;
const responseServiceObj = new ResponseService();

const ProductService = require('../services').ProductService;
const ProductServiceObj = new ProductService();

const DepartmentService = require('../services').DepartmentService;
const departmentServiceObj = new DepartmentService();

const CategoryService = require('../services').CategoryService;
const categoryServiceObj = new CategoryService();

let PRODUCT_IMAGE_PATH = require('../config/config').PRODUCT_IMAGE_PATH;
let PRODUCT_IMAGE_UPLOAD_PATH = require('../config/config').PRODUCT_IMAGE_UPLOAD_PATH;

module.exports = class ProductController {

    constructor() { }

    get(req, res, next) {
        try {
            let searchTxt = req.query.searchTxt;
            ProductServiceObj
                .get(searchTxt)
                .then(async (result) => {
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Products Fetched Successfully',
                        data: { 
                            product: result,
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

    getById(req, res, next) {
        try {
            let id = ObjectId(req.params.id);
            ProductServiceObj.getById(id)
                .then(async (result) => {
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Product Fetched Successfully',
                        data: { 
                            product: result,
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

    exists(req, res, next) {
        try {
            let title = req.query.product_title;
            let id = (req.params.id) ? ObjectId(req.params.id) : null;
            ProductServiceObj.exists(title, id)
                .then(async (result) => {
                    if (result) {
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Product Title Already Exists',
                            data: { msg: 'Product Title Already Exists', exists: true }
                        });
                    } else {
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Product Title Available',
                            data: { msg: 'Product Title Available', exists: false }
                        });
                    }
                }).catch(async (ex) => {
                    return await responseServiceObj.sendException(res, { msg: ex.toString() });
                });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    slugExists(req, res, next) {
        try {
            let slug = req.query.product_slug;
            let id = (req.params.id) ? ObjectId(req.params.id) : null;
            ProductServiceObj.slugExists(slug, id)
                .then(async (result) => {
                    if (result) {
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Product Slug Already Exists',
                            data: { msg: 'Product Slug Already Exists', exists: true }
                        });
                    } else {
                        return await responseServiceObj.sendResponse(res, {
                            msg: 'Product Slug Available',
                            data: { msg: 'Product Slug Available', exists: false }
                        });
                    }
                }).catch(async (ex) => {
                    return await responseServiceObj.sendException(res, { msg: ex.toString() });
                });
        } catch (ex) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    insert(req, res, next) {
        try {
            let in_data = req.body;
            let rules = {
                department_id: 'required',
                category_id: 'required',
                product_title: 'required',
                product_slug: 'required',
                product_price: 'required|numeric',
                // attributes: 'required',
                // reviews: 'required',
                status: 'required',
                // quantity:
                // purchase_price:
                // selling_price:
                // maximum_price:
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {
                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }
            ProductServiceObj.exists(in_data.product_title)
                .then((result) => {
                    if (result) {
                        throw 'Title Already exists';
                    }
                })
                .then(async (result) => {
                    let product = await ProductServiceObj.insert(in_data);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Product Inserted Successfully',
                        data: { product: product }
                    });
                })
                .catch(async (ex) => {
                    return await responseServiceObj.sendException(res, { msg: ex.toString() });
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
            let rules = { id: id };

            in_data.department_id ? rules.department_id = 'required' : '';
            in_data.category_id ? rules.category_id = 'required' : '';
            in_data.product_title ? rules.product_title = 'required' : '';
            in_data.product_slug ? rules.product_slug = 'required' : '';
            in_data.product_price ? in_data.product_price = 'required|numeric' : '',
            // attributes: 'required',
            // reviews: 'required',
            in_data.status ? rules.status = 'required' : '';
            // quantity:
            // purchase_price:
            // selling_price:
            // maximum_price:

            let validation = new Validator(in_data, rules);
            if (validation.fails()) {
                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }
            ProductServiceObj.exists(in_data.product_title, id)
                .then((result) => {
                    if (result) {
                        throw 'Title Already exists';
                    }
                })
                .then(async (result) => {
                    let Product = await ProductServiceObj.update(in_data, id);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Product Updated Successfully',
                        data: { product: await ProductServiceObj.getById(id) }
                    });
                })
                .catch(async (ex) => {
                    return await responseServiceObj.sendException(res, { msg: ex.toString() });
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
            ProductServiceObj.isIdExists(id)
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
                    let result = await ProductServiceObj.update(in_data, id);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Product Deleted Successfully'
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

    productByDepartment(req, res, next) {
        try {
            let department_slug = req.params.department_slug;
            departmentServiceObj.getBySlug(department_slug)
                .then(async (result) => {
                    if( result ) {
                        return result;
                    } else {
                        throw "No department found.";
                    }
                })
                .then(async (result) => {
                    let department_id = result._id;
                    return department_id;
                })
                .then(async (department_id) => {
                    let result = await ProductServiceObj.getByDepartment(department_id);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'products found',
                        data: {
                            product: result,
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

    productByCategory(req, res, next) {
        try {
            let category_slug = req.params.category_slug;
            categoryServiceObj.getBySlug(category_slug)
                .then(async (result) => {
                    if( result ) {
                        return result;
                    } else {
                        throw "No category found.";
                    }
                })
                .then(async (result) => {

                    let categories = result[0].categories;
                    return categories;
                })
                .then(async (categories) => {

                    let catg = categories.filter( ( element ) => element.category_slug == category_slug ? true : false );
                    if( catg.length ) {
                        return catg[0];
                    } else {
                        throw "No category found.";
                    }
                })
                .then(async (category) => {
                    return category._id;
                })
                .then(async (category_id) => {
                    let result = await ProductServiceObj.getByCategory(category_id);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'products found',
                        data: {
                            product: result,
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

    uploadImage(req, res, next) {
        try {
            let productId = ObjectId(req.params.id);
            console.log('productId', productId);
            ProductServiceObj.isIdExists(productId)
                .then(async (isExists) => {
                    if (!isExists) {
                        throw 'Invalid Product id.'
                    }
                })
                .then(async (in_result) => {
                    let imageDetails = req.params.imageDetails;    
                    let obj = {
                        product_id: productId,
                        url: imageDetails.fullFileName,
                        default: 0
                    };
                    let result = await ProductServiceObj.insertImage( productId, obj );
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Product image uploaded successfully',
                        data: {
                            product: await ProductServiceObj.getById(productId),
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

    deleteImage(req, res, next) {
        try {
            let productId = req.params.productId;
            let image_name = req.params.image;
            let imageId = req.params.imageId;
            let imagesArr = [];
            let imagesNameArr = [];
            let product;

            productId = ObjectId(productId);
            ProductServiceObj.isIdExists(productId)
                .then(async (isExists) => {
                    if (!isExists) {
                        throw 'Invalid Product id';
                    } 
                    return true;
                })
                .then(async (result) => {
                    product = await ProductServiceObj.getById(productId);
                    // imagesArr = product.images.filter( image => image.url !== image_name );
                    imagesNameArr = product.images.filter( image => image._id !== imageId );
                    if( imagesNameArr.length > 0 ) {
                        image_name = imagesNameArr[0].url;
                    } else {}
                    return true;
                })
                .then(async (inResult) => {
                    let file = PRODUCT_IMAGE_UPLOAD_PATH + '/' + image_name;
                    if (fs.existsSync(file)) {
                        fs.unlinkSync(file);
                    }
                    return true;
                })
                .then(async (inResult) => {
                    let result = await ProductServiceObj.deleteImage( productId, imageId);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Image deleted successfully',
                        data: {
                            product: await ProductServiceObj.getById(productId),
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

    setImagePrimary( req, res, next ) {
        try {

            let in_id = req.params.productId;
            let productId = ObjectId(in_id);

            let in_image_id = req.params.imageId;
            let imageId = ObjectId(in_image_id);

            let in_data = req.body;
            let rules = {
                default: 'required|boolean'
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            ProductServiceObj.getById(productId)
                .then(async (result) => {
                    return result;
                })
                .then(async (result) => {
                    let product = await ProductServiceObj.setImagePrimary( productId, imageId, in_data);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Image Set As Primary',
                        data: {
                            product: await ProductServiceObj.getById(productId),
                            PRODUCT_IMAGE_PATH: PRODUCT_IMAGE_PATH
                        }
                    });
                })
                .catch(async (ex) => {
                    return await responseServiceObj.sendException(res, {
                        msg: ex.toString()
                    });
                });

        } catch( ex ) {
            return responseServiceObj.sendException(res, {
                msg: ex.toString()
            });
        }
    }

    setStatus(req, res, next) {
        try {

            let in_id = req.params.id;
            let id = ObjectId(in_id);
            let in_data = req.body;
            let rules = {
                status: 'required|in:OPEN,CLOSE'
            };
            let validation = new Validator(in_data, rules);
            if (validation.fails()) {

                return responseServiceObj.sendException(res, {
                    msg: responseServiceObj.getFirstError(validation)
                });
            }

            ProductServiceObj.isIdExists(id)
                .then(async (isExists) => {
                    if (!isExists) {
                        throw 'Invalid product id.'
                    }
                    return true;
                })
                .then(async (inResult) => {
                    let result = await ProductServiceObj.setStatus(in_data, id);
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Product status updated successfully.',
                        data: {
                            user: await ProductServiceObj.getById(id),
                            // userImagePath: userImagePath
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

    productBySlug(req, res, next) {
        try {
            let product_slug = req.params.product_slug;
            ProductServiceObj.getByProductSlug(product_slug)
                .then(async (result) => {
                    return await responseServiceObj.sendResponse(res, {
                        msg: 'Product Fetched Successfully',
                        data: { 
                            product: result,
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
};