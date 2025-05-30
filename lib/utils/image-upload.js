/**
 * Uploads an image to Cloudinary via our API endpoint
 * 
 * @param {string} imageData - Base64 encoded image data or image URL
 * @param {string} folder - Cloudinary folder to store the image in
 * @param {string} publicId - Custom public ID for the image
 * @returns {Promise<{success: boolean, url: string, public_id: string}>}
 */
export async function uploadImage(imageData, folder = 'customizations', publicId = null) {
  try {
    // If imageData is already a URL and not a base64 string, return it directly
    if (imageData.startsWith('http')) {
      return {
        success: true,
        url: imageData,
        public_id: null
      };
    }

    // Make API request to upload endpoint
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageData,
        folder,
        public_id: publicId
      }),
    });

    // Parse response
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload image');
    }

    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image'
    };
  }
}

/**
 * Uploads multiple images to Cloudinary
 * 
 * @param {Array<string>} images - Array of base64 encoded image data or image URLs
 * @param {string} folder - Cloudinary folder to store the images in
 * @returns {Promise<Array<{success: boolean, url: string, public_id: string}>>}
 */
export async function uploadMultipleImages(images, folder = 'customizations') {
  try {
    // Upload each image in parallel
    const uploadPromises = images.map(image => 
      uploadImage(image, folder)
    );
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    return images.map(() => ({
      success: false,
      error: error.message || 'Failed to upload images'
    }));
  }
}