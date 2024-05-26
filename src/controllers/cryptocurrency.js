const csv = require("csv-parser");
const path = require("path");
const fs = require("fs");

const cryptoModel = require("../models/cryptocurrencyModel");
const fileUpload = require("../utils/utils");

exports.add = async (req, res) => {
  try {
    const filePath = req.files.csvFile;

    if (!filePath) {
      return res.send({
        status: false,
        statusCode: 400,
        message: "File is required.",
      });
    }

    const csvFileDir = path.join(__dirname, "../../public/csvFile/");
    const uploadCSVFile = await fileUpload(filePath, csvFileDir);
    if (uploadCSVFile.response) {
      return res.send({
        status: false,
        statusCode: 422,
        message: "File not uploaded.",
      });
    }

    const csvData = [];
    fs.createReadStream(`${csvFileDir}${uploadCSVFile.file}`)
      .pipe(
        csv({
          headers: [
            "User_ID",
            "UTC_Time",
            "Operation",
            "Market",
            "Buy_Sell_Amount",
            "Price",
          ],
          skipLines: 1,
        })
      )
      .on("data", (data) => {
        csvData.push(data);
      })
      .on("error", (error) => {
        return res.send({
          status: false,
          statusCode: 409,
          message: "Error, Something went wrong!",
        });
      })
      .on("end", async () => {
        await cryptoModel
          .insertMany(csvData)
          .then((crytoData) => {
            return res.send({
              status: true,
              statusCode: 201,
              message: "CSV data has been uploaded and saved successfully",
            });
          })
          .catch((err) => {
            return res.send({
              status: false,
              statusCode: 422,
              message: "Data not saved successfullly",
            });
          });
      });
  } catch (error) {
    return res.send({
      status: false,
      statusCode: 500,
      message: "Something Went Wrong!",
    });
  }
};

exports.list = async (req, res) => {
  try {
    const timestamp = req.body.timestamp;
    if(!timestamp){
        return res.send({
            status: false,
            statusCode: 400,
            message: 'timestamp is required.'
        })
    }

    await cryptoModel
      .find({
        UTC_Time: { $lte: timestamp },
      })
      .then((cryptoList) => {
        let BTCAmount = 0;
        let MTAmount = 0;

        cryptoList.forEach(({ Market, Operation, Buy_Sell_Amount }) => {
          const [marketName] = Market.split("/");
          const amount = Number(Buy_Sell_Amount);

          if (marketName === "BTC") {
            if(Operation === "Buy"){
                BTCAmount += amount
            }else{
                BTCAmount -= amount
            }
          } else if (marketName === "MATIC") {
            if(Operation === "Buy"){
                MTAmount += amount
            }else{
                MTAmount -= amount
            }
          }
        });

        const marketObj = {};
        if (BTCAmount !== 0) {
          marketObj.BTC = BTCAmount;
        }
        if (MTAmount !== 0) {
          marketObj.MATIC = MTAmount;
        }

        return res.send({
          status: true,
          statusCode: 200,
          message: "list available",
          data: marketObj,
        });
      })
      .catch((err) => {
        return res.send({
          status: false,
          statusCode: 404,
          message: "list not found",
        });
      });
  } catch (error) {
    return res.send({
      status: false,
      statusCode: 500,
      message: "Something Went Wrong!",
    });
  }
};
