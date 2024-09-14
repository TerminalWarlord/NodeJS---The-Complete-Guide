const mongodb = require('mongodb');

const getDB = require('../util/database').getDB;

class User {
  constructor(name, email, cart, _id) {
    this.name = name;
    this.email = email;
    this.cart = cart?.items?.length ? cart : { items: [] };
    this._id = _id;
  }

  save() {
    const db = getDB();
    return db.collection('users').insertOne(this);

  }

  addOrder() {
    const db = getDB();
    return this.getCart().then(products => {
      const order = {
        items: products,
        user: {
          _id: new mongodb.ObjectId(this._id),
          name: this.name
        }
      }
      return db.collection('orders').insertOne(order);
    })
      .then(res => {
        this.cart = { items: [] };
        return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: { items: [] } } });
      })
  }

  getOrders() {
    const db = getDB();
    return db.collection('orders').find({ 'user._id': new mongodb.ObjectId(this._id) }).toArray().then(res => {
      console.log(res);
      return res;
    })
  }

  addToCart(product) {
    const getProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    })
    const updatedCartItems = [...this.cart.items];
    if (getProductIndex === -1) {
      updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: 1 });
    }
    else {
      updatedCartItems[getProductIndex].quantity += 1;
    }
    this.cart = {
      items: updatedCartItems
    };
    const db = getDB();
    return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: this.cart } })
  }


  getCart() {
    const db = getDB();
    const productIds = this.cart.items.map(product => {
      return product.productId;
    })
    return db.collection('products').find({ _id: { $in: productIds } }).toArray()
      .then(product => {
        return product.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(prod => {
              return p._id.toString() === prod.productId.toString();
            }).quantity
          }
        })
      })

  }

  deleteItemFromCart(prodId) {
    console.log(prodId);
    const db = getDB();
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== prodId.toString();
    });
    const updatedCart = {
      items: updatedCartItems
    }
    return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } });
  }

  static findById(userId) {
    const db = getDB();
    return db.collection('users')
      .findOne({ _id: new mongodb.ObjectId(userId) })
  }
}



module.exports = User;
