const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../../../config");

const generate_JWTtoken = async (payload, expiry = 8640000) => {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, JWT_KEY, { expiresIn: expiry },(err, token) => {
			if (err) reject(err);
			else resolve(token);
		});
	});
};

const authMiddleware = async (req, res, next) => {
	// get the token from the header if present
	const token = req.headers["x-access-token"] || req.headers["authorization"];
	// if no token found, return response (without going to the next middelware)
	if (!token) return res.status(401).send({ code: 0, message: "Access denied. No token provided.", data: 'FORBIDDEN' });
	try {
		jwt.verify(token, JWT_KEY, function (err, decoded) {
      if (err) {
        res.status(403).send({ status: "error", message: err.message, data: null });
      } else {
        // add user id to request
        req.body.userId = decoded.id;
        next();
      }
    });
	} catch (e) {
		console.log(e);
		//if invalid token
		res.status(401).send({ code: 0, message: "Invalid user" });
	}
};

module.exports = { generate_JWTtoken, authMiddleware };
