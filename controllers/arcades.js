const Arcade = require('../models/arcade');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN; 
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res) => {
    const arcades = await Arcade.find({});
    res.render('arcades/index', {arcades});
}

module.exports.renderNewForm = (req, res) => {
    res.render('arcades/new');
}
module.exports.createArcade = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.arcade.location,
        limit: 1
    }).send();

    const newArcade = new Arcade(req.body.arcade);
    newArcade.geometry = geoData.body.features[0].geometry;
    newArcade.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    newArcade.author = req.user._id;
    await newArcade.save();
    console.log(newArcade);
    req.flash('success', 'Successfully made a new arcade!');
    res.redirect(`arcades/${newArcade._id}`)
}

module.exports.showArcade = async (req, res) => {
    const arcade = await (await Arcade.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'));
    if(!arcade){
        req.flash('error', 'Cannot find arcade!');
        res.redirect('/arcades');
    }
    res.render('arcades/show', {arcade});
}

module.exports.renderEditForm = async(req, res) => {
    const {id} = req.params;
    const arcade = await Arcade.findById(id); 
    if(!arcade){
        req.flash('error', 'Cannot find arcade!');
        res.redirect('/arcades');
    }
    res.render('arcades/edit', {arcade});
}

module.exports.updateArcade = async(req, res) => {
    const {id} = req.params;
    const arcade = await Arcade.findByIdAndUpdate(id, {...req.body.arcade});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    arcade.images.push(...imgs);
    await arcade.save();
    if(req.body.deleteImages){
        for( let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await arcade.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'successfully updated arcade!');
    res.redirect(`/arcades/${arcade._id}`);
}

module.exports.deleteArcade = async (req, res) => {
    const {id} = req.params;
    await Arcade.findByIdAndDelete(id);
    req.flash('success', 'Arcade deleted.')
    res.redirect('/arcades');
}