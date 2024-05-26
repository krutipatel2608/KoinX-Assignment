const fs = require('fs')

const fileUpload = async (file, csvFileDir) => {
    if (file.mimetype === 'text/csv') {
      const fileName = file.name;
    
      if(!fs.existsSync(csvFileDir)) {
        fs.mkdirSync(csvFileDir, { recursive: true })
      }
      const promise = await new Promise(function (resolve, reject) {
        file.mv(`${csvFileDir}` + fileName, async function (err) {
          if (err) {
            reject(err)
          } else {
            resolve(null)
          }
        })
      })
      return { response: promise, file: fileName }
    } else {
      return response(res, false, 415, message.invalidFileType)
    }
}

module.exports = fileUpload