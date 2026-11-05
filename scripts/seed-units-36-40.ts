import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

interface OptionDef {
  text: string;
  correct: boolean;
  imageSrc?: string | null;
  audioSrc: string;
}

interface ChallengeDef {
  type: "SELECT" | "ASSIST";
  order: number;
  question: string;
  options: OptionDef[];
}

interface LessonDef {
  title: string;
  order: number;
  challenges: ChallengeDef[];
}

interface UnitDef {
  order: number;
  title: string;
  description: string;
  lessons: LessonDef[];
}

const unitsData: UnitDef[] = [
  // ==========================================
  // UNIT 36: NIKOLA TESLA I SVJETLOST (The Spark of Invention)
  // ==========================================
  {
    order: 36,
    title: "Unit 36",
    description: "Nikola Tesla i svjetlost (The Spark of Invention)",
    lessons: [
      {
        order: 1,
        title: "Iskra i svjetlost",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Light"?',
            options: [
              { text: "Svjetlost", correct: true, imageSrc: "/svjetlost.svg", audioSrc: "/audio/hr/svjetlost.mp3" },
              { text: "Iskra", correct: false, imageSrc: "/iskra.svg", audioSrc: "/audio/hr/iskra.mp3" },
              { text: "Struja", correct: false, imageSrc: "/struja.svg", audioSrc: "/audio/hr/struja.mp3" },
              { text: "Izum", correct: false, imageSrc: "/izum.svg", audioSrc: "/audio/hr/izum.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Spark"?',
            options: [
              { text: "Iskra", correct: true, imageSrc: "/iskra.svg", audioSrc: "/audio/hr/iskra.mp3" },
              { text: "Svjetlost", correct: false, imageSrc: "/svjetlost.svg", audioSrc: "/audio/hr/svjetlost.mp3" },
              { text: "Struja", correct: false, imageSrc: "/struja.svg", audioSrc: "/audio/hr/struja.mp3" },
              { text: "Izum", correct: false, imageSrc: "/izum.svg", audioSrc: "/audio/hr/izum.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Electricity"?',
            options: [
              { text: "Struja", correct: true, imageSrc: "/struja.svg", audioSrc: "/audio/hr/struja.mp3" },
              { text: "Svjetlost", correct: false, imageSrc: "/svjetlost.svg", audioSrc: "/audio/hr/svjetlost.mp3" },
              { text: "Iskra", correct: false, imageSrc: "/iskra.svg", audioSrc: "/audio/hr/iskra.mp3" },
              { text: "Izum", correct: false, imageSrc: "/izum.svg", audioSrc: "/audio/hr/izum.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Invention"?',
            options: [
              { text: "Izum", correct: true, imageSrc: "/izum.svg", audioSrc: "/audio/hr/izum.mp3" },
              { text: "Svjetlost", correct: false, imageSrc: "/svjetlost.svg", audioSrc: "/audio/hr/svjetlost.mp3" },
              { text: "Iskra", correct: false, imageSrc: "/iskra.svg", audioSrc: "/audio/hr/iskra.mp3" },
              { text: "Struja", correct: false, imageSrc: "/struja.svg", audioSrc: "/audio/hr/struja.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Opis izuma",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'How do you say "Bright light"?',
            options: [
              { text: "Svijetla svjetlost", correct: true, audioSrc: "/audio/hr/svijetla_svjetlost.mp3" },
              { text: "Mala iskra", correct: false, audioSrc: "/audio/hr/mala_iskra.mp3" },
              { text: "Električna struja", correct: false, audioSrc: "/audio/hr/elektricna_struja.mp3" },
              { text: "Važni izum", correct: false, audioSrc: "/audio/hr/vazni_izum.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'How do you say "Small spark"?',
            options: [
              { text: "Mala iskra", correct: true, audioSrc: "/audio/hr/mala_iskra.mp3" },
              { text: "Svijetla svjetlost", correct: false, audioSrc: "/audio/hr/svijetla_svjetlost.mp3" },
              { text: "Električna struja", correct: false, audioSrc: "/audio/hr/elektricna_struja.mp3" },
              { text: "Važni izum", correct: false, audioSrc: "/audio/hr/vazni_izum.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'How do you say "Electric current"?',
            options: [
              { text: "Električna struja", correct: true, audioSrc: "/audio/hr/elektricna_struja.mp3" },
              { text: "Svijetla svjetlost", correct: false, audioSrc: "/audio/hr/svijetla_svjetlost.mp3" },
              { text: "Mala iskra", correct: false, audioSrc: "/audio/hr/mala_iskra.mp3" },
              { text: "Važni izum", correct: false, audioSrc: "/audio/hr/vazni_izum.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'How do you say "Important invention"?',
            options: [
              { text: "Važni izum", correct: true, audioSrc: "/audio/hr/vazni_izum.mp3" },
              { text: "Svijetla svjetlost", correct: false, audioSrc: "/audio/hr/svijetla_svjetlost.mp3" },
              { text: "Mala iskra", correct: false, audioSrc: "/audio/hr/mala_iskra.mp3" },
              { text: "Električna struja", correct: false, audioSrc: "/audio/hr/elektricna_struja.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Rad s energijom",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'How do you say "To shine"?',
            options: [
              { text: "Svijetliti", correct: true, audioSrc: "/audio/hr/svijetliti.mp3" },
              { text: "Paliti", correct: false, audioSrc: "/audio/hr/paliti.mp3" },
              { text: "Promatrati", correct: false, audioSrc: "/audio/hr/promatrati.mp3" },
              { text: "Otkriti", correct: false, audioSrc: "/audio/hr/otkriti.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'How do you say "To turn on"?',
            options: [
              { text: "Paliti", correct: true, audioSrc: "/audio/hr/paliti.mp3" },
              { text: "Svijetliti", correct: false, audioSrc: "/audio/hr/svijetliti.mp3" },
              { text: "Promatrati", correct: false, audioSrc: "/audio/hr/promatrati.mp3" },
              { text: "Otkriti", correct: false, audioSrc: "/audio/hr/otkriti.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'How do you say "The lamp shines."?',
            options: [
              { text: "Lampa svijetli.", correct: true, audioSrc: "/audio/hr/lampa_svijetli.mp3" },
              { text: "Palim svjetlo.", correct: false, audioSrc: "/audio/hr/palim_svjetlo.mp3" },
              { text: "Tesla stvara iskre.", correct: false, audioSrc: "/audio/hr/tesla_stvara_iskre.mp3" },
              { text: "Struja teče kroz žicu.", correct: false, audioSrc: "/audio/hr/struja_tece_kroz_zicu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'How do you say "I turn on the light."?',
            options: [
              { text: "Palim svjetlo.", correct: true, audioSrc: "/audio/hr/palim_svjetlo.mp3" },
              { text: "Lampa svijetli.", correct: false, audioSrc: "/audio/hr/lampa_svijetli.mp3" },
              { text: "Tesla stvara iskre.", correct: false, audioSrc: "/audio/hr/tesla_stvara_iskre.mp3" },
              { text: "Struja teče kroz žicu.", correct: false, audioSrc: "/audio/hr/struja_tece_kroz_zicu.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Smiljan i genij",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'How do you say "Tesla creates sparks."?',
            options: [
              { text: "Tesla stvara iskre.", correct: true, audioSrc: "/audio/hr/tesla_stvara_iskre.mp3" },
              { text: "Struja teče kroz žicu.", correct: false, audioSrc: "/audio/hr/struja_tece_kroz_zicu.mp3" },
              { text: "Nikola Tesla je slavni izumitelj.", correct: false, audioSrc: "/audio/hr/nikola_tesla_je_slavni_izumitelj.mp3" },
              { text: "Svjetlost obasjava sobu.", correct: false, audioSrc: "/audio/hr/svjetlost_obasjava_sobu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'How do you say "Electricity flows through the wire."?',
            options: [
              { text: "Struja teče kroz žicu.", correct: true, audioSrc: "/audio/hr/struja_tece_kroz_zicu.mp3" },
              { text: "Tesla stvara iskre.", correct: false, audioSrc: "/audio/hr/tesla_stvara_iskre.mp3" },
              { text: "Nikola Tesla je slavni izumitelj.", correct: false, audioSrc: "/audio/hr/nikola_tesla_je_slavni_izumitelj.mp3" },
              { text: "Svjetlost obasjava sobu.", correct: false, audioSrc: "/audio/hr/svjetlost_obasjava_sobu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'How do you say "Nikola Tesla is a famous inventor."?',
            options: [
              { text: "Nikola Tesla je slavni izumitelj.", correct: true, audioSrc: "/audio/hr/nikola_tesla_je_slavni_izumitelj.mp3" },
              { text: "Tesla stvara iskre.", correct: false, audioSrc: "/audio/hr/tesla_stvara_iskre.mp3" },
              { text: "Struja teče kroz žicu.", correct: false, audioSrc: "/audio/hr/struja_tece_kroz_zicu.mp3" },
              { text: "Svjetlost obasjava sobu.", correct: false, audioSrc: "/audio/hr/svjetlost_obasjava_sobu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'How do you say "Light illuminates the room."?',
            options: [
              { text: "Svjetlost obasjava sobu.", correct: true, audioSrc: "/audio/hr/svjetlost_obasjava_sobu.mp3" },
              { text: "Nikola Tesla je slavni izumitelj.", correct: false, audioSrc: "/audio/hr/nikola_tesla_je_slavni_izumitelj.mp3" },
              { text: "Struja teče kroz žicu.", correct: false, audioSrc: "/audio/hr/struja_tece_kroz_zicu.mp3" },
              { text: "Tesla stvara iskre.", correct: false, audioSrc: "/audio/hr/tesla_stvara_iskre.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 37: NOĆNO NEBO I ZVIJEZDE (The Night Sky & Stars)
  // ==========================================
  {
    order: 37,
    title: "Unit 37",
    description: "Noćno nebo i zvijezde (The Night Sky & Stars)",
    lessons: [
      {
        order: 1,
        title: "Zvijezde i mjesec",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Star"?',
            options: [
              { text: "Zvijezda", correct: true, imageSrc: "/zvijezda.svg", audioSrc: "/audio/hr/zvijezda.mp3" },
              { text: "Nebo", correct: false, imageSrc: "/nebo.svg", audioSrc: "/audio/hr/nebo.mp3" },
              { text: "Mjesec", correct: false, imageSrc: "/mjesec.svg", audioSrc: "/audio/hr/mjesec.mp3" },
              { text: "Sjaj", correct: false, imageSrc: "/sjaj.svg", audioSrc: "/audio/hr/sjaj.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Sky"?',
            options: [
              { text: "Nebo", correct: true, imageSrc: "/nebo.svg", audioSrc: "/audio/hr/nebo.mp3" },
              { text: "Zvijezda", correct: false, imageSrc: "/zvijezda.svg", audioSrc: "/audio/hr/zvijezda.mp3" },
              { text: "Mjesec", correct: false, imageSrc: "/mjesec.svg", audioSrc: "/audio/hr/mjesec.mp3" },
              { text: "Sjaj", correct: false, imageSrc: "/sjaj.svg", audioSrc: "/audio/hr/sjaj.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Moon"?',
            options: [
              { text: "Mjesec", correct: true, imageSrc: "/mjesec.svg", audioSrc: "/audio/hr/mjesec.mp3" },
              { text: "Nebo", correct: false, imageSrc: "/nebo.svg", audioSrc: "/audio/hr/nebo.mp3" },
              { text: "Zvijezda", correct: false, imageSrc: "/zvijezda.svg", audioSrc: "/audio/hr/zvijezda.mp3" },
              { text: "Sjaj", correct: false, imageSrc: "/sjaj.svg", audioSrc: "/audio/hr/sjaj.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Shine"?',
            options: [
              { text: "Sjaj", correct: true, imageSrc: "/sjaj.svg", audioSrc: "/audio/hr/sjaj.mp3" },
              { text: "Nebo", correct: false, imageSrc: "/nebo.svg", audioSrc: "/audio/hr/nebo.mp3" },
              { text: "Zvijezda", correct: false, imageSrc: "/zvijezda.svg", audioSrc: "/audio/hr/zvijezda.mp3" },
              { text: "Mjesec", correct: false, imageSrc: "/mjesec.svg", audioSrc: "/audio/hr/mjesec.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Sjaj u tami",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'How do you say "Bright star"?',
            options: [
              { text: "Sjajna zvijezda", correct: true, audioSrc: "/audio/hr/sjajna_zvijezda.mp3" },
              { text: "Tamno nebo", correct: false, audioSrc: "/audio/hr/tamno_nebo.mp3" },
              { text: "Puni mjesec", correct: false, audioSrc: "/audio/hr/puni_mjesec.mp3" },
              { text: "Zlatni sjaj", correct: false, audioSrc: "/audio/hr/zlatni_sjaj.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'How do you say "Dark sky"?',
            options: [
              { text: "Tamno nebo", correct: true, audioSrc: "/audio/hr/tamno_nebo.mp3" },
              { text: "Sjajna zvijezda", correct: false, audioSrc: "/audio/hr/sjajna_zvijezda.mp3" },
              { text: "Puni mjesec", correct: false, audioSrc: "/audio/hr/puni_mjesec.mp3" },
              { text: "Zlatni sjaj", correct: false, audioSrc: "/audio/hr/zlatni_sjaj.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'How do you say "Full moon"?',
            options: [
              { text: "Puni mjesec", correct: true, audioSrc: "/audio/hr/puni_mjesec.mp3" },
              { text: "Sjajna zvijezda", correct: false, audioSrc: "/audio/hr/sjajna_zvijezda.mp3" },
              { text: "Tamno nebo", correct: false, audioSrc: "/audio/hr/tamno_nebo.mp3" },
              { text: "Zlatni sjaj", correct: false, audioSrc: "/audio/hr/zlatni_sjaj.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'How do you say "Golden glow"?',
            options: [
              { text: "Zlatni sjaj", correct: true, audioSrc: "/audio/hr/zlatni_sjaj.mp3" },
              { text: "Sjajna zvijezda", correct: false, audioSrc: "/audio/hr/sjajna_zvijezda.mp3" },
              { text: "Tamno nebo", correct: false, audioSrc: "/audio/hr/tamno_nebo.mp3" },
              { text: "Puni mjesec", correct: false, audioSrc: "/audio/hr/puni_mjesec.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Pogled gore",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'How do you say "The stars shine."?',
            options: [
              { text: "Zvijezde sjaje.", correct: true, audioSrc: "/audio/hr/zvijezde_sjaje.mp3" },
              { text: "Noćno nebo je tamno.", correct: false, audioSrc: "/audio/hr/nocno_nebo_je_tamno.mp3" },
              { text: "Gledam u nebo.", correct: false, audioSrc: "/audio/hr/gledam_u_nebo.mp3" },
              { text: "Mjesec sja noću.", correct: false, audioSrc: "/audio/hr/mjesec_sja_nocu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'How do you say "The night sky is dark."?',
            options: [
              { text: "Noćno nebo je tamno.", correct: true, audioSrc: "/audio/hr/nocno_nebo_je_tamno.mp3" },
              { text: "Zvijezde sjaje.", correct: false, audioSrc: "/audio/hr/zvijezde_sjaje.mp3" },
              { text: "Gledam u nebo.", correct: false, audioSrc: "/audio/hr/gledam_u_nebo.mp3" },
              { text: "Mjesec sja noću.", correct: false, audioSrc: "/audio/hr/mjesec_sja_nocu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'How do you say "I look at the sky."?',
            options: [
              { text: "Gledam u nebo.", correct: true, audioSrc: "/audio/hr/gledam_u_nebo.mp3" },
              { text: "Zvijezde sjaje.", correct: false, audioSrc: "/audio/hr/zvijezde_sjaje.mp3" },
              { text: "Noćno nebo je tamno.", correct: false, audioSrc: "/audio/hr/nocno_nebo_je_tamno.mp3" },
              { text: "Mjesec sja noću.", correct: false, audioSrc: "/audio/hr/mjesec_sja_nocu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'How do you say "The moon shines at night."?',
            options: [
              { text: "Mjesec sja noću.", correct: true, audioSrc: "/audio/hr/mjesec_sja_nocu.mp3" },
              { text: "Zvijezde sjaje.", correct: false, audioSrc: "/audio/hr/zvijezde_sjaje.mp3" },
              { text: "Noćno nebo je tamno.", correct: false, audioSrc: "/audio/hr/nocno_nebo_je_tamno.mp3" },
              { text: "Gledam u nebo.", correct: false, audioSrc: "/audio/hr/gledam_u_nebo.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Beskrajna noć",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'How do you say "A thousand shining stars."?',
            options: [
              { text: "Tisuću sjajnih zvijezda.", correct: true, audioSrc: "/audio/hr/tisucu_sjajnih_zvijezda.mp3" },
              { text: "Nebo je puno zvijezda.", correct: false, audioSrc: "/audio/hr/nebo_je_puno_zvijezda.mp3" },
              { text: "Noćno nebo je tamno.", correct: false, audioSrc: "/audio/hr/nocno_nebo_je_tamno.mp3" },
              { text: "Mjesec sja noću.", correct: false, audioSrc: "/audio/hr/mjesec_sja_nocu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'How do you say "The sky is full of stars."?',
            options: [
              { text: "Nebo je puno zvijezda.", correct: true, audioSrc: "/audio/hr/nebo_je_puno_zvijezda.mp3" },
              { text: "Tisuću sjajnih zvijezda.", correct: false, audioSrc: "/audio/hr/tisucu_sjajnih_zvijezda.mp3" },
              { text: "Noćno nebo je tamno.", correct: false, audioSrc: "/audio/hr/nocno_nebo_je_tamno.mp3" },
              { text: "Mjesec sja noću.", correct: false, audioSrc: "/audio/hr/mjesec_sja_nocu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the statement: "The night sky is dark."',
            options: [
              { text: "Noćno nebo je tamno.", correct: true, audioSrc: "/audio/hr/nocno_nebo_je_tamno.mp3" },
              { text: "Nebo je puno zvijezda.", correct: false, audioSrc: "/audio/hr/nebo_je_puno_zvijezda.mp3" },
              { text: "Tisuću sjajnih zvijezda.", correct: false, audioSrc: "/audio/hr/tisucu_sjajnih_zvijezda.mp3" },
              { text: "Mjesec sja noću.", correct: false, audioSrc: "/audio/hr/mjesec_sja_nocu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the statement: "The moon shines at night."',
            options: [
              { text: "Mjesec sja noću.", correct: true, audioSrc: "/audio/hr/mjesec_sja_nocu.mp3" },
              { text: "Nebo je puno zvijezda.", correct: false, audioSrc: "/audio/hr/nebo_je_puno_zvijezda.mp3" },
              { text: "Tisuću sjajnih zvijezda.", correct: false, audioSrc: "/audio/hr/tisucu_sjajnih_zvijezda.mp3" },
              { text: "Noćno nebo je tamno.", correct: false, audioSrc: "/audio/hr/nocno_nebo_je_tamno.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 38: ZVJEZDARNICA I PLANETI (The Observatory & Planets)
  // ==========================================
  {
    order: 38,
    title: "Unit 38",
    description: "Zvjezdarnica i planeti (The Observatory & Planets)",
    lessons: [
      {
        order: 1,
        title: "Teleskop i svemir",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Telescope"?',
            options: [
              { text: "Teleskop", correct: true, imageSrc: "/teleskop.svg", audioSrc: "/audio/hr/teleskop.mp3" },
              { text: "Planet", correct: false, imageSrc: "/planet.svg", audioSrc: "/audio/hr/planet.mp3" },
              { text: "Svemir", correct: false, imageSrc: "/svemir.svg", audioSrc: "/audio/hr/svemir.mp3" },
              { text: "Kupola", correct: false, imageSrc: "/kupola.svg", audioSrc: "/audio/hr/kupola.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Planet"?',
            options: [
              { text: "Planet", correct: true, imageSrc: "/planet.svg", audioSrc: "/audio/hr/planet.mp3" },
              { text: "Teleskop", correct: false, imageSrc: "/teleskop.svg", audioSrc: "/audio/hr/teleskop.mp3" },
              { text: "Svemir", correct: false, imageSrc: "/svemir.svg", audioSrc: "/audio/hr/svemir.mp3" },
              { text: "Kupola", correct: false, imageSrc: "/kupola.svg", audioSrc: "/audio/hr/kupola.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Universe"?',
            options: [
              { text: "Svemir", correct: true, imageSrc: "/svemir.svg", audioSrc: "/audio/hr/svemir.mp3" },
              { text: "Planet", correct: false, imageSrc: "/planet.svg", audioSrc: "/audio/hr/planet.mp3" },
              { text: "Teleskop", correct: false, imageSrc: "/teleskop.svg", audioSrc: "/audio/hr/teleskop.mp3" },
              { text: "Kupola", correct: false, imageSrc: "/kupola.svg", audioSrc: "/audio/hr/kupola.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Dome"?',
            options: [
              { text: "Kupola", correct: true, imageSrc: "/kupola.svg", audioSrc: "/audio/hr/kupola.mp3" },
              { text: "Planet", correct: false, imageSrc: "/planet.svg", audioSrc: "/audio/hr/planet.mp3" },
              { text: "Teleskop", correct: false, imageSrc: "/teleskop.svg", audioSrc: "/audio/hr/teleskop.mp3" },
              { text: "Svemir", correct: false, imageSrc: "/svemir.svg", audioSrc: "/audio/hr/svemir.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Pogled u dubinu",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'How do you say "Big telescope"?',
            options: [
              { text: "Veliki teleskop", correct: true, audioSrc: "/audio/hr/veliki_teleskop.mp3" },
              { text: "Daleki planet", correct: false, audioSrc: "/audio/hr/daleki_planet.mp3" },
              { text: "Beskrajni svemir", correct: false, audioSrc: "/audio/hr/beskrajni_svemir.mp3" },
              { text: "Bijela kupola", correct: false, audioSrc: "/audio/hr/bijela_kupola.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'How do you say "Distant planet"?',
            options: [
              { text: "Daleki planet", correct: true, audioSrc: "/audio/hr/daleki_planet.mp3" },
              { text: "Veliki teleskop", correct: false, audioSrc: "/audio/hr/veliki_teleskop.mp3" },
              { text: "Beskrajni svemir", correct: false, audioSrc: "/audio/hr/beskrajni_svemir.mp3" },
              { text: "Bijela kupola", correct: false, audioSrc: "/audio/hr/bijela_kupola.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'How do you say "Endless universe"?',
            options: [
              { text: "Beskrajni svemir", correct: true, audioSrc: "/audio/hr/beskrajni_svemir.mp3" },
              { text: "Veliki teleskop", correct: false, audioSrc: "/audio/hr/veliki_teleskop.mp3" },
              { text: "Daleki planet", correct: false, audioSrc: "/audio/hr/daleki_planet.mp3" },
              { text: "Bijela kupola", correct: false, audioSrc: "/audio/hr/bijela_kupola.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'How do you say "White dome"?',
            options: [
              { text: "Bijela kupola", correct: true, audioSrc: "/audio/hr/bijela_kupola.mp3" },
              { text: "Veliki teleskop", correct: false, audioSrc: "/audio/hr/veliki_teleskop.mp3" },
              { text: "Daleki planet", correct: false, audioSrc: "/audio/hr/daleki_planet.mp3" },
              { text: "Beskrajni svemir", correct: false, audioSrc: "/audio/hr/beskrajni_svemir.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Istraživanje neba",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'How do you say "To observe"?',
            options: [
              { text: "Promatrati", correct: true, audioSrc: "/audio/hr/promatrati.mp3" },
              { text: "Otkriti", correct: false, audioSrc: "/audio/hr/otkriti.mp3" },
              { text: "Svijetliti", correct: false, audioSrc: "/audio/hr/svijetliti.mp3" },
              { text: "Paliti", correct: false, audioSrc: "/audio/hr/paliti.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'How do you say "To discover"?',
            options: [
              { text: "Otkriti", correct: true, audioSrc: "/audio/hr/otkriti.mp3" },
              { text: "Promatrati", correct: false, audioSrc: "/audio/hr/promatrati.mp3" },
              { text: "Svijetliti", correct: false, audioSrc: "/audio/hr/svijetliti.mp3" },
              { text: "Paliti", correct: false, audioSrc: "/audio/hr/paliti.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'How do you say "I look through the telescope."?',
            options: [
              { text: "Gledam kroz teleskop.", correct: true, audioSrc: "/audio/hr/gledam_kroz_teleskop.mp3" },
              { text: "Otkrivamo novi planet.", correct: false, audioSrc: "/audio/hr/otkrivamo_novi_planet.mp3" },
              { text: "Kupola se otvara.", correct: false, audioSrc: "/audio/hr/kupola_se_otvara.mp3" },
              { text: "Promatramo tajne svemira.", correct: false, audioSrc: "/audio/hr/promatramo_tajne_svemira.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'How do you say "We are discovering a new planet."?',
            options: [
              { text: "Otkrivamo novi planet.", correct: true, audioSrc: "/audio/hr/otkrivamo_novi_planet.mp3" },
              { text: "Gledam kroz teleskop.", correct: false, audioSrc: "/audio/hr/gledam_kroz_teleskop.mp3" },
              { text: "Kupola se otvara.", correct: false, audioSrc: "/audio/hr/kupola_se_otvara.mp3" },
              { text: "Promatramo tajne svemira.", correct: false, audioSrc: "/audio/hr/promatramo_tajne_svemira.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Višnjan zvjezdarnica",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'How do you say "The Višnjan Observatory is famous."?',
            options: [
              { text: "Zvjezdarnica Višnjan je poznata.", correct: true, audioSrc: "/audio/hr/zvjezdarnica_visnjan_je_poznata.mp3" },
              { text: "Kupola se otvara.", correct: false, audioSrc: "/audio/hr/kupola_se_otvara.mp3" },
              { text: "Promatramo tajne svemira.", correct: false, audioSrc: "/audio/hr/promatramo_tajne_svemira.mp3" },
              { text: "Otkrivamo novi planet.", correct: false, audioSrc: "/audio/hr/otkrivamo_novi_planet.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'How do you say "The dome is opening."?',
            options: [
              { text: "Kupola se otvara.", correct: true, audioSrc: "/audio/hr/kupola_se_otvara.mp3" },
              { text: "Zvjezdarnica Višnjan je poznata.", correct: false, audioSrc: "/audio/hr/zvjezdarnica_visnjan_je_poznata.mp3" },
              { text: "Promatramo tajne svemira.", correct: false, audioSrc: "/audio/hr/promatramo_tajne_svemira.mp3" },
              { text: "Otkrivamo novi planet.", correct: false, audioSrc: "/audio/hr/otkrivamo_novi_planet.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'How do you say "We observe the secrets of the universe."?',
            options: [
              { text: "Promatramo tajne svemira.", correct: true, audioSrc: "/audio/hr/promatramo_tajne_svemira.mp3" },
              { text: "Zvjezdarnica Višnjan je poznata.", correct: false, audioSrc: "/audio/hr/zvjezdarnica_visnjan_je_poznata.mp3" },
              { text: "Kupola se otvara.", correct: false, audioSrc: "/audio/hr/kupola_se_otvara.mp3" },
              { text: "Otkrivamo novi planet.", correct: false, audioSrc: "/audio/hr/otkrivamo_novi_planet.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the statement: "We are discovering a new planet."',
            options: [
              { text: "Otkrivamo novi planet.", correct: true, audioSrc: "/audio/hr/otkrivamo_novi_planet.mp3" },
              { text: "Zvjezdarnica Višnjan je poznata.", correct: false, audioSrc: "/audio/hr/zvjezdarnica_visnjan_je_poznata.mp3" },
              { text: "Kupola se otvara.", correct: false, audioSrc: "/audio/hr/kupola_se_otvara.mp3" },
              { text: "Promatramo tajne svemira.", correct: false, audioSrc: "/audio/hr/promatramo_tajne_svemira.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 39: GROM, MUNJA I SNAGA PRIRODE (Thunder & Lightning)
  // ==========================================
  {
    order: 39,
    title: "Unit 39",
    description: "Grom, munja i snaga prirode (Thunder & Lightning)",
    lessons: [
      {
        order: 1,
        title: "Snaga oluje",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Lightning"?',
            options: [
              { text: "Munja", correct: true, imageSrc: "/munja.svg", audioSrc: "/audio/hr/munja.mp3" },
              { text: "Grom", correct: false, imageSrc: "/grom.svg", audioSrc: "/audio/hr/grom.mp3" },
              { text: "Baterija", correct: false, imageSrc: "/baterija.svg", audioSrc: "/audio/hr/baterija.mp3" },
              { text: "Snaga", correct: false, imageSrc: "/snaga.svg", audioSrc: "/audio/hr/snaga.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Thunder"?',
            options: [
              { text: "Grom", correct: true, imageSrc: "/grom.svg", audioSrc: "/audio/hr/grom.mp3" },
              { text: "Munja", correct: false, imageSrc: "/munja.svg", audioSrc: "/audio/hr/munja.mp3" },
              { text: "Baterija", correct: false, imageSrc: "/baterija.svg", audioSrc: "/audio/hr/baterija.mp3" },
              { text: "Snaga", correct: false, imageSrc: "/snaga.svg", audioSrc: "/audio/hr/snaga.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Battery"?',
            options: [
              { text: "Baterija", correct: true, imageSrc: "/baterija.svg", audioSrc: "/audio/hr/baterija.mp3" },
              { text: "Munja", correct: false, imageSrc: "/munja.svg", audioSrc: "/audio/hr/munja.mp3" },
              { text: "Grom", correct: false, imageSrc: "/grom.svg", audioSrc: "/audio/hr/grom.mp3" },
              { text: "Snaga", correct: false, imageSrc: "/snaga.svg", audioSrc: "/audio/hr/snaga.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Power"?',
            options: [
              { text: "Snaga", correct: true, imageSrc: "/snaga.svg", audioSrc: "/audio/hr/snaga.mp3" },
              { text: "Munja", correct: false, imageSrc: "/munja.svg", audioSrc: "/audio/hr/munja.mp3" },
              { text: "Grom", correct: false, imageSrc: "/grom.svg", audioSrc: "/audio/hr/grom.mp3" },
              { text: "Baterija", correct: false, imageSrc: "/baterija.svg", audioSrc: "/audio/hr/baterija.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Glasno i snažno",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'How do you say "Powerful lightning"?',
            options: [
              { text: "Snažna munja", correct: true, audioSrc: "/audio/hr/snazna_munja.mp3" },
              { text: "Glasni grom", correct: false, audioSrc: "/audio/hr/glasni_grom.mp3" },
              { text: "Puna baterija", correct: false, audioSrc: "/audio/hr/puna_baterija.mp3" },
              { text: "Velika snaga", correct: false, audioSrc: "/audio/hr/velika_snaga.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'How do you say "Loud thunder"?',
            options: [
              { text: "Glasni grom", correct: true, audioSrc: "/audio/hr/glasni_grom.mp3" },
              { text: "Snažna munja", correct: false, audioSrc: "/audio/hr/snazna_munja.mp3" },
              { text: "Puna baterija", correct: false, audioSrc: "/audio/hr/puna_baterija.mp3" },
              { text: "Velika snaga", correct: false, audioSrc: "/audio/hr/velika_snaga.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'How do you say "Full battery"?',
            options: [
              { text: "Puna baterija", correct: true, audioSrc: "/audio/hr/puna_baterija.mp3" },
              { text: "Snažna munja", correct: false, audioSrc: "/audio/hr/snazna_munja.mp3" },
              { text: "Glasni grom", correct: false, audioSrc: "/audio/hr/glasni_grom.mp3" },
              { text: "Velika snaga", correct: false, audioSrc: "/audio/hr/velika_snaga.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'How do you say "Great power"?',
            options: [
              { text: "Velika snaga", correct: true, audioSrc: "/audio/hr/velika_snaga.mp3" },
              { text: "Snažna munja", correct: false, audioSrc: "/audio/hr/snazna_munja.mp3" },
              { text: "Glasni grom", correct: false, audioSrc: "/audio/hr/glasni_grom.mp3" },
              { text: "Puna baterija", correct: false, audioSrc: "/audio/hr/puna_baterija.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Zvukovi neba",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'How do you say "Lightning illuminates the sky."?',
            options: [
              { text: "Munja obasjava nebo.", correct: true, audioSrc: "/audio/hr/munja_obasjava_nebo.mp3" },
              { text: "Čujemo glasni grom.", correct: false, audioSrc: "/audio/hr/cujemo_glasni_grom.mp3" },
              { text: "Oluja dolazi.", correct: false, audioSrc: "/audio/hr/oluja_dolazi.mp3" },
              { text: "Punimo bateriju.", correct: false, audioSrc: "/audio/hr/punimo_bateriju.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'How do you say "We hear loud thunder."?',
            options: [
              { text: "Čujemo glasni grom.", correct: true, audioSrc: "/audio/hr/cujemo_glasni_grom.mp3" },
              { text: "Munja obasjava nebo.", correct: false, audioSrc: "/audio/hr/munja_obasjava_nebo.mp3" },
              { text: "Oluja dolazi.", correct: false, audioSrc: "/audio/hr/oluja_dolazi.mp3" },
              { text: "Punimo bateriju.", correct: false, audioSrc: "/audio/hr/punimo_bateriju.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'How do you say "The storm is coming."?',
            options: [
              { text: "Oluja dolazi.", correct: true, audioSrc: "/audio/hr/oluja_dolazi.mp3" },
              { text: "Munja obasjava nebo.", correct: false, audioSrc: "/audio/hr/munja_obasjava_nebo.mp3" },
              { text: "Čujemo glasni grom.", correct: false, audioSrc: "/audio/hr/cujemo_glasni_grom.mp3" },
              { text: "Punimo bateriju.", correct: false, audioSrc: "/audio/hr/punimo_bateriju.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'How do you say "We are charging the battery."?',
            options: [
              { text: "Punimo bateriju.", correct: true, audioSrc: "/audio/hr/punimo_bateriju.mp3" },
              { text: "Munja obasjava nebo.", correct: false, audioSrc: "/audio/hr/munja_obasjava_nebo.mp3" },
              { text: "Čujemo glasni grom.", correct: false, audioSrc: "/audio/hr/cujemo_glasni_grom.mp3" },
              { text: "Oluja dolazi.", correct: false, audioSrc: "/audio/hr/oluja_dolazi.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Snaga prirodnih sila",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'How do you say "Nature has great power."?',
            options: [
              { text: "Priroda ima veliku snagu.", correct: true, audioSrc: "/audio/hr/priroda_ima_veliku_snagu.mp3" },
              { text: "Tesla istražuje munje.", correct: false, audioSrc: "/audio/hr/tesla_istrazuje_munje.mp3" },
              { text: "Munja obasjava nebo.", correct: false, audioSrc: "/audio/hr/munja_obasjava_nebo.mp3" },
              { text: "Čujemo glasni grom.", correct: false, audioSrc: "/audio/hr/cujemo_glasni_grom.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'How do you say "Tesla researches lightning."?',
            options: [
              { text: "Tesla istražuje munje.", correct: true, audioSrc: "/audio/hr/tesla_istrazuje_munje.mp3" },
              { text: "Priroda ima veliku snagu.", correct: false, audioSrc: "/audio/hr/priroda_ima_veliku_snagu.mp3" },
              { text: "Munja obasjava nebo.", correct: false, audioSrc: "/audio/hr/munja_obasjava_nebo.mp3" },
              { text: "Čujemo glasni grom.", correct: false, audioSrc: "/audio/hr/cujemo_glasni_grom.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the statement: "Lightning illuminates the sky."',
            options: [
              { text: "Munja obasjava nebo.", correct: true, audioSrc: "/audio/hr/munja_obasjava_nebo.mp3" },
              { text: "Priroda ima veliku snagu.", correct: false, audioSrc: "/audio/hr/priroda_ima_veliku_snagu.mp3" },
              { text: "Tesla istražuje munje.", correct: false, audioSrc: "/audio/hr/tesla_istrazuje_munje.mp3" },
              { text: "Čujemo glasni grom.", correct: false, audioSrc: "/audio/hr/cujemo_glasni_grom.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the statement: "We hear loud thunder."',
            options: [
              { text: "Čujemo glasni grom.", correct: true, audioSrc: "/audio/hr/cujemo_glasni_grom.mp3" },
              { text: "Priroda ima veliku snagu.", correct: false, audioSrc: "/audio/hr/priroda_ima_veliku_snagu.mp3" },
              { text: "Tesla istražuje munje.", correct: false, audioSrc: "/audio/hr/tesla_istrazuje_munje.mp3" },
              { text: "Munja obasjava nebo.", correct: false, audioSrc: "/audio/hr/munja_obasjava_nebo.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 40: IZUMITELJI BUDUĆNOSTI (Futur I Capstone)
  // ==========================================
  {
    order: 40,
    title: "Unit 40",
    description: "Izumitelji budućnosti (The Future of Inventions)",
    lessons: [
      {
        order: 1,
        title: "Roboti i ideje",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Robot"?',
            options: [
              { text: "Robot", correct: true, imageSrc: "/robot.svg", audioSrc: "/audio/hr/robot.mp3" },
              { text: "Ideja", correct: false, imageSrc: "/ideja.svg", audioSrc: "/audio/hr/ideja.mp3" },
              { text: "Znanje", correct: false, imageSrc: "/znanje.svg", audioSrc: "/audio/hr/znanje.mp3" },
              { text: "Budućnost", correct: false, imageSrc: "/buducnost.svg", audioSrc: "/audio/hr/buducnost.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Idea"?',
            options: [
              { text: "Ideja", correct: true, imageSrc: "/ideja.svg", audioSrc: "/audio/hr/ideja.mp3" },
              { text: "Robot", correct: false, imageSrc: "/robot.svg", audioSrc: "/audio/hr/robot.mp3" },
              { text: "Znanje", correct: false, imageSrc: "/znanje.svg", audioSrc: "/audio/hr/znanje.mp3" },
              { text: "Budućnost", correct: false, imageSrc: "/buducnost.svg", audioSrc: "/audio/hr/buducnost.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Knowledge"?',
            options: [
              { text: "Znanje", correct: true, imageSrc: "/znanje.svg", audioSrc: "/audio/hr/znanje.mp3" },
              { text: "Robot", correct: false, imageSrc: "/robot.svg", audioSrc: "/audio/hr/robot.mp3" },
              { text: "Ideja", correct: false, imageSrc: "/ideja.svg", audioSrc: "/audio/hr/ideja.mp3" },
              { text: "Budućnost", correct: false, imageSrc: "/buducnost.svg", audioSrc: "/audio/hr/buducnost.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Future"?',
            options: [
              { text: "Budućnost", correct: true, imageSrc: "/buducnost.svg", audioSrc: "/audio/hr/buducnost.mp3" },
              { text: "Robot", correct: false, imageSrc: "/robot.svg", audioSrc: "/audio/hr/robot.mp3" },
              { text: "Ideja", correct: false, imageSrc: "/ideja.svg", audioSrc: "/audio/hr/ideja.mp3" },
              { text: "Znanje", correct: false, imageSrc: "/znanje.svg", audioSrc: "/audio/hr/znanje.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Vizija sutrašnjice",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'How do you say "Smart robot"?',
            options: [
              { text: "Pametni robot", correct: true, audioSrc: "/audio/hr/pametni_robot.mp3" },
              { text: "Dobra ideja", correct: false, audioSrc: "/audio/hr/dobra_ideja.mp3" },
              { text: "Važno znanje", correct: false, audioSrc: "/audio/hr/vazno_znanje.mp3" },
              { text: "Svijetla budućnost", correct: false, audioSrc: "/audio/hr/svijetla_buducnost.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'How do you say "Good idea"?',
            options: [
              { text: "Dobra ideja", correct: true, audioSrc: "/audio/hr/dobra_ideja.mp3" },
              { text: "Pametni robot", correct: false, audioSrc: "/audio/hr/pametni_robot.mp3" },
              { text: "Važno znanje", correct: false, audioSrc: "/audio/hr/vazno_znanje.mp3" },
              { text: "Svijetla budućnost", correct: false, audioSrc: "/audio/hr/svijetla_buducnost.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'How do you say "Important knowledge"?',
            options: [
              { text: "Važno znanje", correct: true, audioSrc: "/audio/hr/vazno_znanje.mp3" },
              { text: "Pametni robot", correct: false, audioSrc: "/audio/hr/pametni_robot.mp3" },
              { text: "Dobra ideja", correct: false, audioSrc: "/audio/hr/dobra_ideja.mp3" },
              { text: "Svijetla budućnost", correct: false, audioSrc: "/audio/hr/svijetla_buducnost.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'How do you say "Bright future"?',
            options: [
              { text: "Svijetla budućnost", correct: true, audioSrc: "/audio/hr/svijetla_buducnost.mp3" },
              { text: "Pametni robot", correct: false, audioSrc: "/audio/hr/pametni_robot.mp3" },
              { text: "Dobra ideja", correct: false, audioSrc: "/audio/hr/dobra_ideja.mp3" },
              { text: "Važno znanje", correct: false, audioSrc: "/audio/hr/vazno_znanje.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Glagoli u budućnosti (Futur I)",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'How do you say "We will learn."?',
            options: [
              { text: "Učit ćemo.", correct: true, audioSrc: "/audio/hr/ucit_cemo.mp3" },
              { text: "Gledat ćemo.", correct: false, audioSrc: "/audio/hr/gledat_cemo.mp3" },
              { text: "Putovat ćemo.", correct: false, audioSrc: "/audio/hr/putovat_cemo.mp3" },
              { text: "Izumit ćemo.", correct: false, audioSrc: "/audio/hr/izumit_cemo.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'How do you say "We will watch."?',
            options: [
              { text: "Gledat ćemo.", correct: true, audioSrc: "/audio/hr/gledat_cemo.mp3" },
              { text: "Učit ćemo.", correct: false, audioSrc: "/audio/hr/ucit_cemo.mp3" },
              { text: "Putovat ćemo.", correct: false, audioSrc: "/audio/hr/putovat_cemo.mp3" },
              { text: "Izumit ćemo.", correct: false, audioSrc: "/audio/hr/izumit_cemo.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'How do you say "We will travel."?',
            options: [
              { text: "Putovat ćemo.", correct: true, audioSrc: "/audio/hr/putovat_cemo.mp3" },
              { text: "Učit ćemo.", correct: false, audioSrc: "/audio/hr/ucit_cemo.mp3" },
              { text: "Gledat ćemo.", correct: false, audioSrc: "/audio/hr/gledat_cemo.mp3" },
              { text: "Izumit ćemo.", correct: false, audioSrc: "/audio/hr/izumit_cemo.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'How do you say "We will invent."?',
            options: [
              { text: "Izumit ćemo.", correct: true, audioSrc: "/audio/hr/izumit_cemo.mp3" },
              { text: "Učit ćemo.", correct: false, audioSrc: "/audio/hr/ucit_cemo.mp3" },
              { text: "Gledat ćemo.", correct: false, audioSrc: "/audio/hr/gledat_cemo.mp3" },
              { text: "Putovat ćemo.", correct: false, audioSrc: "/audio/hr/putovat_cemo.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Put u budućnost",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'How do you say "We will learn about the universe."?',
            options: [
              { text: "Učit ćemo o svemiru.", correct: true, audioSrc: "/audio/hr/ucit_cemo_o_svemiru.mp3" },
              { text: "Gledat ćemo zvijezde.", correct: false, audioSrc: "/audio/hr/gledat_cemo_zvijezde.mp3" },
              { text: "Putovat ćemo u svemir.", correct: false, audioSrc: "/audio/hr/putovat_cemo_u_svemir.mp3" },
              { text: "Izumit ćemo nove stvari.", correct: false, audioSrc: "/audio/hr/izumit_cemo_nove_stvari.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'How do you say "We will watch the stars."?',
            options: [
              { text: "Gledat ćemo zvijezde.", correct: true, audioSrc: "/audio/hr/gledat_cemo_zvijezde.mp3" },
              { text: "Učit ćemo o svemiru.", correct: false, audioSrc: "/audio/hr/ucit_cemo_o_svemiru.mp3" },
              { text: "Putovat ćemo u svemir.", correct: false, audioSrc: "/audio/hr/putovat_cemo_u_svemir.mp3" },
              { text: "Izumit ćemo nove stvari.", correct: false, audioSrc: "/audio/hr/izumit_cemo_nove_stvari.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'How do you say "We will travel to space."?',
            options: [
              { text: "Putovat ćemo u svemir.", correct: true, audioSrc: "/audio/hr/putovat_cemo_u_svemir.mp3" },
              { text: "Učit ćemo o svemiru.", correct: false, audioSrc: "/audio/hr/ucit_cemo_o_svemiru.mp3" },
              { text: "Gledat ćemo zvijezde.", correct: false, audioSrc: "/audio/hr/gledat_cemo_zvijezde.mp3" },
              { text: "Izumit ćemo nove stvari.", correct: false, audioSrc: "/audio/hr/izumit_cemo_nove_stvari.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the capstone graduation motto: "Congratulations, you finished the eighth world!"',
            options: [
              { text: "Čestitamo, završili ste osmi svijet!", correct: true, audioSrc: "/audio/hr/cestitamo_zavrsili_ste_osmi_svijet.mp3" },
              { text: "Zajedno ćemo graditi bolju budućnost!", correct: false, audioSrc: "/audio/hr/zajedno_cemo_graditi_bolju_buducnost.mp3" },
              { text: "Znanje je naša najveća snaga!", correct: false, audioSrc: "/audio/hr/znanje_je_nasa_najveca_snaga.mp3" },
              { text: "Ponosno koračamo kroz svijet znanosti!", correct: false, audioSrc: "/audio/hr/ponosno_koracamo_kroz_svijet_znanosti.mp3" },
            ],
          },
        ],
      },
    ],
  },
];

async function seedWorld8() {
  console.log("=== ⚡ SEEDING WORLD 8: NIKOLA TESLA & ASTRONOMY (UNITS 36-40) ===\n");

  const courseResult = await sql`SELECT id FROM courses WHERE id = 1 LIMIT 1;`;
  if (courseResult.length === 0) {
    throw new Error("Course ID 1 not found!");
  }
  const courseId = courseResult[0].id;
  console.log(`Target Course ID: ${courseId}`);

  for (const unit of unitsData) {
    console.log(`\nProcessing Unit ${unit.order}: "${unit.title} - ${unit.description}"...`);

    const existingUnit = await sql`
      SELECT id FROM units WHERE course_id = ${courseId} AND "order" = ${unit.order};
    `;

    let unitId: number;
    if (existingUnit.length > 0) {
      unitId = existingUnit[0].id;
      await sql`
        UPDATE units 
        SET title = ${unit.title}, description = ${unit.description}
        WHERE id = ${unitId};
      `;
      console.log(`  Updated Unit record ID: ${unitId}`);
    } else {
      const inserted = await sql`
        INSERT INTO units (title, description, course_id, "order")
        VALUES (${unit.title}, ${unit.description}, ${courseId}, ${unit.order})
        RETURNING id;
      `;
      unitId = inserted[0].id;
      console.log(`  Created Unit record ID: ${unitId}`);
    }

    for (const lesson of unit.lessons) {
      console.log(`  Processing Lesson ${lesson.order}: "${lesson.title}"...`);
      const existingLesson = await sql`
        SELECT id FROM lessons WHERE unit_id = ${unitId} AND "order" = ${lesson.order};
      `;
      let lessonId: number;
      if (existingLesson.length > 0) {
        lessonId = existingLesson[0].id;
        await sql`
          UPDATE lessons SET title = ${lesson.title} WHERE id = ${lessonId};
        `;
      } else {
        const inserted = await sql`
          INSERT INTO lessons (title, unit_id, "order")
          VALUES (${lesson.title}, ${unitId}, ${lesson.order})
          RETURNING id;
        `;
        lessonId = inserted[0].id;
      }

      for (const challenge of lesson.challenges) {
        const existingChallenge = await sql`
          SELECT id FROM challenges WHERE lesson_id = ${lessonId} AND "order" = ${challenge.order};
        `;
        let challengeId: number;
        if (existingChallenge.length > 0) {
          challengeId = existingChallenge[0].id;
          await sql`
            UPDATE challenges 
            SET type = ${challenge.type}, question = ${challenge.question}
            WHERE id = ${challengeId};
          `;
          await sql`DELETE FROM challenge_options WHERE challenge_id = ${challengeId};`;
        } else {
          const inserted = await sql`
            INSERT INTO challenges (lesson_id, type, question, "order")
            VALUES (${lessonId}, ${challenge.type}, ${challenge.question}, ${challenge.order})
            RETURNING id;
          `;
          challengeId = inserted[0].id;
        }

        // Insert options
        for (const opt of challenge.options) {
          await sql`
            INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
            VALUES (${challengeId}, ${opt.text}, ${opt.correct}, ${opt.imageSrc || null}, ${opt.audioSrc});
          `;
        }
      }
    }
  }

  console.log("\n✅ WORLD 8 SEEDED SUCCESSFULLY!");
}

seedWorld8().then(() => process.exit(0)).catch(e => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
