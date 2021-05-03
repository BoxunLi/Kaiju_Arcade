const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const opts = {toJSON: { virtuals: true}};


const ArcadeSchema = new Schema({
    images: [
        {
            url: String,
            filename: String
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    title: String,
    price: {
        type:  Number,
        min: 0
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

ArcadeSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <a href="/arcades/${this.id}">${this.title}</a>
    <p>${this.description.substring(0, 40)}...</p>`
});

ArcadeSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
    
})

module.exports = mongoose.model('Arcade', ArcadeSchema);