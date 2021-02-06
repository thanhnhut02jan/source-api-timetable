
const apiRoute = require('./api.route')

var initRoutes = (app) => {
    app.use('/api', apiRoute);
}

module.exports = initRoutes;