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
            success: false
        }).json({
            status: 200,
            message: "Login successful",
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