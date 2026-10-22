import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  console.log("Applying CR-001: Deductive Elimination to Unit 7 Lesson 3...");

  // Get challenge IDs for Unit 7 Lesson 3
  const u7l3Challenges = await sql`
    SELECT c.id, c.order, c.question
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE u.order = 7 AND l.order = 3
    ORDER BY c.order
  `;

  console.log("Found Unit 7 Lesson 3 challenges:", u7l3Challenges);

  // Challenge 1: "Jump!" -> Skoči vs Jabuka, Kuća, Pas
  const ch1 = u7l3Challenges.find(c => c.order === 1);
  if (ch1) {
    await sql`DELETE FROM challenge_options WHERE challenge_id = ${ch1.id}`;
    await sql`
      INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
      VALUES 
        (${ch1.id}, 'Skoči', true, null, '/audio/hr/skoci.mp3'),
        (${ch1.id}, 'Jabuka', false, null, '/audio/hr/jabuka.mp3'),
        (${ch1.id}, 'Kuća', false, null, '/audio/hr/kuca.mp3'),
        (${ch1.id}, 'Pas', false, null, '/audio/hr/pas.mp3')
    `;
    console.log("Updated Ch 1 with Deductive Elimination distractors.");
  }

  // Challenge 2: "Run!" -> Trči vs Skoči, Mačka, Voda
  const ch2 = u7l3Challenges.find(c => c.order === 2);
  if (ch2) {
    await sql`DELETE FROM challenge_options WHERE challenge_id = ${ch2.id}`;
    await sql`
      INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
      VALUES 
        (${ch2.id}, 'Trči', true, null, '/audio/hr/trci.mp3'),
        (${ch2.id}, 'Skoči', false, null, '/audio/hr/skoci.mp3'),
        (${ch2.id}, 'Mačka', false, null, '/audio/hr/macka.mp3'),
        (${ch2.id}, 'Voda', false, null, '/audio/hr/voda.mp3')
    `;
    console.log("Updated Ch 2 with Deductive Elimination distractors.");
  }

  // Challenge 3: "Hands up!" -> Ruke gore vs Dobar dan, Veliki pas, Moja soba
  const ch3 = u7l3Challenges.find(c => c.order === 3);
  if (ch3) {
    await sql`DELETE FROM challenge_options WHERE challenge_id = ${ch3.id}`;
    await sql`
      INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
      VALUES 
        (${ch3.id}, 'Ruke gore', true, null, '/audio/hr/ruke_gore.mp3'),
        (${ch3.id}, 'Dobar dan', false, null, '/audio/hr/dobar_dan.mp3'),
        (${ch3.id}, 'Veliki pas', false, null, '/audio/hr/veliki_pas.mp3'),
        (${ch3.id}, 'Moja soba', false, null, '/audio/hr/moja_soba.mp3')
    `;
    console.log("Updated Ch 3 with Deductive Elimination distractors.");
  }

  // Challenge 4: "Clap your hands!" -> Plješći rukama vs Ruke gore, To je mama, Hvala lijepa
  const ch4 = u7l3Challenges.find(c => c.order === 4);
  if (ch4) {
    await sql`DELETE FROM challenge_options WHERE challenge_id = ${ch4.id}`;
    await sql`
      INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
      VALUES 
        (${ch4.id}, 'Plješći rukama', true, null, '/audio/hr/pljesci_rukama.mp3'),
        (${ch4.id}, 'Ruke gore', false, null, '/audio/hr/ruke_gore.mp3'),
        (${ch4.id}, 'To je mama', false, null, '/audio/hr/to_je_mama.mp3'),
        (${ch4.id}, 'Hvala lijepa', false, null, '/audio/hr/hvala_lijepa.mp3')
    `;
    console.log("Updated Ch 4 with Deductive Elimination distractors.");
  }

  // Fix Unit 4 Lesson 3 Ch 4 & Ch 5
  console.log("Fixing Unit 4 Lesson 3 Ch 4 and Ch 5...");
  const u4l3Challenges = await sql`
    SELECT c.id, c.order, c.question
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE u.order = 4 AND l.order = 3
    ORDER BY c.order
  `;

  const u4ch4 = u4l3Challenges.find(c => c.order === 4);
  if (u4ch4) {
    await sql`UPDATE challenges SET question = 'Nine (9)' WHERE id = ${u4ch4.id}`;
    await sql`DELETE FROM challenge_options WHERE challenge_id = ${u4ch4.id}`;
    await sql`
      INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
      VALUES 
        (${u4ch4.id}, 'Devet', true, null, '/audio/hr/devet.mp3'),
        (${u4ch4.id}, 'Sedam', false, null, '/audio/hr/sedam.mp3'),
        (${u4ch4.id}, 'Osam', false, null, '/audio/hr/osam.mp3'),
        (${u4ch4.id}, 'Šest', false, null, '/audio/hr/sest.mp3')
    `;
  }

  const u4ch5 = u4l3Challenges.find(c => c.order === 5);
  if (u4ch5) {
    await sql`UPDATE challenges SET question = 'Ten (10)' WHERE id = ${u4ch5.id}`;
    await sql`DELETE FROM challenge_options WHERE challenge_id = ${u4ch5.id}`;
    await sql`
      INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
      VALUES 
        (${u4ch5.id}, 'Deset', true, null, '/audio/hr/deset.mp3'),
        (${u4ch5.id}, 'Devet', false, null, '/audio/hr/devet.mp3'),
        (${u4ch5.id}, 'Osam', false, null, '/audio/hr/osam.mp3'),
        (${u4ch5.id}, 'Sedam', false, null, '/audio/hr/sedam.mp3')
    `;
  }

  console.log("✅ Successfully applied CR-001 & Unit 4 L3 fixes to database!");
}

main().catch(console.error);
