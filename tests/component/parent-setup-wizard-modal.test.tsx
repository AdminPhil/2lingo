/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ParentSetupWizardModal } from '@/components/admin/parent-setup-wizard-modal';
import * as childAccountActions from '@/actions/child-account';
import * as podActions from '@/actions/pod';
import { toast } from 'sonner';

vi.mock('@/actions/child-account', () => ({
  createMultipleChildAccounts: vi.fn().mockImplementation((payload) =>
    Promise.resolve({
      success: true,
      created: payload.map((p: any, idx: number) => ({
        id: `child_${idx + 1}`,
        name: p.childName,
        username: p.username,
        password: p.password,
        userImageSrc: p.userImageSrc || '/avatars/pasko.png',
      })),
    })
  ),
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

describe('<ParentSetupWizardModal /> 4-Step Stepper & Pass Generation', () => {
  const defaultProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    podId: 10,
    podName: 'The Novak Family',
    inviteCode: 'NOVAK7',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // Radix UI Dialog renders via Portal into document.body
  const getProgressBar = () => {
    return document.body.querySelector('.bg-green-600.transition-all') as HTMLElement;
  };

  it('initializes on Step 1 with 25% progress bar and prefilled family circle name', () => {
    render(<ParentSetupWizardModal {...defaultProps} />);

    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    expect(screen.getByText('Name Your Family Circle')).toBeInTheDocument();

    const progressBar = getProgressBar();
    expect(progressBar).toBeInTheDocument();
    expect(progressBar.style.width).toBe('25%');

    const input = screen.getByPlaceholderText('e.g. The Novak Family') as HTMLInputElement;
    expect(input.value).toBe('The Novak Family');
  });

  it('transitions from Step 1 to Step 2 and updates progress bar to 50%', async () => {
    render(<ParentSetupWizardModal {...defaultProps} />);

    const continueBtn = screen.getByRole('button', { name: /Continue: Add Kids/i });
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
      expect(screen.getByText('Who is Learning Croatian?')).toBeInTheDocument();
      expect(getProgressBar().style.width).toBe('50%');
    });
  });

  it('updates family circle name via updatePodSettings on Step 1 when changed', async () => {
    render(<ParentSetupWizardModal {...defaultProps} />);

    const input = screen.getByPlaceholderText('e.g. The Novak Family');
    fireEvent.change(input, { target: { value: 'Dalmatian Dreamers' } });

    const continueBtn = screen.getByRole('button', { name: /Continue: Add Kids/i });
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(podActions.updatePodSettings).toHaveBeenCalledWith(10, {
        name: 'Dalmatian Dreamers',
        inviteCode: 'NOVAK7',
        targetXp: 1000,
      });
      expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
    });
  });

  it('allows sibling row additions up to 5 children and avatar selection', async () => {
    render(<ParentSetupWizardModal {...defaultProps} />);

    // Advance to Step 2
    fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
    await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

    // Initially 1 child row
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.queryByText('Child 2')).not.toBeInTheDocument();

    // Fill Child 1 Name
    const firstNameInput = screen.getByPlaceholderText('e.g. Luka or Mia');
    fireEvent.change(firstNameInput, { target: { value: 'Luka' } });

    // Choose Mascot Avatar for Child 1 (e.g. "Delfi")
    const delfiAvatarBtn = screen.getByRole('button', { name: /Delfi/i });
    fireEvent.click(delfiAvatarBtn);
    expect(delfiAvatarBtn.className).toContain('border-green-500');

    // Add 4 more siblings (reaching the maximum of 5)
    const addSiblingBtn = screen.getByRole('button', { name: /\+ Add Another Sibling/i });
    fireEvent.click(addSiblingBtn); // Child 2
    expect(screen.getByText('Child 2')).toBeInTheDocument();

    fireEvent.click(addSiblingBtn); // Child 3
    expect(screen.getByText('Child 3')).toBeInTheDocument();

    fireEvent.click(addSiblingBtn); // Child 4
    expect(screen.getByText('Child 4')).toBeInTheDocument();

    fireEvent.click(addSiblingBtn); // Child 5
    expect(screen.getByText('Child 5')).toBeInTheDocument();

    // At 5 children, the "+ Add Another Sibling" button should disappear
    expect(screen.queryByRole('button', { name: /\+ Add Another Sibling/i })).not.toBeInTheDocument();

    // Remove Child 5 via trash button
    const trashButtons = screen.getAllByTitle('Remove child');
    expect(trashButtons.length).toBe(5); // all 5 rows show trash button when length > 1
    fireEvent.click(trashButtons[trashButtons.length - 1]);

    // Now 4 children remain, and Add Sibling button reappears
    expect(screen.queryByText('Child 5')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ Add Another Sibling/i })).toBeInTheDocument();
  });

  it('creates child accounts and advances to Step 3 (75% progress) with Fridge Sheet', async () => {
    render(<ParentSetupWizardModal {...defaultProps} />);

    // Step 1 -> Step 2
    fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
    await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

    // Enter name for Child 1
    const nameInput = screen.getByPlaceholderText('e.g. Luka or Mia');
    fireEvent.change(nameInput, { target: { value: 'Luka' } });

    // Submit Step 2
    const submitBtn = screen.getByRole('button', { name: /Create Accounts & Get Passes/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(childAccountActions.createMultipleChildAccounts).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Step 3 of 4')).toBeInTheDocument();
      expect(getProgressBar().style.width).toBe('75%');
      expect(screen.getByText(/Your Student Fast Passes Are Ready!/i)).toBeInTheDocument();
      expect(screen.getByText('🇭🇷 CroLingo Pass')).toBeInTheDocument();
      expect(screen.getByText('Luka')).toBeInTheDocument();
    });
  });

  it('triggers window.print() and copies links to clipboard on Step 3', async () => {
    render(<ParentSetupWizardModal {...defaultProps} />);

    // Advance to Step 3
    fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
    await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('e.g. Luka or Mia'), { target: { value: 'Mia' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Accounts & Get Passes/i }));

    await waitFor(() => expect(screen.getByText('Step 3 of 4')).toBeInTheDocument());

    // Test Print Sheet
    const printBtn = screen.getByRole('button', { name: /Print Refrigerator Sheet/i });
    fireEvent.click(printBtn);
    expect(window.print).toHaveBeenCalledTimes(1);

    // Test Copy Links
    const copyBtn = screen.getByRole('button', { name: /Copy Login Links/i });
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith('All student login links copied to clipboard!');
  });

  it('navigates from Step 3 to Step 4 (100% progress) and completes handoff', async () => {
    const onOpenChange = vi.fn();
    render(<ParentSetupWizardModal {...defaultProps} onOpenChange={onOpenChange} />);

    // Fast-forward to Step 3
    fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
    await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText('e.g. Luka or Mia'), { target: { value: 'Matija' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Accounts & Get Passes/i }));
    await waitFor(() => expect(screen.getByText('Step 3 of 4')).toBeInTheDocument());

    // Advance to Step 4
    const nextTabletBtn = screen.getByRole('button', { name: /Next: Tablet Setup/i });
    fireEvent.click(nextTabletBtn);

    expect(screen.getByText('Step 4 of 4')).toBeInTheDocument();
    expect(getProgressBar().style.width).toBe('100%');
    expect(screen.getByText(/How to Hand Off to Your Kids/i)).toBeInTheDocument();
    expect(screen.getByText('Instant Camera Scan')).toBeInTheDocument();
    expect(screen.getByText('1-Tap Profile Switcher')).toBeInTheDocument();

    // Click Finish: "Go to Parent Dashboard →"
    const finishBtn = screen.getByRole('button', { name: /Go to Parent Dashboard →/i });
    fireEvent.click(finishBtn);

    expect(localStorage.getItem('parent_wizard_completed')).toBe('true');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('allows stepping back from Step 2 to Step 1 and Step 3 to Step 2', async () => {
    render(<ParentSetupWizardModal {...defaultProps} />);

    // Step 1 -> Step 2
    fireEvent.click(screen.getByRole('button', { name: /Continue: Add Kids/i }));
    await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeInTheDocument());

    // Back to Step 1
    const backBtn = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backBtn);
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    expect(getProgressBar().style.width).toBe('25%');
  });
});
