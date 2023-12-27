import jwt from 'jsonwebtoken';

export const generateToken = (user: any) => {
    const payload = {
        id: user.id,
        username: user.username
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN_ACCESS_TOKEN });
};
