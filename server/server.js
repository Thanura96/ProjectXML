const express = require("express");
const cors = require("cors");
const server = express();
const fs = require("fs");
const xml2js = require("xml2js");
var bigDecimal = require("js-big-decimal");
const { multiply } = require("js-big-decimal");

require("dotenv").config();
server.use(cors());
server.use(express.json());

const PORT = 2000;
server.listen(PORT, () => {
    console.log("Server up and runnig in port: " + PORT);
});

//Begin
var parser = new xml2js.Parser();

//XML File Path
const filePath = "C://Users//ASUS//Desktop//XML//bank1.xml";
onChangeHandler=event=>{

    console.log(event.target.files[0])

}
//Read XML File
fs.readFile(filePath, function (err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(
            JSON.stringify(result.PBOnlinePaymentFile.PaymentList[0].PaymentItem),
            "============XML PAYMENT ITEM==============="
        );

        //ADD FOR LOOP TO PAYMENT ITEM LIST
        let multiply = 0;
        result.PBOnlinePaymentFile.PaymentList[0].PaymentItem.forEach((element) => {
            //Multiply amount and din
            let result = bigDecimal.multiply(element.Amount, element.DIN);

            //add result
            multiply = bigDecimal.add(result, multiply);
            console.log("=======Multiply Result====== " + result);
        });

        console.log("All Multiply Result After Addition  =  " + multiply);
        let allAmount = bigDecimal.divide(multiply, "7");
        console.log("After Divided From 7                =  " + allAmount);
        //Rounded Answer for decimal point 2
        var value = bigDecimal.round(allAmount, 3);
        console.log("\nRounded Final Answer   =  ", value);


        console.log("given checksum          =  " + JSON.stringify(result.PBOnlinePaymentFile.CheckSum[0]));

        if (value === result.PBOnlinePaymentFile.CheckSum[0]) {
            console.log(
                "======================== Checksum equel ==============================="
            );
        } else {
            console.log(
                "======================== Checksum not equel ==============================="
            );
        }
    });
});
