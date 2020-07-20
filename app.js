const express = require("express");
const chalk = require("chalk");
const socketIO = require("socket.io");
var dsbien = require("./config/nodeID.json");
var notification = require("./api/notifications/notification");
var value_valve = [];
var mang_update = [];
var mang_csdl = [];
for (let i = 0; i < dsbien.length; i++) {
  value_valve.push(dsbien[i].socketon);
}
for (let i = 0; i < dsbien.length; i++) {
  mang_update.push(dsbien[i].chanel);
}
for (let i = 1; i <= 53; i++) {
  mang_csdl.push(i);
}
// SET UP SERVER
var app = express();
var port = process.env.PORT || 3700;
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var expressSession = require("express-session");
var configDB = require("./config/database.js");
var fs = require("fs");
var crypto_utils = require("node-opcua-crypto");
const {
  OPCUAClient,
  resolveNodeId,
  AttributeIds,
  ClientMonitoredItemGroup,
  TimestampsToReturn,
} = require("node-opcua-client");
mongoose.connect(configDB.url);
require("./api/config/passport")(passport);
const opcua = require("node-opcua");
const endpointUrl = "opc.tcp://vietscada.com:53530";
// set up database for history //////////////////////////////////////////////
var mongoClient = require("mongodb").MongoClient;
var URL =
  "mongodb+srv://DanhHuynh:danhhuynhquang@lvtn-zmehu.mongodb.net/test?retryWrites=true&w=majority";
