/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ParentSetupWizardModal } from '@/components/admin/parent-setup-wizard-modal';
import { ProfileSwitcherModal } from '@/components/modals/profile-switcher-modal';
import { useProfileSwitcherModal } from '@/store/use-profile-switcher-modal';
import * as childAccountActions from '@/actions/child-account';
import * as podActions from '@/actions/pod';
import { mockClerkClient, mockSetActive } from '@/vitest.setup';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Mocks
vi.mock('@/actions/child-account', () => ({
  createMultipleChildAccounts: vi.fn(),
}));

vi.mock('@/actions/pod', () => ({
  updatePodSettings: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Empirical Challenger M2: ParentSetupWizardModal Stress Tests', () => {
  const defaultWizardProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    podId: 101,
    podName: 'The Horvat Family',
    inviteCode: 'HORVAT',
  };

  const getProgressBar = () => {
    return document.body.querySelector('.bg-green-600.transition-all') as HTMLElement;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (childAccountActions.createMultipleChildAccounts as any).mockResolvedValue({
      success: true,
      created: [
        {
          id: 'child_1',
          name: 'Luka',
          username: 'luka',
          password: 'CroLuka99!',
          userImageSrc: '/avatars/luka.png',
        },
      ],
    });
  });

  describe('1. Stepper Forward Navigation & Progress Bar Calculation Across All 4 Steps', () => {
    it('accurately computes 25% -> 50% -> 75% -> 100% progress widths and active labels', async () => {
      render(<ParentSetupWizardModal {...defaultWizardProps} />);

      // STEP 1: Family Circle (25%)
      expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
      expect(screen.getByText('Name Your Family Circle')).toBeInTheDocument();
      const bar = getProgressBar();
      expect(bar).toBeInTheDocument();
      expect(bar.style.width).toBe('25%');

      // Step label highlight verification
      const step1Label = screen.getByText('1. Family Circle');
      expect(step1Label.className).toContain('text-green-700 font-extrabold');

      // Advance to STEP 2: Add Kids (50%)
      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
      await waitFor(() => {
        expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
        expect(screen.getByText('Who is Learning Croatian?')).toBeInTheDocument();
        expect(getProgressBar().style.width).toBe('50%');
      });

      const step2Label = screen.getByText('2. Add Kids');
      expect(step2Label.className).toContain('text-green-700 font-extrabold');

      // Enter child name and advance to STEP 3: Fridge Sheet (75%)
      const nameInput = screen.getByPlaceholderText('e.g. Luka or Mia');
      fireEvent.change(nameInput, { target: { value: 'Luka' } });

      fireEvent.click(screen.getByRole('button', { name: /Create Accounts & Get Passes/i }));
      await waitFor(() => {
        expect(screen.getByText('Step 3 of 4')).toBeInTheDocument();
        expect(screen.getByText(/Your Student Fast Passes Are Ready!/i)).toBeInTheDocument();
        expect(getProgressBar().style.width).toBe('75%');
      });

      const step3Label = screen.getByText('3. Fridge Sheet');
      expect(step3Label.className).toContain('text-green-700 font-extrabold');

      // Advance to STEP 4: Tablet Handoff (100%)
      fireEvent.click(screen.getByRole('button', { name: /Next: Tablet Setup/i }));
      expect(screen.getByText('Step 4 of 4')).toBeInTheDocument();
      expect(screen.getByText(/How to Hand Off to Your Kids/i)).toBeInTheDocument();
      expect(getProgressBar().style.width).toBe('100%');

      const step4Label = screen.getByText('4. Tablet Handoff');
      expect(step4Label.className).toContain('text-green-700 font-extrabold');
    });

    it('finishes wizard at Step 4, sets localStorage, triggers router.refresh, and invokes onOpenChange(false)', async () => {
      const onOpenChange = vi.fn();
      const router = useRouter();
      render(<ParentSetupWizardModal {...defaultWizardProps} onOpenChange={onOpenChange} />);

      // Fast-forward to Step 4
      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
      await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

      fireEvent.change(screen.getByPlaceholderText('e.g. Luka or Mia'), { target: { value: 'Luka' } });
      fireEvent.click(screen.getByRole('button', { name: /Create Accounts & Get Passes/i }));
      await waitFor(() => expect(screen.getByText('Step 3 of 4')).toBeInTheDocument());

      fireEvent.click(screen.getByRole('button', { name: /Next: Tablet Setup/i }));
      expect(screen.getByText('Step 4 of 4')).toBeInTheDocument();

      // Click "Go to Parent Dashboard →"
      const finishBtn = screen.getByRole('button', { name: /Go to Parent Dashboard →/i });
      fireEvent.click(finishBtn);

      expect(localStorage.getItem('parent_wizard_completed')).toBe('true');
      expect(router.refresh).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('allows "Preview Learning Path" at Step 4 which sets localStorage, pushes /learn, and closes modal', async () => {
      const onOpenChange = vi.fn();
      const router = useRouter();
      render(<ParentSetupWizardModal {...defaultWizardProps} onOpenChange={onOpenChange} />);

      // Fast-forward to Step 4
      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
      await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());
      fireEvent.change(screen.getByPlaceholderText('e.g. Luka or Mia'), { target: { value: 'Luka' } });
      fireEvent.click(screen.getByRole('button', { name: /Create Accounts & Get Passes/i }));
      await waitFor(() => expect(screen.getByText('Step 3 of 4')).toBeInTheDocument());
      fireEvent.click(screen.getByRole('button', { name: /Next: Tablet Setup/i }));

      const previewBtn = screen.getByRole('button', { name: /Preview Learning Path/i });
      fireEvent.click(previewBtn);

      expect(localStorage.getItem('parent_wizard_completed')).toBe('true');
      expect(router.push).toHaveBeenCalledWith('/learn');
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('2. Backward Navigation and State Persistence', () => {
    it('persists modified family circle name when stepping back from Step 2 to Step 1', async () => {
      render(<ParentSetupWizardModal {...defaultWizardProps} />);

      const input = screen.getByPlaceholderText('e.g. The Novak Family');
      fireEvent.change(input, { target: { value: 'Krk Explorers' } });

      // Step 1 -> Step 2
      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
      await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

      // Back to Step 1
      fireEvent.click(screen.getByRole('button', { name: /Back/i }));
      expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
      expect(getProgressBar().style.width).toBe('25%');

      // Assert input still holds 'Krk Explorers'
      const restoredInput = screen.getByPlaceholderText('e.g. The Novak Family') as HTMLInputElement;
      expect(restoredInput.value).toBe('Krk Explorers');
    });

    it('persists drafted children when stepping back from Step 3 to Step 2', async () => {
      render(<ParentSetupWizardModal {...defaultWizardProps} />);

      // Step 1 -> Step 2
      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
      await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

      // Add 2 children
      const firstChildInput = screen.getByPlaceholderText('e.g. Luka or Mia');
      fireEvent.change(firstChildInput, { target: { value: 'Filip' } });

      fireEvent.click(screen.getByRole('button', { name: /\+ Add Another Sibling/i }));
      const inputs = screen.getAllByPlaceholderText('e.g. Luka or Mia');
      expect(inputs.length).toBe(2);
      fireEvent.change(inputs[1], { target: { value: 'Zvon' } });

      // Submit Step 2 -> Step 3
      fireEvent.click(screen.getByRole('button', { name: /Create Accounts & Get Passes/i }));
      await waitFor(() => expect(screen.getByText('Step 3 of 4')).toBeInTheDocument());

      // Back to Step 2
      fireEvent.click(screen.getByRole('button', { name: /Back/i }));
      expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
      expect(getProgressBar().style.width).toBe('50%');

      // Assert both children rows are intact
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      const currentInputs = screen.getAllByPlaceholderText('e.g. Luka or Mia') as HTMLInputElement[];
      expect(currentInputs[0].value).toBe('Filip');
      expect(currentInputs[1].value).toBe('Zvon');
    });

    it('handles rapid back-and-forth oscillation without state degradation', async () => {
      render(<ParentSetupWizardModal {...defaultWizardProps} />);

      // Step 1 -> Step 2
      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
      await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

      // Step 2 -> Step 1 -> Step 2 -> Step 1 -> Step 2
      for (let i = 0; i < 3; i++) {
        fireEvent.click(screen.getByRole('button', { name: /Back/i }));
        expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
        await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());
      }

      expect(getProgressBar().style.width).toBe('50%');
    });
  });

  describe('3. Boundary at 5 Sibling Rows & Deletion Mechanics', () => {
    it('enforces hard boundary of exactly 5 sibling rows and hides "+ Add Another Sibling"', async () => {
      render(<ParentSetupWizardModal {...defaultWizardProps} />);

      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
      await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

      // Initial state: 1 child row, trash button hidden
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.queryByTitle('Remove child')).not.toBeInTheDocument();

      const addSiblingBtn = () => screen.queryByRole('button', { name: /\+ Add Another Sibling/i });

      // Add Child 2
      fireEvent.click(addSiblingBtn()!);
      expect(screen.getByText('Child 2')).toBeInTheDocument();

      // Add Child 3
      fireEvent.click(addSiblingBtn()!);
      expect(screen.getByText('Child 3')).toBeInTheDocument();

      // Add Child 4
      fireEvent.click(addSiblingBtn()!);
      expect(screen.getByText('Child 4')).toBeInTheDocument();

      // Add Child 5
      fireEvent.click(addSiblingBtn()!);
      expect(screen.getByText('Child 5')).toBeInTheDocument();

      // Now at exactly 5 rows: Add button must be removed from the DOM
      expect(addSiblingBtn()).not.toBeInTheDocument();

      // Verify all 5 rows have trash buttons
      const trashBtns = screen.getAllByTitle('Remove child');
      expect(trashBtns.length).toBe(5);

      // Remove middle child (e.g. index 2 = Child 3)
      fireEvent.click(trashBtns[2]);

      // Exactly 4 rows remain; "+ Add Another Sibling" button reappears!
      expect(screen.queryByText('Child 5')).not.toBeInTheDocument();
      expect(addSiblingBtn()).toBeInTheDocument();

      // Add back up to 5
      fireEvent.click(addSiblingBtn()!);
      expect(screen.getByText('Child 5')).toBeInTheDocument();
      expect(addSiblingBtn()).not.toBeInTheDocument();
    });

    it('prevents deleting the last remaining child row when count reaches 1', async () => {
      render(<ParentSetupWizardModal {...defaultWizardProps} />);

      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
      await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

      // Add a 2nd child so trash buttons appear
      fireEvent.click(screen.getByRole('button', { name: /\+ Add Another Sibling/i }));
      expect(screen.getAllByTitle('Remove child').length).toBe(2);

      // Remove one child
      fireEvent.click(screen.getAllByTitle('Remove child')[0]);

      // Now only 1 child remains: trash button MUST be gone
      expect(screen.queryByTitle('Remove child')).not.toBeInTheDocument();
      expect(screen.getByText('Child 1')).toBeInTheDocument();
    });
  });

  describe('4. Empty and Whitespace Inputs Stress', () => {
    it('rejects empty or whitespace-only family circle name on Step 1 with toast error', async () => {
      render(<ParentSetupWizardModal {...defaultWizardProps} />);

      const input = screen.getByPlaceholderText('e.g. The Novak Family');

      // Test completely empty
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));

      expect(toast.error).toHaveBeenCalledWith('Please enter a family circle name.');
      expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
      expect(getProgressBar().style.width).toBe('25%');

      // Test whitespace only
      fireEvent.change(input, { target: { value: '     ' } });
      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));

      expect(toast.error).toHaveBeenCalledWith('Please enter a family circle name.');
      expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    });

    it('rejects submission on Step 2 if all child names are empty or whitespace', async () => {
      render(<ParentSetupWizardModal {...defaultWizardProps} />);

      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
      await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

      // Add a 2nd child row, leaving both blank
      fireEvent.click(screen.getByRole('button', { name: /\+ Add Another Sibling/i }));
      const inputs = screen.getAllByPlaceholderText('e.g. Luka or Mia');
      fireEvent.change(inputs[0], { target: { value: '   ' } });
      fireEvent.change(inputs[1], { target: { value: '' } });

      fireEvent.click(screen.getByRole('button', { name: /Create Accounts & Get Passes/i }));

      expect(toast.error).toHaveBeenCalledWith("Please enter at least one child's name.");
      expect(childAccountActions.createMultipleChildAccounts).not.toHaveBeenCalled();
      expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
      expect(getProgressBar().style.width).toBe('50%');
    });

    it('filters out blank child rows when some rows are valid and some are empty', async () => {
      render(<ParentSetupWizardModal {...defaultWizardProps} />);

      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
      await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

      // Add 2 more rows (total 3)
      fireEvent.click(screen.getByRole('button', { name: /\+ Add Another Sibling/i }));
      fireEvent.click(screen.getByRole('button', { name: /\+ Add Another Sibling/i }));

      const inputs = screen.getAllByPlaceholderText('e.g. Luka or Mia');
      fireEvent.change(inputs[0], { target: { value: 'Adriana' } }); // Valid
      fireEvent.change(inputs[1], { target: { value: '   ' } });     // Empty/Whitespace
      fireEvent.change(inputs[2], { target: { value: 'Silvia' } });  // Valid

      fireEvent.click(screen.getByRole('button', { name: /Create Accounts & Get Passes/i }));

      await waitFor(() => {
        expect(childAccountActions.createMultipleChildAccounts).toHaveBeenCalledTimes(1);
      });

      const callPayload = (childAccountActions.createMultipleChildAccounts as any).mock.calls[0][0];
      // Must only contain 2 accounts, omitting the blank one
      expect(callPayload.length).toBe(2);
      expect(callPayload[0].childName).toBe('Adriana');
      expect(callPayload[1].childName).toBe('Silvia');
    });
  });

  describe('5. Account Creation Failure Handling', () => {
    it('displays server error toast and remains on Step 2 when creation fails', async () => {
      (childAccountActions.createMultipleChildAccounts as any).mockResolvedValue({
        success: false,
        errors: ['Username is already in use.'],
      });

      render(<ParentSetupWizardModal {...defaultWizardProps} />);

      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
      await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

      fireEvent.change(screen.getByPlaceholderText('e.g. Luka or Mia'), { target: { value: 'Luka' } });
      fireEvent.click(screen.getByRole('button', { name: /Create Accounts & Get Passes/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Username is already in use.');
        expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
        expect(getProgressBar().style.width).toBe('50%');
      });
    });

    it('catches unexpected thrown rejection in createMultipleChildAccounts gracefully', async () => {
      (childAccountActions.createMultipleChildAccounts as any).mockRejectedValue(
        new Error('Network disconnected')
      );

      render(<ParentSetupWizardModal {...defaultWizardProps} />);

      fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
      await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

      fireEvent.change(screen.getByPlaceholderText('e.g. Luka or Mia'), { target: { value: 'Luka' } });
      fireEvent.click(screen.getByRole('button', { name: /Create Accounts & Get Passes/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'An error occurred while creating child accounts.'
        );
        expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
      });
    });
  });
});

