const { UserModel } = require("../Config/Models/index");
const { hashedPassword, comparePassword } = require("../Utils/Bcrypt");
const { createToken } = require("../Utils/Jwt");

module.exports.registerUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        const existingEmail = await UserModel.findOne({ email });
        if (existingEmail) {
            return res.json({
                status: 400,
                message: "Email already exists"
            });
        }

        const hash = await hashedPassword(password);
        let newUser;

        newUser = await UserModel.create({
            fullname,
            email,
            password: hash,
        });
        res.json({
            status: 200,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error(error);
        res.json({ status: 500, message: "Internal server error" });
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Additional validation
        if (!email || !password) {
            console.log('Login failed: Missing email or password');
            return res.json({ status: 400, message: "Email and password are required" });
        }

        // Find user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.json({ status: 401, message: "Invalid email or password" });
        }

        // Check if password is correct
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            console.log('Login failed: Invalid password');
            return res.json({ status: 401, message: "Invalid email or password" });
        }

        const token = await createToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true
        }).json({
            status: 200,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ status: 500, message: "Internal server error" });
    }
};


module.exports.logoutUser = async (req, res) => {
    try {
        res.clearCookie('token')
            .json({ status: 200, message: "Logout successful" });
    } catch (error) {
        console.error(error);
        res.json({ status: 500, message: "Internal server error" });
    }
};

module.exports.verifiedUser = async (req, res) => {
    try {
        const user = req.user;
        const token = req.token;

        console.log('User:', user);

        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        res.status(200).json({
            status: 200,
            message: "User verified successfully",
            user: {
                email: user.email,
                id: user.id,
                role: user.role,
            },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
}

module.exports.getUsers = async (_, res) => {

    try {
        const users = await UserModel.find({}).select('-password');
        if (!users) { return res.status(401).json({ status: 401, message: "Unauthorized: No token provided" }); }
        res.status(200).json({
            status: 200,
            message: "Users fetched successfully",
            data: users
        });
    } catch (error) {
        console.error(error);
        res.json({ status: 500, message: "Internal server error" });
    }
}


module.exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, email, role } = req.body;
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        if (password) {
            const hash = await hashedPassword(password);
            user.password = hash;
        }
        const updatedUser = await UserModel.findByIdAndUpdate(id, {
            fullname,
            email,
            role
        }, { new: true });
        res.status(200).json({
            status: 200,
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.json({ status: 500, message: "Internal server error" });
    }
};

module.exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }
        res.status(200).json({
            status: 200,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.json({ status: 500, message: "Internal server error" });
    }
};