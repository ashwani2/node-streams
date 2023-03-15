const fs=require("fs")

// We cannot use main1 code because it tries to write the data while reading it, it can backfire in the cases
// pf backpressure(when we are reading the data from SSD or HDD and writting it to SSD then it is fine but 
// if we are reading from SSD and writing to HDD then it will cause memory leakage)

// to avoid this we can use the method in main2 function

// const main1=async()=>{
//     const readStream=fs.createReadStream('./data/import.csv',{
//         highWaterMark:100   // to minimize the chunk that is being readed
//     })

//     const writeStream=fs.createWriteStream('./data/export.csv')

//     readStream.on('data',(buffer)=>{
//         console.log("++++++++++++++++DATA:,")
//         console.log(buffer)
//         writeStream.write(buffer)
//     })

//     readStream.on('end',()=>{
//         console.log("Stream Ended!")
//         writeStream.end()
//     })
// }
// main1()

const main2=async()=>{
    const readStream=fs.createReadStream('./data/import.csv',{
        highWaterMark:100   // to minimize the chunk that is being readed
    })

    const writeStream=fs.createWriteStream('./data/export.csv')

        readStream.pipe(writeStream)
        readStream.on('end',()=>{
            console.log("reading ended!")
        })

        writeStream.on('finish',()=>{
            console.log("writing finished!")
        })
}
main2()