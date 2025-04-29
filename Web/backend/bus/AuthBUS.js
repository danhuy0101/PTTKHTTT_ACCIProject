// /BUS/AuthBUS.js
const AuthDAO = require('../dao/Auth_DAO');

class AuthBUS {
    static async authenticate(username, password) {
        try {
            const users = await AuthDAO.getUserByUsernameAndPassword(username, password);
            
            if (users.length > 0) {
                return {
                    authenticated: true,
                    user: users[0]
                };
            }

            return { authenticated: false };
        } catch (error) {
            console.error('Authentication BUS error:', error);
            throw error;
        }
    }
}

module.exports = AuthBUS;