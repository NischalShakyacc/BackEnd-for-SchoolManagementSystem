const UserAdmin = require("../models/Admins")

const isAdmin = async (req, res, next) => {
    try {
        const user = await UserAdmin.findById(req.user.id);
        if (!user || user.usertype !== "Admin") {
        return res.status(403).json({ message: "Unauthorized" });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = isAdmin;