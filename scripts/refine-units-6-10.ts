import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

/**
 * Meticulously refines Units 6 through 10 using exact (Unit, Lesson, Challenge) coordinates:
 * - 4 options per challenge (balanced 2x2 grid)
 * - Visual scaffolding on Lesson 1 discoveries
 * - Modular compound sentences with familiar contrastive distractors
 * - Symmetric phrasing, uniform casing, no giveaways
 * - Audio for every card
 */
async function main() {
  console.log("Refining Units 6 through 10 using exact coordinate lookup...\n");

  const all = await sql`
    SELECT c.id, u.order as u_order, l.order as l_order, c.order as c_order, c.question
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE u.order BETWEEN 6 AND 10
    ORDER BY u.order, l.order, c.order
  `;

  const coordMap = new Map<string, number>();
  for (const item of all) {
    coordMap.set(`${item.u_order}_${item.l_order}_${item.c_order}`, item.id);
  }

  console.log(`Mapped ${coordMap.size} challenges across Units 6 to 10.`);

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
  // UNIT 6: MOJA SOBA I KUĆA (My Room & Home)
  // ==========================================
  console.log("Updating Unit 6...");
  // L1: Kuća i soba
  await setCoordOptions(6, 1, 1, [
    { text: "Kuća", correct: true, imageSrc: "/house.svg", audioSrc: "/audio/hr/kuca.mp3" },
    { text: "Soba", correct: false, imageSrc: "/room.svg", audioSrc: "/audio/hr/soba.mp3" },
    { text: "Vrata", correct: false, imageSrc: "/door.svg", audioSrc: "/audio/hr/vrata.mp3" },
    { text: "Prozor", correct: false, imageSrc: "/window.svg", audioSrc: "/audio/hr/prozor.mp3" },
  ]);
  await setCoordOptions(6, 1, 2, [
    { text: "Soba", correct: true, imageSrc: "/room.svg", audioSrc: "/audio/hr/soba.mp3" },
    { text: "Kuća", correct: false, imageSrc: "/house.svg", audioSrc: "/audio/hr/kuca.mp3" },
    { text: "Krevet", correct: false, imageSrc: "/bed.svg", audioSrc: "/audio/hr/krevet.mp3" },
    { text: "Stol", correct: false, imageSrc: "/table.svg", audioSrc: "/audio/hr/stol.mp3" },
  ]);
  await setCoordOptions(6, 1, 3, [
    { text: "Krevet", correct: true, imageSrc: "/bed.svg", audioSrc: "/audio/hr/krevet.mp3" },
    { text: "Stol", correct: false, imageSrc: "/table.svg", audioSrc: "/audio/hr/stol.mp3" },
    { text: "Soba", correct: false, imageSrc: "/room.svg", audioSrc: "/audio/hr/soba.mp3" },
    { text: "Kuća", correct: false, imageSrc: "/house.svg", audioSrc: "/audio/hr/kuca.mp3" },
  ]);
  await setCoordOptions(6, 1, 4, [
    { text: "Stol", correct: true, audioSrc: "/audio/hr/stol.mp3" },
    { text: "Krevet", correct: false, audioSrc: "/audio/hr/krevet.mp3" },
    { text: "Soba", correct: false, audioSrc: "/audio/hr/soba.mp3" },
    { text: "Vrata", correct: false, audioSrc: "/audio/hr/vrata.mp3" },
  ]);

  // L2: Vrata i prozori
  await setCoordOptions(6, 2, 1, [
    { text: "Vrata", correct: true, imageSrc: "/door.svg", audioSrc: "/audio/hr/vrata.mp3" },
    { text: "Prozor", correct: false, imageSrc: "/window.svg", audioSrc: "/audio/hr/prozor.mp3" },
    { text: "Stol", correct: false, imageSrc: "/table.svg", audioSrc: "/audio/hr/stol.mp3" },
    { text: "Kuća", correct: false, imageSrc: "/house.svg", audioSrc: "/audio/hr/kuca.mp3" },
  ]);
  await setCoordOptions(6, 2, 2, [
    { text: "Prozor", correct: true, imageSrc: "/window.svg", audioSrc: "/audio/hr/prozor.mp3" },
    { text: "Vrata", correct: false, imageSrc: "/door.svg", audioSrc: "/audio/hr/vrata.mp3" },
    { text: "Krevet", correct: false, imageSrc: "/bed.svg", audioSrc: "/audio/hr/krevet.mp3" },
    { text: "Soba", correct: false, imageSrc: "/room.svg", audioSrc: "/audio/hr/soba.mp3" },
  ]);
  await setCoordOptions(6, 2, 3, [
    { text: "Igračka", correct: true, imageSrc: "/toy.svg", audioSrc: "/audio/hr/igracka.mp3" },
    { text: "Knjiga", correct: false, imageSrc: "/book.svg", audioSrc: "/audio/hr/knjiga.mp3" },
    { text: "Lopta", correct: false, imageSrc: "/ball.svg", audioSrc: "/audio/hr/lopta.mp3" },
    { text: "Vrata", correct: false, imageSrc: "/door.svg", audioSrc: "/audio/hr/vrata.mp3" },
  ]);
  await setCoordOptions(6, 2, 4, [
    { text: "Knjiga", correct: true, audioSrc: "/audio/hr/knjiga.mp3" },
    { text: "Igračka", correct: false, audioSrc: "/audio/hr/igracka.mp3" },
    { text: "Stol", correct: false, audioSrc: "/audio/hr/stol.mp3" },
    { text: "Krevet", correct: false, audioSrc: "/audio/hr/krevet.mp3" },
  ]);

  // L3: U mojoj sobi
  await setCoordOptions(6, 3, 1, [
    { text: "Moja soba", correct: true, audioSrc: "/audio/hr/moja_soba.mp3" },
    { text: "Moj krevet", correct: false, audioSrc: "/audio/hr/moj_krevet.mp3" },
    { text: "Velika kuća", correct: false, audioSrc: "/audio/hr/velika_kuca.mp3" },
    { text: "Mala soba", correct: false, audioSrc: "/audio/hr/soba.mp3" },
  ]);
  await setCoordOptions(6, 3, 2, [
    { text: "Velika kuća", correct: true, audioSrc: "/audio/hr/velika_kuca.mp3" },
    { text: "Moja soba", correct: false, audioSrc: "/audio/hr/moja_soba.mp3" },
    { text: "Moj krevet", correct: false, audioSrc: "/audio/hr/moj_krevet.mp3" },
    { text: "Veliki stol", correct: false, audioSrc: "/audio/hr/stol.mp3" },
  ]);
  await setCoordOptions(6, 3, 3, [
    { text: "Moj krevet", correct: true, audioSrc: "/audio/hr/moj_krevet.mp3" },
    { text: "Moja soba", correct: false, audioSrc: "/audio/hr/moja_soba.mp3" },
    { text: "Velika kuća", correct: false, audioSrc: "/audio/hr/velika_kuca.mp3" },
    { text: "Mali stol", correct: false, audioSrc: "/audio/hr/stol.mp3" },
  ]);
  await setCoordOptions(6, 3, 4, [
    { text: "To je moja knjiga", correct: true, audioSrc: "/audio/hr/to_je_moja_knjiga.mp3" },
    { text: "To je moja soba", correct: false, audioSrc: "/audio/hr/moja_soba.mp3" },
    { text: "To je moja kuća", correct: false, audioSrc: "/audio/hr/velika_kuca.mp3" },
    { text: "To je moj krevet", correct: false, audioSrc: "/audio/hr/moj_krevet.mp3" },
  ]);

  // L4: Boss Quest
  await setCoordOptions(6, 4, 1, [
    { text: "Kuća", correct: true, imageSrc: "/house.svg", audioSrc: "/audio/hr/kuca.mp3" },
    { text: "Soba", correct: false, imageSrc: "/room.svg", audioSrc: "/audio/hr/soba.mp3" },
    { text: "Vrata", correct: false, imageSrc: "/door.svg", audioSrc: "/audio/hr/vrata.mp3" },
    { text: "Prozor", correct: false, imageSrc: "/window.svg", audioSrc: "/audio/hr/prozor.mp3" },
  ]);
  await setCoordOptions(6, 4, 2, [
    { text: "Krevet", correct: true, imageSrc: "/bed.svg", audioSrc: "/audio/hr/krevet.mp3" },
    { text: "Stol", correct: false, imageSrc: "/table.svg", audioSrc: "/audio/hr/stol.mp3" },
    { text: "Prozor", correct: false, imageSrc: "/window.svg", audioSrc: "/audio/hr/prozor.mp3" },
    { text: "Soba", correct: false, imageSrc: "/room.svg", audioSrc: "/audio/hr/soba.mp3" },
  ]);
  await setCoordOptions(6, 4, 3, [
    { text: "Igračka", correct: true, imageSrc: "/toy.svg", audioSrc: "/audio/hr/igracka.mp3" },
    { text: "Knjiga", correct: false, imageSrc: "/book.svg", audioSrc: "/audio/hr/knjiga.mp3" },
    { text: "Kuća", correct: false, imageSrc: "/house.svg", audioSrc: "/audio/hr/kuca.mp3" },
    { text: "Lopta", correct: false, imageSrc: "/ball.svg", audioSrc: "/audio/hr/lopta.mp3" },
  ]);
  await setCoordOptions(6, 4, 4, [
    { text: "Otvori prozor", correct: true, audioSrc: "/audio/hr/otvori_prozor.mp3" },
    { text: "Otvori vrata", correct: false, audioSrc: "/audio/hr/vrata.mp3" },
    { text: "Moja soba", correct: false, audioSrc: "/audio/hr/moja_soba.mp3" },
    { text: "Velika kuća", correct: false, audioSrc: "/audio/hr/velika_kuca.mp3" },
  ]);
  await setCoordOptions(6, 4, 5, [
    { text: "Gdje je igračka", correct: true, audioSrc: "/audio/hr/gdje_je_igracka.mp3" },
    { text: "Gdje je knjiga", correct: false, audioSrc: "/audio/hr/knjiga.mp3" },
    { text: "Gdje je soba", correct: false, audioSrc: "/audio/hr/soba.mp3" },
    { text: "To je moja knjiga", correct: false, audioSrc: "/audio/hr/to_je_moja_knjiga.mp3" },
  ]);
  await setCoordOptions(6, 4, 6, [
    { text: "To je moja knjiga", correct: true, audioSrc: "/audio/hr/to_je_moja_knjiga.mp3" },
    { text: "To je moja soba", correct: false, audioSrc: "/audio/hr/moja_soba.mp3" },
    { text: "To je moja kuća", correct: false, audioSrc: "/audio/hr/velika_kuca.mp3" },
    { text: "Gdje je igračka", correct: false, audioSrc: "/audio/hr/gdje_je_igracka.mp3" },
  ]);

  // ==========================================
  // UNIT 7: TIJELO I POKRET (Body & Movement)
  // ==========================================
  console.log("Updating Unit 7...");
  // L1: Dijelovi tijela
  await setCoordOptions(7, 1, 1, [
    { text: "Glava", correct: true, imageSrc: "/head.svg", audioSrc: "/audio/hr/glava.mp3" },
    { text: "Ruka", correct: false, imageSrc: "/hand.svg", audioSrc: "/audio/hr/ruka.mp3" },
    { text: "Noga", correct: false, imageSrc: "/foot.svg", audioSrc: "/audio/hr/noga.mp3" },
    { text: "Oko", correct: false, imageSrc: "/eye.svg", audioSrc: "/audio/hr/oko.mp3" },
  ]);
  await setCoordOptions(7, 1, 2, [
    { text: "Ruka", correct: true, imageSrc: "/hand.svg", audioSrc: "/audio/hr/ruka.mp3" },
    { text: "Noga", correct: false, imageSrc: "/foot.svg", audioSrc: "/audio/hr/noga.mp3" },
    { text: "Glava", correct: false, imageSrc: "/head.svg", audioSrc: "/audio/hr/glava.mp3" },
    { text: "Uho", correct: false, imageSrc: "/ear.svg", audioSrc: "/audio/hr/uho.mp3" },
  ]);
  await setCoordOptions(7, 1, 3, [
    { text: "Noga", correct: true, imageSrc: "/foot.svg", audioSrc: "/audio/hr/noga.mp3" },
    { text: "Ruka", correct: false, imageSrc: "/hand.svg", audioSrc: "/audio/hr/ruka.mp3" },
    { text: "Glava", correct: false, imageSrc: "/head.svg", audioSrc: "/audio/hr/glava.mp3" },
    { text: "Nos", correct: false, imageSrc: "/nose.svg", audioSrc: "/audio/hr/nos.mp3" },
  ]);
  await setCoordOptions(7, 1, 4, [
    { text: "Oko", correct: true, audioSrc: "/audio/hr/oko.mp3" },
    { text: "Uho", correct: false, audioSrc: "/audio/hr/uho.mp3" },
    { text: "Nos", correct: false, audioSrc: "/audio/hr/nos.mp3" },
    { text: "Usta", correct: false, audioSrc: "/audio/hr/usta.mp3" },
  ]);

  // L2: Lice i osjetila
  await setCoordOptions(7, 2, 1, [
    { text: "Uho", correct: true, imageSrc: "/ear.svg", audioSrc: "/audio/hr/uho.mp3" },
    { text: "Nos", correct: false, imageSrc: "/nose.svg", audioSrc: "/audio/hr/nos.mp3" },
    { text: "Usta", correct: false, imageSrc: "/mouth.svg", audioSrc: "/audio/hr/usta.mp3" },
    { text: "Oko", correct: false, imageSrc: "/eye.svg", audioSrc: "/audio/hr/oko.mp3" },
  ]);
  await setCoordOptions(7, 2, 2, [
    { text: "Nos", correct: true, imageSrc: "/nose.svg", audioSrc: "/audio/hr/nos.mp3" },
    { text: "Uho", correct: false, imageSrc: "/ear.svg", audioSrc: "/audio/hr/uho.mp3" },
    { text: "Usta", correct: false, imageSrc: "/mouth.svg", audioSrc: "/audio/hr/usta.mp3" },
    { text: "Kosa", correct: false, imageSrc: "/hair.svg", audioSrc: "/audio/hr/kosa.mp3" },
  ]);
  await setCoordOptions(7, 2, 3, [
    { text: "Usta", correct: true, imageSrc: "/mouth.svg", audioSrc: "/audio/hr/usta.mp3" },
    { text: "Nos", correct: false, imageSrc: "/nose.svg", audioSrc: "/audio/hr/nos.mp3" },
    { text: "Uho", correct: false, imageSrc: "/ear.svg", audioSrc: "/audio/hr/uho.mp3" },
    { text: "Glava", correct: false, imageSrc: "/head.svg", audioSrc: "/audio/hr/glava.mp3" },
  ]);
  await setCoordOptions(7, 2, 4, [
    { text: "Kosa", correct: true, audioSrc: "/audio/hr/kosa.mp3" },
    { text: "Glava", correct: false, audioSrc: "/audio/hr/glava.mp3" },
    { text: "Ruka", correct: false, audioSrc: "/audio/hr/ruka.mp3" },
    { text: "Usta", correct: false, audioSrc: "/audio/hr/usta.mp3" },
  ]);

  // L3: Pokret i akcija (Deductive Elimination Standard)
  await setCoordOptions(7, 3, 1, [
    { text: "Skoči", correct: true, audioSrc: "/audio/hr/skoci.mp3" },
    { text: "Jabuka", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
    { text: "Kuća", correct: false, audioSrc: "/audio/hr/kuca.mp3" },
    { text: "Pas", correct: false, audioSrc: "/audio/hr/pas.mp3" },
  ]);
  await setCoordOptions(7, 3, 2, [
    { text: "Trči", correct: true, audioSrc: "/audio/hr/trci.mp3" },
    { text: "Skoči", correct: false, audioSrc: "/audio/hr/skoci.mp3" },
    { text: "Mačka", correct: false, audioSrc: "/audio/hr/macka.mp3" },
    { text: "Voda", correct: false, audioSrc: "/audio/hr/voda.mp3" },
  ]);
  await setCoordOptions(7, 3, 3, [
    { text: "Ruke gore", correct: true, audioSrc: "/audio/hr/ruke_gore.mp3" },
    { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
    { text: "Veliki pas", correct: false, audioSrc: "/audio/hr/veliki_pas.mp3" },
    { text: "Moja soba", correct: false, audioSrc: "/audio/hr/moja_soba.mp3" },
  ]);
  await setCoordOptions(7, 3, 4, [
    { text: "Plješći rukama", correct: true, audioSrc: "/audio/hr/pljesci_rukama.mp3" },
    { text: "Ruke gore", correct: false, audioSrc: "/audio/hr/ruke_gore.mp3" },
    { text: "To je mama", correct: false, audioSrc: "/audio/hr/to_je_mama.mp3" },
    { text: "Hvala lijepa", correct: false, audioSrc: "/audio/hr/hvala_lijepa.mp3" },
  ]);

  // L4: Boss Quest
  await setCoordOptions(7, 4, 1, [
    { text: "Glava", correct: true, imageSrc: "/head.svg", audioSrc: "/audio/hr/glava.mp3" },
    { text: "Ruka", correct: false, imageSrc: "/hand.svg", audioSrc: "/audio/hr/ruka.mp3" },
    { text: "Noga", correct: false, imageSrc: "/foot.svg", audioSrc: "/audio/hr/noga.mp3" },
    { text: "Oko", correct: false, imageSrc: "/eye.svg", audioSrc: "/audio/hr/oko.mp3" },
  ]);
  await setCoordOptions(7, 4, 2, [
    { text: "Ruka", correct: true, imageSrc: "/hand.svg", audioSrc: "/audio/hr/ruka.mp3" },
    { text: "Noga", correct: false, imageSrc: "/foot.svg", audioSrc: "/audio/hr/noga.mp3" },
    { text: "Nos", correct: false, imageSrc: "/nose.svg", audioSrc: "/audio/hr/nos.mp3" },
    { text: "Glava", correct: false, imageSrc: "/head.svg", audioSrc: "/audio/hr/glava.mp3" },
  ]);
  await setCoordOptions(7, 4, 3, [
    { text: "Nos", correct: true, imageSrc: "/nose.svg", audioSrc: "/audio/hr/nos.mp3" },
    { text: "Uho", correct: false, imageSrc: "/ear.svg", audioSrc: "/audio/hr/uho.mp3" },
    { text: "Usta", correct: false, imageSrc: "/mouth.svg", audioSrc: "/audio/hr/usta.mp3" },
    { text: "Oko", correct: false, imageSrc: "/eye.svg", audioSrc: "/audio/hr/oko.mp3" },
  ]);
  await setCoordOptions(7, 4, 4, [
    { text: "Digni ruku", correct: true, audioSrc: "/audio/hr/digni_ruku.mp3" },
    { text: "Ruke gore", correct: false, audioSrc: "/audio/hr/ruke_gore.mp3" },
    { text: "Plješći rukama", correct: false, audioSrc: "/audio/hr/pljesci_rukama.mp3" },
    { text: "Brzo trči", correct: false, audioSrc: "/audio/hr/brzo_trci.mp3" },
  ]);
  await setCoordOptions(7, 4, 5, [
    { text: "Brzo trči", correct: true, audioSrc: "/audio/hr/brzo_trci.mp3" },
    { text: "Digni ruku", correct: false, audioSrc: "/audio/hr/digni_ruku.mp3" },
    { text: "Ruke gore", correct: false, audioSrc: "/audio/hr/ruke_gore.mp3" },
    { text: "Plješći rukama", correct: false, audioSrc: "/audio/hr/pljesci_rukama.mp3" },
  ]);
  await setCoordOptions(7, 4, 6, [
    { text: "Ruke gore", correct: true, audioSrc: "/audio/hr/ruke_gore.mp3" },
    { text: "Digni ruku", correct: false, audioSrc: "/audio/hr/digni_ruku.mp3" },
    { text: "Plješći rukama", correct: false, audioSrc: "/audio/hr/pljesci_rukama.mp3" },
    { text: "Brzo trči", correct: false, audioSrc: "/audio/hr/brzo_trci.mp3" },
  ]);

  // ==========================================
  // UNIT 8: MORE I LJETO (Adriatic & Summer)
  // ==========================================
  console.log("Updating Unit 8...");
  // L1: Na plaži
  await setCoordOptions(8, 1, 1, [
    { text: "More", correct: true, imageSrc: "/sea.svg", audioSrc: "/audio/hr/more.mp3" },
    { text: "Plaža", correct: false, imageSrc: "/beach.svg", audioSrc: "/audio/hr/plaza.mp3" },
    { text: "Sunce", correct: false, imageSrc: "/sun.svg", audioSrc: "/audio/hr/sunce.mp3" },
    { text: "Otok", correct: false, imageSrc: "/island.svg", audioSrc: "/audio/hr/otok.mp3" },
  ]);
  await setCoordOptions(8, 1, 2, [
    { text: "Plaža", correct: true, imageSrc: "/beach.svg", audioSrc: "/audio/hr/plaza.mp3" },
    { text: "More", correct: false, imageSrc: "/sea.svg", audioSrc: "/audio/hr/more.mp3" },
    { text: "Otok", correct: false, imageSrc: "/island.svg", audioSrc: "/audio/hr/otok.mp3" },
    { text: "Brod", correct: false, imageSrc: "/boat.svg", audioSrc: "/audio/hr/brod.mp3" },
  ]);
  await setCoordOptions(8, 1, 3, [
    { text: "Sunce", correct: true, imageSrc: "/sun.svg", audioSrc: "/audio/hr/sunce.mp3" },
    { text: "Pijesak", correct: false, imageSrc: "/sand.svg", audioSrc: "/audio/hr/pijesak.mp3" },
    { text: "More", correct: false, imageSrc: "/sea.svg", audioSrc: "/audio/hr/more.mp3" },
    { text: "Plaža", correct: false, imageSrc: "/beach.svg", audioSrc: "/audio/hr/plaza.mp3" },
  ]);
  await setCoordOptions(8, 1, 4, [
    { text: "Pijesak", correct: true, audioSrc: "/audio/hr/pijesak.mp3" },
    { text: "More", correct: false, audioSrc: "/audio/hr/more.mp3" },
    { text: "Plaža", correct: false, audioSrc: "/audio/hr/plaza.mp3" },
    { text: "Sunce", correct: false, audioSrc: "/audio/hr/sunce.mp3" },
  ]);

  // L2: Plovidba i otoci
  await setCoordOptions(8, 2, 1, [
    { text: "Otok", correct: true, imageSrc: "/island.svg", audioSrc: "/audio/hr/otok.mp3" },
    { text: "Brod", correct: false, imageSrc: "/boat.svg", audioSrc: "/audio/hr/brod.mp3" },
    { text: "Plaža", correct: false, imageSrc: "/beach.svg", audioSrc: "/audio/hr/plaza.mp3" },
    { text: "More", correct: false, imageSrc: "/sea.svg", audioSrc: "/audio/hr/more.mp3" },
  ]);
  await setCoordOptions(8, 2, 2, [
    { text: "Brod", correct: true, imageSrc: "/boat.svg", audioSrc: "/audio/hr/brod.mp3" },
    { text: "Otok", correct: false, imageSrc: "/island.svg", audioSrc: "/audio/hr/otok.mp3" },
    { text: "Dupin", correct: false, imageSrc: "/dolphin.svg", audioSrc: "/audio/hr/dupin.mp3" },
    { text: "Galeb", correct: false, imageSrc: "/seagull.svg", audioSrc: "/audio/hr/galeb.mp3" },
  ]);
  await setCoordOptions(8, 2, 3, [
    { text: "Kupanje", correct: true, imageSrc: "/swimming.svg", audioSrc: "/audio/hr/kupanje.mp3" },
    { text: "Plivanje", correct: false, imageSrc: "/swimming.svg", audioSrc: "/audio/hr/plivanje.mp3" },
    { text: "Pijesak", correct: false, imageSrc: "/sand.svg", audioSrc: "/audio/hr/pijesak.mp3" },
    { text: "Brod", correct: false, imageSrc: "/boat.svg", audioSrc: "/audio/hr/brod.mp3" },
  ]);
  await setCoordOptions(8, 2, 4, [
    { text: "Plivanje", correct: true, audioSrc: "/audio/hr/plivanje.mp3" },
    { text: "Kupanje", correct: false, audioSrc: "/audio/hr/kupanje.mp3" },
    { text: "More", correct: false, audioSrc: "/audio/hr/more.mp3" },
    { text: "Brod", correct: false, audioSrc: "/audio/hr/brod.mp3" },
  ]);

  // L3: Morska bića
  await setCoordOptions(8, 3, 1, [
    { text: "Školjka", correct: true, imageSrc: "/shell.svg", audioSrc: "/audio/hr/skoljka.mp3" },
    { text: "Riba", correct: false, imageSrc: "/fish.svg", audioSrc: "/audio/hr/riba.mp3" },
    { text: "Dupin", correct: false, imageSrc: "/dolphin.svg", audioSrc: "/audio/hr/dupin.mp3" },
    { text: "Galeb", correct: false, imageSrc: "/seagull.svg", audioSrc: "/audio/hr/galeb.mp3" },
  ]);
  await setCoordOptions(8, 3, 2, [
    { text: "Dupin", correct: true, imageSrc: "/dolphin.svg", audioSrc: "/audio/hr/dupin.mp3" },
    { text: "Školjka", correct: false, imageSrc: "/shell.svg", audioSrc: "/audio/hr/skoljka.mp3" },
    { text: "Galeb", correct: false, imageSrc: "/seagull.svg", audioSrc: "/audio/hr/galeb.mp3" },
    { text: "Riba", correct: false, imageSrc: "/fish.svg", audioSrc: "/audio/hr/riba.mp3" },
  ]);
  await setCoordOptions(8, 3, 3, [
    { text: "Galeb", correct: true, imageSrc: "/seagull.svg", audioSrc: "/audio/hr/galeb.mp3" },
    { text: "Dupin", correct: false, imageSrc: "/dolphin.svg", audioSrc: "/audio/hr/dupin.mp3" },
    { text: "Riba", correct: false, imageSrc: "/fish.svg", audioSrc: "/audio/hr/riba.mp3" },
    { text: "Ptica", correct: false, imageSrc: "/bird.svg", audioSrc: "/audio/hr/ptica.mp3" },
  ]);
  await setCoordOptions(8, 3, 4, [
    { text: "Mali brod", correct: true, audioSrc: "/audio/hr/mali_brod.mp3" },
    { text: "Toplo more", correct: false, audioSrc: "/audio/hr/toplo_more.mp3" },
    { text: "Veliki brod", correct: false, audioSrc: "/audio/hr/brod.mp3" },
    { text: "Lijepa plaža", correct: false, audioSrc: "/audio/hr/plaza.mp3" },
  ]);

  // L4: Boss Quest
  await setCoordOptions(8, 4, 1, [
    { text: "More", correct: true, imageSrc: "/sea.svg", audioSrc: "/audio/hr/more.mp3" },
    { text: "Plaža", correct: false, imageSrc: "/beach.svg", audioSrc: "/audio/hr/plaza.mp3" },
    { text: "Brod", correct: false, imageSrc: "/boat.svg", audioSrc: "/audio/hr/brod.mp3" },
    { text: "Sunce", correct: false, imageSrc: "/sun.svg", audioSrc: "/audio/hr/sunce.mp3" },
  ]);
  await setCoordOptions(8, 4, 2, [
    { text: "Dupin", correct: true, imageSrc: "/dolphin.svg", audioSrc: "/audio/hr/dupin.mp3" },
    { text: "Galeb", correct: false, imageSrc: "/seagull.svg", audioSrc: "/audio/hr/galeb.mp3" },
    { text: "Školjka", correct: false, imageSrc: "/shell.svg", audioSrc: "/audio/hr/skoljka.mp3" },
    { text: "Riba", correct: false, imageSrc: "/fish.svg", audioSrc: "/audio/hr/riba.mp3" },
  ]);
  await setCoordOptions(8, 4, 3, [
    { text: "Otok", correct: true, imageSrc: "/island.svg", audioSrc: "/audio/hr/otok.mp3" },
    { text: "Brod", correct: false, imageSrc: "/boat.svg", audioSrc: "/audio/hr/brod.mp3" },
    { text: "More", correct: false, imageSrc: "/sea.svg", audioSrc: "/audio/hr/more.mp3" },
    { text: "Plaža", correct: false, imageSrc: "/beach.svg", audioSrc: "/audio/hr/plaza.mp3" },
  ]);
  await setCoordOptions(8, 4, 4, [
    { text: "Toplo more", correct: true, audioSrc: "/audio/hr/toplo_more.mp3" },
    { text: "Mali brod", correct: false, audioSrc: "/audio/hr/mali_brod.mp3" },
    { text: "Plavo more", correct: false, audioSrc: "/audio/hr/more.mp3" },
    { text: "Toplo sunce", correct: false, audioSrc: "/audio/hr/sunce.mp3" },
  ]);
  await setCoordOptions(8, 4, 5, [
    { text: "Idemo na plažu", correct: true, audioSrc: "/audio/hr/idemo_na_plazu.mp3" },
    { text: "Volim more", correct: false, audioSrc: "/audio/hr/volim_more.mp3" },
    { text: "Gledam more", correct: false, audioSrc: "/audio/hr/more.mp3" },
    { text: "Idemo u park", correct: false, audioSrc: "/audio/hr/idemo_u_park.mp3" },
  ]);
  await setCoordOptions(8, 4, 6, [
    { text: "Volim more", correct: true, audioSrc: "/audio/hr/volim_more.mp3" },
    { text: "Idemo na plažu", correct: false, audioSrc: "/audio/hr/idemo_na_plazu.mp3" },
    { text: "Volim sunce", correct: false, audioSrc: "/audio/hr/sunce.mp3" },
    { text: "Gledam brod", correct: false, audioSrc: "/audio/hr/brod.mp3" },
  ]);

  // ==========================================
  // UNIT 9: ODJEĆA (Clothes)
  // ==========================================
  console.log("Updating Unit 9...");
  // L1: Svakodnevna odjeća
  await setCoordOptions(9, 1, 1, [
    { text: "Majica", correct: true, imageSrc: "/tshirt.svg", audioSrc: "/audio/hr/majica.mp3" },
    { text: "Hlače", correct: false, imageSrc: "/pants.svg", audioSrc: "/audio/hr/hlace.mp3" },
    { text: "Cipele", correct: false, imageSrc: "/shoes.svg", audioSrc: "/audio/hr/cipele.mp3" },
    { text: "Kapa", correct: false, imageSrc: "/hat.svg", audioSrc: "/audio/hr/kapa.mp3" },
  ]);
  await setCoordOptions(9, 1, 2, [
    { text: "Hlače", correct: true, imageSrc: "/pants.svg", audioSrc: "/audio/hr/hlace.mp3" },
    { text: "Majica", correct: false, imageSrc: "/tshirt.svg", audioSrc: "/audio/hr/majica.mp3" },
    { text: "Čarape", correct: false, imageSrc: "/socks.svg", audioSrc: "/audio/hr/carape.mp3" },
    { text: "Cipele", correct: false, imageSrc: "/shoes.svg", audioSrc: "/audio/hr/cipele.mp3" },
  ]);
  await setCoordOptions(9, 1, 3, [
    { text: "Cipele", correct: true, imageSrc: "/shoes.svg", audioSrc: "/audio/hr/cipele.mp3" },
    { text: "Čarape", correct: false, imageSrc: "/socks.svg", audioSrc: "/audio/hr/carape.mp3" },
    { text: "Kapa", correct: false, imageSrc: "/hat.svg", audioSrc: "/audio/hr/kapa.mp3" },
    { text: "Hlače", correct: false, imageSrc: "/pants.svg", audioSrc: "/audio/hr/hlace.mp3" },
  ]);
  await setCoordOptions(9, 1, 4, [
    { text: "Čarape", correct: true, audioSrc: "/audio/hr/carape.mp3" },
    { text: "Cipele", correct: false, audioSrc: "/audio/hr/cipele.mp3" },
    { text: "Majica", correct: false, audioSrc: "/audio/hr/majica.mp3" },
    { text: "Hlače", correct: false, audioSrc: "/audio/hr/hlace.mp3" },
  ]);

  // L2: Za van i zimu
  await setCoordOptions(9, 2, 1, [
    { text: "Kapa", correct: true, imageSrc: "/hat.svg", audioSrc: "/audio/hr/kapa.mp3" },
    { text: "Jakna", correct: false, imageSrc: "/jacket.svg", audioSrc: "/audio/hr/jakna.mp3" },
    { text: "Šal", correct: false, imageSrc: "/scarf.svg", audioSrc: "/audio/hr/sal.mp3" },
    { text: "Haljina", correct: false, imageSrc: "/dress.svg", audioSrc: "/audio/hr/haljina.mp3" },
  ]);
  await setCoordOptions(9, 2, 2, [
    { text: "Jakna", correct: true, imageSrc: "/jacket.svg", audioSrc: "/audio/hr/jakna.mp3" },
    { text: "Kapa", correct: false, imageSrc: "/hat.svg", audioSrc: "/audio/hr/kapa.mp3" },
    { text: "Haljina", correct: false, imageSrc: "/dress.svg", audioSrc: "/audio/hr/haljina.mp3" },
    { text: "Šal", correct: false, imageSrc: "/scarf.svg", audioSrc: "/audio/hr/sal.mp3" },
  ]);
  await setCoordOptions(9, 2, 3, [
    { text: "Haljina", correct: true, imageSrc: "/dress.svg", audioSrc: "/audio/hr/haljina.mp3" },
    { text: "Majica", correct: false, imageSrc: "/tshirt.svg", audioSrc: "/audio/hr/majica.mp3" },
    { text: "Jakna", correct: false, imageSrc: "/jacket.svg", audioSrc: "/audio/hr/jakna.mp3" },
    { text: "Kapa", correct: false, imageSrc: "/hat.svg", audioSrc: "/audio/hr/kapa.mp3" },
  ]);
  await setCoordOptions(9, 2, 4, [
    { text: "Šal", correct: true, audioSrc: "/audio/hr/sal.mp3" },
    { text: "Kapa", correct: false, audioSrc: "/audio/hr/kapa.mp3" },
    { text: "Jakna", correct: false, audioSrc: "/audio/hr/jakna.mp3" },
    { text: "Čarape", correct: false, audioSrc: "/audio/hr/carape.mp3" },
  ]);

  // L3: Obuci se!
  await setCoordOptions(9, 3, 1, [
    { text: "Obuci majicu", correct: true, audioSrc: "/audio/hr/obuci_majicu.mp3" },
    { text: "Obuci jaknu", correct: false, audioSrc: "/audio/hr/jakna.mp3" },
    { text: "Obuci hlače", correct: false, audioSrc: "/audio/hr/hlace.mp3" },
    { text: "Obuci cipele", correct: false, audioSrc: "/audio/hr/cipele.mp3" },
  ]);
  await setCoordOptions(9, 3, 2, [
    { text: "Topla jakna", correct: true, audioSrc: "/audio/hr/topla_jakna.mp3" },
    { text: "Lijepa haljina", correct: false, audioSrc: "/audio/hr/lijepa_haljina.mp3" },
    { text: "Crvena kapa", correct: false, audioSrc: "/audio/hr/crvena_kapa.mp3" },
    { text: "Nova majica", correct: false, audioSrc: "/audio/hr/majica.mp3" },
  ]);
  await setCoordOptions(9, 3, 3, [
    { text: "Lijepa haljina", correct: true, audioSrc: "/audio/hr/lijepa_haljina.mp3" },
    { text: "Topla jakna", correct: false, audioSrc: "/audio/hr/topla_jakna.mp3" },
    { text: "Crvena kapa", correct: false, audioSrc: "/audio/hr/crvena_kapa.mp3" },
    { text: "Nova majica", correct: false, audioSrc: "/audio/hr/majica.mp3" },
  ]);
  await setCoordOptions(9, 3, 4, [
    { text: "Gdje su mi cipele", correct: true, audioSrc: "/audio/hr/gdje_su_cipele.mp3" },
    { text: "Gdje je moja kapa", correct: false, audioSrc: "/audio/hr/kapa.mp3" },
    { text: "Gdje je moja jakna", correct: false, audioSrc: "/audio/hr/jakna.mp3" },
    { text: "Gdje su mi čarape", correct: false, audioSrc: "/audio/hr/carape.mp3" },
  ]);

  // L4: Boss Quest
  await setCoordOptions(9, 4, 1, [
    { text: "Cipele", correct: true, imageSrc: "/shoes.svg", audioSrc: "/audio/hr/cipele.mp3" },
    { text: "Čarape", correct: false, imageSrc: "/socks.svg", audioSrc: "/audio/hr/carape.mp3" },
    { text: "Hlače", correct: false, imageSrc: "/pants.svg", audioSrc: "/audio/hr/hlace.mp3" },
    { text: "Majica", correct: false, imageSrc: "/tshirt.svg", audioSrc: "/audio/hr/majica.mp3" },
  ]);
  await setCoordOptions(9, 4, 2, [
    { text: "Kapa", correct: true, imageSrc: "/hat.svg", audioSrc: "/audio/hr/kapa.mp3" },
    { text: "Šal", correct: false, imageSrc: "/scarf.svg", audioSrc: "/audio/hr/sal.mp3" },
    { text: "Jakna", correct: false, imageSrc: "/jacket.svg", audioSrc: "/audio/hr/jakna.mp3" },
    { text: "Haljina", correct: false, imageSrc: "/dress.svg", audioSrc: "/audio/hr/haljina.mp3" },
  ]);
  await setCoordOptions(9, 4, 3, [
    { text: "Majica", correct: true, imageSrc: "/tshirt.svg", audioSrc: "/audio/hr/majica.mp3" },
    { text: "Haljina", correct: false, imageSrc: "/dress.svg", audioSrc: "/audio/hr/haljina.mp3" },
    { text: "Hlače", correct: false, imageSrc: "/pants.svg", audioSrc: "/audio/hr/hlace.mp3" },
    { text: "Jakna", correct: false, imageSrc: "/jacket.svg", audioSrc: "/audio/hr/jakna.mp3" },
  ]);
  await setCoordOptions(9, 4, 4, [
    { text: "Crvena kapa", correct: true, audioSrc: "/audio/hr/crvena_kapa.mp3" },
    { text: "Topla jakna", correct: false, audioSrc: "/audio/hr/topla_jakna.mp3" },
    { text: "Lijepa haljina", correct: false, audioSrc: "/audio/hr/lijepa_haljina.mp3" },
    { text: "Nova majica", correct: false, audioSrc: "/audio/hr/majica.mp3" },
  ]);
  await setCoordOptions(9, 4, 5, [
    { text: "Topla jakna", correct: true, audioSrc: "/audio/hr/topla_jakna.mp3" },
    { text: "Crvena kapa", correct: false, audioSrc: "/audio/hr/crvena_kapa.mp3" },
    { text: "Lijepa haljina", correct: false, audioSrc: "/audio/hr/lijepa_haljina.mp3" },
    { text: "Nova majica", correct: false, audioSrc: "/audio/hr/majica.mp3" },
  ]);
  await setCoordOptions(9, 4, 6, [
    { text: "Gdje su mi cipele", correct: true, audioSrc: "/audio/hr/gdje_su_cipele.mp3" },
    { text: "Gdje je moja kapa", correct: false, audioSrc: "/audio/hr/kapa.mp3" },
    { text: "Gdje je moja jakna", correct: false, audioSrc: "/audio/hr/jakna.mp3" },
    { text: "Gdje su mi čarape", correct: false, audioSrc: "/audio/hr/carape.mp3" },
  ]);

  // ==========================================
  // UNIT 10: VRIJEME I OSJEĆAJI (Weather & Feelings)
  // ==========================================
  console.log("Updating Unit 10...");
  // L1: Kakvo je vrijeme?
  await setCoordOptions(10, 1, 1, [
    { text: "Sunčano", correct: true, imageSrc: "/sunny.svg", audioSrc: "/audio/hr/suncano.mp3" },
    { text: "Kiša", correct: false, imageSrc: "/rain.svg", audioSrc: "/audio/hr/kisa.mp3" },
    { text: "Vjetar", correct: false, imageSrc: "/wind.svg", audioSrc: "/audio/hr/vjetar.mp3" },
    { text: "Snijeg", correct: false, imageSrc: "/snow.svg", audioSrc: "/audio/hr/snijeg.mp3" },
  ]);
  await setCoordOptions(10, 1, 2, [
    { text: "Kiša", correct: true, imageSrc: "/rain.svg", audioSrc: "/audio/hr/kisa.mp3" },
    { text: "Snijeg", correct: false, imageSrc: "/snow.svg", audioSrc: "/audio/hr/snijeg.mp3" },
    { text: "Sunčano", correct: false, imageSrc: "/sunny.svg", audioSrc: "/audio/hr/suncano.mp3" },
    { text: "Oblak", correct: false, imageSrc: "/cloud.svg", audioSrc: "/audio/hr/oblak.mp3" },
  ]);
  await setCoordOptions(10, 1, 3, [
    { text: "Vjetar", correct: true, imageSrc: "/wind.svg", audioSrc: "/audio/hr/vjetar.mp3" },
    { text: "Oblak", correct: false, imageSrc: "/cloud.svg", audioSrc: "/audio/hr/oblak.mp3" },
    { text: "Kiša", correct: false, imageSrc: "/rain.svg", audioSrc: "/audio/hr/kisa.mp3" },
    { text: "Snijeg", correct: false, imageSrc: "/snow.svg", audioSrc: "/audio/hr/snijeg.mp3" },
  ]);
  await setCoordOptions(10, 1, 4, [
    { text: "Snijeg", correct: true, audioSrc: "/audio/hr/snijeg.mp3" },
    { text: "Kiša", correct: false, audioSrc: "/audio/hr/kisa.mp3" },
    { text: "Vjetar", correct: false, audioSrc: "/audio/hr/vjetar.mp3" },
    { text: "Sunčano", correct: false, audioSrc: "/audio/hr/suncano.mp3" },
  ]);

  // L2: Toplo ili hladno?
  await setCoordOptions(10, 2, 1, [
    { text: "Toplo", correct: true, imageSrc: "/hot.svg", audioSrc: "/audio/hr/toplo.mp3" },
    { text: "Hladno", correct: false, imageSrc: "/cold.svg", audioSrc: "/audio/hr/hladno.mp3" },
    { text: "Oblak", correct: false, imageSrc: "/cloud.svg", audioSrc: "/audio/hr/oblak.mp3" },
    { text: "Vjetar", correct: false, imageSrc: "/wind.svg", audioSrc: "/audio/hr/vjetar.mp3" },
  ]);
  await setCoordOptions(10, 2, 2, [
    { text: "Hladno", correct: true, imageSrc: "/cold.svg", audioSrc: "/audio/hr/hladno.mp3" },
    { text: "Toplo", correct: false, imageSrc: "/hot.svg", audioSrc: "/audio/hr/toplo.mp3" },
    { text: "Snijeg", correct: false, imageSrc: "/snow.svg", audioSrc: "/audio/hr/snijeg.mp3" },
    { text: "Kiša", correct: false, imageSrc: "/rain.svg", audioSrc: "/audio/hr/kisa.mp3" },
  ]);
  await setCoordOptions(10, 2, 3, [
    { text: "Oblak", correct: true, imageSrc: "/cloud.svg", audioSrc: "/audio/hr/oblak.mp3" },
    { text: "Duga", correct: false, imageSrc: "/rainbow.svg", audioSrc: "/audio/hr/duga.mp3" },
    { text: "Kiša", correct: false, imageSrc: "/rain.svg", audioSrc: "/audio/hr/kisa.mp3" },
    { text: "Vjetar", correct: false, imageSrc: "/wind.svg", audioSrc: "/audio/hr/vjetar.mp3" },
  ]);
  await setCoordOptions(10, 2, 4, [
    { text: "Duga", correct: true, audioSrc: "/audio/hr/duga.mp3" },
    { text: "Oblak", correct: false, audioSrc: "/audio/hr/oblak.mp3" },
    { text: "Sunce", correct: false, audioSrc: "/audio/hr/sunce.mp3" },
    { text: "Kiša", correct: false, audioSrc: "/audio/hr/kisa.mp3" },
  ]);

  // L3: Kako se osjećaš?
  await setCoordOptions(10, 3, 1, [
    { text: "Sretan", correct: true, audioSrc: "/audio/hr/sretan.mp3" },
    { text: "Umoran", correct: false, audioSrc: "/audio/hr/umoran.mp3" },
    { text: "Nasmijan", correct: false, audioSrc: "/audio/hr/nasmijan.mp3" },
    { text: "Gladan", correct: false, audioSrc: "/audio/hr/gladan_sam.mp3" },
  ]);
  await setCoordOptions(10, 3, 2, [
    { text: "Umoran", correct: true, audioSrc: "/audio/hr/umoran.mp3" },
    { text: "Sretan", correct: false, audioSrc: "/audio/hr/sretan.mp3" },
    { text: "Nasmijan", correct: false, audioSrc: "/audio/hr/nasmijan.mp3" },
    { text: "Gladan", correct: false, audioSrc: "/audio/hr/gladan_sam.mp3" },
  ]);
  await setCoordOptions(10, 3, 3, [
    { text: "Nasmijan", correct: true, audioSrc: "/audio/hr/nasmijan.mp3" },
    { text: "Sretan", correct: false, audioSrc: "/audio/hr/sretan.mp3" },
    { text: "Umoran", correct: false, audioSrc: "/audio/hr/umoran.mp3" },
    { text: "Dobro", correct: false, audioSrc: "/audio/hr/dobro_sam.mp3" },
  ]);
  await setCoordOptions(10, 3, 4, [
    { text: "Ja sam sretan", correct: true, audioSrc: "/audio/hr/ja_sam_sretan.mp3" },
    { text: "Ja sam umoran", correct: false, audioSrc: "/audio/hr/umoran.mp3" },
    { text: "Ja sam gladan", correct: false, audioSrc: "/audio/hr/gladan_sam.mp3" },
    { text: "Dobro sam ja", correct: false, audioSrc: "/audio/hr/dobro_sam.mp3" },
  ]);

  // L4: Boss Quest
  await setCoordOptions(10, 4, 1, [
    { text: "Sunčano", correct: true, imageSrc: "/sunny.svg", audioSrc: "/audio/hr/suncano.mp3" },
    { text: "Kiša", correct: false, imageSrc: "/rain.svg", audioSrc: "/audio/hr/kisa.mp3" },
    { text: "Snijeg", correct: false, imageSrc: "/snow.svg", audioSrc: "/audio/hr/snijeg.mp3" },
    { text: "Oblak", correct: false, imageSrc: "/cloud.svg", audioSrc: "/audio/hr/oblak.mp3" },
  ]);
  await setCoordOptions(10, 4, 2, [
    { text: "Kiša", correct: true, imageSrc: "/rain.svg", audioSrc: "/audio/hr/kisa.mp3" },
    { text: "Oblak", correct: false, imageSrc: "/cloud.svg", audioSrc: "/audio/hr/oblak.mp3" },
    { text: "Sunčano", correct: false, imageSrc: "/sunny.svg", audioSrc: "/audio/hr/suncano.mp3" },
    { text: "Vjetar", correct: false, imageSrc: "/wind.svg", audioSrc: "/audio/hr/vjetar.mp3" },
  ]);
  await setCoordOptions(10, 4, 3, [
    { text: "Duga", correct: true, imageSrc: "/rainbow.svg", audioSrc: "/audio/hr/duga.mp3" },
    { text: "Oblak", correct: false, imageSrc: "/cloud.svg", audioSrc: "/audio/hr/oblak.mp3" },
    { text: "Vjetar", correct: false, imageSrc: "/wind.svg", audioSrc: "/audio/hr/vjetar.mp3" },
    { text: "Sunce", correct: false, imageSrc: "/sun.svg", audioSrc: "/audio/hr/sunce.mp3" },
  ]);
  await setCoordOptions(10, 4, 4, [
    { text: "Pada kiša", correct: true, audioSrc: "/audio/hr/pada_kisa.mp3" },
    { text: "Sija sunce", correct: false, audioSrc: "/audio/hr/sija_sunce.mp3" },
    { text: "Puše vjetar", correct: false, audioSrc: "/audio/hr/hladan_vjetar.mp3" },
    { text: "Hladno more", correct: false, audioSrc: "/audio/hr/toplo_more.mp3" },
  ]);
  await setCoordOptions(10, 4, 5, [
    { text: "Sija sunce", correct: true, audioSrc: "/audio/hr/sija_sunce.mp3" },
    { text: "Pada kiša", correct: false, audioSrc: "/audio/hr/pada_kisa.mp3" },
    { text: "Puše vjetar", correct: false, audioSrc: "/audio/hr/hladan_vjetar.mp3" },
    { text: "Hladno more", correct: false, audioSrc: "/audio/hr/toplo_more.mp3" },
  ]);
  await setCoordOptions(10, 4, 6, [
    { text: "Ja sam sretan", correct: true, audioSrc: "/audio/hr/ja_sam_sretan.mp3" },
    { text: "Ja sam umoran", correct: false, audioSrc: "/audio/hr/umoran.mp3" },
    { text: "Pada kiša", correct: false, audioSrc: "/audio/hr/pada_kisa.mp3" },
    { text: "Sija sunce", correct: false, audioSrc: "/audio/hr/sija_sunce.mp3" },
  ]);

  console.log("\nUnits 6 through 10 successfully refined with 100% precision!");
}

main().catch(console.error);
