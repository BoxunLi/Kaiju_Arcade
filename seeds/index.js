if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require('express');

const mongoose = require('mongoose');
const Arcade = require('../models/arcade');
const axios = require('axios');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const getImg = async (num, page) => {
    const res = await axios.get(`https://api.unsplash.com/search/photos?page=${page}&query=arcade&per_page=30&client_id=jbuuwpyTEzNEStryoUZaFH1L49DPFRsEFyFv8wstchk`);
    const url = res.data.results[num].urls.regular;
    return url;
}

const seedDB = async() => {
    await Arcade.deleteMany({});
    for(let j = 1; j< 5; j++){
        for(let i = 0; i<30; i++){
            const random1000 = Math.floor(Math.random() * 1000);
            const pic = await getImg(i, j);
            const price = Math.floor(Math.random() * 20) + 10;
            const a = new Arcade({
                author: '608edb6f87b07b0015255eea',
                title: `${sample(descriptors)} ${sample(places)}`,
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                geometry: {
                    type:"Point",
                    coordinates:[cities[random1000].longitude, cities[random1000].latitude]
                },
                images: [
                    {
                        url: pic,
                        filename: 'pic'
                    }
                ],
                description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, fugit, culpa, hic magnam ratione accusamus porro eaque adipisci amet magni necessitatibus illo odio eius. Assumenda laudantium sint iste odit rem.',
                price: price
            });
            await a.save();
        }
    }
    

}

seedDB().then(() => {
    mongoose.connection.close();
})