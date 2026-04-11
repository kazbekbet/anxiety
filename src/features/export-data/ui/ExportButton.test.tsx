import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExportButton } from './ExportButton';
import type { AnxietyEntry, ThoughtRecord } from '@/shared/types';

const sampleEntry: AnxietyEntry = {
  id: '1',
  level: 5,
  note: 'test',
  triggers: ['Work'],
  timestamp: '2024-06-01T12:00:00Z',
};

const sampleRecord: ThoughtRecord = {
  id: '1',
  situation: 'meeting',
  automaticThought: 'I will fail',
  emotion: 'anxiety',
  emotionIntensity: 8,
  cognitiveDistortions: ['catastrophizing'],
  alternativeThought: 'I am prepared',
  newEmotionIntensity: 4,
  timestamp: '2024-06-01T12:00:00Z',
};

describe('ExportButton', () => {
  let createObjectURLMock: ReturnType<typeof vi.fn>;
  let revokeObjectURLMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    createObjectURLMock = vi.fn().mockReturnValue('blob:http://localhost/fake');
    revokeObjectURLMock = vi.fn();
    globalThis.URL.createObjectURL = createObjectURLMock;
    globalThis.URL.revokeObjectURL = revokeObjectURLMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the export button', () => {
    render(<ExportButton entries={[]} records={[]} />);
    expect(screen.getByText('Экспортировать данные')).toBeInTheDocument();
  });

  it('creates a Blob with JSON content when clicked', async () => {
    const user = userEvent.setup();
    const BlobSpy = vi.spyOn(globalThis, 'Blob');

    render(<ExportButton entries={[sampleEntry]} records={[sampleRecord]} />);
    await user.click(screen.getByText('Экспортировать данные'));

    expect(BlobSpy).toHaveBeenCalledOnce();
    const blobArgs = BlobSpy.mock.calls[0];
    const jsonContent = blobArgs[0]![0] as string;
    const parsed = JSON.parse(jsonContent);
    expect(parsed.entries).toHaveLength(1);
    expect(parsed.entries[0].id).toBe('1');
    expect(parsed.thoughtRecords).toHaveLength(1);
    expect(parsed.thoughtRecords[0].situation).toBe('meeting');
    expect(blobArgs[1]).toEqual({ type: 'application/json' });

    BlobSpy.mockRestore();
  });

  it('calls createObjectURL and revokeObjectURL', async () => {
    const user = userEvent.setup();

    render(<ExportButton entries={[sampleEntry]} records={[]} />);
    await user.click(screen.getByText('Экспортировать данные'));

    expect(createObjectURLMock).toHaveBeenCalledOnce();
    expect(revokeObjectURLMock).toHaveBeenCalledOnce();
  });

  it('creates an anchor element and triggers click for download', async () => {
    const user = userEvent.setup();
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    render(<ExportButton entries={[]} records={[]} />);
    await user.click(screen.getByText('Экспортировать данные'));

    // Find the anchor element that was appended (filter out React's render elements)
    const anchorCalls = appendChildSpy.mock.calls.filter(
      ([node]) => node instanceof HTMLAnchorElement,
    );
    expect(anchorCalls.length).toBeGreaterThanOrEqual(1);

    const anchor = anchorCalls[0][0] as HTMLAnchorElement;
    expect(anchor.href).toContain('blob:');
    expect(anchor.download).toMatch(/^anxiety-data-\d{4}-\d{2}-\d{2}\.json$/);

    // Check it was removed after click
    const removeAnchorCalls = removeChildSpy.mock.calls.filter(
      ([node]) => node instanceof HTMLAnchorElement,
    );
    expect(removeAnchorCalls.length).toBeGreaterThanOrEqual(1);

    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it('exports empty data when no entries and records', async () => {
    const user = userEvent.setup();
    const BlobSpy = vi.spyOn(globalThis, 'Blob');

    render(<ExportButton entries={[]} records={[]} />);
    await user.click(screen.getByText('Экспортировать данные'));

    const jsonContent = BlobSpy.mock.calls[0]![0]![0] as string;
    const parsed = JSON.parse(jsonContent);
    expect(parsed.entries).toEqual([]);
    expect(parsed.thoughtRecords).toEqual([]);

    BlobSpy.mockRestore();
  });
});
