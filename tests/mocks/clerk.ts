import React from "react";
import { vi } from "vitest";

let currentMockUserId: string | null = null;
let currentMockUser: any = null;

export const setMockAuth = (userId: string | null, user: any = null) => {
  currentMockUserId = userId;
  currentMockUser = user;
};

export const getMockAuth = () => ({
  userId: currentMockUserId,
  user: currentMockUser,
});

export const clerkClient = {
  users: {
    createUser: vi.fn(async (params: any) => ({
      id: `clerk_user_${params.username || Math.random().toString(36).substring(2, 9)}`,
      username: params.username,
      firstName: params.firstName,
      ...params,
    })),
    deleteUser: vi.fn(async (id: string) => ({ id, deleted: true })),
    getUser: vi.fn(async (id: string) => ({ id, username: `user_${id}` })),
    updateUser: vi.fn(async (id: string, params: any) => ({ id, ...params })),
  },
};

export const auth = vi.fn(() => ({
  userId: currentMockUserId,
  sessionId: currentMockUserId ? `sess_${currentMockUserId}` : null,
}));

export const currentUser = vi.fn(async () => currentMockUser);

export const resetMockClerk = () => {
  currentMockUserId = null;
  currentMockUser = null;
  auth.mockClear();
  currentUser.mockClear();
  clerkClient.users.createUser.mockClear();
  clerkClient.users.deleteUser.mockClear();
  clerkClient.users.getUser.mockClear();
  clerkClient.users.updateUser.mockClear();
};

export const useUser = () => ({
  user: currentMockUser || (currentMockUserId ? { id: currentMockUserId } : null),
  isLoaded: true,
  isSignedIn: Boolean(currentMockUserId),
});

export const useAuth = () => ({
  userId: currentMockUserId,
  sessionId: currentMockUserId ? `sess_${currentMockUserId}` : null,
  isLoaded: true,
  isSignedIn: Boolean(currentMockUserId),
});

export const useClerk = () => ({
  client: clerkClient,
  setActive: vi.fn().mockResolvedValue(undefined),
  signOut: vi.fn().mockResolvedValue(undefined),
});

export const useSignIn = () => ({
  isLoaded: true,
  signIn: {
    create: vi.fn().mockResolvedValue({ status: "complete", createdSessionId: "sess_test" }),
  },
  setActive: vi.fn().mockResolvedValue(undefined),
});

export const ClerkProvider = ({ children }: any) => children;

export const ClerkLoaded = ({ children }: any) => children;
export const ClerkLoading = ({ children }: any) => null;

export const SignedIn = ({ children }: any) => {
  return currentMockUserId ? children : null;
};

export const SignedOut = ({ children }: any) => {
  return !currentMockUserId ? children : null;
};

export const SignInButton = ({ children, afterSignInUrl, afterSignUpUrl }: any) =>
  React.createElement(
    "div",
    {
      "data-testid": "clerk-sign-in-btn",
      "data-after-sign-in": afterSignInUrl,
      "data-after-sign-up": afterSignUpUrl,
    },
    children
  );

export const SignUpButton = ({ children, afterSignInUrl, afterSignUpUrl }: any) =>
  React.createElement(
    "div",
    {
      "data-testid": "clerk-sign-up-btn",
      "data-after-sign-in": afterSignInUrl,
      "data-after-sign-up": afterSignUpUrl,
    },
    children
  );
