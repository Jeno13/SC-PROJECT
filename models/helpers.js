const getCategories = async () => {
    return await Category.find();
  };
  
  const handleFileUpload = (file) => {
    if (file) {
      file.mv('./public/uploads/' + file.name);
      return file.name;
    }
    return '';
  };
  
  const deleteFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  };
  
  module.exports = {
    getCategories,
    handleFileUpload,
    deleteFile,
  };
  