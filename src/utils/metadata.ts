export interface AudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
}

/**
 * Extract basic ID3v1 metadata from an audio file.
 * Returns empty fields if no metadata is found or an error occurs.
 */
export const extractMetadata = (file: File): Promise<AudioMetadata> => {
  return new Promise(resolve => {
    const slice = file.slice(Math.max(0, file.size - 128), file.size);
    const reader = new FileReader();

    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const data = new Uint8Array(buffer);
      if (data.length >= 128) {
        const decoder = new TextDecoder('iso-8859-1');
        if (
          decoder
            .decode(data.subarray(0, 3))
            .replace(/\0+$/, '')
            .toUpperCase() === 'TAG'
        ) {
          const title = decoder
            .decode(data.subarray(3, 33))
            .replace(/\0+$/, '')
            .trim();
          const artist = decoder
            .decode(data.subarray(33, 63))
            .replace(/\0+$/, '')
            .trim();
          const album = decoder
            .decode(data.subarray(63, 93))
            .replace(/\0+$/, '')
            .trim();
          resolve({ title, artist, album });
          return;
        }
      }
      resolve({});
    };

    reader.onerror = () => resolve({});
    reader.readAsArrayBuffer(slice);
  });
};
