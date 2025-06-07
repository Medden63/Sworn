import { extractMetadata } from '../utils/metadata';

describe('extractMetadata', () => {
  const createId3v1File = (
    title: string,
    artist: string,
    album: string
  ): File => {
    const tag = new Uint8Array(128);
    tag.set([0x54, 0x41, 0x47], 0); // "TAG"
    const fill = (text: string, start: number) => {
      for (let i = 0; i < 30; i++) {
        tag[start + i] = i < text.length ? text.charCodeAt(i) : 0;
      }
    };
    fill(title, 3);
    fill(artist, 33);
    fill(album, 63);
    // prepend some dummy audio data
    const dummy = new Uint8Array([1, 2, 3, 4]);
    return new File([dummy, tag], 'track.mp3');
  };

  it('reads ID3v1 metadata', async () => {
    const file = createId3v1File('Title', 'Artist', 'Album');
    const meta = await extractMetadata(file);
    expect(meta).toEqual({ title: 'Title', artist: 'Artist', album: 'Album' });
  });

  it('returns empty object when no metadata', async () => {
    const file = new File([new Uint8Array([1, 2, 3])], 'empty.mp3');
    const meta = await extractMetadata(file);
    expect(meta).toEqual({});
  });
});
