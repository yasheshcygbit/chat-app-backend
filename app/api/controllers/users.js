const User = require('../models/users');
const bcrypt = require('bcrypt');
const { generate_JWTtoken } = require('../middlewares/authentication');
module.exports = {
  create: async (req, res, next) => {
    try {
      console.log('[ERROR req.body]', req.body);
      const result = await User.create({ name: req.body.name, email: req.body.email, password: req.body.password });
      if (result) {
        res.status(200).send({ status: "success", message: "User added successfully!!!", data: null });
      } else {
        throw 'ERROR';
      }
    } catch (error) {
      console.log('[ERROR error]', error);
      res.status(403).send({ status: "failed", message: "Failed Create User", data: null });
    }
  },
  authenticate: async (req, res, next) => {
    try {
      const userInfo = await User.findOne({ email: req.body.email });
      if (userInfo) {
        if (bcrypt.compareSync(req.body.password, userInfo.password)) {
          const token = await generate_JWTtoken({ id: userInfo._id }, (60*60*24*365));
          // const token = jwt.sign({ id: userInfo._id }, JWT_KEY, { expiresIn: '1h' });
          res.status(200).send({ status: "success", message: "user found!!!", data: { user: userInfo, token: token } });
        } else {
          res.status(200).send({ status: "error", message: "Invalid email/password!!!", data: null });
        }
      } else {
        throw 'NO_USER'
      }
    } catch (error) {
      res.status(403).send({ status: "failed", message: "Failed Auth", data: null });
    }
  },
  joinRoom: async (req, res, next) => {
    
  }
}