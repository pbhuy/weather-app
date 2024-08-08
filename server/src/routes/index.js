const express = require('express');

const authRoute = require('../routes/auth.route');
const weatherRoute = require('../routes/weather.route');

const router = express.Router();

const routes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/weather',
    route: weatherRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
