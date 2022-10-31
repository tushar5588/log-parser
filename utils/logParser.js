const fs = require("fs");
const readline = require("readline");
const stream = require("stream");

exports.logParser = async (req, res) => {
  const files = req.files.data;
  files.mv("./utils/dummy.csv", function (err) {
    if (err) {
      console.log(err);
    }
  });
  var instream = fs.createReadStream("./utils/dummy.csv");
  var outstream = new stream();
  outstream.readable = true;
  outstream.writable = true;

  var rl = readline.createInterface({
    input: instream,
    output: outstream,
    terminal: false,
  });
  try {
    const finalOutput = [];
    for await (const line of rl) {
      if (line.includes("error") || line.includes("warn")) {
        const array = line.split(" - ");
        const parsedObj = JSON.parse(array[array?.length - 1]);
        const unixDate = Math.floor(new Date(array[0]).getTime() / 1000);
        finalOutput.push({
          timeStamp: unixDate,
          logLevel: array[1],
          transactionId: parsedObj?.transactionId,
          details: parsedObj?.details,
        });
      }
    }
    fs.unlink("./utils/dummy.csv", (err) => {
      if (err) {
        console.log(err);
      }
    });
    if (finalOutput?.length) {
      res.status(200).json({
        data: finalOutput,
        message: "Data logs available",
        status: 1,
      });
    } else {
      res.status(200).json({
        message: "No error or warn logs available.",
        status: 0,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong.", status: 0 });
  }
};
