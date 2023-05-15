const User = require("../models/Students");

const isStudent = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.usertype !== "Student") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = isStudent;
