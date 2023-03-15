const fs = require("fs");
const csv = require("csvtojson");
const { Transform } = require("stream");

const main = async () => {
  const readStream = fs.createReadStream("./data/import.csv", {
    highWaterMark: 100, // to minimize the chunk that is being readed
  });

  const writeStream = fs.createWriteStream("./data/export.csv");

  readStream
    .pipe(
      csv(
        {
          delimiter: ";",
        },
        { objectMode: true } // it will transform the readed stream into objects
      )
    )
    .pipe(
        new Transform({
            objectMode:true,
            transform(chunk,enc,callback){
                console.log("chunk",chunk)
                callback(null,chunk)
            }
        })
    )
    .on("data", (buffer) => {
    //   console.log("DATA++++++++++++++++:");
    //   console.log(buffer);
    })
    .on("error",(error)=>{
        console.log("STREAM ERROR:",error)
    })
    .on('end',()=>{
        console.log("Stream Ended!")
    })
};
main();
