class Order {
  constructor({ id, customerName, productType, flavor, occasion, status }) {
    this.id = id;
    this.customerName = customerName;
    this.productType = productType;
    this.flavor = flavor;
    this.occasion = occasion;
    this.status = status || 'pending';
  }
}

module.exports = Order;
