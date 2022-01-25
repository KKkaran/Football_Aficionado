const express = require("express");
const seq = require('./config/connection');
const PORT = process.env.PORT || 3001;
const models = require('./models')
const routes = require('./controllers')
const path = require('path');

const app = express()

app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);



seq.sync({force:false}).then(()=>{
    app.listen(PORT,()=>{
        console.log(`Listening on the ${PORT} using Sequelize`)
    })
})

