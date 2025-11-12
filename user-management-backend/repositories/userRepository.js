const User = require('../models/UserModel');

class UserRepository {

    /**
     * Creates a new user in the database.
     * @param {object} userData - Data for the new user.
     * @returns {Promise<User>} The created user document.
     */
    async createUser(userData) {
        try {
            const newUser = await User.create(userData);
            return newUser;
        } catch (error) {
            // Propagate error up to Service layer for handling (e.g., unique constraints)
            throw error;
        }
    }

    /**
     * Finds a user by email, optionally including the password hash.
     * Used primarily for login.
     * @param {string} email - The user's email address.
     * @param {boolean} [withPassword=false] - If true, selects the password hash.
     * @returns {Promise<User|null>} The user document or null if not found.
     */
    async findUserByEmail(email, withPassword = false) {
        try {
            // The select('+password') overrides the 'select: false' default in the model 
            // only when we specifically need the hash for comparison during login.
            let query = User.findOne({ email });

            if (withPassword) {
                query = query.select('+password');
            }

            const user = await query.exec();
            return user;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Finds a user by ID, ensuring the password hash is excluded.
     * Used primarily by the authentication middleware to get user profile details.
     * @param {string} id - The user's MongoDB ID.
     * @returns {Promise<User|null>} The user document (without hash) or null if not found.
     */
    async findUserById(id) {
        try {
            // The default Mongoose behavior (excluding the password) works perfectly here.
            // Since the password field has 'select: false' in the model, it won't be returned.
            const user = await User.findById(id).exec();
            return user;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id, updateData) {
        // Find the user and update the fields provided in updateData.
        // { new: true } returns the updated document.
        // .select('-password') ensures the hash is not returned.
        return await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
    };

    async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }
}

// Export a single instance of the repository
module.exports = new UserRepository();
