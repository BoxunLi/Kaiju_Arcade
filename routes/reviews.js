const express = require('express');
const router = express.Router({mergeParams: true});
const Arcade = require('../models/arcade');
const Review = require('../models/review');
const{validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const {reviewSchema} = require('../schema.js');
const reviews = require('../controllers/reviews')

const ExpressError = require('../utils/ExpressError');

const catchAsync = require('../utils/catchAsync');




router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;