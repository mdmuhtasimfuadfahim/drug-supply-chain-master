const keythereum = require('keythereum');
var keyth = require('keythereum');
var accout = "0x372570fbdc1ea9c9d1c4513677218dc53b6acb19";
var pass = "new1";

var keyObject = keythereum.importFromFile(accout, "./block/data/");
var privateKey = keythereum.recover(pass, keyObject);
console.log(privateKey.toString('hex'));