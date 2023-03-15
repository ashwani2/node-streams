const fs = require("fs");
const csv = require("csvtojson");
const { Transform} = require("stream");
const {pipeline}=require("stream/promises")

const main = async () => {
  const readStream = fs.createReadStream("./data/import.csv", {
    highWaterMark: 100, // to minimize the chunk that is being readed
  });

  const writeStream = fs.createWriteStream("./data/export.csv");

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

      console.log(user)
      callback(null)
    },
  });
  
 // Pipeline always expects the last transform to perform writeStream
   await pipeline(
    readStream,
    csv({delimiter:';'},{objectMode:true}),
    myTransform,
    myFilter
   )

   console.log("STream Ended!!!")
};
main();
