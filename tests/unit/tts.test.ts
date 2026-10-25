import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { speakText } from "@/lib/tts";

describe("lib/tts.ts - Speech Synthesis & Croatian Language Detection", () => {
  describe("Node / SSR Safety Guard", () => {
    it("safely exits early without throwing when window is undefined", () => {
      expect(typeof window).toBe("undefined");
      expect(() => speakText("Bok")).not.toThrow();
      expect(speakText("Dobro jutro")).toBeUndefined();
    });
  });

  describe("Text Cleaning & Sanitization Logic", () => {
    const clean = (text: string) => text.replace(/["*#_`]/g, "").trim();

    it("strips double quotes, markdown bold, italics, headers, and code backticks", () => {
      expect(clean('**"Bok!"**')).toBe("Bok!");
      expect(clean("# Jabuka")).toBe("Jabuka");
      expect(clean("`pas` and *mačka*")).toBe("pas and mačka");
      expect(clean('___"Dobar dan"___')).toBe("Dobar dan");
    });

    it("trims extraneous whitespace", () => {
      expect(clean("   hvala   ")).toBe("hvala");
      expect(clean("\n\tmolim\n")).toBe("molim");
    });
  });

  describe("Croatian Language Auto-Detection Regex", () => {
    const isCroatianText = (cleanText: string): boolean => {
      return (
        /[čćšžđČĆŠŽĐ]/.test(cleanText) ||
        /\b(bok|molim|hvala|kako|dobro|dobar|dan|mama|tata|baka|djed|brat|sestra|dječak|djevojčica|pas|mačka|ptica|riba|krava|konj|svinja|patka|jedan|dva|tri|četiri|pet|šest|sedam|osam|devet|deset|jabuka|voda|mlijeko|sok|kruh|sladoled|čokolada|doviđenja|laku|noć|oprosti|gladan|gladna)\b/i.test(
          cleanText
        )
      );
    };

    it("detects special Croatian diacritic letters (č, ć, š, ž, đ)", () => {
      expect(isCroatianText("kuća")).toBe(true);
      expect(isCroatianText("mačka")).toBe(true);
      expect(isCroatianText("šuma")).toBe(true);
      expect(isCroatianText("život")).toBe(true);
      expect(isCroatianText("đak")).toBe(true);

      // Uppercase diacritics
      expect(isCroatianText("ČOKOLADA")).toBe(true);
      expect(isCroatianText("ŠKOLA")).toBe(true);
      expect(isCroatianText("ĐURĐEVAC")).toBe(true);
      expect(isCroatianText("ŽELJEZNICA")).toBe(true);
    });

    it("detects canonical Croatian vocabulary words", () => {
      const croatianWords = [
        "bok",
        "molim",
        "hvala",
        "kako",
        "dobro",
        "dobar",
        "dan",
        "mama",
        "tata",
        "baka",
        "djed",
        "brat",
        "sestra",
        "pas",
        "riba",
        "krava",
        "konj",
        "patka",
        "jedan",
        "dva",
        "tri",
        "pet",
        "deset",
        "jabuka",
        "voda",
        "mlijeko",
        "sok",
        "kruh",
        "sladoled",
        "doviđenja",
        "laku",
        "oprosti",
        "gladan",
        "gladna",
      ];

      for (const word of croatianWords) {
        expect(isCroatianText(word), `Expected "${word}" to be recognized as Croatian`).toBe(true);
        expect(isCroatianText(`To je ${word}.`)).toBe(true);
      }
    });

    it("is case-insensitive for Croatian keywords", () => {
      expect(isCroatianText("BOK")).toBe(true);
      expect(isCroatianText("HVALA")).toBe(true);
      expect(isCroatianText("MOLIM")).toBe(true);
      expect(isCroatianText("Dobar Dan")).toBe(true);
    });

    it("identifies pure English phrases as non-Croatian (en-US fallback)", () => {
      expect(isCroatianText("Hello world")).toBe(false);
      expect(isCroatianText("Select the correct answer")).toBe(false);
      expect(isCroatianText("Welcome to the quiz")).toBe(false);
      expect(isCroatianText("Apple, water, milk")).toBe(false);
      expect(isCroatianText("Good morning")).toBe(false);
    });
  });

  describe("Browser Synthesis Simulation (Mocked DOM)", () => {
    let originalWindow: any;
    let mockCancel: any;
    let mockSpeak: any;
    let mockGetVoices: any;
    let spokenUtterances: any[];

    beforeEach(() => {
      spokenUtterances = [];
      mockCancel = vi.fn();
      mockSpeak = vi.fn((utterance) => spokenUtterances.push(utterance));
      mockGetVoices = vi.fn(() => [
        { lang: "hr-HR", name: "Croatian Voice" },
        { lang: "en-US", name: "English Voice" },
      ]);

      class MockSpeechSynthesisUtterance {
        text: string;
        lang: string = "";
        rate: number = 1;
        pitch: number = 1;
        voice: any = null;

        constructor(text: string) {
          this.text = text;
        }
      }

      // Temporarily mock global window and SpeechSynthesis
      originalWindow = (global as any).window;
      (global as any).window = {
        speechSynthesis: {
          cancel: mockCancel,
          speak: mockSpeak,
          getVoices: mockGetVoices,
        },
      };
      (global as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
    });

    afterEach(() => {
      (global as any).window = originalWindow;
      delete (global as any).SpeechSynthesisUtterance;
    });

    it("cancels previous speech and speaks Croatian utterance with hr-HR and child-friendly defaults", () => {
      speakText("Bok, ja sam Vinko!");

      expect(mockCancel).toHaveBeenCalledTimes(1);
      expect(mockSpeak).toHaveBeenCalledTimes(1);

      const utterance = spokenUtterances[0];
      expect(utterance.text).toBe("Bok, ja sam Vinko!");
      expect(utterance.lang).toBe("hr-HR");
      expect(utterance.rate).toBe(0.85); // kid-friendly pacing
      expect(utterance.pitch).toBe(1.1);
      expect(utterance.voice?.lang).toBe("hr-HR");
    });

    it("sets en-US for English phrases when no explicit lang is provided", () => {
      speakText("Welcome to the quiz!");

      expect(mockSpeak).toHaveBeenCalledTimes(1);
      const utterance = spokenUtterances[0];
      expect(utterance.lang).toBe("en-US");
      expect(utterance.voice?.lang).toBe("en-US");
    });

    it("honors custom rate, pitch, and explicit lang overrides", () => {
      speakText("Hello", { lang: "hr-HR", rate: 0.7, pitch: 1.3 });

      const utterance = spokenUtterances[0];
      expect(utterance.lang).toBe("hr-HR");
      expect(utterance.rate).toBe(0.7);
      expect(utterance.pitch).toBe(1.3);
    });

    it("does nothing when text reduces to an empty string after cleaning", () => {
      speakText('  "***"  ');
      expect(mockCancel).toHaveBeenCalledTimes(1);
      expect(mockSpeak).not.toHaveBeenCalled();
    });
  });
});
