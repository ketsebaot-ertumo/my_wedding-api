// backend/utils/sendTokenResponse.js

const { generateAccessToken } = require("./generateToken");

module.exports = async function sendTokenResponse(user, statusCode, res) {
     try {
        const token = await generateAccessToken(user);
        const cookieOptions = {
            httpOnly: true,
            // secure: true, // Only in HTTPS
            // sameSite: 'None', 
            secure: false,
            sameSite: 'strict',
            maxAge: 6 * 60 * 60 * 1000, // 6 hours
        };
        return res.status(statusCode)
            .cookie('token', token, cookieOptions)
            .json({
                success: true,
                // data: {}
                token,
                user: {
                  id: user.id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  phoneNumber: user.phoneNumber,
                  role: user.role,
                  isConfirmed: user.isConfirmed,
                },
            });
    } catch (error) {
      console.error('Error generating token:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
