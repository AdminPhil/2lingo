import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  console.log("Fixing BUG-002: Unit 3 Lesson 4 challenge option mismatches...");

  const challenges = await sql`
    SELECT c.id, c.order, c.question
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE u.order = 3 AND l.order = 4
    ORDER BY c.order
  `;

  console.log("Found Unit 3 Lesson 4 challenges:", challenges);

  // Ch 3: "Which one of these is "Horse"?" -> Konj
  const ch3 = challenges.find(c => c.order === 3);
  if (ch3) {
    await sql`DELETE FROM challenge_options WHERE challenge_id = ${ch3.id}`;
    await sql`
      INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
      VALUES 
        (${ch3.id}, 'Konj', true, null, '/audio/hr/konj.mp3'),
        (${ch3.id}, 'Krava', false, null, '/audio/hr/krava.mp3'),
        (${ch3.id}, 'Patka', false, null, '/audio/hr/patka.mp3'),
        (${ch3.id}, 'Svinja', false, null, '/audio/hr/svinja.mp3')
    `;
    console.log("Fixed Ch 3: 'Horse' -> Konj");
  }

  // Ch 4: "Big dog" -> Veliki pas
  const ch4 = challenges.find(c => c.order === 4);
  if (ch4) {
    await sql`DELETE FROM challenge_options WHERE challenge_id = ${ch4.id}`;
    await sql`
      INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
      VALUES 
        (${ch4.id}, 'Veliki pas', true, null, '/audio/hr/veliki_pas.mp3'),
        (${ch4.id}, 'Mala mačka', false, null, '/audio/hr/mala_macka.mp3'),
        (${ch4.id}, 'Dobar pas', false, null, '/audio/hr/dobar_pas.mp3'),
        (${ch4.id}, 'Velika krava', false, null, '/audio/hr/velika_krava.mp3')
    `;
    console.log("Fixed Ch 4: 'Big dog' -> Veliki pas");
  }

  // Ch 5: "Little cat" -> Mala mačka
  const ch5 = challenges.find(c => c.order === 5);
  if (ch5) {
    await sql`DELETE FROM challenge_options WHERE challenge_id = ${ch5.id}`;
    await sql`
      INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
      VALUES 
        (${ch5.id}, 'Mala mačka', true, null, '/audio/hr/mala_macka.mp3'),
        (${ch5.id}, 'Veliki pas', false, null, '/audio/hr/veliki_pas.mp3'),
        (${ch5.id}, 'Dobar pas', false, null, '/audio/hr/dobar_pas.mp3'),
        (${ch5.id}, 'Velika krava', false, null, '/audio/hr/velika_krava.mp3')
    `;
    console.log("Fixed Ch 5: 'Little cat' -> Mala mačka");
  }

  // Ch 6: "Good dog" -> Dobar pas
  const ch6 = challenges.find(c => c.order === 6);
  if (ch6) {
    await sql`DELETE FROM challenge_options WHERE challenge_id = ${ch6.id}`;
    await sql`
      INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
      VALUES 
        (${ch6.id}, 'Dobar pas', true, null, '/audio/hr/dobar_pas.mp3'),
        (${ch6.id}, 'Veliki pas', false, null, '/audio/hr/veliki_pas.mp3'),
        (${ch6.id}, 'Mala mačka', false, null, '/audio/hr/mala_macka.mp3'),
        (${ch6.id}, 'Velika krava', false, null, '/audio/hr/velika_krava.mp3')
    `;
    console.log("Fixed Ch 6: 'Good dog' -> Dobar pas");
  }

  console.log("✅ Successfully fixed Unit 3 Lesson 4 challenge options!");
}

main().catch(console.error);
