const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://xyz:xyz@xyz/shop?retryWrites=true')
    .then(client => {
      console.log("success!!");
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
    });
}

const getDB = () => {
  if (_db) return _db;
  throw 'No database found!';
}

// module.exports = mongoConnect;

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;