import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

/**
 * Meticulously refines Units 1 through 5 using exact (Unit, Lesson, Challenge) order coords:
 * - 4 options per challenge (balanced 2x2 grid)
 * - Visual scaffolding on Lesson 1 discoveries
 * - Symmetric phrasing, uniform casing, no giveaways
 * - Contrastive modular sentence distractors
 */
async function main() {
  console.log("Refining Units 1 through 5 using exact coordinate lookup...\n");

  // Cache coordinate map: "u_l_c" -> challenge_id
  const all = await sql`
    SELECT c.id, u.order as u_order, l.order as l_order, c.order as c_order, c.question
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE u.order BETWEEN 1 AND 5
    ORDER BY u.order, l.order, c.order
  `;

  const coordMap = new Map<string, number>();
  for (const item of all) {
    coordMap.set(`${item.u_order}_${item.l_order}_${item.c_order}`, item.id);
  }

  console.log(`Mapped ${coordMap.size} challenges across Units 1 to 5.`);

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
  // UNIT 1: PRVE RIJEČI I POZDRAVI (Greetings)
  // ==========================================
  console.log("Updating Unit 1...");
  // L1: Pozdravi
  await setCoordOptions(1, 1, 1, [
    { text: "Bok", correct: true, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/bok.mp3" },
    { text: "Doviđenja", correct: false, imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/dovidenja.mp3" },
    { text: "Hvala", correct: false, imageSrc: "/points.svg", audioSrc: "/audio/hr/hvala.mp3" },
    { text: "Molim", correct: false, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/molim.mp3" },
  ]);
  await setCoordOptions(1, 1, 2, [
    { text: "Dobar dan", correct: true, audioSrc: "/audio/hr/dobar_dan.mp3" },
    { text: "Laku noć", correct: false, audioSrc: "/audio/hr/laku_noc.mp3" },
    { text: "Hvala lijepa", correct: false, audioSrc: "/audio/hr/hvala_lijepa.mp3" },
    { text: "Dobro sam", correct: false, audioSrc: "/audio/hr/dobro_sam.mp3" },
  ]);
  await setCoordOptions(1, 1, 3, [
    { text: "Doviđenja", correct: true, imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/dovidenja.mp3" },
    { text: "Bok", correct: false, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/bok.mp3" },
    { text: "Hvala", correct: false, imageSrc: "/points.svg", audioSrc: "/audio/hr/hvala.mp3" },
    { text: "Molim", correct: false, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/molim.mp3" },
  ]);
  await setCoordOptions(1, 1, 4, [
    { text: "Laku noć", correct: true, audioSrc: "/audio/hr/laku_noc.mp3" },
    { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
    { text: "Dobro sam", correct: false, audioSrc: "/audio/hr/dobro_sam.mp3" },
    { text: "Hvala lijepa", correct: false, audioSrc: "/audio/hr/hvala_lijepa.mp3" },
  ]);

  // L2: Lijepe riječi
  await setCoordOptions(1, 2, 1, [
    { text: "Hvala", correct: true, imageSrc: "/points.svg", audioSrc: "/audio/hr/hvala.mp3" },
    { text: "Molim", correct: false, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/molim.mp3" },
    { text: "Bok", correct: false, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/bok.mp3" },
    { text: "Oprosti", correct: false, imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/oprosti.mp3" },
  ]);
  await setCoordOptions(1, 2, 2, [
    { text: "Molim", correct: true, audioSrc: "/audio/hr/molim.mp3" },
    { text: "Hvala", correct: false, audioSrc: "/audio/hr/hvala.mp3" },
    { text: "Bok", correct: false, audioSrc: "/audio/hr/bok.mp3" },
    { text: "Oprosti", correct: false, audioSrc: "/audio/hr/oprosti.mp3" },
  ]);
  await setCoordOptions(1, 2, 3, [
    { text: "Hvala lijepa", correct: true, audioSrc: "/audio/hr/hvala_lijepa.mp3" },
    { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
    { text: "Laku noć", correct: false, audioSrc: "/audio/hr/laku_noc.mp3" },
    { text: "Dobro sam", correct: false, audioSrc: "/audio/hr/dobro_sam.mp3" },
  ]);
  await setCoordOptions(1, 2, 4, [
    { text: "Oprosti", correct: true, imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/oprosti.mp3" },
    { text: "Hvala", correct: false, imageSrc: "/points.svg", audioSrc: "/audio/hr/hvala.mp3" },
    { text: "Molim", correct: false, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/molim.mp3" },
    { text: "Bok", correct: false, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/bok.mp3" },
  ]);

  // L3: Da, Ne i osjećaji
  await setCoordOptions(1, 3, 1, [
    { text: "Da", correct: true, audioSrc: "/audio/hr/da.mp3" },
    { text: "Ne", correct: false, audioSrc: "/audio/hr/ne.mp3" },
    { text: "Bok", correct: false, audioSrc: "/audio/hr/bok.mp3" },
    { text: "Molim", correct: false, audioSrc: "/audio/hr/molim.mp3" },
  ]);
  await setCoordOptions(1, 3, 2, [
    { text: "Ne", correct: true, audioSrc: "/audio/hr/ne.mp3" },
    { text: "Da", correct: false, audioSrc: "/audio/hr/da.mp3" },
    { text: "Bok", correct: false, audioSrc: "/audio/hr/bok.mp3" },
    { text: "Hvala", correct: false, audioSrc: "/audio/hr/hvala.mp3" },
  ]);
  await setCoordOptions(1, 3, 3, [
    { text: "Kako si", correct: true, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/kako_si.mp3" },
    { text: "Dobar dan", correct: false, imageSrc: "/sunce.svg", audioSrc: "/audio/hr/dobar_dan.mp3" },
    { text: "Laku noć", correct: false, imageSrc: "/krevet.svg", audioSrc: "/audio/hr/laku_noc.mp3" },
    { text: "Dobro sam", correct: false, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/dobro_sam.mp3" },
  ]);
  await setCoordOptions(1, 3, 4, [
    { text: "Dobro sam", correct: true, audioSrc: "/audio/hr/dobro_sam.mp3" },
    { text: "Hvala lijepa", correct: false, audioSrc: "/audio/hr/hvala_lijepa.mp3" },
    { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
    { text: "Laku noć", correct: false, audioSrc: "/audio/hr/laku_noc.mp3" },
  ]);

  // L4: Boss Quest
  await setCoordOptions(1, 4, 1, [
    { text: "Bok", correct: true, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/bok.mp3" },
    { text: "Doviđenja", correct: false, imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/dovidenja.mp3" },
    { text: "Molim", correct: false, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/molim.mp3" },
    { text: "Hvala", correct: false, imageSrc: "/points.svg", audioSrc: "/audio/hr/hvala.mp3" },
  ]);
  await setCoordOptions(1, 4, 2, [
    { text: "Dobar dan", correct: true, audioSrc: "/audio/hr/dobar_dan.mp3" },
    { text: "Laku noć", correct: false, audioSrc: "/audio/hr/laku_noc.mp3" },
    { text: "Hvala lijepa", correct: false, audioSrc: "/audio/hr/hvala_lijepa.mp3" },
    { text: "Dobro sam", correct: false, audioSrc: "/audio/hr/dobro_sam.mp3" },
  ]);
  await setCoordOptions(1, 4, 3, [
    { text: "Hvala", correct: true, imageSrc: "/points.svg", audioSrc: "/audio/hr/hvala.mp3" },
    { text: "Oprosti", correct: false, imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/oprosti.mp3" },
    { text: "Molim", correct: false, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/molim.mp3" },
    { text: "Bok", correct: false, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/bok.mp3" },
  ]);
  await setCoordOptions(1, 4, 4, [
    { text: "Laku noć", correct: true, audioSrc: "/audio/hr/laku_noc.mp3" },
    { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
    { text: "Dobro sam", correct: false, audioSrc: "/audio/hr/dobro_sam.mp3" },
    { text: "Kako si", correct: false, audioSrc: "/audio/hr/kako_si.mp3" },
  ]);
  if (coordMap.has("1_4_5")) {
    await setCoordOptions(1, 4, 5, [
      { text: "Kako si", correct: true, audioSrc: "/audio/hr/kako_si.mp3" },
      { text: "Dobro sam", correct: false, audioSrc: "/audio/hr/dobro_sam.mp3" },
      { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
      { text: "Laku noć", correct: false, audioSrc: "/audio/hr/laku_noc.mp3" },
    ]);
  }
  if (coordMap.has("1_4_6")) {
    await setCoordOptions(1, 4, 6, [
      { text: "Doviđenja", correct: true, imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/dovidenja.mp3" },
      { text: "Bok", correct: false, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/bok.mp3" },
      { text: "Hvala", correct: false, imageSrc: "/points.svg", audioSrc: "/audio/hr/hvala.mp3" },
      { text: "Molim", correct: false, imageSrc: "/mascot.svg", audioSrc: "/audio/hr/molim.mp3" },
    ]);
  }

  // ==========================================
  // UNIT 2: OBITELJ I LJUDI (Family)
  // ==========================================
  console.log("Updating Unit 2...");
  await setCoordOptions(2, 1, 1, [
    { text: "Mama", correct: true, imageSrc: "/woman.svg", audioSrc: "/audio/hr/mama.mp3" },
    { text: "Tata", correct: false, imageSrc: "/man.svg", audioSrc: "/audio/hr/tata.mp3" },
    { text: "Baka", correct: false, imageSrc: "/woman.svg", audioSrc: "/audio/hr/baka.mp3" },
    { text: "Sestra", correct: false, imageSrc: "/girl.svg", audioSrc: "/audio/hr/sestra.mp3" },
  ]);
  await setCoordOptions(2, 1, 2, [
    { text: "Tata", correct: true, imageSrc: "/man.svg", audioSrc: "/audio/hr/tata.mp3" },
    { text: "Mama", correct: false, imageSrc: "/woman.svg", audioSrc: "/audio/hr/mama.mp3" },
    { text: "Djed", correct: false, imageSrc: "/man.svg", audioSrc: "/audio/hr/djed.mp3" },
    { text: "Brat", correct: false, imageSrc: "/boy.svg", audioSrc: "/audio/hr/brat.mp3" },
  ]);
  await setCoordOptions(2, 1, 3, [
    { text: "Baka", correct: true, audioSrc: "/audio/hr/baka.mp3" },
    { text: "Djed", correct: false, audioSrc: "/audio/hr/djed.mp3" },
    { text: "Mama", correct: false, audioSrc: "/audio/hr/mama.mp3" },
    { text: "Tata", correct: false, audioSrc: "/audio/hr/tata.mp3" },
  ]);
  await setCoordOptions(2, 1, 4, [
    { text: "Djed", correct: true, audioSrc: "/audio/hr/djed.mp3" },
    { text: "Baka", correct: false, audioSrc: "/audio/hr/baka.mp3" },
    { text: "Tata", correct: false, audioSrc: "/audio/hr/tata.mp3" },
    { text: "Mama", correct: false, audioSrc: "/audio/hr/mama.mp3" },
  ]);

  // L2: Djeca i rođaci
  await setCoordOptions(2, 2, 1, [
    { text: "Dječak", correct: true, imageSrc: "/boy.svg", audioSrc: "/audio/hr/djecak.mp3" },
    { text: "Djevojčica", correct: false, imageSrc: "/girl.svg", audioSrc: "/audio/hr/djevojcica.mp3" },
    { text: "Brat", correct: false, imageSrc: "/boy.svg", audioSrc: "/audio/hr/brat.mp3" },
    { text: "Beba", correct: false, imageSrc: "/girl.svg", audioSrc: "/audio/hr/beba.mp3" },
  ]);
  await setCoordOptions(2, 2, 2, [
    { text: "Djevojčica", correct: true, imageSrc: "/girl.svg", audioSrc: "/audio/hr/djevojcica.mp3" },
    { text: "Dječak", correct: false, imageSrc: "/boy.svg", audioSrc: "/audio/hr/djecak.mp3" },
    { text: "Sestra", correct: false, imageSrc: "/girl.svg", audioSrc: "/audio/hr/sestra.mp3" },
    { text: "Beba", correct: false, imageSrc: "/boy.svg", audioSrc: "/audio/hr/beba.mp3" },
  ]);
  await setCoordOptions(2, 2, 3, [
    { text: "Brat", correct: true, audioSrc: "/audio/hr/brat.mp3" },
    { text: "Sestra", correct: false, audioSrc: "/audio/hr/sestra.mp3" },
    { text: "Dječak", correct: false, audioSrc: "/audio/hr/djecak.mp3" },
    { text: "Tata", correct: false, audioSrc: "/audio/hr/tata.mp3" },
  ]);
  await setCoordOptions(2, 2, 4, [
    { text: "Sestra", correct: true, audioSrc: "/audio/hr/sestra.mp3" },
    { text: "Brat", correct: false, audioSrc: "/audio/hr/brat.mp3" },
    { text: "Djevojčica", correct: false, audioSrc: "/audio/hr/djevojcica.mp3" },
    { text: "Mama", correct: false, audioSrc: "/audio/hr/mama.mp3" },
  ]);

  // L3: Moji najdraži
  await setCoordOptions(2, 3, 1, [
    { text: "Beba", correct: true, audioSrc: "/audio/hr/beba.mp3" },
    { text: "Dječak", correct: false, audioSrc: "/audio/hr/djecak.mp3" },
    { text: "Djevojčica", correct: false, audioSrc: "/audio/hr/djevojcica.mp3" },
    { text: "Sestra", correct: false, audioSrc: "/audio/hr/sestra.mp3" },
  ]);
  await setCoordOptions(2, 3, 2, [
    { text: "To je mama", correct: true, imageSrc: "/woman.svg", audioSrc: "/audio/hr/to_je_mama.mp3" },
    { text: "To je tata", correct: false, imageSrc: "/man.svg", audioSrc: "/audio/hr/to_je_tata.mp3" },
    { text: "To je brat", correct: false, imageSrc: "/boy.svg", audioSrc: "/audio/hr/brat.mp3" },
    { text: "To je sestra", correct: false, imageSrc: "/girl.svg", audioSrc: "/audio/hr/sestra.mp3" },
  ]);
  await setCoordOptions(2, 3, 3, [
    { text: "Volim te", correct: true, audioSrc: "/audio/hr/volim_te.mp3" },
    { text: "Hvala lijepa", correct: false, audioSrc: "/audio/hr/hvala_lijepa.mp3" },
    { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
    { text: "Laku noć", correct: false, audioSrc: "/audio/hr/laku_noc.mp3" },
  ]);

  // L4: Boss Quest
  await setCoordOptions(2, 4, 1, [
    { text: "Mama", correct: true, imageSrc: "/woman.svg", audioSrc: "/audio/hr/mama.mp3" },
    { text: "Tata", correct: false, imageSrc: "/man.svg", audioSrc: "/audio/hr/tata.mp3" },
    { text: "Baka", correct: false, imageSrc: "/woman.svg", audioSrc: "/audio/hr/baka.mp3" },
    { text: "Djed", correct: false, imageSrc: "/man.svg", audioSrc: "/audio/hr/djed.mp3" },
  ]);
  await setCoordOptions(2, 4, 2, [
    { text: "Tata", correct: true, imageSrc: "/man.svg", audioSrc: "/audio/hr/tata.mp3" },
    { text: "Mama", correct: false, imageSrc: "/woman.svg", audioSrc: "/audio/hr/mama.mp3" },
    { text: "Brat", correct: false, imageSrc: "/boy.svg", audioSrc: "/audio/hr/brat.mp3" },
    { text: "Djed", correct: false, imageSrc: "/man.svg", audioSrc: "/audio/hr/djed.mp3" },
  ]);
  await setCoordOptions(2, 4, 3, [
    { text: "Dječak", correct: true, imageSrc: "/boy.svg", audioSrc: "/audio/hr/djecak.mp3" },
    { text: "Djevojčica", correct: false, imageSrc: "/girl.svg", audioSrc: "/audio/hr/djevojcica.mp3" },
    { text: "Beba", correct: false, imageSrc: "/girl.svg", audioSrc: "/audio/hr/beba.mp3" },
    { text: "Brat", correct: false, imageSrc: "/boy.svg", audioSrc: "/audio/hr/brat.mp3" },
  ]);
  await setCoordOptions(2, 4, 4, [
    { text: "Djevojčica", correct: true, imageSrc: "/girl.svg", audioSrc: "/audio/hr/djevojcica.mp3" },
    { text: "Dječak", correct: false, imageSrc: "/boy.svg", audioSrc: "/audio/hr/djecak.mp3" },
    { text: "Sestra", correct: false, imageSrc: "/girl.svg", audioSrc: "/audio/hr/sestra.mp3" },
    { text: "Beba", correct: false, imageSrc: "/girl.svg", audioSrc: "/audio/hr/beba.mp3" },
  ]);
  if (coordMap.has("2_4_5")) {
    await setCoordOptions(2, 4, 5, [
      { text: "To je mama", correct: true, imageSrc: "/woman.svg", audioSrc: "/audio/hr/to_je_mama.mp3" },
      { text: "To je tata", correct: false, imageSrc: "/man.svg", audioSrc: "/audio/hr/to_je_tata.mp3" },
      { text: "To je brat", correct: false, imageSrc: "/boy.svg", audioSrc: "/audio/hr/brat.mp3" },
      { text: "To je sestra", correct: false, imageSrc: "/girl.svg", audioSrc: "/audio/hr/sestra.mp3" },
    ]);
  }
  if (coordMap.has("2_4_6")) {
    await setCoordOptions(2, 4, 6, [
      { text: "Volim te", correct: true, audioSrc: "/audio/hr/volim_te.mp3" },
      { text: "Hvala lijepa", correct: false, audioSrc: "/audio/hr/hvala_lijepa.mp3" },
      { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
      { text: "Laku noć", correct: false, audioSrc: "/audio/hr/laku_noc.mp3" },
    ]);
  }

  // ==========================================
  // UNIT 3: SLATKE ŽIVOTINJE (Animals)
  // ==========================================
  console.log("Updating Unit 3...");
  await setCoordOptions(3, 1, 1, [
    { text: "Pas", correct: true, imageSrc: "/dog.svg", audioSrc: "/audio/hr/pas.mp3" },
    { text: "Mačka", correct: false, imageSrc: "/cat.svg", audioSrc: "/audio/hr/macka.mp3" },
    { text: "Ptica", correct: false, imageSrc: "/bird.svg", audioSrc: "/audio/hr/ptica.mp3" },
    { text: "Riba", correct: false, imageSrc: "/fish.svg", audioSrc: "/audio/hr/riba.mp3" },
  ]);
  await setCoordOptions(3, 1, 2, [
    { text: "Mačka", correct: true, imageSrc: "/cat.svg", audioSrc: "/audio/hr/macka.mp3" },
    { text: "Pas", correct: false, imageSrc: "/dog.svg", audioSrc: "/audio/hr/pas.mp3" },
    { text: "Ptica", correct: false, imageSrc: "/bird.svg", audioSrc: "/audio/hr/ptica.mp3" },
    { text: "Riba", correct: false, imageSrc: "/fish.svg", audioSrc: "/audio/hr/riba.mp3" },
  ]);
  await setCoordOptions(3, 1, 3, [
    { text: "Riba", correct: true, audioSrc: "/audio/hr/riba.mp3" },
    { text: "Ptica", correct: false, audioSrc: "/audio/hr/ptica.mp3" },
    { text: "Pas", correct: false, audioSrc: "/audio/hr/pas.mp3" },
    { text: "Mačka", correct: false, audioSrc: "/audio/hr/macka.mp3" },
  ]);
  await setCoordOptions(3, 1, 4, [
    { text: "Ptica", correct: true, audioSrc: "/audio/hr/ptica.mp3" },
    { text: "Riba", correct: false, audioSrc: "/audio/hr/riba.mp3" },
    { text: "Patka", correct: false, audioSrc: "/audio/hr/patka.mp3" },
    { text: "Mačka", correct: false, audioSrc: "/audio/hr/macka.mp3" },
  ]);

  // L2: Domaće životinje
  await setCoordOptions(3, 2, 1, [
    { text: "Krava", correct: true, imageSrc: "/cow.svg", audioSrc: "/audio/hr/krava.mp3" },
    { text: "Konj", correct: false, imageSrc: "/horse.svg", audioSrc: "/audio/hr/konj.mp3" },
    { text: "Svinja", correct: false, imageSrc: "/pig.svg", audioSrc: "/audio/hr/svinja.mp3" },
    { text: "Patka", correct: false, imageSrc: "/duck.svg", audioSrc: "/audio/hr/patka.mp3" },
  ]);
  await setCoordOptions(3, 2, 2, [
    { text: "Konj", correct: true, imageSrc: "/horse.svg", audioSrc: "/audio/hr/konj.mp3" },
    { text: "Krava", correct: false, imageSrc: "/cow.svg", audioSrc: "/audio/hr/krava.mp3" },
    { text: "Svinja", correct: false, imageSrc: "/pig.svg", audioSrc: "/audio/hr/svinja.mp3" },
    { text: "Patka", correct: false, imageSrc: "/duck.svg", audioSrc: "/audio/hr/patka.mp3" },
  ]);
  await setCoordOptions(3, 2, 3, [
    { text: "Svinja", correct: true, audioSrc: "/audio/hr/svinja.mp3" },
    { text: "Krava", correct: false, audioSrc: "/audio/hr/krava.mp3" },
    { text: "Konj", correct: false, audioSrc: "/audio/hr/konj.mp3" },
    { text: "Patka", correct: false, audioSrc: "/audio/hr/patka.mp3" },
  ]);
  await setCoordOptions(3, 2, 4, [
    { text: "Patka", correct: true, audioSrc: "/audio/hr/patka.mp3" },
    { text: "Ptica", correct: false, audioSrc: "/audio/hr/ptica.mp3" },
    { text: "Konj", correct: false, audioSrc: "/audio/hr/konj.mp3" },
    { text: "Krava", correct: false, audioSrc: "/audio/hr/krava.mp3" },
  ]);

  // L3: Opisujemo životinje
  await setCoordOptions(3, 3, 1, [
    { text: "Veliki pas", correct: true, imageSrc: "/dog.svg", audioSrc: "/audio/hr/veliki_pas.mp3" },
    { text: "Mala mačka", correct: false, imageSrc: "/cat.svg", audioSrc: "/audio/hr/mala_macka.mp3" },
    { text: "Dobar pas", correct: false, imageSrc: "/dog.svg", audioSrc: "/audio/hr/dobar_pas.mp3" },
    { text: "Velika krava", correct: false, imageSrc: "/cow.svg", audioSrc: "/audio/hr/velika_krava.mp3" },
  ]);
  await setCoordOptions(3, 3, 2, [
    { text: "Mala mačka", correct: true, audioSrc: "/audio/hr/mala_macka.mp3" },
    { text: "Veliki pas", correct: false, audioSrc: "/audio/hr/veliki_pas.mp3" },
    { text: "Dobra ptica", correct: false, audioSrc: "/audio/hr/dobra_ptica.mp3" },
    { text: "Velika krava", correct: false, audioSrc: "/audio/hr/velika_krava.mp3" },
  ]);
  await setCoordOptions(3, 3, 3, [
    { text: "Dobar pas", correct: true, audioSrc: "/audio/hr/dobar_pas.mp3" },
    { text: "Zao pas", correct: false, audioSrc: "/audio/hr/zao_pas.mp3" },
    { text: "Veliki pas", correct: false, audioSrc: "/audio/hr/veliki_pas.mp3" },
    { text: "Mala mačka", correct: false, audioSrc: "/audio/hr/mala_macka.mp3" },
  ]);
  await setCoordOptions(3, 3, 4, [
    { text: "Dobar konj", correct: true, audioSrc: "/audio/hr/dobar_konj.mp3" },
    { text: "Veliki pas", correct: false, audioSrc: "/audio/hr/veliki_pas.mp3" },
    { text: "Mala mačka", correct: false, audioSrc: "/audio/hr/mala_macka.mp3" },
    { text: "Velika krava", correct: false, audioSrc: "/audio/hr/velika_krava.mp3" },
  ]);

  // L4: Boss Quest
  await setCoordOptions(3, 4, 1, [
    { text: "Pas", correct: true, imageSrc: "/dog.svg", audioSrc: "/audio/hr/pas.mp3" },
    { text: "Mačka", correct: false, imageSrc: "/cat.svg", audioSrc: "/audio/hr/macka.mp3" },
    { text: "Krava", correct: false, imageSrc: "/cow.svg", audioSrc: "/audio/hr/krava.mp3" },
    { text: "Konj", correct: false, imageSrc: "/horse.svg", audioSrc: "/audio/hr/konj.mp3" },
  ]);
  await setCoordOptions(3, 4, 2, [
    { text: "Mačka", correct: true, imageSrc: "/cat.svg", audioSrc: "/audio/hr/macka.mp3" },
    { text: "Pas", correct: false, imageSrc: "/dog.svg", audioSrc: "/audio/hr/pas.mp3" },
    { text: "Riba", correct: false, imageSrc: "/fish.svg", audioSrc: "/audio/hr/riba.mp3" },
    { text: "Ptica", correct: false, imageSrc: "/bird.svg", audioSrc: "/audio/hr/ptica.mp3" },
  ]);
  await setCoordOptions(3, 4, 3, [
    { text: "Veliki pas", correct: true, imageSrc: "/dog.svg", audioSrc: "/audio/hr/veliki_pas.mp3" },
    { text: "Mala mačka", correct: false, imageSrc: "/cat.svg", audioSrc: "/audio/hr/mala_macka.mp3" },
    { text: "Dobar pas", correct: false, imageSrc: "/dog.svg", audioSrc: "/audio/hr/dobar_pas.mp3" },
    { text: "Velika krava", correct: false, imageSrc: "/cow.svg", audioSrc: "/audio/hr/velika_krava.mp3" },
  ]);
  await setCoordOptions(3, 4, 4, [
    { text: "Dobar pas", correct: true, audioSrc: "/audio/hr/dobar_pas.mp3" },
    { text: "Veliki pas", correct: false, audioSrc: "/audio/hr/veliki_pas.mp3" },
    { text: "Mala mačka", correct: false, audioSrc: "/audio/hr/mala_macka.mp3" },
    { text: "Velika krava", correct: false, audioSrc: "/audio/hr/velika_krava.mp3" },
  ]);
  if (coordMap.has("3_4_5")) {
    await setCoordOptions(3, 4, 5, [
      { text: "Konj", correct: true, imageSrc: "/horse.svg", audioSrc: "/audio/hr/konj.mp3" },
      { text: "Krava", correct: false, imageSrc: "/cow.svg", audioSrc: "/audio/hr/krava.mp3" },
      { text: "Patka", correct: false, imageSrc: "/duck.svg", audioSrc: "/audio/hr/patka.mp3" },
      { text: "Svinja", correct: false, imageSrc: "/pig.svg", audioSrc: "/audio/hr/svinja.mp3" },
    ]);
  }
  if (coordMap.has("3_4_6")) {
    await setCoordOptions(3, 4, 6, [
      { text: "Mala mačka", correct: true, audioSrc: "/audio/hr/mala_macka.mp3" },
      { text: "Veliki pas", correct: false, audioSrc: "/audio/hr/veliki_pas.mp3" },
      { text: "Dobar pas", correct: false, audioSrc: "/audio/hr/dobar_pas.mp3" },
      { text: "Velika krava", correct: false, audioSrc: "/audio/hr/velika_krava.mp3" },
    ]);
  }

  // ==========================================
  // UNIT 4: BOJE I BROJEVI (Colors & Numbers)
  // ==========================================
  console.log("Updating Unit 4...");
  // L1: Dugine boje
  await setCoordOptions(4, 1, 1, [
    { text: "Crvena", correct: true, imageSrc: "/red.svg", audioSrc: "/audio/hr/crvena.mp3" },
    { text: "Plava", correct: false, imageSrc: "/blue.svg", audioSrc: "/audio/hr/plava.mp3" },
    { text: "Žuta", correct: false, imageSrc: "/yellow.svg", audioSrc: "/audio/hr/zuta.mp3" },
    { text: "Zelena", correct: false, imageSrc: "/green.svg", audioSrc: "/audio/hr/zelena.mp3" },
  ]);
  await setCoordOptions(4, 1, 2, [
    { text: "Plava", correct: true, audioSrc: "/audio/hr/plava.mp3" },
    { text: "Crvena", correct: false, audioSrc: "/audio/hr/crvena.mp3" },
    { text: "Žuta", correct: false, audioSrc: "/audio/hr/zuta.mp3" },
    { text: "Zelena", correct: false, audioSrc: "/audio/hr/zelena.mp3" },
  ]);
  await setCoordOptions(4, 1, 3, [
    { text: "Žuta", correct: true, audioSrc: "/audio/hr/zuta.mp3" },
    { text: "Plava", correct: false, audioSrc: "/audio/hr/plava.mp3" },
    { text: "Crvena", correct: false, audioSrc: "/audio/hr/crvena.mp3" },
    { text: "Zelena", correct: false, audioSrc: "/audio/hr/zelena.mp3" },
  ]);
  await setCoordOptions(4, 1, 4, [
    { text: "Zelena", correct: true, imageSrc: "/green.svg", audioSrc: "/audio/hr/zelena.mp3" },
    { text: "Crvena", correct: false, imageSrc: "/red.svg", audioSrc: "/audio/hr/crvena.mp3" },
    { text: "Plava", correct: false, imageSrc: "/blue.svg", audioSrc: "/audio/hr/plava.mp3" },
    { text: "Crna", correct: false, imageSrc: "/black.svg", audioSrc: "/audio/hr/crna.mp3" },
  ]);

  // L2: Brojimo od 1 do 5
  await setCoordOptions(4, 2, 1, [
    { text: "Jedan", correct: true, audioSrc: "/audio/hr/jedan.mp3" },
    { text: "Dva", correct: false, audioSrc: "/audio/hr/dva.mp3" },
    { text: "Tri", correct: false, audioSrc: "/audio/hr/tri.mp3" },
    { text: "Četiri", correct: false, audioSrc: "/audio/hr/cetiri.mp3" },
  ]);
  await setCoordOptions(4, 2, 2, [
    { text: "Dva", correct: true, audioSrc: "/audio/hr/dva.mp3" },
    { text: "Jedan", correct: false, audioSrc: "/audio/hr/jedan.mp3" },
    { text: "Tri", correct: false, audioSrc: "/audio/hr/tri.mp3" },
    { text: "Pet", correct: false, audioSrc: "/audio/hr/pet.mp3" },
  ]);
  await setCoordOptions(4, 2, 3, [
    { text: "Tri", correct: true, audioSrc: "/audio/hr/tri.mp3" },
    { text: "Dva", correct: false, audioSrc: "/audio/hr/dva.mp3" },
    { text: "Četiri", correct: false, audioSrc: "/audio/hr/cetiri.mp3" },
    { text: "Pet", correct: false, audioSrc: "/audio/hr/pet.mp3" },
  ]);
  await setCoordOptions(4, 2, 4, [
    { text: "Četiri", correct: true, imageSrc: "/four.svg", audioSrc: "/audio/hr/cetiri.mp3" },
    { text: "Pet", correct: false, imageSrc: "/five.svg", audioSrc: "/audio/hr/pet.mp3" },
    { text: "Jedan", correct: false, imageSrc: "/one.svg", audioSrc: "/audio/hr/jedan.mp3" },
    { text: "Tri", correct: false, imageSrc: "/three.svg", audioSrc: "/audio/hr/tri.mp3" },
  ]);

  // L3: Brojimo od 6 do 10
  await setCoordOptions(4, 3, 1, [
    { text: "Šest", correct: true, audioSrc: "/audio/hr/sest.mp3" },
    { text: "Sedam", correct: false, audioSrc: "/audio/hr/sedam.mp3" },
    { text: "Osam", correct: false, audioSrc: "/audio/hr/osam.mp3" },
    { text: "Pet", correct: false, audioSrc: "/audio/hr/pet.mp3" },
  ]);
  await setCoordOptions(4, 3, 2, [
    { text: "Sedam", correct: true, audioSrc: "/audio/hr/sedam.mp3" },
    { text: "Šest", correct: false, audioSrc: "/audio/hr/sest.mp3" },
    { text: "Osam", correct: false, audioSrc: "/audio/hr/osam.mp3" },
    { text: "Devet", correct: false, audioSrc: "/audio/hr/devet.mp3" },
  ]);
  await setCoordOptions(4, 3, 3, [
    { text: "Osam", correct: true, audioSrc: "/audio/hr/osam.mp3" },
    { text: "Sedam", correct: false, audioSrc: "/audio/hr/sedam.mp3" },
    { text: "Devet", correct: false, audioSrc: "/audio/hr/devet.mp3" },
    { text: "Deset", correct: false, audioSrc: "/audio/hr/deset.mp3" },
  ]);
  await setCoordOptions(4, 3, 4, [
    { text: "Deset", correct: true, imageSrc: "/ten.svg", audioSrc: "/audio/hr/deset.mp3" },
    { text: "Devet", correct: false, imageSrc: "/nine.svg", audioSrc: "/audio/hr/devet.mp3" },
    { text: "Sedam", correct: false, imageSrc: "/seven.svg", audioSrc: "/audio/hr/sedam.mp3" },
    { text: "Osam", correct: false, imageSrc: "/eight.svg", audioSrc: "/audio/hr/osam.mp3" },
  ]);

  // L4: Boss Quest
  await setCoordOptions(4, 4, 1, [
    { text: "Crvena", correct: true, imageSrc: "/red.svg", audioSrc: "/audio/hr/crvena.mp3" },
    { text: "Plava", correct: false, imageSrc: "/blue.svg", audioSrc: "/audio/hr/plava.mp3" },
    { text: "Žuta", correct: false, imageSrc: "/yellow.svg", audioSrc: "/audio/hr/zuta.mp3" },
    { text: "Zelena", correct: false, imageSrc: "/green.svg", audioSrc: "/audio/hr/zelena.mp3" },
  ]);
  await setCoordOptions(4, 4, 2, [
    { text: "Zelena", correct: true, imageSrc: "/green.svg", audioSrc: "/audio/hr/zelena.mp3" },
    { text: "Crvena", correct: false, imageSrc: "/red.svg", audioSrc: "/audio/hr/crvena.mp3" },
    { text: "Plava", correct: false, imageSrc: "/blue.svg", audioSrc: "/audio/hr/plava.mp3" },
    { text: "Crna", correct: false, imageSrc: "/black.svg", audioSrc: "/audio/hr/crna.mp3" },
  ]);
  await setCoordOptions(4, 4, 3, [
    { text: "Četiri", correct: true, imageSrc: "/four.svg", audioSrc: "/audio/hr/cetiri.mp3" },
    { text: "Pet", correct: false, imageSrc: "/five.svg", audioSrc: "/audio/hr/pet.mp3" },
    { text: "Šest", correct: false, imageSrc: "/six.svg", audioSrc: "/audio/hr/sest.mp3" },
    { text: "Tri", correct: false, imageSrc: "/three.svg", audioSrc: "/audio/hr/tri.mp3" },
  ]);
  await setCoordOptions(4, 4, 4, [
    { text: "Jedan", correct: true, audioSrc: "/audio/hr/jedan.mp3" },
    { text: "Dva", correct: false, audioSrc: "/audio/hr/dva.mp3" },
    { text: "Tri", correct: false, audioSrc: "/audio/hr/tri.mp3" },
    { text: "Pet", correct: false, audioSrc: "/audio/hr/pet.mp3" },
  ]);
  if (coordMap.has("4_4_5")) {
    await setCoordOptions(4, 4, 5, [
      { text: "Deset", correct: true, imageSrc: "/ten.svg", audioSrc: "/audio/hr/deset.mp3" },
      { text: "Devet", correct: false, imageSrc: "/nine.svg", audioSrc: "/audio/hr/devet.mp3" },
      { text: "Sedam", correct: false, imageSrc: "/seven.svg", audioSrc: "/audio/hr/sedam.mp3" },
      { text: "Osam", correct: false, imageSrc: "/eight.svg", audioSrc: "/audio/hr/osam.mp3" },
    ]);
  }
  if (coordMap.has("4_4_6")) {
    await setCoordOptions(4, 4, 6, [
      { text: "Plava", correct: true, audioSrc: "/audio/hr/plava.mp3" },
      { text: "Crvena", correct: false, audioSrc: "/audio/hr/crvena.mp3" },
      { text: "Žuta", correct: false, audioSrc: "/audio/hr/zuta.mp3" },
      { text: "Zelena", correct: false, audioSrc: "/audio/hr/zelena.mp3" },
    ]);
  }

  // ==========================================
  // UNIT 5: UKUSNA HRANA (Food & Drinks)
  // ==========================================
  console.log("Updating Unit 5...");
  // L1: Voće i poslastice
  await setCoordOptions(5, 1, 1, [
    { text: "Jabuka", correct: true, imageSrc: "/apple.svg", audioSrc: "/audio/hr/jabuka.mp3" },
    { text: "Banana", correct: false, imageSrc: "/banana.svg", audioSrc: "/audio/hr/banana.mp3" },
    { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
    { text: "Čokolada", correct: false, imageSrc: "/chocolate.svg", audioSrc: "/audio/hr/cokolada.mp3" },
  ]);
  await setCoordOptions(5, 1, 2, [
    { text: "Banana", correct: true, audioSrc: "/audio/hr/banana.mp3" },
    { text: "Jabuka", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
    { text: "Kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
    { text: "Sladoled", correct: false, audioSrc: "/audio/hr/sladoled.mp3" },
  ]);
  await setCoordOptions(5, 1, 3, [
    { text: "Sladoled", correct: true, imageSrc: "/ice_cream.svg", audioSrc: "/audio/hr/sladoled.mp3" },
    { text: "Čokolada", correct: false, imageSrc: "/chocolate.svg", audioSrc: "/audio/hr/cokolada.mp3" },
    { text: "Sok", correct: false, imageSrc: "/juice.svg", audioSrc: "/audio/hr/sok.mp3" },
    { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
  ]);
  await setCoordOptions(5, 1, 4, [
    { text: "Čokolada", correct: true, imageSrc: "/chocolate.svg", audioSrc: "/audio/hr/cokolada.mp3" },
    { text: "Sladoled", correct: false, imageSrc: "/ice_cream.svg", audioSrc: "/audio/hr/sladoled.mp3" },
    { text: "Jabuka", correct: false, imageSrc: "/apple.svg", audioSrc: "/audio/hr/jabuka.mp3" },
    { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
  ]);

  // L2: Pića i hrana
  await setCoordOptions(5, 2, 1, [
    { text: "Voda", correct: true, imageSrc: "/water.svg", audioSrc: "/audio/hr/voda.mp3" },
    { text: "Mlijeko", correct: false, imageSrc: "/milk.svg", audioSrc: "/audio/hr/mlijeko.mp3" },
    { text: "Sok", correct: false, imageSrc: "/juice.svg", audioSrc: "/audio/hr/sok.mp3" },
    { text: "Čokolada", correct: false, imageSrc: "/chocolate.svg", audioSrc: "/audio/hr/cokolada.mp3" },
  ]);
  await setCoordOptions(5, 2, 2, [
    { text: "Mlijeko", correct: true, audioSrc: "/audio/hr/mlijeko.mp3" },
    { text: "Voda", correct: false, audioSrc: "/audio/hr/voda.mp3" },
    { text: "Sok", correct: false, audioSrc: "/audio/hr/sok.mp3" },
    { text: "Kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
  ]);
  await setCoordOptions(5, 2, 3, [
    { text: "Sok", correct: true, imageSrc: "/juice.svg", audioSrc: "/audio/hr/sok.mp3" },
    { text: "Voda", correct: false, imageSrc: "/water.svg", audioSrc: "/audio/hr/voda.mp3" },
    { text: "Mlijeko", correct: false, imageSrc: "/milk.svg", audioSrc: "/audio/hr/mlijeko.mp3" },
    { text: "Sir", correct: false, imageSrc: "/cheese.svg", audioSrc: "/audio/hr/sir.mp3" },
  ]);
  await setCoordOptions(5, 2, 4, [
    { text: "Čokolada", correct: true, audioSrc: "/audio/hr/cokolada.mp3" },
    { text: "Sladoled", correct: false, audioSrc: "/audio/hr/sladoled.mp3" },
    { text: "Kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
    { text: "Jabuka", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
  ]);

  // L3: Vrijeme za jelo
  await setCoordOptions(5, 3, 1, [
    { text: "Gladan sam", correct: true, audioSrc: "/audio/hr/gladan_sam.mp3" },
    { text: "Dobro sam", correct: false, audioSrc: "/audio/hr/dobro_sam.mp3" },
    { text: "Umoran sam", correct: false, audioSrc: "/audio/hr/umoran.mp3" },
    { text: "Hvala lijepa", correct: false, audioSrc: "/audio/hr/hvala_lijepa.mp3" },
  ]);
  await setCoordOptions(5, 3, 2, [
    { text: "Mogu li dobiti sladoled, molim", correct: true, imageSrc: "/ice_cream.svg", audioSrc: "/audio/hr/mogu_li_dobiti_sladoled_molim.mp3" },
    { text: "Mogu li dobiti jabuku, molim", correct: false, imageSrc: "/apple.svg", audioSrc: "/audio/hr/jabuka.mp3" },
    { text: "Mogu li dobiti vodu, molim", correct: false, imageSrc: "/water.svg", audioSrc: "/audio/hr/voda.mp3" },
    { text: "Mogu li dobiti sok, molim", correct: false, imageSrc: "/juice.svg", audioSrc: "/audio/hr/sok.mp3" },
  ]);
  await setCoordOptions(5, 3, 3, [
    { text: "Jako je ukusno", correct: true, audioSrc: "/audio/hr/jako_je_ukusno.mp3" },
    { text: "Jako je dobro", correct: false, audioSrc: "/audio/hr/dobro_sam.mp3" },
    { text: "Hvala na jelu", correct: false, audioSrc: "/audio/hr/hvala_lijepa.mp3" },
    { text: "Ne hvala lijepo", correct: false, audioSrc: "/audio/hr/ne_hvala.mp3" },
  ]);
  await setCoordOptions(5, 3, 4, [
    { text: "Sladoled", correct: true, audioSrc: "/audio/hr/sladoled.mp3" },
    { text: "Jabuka", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
    { text: "Čokolada", correct: false, audioSrc: "/audio/hr/cokolada.mp3" },
    { text: "Banana", correct: false, audioSrc: "/audio/hr/banana.mp3" },
  ]);

  // L4: Boss Quest
  await setCoordOptions(5, 4, 1, [
    { text: "Jabuka", correct: true, imageSrc: "/apple.svg", audioSrc: "/audio/hr/jabuka.mp3" },
    { text: "Banana", correct: false, imageSrc: "/banana.svg", audioSrc: "/audio/hr/banana.mp3" },
    { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
    { text: "Sladoled", correct: false, imageSrc: "/ice_cream.svg", audioSrc: "/audio/hr/sladoled.mp3" },
  ]);
  await setCoordOptions(5, 4, 2, [
    { text: "Sladoled", correct: true, imageSrc: "/ice_cream.svg", audioSrc: "/audio/hr/sladoled.mp3" },
    { text: "Čokolada", correct: false, imageSrc: "/chocolate.svg", audioSrc: "/audio/hr/cokolada.mp3" },
    { text: "Voda", correct: false, imageSrc: "/water.svg", audioSrc: "/audio/hr/voda.mp3" },
    { text: "Sok", correct: false, imageSrc: "/juice.svg", audioSrc: "/audio/hr/sok.mp3" },
  ]);
  await setCoordOptions(5, 4, 3, [
    { text: "Voda", correct: true, audioSrc: "/audio/hr/voda.mp3" },
    { text: "Mlijeko", correct: false, audioSrc: "/audio/hr/mlijeko.mp3" },
    { text: "Sok", correct: false, audioSrc: "/audio/hr/sok.mp3" },
    { text: "Kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
  ]);
  await setCoordOptions(5, 4, 4, [
    { text: "Gladan sam", correct: true, audioSrc: "/audio/hr/gladan_sam.mp3" },
    { text: "Dobro sam", correct: false, audioSrc: "/audio/hr/dobro_sam.mp3" },
    { text: "Hvala lijepa", correct: false, audioSrc: "/audio/hr/hvala_lijepa.mp3" },
    { text: "Laku noć", correct: false, audioSrc: "/audio/hr/laku_noc.mp3" },
  ]);
  if (coordMap.has("5_4_5")) {
    await setCoordOptions(5, 4, 5, [
      { text: "Mogu li dobiti sladoled, molim", correct: true, imageSrc: "/ice_cream.svg", audioSrc: "/audio/hr/mogu_li_dobiti_sladoled_molim.mp3" },
      { text: "Mogu li dobiti jabuku, molim", correct: false, imageSrc: "/apple.svg", audioSrc: "/audio/hr/jabuka.mp3" },
      { text: "Mogu li dobiti vodu, molim", correct: false, imageSrc: "/water.svg", audioSrc: "/audio/hr/voda.mp3" },
      { text: "Mogu li dobiti sok, molim", correct: false, imageSrc: "/juice.svg", audioSrc: "/audio/hr/sok.mp3" },
    ]);
  }
  if (coordMap.has("5_4_6")) {
    await setCoordOptions(5, 4, 6, [
      { text: "Jako je ukusno", correct: true, audioSrc: "/audio/hr/jako_je_ukusno.mp3" },
      { text: "Jako je dobro", correct: false, audioSrc: "/audio/hr/dobro_sam.mp3" },
      { text: "Hvala na jelu", correct: false, audioSrc: "/audio/hr/hvala_lijepa.mp3" },
      { text: "Ne hvala lijepo", correct: false, audioSrc: "/audio/hr/ne_hvala.mp3" },
    ]);
  }

  console.log("\nUnits 1 through 5 successfully refined with 100% precision!");
}

main().catch(console.error);
