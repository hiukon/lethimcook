const jwt = require('jsonwebtoken');

const ACCESS_SECRET = 'SECRET_KEY';
const REFRESH_SECRET = 'REFRESH_SECRET_KEY';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const refreshToken = req.headers['x-refresh-token'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No access token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
      }

      try {
        const refreshDecoded = jwt.verify(refreshToken, REFRESH_SECRET);
        const newAccessToken = jwt.sign(
          { userId: refreshDecoded.userId },
          ACCESS_SECRET,
          { expiresIn: '15m' }
        );
        const newRefreshToken = jwt.sign(
          { userId: refreshDecoded.userId },
          REFRESH_SECRET,
          { expiresIn: '7d' }
        );

        res.setHeader('x-access-token', newAccessToken);
        res.setHeader('x-refresh-token', newRefreshToken);
        req.userId = refreshDecoded.userId;
        next();
      } catch (refreshErr) {
        return res.status(403).json({ message: 'Refresh token không hợp lệ' });
      }
    } else {
      res.status(401).json({ message: 'Access token không hợp lệ' });
    }
  }
};

module.exports = authMiddleware;
