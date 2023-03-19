const fs = require("fs");
const { faker } = require("@faker-js/faker");



// They are time efficient but not memory efficient

// console.time("writeMany")
// const writeStream = fs.createWriteStream("./data/import.csv");

// writeStream.write("name;email;age;salary;isActive\n");

// for (let i = 0; i < 1000000; i++) {
//   const firstName = faker.name.firstName();
//   const email = faker.internet.email(firstName);
//   const age = faker.datatype.number({ min: 10, max: 100 });
//   const salary = faker.random.numeric(4, { allowLeadingZeros: true });
//   const isActive = faker.datatype.boolean();

//   const arr = [firstName, email, age, salary, isActive];
//   writeStream.write(arr.join(';')+'\n')
// }

// writeStream.end()
// writeStream.on("finish",()=>{
//   console.timeEnd("writeMany")
// })


//-----------------------------------------------------------------------------------------------------------------------
// they are memory efficient

console.time("writeMany");
const writeStream = fs.createWriteStream("./data/import.csv");

writeStream.write("name;email;age;salary;isActive\n");

let i=0
function writeMany(){

  while (i < 10000) {
    const firstName = faker.name.firstName();
    const email = faker.internet.email(firstName);
    const age = faker.datatype.number({ min: 10, max: 100 });
    const salary = faker.random.numeric(4, { allowLeadingZeros: true });
    const isActive = faker.datatype.boolean();
  
    const arr = [firstName, email, age, salary, isActive];
    // console.log(writeStream.writableLength)

    // this is our last write
    if (i === 10000 - 1) {
      return writeStream.end(arr.join(';')+'\n');
    }


   if(! writeStream.write(arr.join(';')+'\n')) break
    
   i++
}

}

writeMany();

// resume our loop once our stream's internal buffer is emptied
writeStream.on("drain", () => {
  console.log("Drained!!!");
  writeMany();
});

writeStream.on("finish", () => {
  console.timeEnd("writeMany");
});



