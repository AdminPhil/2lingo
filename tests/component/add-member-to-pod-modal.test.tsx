/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddMemberToPodModal } from '@/components/admin/add-member-to-pod-modal';
import * as podActions from '@/actions/pod';
import { toast } from 'sonner';

vi.mock('@/actions/pod', () => ({
  adminAddUsersToPod: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('<AddMemberToPodModal /> State Machine & Selection Logic', () => {
  const sampleUsers = [
    { userId: 'user_luka', userName: 'Luka Horvat', userImageSrc: '/avatars/luka.png' },
    { userId: 'user_mia', userName: 'Mia Kovačić', userImageSrc: '/avatars/mia.png' },
    { userId: 'user_matija', userName: 'Matija Babić', userImageSrc: '/avatars/matija.png' },
    { userId: 'user_ana', userName: 'Ana Jurić', userImageSrc: '/avatars/ana.png' },
  ];

  const defaultProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    podId: 42,
    podName: 'Adriatic Explorers',
    existingMemberIds: ['user_ana'], // Ana is already in the pod
    availableUsers: sampleUsers,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal header, description, and user options', () => {
    render(<AddMemberToPodModal {...defaultProps} />);

    expect(screen.getByText('Add User to Pod')).toBeInTheDocument();
    expect(screen.getByText(/Assign any registered learner or parent to/i)).toBeInTheDocument();
    expect(screen.getByText('Adriatic Explorers')).toBeInTheDocument();

    expect(screen.getByText('Luka Horvat')).toBeInTheDocument();
    expect(screen.getByText('Mia Kovačić')).toBeInTheDocument();
    expect(screen.getByText('Matija Babić')).toBeInTheDocument();
    expect(screen.getByText('Ana Jurić')).toBeInTheDocument();
  });

  it('identifies and disables existing pod members with "In Pod" badge', () => {
    render(<AddMemberToPodModal {...defaultProps} />);

    // Ana is an existing member
    const inPodBadge = screen.getByText('In Pod');
    expect(inPodBadge).toBeInTheDocument();

    // The button corresponding to Ana should be disabled
    const anaButton = inPodBadge.closest('button');
    expect(anaButton).toBeDisabled();
  });

  it('toggles squircle checkbox selection when clicking eligible users', () => {
    render(<AddMemberToPodModal {...defaultProps} />);

    // Initially 0 selected, no counter badge
    expect(screen.queryByText(/selected/i)).not.toBeInTheDocument();

    // Click Luka Horvat
    const lukaButton = screen.getByText('Luka Horvat').closest('button');
    expect(lukaButton).not.toBeNull();
    fireEvent.click(lukaButton!);

    // Live counter badge should appear: "1 selected"
    expect(screen.getByText('1 selected')).toBeInTheDocument();

    // Click Mia Kovačić
    const miaButton = screen.getByText('Mia Kovačić').closest('button');
    fireEvent.click(miaButton!);

    // Live counter badge should update to "2 selected"
    expect(screen.getByText('2 selected')).toBeInTheDocument();

    // Click Luka again to deselect
    fireEvent.click(lukaButton!);

    // Live counter badge should drop to "1 selected"
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });

  it('executes "Select All" and "Deselect All" toggle logic for eligible users', () => {
    render(<AddMemberToPodModal {...defaultProps} />);

    // There are 3 eligible users (Luka, Mia, Matija), since Ana is already in pod
    const selectAllBtn = screen.getByRole('button', { name: 'Select All' });
    expect(selectAllBtn).toBeInTheDocument();

    // Click "Select All"
    fireEvent.click(selectAllBtn);

    // Should now show "3 selected" (only eligible users)
    expect(screen.getByText('3 selected')).toBeInTheDocument();

    // Button label toggles to "Deselect All"
    expect(screen.getByRole('button', { name: 'Deselect All' })).toBeInTheDocument();

    // Click "Deselect All"
    const deselectAllBtn = screen.getByRole('button', { name: 'Deselect All' });
    fireEvent.click(deselectAllBtn);

    // Counter badge disappears and label returns to "Select All"
    expect(screen.queryByText(/selected/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select All' })).toBeInTheDocument();
  });

  it('updates dynamic footer submit button text and disabled state based on count', () => {
    render(<AddMemberToPodModal {...defaultProps} />);

    // 0 selected: disabled with text "Add to Pod"
    const submitBtn = screen.getByRole('button', { name: 'Add to Pod' });
    expect(submitBtn).toBeDisabled();

    // Select 1 user (Luka)
    fireEvent.click(screen.getByText('Luka Horvat').closest('button')!);
    expect(submitBtn).toBeEnabled();
    expect(submitBtn).toHaveTextContent('Add to Pod');

    // Select 2nd user (Mia)
    fireEvent.click(screen.getByText('Mia Kovačić').closest('button')!);
    expect(screen.getByRole('button', { name: 'Add 2 Users to Pod' })).toBeEnabled();

    // Select 3rd user (Matija)
    fireEvent.click(screen.getByText('Matija Babić').closest('button')!);
    expect(screen.getByRole('button', { name: 'Add 3 Users to Pod' })).toBeEnabled();

    // Deselect all
    fireEvent.click(screen.getByRole('button', { name: 'Deselect All' }));
    const resetSubmitBtn = screen.getByRole('button', { name: 'Add to Pod' });
    expect(resetSubmitBtn).toBeDisabled();
  });

  it('allows role selection toggle between Learner and Pod Admin', () => {
    render(<AddMemberToPodModal {...defaultProps} />);

    const learnerRoleBtn = screen.getByRole('button', { name: /Learner/i });
    const adminRoleBtn = screen.getByRole('button', { name: /Pod Admin/i });

    expect(learnerRoleBtn.className).toContain('border-green-500');

    fireEvent.click(adminRoleBtn);
    expect(adminRoleBtn.className).toContain('border-blue-500');
    expect(learnerRoleBtn.className).not.toContain('border-green-500');
  });

  it('submits selected user IDs to adminAddUsersToPod and triggers success toast', async () => {
    const onOpenChange = vi.fn();
    render(<AddMemberToPodModal {...defaultProps} onOpenChange={onOpenChange} />);

    // Select Luka and Mia
    fireEvent.click(screen.getByText('Luka Horvat').closest('button')!);
    fireEvent.click(screen.getByText('Mia Kovačić').closest('button')!);

    // Choose Pod Admin role
    fireEvent.click(screen.getByRole('button', { name: /Pod Admin/i }));

    const submitBtn = screen.getByRole('button', { name: 'Add 2 Users to Pod' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(podActions.adminAddUsersToPod).toHaveBeenCalledWith(
        42,
        ['user_luka', 'user_mia'],
        'admin'
      );
      expect(toast.success).toHaveBeenCalledWith(
        'Added 2 users to Adriatic Explorers as Pod Admin!'
      );
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('filters users via the search input and handles empty results', () => {
    render(<AddMemberToPodModal {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search by name or ID...');
    fireEvent.change(searchInput, { target: { value: 'Horvat' } });

    expect(screen.getByText('Luka Horvat')).toBeInTheDocument();
    expect(screen.queryByText('Mia Kovačić')).not.toBeInTheDocument();

    // Type non-existent query
    fireEvent.change(searchInput, { target: { value: 'NonExistentName' } });
    expect(screen.getByText(/No users found matching/i)).toBeInTheDocument();
  });

  it('invokes onOpenChange(false) when clicking Cancel', () => {
    const onOpenChange = vi.fn();
    render(<AddMemberToPodModal {...defaultProps} onOpenChange={onOpenChange} />);

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
