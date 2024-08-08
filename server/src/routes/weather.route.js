const express = require('express');

const { weatherController } = require('../controllers');

const router = express.Router();

router.get('/', weatherController.getWeatherForCity);
router.get('/forecast', weatherController.getForecast);
router.post('/subscribe', weatherController.subscribeWeatherForecast);
router.post('/unsubscribe', weatherController.unsubscribeWeatherForecast);

module.exports = router;
