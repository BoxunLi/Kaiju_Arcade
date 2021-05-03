const express = require('express');
const router = express.Router();
const arcades = require('../controllers/arcades');
const catchAsync = require('../utils/catchAsync');
const Arcade = require('../models/arcade');
const {isLoggedIn, isAuthor, validateArcade} = require('../middleware');
const arcade = require('../models/arcade');
const multer  = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({ storage })


router.route('/')
    .get(catchAsync(arcades.index))
    .post(isLoggedIn, upload.array('image'), validateArcade, catchAsync(arcades.createArcade))
    
    
router.get('/new', isLoggedIn, arcades.renderNewForm);

router.route('/:id')
    .get(catchAsync(arcades.showArcade))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateArcade, catchAsync(arcades.updateArcade))
    .delete(isLoggedIn, isAuthor, catchAsync(arcades.deleteArcade))



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(arcades.renderEditForm))





module.exports = router;