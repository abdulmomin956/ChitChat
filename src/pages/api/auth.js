// pages/api/auth.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect, { UserModel } from '../../../db';

dbConnect();

export default async function handler(req, res) {
    const { action, username, password } = req.body;
    if (req.method === 'POST') {
        if (action === 'register') {
            try {
                const { name, username, password } = req.body;
                const newUser = new UserModel({
                    name,
                    username,
                    password: bcrypt.hashSync(password, 8),
                    role: 'normal'
                })
                await newUser.save()
                res.status(200).json({ success: true });
            } catch (err) {
                res.status(401).json({ message: err.message });
            }
        } else if (action === 'login') {
            try {
                const user = await UserModel.findOne({ username })
                if (!user) {
                    return res.status(404).send({ message: "User not found" });
                }
                const passwordIsValid = bcrypt.compareSync(password, user.password);
                if (!passwordIsValid) {
                    return res.status(400).send({ accessToken: null, message: "Invalid Password!" });
                }
                const token = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
                res.setHeader('Set-Cookie', [`token=${token}; Max-Age= ${24 * 60 * 60}; HttpOnly;secure;path=/;SameSite=strict`]);
                res.status(200).json({ success: true });
            } catch (err) {
                res.status(401).json({ message: err.message });
            }
        } else {
            res.status(400).json({ message: 'Invalid action' });
        }
    } else if (req.method === 'DELETE') {
        res.setHeader('Set-Cookie', 'token=; Max-Age=0; HttpOnly;secure;path=/;');
        res.status(200).json({ success: true });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
