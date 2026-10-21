"use client";

import Image from "next/image";
import { Volume2 } from "lucide-react";
import { speakText } from "@/lib/tts";

type Props = {
  question: string;
};

export const QuestionBubble = ({ question }: Props) => {
  const onSpeak = () => {
    speakText(question);
  };

  return (
    <div className="flex items-center gap-x-4 mb-6">
      <button
        type="button"
        onClick={onSpeak}
        title="Tap mascot to hear question"
        className="focus:outline-none hover:scale-105 active:scale-95 transition cursor-pointer"
      >
        <Image
          src="/mascot.svg"
          alt="Mascot"
          height={60}
          width={60}
          className="hidden lg:block"
        />
        <Image
          src="/mascot.svg"
          alt="Mascot"
          height={40}
          width={40}
          className="block lg:hidden"
        />
      </button>
      <div className="relative py-2 px-4 border-2 rounded-xl text-sm lg:text-base flex items-center gap-x-3 bg-white">
        <span>{question}</span>
        <button
          type="button"
          onClick={onSpeak}
          className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-green-600 transition shrink-0"
          title="Listen to question"
          aria-label="Listen to question"
        >
          <Volume2 className="h-5 w-5" />
        </button>
        <div
          className="absolute -left-3 top-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-y-1/2 rotate-90"
        />
      </div>
    </div>
  );
};
