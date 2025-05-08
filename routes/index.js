const Controller = require('../controllers/controller');
const router = require('express').Router();

router.get('/', Controller.home);
router.get('/posts', Controller.posts);
router.get('/posts/add', Controller.getAddPost);
router.post('/posts/add', Controller.postAddPost);
router.get('/posts/:id', Controller.postById);
router.get('/register', Controller.getRegister);
router.post('/register', Controller.postRegister);
router.get('/login', Controller.getLogin);
router.post('/login', Controller.postLogin);
router.get('/logout', Controller.logout);

module.exports = router;