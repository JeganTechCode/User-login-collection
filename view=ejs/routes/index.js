var express = require('express');
var router = express.Router();
var controller = require('../Controller/userController');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/newUserRegister', controller.newUserRegister);
router.post('/api/personalDetails', controller.personalDetails);
router.get('/api/user/:userId', controller.specificUserDetails);
router.put('/api/user/:userId', controller.userUpdateProfile);
router.delete('/api/user/:userId', controller.deleteUserDetails);
router.post('/api/loginAccess', controller.loginAccess);
router.get('/api/getAllUserDetails', controller.getAllUserDetails);
module.exports = router;
