import { v2 as cloudinary } from "cloudinary";

export class CloudinaryProvider {
  constructor(config) {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
    });

    this.client = cloudinary;
  }

  uploadFile = async (file, path) => {
    const { public_id, secure_url } = await this.client.uploader.upload(
      file.path,
      { folder: path },
    );
    return { public_id, secure_url };
  };

  deleteFile = async (key) => {
    await this.client.uploader.destroy(key);
  };
}
