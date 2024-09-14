const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class Product {
  constructor(title, description, price, imageUrl, _id, userId) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
    this._id = _id ? new mongodb.ObjectId(_id) : null;
    this.userId = userId
  }

  save() {
    const db = getDB();
    let dBOp;
    if (this._id) {
      console.log("Updating");
      dBOp = db.collection('products').updateOne(
        { _id: this._id },
        { $set: this }
      );
    }
    else {
      dBOp = db.collection('products').insertOne(this);
    }

    return dBOp.then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    })
  }

  static fetchAll() {
    const db = getDB();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDB();
    return db
      .collection('products')
      .findOne({ _id: new mongodb.ObjectId(prodId) })
      .then(prod => {
        console.log(prod);
        return prod;
      })
      .catch(err => console.log(err));
  }

  static deleteById(prodId) {
    const db = getDB();
    return db.collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then(res => {
        return res;
      })
      .catch(err => {
        console.log(err);
        throw err;
      })
  }

}

module.exports = Product;
