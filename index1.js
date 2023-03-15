const fs = require("fs");
const csv = require("csvtojson");
const { Transform } = require("stream");

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
      callback(null,user)
    },
  });
  
  readStream
    .pipe(
      csv(
        {
          delimiter: ";",
        },
        { objectMode: true } // it will transform the readed stream into objects
      )
    )
    .pipe(myTransform)
    .pipe(myFilter)
    .on("data", (buffer) => {
        console.log("DATA++++++++++++++++:");
        console.log(buffer);
    })
    .on("error", (error) => {
      console.log("STREAM ERROR:", error);
    })
    .on("end", () => {
      console.log("Stream Ended!");
    });
};
main();
