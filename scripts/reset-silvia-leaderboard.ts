import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function resetSilviaAndCleanLeaderboard() {
  console.log("=== RESETTING SILVIA TO 3RD PLACE & CLEANING LEADERBOARD ===\n");

  // Current Scores:
  // Adriana: 930 XP
  // Vanessa: 910 XP
  // Silvia target: 890 XP (3rd place, right behind Vanessa!)

  const silviaUserId = 'user_3L1otvWOnNRhiXKqfxohNiGPRvX';
  const targetPoints = 890;
  const targetCompletedChallenges = 89; // 89 challenges = 890 XP (completion of Unit 5, beginning of Unit 6)

  // 1. Update Silvia's user_progress (points & display name)
  await sql`
    UPDATE user_progress
    SET points = ${targetPoints}, user_name = 'Silvia'
    WHERE user_id = ${silviaUserId}
  `;
  console.log(`Updated Silvia's score to ${targetPoints} XP (Rank 3)`);

  // 2. Adjust Silvia's challenge_progress to match targetPoints (89 challenges)
  // Fetch curriculum challenges ordered by unit, lesson, challenge
  const allCurriculumChallenges = await sql`
    SELECT c.id
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    ORDER BY u.order, l.order, c.order
  `;

  const keepChallengeIds = allCurriculumChallenges.slice(0, targetCompletedChallenges).map((c: any) => c.id);

  // Delete any completion records beyond the first 89 challenges for Silvia
  await sql`
    DELETE FROM challenge_progress 
    WHERE user_id = ${silviaUserId} 
      AND challenge_id != ALL(${keepChallengeIds})
  `;

  // Ensure the 89 challenges are marked completed
  for (const chId of keepChallengeIds) {
    const existing = await sql`
      SELECT id FROM challenge_progress WHERE user_id = ${silviaUserId} AND challenge_id = ${chId}
    `;
    if (existing.length === 0) {
      await sql`
        INSERT INTO challenge_progress (user_id, challenge_id, completed)
        VALUES (${silviaUserId}, ${chId}, true)
      `;
    }
  }

  const silviaCpCount = await sql`
    SELECT COUNT(*) as count FROM challenge_progress WHERE user_id = ${silviaUserId}
  `;
  console.log(`Silvia's challenge_progress synced: ${silviaCpCount[0].count} challenges completed.`);

  // 3. Remove all other users (phil, J, test accounts) so ONLY Vanessa, Adriana, and Silvia remain
  const allowedUserIds = [
    'user_3L0PFYY5TsRhaaJD2PYJ5NLSuMw', // Adriana
    'user_3L0OtO5oi4GG9tseE9oWY1qR3Ej', // Vanessa
    silviaUserId                        // Silvia
  ];

  const removedUsers = await sql`
    SELECT user_id, user_name 
    FROM user_progress 
    WHERE user_id != ALL(${allowedUserIds})
  `;

  for (const ru of removedUsers) {
    console.log(`Removing test user "${ru.user_name}" (${ru.user_id})...`);
    await sql`DELETE FROM challenge_progress WHERE user_id = ${ru.user_id}`;
    await sql`DELETE FROM user_progress WHERE user_id = ${ru.user_id}`;
  }

  // 4. Print final leaderboard
  const finalLeaderboard = await sql`
    SELECT user_name, points 
    FROM user_progress 
    ORDER BY points DESC
  `;

  console.log("\n=== FINAL LEADERBOARD ===");
  finalLeaderboard.forEach((u: any, i: number) => {
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
    console.log(`${medal} Rank ${i + 1}: ${u.user_name} - ${u.points} XP`);
  });
}

resetSilviaAndCleanLeaderboard()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
