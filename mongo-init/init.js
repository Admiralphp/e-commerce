db = db.getSiblingDB('auth-service');
db.createUser({
  user: 'auth_user',
  pwd: 'auth_password',
  roles: [{ role: 'readWrite', db: 'auth-service' }]
});
db.createCollection('users');

db = db.getSiblingDB('order-service');
db.createUser({
  user: 'order_user',
  pwd: 'order_password',
  roles: [{ role: 'readWrite', db: 'order-service' }]
});
db.createCollection('orders');
db.createCollection('carts');