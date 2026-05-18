import imageCompression from 'browser-image-compression';
import { supabase } from './supabase';

/**
 * Compress image before upload
 * @param file - Image file to compress
 * @returns Compressed file
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.5, // Max 500KB
    maxWidthOrHeight: 1024, // Max dimension 1024px
    useWebWorker: true,
    fileType: 'image/jpeg' as const,
  };

  try {
    console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    const compressedFile = await imageCompression(file, options);
    console.log('Compressed file size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}

/**
 * Upload image to Supabase Storage
 * @param file - Image file to upload
 * @param folder - Folder name in storage (default: 'products')
 * @returns Public URL of uploaded image
 */
export async function uploadImageToSupabase(
  file: File,
  folder: string = 'products'
): Promise<string> {
  try {
    // 1. Compress image first
    const compressedFile = await compressImage(file);

    // 2. Generate unique filename
    const fileExt = compressedFile.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // 3. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images') // Bucket name
      .upload(fileName, compressedFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // 4. Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Delete image from Supabase Storage
 * @param imageUrl - Full URL of image to delete
 */
export async function deleteImageFromSupabase(imageUrl: string): Promise<void> {
  try {
    // Extract path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/product-images/');
    if (pathParts.length < 2) return;

    const filePath = pathParts[1];

    // Delete from storage
    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - deletion is not critical
  }
}

/**
 * Validate image file
 * @param file - File to validate
 * @returns true if valid, throws error if invalid
 */
export function validateImageFile(file: File): boolean {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Format file tidak valid. Gunakan JPG, PNG, atau WebP');
  }

  // Check file size (max 5MB before compression)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('Ukuran file terlalu besar. Maksimal 5MB');
  }

  return true;
}
