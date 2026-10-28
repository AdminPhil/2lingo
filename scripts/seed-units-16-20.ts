import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

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
  // UNIT 16: U ŠKOLI I UČIONICI
  // ==========================================
  {
    order: 16,
    title: "Unit 16",
    description: "U školi i učionici (At School & Learning)",
    lessons: [
      {
        order: 1,
        title: "Školske stvari",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "School"?',
            options: [
              { text: "Škola", correct: true, audioSrc: "/audio/hr/skola.mp3" },
              { text: "Kuća", correct: false, audioSrc: "/audio/hr/kuca.mp3" },
              { text: "Park", correct: false, audioSrc: "/audio/hr/park.mp3" },
              { text: "Soba", correct: false, audioSrc: "/audio/hr/soba.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Pencil"?',
            options: [
              { text: "Olovka", correct: true, audioSrc: "/audio/hr/olovka.mp3" },
              { text: "Knjiga", correct: false, audioSrc: "/audio/hr/knjiga.mp3" },
              { text: "Torba", correct: false, audioSrc: "/audio/hr/torba.mp3" },
              { text: "Lopta", correct: false, audioSrc: "/audio/hr/lopta.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Notebook"?',
            options: [
              { text: "Bilježnica", correct: true, audioSrc: "/audio/hr/biljeznica.mp3" },
              { text: "Olovka", correct: false, audioSrc: "/audio/hr/olovka.mp3" },
              { text: "Jabuka", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
              { text: "Cipela", correct: false, audioSrc: "/audio/hr/cipele.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Backpack / Bag"',
            options: [
              { text: "Torba", correct: true, audioSrc: "/audio/hr/torba.mp3" },
              { text: "Kapa", correct: false, audioSrc: "/audio/hr/kapa.mp3" },
              { text: "Majica", correct: false, audioSrc: "/audio/hr/majica.mp3" },
              { text: "Knjiga", correct: false, audioSrc: "/audio/hr/knjiga.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Učionica i prijatelji",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Teacher"?',
            options: [
              { text: "Učiteljica", correct: true, audioSrc: "/audio/hr/uciteljica.mp3" },
              { text: "Djevojčica", correct: false, audioSrc: "/audio/hr/djevojcica.mp3" },
              { text: "Mama", correct: false, audioSrc: "/audio/hr/mama.mp3" },
              { text: "Sestra", correct: false, audioSrc: "/audio/hr/sestra.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Friend"?',
            options: [
              { text: "Prijatelj", correct: true, audioSrc: "/audio/hr/prijatelj.mp3" },
              { text: "Dječak", correct: false, audioSrc: "/audio/hr/djecak.mp3" },
              { text: "Brat", correct: false, audioSrc: "/audio/hr/brat.mp3" },
              { text: "Tata", correct: false, audioSrc: "/audio/hr/tata.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Classroom"?',
            options: [
              { text: "Razred", correct: true, audioSrc: "/audio/hr/razred.mp3" },
              { text: "Soba", correct: false, audioSrc: "/audio/hr/soba.mp3" },
              { text: "Park", correct: false, audioSrc: "/audio/hr/park.mp3" },
              { text: "Vrt", correct: false, audioSrc: "/audio/hr/vrt.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"I write"',
            options: [
              { text: "Pišem", correct: true, audioSrc: "/audio/hr/pisem.mp3" },
              { text: "Čitam", correct: false, audioSrc: "/audio/hr/citam.mp3" },
              { text: "Crtam", correct: false, audioSrc: "/audio/hr/crtam.mp3" },
              { text: "Pjevam", correct: false, audioSrc: "/audio/hr/pjevam.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Učimo zajedno",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"Let\'s go to school"',
            options: [
              { text: "Idemo u školu", correct: true, audioSrc: "/audio/hr/idemo_u_skolu.mp3" },
              { text: "Idemo u park", correct: false, audioSrc: "/audio/hr/idemo_u_park.mp3" },
              { text: "Idemo u sobu", correct: false, audioSrc: "/audio/hr/idemo_u_sobu.mp3" },
              { text: "Idemo na more", correct: false, audioSrc: "/audio/hr/more.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"I have a pencil"',
            options: [
              { text: "Imam olovku", correct: true, audioSrc: "/audio/hr/imam_olovku.mp3" },
              { text: "Imam knjigu", correct: false, audioSrc: "/audio/hr/imam_knjigu.mp3" },
              { text: "Imam loptu", correct: false, audioSrc: "/audio/hr/lopta.mp3" },
              { text: "Imam torbu", correct: false, audioSrc: "/audio/hr/torba.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"My friend"',
            options: [
              { text: "Moj prijatelj", correct: true, audioSrc: "/audio/hr/moj_prijatelj.mp3" },
              { text: "Moj brat", correct: false, audioSrc: "/audio/hr/moj_brat.mp3" },
              { text: "Moj pas", correct: false, audioSrc: "/audio/hr/pas.mp3" },
              { text: "Moj tata", correct: false, audioSrc: "/audio/hr/tata.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"I write and read"',
            options: [
              { text: "Pišem i čitam", correct: true, audioSrc: "/audio/hr/pisem_i_citam.mp3" },
              { text: "Pjevam i plešem", correct: false, audioSrc: "/audio/hr/pjesma.mp3" },
              { text: "Trčim i skačem", correct: false, audioSrc: "/audio/hr/trci.mp3" },
              { text: "Jedem i pijem", correct: false, audioSrc: "/audio/hr/jedem.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "👑 Super Izazov: Školski Znalac",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "School"?',
            options: [
              { text: "Škola", correct: true, audioSrc: "/audio/hr/skola.mp3" },
              { text: "Razred", correct: false, audioSrc: "/audio/hr/razred.mp3" },
              { text: "Torba", correct: false, audioSrc: "/audio/hr/torba.mp3" },
              { text: "Olovka", correct: false, audioSrc: "/audio/hr/olovka.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Teacher"?',
            options: [
              { text: "Učiteljica", correct: true, audioSrc: "/audio/hr/uciteljica.mp3" },
              { text: "Prijatelj", correct: false, audioSrc: "/audio/hr/prijatelj.mp3" },
              { text: "Djevojčica", correct: false, audioSrc: "/audio/hr/djevojcica.mp3" },
              { text: "Mama", correct: false, audioSrc: "/audio/hr/mama.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"Notebook"',
            options: [
              { text: "Bilježnica", correct: true, audioSrc: "/audio/hr/biljeznica.mp3" },
              { text: "Olovka", correct: false, audioSrc: "/audio/hr/olovka.mp3" },
              { text: "Knjiga", correct: false, audioSrc: "/audio/hr/knjiga.mp3" },
              { text: "Torba", correct: false, audioSrc: "/audio/hr/torba.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Let\'s go to school"',
            options: [
              { text: "Idemo u školu", correct: true, audioSrc: "/audio/hr/idemo_u_skolu.mp3" },
              { text: "Idemo u park", correct: false, audioSrc: "/audio/hr/idemo_u_park.mp3" },
              { text: "Idemo u sobu", correct: false, audioSrc: "/audio/hr/idemo_u_sobu.mp3" },
              { text: "Idemo na more", correct: false, audioSrc: "/audio/hr/more.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 5,
            question: '"I write and read"',
            options: [
              { text: "Pišem i čitam", correct: true, audioSrc: "/audio/hr/pisem_i_citam.mp3" },
              { text: "Trčim i skačem", correct: false, audioSrc: "/audio/hr/trci.mp3" },
              { text: "Pjevam i plešem", correct: false, audioSrc: "/audio/hr/pjesma.mp3" },
              { text: "Jedem i pijem", correct: false, audioSrc: "/audio/hr/jedem.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 6,
            question: '"My friend"',
            options: [
              { text: "Moj prijatelj", correct: true, audioSrc: "/audio/hr/moj_prijatelj.mp3" },
              { text: "Moj brat", correct: false, audioSrc: "/audio/hr/moj_brat.mp3" },
              { text: "Moja mama", correct: false, audioSrc: "/audio/hr/mama.mp3" },
              { text: "Moja sestra", correct: false, audioSrc: "/audio/hr/sestra.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 17: PRIRODA I DIVLJE ŽIVOTINJE
  // ==========================================
  {
    order: 17,
    title: "Unit 17",
    description: "Priroda i divlje životinje (Wild Nature & Animals)",
    lessons: [
      {
        order: 1,
        title: "U šumi i na planini",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Forest"?',
            options: [
              { text: "Šuma", correct: true, audioSrc: "/audio/hr/suma.mp3" },
              { text: "Rijeka", correct: false, audioSrc: "/audio/hr/rijeka.mp3" },
              { text: "Park", correct: false, audioSrc: "/audio/hr/park.mp3" },
              { text: "Kamen", correct: false, audioSrc: "/audio/hr/kamen.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Mountain"?',
            options: [
              { text: "Planina", correct: true, audioSrc: "/audio/hr/planina.mp3" },
              { text: "Šuma", correct: false, audioSrc: "/audio/hr/suma.mp3" },
              { text: "Rijeka", correct: false, audioSrc: "/audio/hr/rijeka.mp3" },
              { text: "Plaža", correct: false, audioSrc: "/audio/hr/plaza.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "River"?',
            options: [
              { text: "Rijeka", correct: true, audioSrc: "/audio/hr/rijeka.mp3" },
              { text: "Planina", correct: false, audioSrc: "/audio/hr/planina.mp3" },
              { text: "Šuma", correct: false, audioSrc: "/audio/hr/suma.mp3" },
              { text: "Kamen", correct: false, audioSrc: "/audio/hr/kamen.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Stone / Rock"',
            options: [
              { text: "Kamen", correct: true, audioSrc: "/audio/hr/kamen.mp3" },
              { text: "Drvo", correct: false, audioSrc: "/audio/hr/drvo.mp3" },
              { text: "Trava", correct: false, audioSrc: "/audio/hr/trava.mp3" },
              { text: "Pijesak", correct: false, audioSrc: "/audio/hr/pijesak.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Divlje životinje",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Bear"?',
            options: [
              { text: "Medvjed", correct: true, audioSrc: "/audio/hr/medvjed.mp3" },
              { text: "Jelen", correct: false, audioSrc: "/audio/hr/jelen.mp3" },
              { text: "Vuk", correct: false, audioSrc: "/audio/hr/vuk.mp3" },
              { text: "Pas", correct: false, audioSrc: "/audio/hr/pas.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Wolf"?',
            options: [
              { text: "Vuk", correct: true, audioSrc: "/audio/hr/vuk.mp3" },
              { text: "Medvjed", correct: false, audioSrc: "/audio/hr/medvjed.mp3" },
              { text: "Jelen", correct: false, audioSrc: "/audio/hr/jelen.mp3" },
              { text: "Mačka", correct: false, audioSrc: "/audio/hr/macka.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Deer"?',
            options: [
              { text: "Jelen", correct: true, audioSrc: "/audio/hr/jelen.mp3" },
              { text: "Medvjed", correct: false, audioSrc: "/audio/hr/medvjed.mp3" },
              { text: "Vuk", correct: false, audioSrc: "/audio/hr/vuk.mp3" },
              { text: "Konj", correct: false, audioSrc: "/audio/hr/konj.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Eagle"',
            options: [
              { text: "Orao", correct: true, audioSrc: "/audio/hr/orao.mp3" },
              { text: "Ptica", correct: false, audioSrc: "/audio/hr/ptica.mp3" },
              { text: "Galeb", correct: false, audioSrc: "/audio/hr/galeb.mp3" },
              { text: "Vuk", correct: false, audioSrc: "/audio/hr/vuk.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Život u prirodi",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"Bear in the forest"',
            options: [
              { text: "Medvjed u šumi", correct: true, audioSrc: "/audio/hr/medvjed_u_sumi.mp3" },
              { text: "Vuk u šumi", correct: false, audioSrc: "/audio/hr/vuk.mp3" },
              { text: "Pas u kući", correct: false, audioSrc: "/audio/hr/pas.mp3" },
              { text: "Ptica na drvu", correct: false, audioSrc: "/audio/hr/ptica.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"High mountain"',
            options: [
              { text: "Visoka planina", correct: true, audioSrc: "/audio/hr/visoka_planina.mp3" },
              { text: "Velika škola", correct: false, audioSrc: "/audio/hr/velika_skola.mp3" },
              { text: "Bistra rijeka", correct: false, audioSrc: "/audio/hr/bistra_rijeka.mp3" },
              { text: "Mala kuća", correct: false, audioSrc: "/audio/hr/kuca.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"The eagle flies up high"',
            options: [
              { text: "Orao leti gore", correct: true, audioSrc: "/audio/hr/orao_leti_gore.mp3" },
              { text: "Avion leti visoko", correct: false, audioSrc: "/audio/hr/avion_leti_visoko.mp3" },
              { text: "Ptica pjeva lijepo", correct: false, audioSrc: "/audio/hr/ptica.mp3" },
              { text: "Vuk trči brzo", correct: false, audioSrc: "/audio/hr/brzi_vuk.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Clear river"',
            options: [
              { text: "Bistra rijeka", correct: true, audioSrc: "/audio/hr/bistra_rijeka.mp3" },
              { text: "Visoka planina", correct: false, audioSrc: "/audio/hr/visoka_planina.mp3" },
              { text: "Plavo more", correct: false, audioSrc: "/audio/hr/more.mp3" },
              { text: "Topla juha", correct: false, audioSrc: "/audio/hr/topla_juha_na_stolu.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "👑 Super Izazov: Šumski Čuvar",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Bear"?',
            options: [
              { text: "Medvjed", correct: true, audioSrc: "/audio/hr/medvjed.mp3" },
              { text: "Jelen", correct: false, audioSrc: "/audio/hr/jelen.mp3" },
              { text: "Vuk", correct: false, audioSrc: "/audio/hr/vuk.mp3" },
              { text: "Orao", correct: false, audioSrc: "/audio/hr/orao.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Forest"?',
            options: [
              { text: "Šuma", correct: true, audioSrc: "/audio/hr/suma.mp3" },
              { text: "Planina", correct: false, audioSrc: "/audio/hr/planina.mp3" },
              { text: "Rijeka", correct: false, audioSrc: "/audio/hr/rijeka.mp3" },
              { text: "Kamen", correct: false, audioSrc: "/audio/hr/kamen.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"Wolf"',
            options: [
              { text: "Vuk", correct: true, audioSrc: "/audio/hr/vuk.mp3" },
              { text: "Medvjed", correct: false, audioSrc: "/audio/hr/medvjed.mp3" },
              { text: "Jelen", correct: false, audioSrc: "/audio/hr/jelen.mp3" },
              { text: "Pas", correct: false, audioSrc: "/audio/hr/pas.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Bear in the forest"',
            options: [
              { text: "Medvjed u šumi", correct: true, audioSrc: "/audio/hr/medvjed_u_sumi.mp3" },
              { text: "Vuk u šumi", correct: false, audioSrc: "/audio/hr/vuk.mp3" },
              { text: "Jelen u travi", correct: false, audioSrc: "/audio/hr/jelen.mp3" },
              { text: "Ptica na drvu", correct: false, audioSrc: "/audio/hr/ptica.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 5,
            question: '"Clear river"',
            options: [
              { text: "Bistra rijeka", correct: true, audioSrc: "/audio/hr/bistra_rijeka.mp3" },
              { text: "Visoka planina", correct: false, audioSrc: "/audio/hr/visoka_planina.mp3" },
              { text: "Zelena šuma", correct: false, audioSrc: "/audio/hr/suma.mp3" },
              { text: "Plavo more", correct: false, audioSrc: "/audio/hr/more.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 6,
            question: '"The eagle flies up high"',
            options: [
              { text: "Orao leti gore", correct: true, audioSrc: "/audio/hr/orao_leti_gore.mp3" },
              { text: "Avion leti visoko", correct: false, audioSrc: "/audio/hr/avion_leti_visoko.mp3" },
              { text: "Vuk trči brzo", correct: false, audioSrc: "/audio/hr/brzi_vuk.mp3" },
              { text: "Medvjed spava mirno", correct: false, audioSrc: "/audio/hr/spavam.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 18: PUTOVANJE I PRIJEVOZ
  // ==========================================
  {
    order: 18,
    title: "Unit 18",
    description: "Putovanje i prijevoz (Travel, Ferries & Adventure)",
    lessons: [
      {
        order: 1,
        title: "Vozila za put",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Train"?',
            options: [
              { text: "Vlak", correct: true, audioSrc: "/audio/hr/vlak.mp3" },
              { text: "Avion", correct: false, audioSrc: "/audio/hr/avion.mp3" },
              { text: "Autobus", correct: false, audioSrc: "/audio/hr/autobus.mp3" },
              { text: "Trajekt", correct: false, audioSrc: "/audio/hr/trajekt.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Airplane"?',
            options: [
              { text: "Avion", correct: true, audioSrc: "/audio/hr/avion.mp3" },
              { text: "Vlak", correct: false, audioSrc: "/audio/hr/vlak.mp3" },
              { text: "Trajekt", correct: false, audioSrc: "/audio/hr/trajekt.mp3" },
              { text: "Brod", correct: false, audioSrc: "/audio/hr/brod.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Ferry"?',
            options: [
              { text: "Trajekt", correct: true, audioSrc: "/audio/hr/trajekt.mp3" },
              { text: "Autobus", correct: false, audioSrc: "/audio/hr/autobus.mp3" },
              { text: "Vlak", correct: false, audioSrc: "/audio/hr/vlak.mp3" },
              { text: "Brod", correct: false, audioSrc: "/audio/hr/brod.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Bus"',
            options: [
              { text: "Autobus", correct: true, audioSrc: "/audio/hr/autobus.mp3" },
              { text: "Auto", correct: false, audioSrc: "/audio/hr/auto.mp3" },
              { text: "Vlak", correct: false, audioSrc: "/audio/hr/vlak.mp3" },
              { text: "Bicikl", correct: false, audioSrc: "/audio/hr/bicikl.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Spremni za put",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Ticket"?',
            options: [
              { text: "Karta", correct: true, audioSrc: "/audio/hr/karta.mp3" },
              { text: "Kofer", correct: false, audioSrc: "/audio/hr/kofer.mp3" },
              { text: "Torba", correct: false, audioSrc: "/audio/hr/torba.mp3" },
              { text: "Knjiga", correct: false, audioSrc: "/audio/hr/knjiga.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Suitcase"?',
            options: [
              { text: "Kofer", correct: true, audioSrc: "/audio/hr/kofer.mp3" },
              { text: "Torba", correct: false, audioSrc: "/audio/hr/torba.mp3" },
              { text: "Karta", correct: false, audioSrc: "/audio/hr/karta.mp3" },
              { text: "Kapa", correct: false, audioSrc: "/audio/hr/kapa.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Station"?',
            options: [
              { text: "Kolodvor", correct: true, audioSrc: "/audio/hr/kolodvor.mp3" },
              { text: "Razred", correct: false, audioSrc: "/audio/hr/razred.mp3" },
              { text: "Škola", correct: false, audioSrc: "/audio/hr/skola.mp3" },
              { text: "Park", correct: false, audioSrc: "/audio/hr/park.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"We travel"',
            options: [
              { text: "Putujemo", correct: true, audioSrc: "/audio/hr/putujemo.mp3" },
              { text: "Idemo", correct: false, audioSrc: "/audio/hr/idemo.mp3" },
              { text: "Trčimo", correct: false, audioSrc: "/audio/hr/trcimo.mp3" },
              { text: "Plovimo", correct: false, audioSrc: "/audio/hr/plovimo.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Idemo na put",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"The ferry goes to the island"',
            options: [
              { text: "Trajekt ide na otok", correct: true, audioSrc: "/audio/hr/trajekt_ide_na_otok.mp3" },
              { text: "Brod plovi po moru", correct: false, audioSrc: "/audio/hr/brod.mp3" },
              { text: "Vlak ide na stanicu", correct: false, audioSrc: "/audio/hr/vlak.mp3" },
              { text: "Autobus vozi u grad", correct: false, audioSrc: "/audio/hr/autobus.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"We travel by train"',
            options: [
              { text: "Putujemo vlakom", correct: true, audioSrc: "/audio/hr/putujemo_vlakom.mp3" },
              { text: "Putujemo autom", correct: false, audioSrc: "/audio/hr/auto.mp3" },
              { text: "Idemo u park", correct: false, audioSrc: "/audio/hr/idemo_u_park.mp3" },
              { text: "Idemo u školu", correct: false, audioSrc: "/audio/hr/idemo_u_skolu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"Where is my ticket"',
            options: [
              { text: "Gdje je moja karta", correct: true, audioSrc: "/audio/hr/gdje_je_moja_karta.mp3" },
              { text: "Gdje je moja torba", correct: false, audioSrc: "/audio/hr/nova_torba.mp3" },
              { text: "Gdje je moja soba", correct: false, audioSrc: "/audio/hr/soba.mp3" },
              { text: "Gdje je moj pas", correct: false, audioSrc: "/audio/hr/pas.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"The airplane flies high"',
            options: [
              { text: "Avion leti visoko", correct: true, audioSrc: "/audio/hr/avion_leti_visoko.mp3" },
              { text: "Orao leti gore", correct: false, audioSrc: "/audio/hr/orao_leti_gore.mp3" },
              { text: "Ptica leti nebom", correct: false, audioSrc: "/audio/hr/ptica.mp3" },
              { text: "Vlak vozi brzo", correct: false, audioSrc: "/audio/hr/brzi_vlak.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "👑 Super Izazov: Svjetski Putnik",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Ferry"?',
            options: [
              { text: "Trajekt", correct: true, audioSrc: "/audio/hr/trajekt.mp3" },
              { text: "Vlak", correct: false, audioSrc: "/audio/hr/vlak.mp3" },
              { text: "Avion", correct: false, audioSrc: "/audio/hr/avion.mp3" },
              { text: "Autobus", correct: false, audioSrc: "/audio/hr/autobus.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Suitcase"?',
            options: [
              { text: "Kofer", correct: true, audioSrc: "/audio/hr/kofer.mp3" },
              { text: "Karta", correct: false, audioSrc: "/audio/hr/karta.mp3" },
              { text: "Torba", correct: false, audioSrc: "/audio/hr/torba.mp3" },
              { text: "Knjiga", correct: false, audioSrc: "/audio/hr/knjiga.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"Ticket"',
            options: [
              { text: "Karta", correct: true, audioSrc: "/audio/hr/karta.mp3" },
              { text: "Kofer", correct: false, audioSrc: "/audio/hr/kofer.mp3" },
              { text: "Torba", correct: false, audioSrc: "/audio/hr/torba.mp3" },
              { text: "Kapa", correct: false, audioSrc: "/audio/hr/kapa.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"The ferry goes to the island"',
            options: [
              { text: "Trajekt ide na otok", correct: true, audioSrc: "/audio/hr/trajekt_ide_na_otok.mp3" },
              { text: "Brod plovi po moru", correct: false, audioSrc: "/audio/hr/brod.mp3" },
              { text: "Vlak ide na stanicu", correct: false, audioSrc: "/audio/hr/vlak.mp3" },
              { text: "Autobus vozi u grad", correct: false, audioSrc: "/audio/hr/autobus.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 5,
            question: '"The airplane flies high"',
            options: [
              { text: "Avion leti visoko", correct: true, audioSrc: "/audio/hr/avion_leti_visoko.mp3" },
              { text: "Orao leti gore", correct: false, audioSrc: "/audio/hr/orao_leti_gore.mp3" },
              { text: "Ptica leti brzo", correct: false, audioSrc: "/audio/hr/ptica.mp3" },
              { text: "Vlak vozi mirno", correct: false, audioSrc: "/audio/hr/vlak.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 6,
            question: '"We travel by train"',
            options: [
              { text: "Putujemo vlakom", correct: true, audioSrc: "/audio/hr/putujemo_vlakom.mp3" },
              { text: "Putujemo autom", correct: false, audioSrc: "/audio/hr/auto.mp3" },
              { text: "Idemo u školu", correct: false, audioSrc: "/audio/hr/idemo_u_skolu.mp3" },
              { text: "Idemo u park", correct: false, audioSrc: "/audio/hr/idemo_u_park.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 19: U KUHINJI: KUHANJE I OBITELJ
  // ==========================================
  {
    order: 19,
    title: "Unit 19",
    description: "U kuhinji: Kuhanje i obitelj (Cooking & Family Kitchen)",
    lessons: [
      {
        order: 1,
        title: "Kuhinjski pribor",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Kitchen"?',
            options: [
              { text: "Kuhinja", correct: true, audioSrc: "/audio/hr/kuhinja.mp3" },
              { text: "Soba", correct: false, audioSrc: "/audio/hr/soba.mp3" },
              { text: "Kuća", correct: false, audioSrc: "/audio/hr/kuca.mp3" },
              { text: "Razred", correct: false, audioSrc: "/audio/hr/razred.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Plate"?',
            options: [
              { text: "Tanjur", correct: true, audioSrc: "/audio/hr/tanjur.mp3" },
              { text: "Žlica", correct: false, audioSrc: "/audio/hr/zlica.mp3" },
              { text: "Vilica", correct: false, audioSrc: "/audio/hr/vilica.mp3" },
              { text: "Stol", correct: false, audioSrc: "/audio/hr/stol.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Spoon"?',
            options: [
              { text: "Žlica", correct: true, audioSrc: "/audio/hr/zlica.mp3" },
              { text: "Vilica", correct: false, audioSrc: "/audio/hr/vilica.mp3" },
              { text: "Tanjur", correct: false, audioSrc: "/audio/hr/tanjur.mp3" },
              { text: "Čaša", correct: false, audioSrc: "/audio/hr/voda.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Fork"',
            options: [
              { text: "Vilica", correct: true, audioSrc: "/audio/hr/vilica.mp3" },
              { text: "Žlica", correct: false, audioSrc: "/audio/hr/zlica.mp3" },
              { text: "Tanjur", correct: false, audioSrc: "/audio/hr/tanjur.mp3" },
              { text: "Nož", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Topli obroci",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Soup"?',
            options: [
              { text: "Juha", correct: true, audioSrc: "/audio/hr/juha.mp3" },
              { text: "Ručak", correct: false, audioSrc: "/audio/hr/rucak.mp3" },
              { text: "Doručak", correct: false, audioSrc: "/audio/hr/dorucak.mp3" },
              { text: "Kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Lunch"?',
            options: [
              { text: "Ručak", correct: true, audioSrc: "/audio/hr/rucak.mp3" },
              { text: "Doručak", correct: false, audioSrc: "/audio/hr/dorucak.mp3" },
              { text: "Juha", correct: false, audioSrc: "/audio/hr/juha.mp3" },
              { text: "Večera", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Breakfast"?',
            options: [
              { text: "Doručak", correct: true, audioSrc: "/audio/hr/dorucak.mp3" },
              { text: "Ručak", correct: false, audioSrc: "/audio/hr/rucak.mp3" },
              { text: "Juha", correct: false, audioSrc: "/audio/hr/juha.mp3" },
              { text: "Jabuka", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"I cook / I am cooking"',
            options: [
              { text: "Kuham", correct: true, audioSrc: "/audio/hr/kuham.mp3" },
              { text: "Jedem", correct: false, audioSrc: "/audio/hr/jedem.mp3" },
              { text: "Pijem", correct: false, audioSrc: "/audio/hr/pijem.mp3" },
              { text: "Crtam", correct: false, audioSrc: "/audio/hr/crtam.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Za obiteljskim stolom",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"Mom is cooking soup"',
            options: [
              { text: "Mama kuha juhu", correct: true, audioSrc: "/audio/hr/mama_kuha_juhu.mp3" },
              { text: "Tata jede juhu", correct: false, audioSrc: "/audio/hr/jedem_rucak.mp3" },
              { text: "Mama pije kavu", correct: false, audioSrc: "/audio/hr/pijem.mp3" },
              { text: "Baka peče kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"Warm soup on the table"',
            options: [
              { text: "Topla juha na stolu", correct: true, audioSrc: "/audio/hr/topla_juha_na_stolu.mp3" },
              { text: "Hladna voda u čaši", correct: false, audioSrc: "/audio/hr/voda.mp3" },
              { text: "Bijeli kruh na stolu", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
              { text: "Svježa jabuka na stolu", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"Enjoy your meal / Bon appétit"',
            options: [
              { text: "Dobar tek", correct: true, audioSrc: "/audio/hr/dobar_tek.mp3" },
              { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
              { text: "Dobro jutro", correct: false, audioSrc: "/audio/hr/dobro_jutro.mp3" },
              { text: "Laku noć", correct: false, audioSrc: "/audio/hr/laku_noc.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"I am eating lunch"',
            options: [
              { text: "Jedem ručak", correct: true, audioSrc: "/audio/hr/jedem_rucak.mp3" },
              { text: "Jedem doručak", correct: false, audioSrc: "/audio/hr/jedem_dorucak.mp3" },
              { text: "Pijem vodu", correct: false, audioSrc: "/audio/hr/voda.mp3" },
              { text: "Kuham juhu", correct: false, audioSrc: "/audio/hr/kuham.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "👑 Super Izazov: Veliki Kuhar",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Soup"?',
            options: [
              { text: "Juha", correct: true, audioSrc: "/audio/hr/juha.mp3" },
              { text: "Kuhinja", correct: false, audioSrc: "/audio/hr/kuhinja.mp3" },
              { text: "Tanjur", correct: false, audioSrc: "/audio/hr/tanjur.mp3" },
              { text: "Žlica", correct: false, audioSrc: "/audio/hr/zlica.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Plate"?',
            options: [
              { text: "Tanjur", correct: true, audioSrc: "/audio/hr/tanjur.mp3" },
              { text: "Vilica", correct: false, audioSrc: "/audio/hr/vilica.mp3" },
              { text: "Žlica", correct: false, audioSrc: "/audio/hr/zlica.mp3" },
              { text: "Kuhinja", correct: false, audioSrc: "/audio/hr/kuhinja.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"Enjoy your meal"',
            options: [
              { text: "Dobar tek", correct: true, audioSrc: "/audio/hr/dobar_tek.mp3" },
              { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
              { text: "Dobro sam", correct: false, audioSrc: "/audio/hr/dobro_sam.mp3" },
              { text: "Laku noć", correct: false, audioSrc: "/audio/hr/laku_noc.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Mom is cooking soup"',
            options: [
              { text: "Mama kuha juhu", correct: true, audioSrc: "/audio/hr/mama_kuha_juhu.mp3" },
              { text: "Tata jede juhu", correct: false, audioSrc: "/audio/hr/jedem_rucak.mp3" },
              { text: "Baka peče kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
              { text: "Sestra pije vodu", correct: false, audioSrc: "/audio/hr/voda.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 5,
            question: '"Warm soup on the table"',
            options: [
              { text: "Topla juha na stolu", correct: true, audioSrc: "/audio/hr/topla_juha_na_stolu.mp3" },
              { text: "Bijeli kruh na stolu", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
              { text: "Hladna voda u čaši", correct: false, audioSrc: "/audio/hr/voda.mp3" },
              { text: "Žuta jabuka na stolu", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 6,
            question: '"I am eating lunch"',
            options: [
              { text: "Jedem ručak", correct: true, audioSrc: "/audio/hr/jedem_rucak.mp3" },
              { text: "Jedem doručak", correct: false, audioSrc: "/audio/hr/jedem_dorucak.mp3" },
              { text: "Kuham juhu", correct: false, audioSrc: "/audio/hr/kuham.mp3" },
              { text: "Pijem vodu", correct: false, audioSrc: "/audio/hr/voda.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 20: HRVATSKI BLAGDANI I ROĐENDAN
  // ==========================================
  {
    order: 20,
    title: "Unit 20",
    description: "Hrvatski blagdani i rođendan (Birthdays & Celebrations)",
    lessons: [
      {
        order: 1,
        title: "Rođendanska zabava",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Birthday"?',
            options: [
              { text: "Rođendan", correct: true, audioSrc: "/audio/hr/rodendan.mp3" },
              { text: "Torta", correct: false, audioSrc: "/audio/hr/torta.mp3" },
              { text: "Poklon", correct: false, audioSrc: "/audio/hr/poklon.mp3" },
              { text: "Ples", correct: false, audioSrc: "/audio/hr/ples.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Cake"?',
            options: [
              { text: "Torta", correct: true, audioSrc: "/audio/hr/torta.mp3" },
              { text: "Rođendan", correct: false, audioSrc: "/audio/hr/rodendan.mp3" },
              { text: "Poklon", correct: false, audioSrc: "/audio/hr/poklon.mp3" },
              { text: "Balon", correct: false, audioSrc: "/audio/hr/balon.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Present / Gift"?',
            options: [
              { text: "Poklon", correct: true, audioSrc: "/audio/hr/poklon.mp3" },
              { text: "Torta", correct: false, audioSrc: "/audio/hr/torta.mp3" },
              { text: "Balon", correct: false, audioSrc: "/audio/hr/balon.mp3" },
              { text: "Knjiga", correct: false, audioSrc: "/audio/hr/knjiga.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Candles"',
            options: [
              { text: "Svjećice", correct: true, audioSrc: "/audio/hr/svjecice.mp3" },
              { text: "Pokloni", correct: false, audioSrc: "/audio/hr/poklon.mp3" },
              { text: "Baloni", correct: false, audioSrc: "/audio/hr/balon.mp3" },
              { text: "Prijatelji", correct: false, audioSrc: "/audio/hr/prijatelji.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Čestitke i slavlje",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Congratulations"?',
            options: [
              { text: "Čestitam", correct: true, audioSrc: "/audio/hr/cestitam.mp3" },
              { text: "Hvala", correct: false, audioSrc: "/audio/hr/hvala.mp3" },
              { text: "Molim", correct: false, audioSrc: "/audio/hr/molim.mp3" },
              { text: "Bravo", correct: false, audioSrc: "/audio/hr/bravo.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Dance"?',
            options: [
              { text: "Ples", correct: true, audioSrc: "/audio/hr/ples.mp3" },
              { text: "Pjesma", correct: false, audioSrc: "/audio/hr/pjesma.mp3" },
              { text: "Igra", correct: false, audioSrc: "/audio/hr/igra.mp3" },
              { text: "Torta", correct: false, audioSrc: "/audio/hr/torta.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Friends"?',
            options: [
              { text: "Prijatelji", correct: true, audioSrc: "/audio/hr/prijatelji.mp3" },
              { text: "Dječaci", correct: false, audioSrc: "/audio/hr/djecak.mp3" },
              { text: "Djevojčice", correct: false, audioSrc: "/audio/hr/djevojcica.mp3" },
              { text: "Učenici", correct: false, audioSrc: "/audio/hr/uciteljica.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Balloon"',
            options: [
              { text: "Balon", correct: true, audioSrc: "/audio/hr/balon.mp3" },
              { text: "Lopta", correct: false, audioSrc: "/audio/hr/lopta.mp3" },
              { text: "Poklon", correct: false, audioSrc: "/audio/hr/poklon.mp3" },
              { text: "Torta", correct: false, audioSrc: "/audio/hr/torta.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Sretan rođendan",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"Happy birthday"',
            options: [
              { text: "Sretan rođendan", correct: true, audioSrc: "/audio/hr/sretan_rodendan.mp3" },
              { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
              { text: "Laku noć", correct: false, audioSrc: "/audio/hr/laku_noc.mp3" },
              { text: "Veliko hvala", correct: false, audioSrc: "/audio/hr/hvala.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"Blow out the candles"',
            options: [
              { text: "Puhni u svjećice", correct: true, audioSrc: "/audio/hr/puhni_u_svjecice.mp3" },
              { text: "Pjevaj s nama", correct: false, audioSrc: "/audio/hr/pjesma.mp3" },
              { text: "Otvori svoj poklon", correct: false, audioSrc: "/audio/hr/poklon.mp3" },
              { text: "Reži slatku tortu", correct: false, audioSrc: "/audio/hr/torta.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"Thank you for the gift"',
            options: [
              { text: "Hvala na poklonu", correct: true, audioSrc: "/audio/hr/hvala_na_poklonu.mp3" },
              { text: "Hvala na pomoći", correct: false, audioSrc: "/audio/hr/hvala.mp3" },
              { text: "Bravo za pjesmu", correct: false, audioSrc: "/audio/hr/bravo.mp3" },
              { text: "Idemo na rođendan", correct: false, audioSrc: "/audio/hr/rodendan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Sweet cake"',
            options: [
              { text: "Slatka torta", correct: true, audioSrc: "/audio/hr/slatka_torta.mp3" },
              { text: "Topla juha", correct: false, audioSrc: "/audio/hr/topla_juha_na_stolu.mp3" },
              { text: "Bistra rijeka", correct: false, audioSrc: "/audio/hr/bistra_rijeka.mp3" },
              { text: "Fina hrana", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "👑 Super Izazov: Kralj Slavlja",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Cake"?',
            options: [
              { text: "Torta", correct: true, audioSrc: "/audio/hr/torta.mp3" },
              { text: "Poklon", correct: false, audioSrc: "/audio/hr/poklon.mp3" },
              { text: "Balon", correct: false, audioSrc: "/audio/hr/balon.mp3" },
              { text: "Ples", correct: false, audioSrc: "/audio/hr/ples.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Present / Gift"?',
            options: [
              { text: "Poklon", correct: true, audioSrc: "/audio/hr/poklon.mp3" },
              { text: "Torta", correct: false, audioSrc: "/audio/hr/torta.mp3" },
              { text: "Svjećice", correct: false, audioSrc: "/audio/hr/svjecice.mp3" },
              { text: "Rođendan", correct: false, audioSrc: "/audio/hr/rodendan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"Congratulations"',
            options: [
              { text: "Čestitam", correct: true, audioSrc: "/audio/hr/cestitam.mp3" },
              { text: "Hvala", correct: false, audioSrc: "/audio/hr/hvala.mp3" },
              { text: "Molim", correct: false, audioSrc: "/audio/hr/molim.mp3" },
              { text: "Bravo", correct: false, audioSrc: "/audio/hr/bravo.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Happy birthday"',
            options: [
              { text: "Sretan rođendan", correct: true, audioSrc: "/audio/hr/sretan_rodendan.mp3" },
              { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
              { text: "Dobro jutro", correct: false, audioSrc: "/audio/hr/dobro_jutro.mp3" },
              { text: "Laku noć", correct: false, audioSrc: "/audio/hr/laku_noc.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 5,
            question: '"Blow out the candles"',
            options: [
              { text: "Puhni u svjećice", correct: true, audioSrc: "/audio/hr/puhni_u_svjecice.mp3" },
              { text: "Pjevaj s nama", correct: false, audioSrc: "/audio/hr/pjesma.mp3" },
              { text: "Otvori svoj poklon", correct: false, audioSrc: "/audio/hr/poklon.mp3" },
              { text: "Reži slatku tortu", correct: false, audioSrc: "/audio/hr/torta.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 6,
            question: '"Thank you for the gift"',
            options: [
              { text: "Hvala na poklonu", correct: true, audioSrc: "/audio/hr/hvala_na_poklonu.mp3" },
              { text: "Hvala na pomoći", correct: false, audioSrc: "/audio/hr/hvala.mp3" },
              { text: "Bravo za ples", correct: false, audioSrc: "/audio/hr/bravo.mp3" },
              { text: "Idemo na slavlje", correct: false, audioSrc: "/audio/hr/rodendan.mp3" },
            ],
          },
        ],
      },
    ],
  },
];

async function seedUnits16To20() {
  console.log("Validating and seeding Units 16 to 20...");

  // 1. Verify all audio files exist locally
  let missingAudio = 0;
  for (const u of unitsData) {
    for (const l of u.lessons) {
      for (const ch of l.challenges) {
        if (ch.options.length !== 4) {
          throw new Error(`Challenge "${ch.question}" in Unit ${u.order} has ${ch.options.length} options (must be 4)!`);
        }
        for (const opt of ch.options) {
          const localPath = path.join(__dirname, "..", "public", opt.audioSrc.replace(/^\//, ""));
          if (!fs.existsSync(localPath)) {
            console.error(`Missing audio file: ${opt.audioSrc} (checked: ${localPath})`);
            missingAudio++;
          }
        }
      }
    }
  }

  if (missingAudio > 0) {
    throw new Error(`Aborting: ${missingAudio} audio files missing.`);
  }
  console.log("All audio files verified on disk!");

  // 2. Clean up existing Units 16-20 if they already exist
  const existingUnits = await sql`SELECT id, "order" FROM units WHERE "order" BETWEEN 16 AND 20`;
  for (const eu of existingUnits) {
    console.log(`Cleaning existing Unit ${eu.order}...`);
    const lessons = await sql`SELECT id FROM lessons WHERE unit_id = ${eu.id}`;
    for (const ls of lessons) {
      const chs = await sql`SELECT id FROM challenges WHERE lesson_id = ${ls.id}`;
      for (const c of chs) {
        await sql`DELETE FROM challenge_options WHERE challenge_id = ${c.id}`;
        await sql`DELETE FROM challenge_progress WHERE challenge_id = ${c.id}`;
      }
      await sql`DELETE FROM challenges WHERE lesson_id = ${ls.id}`;
    }
    await sql`DELETE FROM lessons WHERE unit_id = ${eu.id}`;
    await sql`DELETE FROM units WHERE id = ${eu.id}`;
  }

  // Sync Postgres sequences so auto-increment IDs do not clash with prior explicit IDs
  await sql`SELECT setval('units_id_seq', (SELECT COALESCE(MAX(id), 1) FROM units))`;
  await sql`SELECT setval('lessons_id_seq', (SELECT COALESCE(MAX(id), 1) FROM lessons))`;
  await sql`SELECT setval('challenges_id_seq', (SELECT COALESCE(MAX(id), 1) FROM challenges))`;
  await sql`SELECT setval('challenge_options_id_seq', (SELECT COALESCE(MAX(id), 1) FROM challenge_options))`;

  // 3. Insert Units 16 to 20
  for (const u of unitsData) {
    console.log(`Inserting Unit ${u.order}: ${u.description}...`);
    const [insertedUnit] = await sql`
      INSERT INTO units (course_id, title, description, "order")
      VALUES (1, ${u.title}, ${u.description}, ${u.order})
      RETURNING id
    `;
    const unitId = insertedUnit.id;

    for (const l of u.lessons) {
      const [insertedLesson] = await sql`
        INSERT INTO lessons (unit_id, title, "order")
        VALUES (${unitId}, ${l.title}, ${l.order})
        RETURNING id
      `;
      const lessonId = insertedLesson.id;

      for (const ch of l.challenges) {
        const [insertedChallenge] = await sql`
          INSERT INTO challenges (lesson_id, type, question, "order")
          VALUES (${lessonId}, ${ch.type}, ${ch.question}, ${ch.order})
          RETURNING id
        `;
        const challengeId = insertedChallenge.id;

        for (const opt of ch.options) {
          await sql`
            INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
            VALUES (${challengeId}, ${opt.text}, ${opt.correct}, ${opt.imageSrc || null}, ${opt.audioSrc})
          `;
        }
      }
    }
  }

  console.log("Units 16 to 20 successfully seeded!");
}

seedUnits16To20()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding Units 16-20:", err);
    process.exit(1);
  });
