const express = require("express");
const app = express()
const seq = require('./config/connection');
const PORT = process.env.PORT || 3001;





seq.sync({force:false}).then(()=>{
    app.listen(PORT,()=>{
        console.log(`Listening on ${PORT}`)
    })
})

