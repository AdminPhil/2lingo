import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL || "");
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database with Croatian kid curriculum and HD audio...");

    // Backup existing user progress & subscriptions so kids never lose XP or hearts
    const savedUserProgress = await db.query.userProgress.findMany();
    const savedSubscriptions = await db.query.userSubscription.findMany();

    await db.delete(schema.courses);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.userProgress);
    await db.delete(schema.userSubscription);

    // 1. COURSES (Croatian only)
    await db.insert(schema.courses).values([
      {
        id: 1,
        title: "Croatian",
        imageSrc: "/hr.svg",
      },
    ]);

    // 2. UNITS FOR CROATIAN (Course ID 1)
    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1,
        title: "Unit 1",
        description: "Prve riječi i pozdravi (First Words & Greetings)",
        order: 1,
      },
      {
        id: 2,
        courseId: 1,
        title: "Unit 2",
        description: "Obitelj i ljudi (Family & People)",
        order: 2,
      },
      {
        id: 3,
        courseId: 1,
        title: "Unit 3",
        description: "Slatke životinje (Cute Animals)",
        order: 3,
      },
      {
        id: 4,
        courseId: 1,
        title: "Unit 4",
        description: "Boje i brojevi (Colors & Numbers)",
        order: 4,
      },
      {
        id: 5,
        courseId: 1,
        title: "Unit 5",
        description: "Ukusna hrana i poslastice (Yummy Food & Drinks)",
        order: 5,
      },
    ]);

    // 3. LESSONS FOR ALL 5 UNITS
    await db.insert(schema.lessons).values([
      // Unit 1 Lessons (1-3)
      { id: 1, unitId: 1, order: 1, title: "Pozdravi (Hello & Bye)" },
      { id: 2, unitId: 1, order: 2, title: "Lijepe riječi (Polite Words)" },
      { id: 3, unitId: 1, order: 3, title: "Da, Ne i osjećaji (Yes, No & Feelings)" },

      // Unit 2 Lessons (4-6)
      { id: 4, unitId: 2, order: 1, title: "Mama, Tata i djedovi (Parents & Grandparents)" },
      { id: 5, unitId: 2, order: 2, title: "Djeca i rođaci (Kids & Siblings)" },
      { id: 6, unitId: 2, order: 3, title: "Moji najdraži (Loved Ones)" },

      // Unit 3 Lessons (7-9)
      { id: 7, unitId: 3, order: 1, title: "Kućni ljubimci (Pets at Home)" },
      { id: 8, unitId: 3, order: 2, title: "Domaće životinje (Farm Animals)" },
      { id: 9, unitId: 3, order: 3, title: "Opisujemo životinje (Describing Animals)" },

      // Unit 4 Lessons (10-12)
      { id: 10, unitId: 4, order: 1, title: "Dugine boje (Rainbow Colors)" },
      { id: 11, unitId: 4, order: 2, title: "Brojimo od 1 do 5 (Count 1 to 5)" },
      { id: 12, unitId: 4, order: 3, title: "Brojimo od 6 do 10 (Count 6 to 10)" },

      // Unit 5 Lessons (13-15)
      { id: 13, unitId: 5, order: 1, title: "Voće i poslastice (Fruits & Treats)" },
      { id: 14, unitId: 5, order: 2, title: "Pića i hrana (Drinks & Food)" },
      { id: 15, unitId: 5, order: 3, title: "Vrijeme za jelo (Snack Time!)" },
    ]);

    // 4. CHALLENGES
    await db.insert(schema.challenges).values([
      // ==========================================
      // UNIT 1: LESSON 1 (Pozdravi)
      // ==========================================
      {
        id: 1,
        lessonId: 1,
        type: "SELECT",
        order: 1,
        question: 'Which one of these is "Hello / Hi"?',
      },
      {
        id: 2,
        lessonId: 1,
        type: "ASSIST",
        order: 2,
        question: '"Good day"',
      },
      {
        id: 3,
        lessonId: 1,
        type: "SELECT",
        order: 3,
        question: 'Which one of these is "Goodbye"?',
      },
      {
        id: 4,
        lessonId: 1,
        type: "ASSIST",
        order: 4,
        question: '"Good night"',
      },

      // ==========================================
      // UNIT 1: LESSON 2 (Lijepe riječi)
      // ==========================================
      {
        id: 5,
        lessonId: 2,
        type: "SELECT",
        order: 1,
        question: 'Which one of these is "Thank you"?',
      },
      {
        id: 6,
        lessonId: 2,
        type: "ASSIST",
        order: 2,
        question: '"Please / You\'re welcome"',
      },
      {
        id: 7,
        lessonId: 2,
        type: "ASSIST",
        order: 3,
        question: '"Thank you very much"',
      },
      {
        id: 8,
        lessonId: 2,
        type: "SELECT",
        order: 4,
        question: 'Which one of these is "Sorry / Excuse me"?',
      },

      // ==========================================
      // UNIT 1: LESSON 3 (Da, Ne i osjećaji)
      // ==========================================
      {
        id: 9,
        lessonId: 3,
        type: "ASSIST",
        order: 1,
        question: '"Yes"',
      },
      {
        id: 10,
        lessonId: 3,
        type: "ASSIST",
        order: 2,
        question: '"No"',
      },
      {
        id: 11,
        lessonId: 3,
        type: "SELECT",
        order: 3,
        question: 'Which one of these is "How are you?"',
      },
      {
        id: 12,
        lessonId: 3,
        type: "ASSIST",
        order: 4,
        question: '"I am good!"',
      },

      // ==========================================
      // UNIT 2: LESSON 1 (Mama, Tata i djedovi)
      // ==========================================
      {
        id: 13,
        lessonId: 4,
        type: "SELECT",
        order: 1,
        question: 'Which one of these is "Mom"?',
      },
      {
        id: 14,
        lessonId: 4,
        type: "SELECT",
        order: 2,
        question: 'Which one of these is "Dad"?',
      },
      {
        id: 15,
        lessonId: 4,
        type: "ASSIST",
        order: 3,
        question: '"Grandma"',
      },
      {
        id: 16,
        lessonId: 4,
        type: "ASSIST",
        order: 4,
        question: '"Grandpa"',
      },

      // ==========================================
      // UNIT 2: LESSON 2 (Djeca i rođaci)
      // ==========================================
      {
        id: 17,
        lessonId: 5,
        type: "SELECT",
        order: 1,
        question: 'Which one of these is "the boy"?',
      },
      {
        id: 18,
        lessonId: 5,
        type: "SELECT",
        order: 2,
        question: 'Which one of these is "the girl"?',
      },
      {
        id: 19,
        lessonId: 5,
        type: "ASSIST",
        order: 3,
        question: '"Brother"',
      },
      {
        id: 20,
        lessonId: 5,
        type: "ASSIST",
        order: 4,
        question: '"Sister"',
      },

      // ==========================================
      // UNIT 2: LESSON 3 (Moji najdraži)
      // ==========================================
      {
        id: 21,
        lessonId: 6,
        type: "ASSIST",
        order: 1,
        question: '"Baby"',
      },
      {
        id: 22,
        lessonId: 6,
        type: "SELECT",
        order: 2,
        question: 'Which one means "That is mom"?',
      },
      {
        id: 23,
        lessonId: 6,
        type: "ASSIST",
        order: 3,
        question: '"I love you" ❤️',
      },

      // ==========================================
      // UNIT 3: LESSON 1 (Kućni ljubimci)
      // ==========================================
      {
        id: 24,
        lessonId: 7,
        type: "SELECT",
        order: 1,
        question: 'Which one of these is "the dog"?',
      },
      {
        id: 25,
        lessonId: 7,
        type: "SELECT",
        order: 2,
        question: 'Which one of these is "the cat"?',
      },
      {
        id: 26,
        lessonId: 7,
        type: "ASSIST",
        order: 3,
        question: '"Fish"',
      },
      {
        id: 27,
        lessonId: 7,
        type: "ASSIST",
        order: 4,
        question: '"Bird"',
      },

      // ==========================================
      // UNIT 3: LESSON 2 (Domaće životinje)
      // ==========================================
      {
        id: 28,
        lessonId: 8,
        type: "ASSIST",
        order: 1,
        question: '"Cow"',
      },
      {
        id: 29,
        lessonId: 8,
        type: "ASSIST",
        order: 2,
        question: '"Horse"',
      },
      {
        id: 30,
        lessonId: 8,
        type: "SELECT",
        order: 3,
        question: 'Which one of these is "the duck"?',
      },
      {
        id: 31,
        lessonId: 8,
        type: "ASSIST",
        order: 4,
        question: '"Pig"',
      },

      // ==========================================
      // UNIT 3: LESSON 3 (Opisujemo životinje)
      // ==========================================
      {
        id: 32,
        lessonId: 9,
        type: "SELECT",
        order: 1,
        question: 'Which one means "Big dog"?',
      },
      {
        id: 33,
        lessonId: 9,
        type: "ASSIST",
        order: 2,
        question: '"Little cat"',
      },
      {
        id: 34,
        lessonId: 9,
        type: "ASSIST",
        order: 3,
        question: '"Good dog"',
      },

      // ==========================================
      // UNIT 4: LESSON 1 (Dugine boje)
      // ==========================================
      {
        id: 35,
        lessonId: 10,
        type: "SELECT",
        order: 1,
        question: 'Which one of these is "Red"?',
      },
      {
        id: 36,
        lessonId: 10,
        type: "ASSIST",
        order: 2,
        question: '"Blue"',
      },
      {
        id: 37,
        lessonId: 10,
        type: "ASSIST",
        order: 3,
        question: '"Yellow"',
      },
      {
        id: 38,
        lessonId: 10,
        type: "SELECT",
        order: 4,
        question: 'Which one of these is "Green"?',
      },

      // ==========================================
      // UNIT 4: LESSON 2 (Brojimo od 1 do 5)
      // ==========================================
      {
        id: 39,
        lessonId: 11,
        type: "ASSIST",
        order: 1,
        question: '"One (1)"',
      },
      {
        id: 40,
        lessonId: 11,
        type: "ASSIST",
        order: 2,
        question: '"Two (2)"',
      },
      {
        id: 41,
        lessonId: 11,
        type: "ASSIST",
        order: 3,
        question: '"Three (3)"',
      },
      {
        id: 42,
        lessonId: 11,
        type: "SELECT",
        order: 4,
        question: 'Which one of these is "Four (4)"?',
      },
      {
        id: 43,
        lessonId: 11,
        type: "ASSIST",
        order: 5,
        question: '"Five (5)"',
      },

      // ==========================================
      // UNIT 4: LESSON 3 (Brojimo od 6 do 10)
      // ==========================================
      {
        id: 44,
        lessonId: 12,
        type: "ASSIST",
        order: 1,
        question: '"Six (6)"',
      },
      {
        id: 45,
        lessonId: 12,
        type: "ASSIST",
        order: 2,
        question: '"Seven (7)"',
      },
      {
        id: 46,
        lessonId: 12,
        type: "ASSIST",
        order: 3,
        question: '"Eight (8)"',
      },
      {
        id: 47,
        lessonId: 12,
        type: "ASSIST",
        order: 4,
        question: '"Nine (9)"',
      },
      {
        id: 48,
        lessonId: 12,
        type: "SELECT",
        order: 5,
        question: 'Which one of these is "Ten (10)"?',
      },

      // ==========================================
      // UNIT 5: LESSON 1 (Voće i poslastice)
      // ==========================================
      {
        id: 49,
        lessonId: 13,
        type: "SELECT",
        order: 1,
        question: 'Which one of these is "Apple"?',
      },
      {
        id: 50,
        lessonId: 13,
        type: "ASSIST",
        order: 2,
        question: '"Banana"',
      },
      {
        id: 51,
        lessonId: 13,
        type: "SELECT",
        order: 3,
        question: 'Which one of these is "Ice cream"? 🍦',
      },
      {
        id: 52,
        lessonId: 13,
        type: "ASSIST",
        order: 4,
        question: '"Chocolate" 🍫',
      },

      // ==========================================
      // UNIT 5: LESSON 2 (Pića i hrana)
      // ==========================================
      {
        id: 53,
        lessonId: 14,
        type: "ASSIST",
        order: 1,
        question: '"Water"',
      },
      {
        id: 54,
        lessonId: 14,
        type: "ASSIST",
        order: 2,
        question: '"Milk"',
      },
      {
        id: 55,
        lessonId: 14,
        type: "SELECT",
        order: 3,
        question: 'Which one of these is "Juice"?',
      },
      {
        id: 56,
        lessonId: 14,
        type: "ASSIST",
        order: 4,
        question: '"Bread"',
      },

      // ==========================================
      // UNIT 5: LESSON 3 (Vrijeme za jelo)
      // ==========================================
      {
        id: 57,
        lessonId: 15,
        type: "ASSIST",
        order: 1,
        question: '"I am hungry"',
      },
      {
        id: 58,
        lessonId: 15,
        type: "SELECT",
        order: 2,
        question: 'Which one means "May I have ice cream, please?"',
      },
      {
        id: 59,
        lessonId: 15,
        type: "ASSIST",
        order: 3,
        question: '"Very tasty / Delicious!"',
      },
    ]);

    // 5. CHALLENGE OPTIONS (WITH HD CROATIAN NEURAL AUDIO)
    await db.insert(schema.challengeOptions).values([
      // Challenge 1: Which one is "Hello / Hi"? (Bok)
      { challengeId: 1, correct: true, text: "Bok", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/bok.mp3" },
      { challengeId: 1, correct: false, text: "Doviđenja", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/dovidenja.mp3" },
      { challengeId: 1, correct: false, text: "Hvala", imageSrc: "/points.svg", audioSrc: "/audio/hr/hvala.mp3" },

      // Challenge 2: "Good day" (Dobar dan)
      { challengeId: 2, correct: true, text: "Dobar dan", audioSrc: "/audio/hr/dobar_dan.mp3" },
      { challengeId: 2, correct: false, text: "Laku noć", audioSrc: "/audio/hr/laku_noc.mp3" },
      { challengeId: 2, correct: false, text: "Molim", audioSrc: "/audio/hr/molim.mp3" },

      // Challenge 3: "Goodbye" (Doviđenja)
      { challengeId: 3, correct: true, text: "Doviđenja", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/dovidenja.mp3" },
      { challengeId: 3, correct: false, text: "Bok", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/bok.mp3" },
      { challengeId: 3, correct: false, text: "Da", imageSrc: "/points.svg", audioSrc: "/audio/hr/da.mp3" },

      // Challenge 4: "Good night" (Laku noć)
      { challengeId: 4, correct: true, text: "Laku noć", audioSrc: "/audio/hr/laku_noc.mp3" },
      { challengeId: 4, correct: false, text: "Dobar dan", audioSrc: "/audio/hr/dobar_dan.mp3" },
      { challengeId: 4, correct: false, text: "Ne", audioSrc: "/audio/hr/ne.mp3" },

      // Challenge 5: "Thank you" (Hvala)
      { challengeId: 5, correct: true, text: "Hvala", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/hvala.mp3" },
      { challengeId: 5, correct: false, text: "Molim", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/molim.mp3" },
      { challengeId: 5, correct: false, text: "Bok", imageSrc: "/points.svg", audioSrc: "/audio/hr/bok.mp3" },

      // Challenge 6: "Please / You're welcome" (Molim)
      { challengeId: 6, correct: true, text: "Molim", audioSrc: "/audio/hr/molim.mp3" },
      { challengeId: 6, correct: false, text: "Hvala", audioSrc: "/audio/hr/hvala.mp3" },
      { challengeId: 6, correct: false, text: "Oprosti", audioSrc: "/audio/hr/oprosti.mp3" },

      // Challenge 7: "Thank you very much" (Hvala lijepa)
      { challengeId: 7, correct: true, text: "Hvala lijepa", audioSrc: "/audio/hr/hvala_lijepa.mp3" },
      { challengeId: 7, correct: false, text: "Laku noć", audioSrc: "/audio/hr/laku_noc.mp3" },
      { challengeId: 7, correct: false, text: "Ne", audioSrc: "/audio/hr/ne.mp3" },

      // Challenge 8: "Sorry / Excuse me" (Oprosti)
      { challengeId: 8, correct: true, text: "Oprosti", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/oprosti.mp3" },
      { challengeId: 8, correct: false, text: "Bok", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/bok.mp3" },
      { challengeId: 8, correct: false, text: "Da", imageSrc: "/points.svg", audioSrc: "/audio/hr/da.mp3" },

      // Challenge 9: "Yes" (Da)
      { challengeId: 9, correct: true, text: "Da", audioSrc: "/audio/hr/da.mp3" },
      { challengeId: 9, correct: false, text: "Ne", audioSrc: "/audio/hr/ne.mp3" },
      { challengeId: 9, correct: false, text: "Bok", audioSrc: "/audio/hr/bok.mp3" },

      // Challenge 10: "No" (Ne)
      { challengeId: 10, correct: true, text: "Ne", audioSrc: "/audio/hr/ne.mp3" },
      { challengeId: 10, correct: false, text: "Da", audioSrc: "/audio/hr/da.mp3" },
      { challengeId: 10, correct: false, text: "Hvala", audioSrc: "/audio/hr/hvala.mp3" },

      // Challenge 11: "How are you?" (Kako si?)
      { challengeId: 11, correct: true, text: "Kako si?", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/kako_si.mp3" },
      { challengeId: 11, correct: false, text: "Dobar dan", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/dobar_dan.mp3" },
      { challengeId: 11, correct: false, text: "Molim", imageSrc: "/points.svg", audioSrc: "/audio/hr/molim.mp3" },

      // Challenge 12: "I am good!" (Dobro sam!)
      { challengeId: 12, correct: true, text: "Dobro sam!", audioSrc: "/audio/hr/dobro_sam.mp3" },
      { challengeId: 12, correct: false, text: "Ne", audioSrc: "/audio/hr/ne.mp3" },
      { challengeId: 12, correct: false, text: "Laku noć", audioSrc: "/audio/hr/laku_noc.mp3" },

      // Challenge 13: "Mom" (Mama)
      { challengeId: 13, correct: true, text: "Mama", imageSrc: "/woman.svg", audioSrc: "/audio/hr/mama.mp3" },
      { challengeId: 13, correct: false, text: "Tata", imageSrc: "/man.svg", audioSrc: "/audio/hr/tata.mp3" },
      { challengeId: 13, correct: false, text: "Brat", imageSrc: "/boy.svg", audioSrc: "/audio/hr/brat.mp3" },

      // Challenge 14: "Dad" (Tata)
      { challengeId: 14, correct: true, text: "Tata", imageSrc: "/man.svg", audioSrc: "/audio/hr/tata.mp3" },
      { challengeId: 14, correct: false, text: "Mama", imageSrc: "/woman.svg", audioSrc: "/audio/hr/mama.mp3" },
      { challengeId: 14, correct: false, text: "Sestra", imageSrc: "/girl.svg", audioSrc: "/audio/hr/sestra.mp3" },

      // Challenge 15: "Grandma" (Baka)
      { challengeId: 15, correct: true, text: "Baka", audioSrc: "/audio/hr/baka.mp3" },
      { challengeId: 15, correct: false, text: "Djed", audioSrc: "/audio/hr/djed.mp3" },
      { challengeId: 15, correct: false, text: "Tata", audioSrc: "/audio/hr/tata.mp3" },

      // Challenge 16: "Grandpa" (Djed)
      { challengeId: 16, correct: true, text: "Djed", audioSrc: "/audio/hr/djed.mp3" },
      { challengeId: 16, correct: false, text: "Baka", audioSrc: "/audio/hr/baka.mp3" },
      { challengeId: 16, correct: false, text: "Mama", audioSrc: "/audio/hr/mama.mp3" },

      // Challenge 17: "the boy" (Dječak)
      { challengeId: 17, correct: true, text: "Dječak", imageSrc: "/boy.svg", audioSrc: "/audio/hr/djecak.mp3" },
      { challengeId: 17, correct: false, text: "Djevojčica", imageSrc: "/girl.svg", audioSrc: "/audio/hr/djevojcica.mp3" },
      { challengeId: 17, correct: false, text: "Muškarac", imageSrc: "/man.svg", audioSrc: "/audio/hr/muskarac.mp3" },

      // Challenge 18: "the girl" (Djevojčica)
      { challengeId: 18, correct: true, text: "Djevojčica", imageSrc: "/girl.svg", audioSrc: "/audio/hr/djevojcica.mp3" },
      { challengeId: 18, correct: false, text: "Dječak", imageSrc: "/boy.svg", audioSrc: "/audio/hr/djecak.mp3" },
      { challengeId: 18, correct: false, text: "Žena", imageSrc: "/woman.svg", audioSrc: "/audio/hr/zena.mp3" },

      // Challenge 19: "Brother" (Brat)
      { challengeId: 19, correct: true, text: "Brat", audioSrc: "/audio/hr/brat.mp3" },
      { challengeId: 19, correct: false, text: "Sestra", audioSrc: "/audio/hr/sestra.mp3" },
      { challengeId: 19, correct: false, text: "Mama", audioSrc: "/audio/hr/mama.mp3" },

      // Challenge 20: "Sister" (Sestra)
      { challengeId: 20, correct: true, text: "Sestra", audioSrc: "/audio/hr/sestra.mp3" },
      { challengeId: 20, correct: false, text: "Brat", audioSrc: "/audio/hr/brat.mp3" },
      { challengeId: 20, correct: false, text: "Tata", audioSrc: "/audio/hr/tata.mp3" },

      // Challenge 21: "Baby" (Beba)
      { challengeId: 21, correct: true, text: "Beba", audioSrc: "/audio/hr/beba.mp3" },
      { challengeId: 21, correct: false, text: "Dječak", audioSrc: "/audio/hr/djecak.mp3" },
      { challengeId: 21, correct: false, text: "Tata", audioSrc: "/audio/hr/tata.mp3" },

      // Challenge 22: "That is mom" (To je mama)
      { challengeId: 22, correct: true, text: "To je mama", imageSrc: "/woman.svg", audioSrc: "/audio/hr/to_je_mama.mp3" },
      { challengeId: 22, correct: false, text: "To je tata", imageSrc: "/man.svg", audioSrc: "/audio/hr/to_je_tata.mp3" },
      { challengeId: 22, correct: false, text: "Bok mama", imageSrc: "/girl.svg", audioSrc: "/audio/hr/bok_mama.mp3" },

      // Challenge 23: "I love you" (Volim te)
      { challengeId: 23, correct: true, text: "Volim te", audioSrc: "/audio/hr/volim_te.mp3" },
      { challengeId: 23, correct: false, text: "Hvala", audioSrc: "/audio/hr/hvala.mp3" },
      { challengeId: 23, correct: false, text: "Oprosti", audioSrc: "/audio/hr/oprosti.mp3" },

      // Challenge 24: "the dog" (Pas)
      { challengeId: 24, correct: true, text: "Pas", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/pas.mp3" },
      { challengeId: 24, correct: false, text: "Mačka", imageSrc: "/girl.svg", audioSrc: "/audio/hr/macka.mp3" },
      { challengeId: 24, correct: false, text: "Riba", imageSrc: "/boy.svg", audioSrc: "/audio/hr/riba.mp3" },

      // Challenge 25: "the cat" (Mačka)
      { challengeId: 25, correct: true, text: "Mačka", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/macka.mp3" },
      { challengeId: 25, correct: false, text: "Pas", imageSrc: "/boy.svg", audioSrc: "/audio/hr/pas.mp3" },
      { challengeId: 25, correct: false, text: "Ptica", imageSrc: "/girl.svg", audioSrc: "/audio/hr/ptica.mp3" },

      // Challenge 26: "Fish" (Riba)
      { challengeId: 26, correct: true, text: "Riba", audioSrc: "/audio/hr/riba.mp3" },
      { challengeId: 26, correct: false, text: "Ptica", audioSrc: "/audio/hr/ptica.mp3" },
      { challengeId: 26, correct: false, text: "Pas", audioSrc: "/audio/hr/pas.mp3" },

      // Challenge 27: "Bird" (Ptica)
      { challengeId: 27, correct: true, text: "Ptica", audioSrc: "/audio/hr/ptica.mp3" },
      { challengeId: 27, correct: false, text: "Riba", audioSrc: "/audio/hr/riba.mp3" },
      { challengeId: 27, correct: false, text: "Mačka", audioSrc: "/audio/hr/macka.mp3" },

      // Challenge 28: "Cow" (Krava)
      { challengeId: 28, correct: true, text: "Krava", audioSrc: "/audio/hr/krava.mp3" },
      { challengeId: 28, correct: false, text: "Konj", audioSrc: "/audio/hr/konj.mp3" },
      { challengeId: 28, correct: false, text: "Patka", audioSrc: "/audio/hr/patka.mp3" },

      // Challenge 29: "Horse" (Konj)
      { challengeId: 29, correct: true, text: "Konj", audioSrc: "/audio/hr/konj.mp3" },
      { challengeId: 29, correct: false, text: "Krava", audioSrc: "/audio/hr/krava.mp3" },
      { challengeId: 29, correct: false, text: "Svinja", audioSrc: "/audio/hr/svinja.mp3" },

      // Challenge 30: "the duck" (Patka)
      { challengeId: 30, correct: true, text: "Patka", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/patka.mp3" },
      { challengeId: 30, correct: false, text: "Konj", imageSrc: "/man.svg", audioSrc: "/audio/hr/konj.mp3" },
      { challengeId: 30, correct: false, text: "Pas", imageSrc: "/boy.svg", audioSrc: "/audio/hr/pas.mp3" },

      // Challenge 31: "Pig" (Svinja)
      { challengeId: 31, correct: true, text: "Svinja", audioSrc: "/audio/hr/svinja.mp3" },
      { challengeId: 31, correct: false, text: "Krava", audioSrc: "/audio/hr/krava.mp3" },
      { challengeId: 31, correct: false, text: "Ptica", audioSrc: "/audio/hr/ptica.mp3" },

      // Challenge 32: "Big dog" (Veliki pas)
      { challengeId: 32, correct: true, text: "Veliki pas", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/veliki_pas.mp3" },
      { challengeId: 32, correct: false, text: "Mala mačka", imageSrc: "/girl.svg", audioSrc: "/audio/hr/mala_macka.mp3" },
      { challengeId: 32, correct: false, text: "Dobar konj", imageSrc: "/man.svg", audioSrc: "/audio/hr/dobar_konj.mp3" },

      // Challenge 33: "Little cat" (Mala mačka)
      { challengeId: 33, correct: true, text: "Mala mačka", audioSrc: "/audio/hr/mala_macka.mp3" },
      { challengeId: 33, correct: false, text: "Veliki pas", audioSrc: "/audio/hr/veliki_pas.mp3" },
      { challengeId: 33, correct: false, text: "Dobra ptica", audioSrc: "/audio/hr/dobra_ptica.mp3" },

      // Challenge 34: "Good dog" (Dobar pas)
      { challengeId: 34, correct: true, text: "Dobar pas", audioSrc: "/audio/hr/dobar_pas.mp3" },
      { challengeId: 34, correct: false, text: "Zao pas", audioSrc: "/audio/hr/zao_pas.mp3" },
      { challengeId: 34, correct: false, text: "Velika krava", audioSrc: "/audio/hr/velika_krava.mp3" },

      // Challenge 35: "Red" (Crvena)
      { challengeId: 35, correct: true, text: "Crvena", imageSrc: "/heart.svg", audioSrc: "/audio/hr/crvena.mp3" },
      { challengeId: 35, correct: false, text: "Plava", imageSrc: "/points.svg", audioSrc: "/audio/hr/plava.mp3" },
      { challengeId: 35, correct: false, text: "Žuta", imageSrc: "/learn.svg", audioSrc: "/audio/hr/zuta.mp3" },

      // Challenge 36: "Blue" (Plava)
      { challengeId: 36, correct: true, text: "Plava", audioSrc: "/audio/hr/plava.mp3" },
      { challengeId: 36, correct: false, text: "Crvena", audioSrc: "/audio/hr/crvena.mp3" },
      { challengeId: 36, correct: false, text: "Zelena", audioSrc: "/audio/hr/zelena.mp3" },

      // Challenge 37: "Yellow" (Žuta)
      { challengeId: 37, correct: true, text: "Žuta", audioSrc: "/audio/hr/zuta.mp3" },
      { challengeId: 37, correct: false, text: "Plava", audioSrc: "/audio/hr/plava.mp3" },
      { challengeId: 37, correct: false, text: "Bijela", audioSrc: "/audio/hr/bijela.mp3" },

      // Challenge 38: "Green" (Zelena)
      { challengeId: 38, correct: true, text: "Zelena", imageSrc: "/learn.svg", audioSrc: "/audio/hr/zelena.mp3" },
      { challengeId: 38, correct: false, text: "Crvena", imageSrc: "/heart.svg", audioSrc: "/audio/hr/crvena.mp3" },
      { challengeId: 38, correct: false, text: "Crna", imageSrc: "/mascot_bad.svg", audioSrc: "/audio/hr/crna.mp3" },

      // Challenge 39: "One (1)" (Jedan)
      { challengeId: 39, correct: true, text: "Jedan", audioSrc: "/audio/hr/jedan.mp3" },
      { challengeId: 39, correct: false, text: "Dva", audioSrc: "/audio/hr/dva.mp3" },
      { challengeId: 39, correct: false, text: "Tri", audioSrc: "/audio/hr/tri.mp3" },

      // Challenge 40: "Two (2)" (Dva)
      { challengeId: 40, correct: true, text: "Dva", audioSrc: "/audio/hr/dva.mp3" },
      { challengeId: 40, correct: false, text: "Jedan", audioSrc: "/audio/hr/jedan.mp3" },
      { challengeId: 40, correct: false, text: "Četiri", audioSrc: "/audio/hr/cetiri.mp3" },

      // Challenge 41: "Three (3)" (Tri)
      { challengeId: 41, correct: true, text: "Tri", audioSrc: "/audio/hr/tri.mp3" },
      { challengeId: 41, correct: false, text: "Dva", audioSrc: "/audio/hr/dva.mp3" },
      { challengeId: 41, correct: false, text: "Pet", audioSrc: "/audio/hr/pet.mp3" },

      // Challenge 42: "Four (4)" (Četiri)
      { challengeId: 42, correct: true, text: "Četiri", imageSrc: "/points.svg", audioSrc: "/audio/hr/cetiri.mp3" },
      { challengeId: 42, correct: false, text: "Pet", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/pet.mp3" },
      { challengeId: 42, correct: false, text: "Jedan", imageSrc: "/heart.svg", audioSrc: "/audio/hr/jedan.mp3" },

      // Challenge 43: "Five (5)" (Pet)
      { challengeId: 43, correct: true, text: "Pet", audioSrc: "/audio/hr/pet.mp3" },
      { challengeId: 43, correct: false, text: "Četiri", audioSrc: "/audio/hr/cetiri.mp3" },
      { challengeId: 43, correct: false, text: "Tri", audioSrc: "/audio/hr/tri.mp3" },

      // Challenge 44: "Six (6)" (Šest)
      { challengeId: 44, correct: true, text: "Šest", audioSrc: "/audio/hr/sest.mp3" },
      { challengeId: 44, correct: false, text: "Sedam", audioSrc: "/audio/hr/sedam.mp3" },
      { challengeId: 44, correct: false, text: "Osam", audioSrc: "/audio/hr/osam.mp3" },

      // Challenge 45: "Seven (7)" (Sedam)
      { challengeId: 45, correct: true, text: "Sedam", audioSrc: "/audio/hr/sedam.mp3" },
      { challengeId: 45, correct: false, text: "Šest", audioSrc: "/audio/hr/sest.mp3" },
      { challengeId: 45, correct: false, text: "Devet", audioSrc: "/audio/hr/devet.mp3" },

      // Challenge 46: "Eight (8)" (Osam)
      { challengeId: 46, correct: true, text: "Osam", audioSrc: "/audio/hr/osam.mp3" },
      { challengeId: 46, correct: false, text: "Sedam", audioSrc: "/audio/hr/sedam.mp3" },
      { challengeId: 46, correct: false, text: "Deset", audioSrc: "/audio/hr/deset.mp3" },

      // Challenge 47: "Nine (9)" (Devet)
      { challengeId: 47, correct: true, text: "Devet", audioSrc: "/audio/hr/devet.mp3" },
      { challengeId: 47, correct: false, text: "Deset", audioSrc: "/audio/hr/deset.mp3" },
      { challengeId: 47, correct: false, text: "Osam", audioSrc: "/audio/hr/osam.mp3" },

      // Challenge 48: "Ten (10)" (Deset)
      { challengeId: 48, correct: true, text: "Deset", imageSrc: "/points.svg", audioSrc: "/audio/hr/deset.mp3" },
      { challengeId: 48, correct: false, text: "Devet", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/devet.mp3" },
      { challengeId: 48, correct: false, text: "Sedam", imageSrc: "/learn.svg", audioSrc: "/audio/hr/sedam.mp3" },

      // Challenge 49: "Apple" (Jabuka)
      { challengeId: 49, correct: true, text: "Jabuka", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/jabuka.mp3" },
      { challengeId: 49, correct: false, text: "Banana", imageSrc: "/points.svg", audioSrc: "/audio/hr/banana.mp3" },
      { challengeId: 49, correct: false, text: "Kruh", imageSrc: "/heart.svg", audioSrc: "/audio/hr/kruh.mp3" },

      // Challenge 50: "Banana" (Banana)
      { challengeId: 50, correct: true, text: "Banana", audioSrc: "/audio/hr/banana.mp3" },
      { challengeId: 50, correct: false, text: "Jabuka", audioSrc: "/audio/hr/jabuka.mp3" },
      { challengeId: 50, correct: false, text: "Voda", audioSrc: "/audio/hr/voda.mp3" },

      // Challenge 51: "Ice cream" (Sladoled)
      { challengeId: 51, correct: true, text: "Sladoled", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/sladoled.mp3" },
      { challengeId: 51, correct: false, text: "Čokolada", imageSrc: "/points.svg", audioSrc: "/audio/hr/cokolada.mp3" },
      { challengeId: 51, correct: false, text: "Sok", imageSrc: "/learn.svg", audioSrc: "/audio/hr/sok.mp3" },

      // Challenge 52: "Chocolate" (Čokolada)
      { challengeId: 52, correct: true, text: "Čokolada", audioSrc: "/audio/hr/cokolada.mp3" },
      { challengeId: 52, correct: false, text: "Sladoled", audioSrc: "/audio/hr/sladoled.mp3" },
      { challengeId: 52, correct: false, text: "Kruh", audioSrc: "/audio/hr/kruh.mp3" },

      // Challenge 53: "Water" (Voda)
      { challengeId: 53, correct: true, text: "Voda", audioSrc: "/audio/hr/voda.mp3" },
      { challengeId: 53, correct: false, text: "Mlijeko", audioSrc: "/audio/hr/mlijeko.mp3" },
      { challengeId: 53, correct: false, text: "Sok", audioSrc: "/audio/hr/sok.mp3" },

      // Challenge 54: "Milk" (Mlijeko)
      { challengeId: 54, correct: true, text: "Mlijeko", audioSrc: "/audio/hr/mlijeko.mp3" },
      { challengeId: 54, correct: false, text: "Voda", audioSrc: "/audio/hr/voda.mp3" },
      { challengeId: 54, correct: false, text: "Sok", audioSrc: "/audio/hr/sok.mp3" },

      // Challenge 55: "Juice" (Sok)
      { challengeId: 55, correct: true, text: "Sok", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/sok.mp3" },
      { challengeId: 55, correct: false, text: "Voda", imageSrc: "/heart.svg", audioSrc: "/audio/hr/voda.mp3" },
      { challengeId: 55, correct: false, text: "Mlijeko", imageSrc: "/points.svg", audioSrc: "/audio/hr/mlijeko.mp3" },

      // Challenge 56: "Bread" (Kruh)
      { challengeId: 56, correct: true, text: "Kruh", audioSrc: "/audio/hr/kruh.mp3" },
      { challengeId: 56, correct: false, text: "Jabuka", audioSrc: "/audio/hr/jabuka.mp3" },
      { challengeId: 56, correct: false, text: "Čokolada", audioSrc: "/audio/hr/cokolada.mp3" },

      // Challenge 57: "I am hungry" (Gladan sam)
      { challengeId: 57, correct: true, text: "Gladan sam", audioSrc: "/audio/hr/gladan_sam.mp3" },
      { challengeId: 57, correct: false, text: "Dobro sam", audioSrc: "/audio/hr/dobro_sam.mp3" },
      { challengeId: 57, correct: false, text: "Bok", audioSrc: "/audio/hr/bok.mp3" },

      // Challenge 58: "May I have ice cream, please?" (Mogu li dobiti sladoled, molim?)
      { challengeId: 58, correct: true, text: "Mogu li dobiti sladoled, molim?", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/mogu_li_dobiti_sladoled_molim.mp3" },
      { challengeId: 58, correct: false, text: "Volim te mama", imageSrc: "/woman.svg", audioSrc: "/audio/hr/volim_te_mama.mp3" },
      { challengeId: 58, correct: false, text: "Laku noć", imageSrc: "/man.svg", audioSrc: "/audio/hr/laku_noc.mp3" },

      // Challenge 59: "Very tasty / Delicious!" (Jako je ukusno!)
      { challengeId: 59, correct: true, text: "Jako je ukusno!", audioSrc: "/audio/hr/jako_je_ukusno.mp3" },
      { challengeId: 59, correct: false, text: "Ne hvala", audioSrc: "/audio/hr/ne_hvala.mp3" },
      { challengeId: 59, correct: false, text: "Oprosti", audioSrc: "/audio/hr/oprosti.mp3" },
    ]);

    // Restore existing users and subscriptions
    if (savedUserProgress.length > 0) {
      console.log(`Restoring progress for ${savedUserProgress.length} user(s)...`);
      for (const u of savedUserProgress) {
        await db.insert(schema.userProgress).values({
          ...u,
          activeCourseId: 1,
        });
      }
    }

    if (savedSubscriptions.length > 0) {
      for (const s of savedSubscriptions) {
        await db.insert(schema.userSubscription).values(s);
      }
    }

    console.log("Croatian curriculum seeding finished successfully with HD audio! (5 Units, 15 Lessons, 59 Challenges)");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  }
};

main();