// set up our express application
const io = socketIO.listen(app.listen(port));
app.use("/assets", express.static(__dirname + "/public"));
app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // set up ejs for templating
// required for passport
app.use(
  expressSession({
    secret: "xxxxxxxxxxxxx",
    resave: false,
    saveUninitialized: true,
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
require("./routes/routes.js")(app, passport, URL);
const userIdentity = { userName: "user", password: "user" };
(async () => {
  try {
    const client = opcua.OPCUAClient.create({
      applicationName: "HCMUT_OPCUA_Client",
      securityMode: opcua.MessageSecurityMode.SignAndEncrypt,
      securityPolicy: opcua.SecurityPolicy.Basic256,
      certificateFile: "./security_client/certificate.pem",
      privateKeyFile: "./security_client/private_key.pem",
      serverCertificate: crypto_utils.readCertificate(
        "./certificate_server/servercertificate.pem"
      ),
      endpoint_must_exist: false
    });
    client.on("backoff", (retry, delay) => {
      io.sockets.emit("disconnect_1");
      console.log("Retrying to connect to ", endpointUrl, " attempt ", retry);
    });
    console.log("Connecting to ", chalk.cyan(endpointUrl));
    await client.connect(endpointUrl);
    console.log("Connected to ", chalk.cyan(endpointUrl));
    //Create SESSION.....................
    const session = await client.createSession();
    console.log("Session created");
    //Create SUBSCRIPTION
    const subscription = await session.createSubscription2({
      requestedPublishingInterval: 100,
      requestedMaxKeepAliveCount: 20,
      requestedLifetimeCount: 6000,
      maxNotificationsPerPublish: 1000,
      publishingEnabled: true,
      priority: 10,
    });
    subscription
      .on("keepalive", function () {
        console.log("keepalive");
      })
      .on("terminated", function () {
        console.log("TERMINATED");
      });
    var mang_control_manual = new Array(25);
    for (let i = 0; i < dsbien.length; i++) {
      let nodeId = dsbien[i].name;
      let itemToMonitor = {
        nodeId: nodeId,
        attributeId: opcua.AttributeIds.Value,
      };
      let parameters = {
        samplingInterval: 10,
        discardOldest: true,
        queueSize: 1,
      };
      let monitoredItem = await subscription.monitor(
        itemToMonitor,
        parameters,
        opcua.TimestampsToReturn.Both
      );
      monitoredItem.on("changed", (dataValue) => {
        if (50 <= i && i <= 74) {
          if (dataValue.value.value.toString() == "true") {
            let thoigian = new Date();
            let thoigian1 =
              thoigian.toLocaleDateString() +
              " " +
              thoigian.getHours() +
              ":" +
              thoigian.getMinutes() +
              ":" +
              thoigian.getSeconds();
            notification(dsbien[i].socketon, thoigian1);
          }
        }
        if (0 <= i && i <= 24) {
          mang_control_manual[i] = dataValue.value.value.toString();
        }
        let today = new Date();
        today1 =
          today.toLocaleDateString() +
          " " +
          today.getHours() +
          ":" +
          today.getMinutes() +
          ":" +
          today.getSeconds();

        if (25 <= i && i <= 77) {
          mongoClient.connect(URL, function (err, db) {
            let myobj = {
              time:
                today.toLocaleDateString() +
                " " +
                today.getHours() +
                ":" +
                today.getMinutes() +
                ":" +
                today.getSeconds(),
              value: dataValue.value.value.toString(),
            };
            let dbo = db.db("variable");
            dbo
              .collection(dsbien[i].socketon)
              .insertOne(myobj, function (err, res) {
                if (err) throw err;
                db.close();
              });
          });
        }
        if (
          dataValue.value.value.toString() == "true" ||
          dataValue.value.value.toString() == "false"
        ) {
          io.sockets.emit(dsbien[i].chanel.toString(), [
            dataValue.value.value.toString(),
            today1,
          ]);
          if (0 <= i && i <= 24) {
            mang_control_manual[i] = dataValue.value.value.toString();
          }
        } else {
          io.sockets.emit(
            dsbien[i].chanel.toString(),
            dataValue.value.value.toFixed(2)
          );
        }
      });
    }
    // SOCKET.IO LISTEN REFRESH FROM HTML AND THEN READ VALUE FROM OPCUA SERVER
    io.sockets.on("connection", (socket) => {
      socket.on("reset_control", () => {
        mang_control_manual.map((item, index) => {
          if (item.toString() == "true") {
            const nodesToWrite = {
              nodeId: dsbien[index].name,
              attributeId: opcua.AttributeIds.Value,
              value: {
                statusCode: opcua.StatusCodes.Good,
                value: {
                  dataType: opcua.DataType.Boolean,
                  value: false,
                },
              },
            };
            session.write(nodesToWrite, function (
              err,
              statusCode,
              diagnosticInfo
            ) {
              if (!err) {
              }
            });
          }
        });
      });
      for (let i = 0; i <= mang_csdl.length; i++) {
        socket_csdl(mang_csdl[i]);
      }
      function socket_csdl(item) {
        let emit = "emit" + item;
        socket.on(item, (data) => {
          console.log(data);
          mongoClient.connect(URL, function (err, db) {
            if (err) throw err;
            let dbo = db.db("variable");
            dbo
              .collection(data)
              .find()
              .toArray(function (err, result) {
                socket.emit(emit, result);
                if (err) throw err;
                db.close();
              });
          });
        });
      }
      function socket_on(param) {
        socket.on(param, function (data) {
          if (
            (data.value.toString() == "true" ||
              data.value.toString() == "false") &&
            data !== null
          ) {
            const nodesToWrite = {
              nodeId: data.nodeid.toString(),
              attributeId: opcua.AttributeIds.Value,
              value: {
                statusCode: opcua.StatusCodes.Good,
                value: {
                  dataType: opcua.DataType.Boolean,
                  value: data.value,
                },
              },
            };
            session.write(nodesToWrite, function (
              err,
              statusCode,
              diagnosticInfo
            ) {
              if (!err) {
                // console.log(" write ok" );
                // console.log(diagnosticInfo);
                // console.log(statusCode);
              }
            });
          } else {
            const nodesToWrite = {
              nodeId: data.nodeid.toString(),
              attributeId: opcua.AttributeIds.Value,
              value: {
                statusCode: opcua.StatusCodes.Good,
                value: {
                  dataType: opcua.DataType.Double,
                  value: data.value,
                },
              },
            };
            session.write(nodesToWrite, function (
              err,
              statusCode,
              diagnosticInfo
            ) {
              if (!err) {
                // console.log(" write ok" );
                // console.log(diagnosticInfo);
                // console.log(statusCode);
              }
            });
          }
        });
      }
      for (var i = 0; i < value_valve.length; i++) {
        socket_on(value_valve[i]);
      }
    });
    io.sockets.on("connection", (socket) => {
      // console.log(mang_monitor)
      ket_qua = doc_all_bien();
      ket_qua.then(function (data) {
        console.log(data)
        // // io.sockets.emit('value',mang_monitor)
        socket.emit("value", data);
      });
    });
    var mangsolieu = new Array();
    function doc_1_bien(node, i) {
      let nodeIdToMonitor = node;
      let maxAge = 0;
      let nodeToRead = {
        nodeId: nodeIdToMonitor,
        attributeId: opcua.AttributeIds.Value,
      };
      return new Promise(function (res) {
        session.read(nodeToRead, maxAge, function (err, dataValue) {
          if (dataValue !== undefined) {
            mangsolieu[i] = dataValue.value.value;
          }
          return res();
        });
      });
    }
    async function doc_all_bien() {
      for (i = 0; i < dsbien.length; i++) {
        await doc_1_bien(dsbien[i].name, i);
      }
      return mangsolieu;
    }
    // detect CTRL+C and close
    let running = true;
    process.on("SIGINT", async () => {
      if (!running) {
        return; // avoid calling shutdown twice
      }
      console.log("Shutting down client");
      running = false;
      await subscription.terminate();
      await session.close();
      await client.disconnect();
      console.log("Done");
      process.exit(0);
    });
  } catch (err) {
    console.log(chalk.bgRed.white("Error" + err.message));
    console.log(err);
    process.exit(-1);
  }
})();
