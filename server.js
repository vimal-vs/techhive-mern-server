const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());

app.set('port',3001);

const mongoose = require('mongoose');

require('dotenv').config();
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);

const database = mongoose.connection;
const Model = require('./src/models/model');

database.once('connected', () => {
    console.log('Database Connected');
});

app.get('/data', async(req, res) => {
    try{
        const data = await Model.find();
        res.json(data);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

app.get('/data/:name', async(req, res) => {
    try{
        const name = req.params.name;
        const data = await Model.findOne(
            { name: name },
            { _id: 0, __v: 0 }
        );
        res.json(data);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

app.post('/data/add', async(req, res) => {
    const data = new Model({
        name: req.body.name,
        description: req.body.description
    });
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }
    catch(err) {
        res.status(400).json({message: err.message});
    }
});

app.patch('/data/edit/:name', async(req, res) => {
    try{
        const name = req.params.name;
        const updateName = req.body.updateName;
        const updateDescription = req.body.updateDescription;
        const data = await Model.findOneAndUpdate(
            { name: name },
            { name: updateName, description: updateDescription }
        );
        res.json(data);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

app.delete('/data/delete/:name', async(req, res) => {
    try{
        const name = req.params.name;
        const data = await Model.findOneAndDelete(
            { name: name }
        );
        res.json(data);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

app.listen(3001);