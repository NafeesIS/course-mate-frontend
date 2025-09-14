  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function generateImageUrl(thumbnail: any ): string | null {
    const regex =
      /(?:https?:\/\/)?(?:drive\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)(?:\/view)?/;
    const match = thumbnail.match(regex);

    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }

    return null; // Return null if the URL is not a valid Google Drive link
  }