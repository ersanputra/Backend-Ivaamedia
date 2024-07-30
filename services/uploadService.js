const { uploadCloudinary } = require('../libs/upload-cloudinary');
const { UploadImage } = require('../models'); // Pastikan Anda mengimpor model UploadImage

class UploadService {
  async uploadFile(file, userId, description) {
    try {
      const result = await uploadCloudinary(file, 'inventory_photos');
      if (!result) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      // Simpan data unggahan ke database
      const uploadImage = await UploadImage.create({
        user_id: userId,
        image_url: result.secure_url,
        description: description
      });

      return result.secure_url;
    } catch (error) {
      console.error('Error in upload service:', error);
      throw error;
    }
  }

  async uploadFilePayments(file, userId, description) {
    try {
      const result = await uploadCloudinary(file, 'payments');
      if (!result) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      // Simpan data unggahan ke database
      const uploadImage = await UploadImage.create({
        user_id: userId,
        image_url: result.secure_url,
        description: description
      });

      return result.secure_url;
    } catch (error) {
      console.error('Error in upload service:', error);
      throw error;
    }
  }

  async uploadFileProfile(file, userId, description) {
    try {
      const result = await uploadCloudinary(file, 'profile');
      if (!result) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      // Simpan data unggahan ke database
      const uploadImage = await UploadImage.create({
        user_id: userId,
        image_url: result.secure_url,
        description: description
      });

      return result.secure_url;
    } catch (error) {
      console.error('Error in upload service:', error);
      throw error;
    }
  }

  async uploadFilePembelian(file, userId, description) {
    try {
      const result = await uploadCloudinary(file, 'pembelian');
      if (!result) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      // Simpan data unggahan ke database
      const uploadImage = await UploadImage.create({
        user_id: userId,
        image_url: result.secure_url,
        description: description
      });

      return result.secure_url;
    } catch (error) {
      console.error('Error in upload service:', error);
      throw error;
    }
  }


}

module.exports = new UploadService();