describe('Empirical Challenger M2: ProfileSwitcherModal Stress Tests', () => {
  let routerMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    useProfileSwitcherModal.getState().open();
    routerMock = useRouter();
  });

  describe('1. Multi-Session Rendering: 1 Session', () => {
    it('renders single active session with checkmark and "Active on this tablet"', () => {
      mockClerkClient.sessions = [
        {
          id: 'sess_single',
          user: {
            firstName: 'Luka',
            username: 'luka',
            imageUrl: '/avatars/luka.png',
          },
        },
      ];
      mockClerkClient.lastActiveSessionId = 'sess_single';

      render(<ProfileSwitcherModal />);

      expect(screen.getByText('Luka')).toBeInTheDocument();
      expect(screen.getByText('Active on this tablet')).toBeInTheDocument();
      expect(screen.queryByText('Tap to switch')).not.toBeInTheDocument();

      // Clicking single active session closes modal without calling setActive
      const profileCard = screen.getByText('Luka').closest('div[class*="rounded-2xl"]');
      fireEvent.click(profileCard!);

      expect(mockSetActive).not.toHaveBeenCalled();
      expect(useProfileSwitcherModal.getState().isOpen).toBe(false);
    });
  });

  describe('2. Multi-Session Rendering: 2 Sessions', () => {
    it('renders 1 active and 1 inactive session, allowing seamless switch', async () => {
      mockClerkClient.sessions = [
        {
          id: 'sess_1',
          user: { firstName: 'Luka', username: 'luka', imageUrl: '/avatars/luka.png' },
        },
        {
          id: 'sess_2',
          user: { firstName: 'Mia', username: 'mia', imageUrl: '/avatars/mia.png' },
        },
      ];
      mockClerkClient.lastActiveSessionId = 'sess_1';

      render(<ProfileSwitcherModal />);

      expect(screen.getByText('Active on this tablet')).toBeInTheDocument();
      expect(screen.getByText('Tap to switch')).toBeInTheDocument();

      // Switch to Mia
      const miaCard = screen.getByText('Mia').closest('div[class*="rounded-2xl"]');
      fireEvent.click(miaCard!);

      await waitFor(() => {
        expect(mockSetActive).toHaveBeenCalledWith({ session: 'sess_2' });
        expect(toast.success).toHaveBeenCalledWith('Switched profile to Mia! 🇭🇷');
        expect(routerMock.refresh).toHaveBeenCalledTimes(1);
        expect(useProfileSwitcherModal.getState().isOpen).toBe(false);
      });
    });
  });

  describe('3. Multi-Session Rendering: 5 Sessions (Living Room Shared Tablet Stress)', () => {
    it('renders all 5 learner sessions: 1 active checkmark and 4 tap-to-switch items', async () => {
      mockClerkClient.sessions = [
        { id: 'sess_1', user: { firstName: 'Adriana', username: 'adriana', imageUrl: '/avatars/mia.png' } },
        { id: 'sess_2', user: { firstName: 'Silvia', username: 'silvia', imageUrl: '/avatars/pasko.png' } },
        { id: 'sess_3', user: { firstName: 'Vanessa', username: 'vanessa', imageUrl: '/avatars/delfi.png' } },
        { id: 'sess_4', user: { firstName: 'Zvon', username: 'zvon', imageUrl: '/avatars/luka.png' } },
        { id: 'sess_5', user: { firstName: 'Filip', username: 'filip', imageUrl: '/avatars/matija.png' } },
      ];
      mockClerkClient.lastActiveSessionId = 'sess_3'; // Vanessa is active

      render(<ProfileSwitcherModal />);

      // Verify all 5 are rendered
      expect(screen.getByText('Adriana')).toBeInTheDocument();
      expect(screen.getByText('Silvia')).toBeInTheDocument();
      expect(screen.getByText('Vanessa')).toBeInTheDocument();
      expect(screen.getByText('Zvon')).toBeInTheDocument();
      expect(screen.getByText('Filip')).toBeInTheDocument();

      // Exactly 1 active and 4 inactive
      expect(screen.getAllByText('Active on this tablet').length).toBe(1);
      expect(screen.getAllByText('Tap to switch').length).toBe(4);

      // Verify active badge styling on Vanessa's card
      const vanessaCard = screen.getByText('Vanessa').closest('div[class*="rounded-2xl"]');
      expect(vanessaCard?.className).toContain('border-green-500');

      // Switch to Filip (sess_5)
      const filipCard = screen.getByText('Filip').closest('div[class*="rounded-2xl"]');
      fireEvent.click(filipCard!);

      await waitFor(() => {
        expect(mockSetActive).toHaveBeenCalledWith({ session: 'sess_5' });
        expect(toast.success).toHaveBeenCalledWith('Switched profile to Filip! 🇭🇷');
        expect(useProfileSwitcherModal.getState().isOpen).toBe(false);
      });
    });
  });

  describe('4. Active Profile Switching Error Handling', () => {
    it('retains modal open and displays error toast when setActive rejects', async () => {
      mockSetActive.mockRejectedValueOnce(new Error('Clerk session switch failed'));

      mockClerkClient.sessions = [
        { id: 'sess_1', user: { firstName: 'Luka', username: 'luka', imageUrl: '/avatars/luka.png' } },
        { id: 'sess_2', user: { firstName: 'Mia', username: 'mia', imageUrl: '/avatars/mia.png' } },
      ];
      mockClerkClient.lastActiveSessionId = 'sess_1';

      render(<ProfileSwitcherModal />);

      const miaCard = screen.getByText('Mia').closest('div[class*="rounded-2xl"]');
      fireEvent.click(miaCard!);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to switch profile. Please try again.');
        // Modal must remain OPEN so user can retry
        expect(useProfileSwitcherModal.getState().isOpen).toBe(true);
      });
    });
  });

  describe('5. Fallback Display Name and Avatar Handling', () => {
    it('falls back to username when firstName is missing', () => {
      mockClerkClient.sessions = [
        {
          id: 'sess_user_only',
          user: { firstName: undefined, username: 'cro_star_99', imageUrl: '/custom.png' } as any,
        },
      ];
      mockClerkClient.lastActiveSessionId = 'sess_user_only';

      render(<ProfileSwitcherModal />);
      expect(screen.getByText('cro_star_99')).toBeInTheDocument();
    });

    it('falls back to "Learner" and "/mascot.png" when both firstName and username are undefined', () => {
      mockClerkClient.sessions = [
        {
          id: 'sess_blank',
          user: { firstName: undefined, username: undefined, imageUrl: undefined } as any,
        },
      ];
      mockClerkClient.lastActiveSessionId = 'sess_blank';

      render(<ProfileSwitcherModal />);
      expect(screen.getByText('Learner')).toBeInTheDocument();
      const img = screen.getByAltText('Learner') as HTMLImageElement;
      expect(img.src).toContain('/mascot.png');
    });

    it('handles empty sessions array gracefully without throwing', () => {
      mockClerkClient.sessions = [];
      (mockClerkClient as any).lastActiveSessionId = undefined;

      render(<ProfileSwitcherModal />);
      expect(screen.getByText('Tko danas uči?')).toBeInTheDocument();
      expect(screen.queryByText('Active on this tablet')).not.toBeInTheDocument();
    });
  });

  describe('6. Modal Dismissal and External Navigation', () => {
    it('closes modal when dismissed via zustand close()', () => {
      render(<ProfileSwitcherModal />);
      expect(screen.getByText('Tko danas uči?')).toBeInTheDocument();

      useProfileSwitcherModal.getState().close();
      expect(useProfileSwitcherModal.getState().isOpen).toBe(false);
    });

    it('closes modal and navigates to /qr-login when clicking Scan Student Badge', () => {
      render(<ProfileSwitcherModal />);

      const scanBtn = screen.getByRole('button', { name: /Scan Student Badge \/ QR Code/i });
      fireEvent.click(scanBtn);

      expect(useProfileSwitcherModal.getState().isOpen).toBe(false);
      expect(routerMock.push).toHaveBeenCalledWith('/qr-login');
    });

    it('closes modal and navigates to /admin when clicking Parent Center link', () => {
      render(<ProfileSwitcherModal />);

      const parentLink = screen.getByRole('button', { name: /Parent Center/i });
      fireEvent.click(parentLink);

      expect(useProfileSwitcherModal.getState().isOpen).toBe(false);
      expect(routerMock.push).toHaveBeenCalledWith('/admin');
    });
  });
});
