const keythereum = require('keythereum');
var keyth = require('keythereum');
var account = "0xe00e3a3ac31d9b95e0250bb3490ca996d931b349";
var pass = "new8";

var keyObject = keythereum.importFromFile(account, "./block/data/");
var privateKey = keythereum.recover(pass, keyObject);
console.log(privateKey.toString('hex'));