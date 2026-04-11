import { describe, it, expect, beforeEach } from 'vitest';
import { useWorryTime } from './store';

describe('useWorryTime (zustand)', () => {
  beforeEach(() => {
    localStorage.clear();
    useWorryTime.setState({ sessions: [] });
  });

  it('starts with empty sessions', () => {
    expect(useWorryTime.getState().sessions).toEqual([]);
  });

  it('adds a session with generated id and timestamp', () => {
    useWorryTime.getState().addSession({ duration: 300, text: 'My worries' });

    const { sessions } = useWorryTime.getState();
    expect(sessions).toHaveLength(1);
    expect(sessions[0].duration).toBe(300);
    expect(sessions[0].text).toBe('My worries');
    expect(sessions[0].id).toBeDefined();
    expect(sessions[0].timestamp).toBeDefined();
  });

  it('prepends new sessions (newest first)', () => {
    useWorryTime.getState().addSession({ duration: 100, text: 'First' });
    useWorryTime.getState().addSession({ duration: 200, text: 'Second' });

    const { sessions } = useWorryTime.getState();
    expect(sessions).toHaveLength(2);
    expect(sessions[0].text).toBe('Second');
    expect(sessions[1].text).toBe('First');
  });

  it('generates unique ids for each session', () => {
    useWorryTime.getState().addSession({ duration: 60, text: 'A' });
    useWorryTime.getState().addSession({ duration: 120, text: 'B' });

    const { sessions } = useWorryTime.getState();
    expect(sessions[0].id).not.toBe(sessions[1].id);
  });

  it('persists sessions to localStorage', () => {
    useWorryTime.getState().addSession({ duration: 60, text: 'Persisted' });

    const stored = JSON.parse(localStorage.getItem('worry-sessions') ?? '{}');
    expect(stored.state.sessions).toHaveLength(1);
    expect(stored.state.sessions[0].text).toBe('Persisted');
  });
});
