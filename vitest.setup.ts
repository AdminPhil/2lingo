import '@testing-library/jest-dom/vitest';
import React from 'react';
import { vi } from 'vitest';

// 1. Mock Next.js Navigation
vi.mock('next/navigation', () => {
  const router = {
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  };
  return {
    useRouter: () => router,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/',
    redirect: vi.fn(),
  };
});

// 2. Mock Next.js Image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, priority, ...rest } = props;
    return React.createElement('img', { ...rest, alt: props.alt || '' });
  },
}));

// 3. Mock react-use (Audio, WindowSize, Media, Key, Mount)
vi.mock('react-use', async () => {
  const actual = await vi.importActual<Record<string, any>>('react-use');
  return {
    ...actual,
    useAudio: vi.fn().mockImplementation(() => [
      null,
      { time: 0, duration: 0, paused: true, muted: false, volume: 1 },
      { play: vi.fn(), pause: vi.fn(), seek: vi.fn(), volume: vi.fn() },
    ]),
    useMedia: vi.fn().mockReturnValue(false),
    useWindowSize: vi.fn().mockReturnValue({ width: 1024, height: 768 }),
    useKey: vi.fn(),
    useMount: (fn: () => void) => fn(),
  };
});

// 4. Mock Confetti & Canvas
vi.mock('react-confetti', () => ({
  __esModule: true,
  default: () => null,
}));

// Mock qrcode for instant deterministic QR data URLs
vi.mock('qrcode', () => ({
  __esModule: true,
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mockQrCode'),
  },
  toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mockQrCode'),
}));

// 5. Browser Globals (HTMLMediaElement, matchMedia, ResizeObserver, SpeechSynthesis, Clipboard, print)
if (typeof window !== 'undefined') {
  if (window.HTMLMediaElement) {
    window.HTMLMediaElement.prototype.play = vi.fn().mockImplementation(() => Promise.resolve());
    window.HTMLMediaElement.prototype.pause = vi.fn();
  }

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  class MockSpeechSynthesisUtterance {
    text: string;
    lang: string = '';
    rate: number = 1;
    pitch: number = 1;
    voice: any = null;
    constructor(text: string = '') {
      this.text = text;
    }
  }

  (global as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
  (window as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;

  Object.defineProperty(window, 'speechSynthesis', {
    writable: true,
    value: {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
    },
  });

  window.print = vi.fn();

  if (!navigator.clipboard) {
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
        readText: vi.fn().mockResolvedValue(''),
      },
    });
  } else {
    navigator.clipboard.writeText = vi.fn().mockResolvedValue(undefined);
    navigator.clipboard.readText = vi.fn().mockResolvedValue('');
  }
}

// 6. Mock Clerk Next.js
export const mockClerkClient = {
  sessions: [
    {
      id: 'sess_1',
      user: {
        firstName: 'Luka',
        username: 'luka',
        imageUrl: '/avatars/luka.png',
      },
    },
    {
      id: 'sess_2',
      user: {
        firstName: 'Mia',
        username: 'mia',
        imageUrl: '/avatars/mia.png',
      },
    },
  ],
  lastActiveSessionId: 'sess_1',
};

export const mockSetActive = vi.fn().mockResolvedValue(undefined);
export const mockSignOut = vi.fn().mockResolvedValue(undefined);

vi.mock('@clerk/nextjs', () => ({
  useClerk: () => ({
    client: mockClerkClient,
    setActive: mockSetActive,
    signOut: mockSignOut,
  }),
  useSignIn: () => ({
    isLoaded: true,
    signIn: {
      create: vi.fn().mockResolvedValue({ status: 'complete', createdSessionId: 'sess_test' }),
    },
    setActive: vi.fn().mockResolvedValue(undefined),
  }),
  useUser: () => ({
    user: { id: 'user_1', firstName: 'Luka' },
    isLoaded: true,
    isSignedIn: true,
  }),
  useAuth: () => ({
    userId: 'user_1',
    sessionId: 'sess_1',
    isLoaded: true,
    isSignedIn: true,
  }),
  ClerkProvider: ({ children }: any) => children,
}));
