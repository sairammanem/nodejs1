require('dotenv').config();

const express = require("express");
const mongodb = require('mongodb');

const port = process.env.PORT || 4001
const app = express();
const mongoclient = mongodb.MongoClient
const objectid = mongodb.ObjectID;
//const dburl = 'mongodb://locolhost:27017'
// const dburl = 'mongodb+srv://sairam:sairamvirat@cluster0.qxjo5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const dburl = process.env.DB_URL || 'mongodb://locolhost:27017'
 
app.use(express.json());

// app.get('/',(req,res) => {
//     mongoclient.connect(dburl,(err,client) => {
//         if(err) throw err;
//         let db = client.db("products")
//         db.collection('products').find().toArray().then(data => {
//             res.status(200).json(data)
//         }).catch(err => {
//             res.status(404).json({message:'no data found'})
//             console.log(error);
//         })
//     })
// })

app.get('/', async (req,res) => {
    try{
   let client = await mongoclient.connect(dburl)
   let db = client.db('products')
   let data = await db.collection('products').find().toArray()
   if(data.length>0) res.status(200).json(data)
   else res.status(404).json({message:'data not found'})
   client.close()
    }catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }

})

 app.post('/create', async (req,res) => {
     try {
        let client = await mongoclient.connect(dburl)
        let db = client.db('products')
        await db.collection('products').insertOne(req.body)
        res.status(200).json({message:'user created'})
        client.close()

         
     } catch (error) {
          console.log(error)
        res.status(500).json({message:'Internal server error'})
     }
 })
 app.put('/update/:id',async (req,res) => {
    try {
       let client = await mongoclient.connect(dburl)
       let db = client.db('products')
       await db.collection('products').findOneAndUpdate({_id: objectid(req.params.id)},{$set:req.body})
       res.status(200).json({message:'user updated'})
       client.close()
    } catch (error) {
         console.log(error)
       res.status(500).json({message:'Internal server error'})
    }
})
 app.delete('/delete/:id', async(req,res) => {
    try {
        let client = await mongoclient.connect(dburl)
        let db = client.db('products')
        await db.collection('products').deleteOne({_id: objectid(req.params.id)})
        res.status(200).json({message:'user deleted'})
        client.close()
     } catch (error) {
          console.log(error)
        res.status(500).json({message:'Internal server error'})
     }
 })


app.listen(port,()=>console.log(`app runs with ${port}`))