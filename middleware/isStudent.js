const isStudent = (req, res, next) => {
  if (req.user.usertype !== "Student") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
};

module.exports = isStudent;