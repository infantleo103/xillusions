import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dubljh50p',
  api_key: '338813614431177',
  api_secret: 'sYs6rYDxV8A7OtfhXo549rXx7ms',
  secure: true
});

/**
 * API endpoint to upload images to Cloudinary
 * 
 * Accepts:
 * - image: Base64 encoded image data
 * - folder: (optional) Cloudinary folder to store the image in
 * - public_id: (optional) Custom public ID for the image
 * 
 * Returns:
 * - success: Boolean indicating if the upload was successful
 * - url: URL of the uploaded image
 * - public_id: Public ID of the uploaded image
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.image) {
      return NextResponse.json(
        { success: false, error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Extract image data
    const { image, folder = 'customizations', public_id = null } = body;
    
    // Upload options
    const uploadOptions = {
      folder,
      resource_type: 'image',
    };
    
    // Add public_id if provided
    if (public_id) {
      uploadOptions.public_id = public_id;
    }

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(image, uploadOptions, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    // Return success response with image URL
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}