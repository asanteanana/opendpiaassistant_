/**
 * Keyboard Shortcuts Hook
 * Provides keyboard shortcuts for power users
 */
'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  shortcuts?: KeyboardShortcut[];
}

export function useKeyboardShortcuts({
  enabled = true,
  shortcuts = [],
}: UseKeyboardShortcutsOptions = {}) {
  const router = useRouter();

  // Default shortcuts
  const defaultShortcuts: KeyboardShortcut[] = [
    {
      key: 'h',
      ctrlKey: true,
      action: () => router.push('/'),
      description: 'Go to Home',
    },
    {
      key: 'a',
      ctrlKey: true,
      action: () => router.push('/assessments'),
      description: 'Go to Assessments',
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => {
        // Trigger new assessment modal
        const event = new CustomEvent('openNewAssessment');
        window.dispatchEvent(event);
      },
      description: 'New Assessment',
    },
    {
      key: 's',
      ctrlKey: true,
      action: () => {
        // Trigger save
        const event = new CustomEvent('saveAssessment');
        window.dispatchEvent(event);
      },
      description: 'Save Assessment',
    },
    {
      key: 'e',
      ctrlKey: true,
      action: () => {
        // Trigger export
        const event = new CustomEvent('exportAssessment');
        window.dispatchEvent(event);
      },
      description: 'Export Assessment',
    },
    {
      key: 'ArrowRight',
      action: () => {
        const event = new CustomEvent('nextQuestion');
        window.dispatchEvent(event);
      },
      description: 'Next Question',
    },
    {
      key: 'ArrowLeft',
      action: () => {
        const event = new CustomEvent('previousQuestion');
        window.dispatchEvent(event);
      },
      description: 'Previous Question',
    },
    {
      key: 'Escape',
      action: () => {
        const event = new CustomEvent('closeModal');
        window.dispatchEvent(event);
      },
      description: 'Close Modal',
    },
    {
      key: '?',
      action: () => {
        const event = new CustomEvent('showShortcuts');
        window.dispatchEvent(event);
      },
      description: 'Show Shortcuts',
    },
  ];

  const allShortcuts = [...defaultShortcuts, ...shortcuts];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return;
      }

      const pressedKey = event.key.toLowerCase();
      const pressedShortcut = allShortcuts.find(
        (shortcut) =>
          shortcut.key.toLowerCase() === pressedKey &&
          !!shortcut.ctrlKey === event.ctrlKey &&
          !!shortcut.shiftKey === event.shiftKey &&
          !!shortcut.altKey === event.altKey
      );

      if (pressedShortcut) {
        event.preventDefault();
        pressedShortcut.action();
      }
    },
    [enabled, allShortcuts]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);

  return {
    shortcuts: allShortcuts,
    enabled,
  };
}

// Keyboard shortcuts help component
export function KeyboardShortcutsHelp() {
  const { shortcuts } = useKeyboardShortcuts();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => {
              const event = new CustomEvent('closeModal');
              window.dispatchEvent(event);
            }}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.ctrlKey && (
                  <kbd className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-mono dark:bg-gray-700">
                    Ctrl
                  </kbd>
                )}
                {shortcut.shiftKey && (
                  <kbd className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-mono dark:bg-gray-700">
                    Shift
                  </kbd>
                )}
                {shortcut.altKey && (
                  <kbd className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-mono dark:bg-gray-700">
                    Alt
                  </kbd>
                )}
                <kbd className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-mono dark:bg-gray-700">
                  {shortcut.key}
                </kbd>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Press <kbd className="rounded bg-gray-200 px-1 py-0.5 text-xs font-mono dark:bg-gray-700">?</kbd> to toggle this help
        </div>
      </div>
    </div>
  );
}
