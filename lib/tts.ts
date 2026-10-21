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
    window.speechSynthesis.cancel();

    // Clean up text if it contains quotes, punctuation or markdown
    const cleanText = text.replace(/["*#_`]/g, "").trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options?.rate ?? 0.85; // Clear, friendly pacing for kids
    utterance.pitch = options?.pitch ?? 1.1;

    let targetLang = options?.lang;
    if (!targetLang) {
      // Auto-detect Croatian words or special characters
      const isCroatian =
        /[čćšžđČĆŠŽĐ]/.test(cleanText) ||
        /\b(bok|molim|hvala|kako|dobro|dobar|dan|mama|tata|baka|djed|brat|sestra|dječak|djevojčica|pas|mačka|ptica|riba|krava|konj|svinja|patka|jedan|dva|tri|četiri|pet|šest|sedam|osam|devet|deset|jabuka|voda|mlijeko|sok|kruh|sladoled|čokolada|doviđenja|laku|noć|oprosti|gladan|gladna)\b/i.test(
          cleanText
        );
      targetLang = isCroatian ? "hr-HR" : "en-US";
    }

    utterance.lang = targetLang;

    // If available in the browser, pick a matching voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) =>
      v.lang.toLowerCase().startsWith(targetLang?.slice(0, 2).toLowerCase() || "hr")
    );
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("SpeechSynthesis error:", error);
  }
};
