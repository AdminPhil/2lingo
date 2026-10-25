/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Challenge } from '@/app/lesson/challenge';
import { Card } from '@/app/lesson/card';
import { AddMemberToPodModal } from '@/components/admin/add-member-to-pod-modal';
import { ParentSetupWizardModal } from '@/components/admin/parent-setup-wizard-modal';
import { ProfileSwitcherModal } from '@/components/modals/profile-switcher-modal';
import { useProfileSwitcherModal } from '@/store/use-profile-switcher-modal';
import * as podActions from '@/actions/pod';
import * as childAccountActions from '@/actions/child-account';
import * as ttsModule from '@/lib/tts';
import { mockClerkClient, mockSetActive } from '@/vitest.setup';
import { toast } from 'sonner';

vi.mock('@/actions/pod', () => ({
  adminAddUsersToPod: vi.fn().mockResolvedValue({ success: true }),
  updatePodSettings: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/actions/child-account', () => ({
  createMultipleChildAccounts: vi.fn().mockResolvedValue({
    success: true,
    created: [
      {
        id: 'child_1',
        name: 'Šime',
        username: 'sime',
        password: 'CroSime123!',
        userImageSrc: '/avatars/pasko.png',
      },
    ],
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Adversarial Stress Test Suite: Milestone 2 Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // =========================================================================
  // 1. ADVERSARIAL STRESS: Card / Challenge Interactions & Edge Cases
  // =========================================================================
  describe('Challenge & Card: Realistic Event Dispatching & Edge Cases', () => {
    const mockOptions = [
      {
        id: 10,
        challengeId: 500,
        text: 'Čaša svježe vode',
        correct: true,
        imageSrc: null,
        audioSrc: null,
      },
      {
        id: 20,
        challengeId: 500,
        text: 'Šalica toplog čaja s medom',
        correct: false,
        imageSrc: null,
        audioSrc: '/audio/tea.mp3',
      },
      {
        id: 30,
        challengeId: 500,
        text: 'Dobar dan i dobrodošli u Hrvatsku!',
        correct: false,
        imageSrc: null,
        audioSrc: null,
      },
    ];

    it('triggers option selection when clicking challenge card element', () => {
      const onSelect = vi.fn();

      render(
        <Challenge
          options={mockOptions}
          onSelect={onSelect}
          status="none"
          selectedOption={undefined}
          disabled={false}
          type="SELECT"
        />
      );

      const option1 = screen.getByText('Čaša svježe vode');
      fireEvent.click(option1);

      expect(onSelect).toHaveBeenCalledWith(10);
    });

    it('correctly branches between audioSrc playback and TTS speakText fallback', () => {
      const speakSpy = vi.spyOn(ttsModule, 'speakText').mockImplementation(() => {});

      // Card with audioSrc
      const { unmount } = render(
        <Card
          id={20}
          text="Šalica toplog čaja s medom"
          shortcut="2"
          imageSrc={null}
          audioSrc="/audio/tea.mp3"
          onClick={vi.fn()}
          status="none"
          selected={false}
          type="SELECT"
        />
      );

      const audioBtn = screen.getByRole('button', { name: /Read aloud/i });
      fireEvent.click(audioBtn);
      // Because audioSrc is provided, speakText should NOT be called
      expect(speakSpy).not.toHaveBeenCalled();
      unmount();

      // Card without audioSrc (fallback to TTS)
      render(
        <Card
          id={10}
          text="Čaša svježe vode"
          shortcut="1"
          imageSrc={null}
          audioSrc={null}
          onClick={vi.fn()}
          status="none"
          selected={false}
          type="SELECT"
        />
      );

      const ttsBtn = screen.getByRole('button', { name: /Read aloud/i });
      fireEvent.click(ttsBtn);
      expect(speakSpy).toHaveBeenCalledWith('Čaša svježe vode');
      speakSpy.mockRestore();
    });

    it('gracefully handles empty options array without throwing runtime exceptions', () => {
      const { container } = render(
        <Challenge
          options={[]}
          onSelect={vi.fn()}
          status="none"
          selectedOption={undefined}
          disabled={false}
          type="SELECT"
        />
      );

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryByTitle(/Keyboard shortcut:/i)).not.toBeInTheDocument();
    });

    it('verifies complex Croatian sentences, long compound words and zero ellipsis or truncation CSS classes', () => {
      const longWordsCases = [
        'prijestolonasljednikovica',
        'poljoprivredno-gospodarstveni',
        'Češnjačica i grožđice u đakovačkom voćnjaku s lišćem i ražom.',
        'Džepni đački rječnik za vježbanje šumskih mačića i ježića.',
      ];

      const forbiddenClasses = [
        'truncate',
        'text-ellipsis',
        'overflow-hidden',
        'line-clamp',
        'whitespace-nowrap',
      ];

      for (const phrase of longWordsCases) {
        // Test SELECT without image
        const { unmount: unmount1, container: c1 } = render(
          <Card
            id={101}
            text={phrase}
            shortcut="1"
            imageSrc={null}
            audioSrc={null}
            onClick={vi.fn()}
            status="none"
            selected={false}
            type="SELECT"
          />
        );
        const p1 = c1.querySelector('p') as HTMLParagraphElement;
        expect(p1).toBeInTheDocument();
        expect(p1.textContent).toBe(phrase);
        expect(p1.classList).toContain('break-words');
        for (const forbidden of forbiddenClasses) {
          expect(p1.classList).not.toContain(forbidden);
        }
        unmount1();

        // Test SELECT with image
        const { unmount: unmount2, container: c2 } = render(
          <Card
            id={102}
            text={phrase}
            shortcut="2"
            imageSrc="/avatars/pasko.png"
            audioSrc={null}
            onClick={vi.fn()}
            status="none"
            selected={false}
            type="SELECT"
          />
        );
        const p2 = c2.querySelector('p') as HTMLParagraphElement;
        expect(p2).toBeInTheDocument();
        expect(p2.textContent).toBe(phrase);
        expect(p2.classList).toContain('break-words');
        for (const forbidden of forbiddenClasses) {
          expect(p2.classList).not.toContain(forbidden);
        }
        unmount2();

        // Test ASSIST
        const { unmount: unmount3, container: c3 } = render(
          <Card
            id={103}
            text={phrase}
            shortcut="3"
            imageSrc={null}
            audioSrc={null}
            onClick={vi.fn()}
            status="none"
            selected={false}
            type="ASSIST"
          />
        );
        const p3 = c3.querySelector('p') as HTMLParagraphElement;
        expect(p3).toBeInTheDocument();
        expect(p3.textContent).toBe(phrase);
        expect(p3.classList).toContain('break-words');
        for (const forbidden of forbiddenClasses) {
          expect(p3.classList).not.toContain(forbidden);
        }
        unmount3();
      }
    });
  });

  // =========================================================================
  // 2. ADVERSARIAL STRESS: AddMemberToPodModal
  // =========================================================================
  describe('AddMemberToPodModal: Regex Injection, Server Errors & All-Member Bound', () => {
    const sampleUsers = [
      { userId: 'u_1', userName: 'Ana [Admin] (Lead)', userImageSrc: '/avatars/ana.png' },
      { userId: 'u_2', userName: 'Branko *Star*', userImageSrc: '/avatars/branko.png' },
      { userId: 'u_3', userName: 'Cvita $VIP$', userImageSrc: '/avatars/cvita.png' },
    ];

    it('safely handles regex special characters in search input without crashing', () => {
      render(
        <AddMemberToPodModal
          isOpen={true}
          onOpenChange={vi.fn()}
          podId={100}
          podName="Zadar Squad"
          existingMemberIds={[]}
          availableUsers={sampleUsers}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search by name or ID...');
      fireEvent.change(searchInput, { target: { value: '[Admin]' } });

      expect(screen.getByText('Ana [Admin] (Lead)')).toBeInTheDocument();
      expect(screen.queryByText('Branko *Star*')).not.toBeInTheDocument();

      // Test other regex symbols: * and $
      fireEvent.change(searchInput, { target: { value: '*Star*' } });
      expect(screen.getByText('Branko *Star*')).toBeInTheDocument();
      expect(screen.queryByText('Ana [Admin] (Lead)')).not.toBeInTheDocument();
    });

    it('handles empty available users list gracefully', () => {
      render(
        <AddMemberToPodModal
          isOpen={true}
          onOpenChange={vi.fn()}
          podId={100}
          podName="Empty Pod"
          existingMemberIds={[]}
          availableUsers={[]}
        />
      );

      expect(screen.getByText(/Select Users \(0 available\)/i)).toBeInTheDocument();
      expect(screen.getByText(/No users found matching/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add to Pod' })).toBeDisabled();
      expect(screen.queryByRole('button', { name: 'Select All' })).not.toBeInTheDocument();
    });

    it('correctly behaves when 100% of available users are already in the pod', () => {
      render(
        <AddMemberToPodModal
          isOpen={true}
          onOpenChange={vi.fn()}
          podId={100}
          podName="Full Pod"
          existingMemberIds={['u_1', 'u_2', 'u_3']}
          availableUsers={sampleUsers}
        />
      );

      // All 3 users show "In Pod" badge
      const badges = screen.getAllByText('In Pod');
      expect(badges).toHaveLength(3);

      // Select All button should not be present because eligible users count is 0
      expect(screen.queryByRole('button', { name: 'Select All' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add to Pod' })).toBeDisabled();
    });

    it('displays error toast and keeps modal open when server action fails with error', async () => {
      vi.mocked(podActions.adminAddUsersToPod).mockResolvedValueOnce({
        error: 'Database connection timeout',
      } as any);

      const onOpenChange = vi.fn();

      render(
        <AddMemberToPodModal
          isOpen={true}
          onOpenChange={onOpenChange}
          podId={100}
          podName="Zadar Squad"
          existingMemberIds={[]}
          availableUsers={sampleUsers}
        />
      );

      // Select user 1
      const u1Button = screen.getByText('Ana [Admin] (Lead)').closest('button')!;
      fireEvent.click(u1Button);

      // Click submit
      const submitBtn = screen.getByRole('button', { name: 'Add to Pod' });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Database connection timeout');
        // Modal must NOT close on error!
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });

    it('displays generic error toast when server action throws an exception', async () => {
      vi.mocked(podActions.adminAddUsersToPod).mockRejectedValueOnce(new Error('Network error'));

      const onOpenChange = vi.fn();

      render(
        <AddMemberToPodModal
          isOpen={true}
          onOpenChange={onOpenChange}
          podId={100}
          podName="Zadar Squad"
          existingMemberIds={[]}
          availableUsers={sampleUsers}
        />
      );

      const u1Button = screen.getByText('Ana [Admin] (Lead)').closest('button')!;
      fireEvent.click(u1Button);

      const submitBtn = screen.getByRole('button', { name: 'Add to Pod' });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to add users to pod.');
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });

    it('handles rapid toggle sequences, select all / deselect all parity, and role switching', async () => {
      const onOpenChange = vi.fn();
      render(
        <AddMemberToPodModal
          isOpen={true}
          onOpenChange={onOpenChange}
          podId={100}
          podName="Zadar Squad"
          existingMemberIds={[]}
          availableUsers={sampleUsers}
        />
      );

      const u1Btn = screen.getByText('Ana [Admin] (Lead)').closest('button')!;
      const u2Btn = screen.getByText('Branko *Star*').closest('button')!;

      // 1. Rapid toggle sequence on u1 (20 alternating clicks)
      for (let i = 1; i <= 20; i++) {
        fireEvent.click(u1Btn);
        if (i % 2 !== 0) {
          expect(screen.getByText('1 selected')).toBeInTheDocument();
        } else {
          expect(screen.queryByText(/selected/i)).not.toBeInTheDocument();
        }
      }

      // 2. Select both u1 and u2
      fireEvent.click(u1Btn);
      fireEvent.click(u2Btn);
      expect(screen.getByText('2 selected')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add 2 Users to Pod' })).toBeEnabled();

      // 3. Test Select All when partially selected
      const selectAllBtn = screen.getByRole('button', { name: 'Select All' });
      fireEvent.click(selectAllBtn);
      expect(screen.getByText('3 selected')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Deselect All' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add 3 Users to Pod' })).toBeEnabled();

      // Deselect all
      fireEvent.click(screen.getByRole('button', { name: 'Deselect All' }));
      expect(screen.queryByText(/selected/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add to Pod' })).toBeDisabled();

      // 4. Role switching stress: toggle between Learner and Pod Admin
      const learnerBtn = screen.getByRole('button', { name: /Learner/i });
      const adminBtn = screen.getByRole('button', { name: /Pod Admin/i });

      for (let i = 0; i < 5; i++) {
        fireEvent.click(adminBtn);
        expect(adminBtn.className).toContain('border-blue-500');
        fireEvent.click(learnerBtn);
        expect(learnerBtn.className).toContain('border-green-500');
      }

      // Select Pod Admin and select u1
      fireEvent.click(adminBtn);
      fireEvent.click(u1Btn);
      const submitBtn = screen.getByRole('button', { name: 'Add to Pod' });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(podActions.adminAddUsersToPod).toHaveBeenCalledWith(
          100,
          ['u_1'],
          'admin'
        );
        expect(toast.success).toHaveBeenCalledWith(
          'Added 1 user to Zadar Squad as Pod Admin!'
        );
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  // =========================================================================
  // 3. ADVERSARIAL STRESS: ParentSetupWizardModal
  // =========================================================================
  describe('ParentSetupWizardModal: Validation Bounds, Server Failure & Max Siblings', () => {
    const defaultProps = {
      isOpen: true,
      onOpenChange: vi.fn(),
      podId: 20,
      podName: 'The Horvat Family',
      inviteCode: 'HORVAT9',
    };

    it('rejects empty or whitespace-only family name on Step 1', () => {
      render(<ParentSetupWizardModal {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText('e.g. The Novak Family');
      fireEvent.change(nameInput, { target: { value: '     ' } });

      const continueBtn = screen.getByRole('button', { name: /Continue: Add Kids/i });
      fireEvent.click(continueBtn);

      expect(toast.error).toHaveBeenCalledWith('Please enter a family circle name.');
      // Should remain strictly on Step 1
      expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    });

    it('prevents proceeding to Step 3 if all child names on Step 2 are empty/whitespace', async () => {
      render(<ParentSetupWizardModal {...defaultProps} />);

      // Advance to Step 2
      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
      await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

      // Attempt to submit with blank child name
      const submitBtn = screen.getByRole('button', { name: /Create Accounts & Get Passes/i });
      fireEvent.click(submitBtn);

      expect(toast.error).toHaveBeenCalledWith("Please enter at least one child's name.");
      // Remains on Step 2
      expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
      expect(childAccountActions.createMultipleChildAccounts).not.toHaveBeenCalled();
    });

    it('handles batch account creation failure gracefully without advancing to Step 3', async () => {
      vi.mocked(childAccountActions.createMultipleChildAccounts).mockResolvedValueOnce({
        success: false,
        errors: ['Username luka is already registered by another learner'],
      } as any);

      render(<ParentSetupWizardModal {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
      await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

      const nameInput = screen.getByPlaceholderText('e.g. Luka or Mia');
      fireEvent.change(nameInput, { target: { value: 'Luka' } });

      const submitBtn = screen.getByRole('button', { name: /Create Accounts & Get Passes/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Username luka is already registered by another learner'
        );
        // Wizard MUST remain on Step 2 so parent can fix the conflict
        expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
        expect(screen.queryByText('Step 3 of 4')).not.toBeInTheDocument();
      });
    });

    it('asserts maximum boundary of 5 siblings and enforces toast limit', async () => {
      render(<ParentSetupWizardModal {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
      await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

      const addSiblingBtn = screen.getByRole('button', { name: /\+ Add Another Sibling/i });
      fireEvent.click(addSiblingBtn); // 2
      fireEvent.click(addSiblingBtn); // 3
      fireEvent.click(addSiblingBtn); // 4
      fireEvent.click(addSiblingBtn); // 5

      // At 5 children, button is removed from DOM
      expect(screen.queryByRole('button', { name: /\+ Add Another Sibling/i })).not.toBeInTheDocument();
      expect(screen.getByText('Child 5')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 4. ADVERSARIAL STRESS: ProfileSwitcherModal
  // =========================================================================
  describe('ProfileSwitcherModal: Clerk Session Failures & Boundary Scenarios', () => {
    it('handles setActive rejection cleanly by displaying error toast', async () => {
      mockSetActive.mockRejectedValueOnce(new Error('Session expired'));

      useProfileSwitcherModal.getState().open();
      render(<ProfileSwitcherModal />);

      expect(screen.getByText('Tko danas uči?')).toBeInTheDocument();

      const miaOption = screen.getByText('Mia').closest('div[class*="rounded-2xl"]')!;
      fireEvent.click(miaOption);

      await waitFor(() => {
        expect(mockSetActive).toHaveBeenCalledWith({ session: 'sess_2' });
        expect(toast.error).toHaveBeenCalledWith('Failed to switch profile. Please try again.');
      });
    });

    it('handles empty sessions gracefully without crashing', () => {
      const originalSessions = mockClerkClient.sessions;
      mockClerkClient.sessions = [];

      useProfileSwitcherModal.getState().open();
      render(<ProfileSwitcherModal />);

      expect(screen.getByText('Tko danas uči?')).toBeInTheDocument();
      expect(screen.queryByText('Active on this tablet')).not.toBeInTheDocument();

      mockClerkClient.sessions = originalSessions;
    });

    it('falls back to "Learner" display name when session user has neither firstName nor username', () => {
      const originalSessions = mockClerkClient.sessions;
      mockClerkClient.sessions = [
        {
          id: 'sess_anon',
          user: {
            firstName: '',
            username: '',
            imageUrl: '',
          },
        },
      ];

      useProfileSwitcherModal.getState().open();
      render(<ProfileSwitcherModal />);

      expect(screen.getByText('Learner')).toBeInTheDocument();

      mockClerkClient.sessions = originalSessions;
    });
  });
});
