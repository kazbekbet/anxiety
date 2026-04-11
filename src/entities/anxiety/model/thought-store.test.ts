import { describe, it, expect, beforeEach } from 'vitest';
import { useThoughtRecords } from './thought-store';

const sampleRecord = {
  situation: 'Meeting at work',
  automaticThought: 'I will fail',
  emotion: 'anxiety',
  emotionIntensity: 8,
  cognitiveDistortions: ['catastrophizing' as const],
  alternativeThought: 'I have prepared well',
  newEmotionIntensity: 4,
};

describe('useThoughtRecords (zustand)', () => {
  beforeEach(() => {
    localStorage.clear();
    useThoughtRecords.setState({ records: [] });
  });

  it('starts with empty records', () => {
    expect(useThoughtRecords.getState().records).toEqual([]);
  });

  it('adds a record with generated id and timestamp', () => {
    useThoughtRecords.getState().addRecord(sampleRecord);

    const { records } = useThoughtRecords.getState();
    expect(records).toHaveLength(1);
    expect(records[0].situation).toBe('Meeting at work');
    expect(records[0].emotionIntensity).toBe(8);
    expect(records[0].newEmotionIntensity).toBe(4);
    expect(records[0].id).toBeDefined();
    expect(records[0].timestamp).toBeDefined();
  });

  it('prepends new records (newest first)', () => {
    useThoughtRecords.getState().addRecord({ ...sampleRecord, situation: 'First' });
    useThoughtRecords.getState().addRecord({ ...sampleRecord, situation: 'Second' });

    const { records } = useThoughtRecords.getState();
    expect(records).toHaveLength(2);
    expect(records[0].situation).toBe('Second');
    expect(records[1].situation).toBe('First');
  });

  it('removes a record by id', () => {
    useThoughtRecords.getState().addRecord(sampleRecord);
    const id = useThoughtRecords.getState().records[0].id;

    useThoughtRecords.getState().removeRecord(id);
    expect(useThoughtRecords.getState().records).toHaveLength(0);
  });

  it('removes only the targeted record', () => {
    useThoughtRecords.getState().addRecord({ ...sampleRecord, situation: 'Keep' });
    useThoughtRecords.getState().addRecord({ ...sampleRecord, situation: 'Remove' });

    const toRemove = useThoughtRecords.getState().records.find(
      (r) => r.situation === 'Remove',
    )!;
    useThoughtRecords.getState().removeRecord(toRemove.id);

    const { records } = useThoughtRecords.getState();
    expect(records).toHaveLength(1);
    expect(records[0].situation).toBe('Keep');
  });

  it('persists records to localStorage', () => {
    useThoughtRecords.getState().addRecord(sampleRecord);

    const stored = JSON.parse(localStorage.getItem('thought-records') ?? '{}');
    expect(stored.state.records).toHaveLength(1);
    expect(stored.state.records[0].situation).toBe('Meeting at work');
  });

  it('does nothing when removing a non-existent id', () => {
    useThoughtRecords.getState().addRecord(sampleRecord);
    useThoughtRecords.getState().removeRecord('non-existent-id');
    expect(useThoughtRecords.getState().records).toHaveLength(1);
  });
});
