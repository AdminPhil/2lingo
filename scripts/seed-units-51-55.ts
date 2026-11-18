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
  // UNIT 51: BAROKNI VARAŽDIN I GLAZBA (Baroque Varaždin & Music)
  // ==========================================
  {
    order: 51,
    title: "Unit 51",
    description: "Barokni Varaždin i glazba (Baroque Varaždin & Music)",
    lessons: [
      {
        order: 1,
        title: "Glazbala i note",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Violin"?',
            options: [
              { text: "Violina", correct: true, imageSrc: "/violina.svg", audioSrc: "/audio/hr/violina.mp3" },
              { text: "Klavir", correct: false, imageSrc: "/klavir.svg", audioSrc: "/audio/hr/klavir.mp3" },
              { text: "Nota", correct: false, imageSrc: "/nota.svg", audioSrc: "/audio/hr/nota.mp3" },
              { text: "Orkestar", correct: false, imageSrc: "/orkestar.svg", audioSrc: "/audio/hr/orkestar.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Piano"?',
            options: [
              { text: "Klavir", correct: true, imageSrc: "/klavir.svg", audioSrc: "/audio/hr/klavir.mp3" },
              { text: "Violina", correct: false, imageSrc: "/violina.svg", audioSrc: "/audio/hr/violina.mp3" },
              { text: "Nota", correct: false, imageSrc: "/nota.svg", audioSrc: "/audio/hr/nota.mp3" },
              { text: "Orkestar", correct: false, imageSrc: "/orkestar.svg", audioSrc: "/audio/hr/orkestar.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Musical note"?',
            options: [
              { text: "Nota", correct: true, imageSrc: "/nota.svg", audioSrc: "/audio/hr/nota.mp3" },
              { text: "Violina", correct: false, imageSrc: "/violina.svg", audioSrc: "/audio/hr/violina.mp3" },
              { text: "Klavir", correct: false, imageSrc: "/klavir.svg", audioSrc: "/audio/hr/klavir.mp3" },
              { text: "Orkestar", correct: false, imageSrc: "/orkestar.svg", audioSrc: "/audio/hr/orkestar.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Orchestra"?',
            options: [
              { text: "Orkestar", correct: true, imageSrc: "/orkestar.svg", audioSrc: "/audio/hr/orkestar.mp3" },
              { text: "Nota", correct: false, imageSrc: "/nota.svg", audioSrc: "/audio/hr/nota.mp3" },
              { text: "Klavir", correct: false, imageSrc: "/klavir.svg", audioSrc: "/audio/hr/klavir.mp3" },
              { text: "Violina", correct: false, imageSrc: "/violina.svg", audioSrc: "/audio/hr/violina.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Barokne večeri",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The baroque violin"',
            options: [
              { text: "Barokna violina", correct: true, audioSrc: "/audio/hr/barokna_violina.mp3" },
              { text: "Koncertni klavir", correct: false, audioSrc: "/audio/hr/koncertni_klavir.mp3" },
              { text: "Zlatna nota", correct: false, audioSrc: "/audio/hr/zlatna_nota.mp3" },
              { text: "Veliki orkestar", correct: false, audioSrc: "/audio/hr/veliki_orkestar.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The violin plays in the hall."',
            options: [
              { text: "Violina svira u dvorani.", correct: true, audioSrc: "/audio/hr/violina_svira_u_dvorani.mp3" },
              { text: "Orkestar izvodi baroknu glazbu.", correct: false, audioSrc: "/audio/hr/orkestar_izvodi_baroknu_glazbu.mp3" },
              { text: "Glazbenik čita stare note.", correct: false, audioSrc: "/audio/hr/glazbenik_cita_stare_note.mp3" },
              { text: "Klavir zvuči vrlo lijepo.", correct: false, audioSrc: "/audio/hr/klavir_zvuci_vrlo_lijepo.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The orchestra performs baroque music."',
            options: [
              { text: "Orkestar izvodi baroknu glazbu.", correct: true, audioSrc: "/audio/hr/orkestar_izvodi_baroknu_glazbu.mp3" },
              { text: "Violina svira u dvorani.", correct: false, audioSrc: "/audio/hr/violina_svira_u_dvorani.mp3" },
              { text: "Glazbenik čita stare note.", correct: false, audioSrc: "/audio/hr/glazbenik_cita_stare_note.mp3" },
              { text: "Klavir zvuči vrlo lijepo.", correct: false, audioSrc: "/audio/hr/klavir_zvuci_vrlo_lijepo.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The musician reads old notes."',
            options: [
              { text: "Glazbenik čita stare note.", correct: true, audioSrc: "/audio/hr/glazbenik_cita_stare_note.mp3" },
              { text: "Violina svira u dvorani.", correct: false, audioSrc: "/audio/hr/violina_svira_u_dvorani.mp3" },
              { text: "Orkestar izvodi baroknu glazbu.", correct: false, audioSrc: "/audio/hr/orkestar_izvodi_baroknu_glazbu.mp3" },
              { text: "Klavir zvuči vrlo lijepo.", correct: false, audioSrc: "/audio/hr/klavir_zvuci_vrlo_lijepo.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Koncert u dvorani",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The piano sounds very beautiful."',
            options: [
              { text: "Klavir zvuči vrlo lijepo.", correct: true, audioSrc: "/audio/hr/klavir_zvuci_vrlo_lijepo.mp3" },
              { text: "Varaždin slavi barokne večeri.", correct: false, audioSrc: "/audio/hr/varazdin_slavi_barokne_veceri.mp3" },
              { text: "Publika sluša tihu melodiju.", correct: false, audioSrc: "/audio/hr/publika_slusa_tihu_melodiju.mp3" },
              { text: "Dirigent vodi cijeli orkestar.", correct: false, audioSrc: "/audio/hr/dirigent_vodi_cijeli_orkestar.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Varaždin celebrates baroque evenings."',
            options: [
              { text: "Varaždin slavi barokne večeri.", correct: true, audioSrc: "/audio/hr/varazdin_slavi_barokne_veceri.mp3" },
              { text: "Klavir zvuči vrlo lijepo.", correct: false, audioSrc: "/audio/hr/klavir_zvuci_vrlo_lijepo.mp3" },
              { text: "Publika sluša tihu melodiju.", correct: false, audioSrc: "/audio/hr/publika_slusa_tihu_melodiju.mp3" },
              { text: "Dirigent vodi cijeli orkestar.", correct: false, audioSrc: "/audio/hr/dirigent_vodi_cijeli_orkestar.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The audience listens to a quiet melody."',
            options: [
              { text: "Publika sluša tihu melodiju.", correct: true, audioSrc: "/audio/hr/publika_slusa_tihu_melodiju.mp3" },
              { text: "Varaždin slavi barokne večeri.", correct: false, audioSrc: "/audio/hr/varazdin_slavi_barokne_veceri.mp3" },
              { text: "Dirigent vodi cijeli orkestar.", correct: false, audioSrc: "/audio/hr/dirigent_vodi_cijeli_orkestar.mp3" },
              { text: "Koncert počinje točno navečer.", correct: false, audioSrc: "/audio/hr/koncert_pocinje_tocno_navecer.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The conductor leads the entire orchestra."',
            options: [
              { text: "Dirigent vodi cijeli orkestar.", correct: true, audioSrc: "/audio/hr/dirigent_vodi_cijeli_orkestar.mp3" },
              { text: "Publika sluša tihu melodiju.", correct: false, audioSrc: "/audio/hr/publika_slusa_tihu_melodiju.mp3" },
              { text: "Varaždin slavi barokne večeri.", correct: false, audioSrc: "/audio/hr/varazdin_slavi_barokne_veceri.mp3" },
              { text: "Koncert počinje točno navečer.", correct: false, audioSrc: "/audio/hr/koncert_pocinje_tocno_navecer.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Zvuk baroka",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The sound of the violin fills the church."',
            options: [
              { text: "Zvuk violine ispunjava crkvu.", correct: true, audioSrc: "/audio/hr/zvuk_violine_ispunjava_crkvu.mp3" },
              { text: "Mladi umjetnici vježbaju svaki dan.", correct: false, audioSrc: "/audio/hr/mladi_umjetnici_vjezbaju_svaki_dan.mp3" },
              { text: "Barokna glazba donosi mir.", correct: false, audioSrc: "/audio/hr/barokna_glazba_donosi_mir.mp3" },
              { text: "Pljesak odjekuje starim kazalištem.", correct: false, audioSrc: "/audio/hr/pljesak_odjekuje_starim_kazalistem.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Young artists practice every day."',
            options: [
              { text: "Mladi umjetnici vježbaju svaki dan.", correct: true, audioSrc: "/audio/hr/mladi_umjetnici_vjezbaju_svaki_dan.mp3" },
              { text: "Zvuk violine ispunjava crkvu.", correct: false, audioSrc: "/audio/hr/zvuk_violine_ispunjava_crkvu.mp3" },
              { text: "Barokna glazba donosi mir.", correct: false, audioSrc: "/audio/hr/barokna_glazba_donosi_mir.mp3" },
              { text: "Pljesak odjekuje starim kazalištem.", correct: false, audioSrc: "/audio/hr/pljesak_odjekuje_starim_kazalistem.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Baroque music brings peace."',
            options: [
              { text: "Barokna glazba donosi mir.", correct: true, audioSrc: "/audio/hr/barokna_glazba_donosi_mir.mp3" },
              { text: "Zvuk violine ispunjava crkvu.", correct: false, audioSrc: "/audio/hr/zvuk_violine_ispunjava_crkvu.mp3" },
              { text: "Mladi umjetnici vježbaju svaki dan.", correct: false, audioSrc: "/audio/hr/mladi_umjetnici_vjezbaju_svaki_dan.mp3" },
              { text: "Pljesak odjekuje starim kazalištem.", correct: false, audioSrc: "/audio/hr/pljesak_odjekuje_starim_kazalistem.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Applause echoes through the old theater."',
            options: [
              { text: "Pljesak odjekuje starim kazalištem.", correct: true, audioSrc: "/audio/hr/pljesak_odjekuje_starim_kazalistem.mp3" },
              { text: "Zvuk violine ispunjava crkvu.", correct: false, audioSrc: "/audio/hr/zvuk_violine_ispunjava_crkvu.mp3" },
              { text: "Mladi umjetnici vježbaju svaki dan.", correct: false, audioSrc: "/audio/hr/mladi_umjetnici_vjezbaju_svaki_dan.mp3" },
              { text: "Barokna glazba donosi mir.", correct: false, audioSrc: "/audio/hr/barokna_glazba_donosi_mir.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 52: ŠPANCIRFEST I ULICE (Špancirfest Festival & Streets)
  // ==========================================
  {
    order: 52,
    title: "Unit 52",
    description: "Špancirfest i ulice (Špancirfest Festival & Streets)",
    lessons: [
      {
        order: 1,
        title: "Festival na ulicama",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Stage"?',
            options: [
              { text: "Pozornica", correct: true, imageSrc: "/pozornica.svg", audioSrc: "/audio/hr/pozornica.mp3" },
              { text: "Glumac", correct: false, imageSrc: "/glumac.svg", audioSrc: "/audio/hr/glumac.mp3" },
              { text: "Kišobran", correct: false, imageSrc: "/kisobran.svg", audioSrc: "/audio/hr/kisobran.mp3" },
              { text: "Šešir", correct: false, imageSrc: "/sesir.svg", audioSrc: "/audio/hr/sesir.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Actor"?',
            options: [
              { text: "Glumac", correct: true, imageSrc: "/glumac.svg", audioSrc: "/audio/hr/glumac.mp3" },
              { text: "Pozornica", correct: false, imageSrc: "/pozornica.svg", audioSrc: "/audio/hr/pozornica.mp3" },
              { text: "Kišobran", correct: false, imageSrc: "/kisobran.svg", audioSrc: "/audio/hr/kisobran.mp3" },
              { text: "Šešir", correct: false, imageSrc: "/sesir.svg", audioSrc: "/audio/hr/sesir.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Umbrella"?',
            options: [
              { text: "Kišobran", correct: true, imageSrc: "/kisobran.svg", audioSrc: "/audio/hr/kisobran.mp3" },
              { text: "Pozornica", correct: false, imageSrc: "/pozornica.svg", audioSrc: "/audio/hr/pozornica.mp3" },
              { text: "Glumac", correct: false, imageSrc: "/glumac.svg", audioSrc: "/audio/hr/glumac.mp3" },
              { text: "Šešir", correct: false, imageSrc: "/sesir.svg", audioSrc: "/audio/hr/sesir.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Hat"?',
            options: [
              { text: "Šešir", correct: true, imageSrc: "/sesir.svg", audioSrc: "/audio/hr/sesir.mp3" },
              { text: "Kišobran", correct: false, imageSrc: "/kisobran.svg", audioSrc: "/audio/hr/kisobran.mp3" },
              { text: "Glumac", correct: false, imageSrc: "/glumac.svg", audioSrc: "/audio/hr/glumac.mp3" },
              { text: "Pozornica", correct: false, imageSrc: "/pozornica.svg", audioSrc: "/audio/hr/pozornica.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Šetnja Špancirfestom",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The colorful umbrella"',
            options: [
              { text: "Šareni kišobran", correct: true, audioSrc: "/audio/hr/sareni_kisobran.mp3" },
              { text: "Velika pozornica", correct: false, audioSrc: "/audio/hr/velika_pozornica.mp3" },
              { text: "Veseli glumac", correct: false, audioSrc: "/audio/hr/veseli_glumac.mp3" },
              { text: "Slamni šešir", correct: false, audioSrc: "/audio/hr/slamni_sesir.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Colorful umbrellas hang above the street."',
            options: [
              { text: "Šareni kišobrani vise nad ulicom.", correct: true, audioSrc: "/audio/hr/sareni_kisobrani_vise_nad_ulicom.mp3" },
              { text: "Glumac zabavlja djecu na trgu.", correct: false, audioSrc: "/audio/hr/glumac_zabavlja_djecu_na_trgu.mp3" },
              { text: "Pjevači stoje na velikoj pozornici.", correct: false, audioSrc: "/audio/hr/pjevaci_stoje_na_velikoj_pozornici.mp3" },
              { text: "Gosti šetaju varaždinskim trgovima.", correct: false, audioSrc: "/audio/hr/gosti_setaju_varazdinskim_trgovima.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The actor entertains children on the square."',
            options: [
              { text: "Glumac zabavlja djecu na trgu.", correct: true, audioSrc: "/audio/hr/glumac_zabavlja_djecu_na_trgu.mp3" },
              { text: "Šareni kišobrani vise nad ulicom.", correct: false, audioSrc: "/audio/hr/sareni_kisobrani_vise_nad_ulicom.mp3" },
              { text: "Pjevači stoje na velikoj pozornici.", correct: false, audioSrc: "/audio/hr/pjevaci_stoje_na_velikoj_pozornici.mp3" },
              { text: "Gosti šetaju varaždinskim trgovima.", correct: false, audioSrc: "/audio/hr/gosti_setaju_varazdinskim_trgovima.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Singers stand on the large stage."',
            options: [
              { text: "Pjevači stoje na velikoj pozornici.", correct: true, audioSrc: "/audio/hr/pjevaci_stoje_na_velikoj_pozornici.mp3" },
              { text: "Šareni kišobrani vise nad ulicom.", correct: false, audioSrc: "/audio/hr/sareni_kisobrani_vise_nad_ulicom.mp3" },
              { text: "Glumac zabavlja djecu na trgu.", correct: false, audioSrc: "/audio/hr/glumac_zabavlja_djecu_na_trgu.mp3" },
              { text: "Gosti šetaju varaždinskim trgovima.", correct: false, audioSrc: "/audio/hr/gosti_setaju_varazdinskim_trgovima.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Ulični umjetnici",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Špancirfest gathers many artists."',
            options: [
              { text: "Špancirfest okuplja mnogo umjetnika.", correct: true, audioSrc: "/audio/hr/spancirfest_okuplja_mnogo_umjetnika.mp3" },
              { text: "Ulični svirači sviraju do mraka.", correct: false, audioSrc: "/audio/hr/ulicni_sviraci_sviraju_do_mraka.mp3" },
              { text: "Slikar crta portret ispod šešira.", correct: false, audioSrc: "/audio/hr/slikar_crta_portret_ispod_sesira.mp3" },
              { text: "Djeca se smiju veseloj predstavi.", correct: false, audioSrc: "/audio/hr/djeca_se_smiju_veseloj_predstavi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Street musicians play until dark."',
            options: [
              { text: "Ulični svirači sviraju do mraka.", correct: true, audioSrc: "/audio/hr/ulicni_sviraci_sviraju_do_mraka.mp3" },
              { text: "Špancirfest okuplja mnogo umjetnika.", correct: false, audioSrc: "/audio/hr/spancirfest_okuplja_mnogo_umjetnika.mp3" },
              { text: "Slikar crta portret ispod šešira.", correct: false, audioSrc: "/audio/hr/slikar_crta_portret_ispod_sesira.mp3" },
              { text: "Djeca se smiju veseloj predstavi.", correct: false, audioSrc: "/audio/hr/djeca_se_smiju_veseloj_predstavi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The painter draws a portrait under his hat."',
            options: [
              { text: "Slikar crta portret ispod šešira.", correct: true, audioSrc: "/audio/hr/slikar_crta_portret_ispod_sesira.mp3" },
              { text: "Ulični svirači sviraju do mraka.", correct: false, audioSrc: "/audio/hr/ulicni_sviraci_sviraju_do_mraka.mp3" },
              { text: "Špancirfest okuplja mnogo umjetnika.", correct: false, audioSrc: "/audio/hr/spancirfest_okuplja_mnogo_umjetnika.mp3" },
              { text: "Djeca se smiju veseloj predstavi.", correct: false, audioSrc: "/audio/hr/djeca_se_smiju_veseloj_predstavi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Children laugh at the cheerful show."',
            options: [
              { text: "Djeca se smiju veseloj predstavi.", correct: true, audioSrc: "/audio/hr/djeca_se_smiju_veseloj_predstavi.mp3" },
              { text: "Ulični svirači sviraju do mraka.", correct: false, audioSrc: "/audio/hr/ulicni_sviraci_sviraju_do_mraka.mp3" },
              { text: "Slikar crta portret ispod šešira.", correct: false, audioSrc: "/audio/hr/slikar_crta_portret_ispod_sesira.mp3" },
              { text: "Špancirfest okuplja mnogo umjetnika.", correct: false, audioSrc: "/audio/hr/spancirfest_okuplja_mnogo_umjetnika.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Boje Špancirfesta",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The old town lives in colors."',
            options: [
              { text: "Stari grad živi u bojama.", correct: true, audioSrc: "/audio/hr/stari_grad_zivi_u_bojama.mp3" },
              { text: "Ljudi kupuju ručne radove.", correct: false, audioSrc: "/audio/hr/ljudi_kupuju_rucne_radove.mp3" },
              { text: "Ljetna večer miriše na pecivo.", correct: false, audioSrc: "/audio/hr/ljetna_vecer_mirise_na_pecivo.mp3" },
              { text: "Festival donosi radost svima.", correct: false, audioSrc: "/audio/hr/festival_donosi_radost_svima.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "People buy handmade crafts."',
            options: [
              { text: "Ljudi kupuju ručne radove.", correct: true, audioSrc: "/audio/hr/ljudi_kupuju_rucne_radove.mp3" },
              { text: "Stari grad živi u bojama.", correct: false, audioSrc: "/audio/hr/stari_grad_zivi_u_bojama.mp3" },
              { text: "Ljetna večer miriše na pecivo.", correct: false, audioSrc: "/audio/hr/ljetna_vecer_mirise_na_pecivo.mp3" },
              { text: "Festival donosi radost svima.", correct: false, audioSrc: "/audio/hr/festival_donosi_radost_svima.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The summer evening smells like pastries."',
            options: [
              { text: "Ljetna večer miriše na pecivo.", correct: true, audioSrc: "/audio/hr/ljetna_vecer_mirise_na_pecivo.mp3" },
              { text: "Stari grad živi u bojama.", correct: false, audioSrc: "/audio/hr/stari_grad_zivi_u_bojama.mp3" },
              { text: "Ljudi kupuju ručne radove.", correct: false, audioSrc: "/audio/hr/ljudi_kupuju_rucne_radove.mp3" },
              { text: "Festival donosi radost svima.", correct: false, audioSrc: "/audio/hr/festival_donosi_radost_svima.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The festival brings joy to everyone."',
            options: [
              { text: "Festival donosi radost svima.", correct: true, audioSrc: "/audio/hr/festival_donosi_radost_svima.mp3" },
              { text: "Stari grad živi u bojama.", correct: false, audioSrc: "/audio/hr/stari_grad_zivi_u_bojama.mp3" },
              { text: "Ljudi kupuju ručne radove.", correct: false, audioSrc: "/audio/hr/ljudi_kupuju_rucne_radove.mp3" },
              { text: "Ljetna večer miriše na pecivo.", correct: false, audioSrc: "/audio/hr/ljetna_vecer_mirise_na_pecivo.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 53: STARI GRAD I ANĐELI (Varaždin Old Town & Angels)
  // ==========================================
  {
    order: 53,
    title: "Unit 53",
    description: "Stari grad i anđeli (Varaždin Old Town & Angels)",
    lessons: [
      {
        order: 1,
        title: "Simboli Staroga grada",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Angel"?',
            options: [
              { text: "Anđeo", correct: true, imageSrc: "/andeo.svg", audioSrc: "/audio/hr/andeo.mp3" },
              { text: "Bedem", correct: false, imageSrc: "/bedem.svg", audioSrc: "/audio/hr/bedem.mp3" },
              { text: "Toranj", correct: false, imageSrc: "/toranj.svg", audioSrc: "/audio/hr/toranj.mp3" },
              { text: "Grb", correct: false, imageSrc: "/grb.svg", audioSrc: "/audio/hr/grb.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Rampart"?',
            options: [
              { text: "Bedem", correct: true, imageSrc: "/bedem.svg", audioSrc: "/audio/hr/bedem.mp3" },
              { text: "Anđeo", correct: false, imageSrc: "/andeo.svg", audioSrc: "/audio/hr/andeo.mp3" },
              { text: "Toranj", correct: false, imageSrc: "/toranj.svg", audioSrc: "/audio/hr/toranj.mp3" },
              { text: "Grb", correct: false, imageSrc: "/grb.svg", audioSrc: "/audio/hr/grb.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Tower"?',
            options: [
              { text: "Toranj", correct: true, imageSrc: "/toranj.svg", audioSrc: "/audio/hr/toranj.mp3" },
              { text: "Anđeo", correct: false, imageSrc: "/andeo.svg", audioSrc: "/audio/hr/andeo.mp3" },
              { text: "Bedem", correct: false, imageSrc: "/bedem.svg", audioSrc: "/audio/hr/bedem.mp3" },
              { text: "Grb", correct: false, imageSrc: "/grb.svg", audioSrc: "/audio/hr/grb.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Coat of arms"?',
            options: [
              { text: "Grb", correct: true, imageSrc: "/grb.svg", audioSrc: "/audio/hr/grb.mp3" },
              { text: "Toranj", correct: false, imageSrc: "/toranj.svg", audioSrc: "/audio/hr/toranj.mp3" },
              { text: "Bedem", correct: false, imageSrc: "/bedem.svg", audioSrc: "/audio/hr/bedem.mp3" },
              { text: "Anđeo", correct: false, imageSrc: "/andeo.svg", audioSrc: "/audio/hr/andeo.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Grad anđela",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The little angel"',
            options: [
              { text: "Mali anđeo", correct: true, audioSrc: "/audio/hr/mali_andeo.mp3" },
              { text: "Kameni bedem", correct: false, audioSrc: "/audio/hr/kameni_bedem.mp3" },
              { text: "Visoki toranj", correct: false, audioSrc: "/audio/hr/visoki_toranj.mp3" },
              { text: "Stari grb", correct: false, audioSrc: "/audio/hr/stari_grb.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Varaždin is called the city of angels."',
            options: [
              { text: "Varaždin se zove grad anđela.", correct: true, audioSrc: "/audio/hr/varazdin_se_zove_grad_andela.mp3" },
              { text: "Bijeli bedemi okružuju stari grad.", correct: false, audioSrc: "/audio/hr/bijeli_bedemi_okruzuju_stari_grad.mp3" },
              { text: "Sat na tornju otkucava podne.", correct: false, audioSrc: "/audio/hr/sat_na_tornju_otkucava_podne.mp3" },
              { text: "Plemićki grb krasi ulazna vrata.", correct: false, audioSrc: "/audio/hr/plemicki_grb_krasi_ulazna_vrata.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "White ramparts surround the old town."',
            options: [
              { text: "Bijeli bedemi okružuju stari grad.", correct: true, audioSrc: "/audio/hr/bijeli_bedemi_okruzuju_stari_grad.mp3" },
              { text: "Varaždin se zove grad anđela.", correct: false, audioSrc: "/audio/hr/varazdin_se_zove_grad_andela.mp3" },
              { text: "Sat na tornju otkucava podne.", correct: false, audioSrc: "/audio/hr/sat_na_tornju_otkucava_podne.mp3" },
              { text: "Plemićki grb krasi ulazna vrata.", correct: false, audioSrc: "/audio/hr/plemicki_grb_krasi_ulazna_vrata.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The clock on the tower strikes noon."',
            options: [
              { text: "Sat na tornju otkucava podne.", correct: true, audioSrc: "/audio/hr/sat_na_tornju_otkucava_podne.mp3" },
              { text: "Varaždin se zove grad anđela.", correct: false, audioSrc: "/audio/hr/varazdin_se_zove_grad_andela.mp3" },
              { text: "Bijeli bedemi okružuju stari grad.", correct: false, audioSrc: "/audio/hr/bijeli_bedemi_okruzuju_stari_grad.mp3" },
              { text: "Plemićki grb krasi ulazna vrata.", correct: false, audioSrc: "/audio/hr/plemicki_grb_krasi_ulazna_vrata.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Palače i muzeji",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The museum preserves old portraits."',
            options: [
              { text: "Muzej čuva stare portrete.", correct: true, audioSrc: "/audio/hr/muzej_cuva_stare_portrete.mp3" },
              { text: "Zlatni anđeo spava na prozoru.", correct: false, audioSrc: "/audio/hr/zlatni_andeo_spava_na_prozoru.mp3" },
              { text: "Šetamo zelenim parkom oko tvrđave.", correct: false, audioSrc: "/audio/hr/setamo_zelenim_parkom_oko_tvrdave.mp3" },
              { text: "Krovovi su prekriveni crvenim crijepom.", correct: false, audioSrc: "/audio/hr/krovovi_su_prekriveni_crvenim_crijepom.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The golden angel sleeps on the window."',
            options: [
              { text: "Zlatni anđeo spava na prozoru.", correct: true, audioSrc: "/audio/hr/zlatni_andeo_spava_na_prozoru.mp3" },
              { text: "Muzej čuva stare portrete.", correct: false, audioSrc: "/audio/hr/muzej_cuva_stare_portrete.mp3" },
              { text: "Šetamo zelenim parkom oko tvrđave.", correct: false, audioSrc: "/audio/hr/setamo_zelenim_parkom_oko_tvrdave.mp3" },
              { text: "Krovovi su prekriveni crvenim crijepom.", correct: false, audioSrc: "/audio/hr/krovovi_su_prekriveni_crvenim_crijepom.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "We walk through the green park around the fortress."',
            options: [
              { text: "Šetamo zelenim parkom oko tvrđave.", correct: true, audioSrc: "/audio/hr/setamo_zelenim_parkom_oko_tvrdave.mp3" },
              { text: "Muzej čuva stare portrete.", correct: false, audioSrc: "/audio/hr/muzej_cuva_stare_portrete.mp3" },
              { text: "Zlatni anđeo spava na prozoru.", correct: false, audioSrc: "/audio/hr/zlatni_andeo_spava_na_prozoru.mp3" },
              { text: "Krovovi su prekriveni crvenim crijepom.", correct: false, audioSrc: "/audio/hr/krovovi_su_prekriveni_crvenim_crijepom.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The roofs are covered with red tiles."',
            options: [
              { text: "Krovovi su prekriveni crvenim crijepom.", correct: true, audioSrc: "/audio/hr/krovovi_su_prekriveni_crvenim_crijepom.mp3" },
              { text: "Muzej čuva stare portrete.", correct: false, audioSrc: "/audio/hr/muzej_cuva_stare_portrete.mp3" },
              { text: "Zlatni anđeo spava na prozoru.", correct: false, audioSrc: "/audio/hr/zlatni_andeo_spava_na_prozoru.mp3" },
              { text: "Šetamo zelenim parkom oko tvrđave.", correct: false, audioSrc: "/audio/hr/setamo_zelenim_parkom_oko_tvrdave.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Barokna baština",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Palaces testify to a rich past."',
            options: [
              { text: "Palače svjedoče bogatoj prošlosti.", correct: true, audioSrc: "/audio/hr/palace_svjedoce_bogatoj_proslosti.mp3" },
              { text: "Kočija prolazi pokraj gradske vijećnice.", correct: false, audioSrc: "/audio/hr/kocija_prolazi_pokraj_gradske_vijecnice.mp3" },
              { text: "Svjetiljke obasjavaju tihu uličicu.", correct: false, audioSrc: "/audio/hr/svjetiljke_obasjavaju_tihu_ulicicu.mp3" },
              { text: "Povijest Varaždina živi u kamenu.", correct: false, audioSrc: "/audio/hr/povijest_varazdina_zivi_u_kamenu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "A carriage passes by the city hall."',
            options: [
              { text: "Kočija prolazi pokraj gradske vijećnice.", correct: true, audioSrc: "/audio/hr/kocija_prolazi_pokraj_gradske_vijecnice.mp3" },
              { text: "Palače svjedoče bogatoj prošlosti.", correct: false, audioSrc: "/audio/hr/palace_svjedoce_bogatoj_proslosti.mp3" },
              { text: "Svjetiljke obasjavaju tihu uličicu.", correct: false, audioSrc: "/audio/hr/svjetiljke_obasjavaju_tihu_ulicicu.mp3" },
              { text: "Povijest Varaždina živi u kamenu.", correct: false, audioSrc: "/audio/hr/povijest_varazdina_zivi_u_kamenu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Lanterns illuminate the quiet alley."',
            options: [
              { text: "Svjetiljke obasjavaju tihu uličicu.", correct: true, audioSrc: "/audio/hr/svjetiljke_obasjavaju_tihu_ulicicu.mp3" },
              { text: "Palače svjedoče bogatoj prošlosti.", correct: false, audioSrc: "/audio/hr/palace_svjedoce_bogatoj_proslosti.mp3" },
              { text: "Kočija prolazi pokraj gradske vijećnice.", correct: false, audioSrc: "/audio/hr/kocija_prolazi_pokraj_gradske_vijecnice.mp3" },
              { text: "Povijest Varaždina živi u kamenu.", correct: false, audioSrc: "/audio/hr/povijest_varazdina_zivi_u_kamenu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The history of Varaždin lives in stone."',
            options: [
              { text: "Povijest Varaždina živi u kamenu.", correct: true, audioSrc: "/audio/hr/povijest_varazdina_zivi_u_kamenu.mp3" },
              { text: "Palače svjedoče bogatoj prošlosti.", correct: false, audioSrc: "/audio/hr/palace_svjedoce_bogatoj_proslosti.mp3" },
              { text: "Kočija prolazi pokraj gradske vijećnice.", correct: false, audioSrc: "/audio/hr/kocija_prolazi_pokraj_gradske_vijecnice.mp3" },
              { text: "Svjetiljke obasjavaju tihu uličicu.", correct: false, audioSrc: "/audio/hr/svjetiljke_obasjavaju_tihu_ulicicu.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 54: RIJEKE MURA I DRAVA (Mura & Drava Rivers)
  // ==========================================
  {
    order: 54,
    title: "Unit 54",
    description: "Rijeke Mura i Drava (Mura & Drava Rivers)",
    lessons: [
      {
        order: 1,
        title: "Život uz rijeku",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Swan"?',
            options: [
              { text: "Labud", correct: true, imageSrc: "/labud.svg", audioSrc: "/audio/hr/labud.mp3" },
              { text: "Vrba", correct: false, imageSrc: "/vrba.svg", audioSrc: "/audio/hr/vrba.mp3" },
              { text: "Splav", correct: false, imageSrc: "/splav.svg", audioSrc: "/audio/hr/splav.mp3" },
              { text: "Obala", correct: false, imageSrc: "/obala.svg", audioSrc: "/audio/hr/obala.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Willow"?',
            options: [
              { text: "Vrba", correct: true, imageSrc: "/vrba.svg", audioSrc: "/audio/hr/vrba.mp3" },
              { text: "Labud", correct: false, imageSrc: "/labud.svg", audioSrc: "/audio/hr/labud.mp3" },
              { text: "Splav", correct: false, imageSrc: "/splav.svg", audioSrc: "/audio/hr/splav.mp3" },
              { text: "Obala", correct: false, imageSrc: "/obala.svg", audioSrc: "/audio/hr/obala.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "River raft"?',
            options: [
              { text: "Splav", correct: true, imageSrc: "/splav.svg", audioSrc: "/audio/hr/splav.mp3" },
              { text: "Labud", correct: false, imageSrc: "/labud.svg", audioSrc: "/audio/hr/labud.mp3" },
              { text: "Vrba", correct: false, imageSrc: "/vrba.svg", audioSrc: "/audio/hr/vrba.mp3" },
              { text: "Obala", correct: false, imageSrc: "/obala.svg", audioSrc: "/audio/hr/obala.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Riverbank"?',
            options: [
              { text: "Obala", correct: true, imageSrc: "/obala.svg", audioSrc: "/audio/hr/obala.mp3" },
              { text: "Splav", correct: false, imageSrc: "/splav.svg", audioSrc: "/audio/hr/splav.mp3" },
              { text: "Vrba", correct: false, imageSrc: "/vrba.svg", audioSrc: "/audio/hr/vrba.mp3" },
              { text: "Labud", correct: false, imageSrc: "/labud.svg", audioSrc: "/audio/hr/labud.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Skela na Muri",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The white swan"',
            options: [
              { text: "Bijeli labud", correct: true, audioSrc: "/audio/hr/bijeli_labud.mp3" },
              { text: "Zelena vrba", correct: false, audioSrc: "/audio/hr/zelena_vrba.mp3" },
              { text: "Drvena splav", correct: false, audioSrc: "/audio/hr/drvena_splav.mp3" },
              { text: "Mirna obala", correct: false, audioSrc: "/audio/hr/mirna_obala.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "A white swan swims on the Drava."',
            options: [
              { text: "Bijeli labud pliva po Dravi.", correct: true, audioSrc: "/audio/hr/bijeli_labud_pliva_po_dravi.mp3" },
              { text: "Vrbe spuštaju grane do vode.", correct: false, audioSrc: "/audio/hr/vrbe_spustaju_grane_do_vode.mp3" },
              { text: "Drvena splav prelazi rijeku Muru.", correct: false, audioSrc: "/audio/hr/drvena_splav_prelazi_rijeku_muru.mp3" },
              { text: "Ribar sjedi na mirnoj obali.", correct: false, audioSrc: "/audio/hr/ribar_sjedi_na_mirnoj_obali.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Willows lower their branches to the water."',
            options: [
              { text: "Vrbe spuštaju grane do vode.", correct: true, audioSrc: "/audio/hr/vrbe_spustaju_grane_do_vode.mp3" },
              { text: "Bijeli labud pliva po Dravi.", correct: false, audioSrc: "/audio/hr/bijeli_labud_pliva_po_dravi.mp3" },
              { text: "Drvena splav prelazi rijeku Muru.", correct: false, audioSrc: "/audio/hr/drvena_splav_prelazi_rijeku_muru.mp3" },
              { text: "Ribar sjedi na mirnoj obali.", correct: false, audioSrc: "/audio/hr/ribar_sjedi_na_mirnoj_obali.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "A wooden raft crosses the Mura River."',
            options: [
              { text: "Drvena splav prelazi rijeku Muru.", correct: true, audioSrc: "/audio/hr/drvena_splav_prelazi_rijeku_muru.mp3" },
              { text: "Bijeli labud pliva po Dravi.", correct: false, audioSrc: "/audio/hr/bijeli_labud_pliva_po_dravi.mp3" },
              { text: "Vrbe spuštaju grane do vode.", correct: false, audioSrc: "/audio/hr/vrbe_spustaju_grane_do_vode.mp3" },
              { text: "Ribar sjedi na mirnoj obali.", correct: false, audioSrc: "/audio/hr/ribar_sjedi_na_mirnoj_obali.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Jutro uz Dravu",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Two rivers meet in the forest."',
            options: [
              { text: "Dvije rijeke spajaju se u šumi.", correct: true, audioSrc: "/audio/hr/dvije_rijeke_spajaju_se_u_sumi.mp3" },
              { text: "Jutarnja magla lebdi iznad vode.", correct: false, audioSrc: "/audio/hr/jutarnja_magla_lebdi_iznad_vode.mp3" },
              { text: "Ptice pjevaju u gustoj trsci.", correct: false, audioSrc: "/audio/hr/ptice_pjevaju_u_gustoj_trsci.mp3" },
              { text: "Voda teče tiho prema istoku.", correct: false, audioSrc: "/audio/hr/voda_tece_tiho_prema_istoku.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Morning mist floats above the water."',
            options: [
              { text: "Jutarnja magla lebdi iznad vode.", correct: true, audioSrc: "/audio/hr/jutarnja_magla_lebdi_iznad_vode.mp3" },
              { text: "Dvije rijeke spajaju se u šumi.", correct: false, audioSrc: "/audio/hr/dvije_rijeke_spajaju_se_u_sumi.mp3" },
              { text: "Ptice pjevaju u gustoj trsci.", correct: false, audioSrc: "/audio/hr/ptice_pjevaju_u_gustoj_trsci.mp3" },
              { text: "Voda teče tiho prema istoku.", correct: false, audioSrc: "/audio/hr/voda_tece_tiho_prema_istoku.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Birds sing in the dense reeds."',
            options: [
              { text: "Ptice pjevaju u gustoj trsci.", correct: true, audioSrc: "/audio/hr/ptice_pjevaju_u_gustoj_trsci.mp3" },
              { text: "Dvije rijeke spajaju se u šumi.", correct: false, audioSrc: "/audio/hr/dvije_rijeke_spajaju_se_u_sumi.mp3" },
              { text: "Jutarnja magla lebdi iznad vode.", correct: false, audioSrc: "/audio/hr/jutarnja_magla_lebdi_iznad_vode.mp3" },
              { text: "Voda teče tiho prema istoku.", correct: false, audioSrc: "/audio/hr/voda_tece_tiho_prema_istoku.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The water flows quietly toward the east."',
            options: [
              { text: "Voda teče tiho prema istoku.", correct: true, audioSrc: "/audio/hr/voda_tece_tiho_prema_istoku.mp3" },
              { text: "Dvije rijeke spajaju se u šumi.", correct: false, audioSrc: "/audio/hr/dvije_rijeke_spajaju_se_u_sumi.mp3" },
              { text: "Jutarnja magla lebdi iznad vode.", correct: false, audioSrc: "/audio/hr/jutarnja_magla_lebdi_iznad_vode.mp3" },
              { text: "Ptice pjevaju u gustoj trsci.", correct: false, audioSrc: "/audio/hr/ptice_pjevaju_u_gustoj_trsci.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Priroda sjevera",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Cyclists ride along the embankment trail."',
            options: [
              { text: "Biciklisti voze stazom uz nasip.", correct: true, audioSrc: "/audio/hr/biciklisti_voze_stazom_uz_nasip.mp3" },
              { text: "Čista priroda štiti rijetke ptice.", correct: false, audioSrc: "/audio/hr/cista_priroda_stiti_rijetke_ptice.mp3" },
              { text: "Sunce se zrcali na površini rijeke.", correct: false, audioSrc: "/audio/hr/sunce_se_zrcali_na_povrsini_rijeke.mp3" },
              { text: "Drava i Mura hrane zelene livade.", correct: false, audioSrc: "/audio/hr/drava_i_mura_hrane_zelene_livade.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Pure nature protects rare birds."',
            options: [
              { text: "Čista priroda štiti rijetke ptice.", correct: true, audioSrc: "/audio/hr/cista_priroda_stiti_rijetke_ptice.mp3" },
              { text: "Biciklisti voze stazom uz nasip.", correct: false, audioSrc: "/audio/hr/biciklisti_voze_stazom_uz_nasip.mp3" },
              { text: "Sunce se zrcali na površini rijeke.", correct: false, audioSrc: "/audio/hr/sunce_se_zrcali_na_povrsini_rijeke.mp3" },
              { text: "Drava i Mura hrane zelene livade.", correct: false, audioSrc: "/audio/hr/drava_i_mura_hrane_zelene_livade.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The sun reflects on the river surface."',
            options: [
              { text: "Sunce se zrcali na površini rijeke.", correct: true, audioSrc: "/audio/hr/sunce_se_zrcali_na_povrsini_rijeke.mp3" },
              { text: "Biciklisti voze stazom uz nasip.", correct: false, audioSrc: "/audio/hr/biciklisti_voze_stazom_uz_nasip.mp3" },
              { text: "Čista priroda štiti rijetke ptice.", correct: false, audioSrc: "/audio/hr/cista_priroda_stiti_rijetke_ptice.mp3" },
              { text: "Drava i Mura hrane zelene livade.", correct: false, audioSrc: "/audio/hr/drava_i_mura_hrane_zelene_livade.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The Drava and Mura nourish green meadows."',
            options: [
              { text: "Drava i Mura hrane zelene livade.", correct: true, audioSrc: "/audio/hr/drava_i_mura_hrane_zelene_livade.mp3" },
              { text: "Biciklisti voze stazom uz nasip.", correct: false, audioSrc: "/audio/hr/biciklisti_voze_stazom_uz_nasip.mp3" },
              { text: "Čista priroda štiti rijetke ptice.", correct: false, audioSrc: "/audio/hr/cista_priroda_stiti_rijetke_ptice.mp3" },
              { text: "Sunce se zrcali na površini rijeke.", correct: false, audioSrc: "/audio/hr/sunce_se_zrcali_na_povrsini_rijeke.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 55: MEĐIMURSKI VINOGRADI I BAŠTINA (Međimurje Vineyards & Folk Heritage)
  // ==========================================
  {
    order: 55,
    title: "Unit 55",
    description: "Međimurski vinogradi i baština (Međimurje Vineyards & Folk Heritage)",
    lessons: [
      {
        order: 1,
        title: "Blago Međimurja",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Vineyard"?',
            options: [
              { text: "Vinograd", correct: true, imageSrc: "/vinograd.svg", audioSrc: "/audio/hr/vinograd.mp3" },
              { text: "Grožđe", correct: false, imageSrc: "/grozde.svg", audioSrc: "/audio/hr/grozde.mp3" },
              { text: "Čipka", correct: false, imageSrc: "/cipka.svg", audioSrc: "/audio/hr/cipka.mp3" },
              { text: "Tambura", correct: false, imageSrc: "/tambura.svg", audioSrc: "/audio/hr/tambura.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Grapes"?',
            options: [
              { text: "Grožđe", correct: true, imageSrc: "/grozde.svg", audioSrc: "/audio/hr/grozde.mp3" },
              { text: "Vinograd", correct: false, imageSrc: "/vinograd.svg", audioSrc: "/audio/hr/vinograd.mp3" },
              { text: "Čipka", correct: false, imageSrc: "/cipka.svg", audioSrc: "/audio/hr/cipka.mp3" },
              { text: "Tambura", correct: false, imageSrc: "/tambura.svg", audioSrc: "/audio/hr/tambura.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Lace"?',
            options: [
              { text: "Čipka", correct: true, imageSrc: "/cipka.svg", audioSrc: "/audio/hr/cipka.mp3" },
              { text: "Vinograd", correct: false, imageSrc: "/vinograd.svg", audioSrc: "/audio/hr/vinograd.mp3" },
              { text: "Grožđe", correct: false, imageSrc: "/grozde.svg", audioSrc: "/audio/hr/grozde.mp3" },
              { text: "Tambura", correct: false, imageSrc: "/tambura.svg", audioSrc: "/audio/hr/tambura.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Tambura"?',
            options: [
              { text: "Tambura", correct: true, imageSrc: "/tambura.svg", audioSrc: "/audio/hr/tambura.mp3" },
              { text: "Čipka", correct: false, imageSrc: "/cipka.svg", audioSrc: "/audio/hr/cipka.mp3" },
              { text: "Grožđe", correct: false, imageSrc: "/grozde.svg", audioSrc: "/audio/hr/grozde.mp3" },
              { text: "Vinograd", correct: false, imageSrc: "/vinograd.svg", audioSrc: "/audio/hr/vinograd.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Međimurski bregi",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The green vineyard"',
            options: [
              { text: "Zeleni vinograd", correct: true, audioSrc: "/audio/hr/zeleni_vinograd.mp3" },
              { text: "Slatko grožđe", correct: false, audioSrc: "/audio/hr/slatko_grozde.mp3" },
              { text: "Bijela čipka", correct: false, audioSrc: "/audio/hr/bijela_cipka.mp3" },
              { text: "Stara tambura", correct: false, audioSrc: "/audio/hr/stara_tambura.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Međimurje hills are full of vineyards."',
            options: [
              { text: "Međimurski bregi puni su vinograda.", correct: true, audioSrc: "/audio/hr/medimurski_bregi_puni_su_vinograda.mp3" },
              { text: "Beremo slatko grožđe u košare.", correct: false, audioSrc: "/audio/hr/beremo_slatko_grozde_u_kosare.mp3" },
              { text: "Žene pletu finu bijelu čipku.", correct: false, audioSrc: "/audio/hr/zene_pletu_finu_bijelu_cipku.mp3" },
              { text: "Tambura prati staru narodnu pjesmu.", correct: false, audioSrc: "/audio/hr/tambura_prati_staru_narodnu_pjesmu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "We pick sweet grapes into baskets."',
            options: [
              { text: "Beremo slatko grožđe u košare.", correct: true, audioSrc: "/audio/hr/beremo_slatko_grozde_u_kosare.mp3" },
              { text: "Međimurski bregi puni su vinograda.", correct: false, audioSrc: "/audio/hr/medimurski_bregi_puni_su_vinograda.mp3" },
              { text: "Žene pletu finu bijelu čipku.", correct: false, audioSrc: "/audio/hr/zene_pletu_finu_bijelu_cipku.mp3" },
              { text: "Tambura prati staru narodnu pjesmu.", correct: false, audioSrc: "/audio/hr/tambura_prati_staru_narodnu_pjesmu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Women weave fine white lace."',
            options: [
              { text: "Žene pletu finu bijelu čipku.", correct: true, audioSrc: "/audio/hr/zene_pletu_finu_bijelu_cipku.mp3" },
              { text: "Međimurski bregi puni su vinograda.", correct: false, audioSrc: "/audio/hr/medimurski_bregi_puni_su_vinograda.mp3" },
              { text: "Beremo slatko grožđe u košare.", correct: false, audioSrc: "/audio/hr/beremo_slatko_grozde_u_kosare.mp3" },
              { text: "Tambura prati staru narodnu pjesmu.", correct: false, audioSrc: "/audio/hr/tambura_prati_staru_narodnu_pjesmu.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Popevka i podrumi",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The tambura accompanies an old folk song."',
            options: [
              { text: "Tambura prati staru narodnu pjesmu.", correct: true, audioSrc: "/audio/hr/tambura_prati_staru_narodnu_pjesmu.mp3" },
              { text: "Pogled s Mađerkinog brega oduzima dah.", correct: false, audioSrc: "/audio/hr/pogled_s_maderkinog_brega_oduzima_dah.mp3" },
              { text: "Domaći kruh i sir čekaju goste.", correct: false, audioSrc: "/audio/hr/domaci_kruh_i_sir_cekaju_goste.mp3" },
              { text: "Podrumi čuvaju najbolja vina sjevera.", correct: false, audioSrc: "/audio/hr/podrumi_cuvaju_najbolja_vina_sjevera.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The view from Mađerkin breg takes your breath away."',
            options: [
              { text: "Pogled s Mađerkinog brega oduzima dah.", correct: true, audioSrc: "/audio/hr/pogled_s_maderkinog_brega_oduzima_dah.mp3" },
              { text: "Tambura prati staru narodnu pjesmu.", correct: false, audioSrc: "/audio/hr/tambura_prati_staru_narodnu_pjesmu.mp3" },
              { text: "Domaći kruh i sir čekaju goste.", correct: false, audioSrc: "/audio/hr/domaci_kruh_i_sir_cekaju_goste.mp3" },
              { text: "Podrumi čuvaju najbolja vina sjevera.", correct: false, audioSrc: "/audio/hr/podrumi_cuvaju_najbolja_vina_sjevera.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Homemade bread and cheese await guests."',
            options: [
              { text: "Domaći kruh i sir čekaju goste.", correct: true, audioSrc: "/audio/hr/domaci_kruh_i_sir_cekaju_goste.mp3" },
              { text: "Pogled s Mađerkinog brega oduzima dah.", correct: false, audioSrc: "/audio/hr/pogled_s_maderkinog_brega_oduzima_dah.mp3" },
              { text: "Tambura prati staru narodnu pjesmu.", correct: false, audioSrc: "/audio/hr/tambura_prati_staru_narodnu_pjesmu.mp3" },
              { text: "Podrumi čuvaju najbolja vina sjevera.", correct: false, audioSrc: "/audio/hr/podrumi_cuvaju_najbolja_vina_sjevera.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Cellars preserve the best wines of the north."',
            options: [
              { text: "Podrumi čuvaju najbolja vina sjevera.", correct: true, audioSrc: "/audio/hr/podrumi_cuvaju_najbolja_vina_sjevera.mp3" },
              { text: "Domaći kruh i sir čekaju goste.", correct: false, audioSrc: "/audio/hr/domaci_kruh_i_sir_cekaju_goste.mp3" },
              { text: "Pogled s Mađerkinog brega oduzima dah.", correct: false, audioSrc: "/audio/hr/pogled_s_maderkinog_brega_oduzima_dah.mp3" },
              { text: "Tambura prati staru narodnu pjesmu.", correct: false, audioSrc: "/audio/hr/tambura_prati_staru_narodnu_pjesmu.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Srce sjevera",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The Međimurje folk song touches every heart."',
            options: [
              { text: "Međimurska popevka dira svako srce.", correct: true, audioSrc: "/audio/hr/medimurska_popevka_dira_svako_srce.mp3" },
              { text: "Jesen boji lišće u zlatnu boju.", correct: false, audioSrc: "/audio/hr/jesen_boji_lisce_u_zlatnu_boju.mp3" },
              { text: "Ljudi pjevaju uz zvuke tamburice.", correct: false, audioSrc: "/audio/hr/ljudi_pjevaju_uz_zvuke_tamburice.mp3" },
              { text: "Sjever Hrvatske ponosi se tradicijom.", correct: false, audioSrc: "/audio/hr/sjever_hrvatske_ponosi_se_tradicijom.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Autumn paints the leaves in golden color."',
            options: [
              { text: "Jesen boji lišće u zlatnu boju.", correct: true, audioSrc: "/audio/hr/jesen_boji_lisce_u_zlatnu_boju.mp3" },
              { text: "Međimurska popevka dira svako srce.", correct: false, audioSrc: "/audio/hr/medimurska_popevka_dira_svako_srce.mp3" },
              { text: "Ljudi pjevaju uz zvuke tamburice.", correct: false, audioSrc: "/audio/hr/ljudi_pjevaju_uz_zvuke_tamburice.mp3" },
              { text: "Sjever Hrvatske ponosi se tradicijom.", correct: false, audioSrc: "/audio/hr/sjever_hrvatske_ponosi_se_tradicijom.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "People sing to the sounds of the tamburica."',
            options: [
              { text: "Ljudi pjevaju uz zvuke tamburice.", correct: true, audioSrc: "/audio/hr/ljudi_pjevaju_uz_zvuke_tamburice.mp3" },
              { text: "Međimurska popevka dira svako srce.", correct: false, audioSrc: "/audio/hr/medimurska_popevka_dira_svako_srce.mp3" },
              { text: "Jesen boji lišće u zlatnu boju.", correct: false, audioSrc: "/audio/hr/jesen_boji_lisce_u_zlatnu_boju.mp3" },
              { text: "Sjever Hrvatske ponosi se tradicijom.", correct: false, audioSrc: "/audio/hr/sjever_hrvatske_ponosi_se_tradicijom.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Congratulations, you have completed the eleventh world!"',
            options: [
              { text: "Čestitamo, završili ste jedanaesti svijet!", correct: true, audioSrc: "/audio/hr/cestitamo_zavrsili_ste_jedanaesti_svijet.mp3" },
              { text: "Međimurska popevka dira svako srce!", correct: false, audioSrc: "/audio/hr/medimurska_popevka_dira_svako_srce.mp3" },
              { text: "Ljudi pjevaju uz zvuke tamburice!", correct: false, audioSrc: "/audio/hr/ljudi_pjevaju_uz_zvuke_tamburice.mp3" },
              { text: "Sjever Hrvatske ponosi se tradicijom!", correct: false, audioSrc: "/audio/hr/sjever_hrvatske_ponosi_se_tradicijom.mp3" },
            ],
          },
        ],
      },
    ],
  },
];

async function seedWorld11() {
  console.log("🚀 Starting World 11 (Units 51–55: Varaždin & Međimurje) Seed...");

  const courseResult = await sql`SELECT id FROM courses WHERE title = 'Croatian' LIMIT 1;`;
  if (courseResult.length === 0) {
    throw new Error("Croatian course not found in database!");
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

  console.log("\n✅ WORLD 11 SEEDED SUCCESSFULLY!");
}

seedWorld11().then(() => process.exit(0)).catch((e) => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
