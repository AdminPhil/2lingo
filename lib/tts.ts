export const speakText = (
  text: string,
  options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
  }
) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  try {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Clean up text if it contains quotes or markdown
    const cleanText = text.replace(/["*#_`]/g, "").trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options?.rate ?? 0.9; // Friendly, clear pacing for kids
    utterance.pitch = options?.pitch ?? 1.1; // Slightly warmer/friendly pitch
    if (options?.lang) {
      utterance.lang = options.lang;
    }

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("SpeechSynthesis error:", error);
  }
};
