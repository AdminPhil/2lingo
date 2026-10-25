/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Challenge } from '@/app/lesson/challenge';
import { Card } from '@/app/lesson/card';
import * as ttsModule from '@/lib/tts';

describe('Challenge & Card Component Suite', () => {
  const mockOptions = [
    {
      id: 1,
      challengeId: 101,
      text: 'Gdje se nalazi najbliža ljekarna i pošta?',
      correct: true,
      imageSrc: null,
      audioSrc: null,
    },
    {
      id: 2,
      challengeId: 101,
      text: 'Molim vas, račun za kavu i topli čaj.',
      correct: false,
      imageSrc: null,
      audioSrc: null,
    },
    {
      id: 3,
      challengeId: 101,
      text: 'Dobar dan, kako ste vi danas?',
      correct: false,
      imageSrc: null,
      audioSrc: null,
    },
    {
      id: 4,
      challengeId: 101,
      text: 'Hvala lijepa i do viđenja!',
      correct: false,
      imageSrc: null,
      audioSrc: null,
    },
  ];

  describe('<Challenge /> Layout & Grid Architecture', () => {
    it('renders a 2x2 grid on sm+ screens for SELECT challenges without images', () => {
      const handleSelect = vi.fn();
      const { container } = render(
        <Challenge
          options={mockOptions}
          onSelect={handleSelect}
          status="none"
          selectedOption={undefined}
          disabled={false}
          type="SELECT"
        />
      );

      const gridContainer = container.firstElementChild as HTMLElement;
      expect(gridContainer).toBeInTheDocument();
      // Grid container classes for SELECT without images:
      expect(gridContainer.className).toContain('grid');
      expect(gridContainer.className).toContain('grid-cols-1');
      expect(gridContainer.className).toContain('sm:grid-cols-2');
      expect(gridContainer.className).toContain('gap-2.5');

      // Verify all 4 options are rendered
      const cards = screen.getAllByTitle(/Keyboard shortcut:/i);
      expect(cards).toHaveLength(4);
    });

    it('renders responsive columns for SELECT challenges with images', () => {
      const optionsWithImages = mockOptions.map((opt) => ({
        ...opt,
        imageSrc: '/avatars/pasko.png',
      }));

      const { container } = render(
        <Challenge
          options={optionsWithImages}
          onSelect={vi.fn()}
          status="none"
          selectedOption={undefined}
          disabled={false}
          type="SELECT"
        />
      );

      const gridContainer = container.firstElementChild as HTMLElement;
      expect(gridContainer.className).toContain('grid-cols-2');
      expect(gridContainer.className).toContain('lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]');
    });

    it('renders single vertical column for ASSIST challenges', () => {
      const { container } = render(
        <Challenge
          options={mockOptions}
          onSelect={vi.fn()}
          status="none"
          selectedOption={undefined}
          disabled={false}
          type="ASSIST"
        />
      );

      const gridContainer = container.firstElementChild as HTMLElement;
      expect(gridContainer.className).toContain('grid-cols-1');
      expect(gridContainer.className).not.toContain('sm:grid-cols-2');
    });

    it('invokes onSelect with the corresponding option id when a card is clicked', () => {
      const handleSelect = vi.fn();
      render(
        <Challenge
          options={mockOptions}
          onSelect={handleSelect}
          status="none"
          selectedOption={undefined}
          disabled={false}
          type="SELECT"
        />
      );

      const cardOption = screen.getByText('Molim vas, račun za kavu i topli čaj.');
      fireEvent.click(cardOption);

      expect(handleSelect).toHaveBeenCalledTimes(1);
      expect(handleSelect).toHaveBeenCalledWith(2);
    });
  });

  describe('<Card /> Text Wrapping, Anti-Truncation & Visual States', () => {
    it('renders long Croatian phrases with break-words and ZERO truncate or text-ellipsis classes', () => {
      const longPhrase = 'Gdje se nalazi najbliža ljekarna i pošta?';
      render(
        <Card
          id={1}
          text={longPhrase}
          shortcut="1"
          imageSrc={null}
          audioSrc={null}
          onClick={vi.fn()}
          status="none"
          selected={false}
          type="SELECT"
        />
      );

      const phraseElement = screen.getByText(longPhrase);
      expect(phraseElement).toBeInTheDocument();
      expect(phraseElement.tagName).toBe('P');

      // Assert anti-truncation styling invariants
      const classList = Array.from(phraseElement.classList);
      expect(classList).toContain('break-words');
      expect(classList).not.toContain('truncate');
      expect(classList).not.toContain('text-ellipsis');
      expect(classList).not.toContain('overflow-hidden');
      expect(classList).not.toContain('whitespace-nowrap');
    });

    it('applies anti-truncation break-words to SELECT cards with images', () => {
      const phrase = 'Možete li mi, molim vas, preporučiti dobar tradicionalni restoran?';
      render(
        <Card
          id={2}
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

      const phraseElement = screen.getByText(phrase);
      expect(phraseElement.classList).toContain('break-words');
      expect(phraseElement.classList).not.toContain('truncate');
      expect(phraseElement.classList).not.toContain('text-ellipsis');
    });

    it('applies anti-truncation break-words to ASSIST cards', () => {
      const phrase = 'Hrvatska ima više od tisuću otoka duž prekrasnog Jadranskog mora.';
      render(
        <Card
          id={3}
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

      const phraseElement = screen.getByText(phrase);
      expect(phraseElement.classList).toContain('break-words');
      expect(phraseElement.classList).not.toContain('truncate');
      expect(phraseElement.classList).not.toContain('text-ellipsis');
    });

    it('displays hotkey shortcut badges (1, 2, 3, 4) with appropriate titles', () => {
      render(
        <Challenge
          options={mockOptions}
          onSelect={vi.fn()}
          status="none"
          selectedOption={undefined}
          disabled={false}
          type="SELECT"
        />
      );

      expect(screen.getByTitle('Keyboard shortcut: 1')).toHaveTextContent('1');
      expect(screen.getByTitle('Keyboard shortcut: 2')).toHaveTextContent('2');
      expect(screen.getByTitle('Keyboard shortcut: 3')).toHaveTextContent('3');
      expect(screen.getByTitle('Keyboard shortcut: 4')).toHaveTextContent('4');
    });

    it('renders unselected state with default neutral border and styling', () => {
      const { container } = render(
        <Card
          id={1}
          text="Dobar dan"
          shortcut="1"
          imageSrc={null}
          audioSrc={null}
          onClick={vi.fn()}
          status="none"
          selected={false}
          type="SELECT"
        />
      );

      const rootCard = container.firstElementChild as HTMLElement;
      expect(rootCard.className).not.toContain('border-sky-400');
      expect(rootCard.className).not.toContain('border-green-400');
      expect(rootCard.className).not.toContain('border-rose-400');
    });

    it('renders selected pending state with sky blue highlights', () => {
      const { container } = render(
        <Card
          id={1}
          text="Dobar dan"
          shortcut="1"
          imageSrc={null}
          audioSrc={null}
          onClick={vi.fn()}
          status="none"
          selected={true}
          type="SELECT"
        />
      );

      const rootCard = container.firstElementChild as HTMLElement;
      expect(rootCard.className).toContain('border-sky-400');
      expect(rootCard.className).toContain('bg-sky-50/70');

      const textElement = screen.getByText('Dobar dan');
      expect(textElement.className).toContain('text-sky-600');
    });

    it('renders correct verified state with green border, background, and badge', () => {
      const { container } = render(
        <Card
          id={1}
          text="Dobar dan"
          shortcut="1"
          imageSrc={null}
          audioSrc={null}
          onClick={vi.fn()}
          status="correct"
          selected={true}
          type="SELECT"
        />
      );

      const rootCard = container.firstElementChild as HTMLElement;
      expect(rootCard.className).toContain('border-green-400');
      expect(rootCard.className).toContain('bg-green-50/80');

      const textElement = screen.getByText('Dobar dan');
      expect(textElement.className).toContain('text-green-600');

      const badge = screen.getByTitle('Keyboard shortcut: 1');
      expect(badge.className).toContain('border-green-500');
      expect(badge.className).toContain('text-green-600');
    });

    it('renders wrong state with rose/red border, background, and badge', () => {
      const { container } = render(
        <Card
          id={1}
          text="Dobar dan"
          shortcut="1"
          imageSrc={null}
          audioSrc={null}
          onClick={vi.fn()}
          status="wrong"
          selected={true}
          type="SELECT"
        />
      );

      const rootCard = container.firstElementChild as HTMLElement;
      expect(rootCard.className).toContain('border-rose-400');
      expect(rootCard.className).toContain('bg-rose-50/80');

      const textElement = screen.getByText('Dobar dan');
      expect(textElement.className).toContain('text-rose-600');

      const badge = screen.getByTitle('Keyboard shortcut: 1');
      expect(badge.className).toContain('border-rose-500');
      expect(badge.className).toContain('text-rose-600');
    });

    it('disables interactions and suppresses onClick when disabled={true}', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Card
          id={1}
          text="Dobar dan"
          shortcut="1"
          imageSrc={null}
          audioSrc={null}
          onClick={handleClick}
          status="none"
          selected={false}
          disabled={true}
          type="SELECT"
        />
      );

      const rootCard = container.firstElementChild as HTMLElement;
      expect(rootCard.className).toContain('pointer-events-none');
      expect(rootCard.className).toContain('opacity-60');

      fireEvent.click(rootCard);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles read-aloud button click with event propagation stopped', () => {
      const speakSpy = vi.spyOn(ttsModule, 'speakText').mockImplementation(() => {});
      const handleCardClick = vi.fn();

      render(
        <Card
          id={1}
          text="Hvala lijepa"
          shortcut="1"
          imageSrc={null}
          audioSrc={null}
          onClick={handleCardClick}
          status="none"
          selected={false}
          type="SELECT"
        />
      );

      const audioBtn = screen.getByRole('button', { name: /Read aloud/i });
      fireEvent.click(audioBtn);

      // Card onClick should NOT be triggered due to stopPropagation()
      expect(handleCardClick).not.toHaveBeenCalled();
      // speakText should have been called with the Croatian text
      expect(speakSpy).toHaveBeenCalledWith('Hvala lijepa');
      speakSpy.mockRestore();
    });
  });
});
