import { renderHook, act } from '@testing-library/react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { Track } from '../types';

class MockAudio {
  public src = '';
  public preload = '';
  public currentTime = 0;
  public duration = 0;
  public volume = 1;
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  load = vi.fn();
  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn();
}

describe('useAudioPlayer', () => {
  const track: Track = {
    id: '1',
    title: 'Test',
    artist: 'Artist',
    duration: 10,
    url: 'test.mp3',
  };

  beforeAll(() => {
    vi.stubGlobal('Audio', MockAudio);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('loads a track into state', () => {
    const { result } = renderHook(() => useAudioPlayer());
    act(() => {
      result.current.loadTrack(track);
    });
    expect(result.current.playerState.currentTrack).toEqual(track);
    expect(result.current.playerState.isPlaying).toBe(false);
  });

  it('plays and pauses the track', async () => {
    const { result } = renderHook(() => useAudioPlayer());
    act(() => {
      result.current.loadTrack(track);
    });
    await act(() => result.current.play());
    expect(result.current.playerState.isPlaying).toBe(true);
    act(() => {
      result.current.pause();
    });
    expect(result.current.playerState.isPlaying).toBe(false);
  });

  it('plays track at index from queue', async () => {
    const { result } = renderHook(() => useAudioPlayer());
    act(() => {
      result.current.setQueue([track], 0);
    });
    await act(() => result.current.playTrackAtIndex(0));
    expect(result.current.playerState.currentIndex).toBe(0);
    expect(result.current.playerState.currentTrack).toEqual(track);
    expect(result.current.playerState.isPlaying).toBe(true);
  });
});
