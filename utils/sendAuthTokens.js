const { generateAccessToken, generateRefreshToken } = require("./generateToken");

exports.sendAuthTokens = async (user, statusCode, res) => {
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const isProduction = process.env.NODE_ENV === 'production';

    const accessTokenCookieOptions = {
      httpOnly: true,
      secure: isProduction,           // Only send cookie over HTTPS in production
      sameSite: isProduction ? 'None' : 'Lax', // 'None' if cross-site, else 'Lax'
      maxAge: 15 * 60 * 1000,        // 15 minutes, match accessToken expiry
    };

    const refreshTokenCookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days, match refreshToken expiry
    };

    // Set tokens as HttpOnly cookies
    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    // Also send tokens and user info in response body (optional)
    return res.status(statusCode).json({
      success: true,
      data: {
        id: user.id,
        role_id: user.role_id,
        email: user.email,
        roles: user.roles,
        accessToken,
        refreshToken,
      }
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
