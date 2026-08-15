const User = require('../models/User');

const users = [
    {
        "_id": "68e10b08b31d70da18ae803d",
        "name": "user123",
        "email": "user123@gmail.com",
        "createdAt": "Sat Oct 04 2025 16:54:48 GMT+0500 (Pakistan Standard Time)"
    },
    {
        "_id": "68e25a1724dfac4a70d23d1e",
        "name": "abc",
        "email": "abc@gmail.com",
        "createdAt": "Sun Oct 05 2025 16:44:23 GMT+0500 (Pakistan Standard Time)"
    },
    {
        "_id": "68e25c0a24dfac4a70d23d1f",
        "name": "ali",
        "email": "ali123@gmail.com",
        "createdAt": "Sun Oct 05 2025 16:52:42 GMT+0500 (Pakistan Standard Time)"
    },
    {
        "_id": "68e25cb424dfac4a70d23d20",
        "name": "ali abc",
        "email": "ali.abc@gmail.com",
        "createdAt": "Sun Oct 05 2025 16:55:32 GMT+0500 (Pakistan Standard Time)"
    },
    {
        "_id": "69778278d78fb70a49e977c0",
        "name": "adam",
        "email": "adam@gmail.com",
        "createdAt": "Mon Jan 26 2026 20:04:24 GMT+0500 (Pakistan Standard Time)",
        "__v": 0
    }
]

const getUsers = async (req, res) => {
    try {
       // const users = await User.find();
        return res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

module.exports = { getUsers };
