import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initializes with value from localStorage', () => {
    window.localStorage.setItem('foo', JSON.stringify('bar'));
    const { result } = renderHook(() => useLocalStorage('foo', 'baz'));
    expect(result.current[0]).toBe('bar');
  });

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'start'));
    act(() => {
      const [, setValue] = result.current;
      setValue('updated');
    });
    expect(window.localStorage.getItem('key')).toBe(JSON.stringify('updated'));
    expect(result.current[0]).toBe('updated');
  });
});
