export const formatFileSize = (sizeInKB: number) => {
  if (sizeInKB >= 1024) {
    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  }
  return `${sizeInKB} KB`;
};
