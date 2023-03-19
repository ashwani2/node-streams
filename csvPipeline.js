const fs = require("fs");
const csv = require("csvtojson");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");
const main = async () => {
  const readStream = fs.createReadStream("./data/import.csv", {
    highWaterMark: 100, // to minimize the chunk that is being readed
  });
  const writeStream = fs.createWriteStream("./data/export.csv");

  writeStream.write(
    ["firstName", "email", "age", "salary", "isActive"].join(",") + "\n"
  );

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
      if (!user.isActive || user.salary < 1000) {
        callback(null);
        return;
      }

      //   console.log(user)
      callback(null, user);
    },
  });

  const convertToCSV = new Transform({
    objectMode: true,
    transform(user, enc, callback) {
      const element = Object.values(user).join(",") + "\n";
      // console.log(element);
      callback(null, element);
    },
  });

  // Pipeline always expects the last transform to perform writeStream
  try {
    let data = await pipeline(
      readStream,
      csv({ delimiter: ";" }, { objectMode: true }),
      myTransform,
      myFilter,
      convertToCSV,
      writeStream
    );

    console.log("STream Ended!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
  }
};
main();
