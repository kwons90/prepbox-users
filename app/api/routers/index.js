const apiRouter = require('express').Router();

apiRouter.use('/students', require('./students'));
apiRouter.use('/users', require('./users'));
apiRouter.use('/cart', require('./cart'));

module.exports = apiRouter;