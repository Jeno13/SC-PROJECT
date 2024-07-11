const getCategories = async () => {
  return await Category.find();
};

const getUserProjects = async (userId) => {
  return await Project.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId.createFromHexString(userId),
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $lookup: {
        from: "requests",
        localField: "_id",
        foreignField: "project",
        as: "requests",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
};

const handleFileUpload = (file) => {
  if (file) {
    file.mv("./public/uploads/" + file.name);
    return file.name;
  }
  return "";
};

const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  getCategories,
  getUserProjects,
  handleFileUpload,
  deleteFile,
};
