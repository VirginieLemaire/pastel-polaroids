/**
 * Tests pour la conversion de l'image de couverture en fichier partageable
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { toShareFile } from '@/shared/ui/components/ShareButton';

describe('ShareButton / toShareFile', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should convert a fetched image into a File', async () => {
    const blob = new Blob(['fake-image-bytes'], { type: 'image/jpeg' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ blob: () => Promise.resolve(blob) }));

    const file = await toShareFile('https://example.com/cover.jpg');

    expect(file).toBeInstanceOf(File);
    expect(file?.type).toBe('image/jpeg');
    expect(file?.name).toBe('concours.jpg');
  });

  it('should return null when the fetch rejects (network/CORS failure)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')));

    const file = await toShareFile('https://example.com/cover.jpg');

    expect(file).toBeNull();
  });

  it('should return null when reading the response body fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ blob: () => Promise.reject(new Error('bad body')) })
    );

    const file = await toShareFile('https://example.com/cover.jpg');

    expect(file).toBeNull();
  });
});
