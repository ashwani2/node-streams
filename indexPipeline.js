const fs = require("fs");
const mongoose=require('mongoose')
const csv = require("csvtojson");
const { Transform} = require("stream");
const {pipeline}=require("stream/promises");
const { createGzip } = require("zlib");
const UserModel=require("./User")
const main = async () => {
await mongoose.connect('mongodb://localhost:27017/myApp')

  const readStream = fs.createReadStream("./data/import.csv", {
    highWaterMark: 100, // to minimize the chunk that is being readed
  });


  const myTransform = new Transform({
    objectMode: true,
    transform(chunk, enc, callback) {
      const user = {
        name: chunk.name,
        email: chunk.email.toLowerCase(),
        age: Number(chunk.age),
        salary: Number(chunk.salary),
        isActive: chunk.isActive == "true",
      };
      callback(null, user);
    },
  });

  const myFilter = new Transform({
    objectMode: true,
    transform(user, enc, callback) {
      if(!user.isActive || user.salary<1000){
        callback(null);
        return
      }

    //   console.log(user)
      callback(null,user)
    },
  });

  const convertToNdJson=new Transform({
    objectMode: true,
    transform(user, enc, callback) {
      const element=JSON.stringify(user)+'\n'
    console.log(element)
      callback(null,element)
    },
  });

  const saveUser=new Transform({
    objectMode:true,
    async transform(user,enc,cb){
        await UserModel.create(user)
        cb(null)
    }
  })

 // Pipeline always expects the last transform to perform writeStream
 try {
     let data=await pipeline(
      readStream,
      csv({delimiter:';'},{objectMode:true}),
      myTransform,
      myFilter,
      saveUser
    //   convertToNdJson,
    //   createGzip,
    //   fs.createWriteStream('./data/export.ndjson.gz')
     )
  
     console.log("STream Ended!!!")
    
 } catch (error) {
    console.log(error)
 }
};
main();
