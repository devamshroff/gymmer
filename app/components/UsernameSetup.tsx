'use client';

import { useState } from 'react';

interface UsernameSetupProps {
  onComplete: (username: string) => void;
}

export default function UsernameSetup({ onComplete }: UsernameSetupProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateUsername = (value: string): string | null => {
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (value.length > 20) {
      return 'Username must be 20 characters or less';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim();
    const validationError = validateUsername(trimmedUsername);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUsername }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to set username');
        return;
      }

      onComplete(data.username);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-800 rounded-xl p-8 max-w-md w-full border border-zinc-700">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          Welcome to GYMMER
        </h2>
        <p className="text-zinc-400 text-center mb-6">
          Choose a username to identify yourself when sharing routines with others.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Enter your username"
              className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg border border-zinc-600 focus:outline-none focus:border-green-500 placeholder-zinc-500"
              autoFocus
              disabled={loading}
            />
            <p className="text-xs text-zinc-500 mt-1">
              3-20 characters. Letters, numbers, and underscores only.
            </p>
          </div>

          {error && (
            <div className="mb-4 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Setting username...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
