const Arcade = require('../models/arcade');
const Review = require('../models/review');

module.exports.createReview = async(req, res) => {
    const arcade = await Arcade.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    arcade.reviews.push(review);
    await review.save();
    await arcade.save();
    req.flash  ('success', 'New review created!');
    res.redirect(`/arcades/${arcade._id}`);
}

module.exports.deleteReview = async(req, res) => {
    const{id, reviewId} = req.params;
    await Arcade.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Review deleted.')
    res.redirect(`/arcades/${id}`);
}