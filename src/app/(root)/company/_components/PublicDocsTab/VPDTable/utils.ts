/**
 * Formats a file size in KB to a human-readable string with appropriate unit (KB, MB, or GB)
 * @param sizeKB - File size in kilobytes
 * @returns Formatted string with appropriate unit (e.g., "1.5 MB")
 */
export const formatFileSize = (sizeKB: number) => {
  if (sizeKB >= 1024 * 1024) {
    // Convert to GB
    return `${(sizeKB / (1024 * 1024)).toFixed(2)} GB`;
  } else if (sizeKB >= 1024) {
    // Convert to MB
    return `${(sizeKB / 1024).toFixed(2)} MB`;
  } else {
    // Keep as KB
    return `${sizeKB} KB`;
  }
};

/**
 * Formats a file name with optional components like form ID, filing date, and extension
 * If no filename is provided, it uses document category and filing date as the name
 * @param fileName - Original file name
 * @param formId - Optional form identifier
 * @param filingDate - Optional filing date
 * @param downloadUrl - Optional URL to determine file extension
 * @param fileType - Optional file type
 * @param documentCategory - Document category (used when filename is not provided)
 * @returns Formatted file name string
 */
export const formatFileName = (
  fileName: string,
  formId?: string,
  filingDate?: string,
  downloadUrl?: string,
  fileType?: string,
  documentCategory?: string
): string => {
  // Get file type using the utility function
  const extension = getFileType(downloadUrl, fileType, fileName);

  // If no filename provided, use document category and filing date
  if (!fileName)
    return (
      `${documentCategory}_${filingDate}` + (extension ? '.' + extension : '')
    );

  // Get base name without extension
  const baseName = fileName.includes('.')
    ? fileName.slice(0, fileName.lastIndexOf('.'))
    : fileName;

  // Build parts array for better performance than string concatenation
  const parts: string[] = [];

  // Add formId if it exists and not in baseName
  // Check if formId is included in baseName (case insensitive)
  const shouldAddFormId =
    formId && !baseName.toLowerCase().includes(formId.toLowerCase());
  if (shouldAddFormId) {
    parts.push(formId);
  }

  // Add baseName
  parts.push(baseName);

  // Add filingDate if it exists
  if (filingDate) {
    parts.push(filingDate);
  }

  // Join parts with underscore and add extension if exists
  return parts.join('_') + (extension ? '.' + extension : '');
};

/**
 * Determines the file type/extension from various sources
 * @param downloadUrl - URL that might contain file extension
 * @param fileType - Explicitly provided file type
 * @param fileName - File name that might contain extension
 * @returns File extension in lowercase, or empty string if not found
 */
export const getFileType = (
  downloadUrl?: string,
  fileType?: string,
  fileName?: string
): string => {
  // First try to get extension from downloadUrl
  if (downloadUrl) {
    const extension = downloadUrl.split('.').pop()?.toLowerCase();
    if (extension) return extension;
  }

  // Then try fileType
  if (fileType) {
    return fileType.toLowerCase();
  }

  // Finally try to get extension from fileName
  if (fileName) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension) return extension;
  }

  // Return empty string if no type can be determined
  return '';
};

/**
 * Encrypts a URL using XOR encryption with a secret key and converts it to URL-safe base64
 * This is used for secure document viewing by encoding the document URL
 * @param url - The URL to be encrypted
 * @returns URL-safe base64 encoded encrypted string, or empty string if encryption fails
 */
export function encodeWithKey(url: string) {
  const secretKey = process.env.NEXT_PUBLIC_DOC_VIEWER_SECRET_KEY;
  if (!url || !secretKey) {
    return '';
  }

  // Convert URL and secret key to byte arrays
  const urlBytes = new TextEncoder().encode(url);
  const keyChars = new TextEncoder().encode(secretKey);

  // Generate keyBytes by repeating the secret key to match URL length
  const keyBytes: number[] = [];
  for (let i = 0; i < urlBytes.length; i++) {
    keyBytes.push(keyChars[i % keyChars.length]);
  }

  // Perform XOR operation between URL bytes and key bytes
  const xorResult = new Uint8Array(urlBytes.length);
  for (let i = 0; i < urlBytes.length; i++) {
    xorResult[i] = urlBytes[i] ^ keyBytes[i];
  }

  // Convert encrypted bytes to base64 and make it URL-safe
  const base64 = btoa(String.fromCharCode(...xorResult));
  const urlSafeBase64 = base64
    .replace(/\+/g, '-') // Replace + with -
    .replace(/\//g, '_') // Replace / with _
    .replace(/=/g, '.'); // Replace = with .

  return urlSafeBase64;
}
