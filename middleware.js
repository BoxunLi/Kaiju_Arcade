const {arcadeSchema, reviewSchema} = require('./schema.js');
const ExpressError = require('./utils/ExpressError');
const Arcade = require('./models/arcade');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first.');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateArcade = (req, res, next) => {
    const {error} = arcadeSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else{
        next();
    }
}

// Authorization middleware
module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const arcade =  await Arcade.findById(id);
    if (! arcade.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/arcades/${arcade._id}`);
    }
    next();
}

// Authorization middleware
module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review =  await Review.findById(reviewId);
    if (! review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/arcades/${id}`);
    }
    next();
}

//REviews
module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else{
        next();
    }
}

