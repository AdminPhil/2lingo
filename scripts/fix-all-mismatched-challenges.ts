import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  console.log("Applying comprehensive semantic alignment fixes...");

  // 1. Fix Unit 5 Lesson 2 Ch 4 (ID 56): "Bread" -> Kruh
  console.log("1. Fixing Unit 5 Lesson 2 Ch 4 (Bread -> Kruh)...");
  await sql`DELETE FROM challenge_options WHERE challenge_id = 56`;
  await sql`
    INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
    VALUES 
      (56, 'Kruh', true, null, '/audio/hr/kruh.mp3'),
      (56, 'Čokolada', false, null, '/audio/hr/cokolada.mp3'),
      (56, 'Sladoled', false, null, '/audio/hr/sladoled.mp3'),
      (56, 'Jabuka', false, null, '/audio/hr/jabuka.mp3')
  `;

  // 2. Fix Unit 3 Lesson 2 Ch 3 & Ch 4: Duck & Pig
  console.log("2. Fixing Unit 3 Lesson 2 Ch 3 & Ch 4 (Duck -> Patka, Pig -> Svinja)...");
  await sql`DELETE FROM challenge_options WHERE challenge_id = 30`;
  await sql`
    INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
    VALUES 
      (30, 'Patka', true, null, '/audio/hr/patka.mp3'),
      (30, 'Ptica', false, null, '/audio/hr/ptica.mp3'),
      (30, 'Krava', false, null, '/audio/hr/krava.mp3'),
      (30, 'Konj', false, null, '/audio/hr/konj.mp3')
  `;

  await sql`DELETE FROM challenge_options WHERE challenge_id = 31`;
  await sql`
    INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
    VALUES 
      (31, 'Svinja', true, null, '/audio/hr/svinja.mp3'),
      (31, 'Krava', false, null, '/audio/hr/krava.mp3'),
      (31, 'Konj', false, null, '/audio/hr/konj.mp3'),
      (31, 'Patka', false, null, '/audio/hr/patka.mp3')
  `;

  // 3. Fix Unit 4 Lesson 4 Ch 4, Ch 5, Ch 6 (Blue -> Plava, One -> Jedan, Ten -> Deset)
  console.log("3. Fixing Unit 4 Lesson 4 Ch 4, Ch 5, Ch 6...");
  await sql`DELETE FROM challenge_options WHERE challenge_id = 81`;
  await sql`
    INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
    VALUES 
      (81, 'Plava', true, null, '/audio/hr/plava.mp3'),
      (81, 'Crvena', false, null, '/audio/hr/crvena.mp3'),
      (81, 'Žuta', false, null, '/audio/hr/zuta.mp3'),
      (81, 'Zelena', false, null, '/audio/hr/zelena.mp3')
  `;

  await sql`DELETE FROM challenge_options WHERE challenge_id = 82`;
  await sql`
    INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
    VALUES 
      (82, 'Jedan', true, null, '/audio/hr/jedan.mp3'),
      (82, 'Dva', false, null, '/audio/hr/dva.mp3'),
      (82, 'Tri', false, null, '/audio/hr/tri.mp3'),
      (82, 'Pet', false, null, '/audio/hr/pet.mp3')
  `;

  await sql`DELETE FROM challenge_options WHERE challenge_id = 83`;
  await sql`
    INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
    VALUES 
      (83, 'Deset', true, null, '/audio/hr/deset.mp3'),
      (83, 'Devet', false, null, '/audio/hr/devet.mp3'),
      (83, 'Sedam', false, null, '/audio/hr/sedam.mp3'),
      (83, 'Osam', false, null, '/audio/hr/osam.mp3')
  `;

  console.log("✅ All challenge options aligned cleanly!");
}

main().catch(console.error);
