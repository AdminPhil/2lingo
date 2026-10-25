/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileSwitcherModal } from '@/components/modals/profile-switcher-modal';
import { useProfileSwitcherModal } from '@/store/use-profile-switcher-modal';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('<ProfileSwitcherModal /> Multi-Session Shared Device Switcher', () => {
  let routerMock: any;
  let clerkMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    useProfileSwitcherModal.getState().open();
    routerMock = useRouter();
    clerkMock = useClerk();
  });

  it('renders modal dialog with sessions from useClerk()', () => {
    render(<ProfileSwitcherModal />);

    expect(screen.getByText('Tko danas uči?')).toBeInTheDocument();
    expect(
      screen.getByText('Who is learning today? (Shared Tablet Switcher)')
    ).toBeInTheDocument();

    // Verify both session user names appear
    expect(screen.getByText('Luka')).toBeInTheDocument();
    expect(screen.getByText('Mia')).toBeInTheDocument();
  });

  it('displays green checkmark and "Active on this tablet" for the current active profile', () => {
    render(<ProfileSwitcherModal />);

    // Active session is Luka (sess_1 === lastActiveSessionId)
    expect(screen.getByText('Active on this tablet')).toBeInTheDocument();

    const lukaContainer = screen.getByText('Luka').closest('div[class*="rounded-2xl"]');
    expect(lukaContainer?.className).toContain('border-green-500');
    expect(lukaContainer?.className).toContain('bg-green-50/70');
  });

  it('displays "Tap to switch" for inactive profiles and calls setActive when clicked', async () => {
    render(<ProfileSwitcherModal />);

    // Inactive session is Mia
    expect(screen.getByText('Tap to switch')).toBeInTheDocument();

    const miaOption = screen.getByText('Mia').closest('div[class*="rounded-2xl"]');
    expect(miaOption).not.toBeNull();
    fireEvent.click(miaOption!);

    await waitFor(() => {
      expect(clerkMock.setActive).toHaveBeenCalledWith({ session: 'sess_2' });
      expect(toast.success).toHaveBeenCalledWith('Switched profile to Mia! 🇭🇷');
      expect(routerMock.refresh).toHaveBeenCalledTimes(1);
      expect(useProfileSwitcherModal.getState().isOpen).toBe(false);
    });
  });

  it('closes modal without calling setActive when clicking the already active session', () => {
    render(<ProfileSwitcherModal />);

    const lukaOption = screen.getByText('Luka').closest('div[class*="rounded-2xl"]');
    expect(lukaOption).not.toBeNull();
    fireEvent.click(lukaOption!);

    expect(clerkMock.setActive).not.toHaveBeenCalled();
    expect(useProfileSwitcherModal.getState().isOpen).toBe(false);
  });

  it('navigates to /qr-login when clicking "Scan Student Badge / QR Code"', () => {
    render(<ProfileSwitcherModal />);

    const scanBadgeBtn = screen.getByRole('button', {
      name: /Scan Student Badge \/ QR Code/i,
    });
    fireEvent.click(scanBadgeBtn);

    expect(useProfileSwitcherModal.getState().isOpen).toBe(false);
    expect(routerMock.push).toHaveBeenCalledWith('/qr-login');
  });

  it('navigates to /admin when clicking the Parent Center link button', () => {
    render(<ProfileSwitcherModal />);

    const parentCenterBtn = screen.getByRole('button', { name: /Parent Center/i });
    fireEvent.click(parentCenterBtn);

    expect(useProfileSwitcherModal.getState().isOpen).toBe(false);
    expect(routerMock.push).toHaveBeenCalledWith('/admin');
  });

  it('does not render dialog content when isOpen is false', () => {
    useProfileSwitcherModal.getState().close();
    render(<ProfileSwitcherModal />);

    expect(screen.queryByText('Tko danas uči?')).not.toBeInTheDocument();
  });
});
