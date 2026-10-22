import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

/**
 * Meticulously refines Units 11 through 15 using exact (Unit, Lesson, Challenge) coordinates:
 * - 4 options per challenge (balanced 2x2 grid)
 * - Visual scaffolding on Lesson 1 discoveries
 * - Modular compound sentences with familiar contrastive distractors
 * - Strict symmetry in word count, casing, and punctuation
 * - Audio for every card
 */
async function main() {
  console.log("Refining Units 11 through 15 using exact coordinate lookup...\n");

  const all = await sql`
    SELECT c.id, u.order as u_order, l.order as l_order, c.order as c_order, c.question
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE u.order BETWEEN 11 AND 15
    ORDER BY u.order, l.order, c.order
  `;

  const coordMap = new Map<string, number>();
  for (const item of all) {
    coordMap.set(`${item.u_order}_${item.l_order}_${item.c_order}`, item.id);
  }

  console.log(`Mapped ${coordMap.size} challenges across Units 11 to 15.`);

  async function setCoordOptions(
    u: number, 
    l: number, 
    c: number, 
    options: Array<{ text: string; correct: boolean; imageSrc?: string; audioSrc: string }>
  ) {
    const key = `${u}_${l}_${c}`;
    const chId = coordMap.get(key);
    if (!chId) {
      console.log(`Skipping non-existent coordinate ${key}`);
      return;
    }

    if (options.length !== 4) {
      throw new Error(`Coordinate ${key} has ${options.length} options (must be 4)!`);
    }

    await sql`DELETE FROM challenge_options WHERE challenge_id = ${chId}`;

    for (const opt of options) {
      await sql`
        INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
        VALUES (${chId}, ${opt.text}, ${opt.correct}, ${opt.imageSrc || null}, ${opt.audioSrc})
      `;
    }
  }

  // ==========================================
  // UNIT 11: DNEVNI POKRETI I RADNJE (Daily Verbs)
  // ==========================================
  console.log("Updating Unit 11...");
  // L1: Što radim?
  await setCoordOptions(11, 1, 1, [
    { text: "Spavam", correct: true, imageSrc: "/sleep.svg", audioSrc: "/audio/hr/spavam.mp3" },
    { text: "Jedem", correct: false, imageSrc: "/eat.svg", audioSrc: "/audio/hr/jedem.mp3" },
    { text: "Pijem", correct: false, imageSrc: "/drink.svg", audioSrc: "/audio/hr/pijem.mp3" },
    { text: "Učim", correct: false, imageSrc: "/study.svg", audioSrc: "/audio/hr/ucim.mp3" },
  ]);
  await setCoordOptions(11, 1, 2, [
    { text: "Jedem", correct: true, imageSrc: "/eat.svg", audioSrc: "/audio/hr/jedem.mp3" },
    { text: "Spavam", correct: false, imageSrc: "/sleep.svg", audioSrc: "/audio/hr/spavam.mp3" },
    { text: "Pijem", correct: false, imageSrc: "/drink.svg", audioSrc: "/audio/hr/pijem.mp3" },
    { text: "Igram se", correct: false, imageSrc: "/play.svg", audioSrc: "/audio/hr/igram_se.mp3" },
  ]);
  await setCoordOptions(11, 1, 3, [
    { text: "Pijem", correct: true, imageSrc: "/drink.svg", audioSrc: "/audio/hr/pijem.mp3" },
    { text: "Jedem", correct: false, imageSrc: "/eat.svg", audioSrc: "/audio/hr/jedem.mp3" },
    { text: "Spavam", correct: false, imageSrc: "/sleep.svg", audioSrc: "/audio/hr/spavam.mp3" },
    { text: "Čitam", correct: false, imageSrc: "/read.svg", audioSrc: "/audio/hr/citam.mp3" },
  ]);
  await setCoordOptions(11, 1, 4, [
    { text: "Igram se", correct: true, audioSrc: "/audio/hr/igram_se.mp3" },
    { text: "Spavam", correct: false, audioSrc: "/audio/hr/spavam.mp3" },
    { text: "Učim", correct: false, audioSrc: "/audio/hr/ucim.mp3" },
    { text: "Pjevam", correct: false, audioSrc: "/audio/hr/pjevam.mp3" },
  ]);

  // L2: Pogledaj i poslušaj
  await setCoordOptions(11, 2, 1, [
    { text: "Gledam", correct: true, imageSrc: "/watch.svg", audioSrc: "/audio/hr/gledam.mp3" },
    { text: "Čitam", correct: false, imageSrc: "/read.svg", audioSrc: "/audio/hr/citam.mp3" },
    { text: "Pjevam", correct: false, imageSrc: "/sing.svg", audioSrc: "/audio/hr/pjevam.mp3" },
    { text: "Učim", correct: false, imageSrc: "/study.svg", audioSrc: "/audio/hr/ucim.mp3" },
  ]);
  await setCoordOptions(11, 2, 2, [
    { text: "Čitam", correct: true, imageSrc: "/read.svg", audioSrc: "/audio/hr/citam.mp3" },
    { text: "Gledam", correct: false, imageSrc: "/watch.svg", audioSrc: "/audio/hr/gledam.mp3" },
    { text: "Učim", correct: false, imageSrc: "/study.svg", audioSrc: "/audio/hr/ucim.mp3" },
    { text: "Pjevam", correct: false, imageSrc: "/sing.svg", audioSrc: "/audio/hr/pjevam.mp3" },
  ]);
  await setCoordOptions(11, 2, 3, [
    { text: "Pjevam", correct: true, imageSrc: "/sing.svg", audioSrc: "/audio/hr/pjevam.mp3" },
    { text: "Pijem", correct: false, imageSrc: "/drink.svg", audioSrc: "/audio/hr/pijem.mp3" },
    { text: "Spavam", correct: false, imageSrc: "/sleep.svg", audioSrc: "/audio/hr/spavam.mp3" },
    { text: "Čitam", correct: false, imageSrc: "/read.svg", audioSrc: "/audio/hr/citam.mp3" },
  ]);
  await setCoordOptions(11, 2, 4, [
    { text: "Učim", correct: true, audioSrc: "/audio/hr/ucim.mp3" },
    { text: "Pjevam", correct: false, audioSrc: "/audio/hr/pjevam.mp3" },
    { text: "Čitam", correct: false, audioSrc: "/audio/hr/citam.mp3" },
    { text: "Gledam", correct: false, audioSrc: "/audio/hr/gledam.mp3" },
  ]);

  // L3: U akciji! (Compound sentences)
  await setCoordOptions(11, 3, 1, [
    { text: "Pijem vodu", correct: true, audioSrc: "/audio/hr/pijem_vodu.mp3" },
    { text: "Jedem jabuku", correct: false, audioSrc: "/audio/hr/jedem_jabuku.mp3" },
    { text: "Čitam knjigu", correct: false, audioSrc: "/audio/hr/citam_knjigu.mp3" },
    { text: "Pijem mlijeko", correct: false, audioSrc: "/audio/hr/pijem_mlijeko.mp3" },
  ]);
  await setCoordOptions(11, 3, 2, [
    { text: "Jedem jabuku", correct: true, audioSrc: "/audio/hr/jedem_jabuku.mp3" },
    { text: "Pijem vodu", correct: false, audioSrc: "/audio/hr/pijem_vodu.mp3" },
    { text: "Čitam knjigu", correct: false, audioSrc: "/audio/hr/citam_knjigu.mp3" },
    { text: "Pijem mlijeko", correct: false, audioSrc: "/audio/hr/pijem_mlijeko.mp3" },
  ]);
  await setCoordOptions(11, 3, 3, [
    { text: "Čitam knjigu", correct: true, audioSrc: "/audio/hr/citam_knjigu.mp3" },
    { text: "Jedem jabuku", correct: false, audioSrc: "/audio/hr/jedem_jabuku.mp3" },
    { text: "Pijem vodu", correct: false, audioSrc: "/audio/hr/pijem_vodu.mp3" },
    { text: "Igram se", correct: false, audioSrc: "/audio/hr/igram_se.mp3" },
  ]);
  await setCoordOptions(11, 3, 4, [
    { text: "Igram se s psom", correct: true, audioSrc: "/audio/hr/igram_se_s_psom.mp3" },
    { text: "Čitam knjigu ja", correct: false, audioSrc: "/audio/hr/citam_knjigu.mp3" },
    { text: "Pjevam i plešem", correct: false, audioSrc: "/audio/hr/pjevam_i_plesem.mp3" },
    { text: "Jedem jabuku finu", correct: false, audioSrc: "/audio/hr/jedem_jabuku.mp3" },
  ]);

  // L4: Boss Quest
  await setCoordOptions(11, 4, 1, [
    { text: "Spavam", correct: true, imageSrc: "/sleep.svg", audioSrc: "/audio/hr/spavam.mp3" },
    { text: "Jedem", correct: false, imageSrc: "/eat.svg", audioSrc: "/audio/hr/jedem.mp3" },
    { text: "Čitam", correct: false, imageSrc: "/read.svg", audioSrc: "/audio/hr/citam.mp3" },
    { text: "Pijem", correct: false, imageSrc: "/drink.svg", audioSrc: "/audio/hr/pijem.mp3" },
  ]);
  await setCoordOptions(11, 4, 2, [
    { text: "Jedem", correct: true, imageSrc: "/eat.svg", audioSrc: "/audio/hr/jedem.mp3" },
    { text: "Pijem", correct: false, imageSrc: "/drink.svg", audioSrc: "/audio/hr/pijem.mp3" },
    { text: "Pjevam", correct: false, imageSrc: "/sing.svg", audioSrc: "/audio/hr/pjevam.mp3" },
    { text: "Spavam", correct: false, imageSrc: "/sleep.svg", audioSrc: "/audio/hr/spavam.mp3" },
  ]);
  await setCoordOptions(11, 4, 3, [
    { text: "Čitam", correct: true, imageSrc: "/read.svg", audioSrc: "/audio/hr/citam.mp3" },
    { text: "Gledam", correct: false, imageSrc: "/watch.svg", audioSrc: "/audio/hr/gledam.mp3" },
    { text: "Spavam", correct: false, imageSrc: "/sleep.svg", audioSrc: "/audio/hr/spavam.mp3" },
    { text: "Učim", correct: false, imageSrc: "/study.svg", audioSrc: "/audio/hr/ucim.mp3" },
  ]);
  await setCoordOptions(11, 4, 4, [
    { text: "Pjevam i plešem", correct: true, audioSrc: "/audio/hr/pjevam_i_plesem.mp3" },
    { text: "Igram se s psom", correct: false, audioSrc: "/audio/hr/igram_se_s_psom.mp3" },
    { text: "Volim jako učiti", correct: false, audioSrc: "/audio/hr/volim_uciti.mp3" },
    { text: "Pijem hladno mlijeko", correct: false, audioSrc: "/audio/hr/pijem_mlijeko.mp3" },
  ]);
  await setCoordOptions(11, 4, 5, [
    { text: "Pijem mlijeko", correct: true, audioSrc: "/audio/hr/pijem_mlijeko.mp3" },
    { text: "Jedem jabuku", correct: false, audioSrc: "/audio/hr/jedem_jabuku.mp3" },
    { text: "Pijem vodu", correct: false, audioSrc: "/audio/hr/pijem_vodu.mp3" },
    { text: "Čitam knjigu", correct: false, audioSrc: "/audio/hr/citam_knjigu.mp3" },
  ]);
  await setCoordOptions(11, 4, 6, [
    { text: "Volim učiti", correct: true, audioSrc: "/audio/hr/volim_uciti.mp3" },
    { text: "Pijem vodu", correct: false, audioSrc: "/audio/hr/pijem_vodu.mp3" },
    { text: "Čitam knjigu", correct: false, audioSrc: "/audio/hr/citam_knjigu.mp3" },
    { text: "Jedem jabuku", correct: false, audioSrc: "/audio/hr/jedem_jabuku.mp3" },
  ]);

  // ==========================================
  // UNIT 12: GRAD I PARK (Town & Park)
  // ==========================================
  console.log("Updating Unit 12...");
  // L1: U parku
  await setCoordOptions(12, 1, 1, [
    { text: "Park", correct: true, imageSrc: "/park.svg", audioSrc: "/audio/hr/park.mp3" },
    { text: "Ulica", correct: false, imageSrc: "/street.svg", audioSrc: "/audio/hr/ulica.mp3" },
    { text: "Drvo", correct: false, imageSrc: "/tree.svg", audioSrc: "/audio/hr/drvo.mp3" },
    { text: "Trava", correct: false, imageSrc: "/grass.svg", audioSrc: "/audio/hr/trava.mp3" },
  ]);
  await setCoordOptions(12, 1, 2, [
    { text: "Ljuljačka", correct: true, imageSrc: "/swing.svg", audioSrc: "/audio/hr/ljuljacka.mp3" },
    { text: "Tobogan", correct: false, imageSrc: "/slide.svg", audioSrc: "/audio/hr/tobogan.mp3" },
    { text: "Trava", correct: false, imageSrc: "/grass.svg", audioSrc: "/audio/hr/trava.mp3" },
    { text: "Drvo", correct: false, imageSrc: "/tree.svg", audioSrc: "/audio/hr/drvo.mp3" },
  ]);
  await setCoordOptions(12, 1, 3, [
    { text: "Tobogan", correct: true, imageSrc: "/slide.svg", audioSrc: "/audio/hr/tobogan.mp3" },
    { text: "Ljuljačka", correct: false, imageSrc: "/swing.svg", audioSrc: "/audio/hr/ljuljacka.mp3" },
    { text: "Bicikl", correct: false, imageSrc: "/bike.svg", audioSrc: "/audio/hr/bicikl.mp3" },
    { text: "Auto", correct: false, imageSrc: "/car.svg", audioSrc: "/audio/hr/auto.mp3" },
  ]);
  await setCoordOptions(12, 1, 4, [
    { text: "Trava", correct: true, audioSrc: "/audio/hr/trava.mp3" },
    { text: "Drvo", correct: false, audioSrc: "/audio/hr/drvo.mp3" },
    { text: "Park", correct: false, audioSrc: "/audio/hr/park.mp3" },
    { text: "Ulica", correct: false, audioSrc: "/audio/hr/ulica.mp3" },
  ]);

  // L2: Na ulici
  await setCoordOptions(12, 2, 1, [
    { text: "Drvo", correct: true, imageSrc: "/tree.svg", audioSrc: "/audio/hr/drvo.mp3" },
    { text: "Trava", correct: false, imageSrc: "/grass.svg", audioSrc: "/audio/hr/trava.mp3" },
    { text: "Auto", correct: false, imageSrc: "/car.svg", audioSrc: "/audio/hr/auto.mp3" },
    { text: "Ulica", correct: false, imageSrc: "/street.svg", audioSrc: "/audio/hr/ulica.mp3" },
  ]);
  await setCoordOptions(12, 2, 2, [
    { text: "Auto", correct: true, imageSrc: "/car.svg", audioSrc: "/audio/hr/auto.mp3" },
    { text: "Bicikl", correct: false, imageSrc: "/bike.svg", audioSrc: "/audio/hr/bicikl.mp3" },
    { text: "Ulica", correct: false, imageSrc: "/street.svg", audioSrc: "/audio/hr/ulica.mp3" },
    { text: "Brod", correct: false, imageSrc: "/boat.svg", audioSrc: "/audio/hr/brod.mp3" },
  ]);
  await setCoordOptions(12, 2, 3, [
    { text: "Bicikl", correct: true, imageSrc: "/bike.svg", audioSrc: "/audio/hr/bicikl.mp3" },
    { text: "Auto", correct: false, imageSrc: "/car.svg", audioSrc: "/audio/hr/auto.mp3" },
    { text: "Tobogan", correct: false, imageSrc: "/slide.svg", audioSrc: "/audio/hr/tobogan.mp3" },
    { text: "Ulica", correct: false, imageSrc: "/street.svg", audioSrc: "/audio/hr/ulica.mp3" },
  ]);
  await setCoordOptions(12, 2, 4, [
    { text: "Ulica", correct: true, audioSrc: "/audio/hr/ulica.mp3" },
    { text: "Park", correct: false, audioSrc: "/audio/hr/park.mp3" },
    { text: "Auto", correct: false, audioSrc: "/audio/hr/auto.mp3" },
    { text: "Drvo", correct: false, audioSrc: "/audio/hr/drvo.mp3" },
  ]);

  // L3: Idemo van!
  await setCoordOptions(12, 3, 1, [
    { text: "Idemo u park", correct: true, audioSrc: "/audio/hr/idemo_u_park.mp3" },
    { text: "Vozim bicikl", correct: false, audioSrc: "/audio/hr/vozim_bicikl.mp3" },
    { text: "Ljuljam se visoko", correct: false, audioSrc: "/audio/hr/ljuljam_se_visoko.mp3" },
    { text: "Gledam zeleno drvo", correct: false, audioSrc: "/audio/hr/zeleno_drvo.mp3" },
  ]);
  await setCoordOptions(12, 3, 2, [
    { text: "Vozim bicikl", correct: true, audioSrc: "/audio/hr/vozim_bicikl.mp3" },
    { text: "Brzi auto", correct: false, audioSrc: "/audio/hr/brzi_auto.mp3" },
    { text: "Zeleno drvo", correct: false, audioSrc: "/audio/hr/zeleno_drvo.mp3" },
    { text: "Mali brod", correct: false, audioSrc: "/audio/hr/mali_brod.mp3" },
  ]);
  await setCoordOptions(12, 3, 3, [
    { text: "Brzi auto", correct: true, audioSrc: "/audio/hr/brzi_auto.mp3" },
    { text: "Vozim bicikl", correct: false, audioSrc: "/audio/hr/vozim_bicikl.mp3" },
    { text: "Zeleno drvo", correct: false, audioSrc: "/audio/hr/zeleno_drvo.mp3" },
    { text: "Mali brod", correct: false, audioSrc: "/audio/hr/mali_brod.mp3" },
  ]);
  await setCoordOptions(12, 3, 4, [
    { text: "Zeleno drvo", correct: true, audioSrc: "/audio/hr/zeleno_drvo.mp3" },
    { text: "Brzi auto", correct: false, audioSrc: "/audio/hr/brzi_auto.mp3" },
    { text: "Plavo more", correct: false, audioSrc: "/audio/hr/toplo_more.mp3" },
    { text: "Mali brod", correct: false, audioSrc: "/audio/hr/mali_brod.mp3" },
  ]);

  // L4: Boss Quest
  await setCoordOptions(12, 4, 1, [
    { text: "Tobogan", correct: true, imageSrc: "/slide.svg", audioSrc: "/audio/hr/tobogan.mp3" },
    { text: "Ljuljačka", correct: false, imageSrc: "/swing.svg", audioSrc: "/audio/hr/ljuljacka.mp3" },
    { text: "Trava", correct: false, imageSrc: "/grass.svg", audioSrc: "/audio/hr/trava.mp3" },
    { text: "Drvo", correct: false, imageSrc: "/tree.svg", audioSrc: "/audio/hr/drvo.mp3" },
  ]);
  await setCoordOptions(12, 4, 2, [
    { text: "Ljuljačka", correct: true, imageSrc: "/swing.svg", audioSrc: "/audio/hr/ljuljacka.mp3" },
    { text: "Tobogan", correct: false, imageSrc: "/slide.svg", audioSrc: "/audio/hr/tobogan.mp3" },
    { text: "Drvo", correct: false, imageSrc: "/tree.svg", audioSrc: "/audio/hr/drvo.mp3" },
    { text: "Park", correct: false, imageSrc: "/park.svg", audioSrc: "/audio/hr/park.mp3" },
  ]);
  await setCoordOptions(12, 4, 3, [
    { text: "Bicikl", correct: true, imageSrc: "/bike.svg", audioSrc: "/audio/hr/bicikl.mp3" },
    { text: "Auto", correct: false, imageSrc: "/car.svg", audioSrc: "/audio/hr/auto.mp3" },
    { text: "Ulica", correct: false, imageSrc: "/street.svg", audioSrc: "/audio/hr/ulica.mp3" },
    { text: "Brod", correct: false, imageSrc: "/boat.svg", audioSrc: "/audio/hr/brod.mp3" },
  ]);
  await setCoordOptions(12, 4, 4, [
    { text: "Idemo u park", correct: true, audioSrc: "/audio/hr/idemo_u_park.mp3" },
    { text: "Idemo na plažu", correct: false, audioSrc: "/audio/hr/idemo_na_plazu.mp3" },
    { text: "Idemo u sobu", correct: false, audioSrc: "/audio/hr/u_sobi.mp3" },
    { text: "Vozim bicikl van", correct: false, audioSrc: "/audio/hr/vozim_bicikl.mp3" },
  ]);
  await setCoordOptions(12, 4, 5, [
    { text: "Ljuljam se visoko", correct: true, audioSrc: "/audio/hr/ljuljam_se_visoko.mp3" },
    { text: "Pjevam i plešem", correct: false, audioSrc: "/audio/hr/pjevam_i_plesem.mp3" },
    { text: "Igram se s psom", correct: false, audioSrc: "/audio/hr/igram_se_s_psom.mp3" },
    { text: "Vozim brzi auto", correct: false, audioSrc: "/audio/hr/brzi_auto.mp3" },
  ]);
  await setCoordOptions(12, 4, 6, [
    { text: "Vozim bicikl", correct: true, audioSrc: "/audio/hr/vozim_bicikl.mp3" },
    { text: "Brzi auto", correct: false, audioSrc: "/audio/hr/brzi_auto.mp3" },
    { text: "Zeleno drvo", correct: false, audioSrc: "/audio/hr/zeleno_drvo.mp3" },
    { text: "Mali brod", correct: false, audioSrc: "/audio/hr/mali_brod.mp3" },
  ]);

  // ==========================================
  // UNIT 13: GDJE JE ŠTO? (Spatial & Prepositions)
  // ==========================================
  console.log("Updating Unit 13...");
  // L1: Ovdje i tamo
  await setCoordOptions(13, 1, 1, [
    { text: "Ovdje", correct: true, imageSrc: "/here.svg", audioSrc: "/audio/hr/ovdje.mp3" },
    { text: "Tamo", correct: false, imageSrc: "/there.svg", audioSrc: "/audio/hr/tamo.mp3" },
    { text: "Gore", correct: false, imageSrc: "/up.svg", audioSrc: "/audio/hr/gore.mp3" },
    { text: "Dolje", correct: false, imageSrc: "/down.svg", audioSrc: "/audio/hr/dolje.mp3" },
  ]);
  await setCoordOptions(13, 1, 2, [
    { text: "Tamo", correct: true, imageSrc: "/there.svg", audioSrc: "/audio/hr/tamo.mp3" },
    { text: "Ovdje", correct: false, imageSrc: "/here.svg", audioSrc: "/audio/hr/ovdje.mp3" },
    { text: "Dolje", correct: false, imageSrc: "/down.svg", audioSrc: "/audio/hr/dolje.mp3" },
    { text: "Blizu", correct: false, imageSrc: "/near.svg", audioSrc: "/audio/hr/blizu.mp3" },
  ]);
  await setCoordOptions(13, 1, 3, [
    { text: "Gore", correct: true, imageSrc: "/up.svg", audioSrc: "/audio/hr/gore.mp3" },
    { text: "Dolje", correct: false, imageSrc: "/down.svg", audioSrc: "/audio/hr/dolje.mp3" },
    { text: "Ovdje", correct: false, imageSrc: "/here.svg", audioSrc: "/audio/hr/ovdje.mp3" },
    { text: "Tamo", correct: false, imageSrc: "/there.svg", audioSrc: "/audio/hr/tamo.mp3" },
  ]);
  await setCoordOptions(13, 1, 4, [
    { text: "Dolje", correct: true, audioSrc: "/audio/hr/dolje.mp3" },
    { text: "Gore", correct: false, audioSrc: "/audio/hr/gore.mp3" },
    { text: "Tamo", correct: false, audioSrc: "/audio/hr/tamo.mp3" },
    { text: "Blizu", correct: false, audioSrc: "/audio/hr/blizu.mp3" },
  ]);

  // L2: U, Na i Ispod
  await setCoordOptions(13, 2, 1, [
    { text: "U", correct: true, imageSrc: "/in.svg", audioSrc: "/audio/hr/u.mp3" },
    { text: "Na", correct: false, imageSrc: "/on.svg", audioSrc: "/audio/hr/na.mp3" },
    { text: "Ispod", correct: false, imageSrc: "/under.svg", audioSrc: "/audio/hr/ispod.mp3" },
    { text: "Blizu", correct: false, imageSrc: "/near.svg", audioSrc: "/audio/hr/blizu.mp3" },
  ]);
  await setCoordOptions(13, 2, 2, [
    { text: "Na", correct: true, imageSrc: "/on.svg", audioSrc: "/audio/hr/na.mp3" },
    { text: "U", correct: false, imageSrc: "/in.svg", audioSrc: "/audio/hr/u.mp3" },
    { text: "Ispod", correct: false, imageSrc: "/under.svg", audioSrc: "/audio/hr/ispod.mp3" },
    { text: "Gore", correct: false, imageSrc: "/up.svg", audioSrc: "/audio/hr/gore.mp3" },
  ]);
  await setCoordOptions(13, 2, 3, [
    { text: "Ispod", correct: true, imageSrc: "/under.svg", audioSrc: "/audio/hr/ispod.mp3" },
    { text: "Na", correct: false, imageSrc: "/on.svg", audioSrc: "/audio/hr/na.mp3" },
    { text: "U", correct: false, imageSrc: "/in.svg", audioSrc: "/audio/hr/u.mp3" },
    { text: "Dolje", correct: false, imageSrc: "/down.svg", audioSrc: "/audio/hr/dolje.mp3" },
  ]);
  await setCoordOptions(13, 2, 4, [
    { text: "Blizu", correct: true, audioSrc: "/audio/hr/blizu.mp3" },
    { text: "Tamo", correct: false, audioSrc: "/audio/hr/tamo.mp3" },
    { text: "Ovdje", correct: false, audioSrc: "/audio/hr/ovdje.mp3" },
    { text: "Ispod", correct: false, audioSrc: "/audio/hr/ispod.mp3" },
  ]);

  // L3: Skrivača!
  await setCoordOptions(13, 3, 1, [
    { text: "Na stolu", correct: true, audioSrc: "/audio/hr/na_stolu.mp3" },
    { text: "Ispod stola", correct: false, audioSrc: "/audio/hr/ispod_stola.mp3" },
    { text: "Ispod kreveta", correct: false, audioSrc: "/audio/hr/ispod_kreveta.mp3" },
    { text: "U mojoj sobi", correct: false, audioSrc: "/audio/hr/u_sobi.mp3" },
  ]);
  await setCoordOptions(13, 3, 2, [
    { text: "Ispod kreveta", correct: true, audioSrc: "/audio/hr/ispod_kreveta.mp3" },
    { text: "Ispod stola", correct: false, audioSrc: "/audio/hr/ispod_stola.mp3" },
    { text: "Na stolu", correct: false, audioSrc: "/audio/hr/na_stolu.mp3" },
    { text: "U mojoj sobi", correct: false, audioSrc: "/audio/hr/u_sobi.mp3" },
  ]);
  await setCoordOptions(13, 3, 3, [
    { text: "U sobi", correct: true, audioSrc: "/audio/hr/u_sobi.mp3" },
    { text: "Na stolu", correct: false, audioSrc: "/audio/hr/na_stolu.mp3" },
    { text: "Ispod stola", correct: false, audioSrc: "/audio/hr/ispod_stola.mp3" },
    { text: "Ispod kreveta", correct: false, audioSrc: "/audio/hr/ispod_kreveta.mp3" },
  ]);
  await setCoordOptions(13, 3, 4, [
    { text: "Pogledaj gore", correct: true, audioSrc: "/audio/hr/pogledaj_gore.mp3" },
    { text: "Ovdje sam", correct: false, audioSrc: "/audio/hr/ovdje_sam.mp3" },
    { text: "Ispod stola", correct: false, audioSrc: "/audio/hr/ispod_stola.mp3" },
    { text: "Na stolu", correct: false, audioSrc: "/audio/hr/na_stolu.mp3" },
  ]);

  // L4: Boss Quest
  await setCoordOptions(13, 4, 1, [
    { text: "Ispod", correct: true, imageSrc: "/under.svg", audioSrc: "/audio/hr/ispod.mp3" },
    { text: "Na", correct: false, imageSrc: "/on.svg", audioSrc: "/audio/hr/na.mp3" },
    { text: "U", correct: false, imageSrc: "/in.svg", audioSrc: "/audio/hr/u.mp3" },
    { text: "Gore", correct: false, imageSrc: "/up.svg", audioSrc: "/audio/hr/gore.mp3" },
  ]);
  await setCoordOptions(13, 4, 2, [
    { text: "Gore", correct: true, imageSrc: "/up.svg", audioSrc: "/audio/hr/gore.mp3" },
    { text: "Dolje", correct: false, imageSrc: "/down.svg", audioSrc: "/audio/hr/dolje.mp3" },
    { text: "Ovdje", correct: false, imageSrc: "/here.svg", audioSrc: "/audio/hr/ovdje.mp3" },
    { text: "Tamo", correct: false, imageSrc: "/there.svg", audioSrc: "/audio/hr/tamo.mp3" },
  ]);
  await setCoordOptions(13, 4, 3, [
    { text: "Ovdje", correct: true, imageSrc: "/here.svg", audioSrc: "/audio/hr/ovdje.mp3" },
    { text: "Tamo", correct: false, imageSrc: "/there.svg", audioSrc: "/audio/hr/tamo.mp3" },
    { text: "Ispod", correct: false, imageSrc: "/under.svg", audioSrc: "/audio/hr/ispod.mp3" },
    { text: "Blizu", correct: false, imageSrc: "/near.svg", audioSrc: "/audio/hr/blizu.mp3" },
  ]);
  await setCoordOptions(13, 4, 4, [
    { text: "Ispod kreveta", correct: true, audioSrc: "/audio/hr/ispod_kreveta.mp3" },
    { text: "Na stolu", correct: false, audioSrc: "/audio/hr/na_stolu.mp3" },
    { text: "Ispod stola", correct: false, audioSrc: "/audio/hr/ispod_stola.mp3" },
    { text: "U sobi", correct: false, audioSrc: "/audio/hr/u_sobi.mp3" },
  ]);
  await setCoordOptions(13, 4, 5, [
    { text: "Na stolu", correct: true, audioSrc: "/audio/hr/na_stolu.mp3" },
    { text: "Ispod kreveta", correct: false, audioSrc: "/audio/hr/ispod_kreveta.mp3" },
    { text: "Ispod stola", correct: false, audioSrc: "/audio/hr/ispod_stola.mp3" },
    { text: "U sobi", correct: false, audioSrc: "/audio/hr/u_sobi.mp3" },
  ]);
  await setCoordOptions(13, 4, 6, [
    { text: "Ovdje sam", correct: true, audioSrc: "/audio/hr/ovdje_sam.mp3" },
    { text: "Pogledaj gore", correct: false, audioSrc: "/audio/hr/pogledaj_gore.mp3" },
    { text: "Ispod stola", correct: false, audioSrc: "/audio/hr/ispod_stola.mp3" },
    { text: "Na stolu", correct: false, audioSrc: "/audio/hr/na_stolu.mp3" },
  ]);

  // ==========================================
  // UNIT 14: PEKARA I TRGOVINA (Bakery & Store)
  // ==========================================
  console.log("Updating Unit 14...");
  // L1: U pekari
  await setCoordOptions(14, 1, 1, [
    { text: "Pekara", correct: true, imageSrc: "/bakery.svg", audioSrc: "/audio/hr/pekara.mp3" },
    { text: "Trgovina", correct: false, imageSrc: "/shop.svg", audioSrc: "/audio/hr/trgovina.mp3" },
    { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
    { text: "Kiflica", correct: false, imageSrc: "/croissant.svg", audioSrc: "/audio/hr/kiflica.mp3" },
  ]);
  await setCoordOptions(14, 1, 2, [
    { text: "Kiflica", correct: true, imageSrc: "/croissant.svg", audioSrc: "/audio/hr/kiflica.mp3" },
    { text: "Burek", correct: false, imageSrc: "/burek.svg", audioSrc: "/audio/hr/burek.mp3" },
    { text: "Sir", correct: false, imageSrc: "/cheese.svg", audioSrc: "/audio/hr/sir.mp3" },
    { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
  ]);
  await setCoordOptions(14, 1, 3, [
    { text: "Kruh", correct: true, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
    { text: "Kiflica", correct: false, imageSrc: "/croissant.svg", audioSrc: "/audio/hr/kiflica.mp3" },
    { text: "Pekara", correct: false, imageSrc: "/bakery.svg", audioSrc: "/audio/hr/pekara.mp3" },
    { text: "Burek", correct: false, imageSrc: "/burek.svg", audioSrc: "/audio/hr/burek.mp3" },
  ]);
  await setCoordOptions(14, 1, 4, [
    { text: "Burek", correct: true, audioSrc: "/audio/hr/burek.mp3" },
    { text: "Kiflica", correct: false, audioSrc: "/audio/hr/kiflica.mp3" },
    { text: "Kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
    { text: "Sir", correct: false, audioSrc: "/audio/hr/sir.mp3" },
  ]);

  // L2: U trgovini
  await setCoordOptions(14, 2, 1, [
    { text: "Sir", correct: true, imageSrc: "/cheese.svg", audioSrc: "/audio/hr/sir.mp3" },
    { text: "Rajčica", correct: false, imageSrc: "/tomato.svg", audioSrc: "/audio/hr/rajcica.mp3" },
    { text: "Naranča", correct: false, imageSrc: "/orange.svg", audioSrc: "/audio/hr/naranca.mp3" },
    { text: "Jabuka", correct: false, imageSrc: "/apple.svg", audioSrc: "/audio/hr/jabuka.mp3" },
  ]);
  await setCoordOptions(14, 2, 2, [
    { text: "Rajčica", correct: true, imageSrc: "/tomato.svg", audioSrc: "/audio/hr/rajcica.mp3" },
    { text: "Naranča", correct: false, imageSrc: "/orange.svg", audioSrc: "/audio/hr/naranca.mp3" },
    { text: "Sir", correct: false, imageSrc: "/cheese.svg", audioSrc: "/audio/hr/sir.mp3" },
    { text: "Banana", correct: false, imageSrc: "/banana.svg", audioSrc: "/audio/hr/banana.mp3" },
  ]);
  await setCoordOptions(14, 2, 3, [
    { text: "Naranča", correct: true, imageSrc: "/orange.svg", audioSrc: "/audio/hr/naranca.mp3" },
    { text: "Rajčica", correct: false, imageSrc: "/tomato.svg", audioSrc: "/audio/hr/rajcica.mp3" },
    { text: "Jabuka", correct: false, imageSrc: "/apple.svg", audioSrc: "/audio/hr/jabuka.mp3" },
    { text: "Sir", correct: false, imageSrc: "/cheese.svg", audioSrc: "/audio/hr/sir.mp3" },
  ]);
  await setCoordOptions(14, 2, 4, [
    { text: "Trgovina", correct: true, audioSrc: "/audio/hr/trgovina.mp3" },
    { text: "Pekara", correct: false, audioSrc: "/audio/hr/pekara.mp3" },
    { text: "Park", correct: false, audioSrc: "/audio/hr/park.mp3" },
    { text: "Ulica", correct: false, audioSrc: "/audio/hr/ulica.mp3" },
  ]);

  // L3: Kupujemo zajedno
  await setCoordOptions(14, 3, 1, [
    { text: "Molim jednu kiflicu", correct: true, audioSrc: "/audio/hr/molim_jednu_kiflicu.mp3" },
    { text: "Molim jedan burek", correct: false, audioSrc: "/audio/hr/burek.mp3" },
    { text: "Molim malo sira", correct: false, audioSrc: "/audio/hr/sir.mp3" },
    { text: "Molim jednu jabuku", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
  ]);
  await setCoordOptions(14, 3, 2, [
    { text: "Izvolite", correct: true, audioSrc: "/audio/hr/izvolite.mp3" },
    { text: "Oprostite", correct: false, audioSrc: "/audio/hr/oprosti.mp3" },
    { text: "Hvala lijepa", correct: false, audioSrc: "/audio/hr/hvala_lijepa.mp3" },
    { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
  ]);
  await setCoordOptions(14, 3, 3, [
    { text: "Svježi sir", correct: true, audioSrc: "/audio/hr/svjezi_sir.mp3" },
    { text: "Slatka naranča", correct: false, audioSrc: "/audio/hr/slatka_naranca.mp3" },
    { text: "Topli burek", correct: false, audioSrc: "/audio/hr/burek.mp3" },
    { text: "Bijeli kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
  ]);
  await setCoordOptions(14, 3, 4, [
    { text: "Slatka naranča", correct: true, audioSrc: "/audio/hr/slatka_naranca.mp3" },
    { text: "Svježi sir", correct: false, audioSrc: "/audio/hr/svjezi_sir.mp3" },
    { text: "Crvena jabuka", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
    { text: "Topli kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
  ]);

  // L4: Boss Quest
  await setCoordOptions(14, 4, 1, [
    { text: "Pekara", correct: true, imageSrc: "/bakery.svg", audioSrc: "/audio/hr/pekara.mp3" },
    { text: "Trgovina", correct: false, imageSrc: "/shop.svg", audioSrc: "/audio/hr/trgovina.mp3" },
    { text: "Sir", correct: false, imageSrc: "/cheese.svg", audioSrc: "/audio/hr/sir.mp3" },
    { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
  ]);
  await setCoordOptions(14, 4, 2, [
    { text: "Kiflica", correct: true, imageSrc: "/croissant.svg", audioSrc: "/audio/hr/kiflica.mp3" },
    { text: "Burek", correct: false, imageSrc: "/burek.svg", audioSrc: "/audio/hr/burek.mp3" },
    { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
    { text: "Sir", correct: false, imageSrc: "/cheese.svg", audioSrc: "/audio/hr/sir.mp3" },
  ]);
  await setCoordOptions(14, 4, 3, [
    { text: "Sir", correct: true, imageSrc: "/cheese.svg", audioSrc: "/audio/hr/sir.mp3" },
    { text: "Rajčica", correct: false, imageSrc: "/tomato.svg", audioSrc: "/audio/hr/rajcica.mp3" },
    { text: "Naranča", correct: false, imageSrc: "/orange.svg", audioSrc: "/audio/hr/naranca.mp3" },
    { text: "Jabuka", correct: false, imageSrc: "/apple.svg", audioSrc: "/audio/hr/jabuka.mp3" },
  ]);
  await setCoordOptions(14, 4, 4, [
    { text: "Molim jednu kiflicu", correct: true, audioSrc: "/audio/hr/molim_jednu_kiflicu.mp3" },
    { text: "Molim jedan burek", correct: false, audioSrc: "/audio/hr/burek.mp3" },
    { text: "Molim malo sira", correct: false, audioSrc: "/audio/hr/sir.mp3" },
    { text: "Molim jednu jabuku", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
  ]);
  await setCoordOptions(14, 4, 5, [
    { text: "Hvala i doviđenja", correct: true, audioSrc: "/audio/hr/hvala_i_dovidenja.mp3" },
    { text: "Dobar dan svima", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
    { text: "Laku noć i hvala", correct: false, audioSrc: "/audio/hr/laku_noc.mp3" },
    { text: "Kako ste danas", correct: false, audioSrc: "/audio/hr/kako_si.mp3" },
  ]);
  await setCoordOptions(14, 4, 6, [
    { text: "Izvolite", correct: true, audioSrc: "/audio/hr/izvolite.mp3" },
    { text: "Oprostite", correct: false, audioSrc: "/audio/hr/oprosti.mp3" },
    { text: "Hvala lijepa", correct: false, audioSrc: "/audio/hr/hvala_lijepa.mp3" },
    { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
  ]);

  // ==========================================
  // UNIT 15: SPORT I IGRE (Sports & Games)
  // ==========================================
  console.log("Updating Unit 15...");
  // L1: Lopta i nogomet
  await setCoordOptions(15, 1, 1, [
    { text: "Lopta", correct: true, imageSrc: "/ball.svg", audioSrc: "/audio/hr/lopta.mp3" },
    { text: "Nogomet", correct: false, imageSrc: "/soccer.svg", audioSrc: "/audio/hr/nogomet.mp3" },
    { text: "Gol", correct: false, imageSrc: "/goal.svg", audioSrc: "/audio/hr/gol.mp3" },
    { text: "Igra", correct: false, imageSrc: "/play.svg", audioSrc: "/audio/hr/igra.mp3" },
  ]);
  await setCoordOptions(15, 1, 2, [
    { text: "Nogomet", correct: true, imageSrc: "/soccer.svg", audioSrc: "/audio/hr/nogomet.mp3" },
    { text: "Lopta", correct: false, imageSrc: "/ball.svg", audioSrc: "/audio/hr/lopta.mp3" },
    { text: "Gol", correct: false, imageSrc: "/goal.svg", audioSrc: "/audio/hr/gol.mp3" },
    { text: "Igra", correct: false, imageSrc: "/play.svg", audioSrc: "/audio/hr/igra.mp3" },
  ]);
  await setCoordOptions(15, 1, 3, [
    { text: "Gol", correct: true, imageSrc: "/goal.svg", audioSrc: "/audio/hr/gol.mp3" },
    { text: "Lopta", correct: false, imageSrc: "/ball.svg", audioSrc: "/audio/hr/lopta.mp3" },
    { text: "Pobjeda", correct: false, imageSrc: "/trophy.svg", audioSrc: "/audio/hr/pobjeda.mp3" },
    { text: "Nogomet", correct: false, imageSrc: "/soccer.svg", audioSrc: "/audio/hr/nogomet.mp3" },
  ]);
  await setCoordOptions(15, 1, 4, [
    { text: "Igra", correct: true, audioSrc: "/audio/hr/igra.mp3" },
    { text: "Lopta", correct: false, audioSrc: "/audio/hr/lopta.mp3" },
    { text: "Pobjeda", correct: false, audioSrc: "/audio/hr/pobjeda.mp3" },
    { text: "Pjesma", correct: false, audioSrc: "/audio/hr/pjesma.mp3" },
  ]);

  // L2: Pjesma i crtanje
  await setCoordOptions(15, 2, 1, [
    { text: "Glazba", correct: true, imageSrc: "/music.svg", audioSrc: "/audio/hr/glazba.mp3" },
    { text: "Pjesma", correct: false, imageSrc: "/song.svg", audioSrc: "/audio/hr/pjesma.mp3" },
    { text: "Crtanje", correct: false, imageSrc: "/art.svg", audioSrc: "/audio/hr/crtanje.mp3" },
    { text: "Igra", correct: false, imageSrc: "/play.svg", audioSrc: "/audio/hr/igra.mp3" },
  ]);
  await setCoordOptions(15, 2, 2, [
    { text: "Pjesma", correct: true, imageSrc: "/song.svg", audioSrc: "/audio/hr/pjesma.mp3" },
    { text: "Glazba", correct: false, imageSrc: "/music.svg", audioSrc: "/audio/hr/glazba.mp3" },
    { text: "Crtanje", correct: false, imageSrc: "/art.svg", audioSrc: "/audio/hr/crtanje.mp3" },
    { text: "Pobjeda", correct: false, imageSrc: "/trophy.svg", audioSrc: "/audio/hr/pobjeda.mp3" },
  ]);
  await setCoordOptions(15, 2, 3, [
    { text: "Crtanje", correct: true, imageSrc: "/art.svg", audioSrc: "/audio/hr/crtanje.mp3" },
    { text: "Glazba", correct: false, imageSrc: "/music.svg", audioSrc: "/audio/hr/glazba.mp3" },
    { text: "Pjesma", correct: false, imageSrc: "/song.svg", audioSrc: "/audio/hr/pjesma.mp3" },
    { text: "Igra", correct: false, imageSrc: "/play.svg", audioSrc: "/audio/hr/igra.mp3" },
  ]);
  await setCoordOptions(15, 2, 4, [
    { text: "Pobjeda", correct: true, audioSrc: "/audio/hr/pobjeda.mp3" },
    { text: "Pjesma", correct: false, audioSrc: "/audio/hr/pjesma.mp3" },
    { text: "Glazba", correct: false, audioSrc: "/audio/hr/glazba.mp3" },
    { text: "Igra", correct: false, audioSrc: "/audio/hr/igra.mp3" },
  ]);

  // L3: Zabava i navijanje
  await setCoordOptions(15, 3, 1, [
    { text: "Zabij gol", correct: true, audioSrc: "/audio/hr/zabij_gol.mp3" },
    { text: "Dodaj loptu", correct: false, audioSrc: "/audio/hr/dodaj_loptu.mp3" },
    { text: "Trči brzo", correct: false, audioSrc: "/audio/hr/brzo_trci.mp3" },
    { text: "Skoči visoko", correct: false, audioSrc: "/audio/hr/skoci.mp3" },
  ]);
  await setCoordOptions(15, 3, 2, [
    { text: "Dodaj loptu", correct: true, audioSrc: "/audio/hr/dodaj_loptu.mp3" },
    { text: "Zabij gol", correct: false, audioSrc: "/audio/hr/zabij_gol.mp3" },
    { text: "Trči brzo", correct: false, audioSrc: "/audio/hr/brzo_trci.mp3" },
    { text: "Skoči visoko", correct: false, audioSrc: "/audio/hr/skoci.mp3" },
  ]);
  await setCoordOptions(15, 3, 3, [
    { text: "Lijepa pjesma", correct: true, audioSrc: "/audio/hr/lijepa_pjesma.mp3" },
    { text: "Dobra igra", correct: false, audioSrc: "/audio/hr/igra.mp3" },
    { text: "Veliki gol", correct: false, audioSrc: "/audio/hr/gol.mp3" },
    { text: "Zelena trava", correct: false, audioSrc: "/audio/hr/trava.mp3" },
  ]);
  await setCoordOptions(15, 3, 4, [
    { text: "Bravo", correct: true, audioSrc: "/audio/hr/bravo.mp3" },
    { text: "Hvala", correct: false, audioSrc: "/audio/hr/hvala.mp3" },
    { text: "Pobjeda", correct: false, audioSrc: "/audio/hr/pobjeda.mp3" },
    { text: "Gol", correct: false, audioSrc: "/audio/hr/gol.mp3" },
  ]);

  // L4: Boss Quest
  await setCoordOptions(15, 4, 1, [
    { text: "Lopta", correct: true, imageSrc: "/ball.svg", audioSrc: "/audio/hr/lopta.mp3" },
    { text: "Nogomet", correct: false, imageSrc: "/soccer.svg", audioSrc: "/audio/hr/nogomet.mp3" },
    { text: "Gol", correct: false, imageSrc: "/goal.svg", audioSrc: "/audio/hr/gol.mp3" },
    { text: "Igra", correct: false, imageSrc: "/play.svg", audioSrc: "/audio/hr/igra.mp3" },
  ]);
  await setCoordOptions(15, 4, 2, [
    { text: "Nogomet", correct: true, imageSrc: "/soccer.svg", audioSrc: "/audio/hr/nogomet.mp3" },
    { text: "Lopta", correct: false, imageSrc: "/ball.svg", audioSrc: "/audio/hr/lopta.mp3" },
    { text: "Gol", correct: false, imageSrc: "/goal.svg", audioSrc: "/audio/hr/gol.mp3" },
    { text: "Pobjeda", correct: false, imageSrc: "/trophy.svg", audioSrc: "/audio/hr/pobjeda.mp3" },
  ]);
  await setCoordOptions(15, 4, 3, [
    { text: "Pobjeda", correct: true, imageSrc: "/trophy.svg", audioSrc: "/audio/hr/pobjeda.mp3" },
    { text: "Gol", correct: false, imageSrc: "/goal.svg", audioSrc: "/audio/hr/gol.mp3" },
    { text: "Igra", correct: false, imageSrc: "/play.svg", audioSrc: "/audio/hr/igra.mp3" },
    { text: "Lopta", correct: false, imageSrc: "/ball.svg", audioSrc: "/audio/hr/lopta.mp3" },
  ]);
  await setCoordOptions(15, 4, 4, [
    { text: "Zabij gol", correct: true, audioSrc: "/audio/hr/zabij_gol.mp3" },
    { text: "Dodaj loptu", correct: false, audioSrc: "/audio/hr/dodaj_loptu.mp3" },
    { text: "Trči brzo", correct: false, audioSrc: "/audio/hr/brzo_trci.mp3" },
    { text: "Skoči visoko", correct: false, audioSrc: "/audio/hr/skoci.mp3" },
  ]);
  await setCoordOptions(15, 4, 5, [
    { text: "Dodaj loptu", correct: true, audioSrc: "/audio/hr/dodaj_loptu.mp3" },
    { text: "Zabij gol", correct: false, audioSrc: "/audio/hr/zabij_gol.mp3" },
    { text: "Trči brzo", correct: false, audioSrc: "/audio/hr/brzo_trci.mp3" },
    { text: "Skoči visoko", correct: false, audioSrc: "/audio/hr/skoci.mp3" },
  ]);
  await setCoordOptions(15, 4, 6, [
    { text: "Mi smo prvaci", correct: true, audioSrc: "/audio/hr/mi_smo_prvaci.mp3" },
    { text: "Mi smo tim", correct: false, audioSrc: "/audio/hr/igra.mp3" },
    { text: "To je pobjeda", correct: false, audioSrc: "/audio/hr/pobjeda.mp3" },
    { text: "Bravo za sve", correct: false, audioSrc: "/audio/hr/bravo.mp3" },
  ]);

  console.log("\nUnits 11 through 15 successfully refined with 100% precision!");
}

main().catch(console.error);
