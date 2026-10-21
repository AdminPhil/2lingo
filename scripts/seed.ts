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
      {
        id: 6,
        courseId: 1,
        title: "Unit 6",
        description: "Moja soba i kuća (My Room & Home)",
        order: 6,
      },
      {
        id: 7,
        courseId: 1,
        title: "Unit 7",
        description: "Tijelo i pokret (Body & Movement)",
        order: 7,
      },
      {
        id: 8,
        courseId: 1,
        title: "Unit 8",
        description: "More i ljeto (The Adriatic Coast & Summer)",
        order: 8,
      },
      {
        id: 9,
        courseId: 1,
        title: "Unit 9",
        description: "Odjeća (Clothes & Dressing Up)",
        order: 9,
      },
      {
        id: 10,
        courseId: 1,
        title: "Unit 10",
        description: "Vrijeme i osjećaji (Weather & Feelings)",
        order: 10,
      },
      {
        id: 11,
        courseId: 1,
        title: "Unit 11",
        description: "Moji dnevni pokreti i radnje (Daily Actions & Verbs)",
        order: 11,
      },
      {
        id: 12,
        courseId: 1,
        title: "Unit 12",
        description: "U gradu i parku (Out in the Town & Park)",
        order: 12,
      },
      {
        id: 13,
        courseId: 1,
        title: "Unit 13",
        description: "Gdje je to? Prostor i smjer (Where is it? Positions & Prepositions)",
        order: 13,
      },
      {
        id: 14,
        courseId: 1,
        title: "Unit 14",
        description: "U pekari i na tržnici (At the Bakery & Farmer's Market)",
        order: 14,
      },
      {
        id: 15,
        courseId: 1,
        title: "Unit 15",
        description: "Igra, sport i zabava (Sports, Games & Celebration)",
        order: 15,
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

      // Unit 1-5 Boss Quests (Order 4 Capstone for each unit)
      { id: 16, unitId: 1, order: 4, title: "👑 Super Izazov: Prvi koraci (First Steps Trophy)" },
      { id: 17, unitId: 2, order: 4, title: "👑 Super Izazov: Obiteljski heroj (Family Hero Trophy)" },
      { id: 18, unitId: 3, order: 4, title: "👑 Super Izazov: Šaptač životinjama (Animal Whisperer Trophy)" },
      { id: 19, unitId: 4, order: 4, title: "👑 Super Izazov: Majstor boja i brojeva (Color & Number Master)" },
      { id: 20, unitId: 5, order: 4, title: "👑 Super Izazov: Mali kuhar (Little Chef Trophy)" },
      // Unit 6 Lessons (21-24)
      { id: 21, unitId: 6, order: 1, title: "Kuća i soba (House & Room)" },
      { id: 22, unitId: 6, order: 2, title: "Vrata i prozori (Doors, Windows & Toys)" },
      { id: 23, unitId: 6, order: 3, title: "U mojoj sobi (In My Room)" },
      { id: 24, unitId: 6, order: 4, title: "👑 Super Izazov: Arhitekt sobe (Room Architect Trophy)" },
      // Unit 7 Lessons (25-28)
      { id: 25, unitId: 7, order: 1, title: "Dijelovi tijela (Body Parts)" },
      { id: 26, unitId: 7, order: 2, title: "Lice i osjetila (Face & Senses)" },
      { id: 27, unitId: 7, order: 3, title: "Pokret i akcija (Move & Play!)" },
      { id: 28, unitId: 7, order: 4, title: "👑 Super Izazov: Plesni majstor (Dance Master Trophy)" },

      // Unit 8 Lessons (29-32)
      { id: 29, unitId: 8, order: 1, title: "Na plaži (At the Beach)" },
      { id: 30, unitId: 8, order: 2, title: "Plovidba i otoci (Islands & Sailing)" },
      { id: 31, unitId: 8, order: 3, title: "Morska bića (Sea Creatures)" },
      { id: 32, unitId: 8, order: 4, title: "👑 Super Izazov: Kapetan Jadrana (Adriatic Captain Trophy)" },

      // Unit 9 Lessons (33-36)
      { id: 33, unitId: 9, order: 1, title: "Svakodnevna odjeća (Everyday Clothes)" },
      { id: 34, unitId: 9, order: 2, title: "Za van i zimu (Cozy & Warm)" },
      { id: 35, unitId: 9, order: 3, title: "Obuci se! (Getting Dressed)" },
      { id: 36, unitId: 9, order: 4, title: "👑 Super Izazov: Modni kreator (Fashion Star Trophy)" },

      // Unit 10 Lessons (37-40)
      { id: 37, unitId: 10, order: 1, title: "Kakvo je vrijeme? (Weather)" },
      { id: 38, unitId: 10, order: 2, title: "Toplo ili hladno? (Hot & Cold)" },
      { id: 39, unitId: 10, order: 3, title: "Kako se osjećaš? (How are you feeling?)" },
      { id: 40, unitId: 10, order: 4, title: "👑 Super Izazov: Vremenski čuvar (Weather Explorer Trophy)" },
      // Unit 11 Lessons (41-44)
      { id: 41, unitId: 11, order: 1, title: "Što radim? (What Am I Doing? - Core Verbs)" },
      { id: 42, unitId: 11, order: 2, title: "Pogledaj i poslušaj (Look, Listen & Learn)" },
      { id: 43, unitId: 11, order: 3, title: "U akciji! (In Action - Verb Pairs)" },
      { id: 44, unitId: 11, order: 4, title: "👑 Super Izazov: Mali Aktivac (Busy Bee Trophy)" },

      // Unit 12 Lessons (45-48)
      { id: 45, unitId: 12, order: 1, title: "U parku (At the Park - Equipment & Nature)" },
      { id: 46, unitId: 12, order: 2, title: "Na ulici (On the Street & Vehicles)" },
      { id: 47, unitId: 12, order: 3, title: "Idemo van! (Let's Go Outside!)" },
      { id: 48, unitId: 12, order: 4, title: "👑 Super Izazov: Istraživač Parka (Park Explorer Trophy)" },

      // Unit 13 Lessons (49-52)
      { id: 49, unitId: 13, order: 1, title: "Ovdje i tamo (Here, There & Heights)" },
      { id: 50, unitId: 13, order: 2, title: "Gdje se skriva? (In, On & Under)" },
      { id: 51, unitId: 13, order: 3, title: "Skrivača! (Hide-and-Seek Clues)" },
      { id: 52, unitId: 13, order: 4, title: "👑 Super Izazov: Mali Navigator (Little Navigator Trophy)" },

      // Unit 14 Lessons (53-56)
      { id: 53, unitId: 14, order: 1, title: "Fina pekara (The Yummy Bakery)" },
      { id: 54, unitId: 14, order: 2, title: "Šarena tržnica (The Colorful Market)" },
      { id: 55, unitId: 14, order: 3, title: "Kupujemo zajedno (Ordering Politely)" },
      { id: 56, unitId: 14, order: 4, title: "👑 Super Izazov: Glavni Kupac (Master Shopper Trophy)" },

      // Unit 15 Lessons (57-60)
      { id: 57, unitId: 15, order: 1, title: "Lopta i nogomet (Ball & Soccer)" },
      { id: 58, unitId: 15, order: 2, title: "Pjesma i crtanje (Music & Art)" },
      { id: 59, unitId: 15, order: 3, title: "Zabava i navijanje (Fun & Cheering)" },
      { id: 60, unitId: 15, order: 4, title: "👑 Super Izazov: Zlatni Prvak (Golden Champion Trophy)" },
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
      // ==========================================
      // UNIT 1 BOSS QUEST: SUPER IZAZOV (Lesson 16)
      // ==========================================
      { id: 60, lessonId: 16, type: "SELECT", order: 1, question: 'Which one of these is "Hello / Hi"?' },
      { id: 61, lessonId: 16, type: "ASSIST", order: 2, question: '"Good day"' },
      { id: 62, lessonId: 16, type: "SELECT", order: 3, question: 'Which one of these is "Thank you"?' },
      { id: 63, lessonId: 16, type: "ASSIST", order: 4, question: '"Good night"' },
      { id: 64, lessonId: 16, type: "ASSIST", order: 5, question: '"How are you?"' },
      { id: 65, lessonId: 16, type: "SELECT", order: 6, question: 'Which one of these is "Goodbye"?' },

      // ==========================================
      // UNIT 2 BOSS QUEST: SUPER IZAZOV (Lesson 17)
      // ==========================================
      { id: 66, lessonId: 17, type: "SELECT", order: 1, question: 'Which one of these is "Mom"?' },
      { id: 67, lessonId: 17, type: "SELECT", order: 2, question: 'Which one of these is "Dad"?' },
      { id: 68, lessonId: 17, type: "SELECT", order: 3, question: 'Which one of these is "Boy"?' },
      { id: 69, lessonId: 17, type: "SELECT", order: 4, question: 'Which one of these is "Girl"?' },
      { id: 70, lessonId: 17, type: "ASSIST", order: 5, question: '"That is mom"' },
      { id: 71, lessonId: 17, type: "ASSIST", order: 6, question: '"I love you"' },

      // ==========================================
      // UNIT 3 BOSS QUEST: SUPER IZAZOV (Lesson 18)
      // ==========================================
      { id: 72, lessonId: 18, type: "SELECT", order: 1, question: 'Which one of these is "Dog"?' },
      { id: 73, lessonId: 18, type: "SELECT", order: 2, question: 'Which one of these is "Cat"?' },
      { id: 74, lessonId: 18, type: "SELECT", order: 3, question: 'Which one of these is "Horse"?' },
      { id: 75, lessonId: 18, type: "ASSIST", order: 4, question: '"Big dog"' },
      { id: 76, lessonId: 18, type: "ASSIST", order: 5, question: '"Little cat"' },
      { id: 77, lessonId: 18, type: "ASSIST", order: 6, question: '"Good dog"' },

      // ==========================================
      // UNIT 4 BOSS QUEST: SUPER IZAZOV (Lesson 19)
      // ==========================================
      { id: 78, lessonId: 19, type: "SELECT", order: 1, question: 'Which one of these is "Red"?' },
      { id: 79, lessonId: 19, type: "SELECT", order: 2, question: 'Which one of these is "Green"?' },
      { id: 80, lessonId: 19, type: "SELECT", order: 3, question: 'Which one of these is "Four"?' },
      { id: 81, lessonId: 19, type: "ASSIST", order: 4, question: '"Blue"' },
      { id: 82, lessonId: 19, type: "SELECT", order: 5, question: 'Which one of these is "One"?' },
      { id: 83, lessonId: 19, type: "SELECT", order: 6, question: 'Which one of these is "Ten"?' },

      // ==========================================
      // UNIT 5 BOSS QUEST: SUPER IZAZOV (Lesson 20)
      // ==========================================
      { id: 84, lessonId: 20, type: "SELECT", order: 1, question: 'Which one of these is "Apple"?' },
      { id: 85, lessonId: 20, type: "SELECT", order: 2, question: 'Which one of these is "Ice cream"?' },
      { id: 86, lessonId: 20, type: "SELECT", order: 3, question: 'Which one of these is "Water"?' },
      { id: 87, lessonId: 20, type: "ASSIST", order: 4, question: '"I am hungry"' },
      { id: 88, lessonId: 20, type: "SELECT", order: 5, question: 'Which one means "May I have ice cream, please?"' },
      { id: 89, lessonId: 20, type: "ASSIST", order: 6, question: '"Very tasty / Delicious!"' },
      // ==========================================
      // UNIT 6: LESSON 21 (Kuća i soba)
      // ==========================================
      { id: 90, lessonId: 21, type: "SELECT", order: 1, question: 'Which one of these is "House / Home"?' },
      { id: 91, lessonId: 21, type: "SELECT", order: 2, question: 'Which one of these is "Room"?' },
      { id: 92, lessonId: 21, type: "SELECT", order: 3, question: 'Which one of these is "Bed"?' },
      { id: 93, lessonId: 21, type: "ASSIST", order: 4, question: '"Table / Desk"' },

      // ==========================================
      // UNIT 6: LESSON 22 (Vrata i prozori)
      // ==========================================
      { id: 94, lessonId: 22, type: "SELECT", order: 1, question: 'Which one of these is "Door"?' },
      { id: 95, lessonId: 22, type: "SELECT", order: 2, question: 'Which one of these is "Window"?' },
      { id: 96, lessonId: 22, type: "SELECT", order: 3, question: 'Which one of these is "Toy"?' },
      { id: 97, lessonId: 22, type: "ASSIST", order: 4, question: '"Book"' },

      // ==========================================
      // UNIT 6: LESSON 23 (U mojoj sobi)
      // ==========================================
      { id: 98, lessonId: 23, type: "ASSIST", order: 1, question: '"My room"' },
      { id: 99, lessonId: 23, type: "ASSIST", order: 2, question: '"Big house"' },
      { id: 100, lessonId: 23, type: "ASSIST", order: 3, question: '"My bed"' },
      { id: 101, lessonId: 23, type: "ASSIST", order: 4, question: '"That is my book"' },

      // ==========================================
      // UNIT 6: LESSON 24 (👑 SUPER IZAZOV)
      // ==========================================
      { id: 102, lessonId: 24, type: "SELECT", order: 1, question: 'Which one of these is "House"?' },
      { id: 103, lessonId: 24, type: "SELECT", order: 2, question: 'Which one of these is "Bed"?' },
      { id: 104, lessonId: 24, type: "SELECT", order: 3, question: 'Which one of these is "Toy"?' },
      { id: 105, lessonId: 24, type: "ASSIST", order: 4, question: '"Open the window"' },
      { id: 106, lessonId: 24, type: "ASSIST", order: 5, question: '"Where is the toy?"' },
      { id: 107, lessonId: 24, type: "ASSIST", order: 6, question: '"That is my book"' },
      // ==========================================
      // UNIT 7: BODY & MOVEMENT (Lessons 25-28)
      // ==========================================
      { id: 108, lessonId: 25, type: "SELECT", order: 1, question: 'Which one of these is "Head"?' },
      { id: 109, lessonId: 25, type: "SELECT", order: 2, question: 'Which one of these is "Hand / Arm"?' },
      { id: 110, lessonId: 25, type: "SELECT", order: 3, question: 'Which one of these is "Leg / Foot"?' },
      { id: 111, lessonId: 25, type: "ASSIST", order: 4, question: '"Eye"' },

      { id: 112, lessonId: 26, type: "SELECT", order: 1, question: 'Which one of these is "Ear"?' },
      { id: 113, lessonId: 26, type: "SELECT", order: 2, question: 'Which one of these is "Nose"?' },
      { id: 114, lessonId: 26, type: "SELECT", order: 3, question: 'Which one of these is "Mouth"?' },
      { id: 115, lessonId: 26, type: "ASSIST", order: 4, question: '"Hair"' },

      { id: 116, lessonId: 27, type: "ASSIST", order: 1, question: '"Jump!"' },
      { id: 117, lessonId: 27, type: "ASSIST", order: 2, question: '"Run!"' },
      { id: 118, lessonId: 27, type: "ASSIST", order: 3, question: '"Hands up!"' },
      { id: 119, lessonId: 27, type: "ASSIST", order: 4, question: '"Clap your hands!"' },

      { id: 120, lessonId: 28, type: "SELECT", order: 1, question: 'Which one of these is "Head"?' },
      { id: 121, lessonId: 28, type: "SELECT", order: 2, question: 'Which one of these is "Hand"?' },
      { id: 122, lessonId: 28, type: "SELECT", order: 3, question: 'Which one of these is "Nose"?' },
      { id: 123, lessonId: 28, type: "ASSIST", order: 4, question: '"Raise your hand!"' },
      { id: 124, lessonId: 28, type: "ASSIST", order: 5, question: '"Run fast!"' },
      { id: 125, lessonId: 28, type: "ASSIST", order: 6, question: '"Hands up!"' },

      // ==========================================
      // UNIT 8: ADRIATIC & SUMMER (Lessons 29-32)
      // ==========================================
      { id: 126, lessonId: 29, type: "SELECT", order: 1, question: 'Which one of these is "Sea"?' },
      { id: 127, lessonId: 29, type: "SELECT", order: 2, question: 'Which one of these is "Beach"?' },
      { id: 128, lessonId: 29, type: "SELECT", order: 3, question: 'Which one of these is "Sun"?' },
      { id: 129, lessonId: 29, type: "ASSIST", order: 4, question: '"Sand"' },

      { id: 130, lessonId: 30, type: "SELECT", order: 1, question: 'Which one of these is "Island"?' },
      { id: 131, lessonId: 30, type: "SELECT", order: 2, question: 'Which one of these is "Boat"?' },
      { id: 132, lessonId: 30, type: "SELECT", order: 3, question: 'Which one of these is "Swimming / Bathing"?' },
      { id: 133, lessonId: 30, type: "ASSIST", order: 4, question: '"Swimming"' },

      { id: 134, lessonId: 31, type: "SELECT", order: 1, question: 'Which one of these is "Seashell"?' },
      { id: 135, lessonId: 31, type: "SELECT", order: 2, question: 'Which one of these is "Dolphin"?' },
      { id: 136, lessonId: 31, type: "SELECT", order: 3, question: 'Which one of these is "Seagull"?' },
      { id: 137, lessonId: 31, type: "ASSIST", order: 4, question: '"Small boat"' },

      { id: 138, lessonId: 32, type: "SELECT", order: 1, question: 'Which one of these is "Sea"?' },
      { id: 139, lessonId: 32, type: "SELECT", order: 2, question: 'Which one of these is "Dolphin"?' },
      { id: 140, lessonId: 32, type: "SELECT", order: 3, question: 'Which one of these is "Island"?' },
      { id: 141, lessonId: 32, type: "ASSIST", order: 4, question: '"Warm sea"' },
      { id: 142, lessonId: 32, type: "ASSIST", order: 5, question: '"Let\'s go to the beach!"' },
      { id: 143, lessonId: 32, type: "ASSIST", order: 6, question: '"I love the sea!"' },

      // ==========================================
      // UNIT 9: CLOTHES (Lessons 33-36)
      // ==========================================
      { id: 144, lessonId: 33, type: "SELECT", order: 1, question: 'Which one of these is "T-Shirt"?' },
      { id: 145, lessonId: 33, type: "SELECT", order: 2, question: 'Which one of these is "Pants / Trousers"?' },
      { id: 146, lessonId: 33, type: "SELECT", order: 3, question: 'Which one of these is "Shoes"?' },
      { id: 147, lessonId: 33, type: "ASSIST", order: 4, question: '"Socks"' },

      { id: 148, lessonId: 34, type: "SELECT", order: 1, question: 'Which one of these is "Hat / Cap"?' },
      { id: 149, lessonId: 34, type: "SELECT", order: 2, question: 'Which one of these is "Jacket"?' },
      { id: 150, lessonId: 34, type: "SELECT", order: 3, question: 'Which one of these is "Dress"?' },
      { id: 151, lessonId: 34, type: "ASSIST", order: 4, question: '"Scarf"' },

      { id: 152, lessonId: 35, type: "ASSIST", order: 1, question: '"Put on the shirt"' },
      { id: 153, lessonId: 35, type: "ASSIST", order: 2, question: '"Warm jacket"' },
      { id: 154, lessonId: 35, type: "ASSIST", order: 3, question: '"Pretty dress"' },
      { id: 155, lessonId: 35, type: "ASSIST", order: 4, question: '"Where are my shoes?"' },

      { id: 156, lessonId: 36, type: "SELECT", order: 1, question: 'Which one of these is "Shoes"?' },
      { id: 157, lessonId: 36, type: "SELECT", order: 2, question: 'Which one of these is "Hat"?' },
      { id: 158, lessonId: 36, type: "SELECT", order: 3, question: 'Which one of these is "T-Shirt"?' },
      { id: 159, lessonId: 36, type: "ASSIST", order: 4, question: '"Red hat"' },
      { id: 160, lessonId: 36, type: "ASSIST", order: 5, question: '"Warm jacket"' },
      { id: 161, lessonId: 36, type: "ASSIST", order: 6, question: '"Where are my shoes?"' },

      // ==========================================
      // UNIT 10: WEATHER & FEELINGS (Lessons 37-40)
      // ==========================================
      { id: 162, lessonId: 37, type: "SELECT", order: 1, question: 'Which one of these is "Sunny"?' },
      { id: 163, lessonId: 37, type: "SELECT", order: 2, question: 'Which one of these is "Rain"?' },
      { id: 164, lessonId: 37, type: "SELECT", order: 3, question: 'Which one of these is "Wind"?' },
      { id: 165, lessonId: 37, type: "ASSIST", order: 4, question: '"Snow"' },

      { id: 166, lessonId: 38, type: "SELECT", order: 1, question: 'Which one of these is "Warm / Hot"?' },
      { id: 167, lessonId: 38, type: "SELECT", order: 2, question: 'Which one of these is "Cold"?' },
      { id: 168, lessonId: 38, type: "SELECT", order: 3, question: 'Which one of these is "Cloud"?' },
      { id: 169, lessonId: 38, type: "ASSIST", order: 4, question: '"Rainbow"' },

      { id: 170, lessonId: 39, type: "ASSIST", order: 1, question: '"Happy"' },
      { id: 171, lessonId: 39, type: "ASSIST", order: 2, question: '"Tired"' },
      { id: 172, lessonId: 39, type: "ASSIST", order: 3, question: '"Smiling / Cheerful"' },
      { id: 173, lessonId: 39, type: "ASSIST", order: 4, question: '"I am happy!"' },

      { id: 174, lessonId: 40, type: "SELECT", order: 1, question: 'Which one of these is "Sunny"?' },
      { id: 175, lessonId: 40, type: "SELECT", order: 2, question: 'Which one of these is "Rain"?' },
      { id: 176, lessonId: 40, type: "SELECT", order: 3, question: 'Which one of these is "Rainbow"?' },
      { id: 177, lessonId: 40, type: "ASSIST", order: 4, question: '"It is raining"' },
      { id: 178, lessonId: 40, type: "ASSIST", order: 5, question: '"The sun is shining"' },
      { id: 179, lessonId: 40, type: "ASSIST", order: 6, question: '"I am happy!"' },
      // ==========================================
      // UNIT 11: ACTIONS & VERBS (Lessons 41-44)
      // ==========================================
      { id: 180, lessonId: 41, type: "SELECT", order: 1, question: 'Which one of these is "I sleep"?' },
      { id: 181, lessonId: 41, type: "SELECT", order: 2, question: 'Which one of these is "I eat"?' },
      { id: 182, lessonId: 41, type: "SELECT", order: 3, question: 'Which one of these is "I drink"?' },
      { id: 183, lessonId: 41, type: "ASSIST", order: 4, question: '"I play / I am playing"' },

      { id: 184, lessonId: 42, type: "SELECT", order: 1, question: 'Which one of these is "I watch / look"?' },
      { id: 185, lessonId: 42, type: "SELECT", order: 2, question: 'Which one of these is "I read"?' },
      { id: 186, lessonId: 42, type: "SELECT", order: 3, question: 'Which one of these is "I sing"?' },
      { id: 187, lessonId: 42, type: "ASSIST", order: 4, question: '"I learn / I study"' },

      { id: 188, lessonId: 43, type: "ASSIST", order: 1, question: '"I drink water"' },
      { id: 189, lessonId: 43, type: "ASSIST", order: 2, question: '"I eat an apple"' },
      { id: 190, lessonId: 43, type: "ASSIST", order: 3, question: '"I read a book"' },
      { id: 191, lessonId: 43, type: "ASSIST", order: 4, question: '"I play with the dog"' },

      { id: 192, lessonId: 44, type: "SELECT", order: 1, question: 'Which one of these is "I sleep"?' },
      { id: 193, lessonId: 44, type: "SELECT", order: 2, question: 'Which one of these is "I eat"?' },
      { id: 194, lessonId: 44, type: "SELECT", order: 3, question: 'Which one of these is "I read"?' },
      { id: 195, lessonId: 44, type: "ASSIST", order: 4, question: '"I sing and dance!"' },
      { id: 196, lessonId: 44, type: "ASSIST", order: 5, question: '"I drink milk"' },
      { id: 197, lessonId: 44, type: "ASSIST", order: 6, question: '"I love learning!"' },

      // ==========================================
      // UNIT 12: TOWN & PARK (Lessons 45-48)
      // ==========================================
      { id: 198, lessonId: 45, type: "SELECT", order: 1, question: 'Which one of these is "Park"?' },
      { id: 199, lessonId: 45, type: "SELECT", order: 2, question: 'Which one of these is "Swing"?' },
      { id: 200, lessonId: 45, type: "SELECT", order: 3, question: 'Which one of these is "Slide"?' },
      { id: 201, lessonId: 45, type: "ASSIST", order: 4, question: '"Grass"' },

      { id: 202, lessonId: 46, type: "SELECT", order: 1, question: 'Which one of these is "Tree"?' },
      { id: 203, lessonId: 46, type: "SELECT", order: 2, question: 'Which one of these is "Car"?' },
      { id: 204, lessonId: 46, type: "SELECT", order: 3, question: 'Which one of these is "Bicycle"?' },
      { id: 205, lessonId: 46, type: "ASSIST", order: 4, question: '"Street"' },

      { id: 206, lessonId: 47, type: "ASSIST", order: 1, question: '"Let\'s go to the park!"' },
      { id: 207, lessonId: 47, type: "ASSIST", order: 2, question: '"I ride a bicycle"' },
      { id: 208, lessonId: 47, type: "ASSIST", order: 3, question: '"Fast car"' },
      { id: 209, lessonId: 47, type: "ASSIST", order: 4, question: '"Green tree"' },

      { id: 210, lessonId: 48, type: "SELECT", order: 1, question: 'Which one of these is "Slide"?' },
      { id: 211, lessonId: 48, type: "SELECT", order: 2, question: 'Which one of these is "Swing"?' },
      { id: 212, lessonId: 48, type: "SELECT", order: 3, question: 'Which one of these is "Bicycle"?' },
      { id: 213, lessonId: 48, type: "ASSIST", order: 4, question: '"Let\'s go to the park!"' },
      { id: 214, lessonId: 48, type: "ASSIST", order: 5, question: '"I swing high!"' },
      { id: 215, lessonId: 48, type: "ASSIST", order: 6, question: '"I ride a bicycle"' },

      // ==========================================
      // UNIT 13: SPACE & DIRECTIONS (Lessons 49-52)
      // ==========================================
      { id: 216, lessonId: 49, type: "SELECT", order: 1, question: 'Which one of these is "Here"?' },
      { id: 217, lessonId: 49, type: "SELECT", order: 2, question: 'Which one of these is "There"?' },
      { id: 218, lessonId: 49, type: "SELECT", order: 3, question: 'Which one of these is "Up / Above"?' },
      { id: 219, lessonId: 49, type: "ASSIST", order: 4, question: '"Down / Below"' },

      { id: 220, lessonId: 50, type: "SELECT", order: 1, question: 'Which one of these is "In / Inside"?' },
      { id: 221, lessonId: 50, type: "SELECT", order: 2, question: 'Which one of these is "On / Atop"?' },
      { id: 222, lessonId: 50, type: "SELECT", order: 3, question: 'Which one of these is "Under"?' },
      { id: 223, lessonId: 50, type: "ASSIST", order: 4, question: '"Near / Close"' },

      { id: 224, lessonId: 51, type: "ASSIST", order: 1, question: '"Where is the dog? Under the table!"' },
      { id: 225, lessonId: 51, type: "ASSIST", order: 2, question: '"The book is on the table"' },
      { id: 226, lessonId: 51, type: "ASSIST", order: 3, question: '"The cat is in the room"' },
      { id: 227, lessonId: 51, type: "ASSIST", order: 4, question: '"Look up!"' },

      { id: 228, lessonId: 52, type: "SELECT", order: 1, question: 'Which one of these is "Under"?' },
      { id: 229, lessonId: 52, type: "SELECT", order: 2, question: 'Which one of these is "Up"?' },
      { id: 230, lessonId: 52, type: "SELECT", order: 3, question: 'Which one of these is "Here"?' },
      { id: 231, lessonId: 52, type: "ASSIST", order: 4, question: '"Under the bed"' },
      { id: 232, lessonId: 52, type: "ASSIST", order: 5, question: '"On the table"' },
      { id: 233, lessonId: 52, type: "ASSIST", order: 6, question: '"I am here!"' },

      // ==========================================
      // UNIT 14: BAKERY & MARKET (Lessons 53-56)
      // ==========================================
      { id: 234, lessonId: 53, type: "SELECT", order: 1, question: 'Which one of these is "Bakery"?' },
      { id: 235, lessonId: 53, type: "SELECT", order: 2, question: 'Which one of these is "Roll / Croissant"?' },
      { id: 236, lessonId: 53, type: "SELECT", order: 3, question: 'Which one of these is "Bread"?' },
      { id: 237, lessonId: 53, type: "ASSIST", order: 4, question: '"Burek (Pastry)"' },

      { id: 238, lessonId: 54, type: "SELECT", order: 1, question: 'Which one of these is "Cheese"?' },
      { id: 239, lessonId: 54, type: "SELECT", order: 2, question: 'Which one of these is "Tomato"?' },
      { id: 240, lessonId: 54, type: "SELECT", order: 3, question: 'Which one of these is "Orange"?' },
      { id: 241, lessonId: 54, type: "ASSIST", order: 4, question: '"Shop / Store"' },

      { id: 242, lessonId: 55, type: "ASSIST", order: 1, question: '"One roll, please!"' },
      { id: 243, lessonId: 55, type: "ASSIST", order: 2, question: '"Here you go!"' },
      { id: 244, lessonId: 55, type: "ASSIST", order: 3, question: '"Fresh cheese"' },
      { id: 245, lessonId: 55, type: "ASSIST", order: 4, question: '"Sweet orange"' },

      { id: 246, lessonId: 56, type: "SELECT", order: 1, question: 'Which one of these is "Bakery"?' },
      { id: 247, lessonId: 56, type: "SELECT", order: 2, question: 'Which one of these is "Roll / Croissant"?' },
      { id: 248, lessonId: 56, type: "SELECT", order: 3, question: 'Which one of these is "Cheese"?' },
      { id: 249, lessonId: 56, type: "ASSIST", order: 4, question: '"One roll, please!"' },
      { id: 250, lessonId: 56, type: "ASSIST", order: 5, question: '"Thank you and goodbye!"' },
      { id: 251, lessonId: 56, type: "ASSIST", order: 6, question: '"Here you go!"' },

      // ==========================================
      // UNIT 15: SPORTS & GAMES (Lessons 57-60)
      // ==========================================
      { id: 252, lessonId: 57, type: "SELECT", order: 1, question: 'Which one of these is "Ball"?' },
      { id: 253, lessonId: 57, type: "SELECT", order: 2, question: 'Which one of these is "Soccer / Football"?' },
      { id: 254, lessonId: 57, type: "SELECT", order: 3, question: 'Which one of these is "Goal!"?' },
      { id: 255, lessonId: 57, type: "ASSIST", order: 4, question: '"Game / Play"' },

      { id: 256, lessonId: 58, type: "SELECT", order: 1, question: 'Which one of these is "Music"?' },
      { id: 257, lessonId: 58, type: "SELECT", order: 2, question: 'Which one of these is "Song"?' },
      { id: 258, lessonId: 58, type: "SELECT", order: 3, question: 'Which one of these is "Drawing / Painting"?' },
      { id: 259, lessonId: 58, type: "ASSIST", order: 4, question: '"Victory / Win!"' },

      { id: 260, lessonId: 59, type: "ASSIST", order: 1, question: '"Score a goal!"' },
      { id: 261, lessonId: 59, type: "ASSIST", order: 2, question: '"Pass the ball!"' },
      { id: 262, lessonId: 59, type: "ASSIST", order: 3, question: '"Beautiful song"' },
      { id: 263, lessonId: 59, type: "ASSIST", order: 4, question: '"Well done / Bravo!"' },

      { id: 264, lessonId: 60, type: "SELECT", order: 1, question: 'Which one of these is "Ball"?' },
      { id: 265, lessonId: 60, type: "SELECT", order: 2, question: 'Which one of these is "Soccer"?' },
      { id: 266, lessonId: 60, type: "SELECT", order: 3, question: 'Which one of these is "Victory!"?' },
      { id: 267, lessonId: 60, type: "ASSIST", order: 4, question: '"Score a goal!"' },
      { id: 268, lessonId: 60, type: "ASSIST", order: 5, question: '"Pass the ball!"' },
      { id: 269, lessonId: 60, type: "ASSIST", order: 6, question: '"We are the champions!"' },




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
      // --- BOSS QUEST 1 (Unit 1) OPTIONS ---
      { challengeId: 60, correct: true, text: "Bok", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/bok.mp3" },
      { challengeId: 60, correct: false, text: "Doviđenja", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/dovidenja.mp3" },
      { challengeId: 60, correct: false, text: "Molim", imageSrc: "/points.svg", audioSrc: "/audio/hr/molim.mp3" },

      { challengeId: 61, correct: true, text: "Dobar dan", audioSrc: "/audio/hr/dobar_dan.mp3" },
      { challengeId: 61, correct: false, text: "Laku noć", audioSrc: "/audio/hr/laku_noc.mp3" },
      { challengeId: 61, correct: false, text: "Hvala", audioSrc: "/audio/hr/hvala.mp3" },

      { challengeId: 62, correct: true, text: "Hvala", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/hvala.mp3" },
      { challengeId: 62, correct: false, text: "Oprosti", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/oprosti.mp3" },
      { challengeId: 62, correct: false, text: "Ne", imageSrc: "/points.svg", audioSrc: "/audio/hr/ne.mp3" },

      { challengeId: 63, correct: true, text: "Laku noć", audioSrc: "/audio/hr/laku_noc.mp3" },
      { challengeId: 63, correct: false, text: "Dobar dan", audioSrc: "/audio/hr/dobar_dan.mp3" },
      { challengeId: 63, correct: false, text: "Bok", audioSrc: "/audio/hr/bok.mp3" },

      { challengeId: 64, correct: true, text: "Kako si?", audioSrc: "/audio/hr/kako_si.mp3" },
      { challengeId: 64, correct: false, text: "Dobro sam!", audioSrc: "/audio/hr/dobro_sam.mp3" },
      { challengeId: 64, correct: false, text: "Molim", audioSrc: "/audio/hr/molim.mp3" },

      { challengeId: 65, correct: true, text: "Doviđenja", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/dovidenja.mp3" },
      { challengeId: 65, correct: false, text: "Bok", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/bok.mp3" },
      { challengeId: 65, correct: false, text: "Da", imageSrc: "/points.svg", audioSrc: "/audio/hr/da.mp3" },

      // --- BOSS QUEST 2 (Unit 2) OPTIONS ---
      { challengeId: 66, correct: true, text: "Mama", imageSrc: "/woman.svg", audioSrc: "/audio/hr/mama.mp3" },
      { challengeId: 66, correct: false, text: "Tata", imageSrc: "/man.svg", audioSrc: "/audio/hr/tata.mp3" },
      { challengeId: 66, correct: false, text: "Baka", imageSrc: "/woman.svg", audioSrc: "/audio/hr/baka.mp3" },

      { challengeId: 67, correct: true, text: "Tata", imageSrc: "/man.svg", audioSrc: "/audio/hr/tata.mp3" },
      { challengeId: 67, correct: false, text: "Djed", imageSrc: "/man.svg", audioSrc: "/audio/hr/djed.mp3" },
      { challengeId: 67, correct: false, text: "Brat", imageSrc: "/boy.svg", audioSrc: "/audio/hr/brat.mp3" },

      { challengeId: 68, correct: true, text: "Dječak", imageSrc: "/boy.svg", audioSrc: "/audio/hr/djecak.mp3" },
      { challengeId: 68, correct: false, text: "Djevojčica", imageSrc: "/girl.svg", audioSrc: "/audio/hr/djevojcica.mp3" },
      { challengeId: 68, correct: false, text: "Beba", imageSrc: "/boy.svg", audioSrc: "/audio/hr/beba.mp3" },

      { challengeId: 69, correct: true, text: "Djevojčica", imageSrc: "/girl.svg", audioSrc: "/audio/hr/djevojcica.mp3" },
      { challengeId: 69, correct: false, text: "Dječak", imageSrc: "/boy.svg", audioSrc: "/audio/hr/djecak.mp3" },
      { challengeId: 69, correct: false, text: "Sestra", imageSrc: "/girl.svg", audioSrc: "/audio/hr/sestra.mp3" },

      { challengeId: 70, correct: true, text: "To je mama", imageSrc: "/woman.svg", audioSrc: "/audio/hr/to_je_mama.mp3" },
      { challengeId: 70, correct: false, text: "To je tata", imageSrc: "/man.svg", audioSrc: "/audio/hr/tata.mp3" },
      { challengeId: 70, correct: false, text: "Volim te", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/volim_te.mp3" },

      { challengeId: 71, correct: true, text: "Volim te", audioSrc: "/audio/hr/volim_te.mp3" },
      { challengeId: 71, correct: false, text: "Hvala lijepa", audioSrc: "/audio/hr/hvala_lijepa.mp3" },
      { challengeId: 71, correct: false, text: "Dobar dan", audioSrc: "/audio/hr/dobar_dan.mp3" },

      // --- BOSS QUEST 3 (Unit 3) OPTIONS ---
      { challengeId: 72, correct: true, text: "Pas", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/pas.mp3" },
      { challengeId: 72, correct: false, text: "Mačka", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/macka.mp3" },
      { challengeId: 72, correct: false, text: "Krava", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/krava.mp3" },

      { challengeId: 73, correct: true, text: "Mačka", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/macka.mp3" },
      { challengeId: 73, correct: false, text: "Pas", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/pas.mp3" },
      { challengeId: 73, correct: false, text: "Riba", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/riba.mp3" },

      { challengeId: 74, correct: true, text: "Konj", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/konj.mp3" },
      { challengeId: 74, correct: false, text: "Patka", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/patka.mp3" },
      { challengeId: 74, correct: false, text: "Ptica", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/ptica.mp3" },

      { challengeId: 75, correct: true, text: "Veliki pas", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/veliki_pas.mp3" },
      { challengeId: 75, correct: false, text: "Mala mačka", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/mala_macka.mp3" },
      { challengeId: 75, correct: false, text: "Dobar pas", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/dobar_pas.mp3" },

      { challengeId: 76, correct: true, text: "Mala mačka", audioSrc: "/audio/hr/mala_macka.mp3" },
      { challengeId: 76, correct: false, text: "Veliki pas", audioSrc: "/audio/hr/veliki_pas.mp3" },
      { challengeId: 76, correct: false, text: "Dobar pas", audioSrc: "/audio/hr/dobar_pas.mp3" },

      { challengeId: 77, correct: true, text: "Dobar pas", audioSrc: "/audio/hr/dobar_pas.mp3" },
      { challengeId: 77, correct: false, text: "Veliki pas", audioSrc: "/audio/hr/veliki_pas.mp3" },
      { challengeId: 77, correct: false, text: "Mala mačka", audioSrc: "/audio/hr/mala_macka.mp3" },

      // --- BOSS QUEST 4 (Unit 4) OPTIONS ---
      { challengeId: 78, correct: true, text: "Crvena", imageSrc: "/heart.svg", audioSrc: "/audio/hr/crvena.mp3" },
      { challengeId: 78, correct: false, text: "Plava", imageSrc: "/learn.svg", audioSrc: "/audio/hr/plava.mp3" },
      { challengeId: 78, correct: false, text: "Žuta", imageSrc: "/points.svg", audioSrc: "/audio/hr/zuta.mp3" },

      { challengeId: 79, correct: true, text: "Zelena", imageSrc: "/learn.svg", audioSrc: "/audio/hr/zelena.mp3" },
      { challengeId: 79, correct: false, text: "Crvena", imageSrc: "/heart.svg", audioSrc: "/audio/hr/crvena.mp3" },
      { challengeId: 79, correct: false, text: "Plava", imageSrc: "/points.svg", audioSrc: "/audio/hr/plava.mp3" },

      { challengeId: 80, correct: true, text: "Četiri", imageSrc: "/points.svg", audioSrc: "/audio/hr/cetiri.mp3" },
      { challengeId: 80, correct: false, text: "Pet", imageSrc: "/points.svg", audioSrc: "/audio/hr/pet.mp3" },
      { challengeId: 80, correct: false, text: "Šest", imageSrc: "/points.svg", audioSrc: "/audio/hr/sest.mp3" },

      { challengeId: 81, correct: true, text: "Plava", audioSrc: "/audio/hr/plava.mp3" },
      { challengeId: 81, correct: false, text: "Žuta", audioSrc: "/audio/hr/zuta.mp3" },
      { challengeId: 81, correct: false, text: "Zelena", audioSrc: "/audio/hr/zelena.mp3" },

      { challengeId: 82, correct: true, text: "Jedan", audioSrc: "/audio/hr/jedan.mp3" },
      { challengeId: 82, correct: false, text: "Dva", audioSrc: "/audio/hr/dva.mp3" },
      { challengeId: 82, correct: false, text: "Tri", audioSrc: "/audio/hr/tri.mp3" },

      { challengeId: 83, correct: true, text: "Deset", imageSrc: "/points.svg", audioSrc: "/audio/hr/deset.mp3" },
      { challengeId: 83, correct: false, text: "Devet", imageSrc: "/points.svg", audioSrc: "/audio/hr/devet.mp3" },
      { challengeId: 83, correct: false, text: "Sedam", imageSrc: "/points.svg", audioSrc: "/audio/hr/sedam.mp3" },

      // --- BOSS QUEST 5 (Unit 5) OPTIONS ---
      { challengeId: 84, correct: true, text: "Jabuka", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/jabuka.mp3" },
      { challengeId: 84, correct: false, text: "Banana", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/banana.mp3" },
      { challengeId: 84, correct: false, text: "Kruh", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/kruh.mp3" },

      { challengeId: 85, correct: true, text: "Sladoled", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/sladoled.mp3" },
      { challengeId: 85, correct: false, text: "Čokolada", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/cokolada.mp3" },
      { challengeId: 85, correct: false, text: "Voda", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/voda.mp3" },

      { challengeId: 86, correct: true, text: "Voda", audioSrc: "/audio/hr/voda.mp3" },
      { challengeId: 86, correct: false, text: "Mlijeko", audioSrc: "/audio/hr/mlijeko.mp3" },
      { challengeId: 86, correct: false, text: "Sok", audioSrc: "/audio/hr/sok.mp3" },

      { challengeId: 87, correct: true, text: "Gladan sam", audioSrc: "/audio/hr/gladan_sam.mp3" },
      { challengeId: 87, correct: false, text: "Hvala lijepa", audioSrc: "/audio/hr/hvala_lijepa.mp3" },
      { challengeId: 87, correct: false, text: "Jako je ukusno!", audioSrc: "/audio/hr/jako_je_ukusno.mp3" },

      { challengeId: 88, correct: true, text: "Mogu li dobiti sladoled, molim?", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/mogu_li_dobiti_sladoled_molim.mp3" },
      { challengeId: 88, correct: false, text: "Dobar dan, kako si?", imageSrc: "/woman.svg", audioSrc: "/audio/hr/kako_si.mp3" },
      { challengeId: 88, correct: false, text: "Laku noć", imageSrc: "/man.svg", audioSrc: "/audio/hr/laku_noc.mp3" },

      { challengeId: 89, correct: true, text: "Jako je ukusno!", audioSrc: "/audio/hr/jako_je_ukusno.mp3" },
      { challengeId: 89, correct: false, text: "Ne hvala", audioSrc: "/audio/hr/ne_hvala.mp3" },
      { challengeId: 89, correct: false, text: "Oprosti", audioSrc: "/audio/hr/oprosti.mp3" },
      // --- UNIT 6 LESSON 21 OPTIONS ---
      { challengeId: 90, correct: true, text: "Kuća", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/kuca.mp3" },
      { challengeId: 90, correct: false, text: "Soba", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/soba.mp3" },
      { challengeId: 90, correct: false, text: "Krevet", imageSrc: "/points.svg", audioSrc: "/audio/hr/krevet.mp3" },

      { challengeId: 91, correct: true, text: "Soba", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/soba.mp3" },
      { challengeId: 91, correct: false, text: "Kuća", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/kuca.mp3" },
      { challengeId: 91, correct: false, text: "Stol", imageSrc: "/points.svg", audioSrc: "/audio/hr/stol.mp3" },

      { challengeId: 92, correct: true, text: "Krevet", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/krevet.mp3" },
      { challengeId: 92, correct: false, text: "Vrata", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/vrata.mp3" },
      { challengeId: 92, correct: false, text: "Prozor", imageSrc: "/points.svg", audioSrc: "/audio/hr/prozor.mp3" },

      { challengeId: 93, correct: true, text: "Stol", audioSrc: "/audio/hr/stol.mp3" },
      { challengeId: 93, correct: false, text: "Krevet", audioSrc: "/audio/hr/krevet.mp3" },
      { challengeId: 93, correct: false, text: "Soba", audioSrc: "/audio/hr/soba.mp3" },

      // --- UNIT 6 LESSON 22 OPTIONS ---
      { challengeId: 94, correct: true, text: "Vrata", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/vrata.mp3" },
      { challengeId: 94, correct: false, text: "Prozor", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/prozor.mp3" },
      { challengeId: 94, correct: false, text: "Stol", imageSrc: "/points.svg", audioSrc: "/audio/hr/stol.mp3" },

      { challengeId: 95, correct: true, text: "Prozor", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/prozor.mp3" },
      { challengeId: 95, correct: false, text: "Vrata", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/vrata.mp3" },
      { challengeId: 95, correct: false, text: "Kuća", imageSrc: "/points.svg", audioSrc: "/audio/hr/kuca.mp3" },

      { challengeId: 96, correct: true, text: "Igračka", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/igracka.mp3" },
      { challengeId: 96, correct: false, text: "Knjiga", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/knjiga.mp3" },
      { challengeId: 96, correct: false, text: "Krevet", imageSrc: "/points.svg", audioSrc: "/audio/hr/krevet.mp3" },

      { challengeId: 97, correct: true, text: "Knjiga", audioSrc: "/audio/hr/knjiga.mp3" },
      { challengeId: 97, correct: false, text: "Igračka", audioSrc: "/audio/hr/igracka.mp3" },
      { challengeId: 97, correct: false, text: "Prozor", audioSrc: "/audio/hr/prozor.mp3" },

      // --- UNIT 6 LESSON 23 OPTIONS ---
      { challengeId: 98, correct: true, text: "Moja soba", audioSrc: "/audio/hr/moja_soba.mp3" },
      { challengeId: 98, correct: false, text: "Moj krevet", audioSrc: "/audio/hr/moj_krevet.mp3" },
      { challengeId: 98, correct: false, text: "Velika kuća", audioSrc: "/audio/hr/velika_kuca.mp3" },

      { challengeId: 99, correct: true, text: "Velika kuća", audioSrc: "/audio/hr/velika_kuca.mp3" },
      { challengeId: 99, correct: false, text: "Moja soba", audioSrc: "/audio/hr/moja_soba.mp3" },
      { challengeId: 99, correct: false, text: "Veliki pas", audioSrc: "/audio/hr/veliki_pas.mp3" },

      { challengeId: 100, correct: true, text: "Moj krevet", audioSrc: "/audio/hr/moj_krevet.mp3" },
      { challengeId: 100, correct: false, text: "Moja soba", audioSrc: "/audio/hr/moja_soba.mp3" },
      { challengeId: 100, correct: false, text: "Mala mačka", audioSrc: "/audio/hr/mala_macka.mp3" },

      { challengeId: 101, correct: true, text: "To je moja knjiga", audioSrc: "/audio/hr/to_je_moja_knjiga.mp3" },
      { challengeId: 101, correct: false, text: "To je mama", audioSrc: "/audio/hr/to_je_mama.mp3" },
      { challengeId: 101, correct: false, text: "Gdje je igračka?", audioSrc: "/audio/hr/gdje_je_igracka.mp3" },

      // --- UNIT 6 LESSON 24 (BOSS QUEST) OPTIONS ---
      { challengeId: 102, correct: true, text: "Kuća", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/kuca.mp3" },
      { challengeId: 102, correct: false, text: "Soba", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/soba.mp3" },
      { challengeId: 102, correct: false, text: "Vrata", imageSrc: "/points.svg", audioSrc: "/audio/hr/vrata.mp3" },

      { challengeId: 103, correct: true, text: "Krevet", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/krevet.mp3" },
      { challengeId: 103, correct: false, text: "Stol", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/stol.mp3" },
      { challengeId: 103, correct: false, text: "Prozor", imageSrc: "/points.svg", audioSrc: "/audio/hr/prozor.mp3" },

      { challengeId: 104, correct: true, text: "Igračka", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/igracka.mp3" },
      { challengeId: 104, correct: false, text: "Knjiga", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/knjiga.mp3" },
      { challengeId: 104, correct: false, text: "Kuća", imageSrc: "/points.svg", audioSrc: "/audio/hr/kuca.mp3" },

      { challengeId: 105, correct: true, text: "Otvori prozor", audioSrc: "/audio/hr/otvori_prozor.mp3" },
      { challengeId: 105, correct: false, text: "Vrata", audioSrc: "/audio/hr/vrata.mp3" },
      { challengeId: 105, correct: false, text: "Moja soba", audioSrc: "/audio/hr/moja_soba.mp3" },

      { challengeId: 106, correct: true, text: "Gdje je igračka?", audioSrc: "/audio/hr/gdje_je_igracka.mp3" },
      { challengeId: 106, correct: false, text: "To je moja knjiga", audioSrc: "/audio/hr/to_je_moja_knjiga.mp3" },
      { challengeId: 106, correct: false, text: "Kako si?", audioSrc: "/audio/hr/kako_si.mp3" },

      { challengeId: 107, correct: true, text: "To je moja knjiga", audioSrc: "/audio/hr/to_je_moja_knjiga.mp3" },
      { challengeId: 107, correct: false, text: "Gdje je igračka?", audioSrc: "/audio/hr/gdje_je_igracka.mp3" },
      { challengeId: 107, correct: false, text: "Velika kuća", audioSrc: "/audio/hr/velika_kuca.mp3" },
      // --- UNIT 7 OPTIONS ---
      { challengeId: 108, correct: true, text: "Glava", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/glava.mp3" },
      { challengeId: 108, correct: false, text: "Ruka", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/ruka.mp3" },
      { challengeId: 108, correct: false, text: "Noga", imageSrc: "/points.svg", audioSrc: "/audio/hr/noga.mp3" },

      { challengeId: 109, correct: true, text: "Ruka", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/ruka.mp3" },
      { challengeId: 109, correct: false, text: "Noga", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/noga.mp3" },
      { challengeId: 109, correct: false, text: "Glava", imageSrc: "/points.svg", audioSrc: "/audio/hr/glava.mp3" },

      { challengeId: 110, correct: true, text: "Noga", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/noga.mp3" },
      { challengeId: 110, correct: false, text: "Ruka", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/ruka.mp3" },
      { challengeId: 110, correct: false, text: "Oko", imageSrc: "/points.svg", audioSrc: "/audio/hr/oko.mp3" },

      { challengeId: 111, correct: true, text: "Oko", audioSrc: "/audio/hr/oko.mp3" },
      { challengeId: 111, correct: false, text: "Uho", audioSrc: "/audio/hr/uho.mp3" },
      { challengeId: 111, correct: false, text: "Nos", audioSrc: "/audio/hr/nos.mp3" },

      { challengeId: 112, correct: true, text: "Uho", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/uho.mp3" },
      { challengeId: 112, correct: false, text: "Nos", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/nos.mp3" },
      { challengeId: 112, correct: false, text: "Usta", imageSrc: "/points.svg", audioSrc: "/audio/hr/usta.mp3" },

      { challengeId: 113, correct: true, text: "Nos", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/nos.mp3" },
      { challengeId: 113, correct: false, text: "Uho", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/uho.mp3" },
      { challengeId: 113, correct: false, text: "Oko", imageSrc: "/points.svg", audioSrc: "/audio/hr/oko.mp3" },

      { challengeId: 114, correct: true, text: "Usta", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/usta.mp3" },
      { challengeId: 114, correct: false, text: "Nos", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/nos.mp3" },
      { challengeId: 114, correct: false, text: "Kosa", imageSrc: "/points.svg", audioSrc: "/audio/hr/kosa.mp3" },

      { challengeId: 115, correct: true, text: "Kosa", audioSrc: "/audio/hr/kosa.mp3" },
      { challengeId: 115, correct: false, text: "Glava", audioSrc: "/audio/hr/glava.mp3" },
      { challengeId: 115, correct: false, text: "Usta", audioSrc: "/audio/hr/usta.mp3" },

      { challengeId: 116, correct: true, text: "Skoči!", audioSrc: "/audio/hr/skoci.mp3" },
      { challengeId: 116, correct: false, text: "Trči!", audioSrc: "/audio/hr/trci.mp3" },
      { challengeId: 116, correct: false, text: "Bok", audioSrc: "/audio/hr/bok.mp3" },

      { challengeId: 117, correct: true, text: "Trči!", audioSrc: "/audio/hr/trci.mp3" },
      { challengeId: 117, correct: false, text: "Skoči!", audioSrc: "/audio/hr/skoci.mp3" },
      { challengeId: 117, correct: false, text: "Molim", audioSrc: "/audio/hr/molim.mp3" },

      { challengeId: 118, correct: true, text: "Ruke gore!", audioSrc: "/audio/hr/ruke_gore.mp3" },
      { challengeId: 118, correct: false, text: "Plješći rukama!", audioSrc: "/audio/hr/pljesci_rukama.mp3" },
      { challengeId: 118, correct: false, text: "Skoči!", audioSrc: "/audio/hr/skoci.mp3" },

      { challengeId: 119, correct: true, text: "Plješći rukama!", audioSrc: "/audio/hr/pljesci_rukama.mp3" },
      { challengeId: 119, correct: false, text: "Ruke gore!", audioSrc: "/audio/hr/ruke_gore.mp3" },
      { challengeId: 119, correct: false, text: "Trči!", audioSrc: "/audio/hr/trci.mp3" },

      { challengeId: 120, correct: true, text: "Glava", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/glava.mp3" },
      { challengeId: 120, correct: false, text: "Ruka", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/ruka.mp3" },
      { challengeId: 120, correct: false, text: "Noga", imageSrc: "/points.svg", audioSrc: "/audio/hr/noga.mp3" },

      { challengeId: 121, correct: true, text: "Ruka", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/ruka.mp3" },
      { challengeId: 121, correct: false, text: "Noga", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/noga.mp3" },
      { challengeId: 121, correct: false, text: "Nos", imageSrc: "/points.svg", audioSrc: "/audio/hr/nos.mp3" },

      { challengeId: 122, correct: true, text: "Nos", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/nos.mp3" },
      { challengeId: 122, correct: false, text: "Uho", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/uho.mp3" },
      { challengeId: 122, correct: false, text: "Usta", imageSrc: "/points.svg", audioSrc: "/audio/hr/usta.mp3" },

      { challengeId: 123, correct: true, text: "Digni ruku!", audioSrc: "/audio/hr/digni_ruku.mp3" },
      { challengeId: 123, correct: false, text: "Ruke gore!", audioSrc: "/audio/hr/ruke_gore.mp3" },
      { challengeId: 123, correct: false, text: "Skoči!", audioSrc: "/audio/hr/skoci.mp3" },

      { challengeId: 124, correct: true, text: "Brzo trči!", audioSrc: "/audio/hr/brzo_trci.mp3" },
      { challengeId: 124, correct: false, text: "Skoči!", audioSrc: "/audio/hr/skoci.mp3" },
      { challengeId: 124, correct: false, text: "Dobar dan", audioSrc: "/audio/hr/dobar_dan.mp3" },

      { challengeId: 125, correct: true, text: "Ruke gore!", audioSrc: "/audio/hr/ruke_gore.mp3" },
      { challengeId: 125, correct: false, text: "Plješći rukama!", audioSrc: "/audio/hr/pljesci_rukama.mp3" },
      { challengeId: 125, correct: false, text: "Trči!", audioSrc: "/audio/hr/trci.mp3" },

      // --- UNIT 8 OPTIONS ---
      { challengeId: 126, correct: true, text: "More", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/more.mp3" },
      { challengeId: 126, correct: false, text: "Plaža", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/plaza.mp3" },
      { challengeId: 126, correct: false, text: "Sunce", imageSrc: "/points.svg", audioSrc: "/audio/hr/sunce.mp3" },

      { challengeId: 127, correct: true, text: "Plaža", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/plaza.mp3" },
      { challengeId: 127, correct: false, text: "More", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/more.mp3" },
      { challengeId: 127, correct: false, text: "Otok", imageSrc: "/points.svg", audioSrc: "/audio/hr/otok.mp3" },

      { challengeId: 128, correct: true, text: "Sunce", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/sunce.mp3" },
      { challengeId: 128, correct: false, text: "Pijesak", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/pijesak.mp3" },
      { challengeId: 128, correct: false, text: "More", imageSrc: "/points.svg", audioSrc: "/audio/hr/more.mp3" },

      { challengeId: 129, correct: true, text: "Pijesak", audioSrc: "/audio/hr/pijesak.mp3" },
      { challengeId: 129, correct: false, text: "Sunce", audioSrc: "/audio/hr/sunce.mp3" },
      { challengeId: 129, correct: false, text: "More", audioSrc: "/audio/hr/more.mp3" },

      { challengeId: 130, correct: true, text: "Otok", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/otok.mp3" },
      { challengeId: 130, correct: false, text: "Brod", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/brod.mp3" },
      { challengeId: 130, correct: false, text: "Plaža", imageSrc: "/points.svg", audioSrc: "/audio/hr/plaza.mp3" },

      { challengeId: 131, correct: true, text: "Brod", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/brod.mp3" },
      { challengeId: 131, correct: false, text: "Otok", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/otok.mp3" },
      { challengeId: 131, correct: false, text: "Dupin", imageSrc: "/points.svg", audioSrc: "/audio/hr/dupin.mp3" },

      { challengeId: 132, correct: true, text: "Kupanje", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/kupanje.mp3" },
      { challengeId: 132, correct: false, text: "Plivanje", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/plivanje.mp3" },
      { challengeId: 132, correct: false, text: "Pijesak", imageSrc: "/points.svg", audioSrc: "/audio/hr/pijesak.mp3" },

      { challengeId: 133, correct: true, text: "Plivanje", audioSrc: "/audio/hr/plivanje.mp3" },
      { challengeId: 133, correct: false, text: "Kupanje", audioSrc: "/audio/hr/kupanje.mp3" },
      { challengeId: 133, correct: false, text: "Brod", audioSrc: "/audio/hr/brod.mp3" },

      { challengeId: 134, correct: true, text: "Školjka", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/skoljka.mp3" },
      { challengeId: 134, correct: false, text: "Riba", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/riba.mp3" },
      { challengeId: 134, correct: false, text: "Dupin", imageSrc: "/points.svg", audioSrc: "/audio/hr/dupin.mp3" },

      { challengeId: 135, correct: true, text: "Dupin", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/dupin.mp3" },
      { challengeId: 135, correct: false, text: "Školjka", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/skoljka.mp3" },
      { challengeId: 135, correct: false, text: "Galeb", imageSrc: "/points.svg", audioSrc: "/audio/hr/galeb.mp3" },

      { challengeId: 136, correct: true, text: "Galeb", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/galeb.mp3" },
      { challengeId: 136, correct: false, text: "Dupin", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/dupin.mp3" },
      { challengeId: 136, correct: false, text: "Riba", imageSrc: "/points.svg", audioSrc: "/audio/hr/riba.mp3" },

      { challengeId: 137, correct: true, text: "Mali brod", audioSrc: "/audio/hr/mali_brod.mp3" },
      { challengeId: 137, correct: false, text: "Veliki pas", audioSrc: "/audio/hr/veliki_pas.mp3" },
      { challengeId: 137, correct: false, text: "Toplo more", audioSrc: "/audio/hr/toplo_more.mp3" },

      { challengeId: 138, correct: true, text: "More", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/more.mp3" },
      { challengeId: 138, correct: false, text: "Plaža", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/plaza.mp3" },
      { challengeId: 138, correct: false, text: "Brod", imageSrc: "/points.svg", audioSrc: "/audio/hr/brod.mp3" },

      { challengeId: 139, correct: true, text: "Dupin", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/dupin.mp3" },
      { challengeId: 139, correct: false, text: "Galeb", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/galeb.mp3" },
      { challengeId: 139, correct: false, text: "Školjka", imageSrc: "/points.svg", audioSrc: "/audio/hr/skoljka.mp3" },

      { challengeId: 140, correct: true, text: "Otok", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/otok.mp3" },
      { challengeId: 140, correct: false, text: "Brod", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/brod.mp3" },
      { challengeId: 140, correct: false, text: "More", imageSrc: "/points.svg", audioSrc: "/audio/hr/more.mp3" },

      { challengeId: 141, correct: true, text: "Toplo more", audioSrc: "/audio/hr/toplo_more.mp3" },
      { challengeId: 141, correct: false, text: "Mali brod", audioSrc: "/audio/hr/mali_brod.mp3" },
      { challengeId: 141, correct: false, text: "Idemo na plažu!", audioSrc: "/audio/hr/idemo_na_plazu.mp3" },

      { challengeId: 142, correct: true, text: "Idemo na plažu!", audioSrc: "/audio/hr/idemo_na_plazu.mp3" },
      { challengeId: 142, correct: false, text: "Volim more!", audioSrc: "/audio/hr/volim_more.mp3" },
      { challengeId: 142, correct: false, text: "Mali brod", audioSrc: "/audio/hr/mali_brod.mp3" },

      { challengeId: 143, correct: true, text: "Volim more!", audioSrc: "/audio/hr/volim_more.mp3" },
      { challengeId: 143, correct: false, text: "Idemo na plažu!", audioSrc: "/audio/hr/idemo_na_plazu.mp3" },
      { challengeId: 143, correct: false, text: "Toplo more", audioSrc: "/audio/hr/toplo_more.mp3" },

      // --- UNIT 9 OPTIONS ---
      { challengeId: 144, correct: true, text: "Majica", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/majica.mp3" },
      { challengeId: 144, correct: false, text: "Hlače", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/hlace.mp3" },
      { challengeId: 144, correct: false, text: "Cipele", imageSrc: "/points.svg", audioSrc: "/audio/hr/cipele.mp3" },

      { challengeId: 145, correct: true, text: "Hlače", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/hlace.mp3" },
      { challengeId: 145, correct: false, text: "Majica", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/majica.mp3" },
      { challengeId: 145, correct: false, text: "Čarape", imageSrc: "/points.svg", audioSrc: "/audio/hr/carape.mp3" },

      { challengeId: 146, correct: true, text: "Cipele", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/cipele.mp3" },
      { challengeId: 146, correct: false, text: "Čarape", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/carape.mp3" },
      { challengeId: 146, correct: false, text: "Kapa", imageSrc: "/points.svg", audioSrc: "/audio/hr/kapa.mp3" },

      { challengeId: 147, correct: true, text: "Čarape", audioSrc: "/audio/hr/carape.mp3" },
      { challengeId: 147, correct: false, text: "Cipele", audioSrc: "/audio/hr/cipele.mp3" },
      { challengeId: 147, correct: false, text: "Hlače", audioSrc: "/audio/hr/hlace.mp3" },

      { challengeId: 148, correct: true, text: "Kapa", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/kapa.mp3" },
      { challengeId: 148, correct: false, text: "Jakna", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/jakna.mp3" },
      { challengeId: 148, correct: false, text: "Šal", imageSrc: "/points.svg", audioSrc: "/audio/hr/sal.mp3" },

      { challengeId: 149, correct: true, text: "Jakna", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/jakna.mp3" },
      { challengeId: 149, correct: false, text: "Kapa", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/kapa.mp3" },
      { challengeId: 149, correct: false, text: "Haljina", imageSrc: "/points.svg", audioSrc: "/audio/hr/haljina.mp3" },

      { challengeId: 150, correct: true, text: "Haljina", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/haljina.mp3" },
      { challengeId: 150, correct: false, text: "Majica", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/majica.mp3" },
      { challengeId: 150, correct: false, text: "Jakna", imageSrc: "/points.svg", audioSrc: "/audio/hr/jakna.mp3" },

      { challengeId: 151, correct: true, text: "Šal", audioSrc: "/audio/hr/sal.mp3" },
      { challengeId: 151, correct: false, text: "Kapa", audioSrc: "/audio/hr/kapa.mp3" },
      { challengeId: 151, correct: false, text: "Jakna", audioSrc: "/audio/hr/jakna.mp3" },

      { challengeId: 152, correct: true, text: "Obuci majicu", audioSrc: "/audio/hr/obuci_majicu.mp3" },
      { challengeId: 152, correct: false, text: "Topla jakna", audioSrc: "/audio/hr/topla_jakna.mp3" },
      { challengeId: 152, correct: false, text: "Gdje su mi cipele?", audioSrc: "/audio/hr/gdje_su_cipele.mp3" },

      { challengeId: 153, correct: true, text: "Topla jakna", audioSrc: "/audio/hr/topla_jakna.mp3" },
      { challengeId: 153, correct: false, text: "Lijepa haljina", audioSrc: "/audio/hr/lijepa_haljina.mp3" },
      { challengeId: 153, correct: false, text: "Obuci majicu", audioSrc: "/audio/hr/obuci_majicu.mp3" },

      { challengeId: 154, correct: true, text: "Lijepa haljina", audioSrc: "/audio/hr/lijepa_haljina.mp3" },
      { challengeId: 154, correct: false, text: "Topla jakna", audioSrc: "/audio/hr/topla_jakna.mp3" },
      { challengeId: 154, correct: false, text: "Crvena kapa", audioSrc: "/audio/hr/crvena_kapa.mp3" },

      { challengeId: 155, correct: true, text: "Gdje su mi cipele?", audioSrc: "/audio/hr/gdje_su_cipele.mp3" },
      { challengeId: 155, correct: false, text: "Obuci majicu", audioSrc: "/audio/hr/obuci_majicu.mp3" },
      { challengeId: 155, correct: false, text: "Topla jakna", audioSrc: "/audio/hr/topla_jakna.mp3" },

      { challengeId: 156, correct: true, text: "Cipele", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/cipele.mp3" },
      { challengeId: 156, correct: false, text: "Čarape", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/carape.mp3" },
      { challengeId: 156, correct: false, text: "Hlače", imageSrc: "/points.svg", audioSrc: "/audio/hr/hlace.mp3" },

      { challengeId: 157, correct: true, text: "Kapa", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/kapa.mp3" },
      { challengeId: 157, correct: false, text: "Šal", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/sal.mp3" },
      { challengeId: 157, correct: false, text: "Jakna", imageSrc: "/points.svg", audioSrc: "/audio/hr/jakna.mp3" },

      { challengeId: 158, correct: true, text: "Majica", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/majica.mp3" },
      { challengeId: 158, correct: false, text: "Haljina", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/haljina.mp3" },
      { challengeId: 158, correct: false, text: "Hlače", imageSrc: "/points.svg", audioSrc: "/audio/hr/hlace.mp3" },

      { challengeId: 159, correct: true, text: "Crvena kapa", audioSrc: "/audio/hr/crvena_kapa.mp3" },
      { challengeId: 159, correct: false, text: "Topla jakna", audioSrc: "/audio/hr/topla_jakna.mp3" },
      { challengeId: 159, correct: false, text: "Lijepa haljina", audioSrc: "/audio/hr/lijepa_haljina.mp3" },

      { challengeId: 160, correct: true, text: "Topla jakna", audioSrc: "/audio/hr/topla_jakna.mp3" },
      { challengeId: 160, correct: false, text: "Obuci majicu", audioSrc: "/audio/hr/obuci_majicu.mp3" },
      { challengeId: 160, correct: false, text: "Gdje su mi cipele?", audioSrc: "/audio/hr/gdje_su_cipele.mp3" },

      { challengeId: 161, correct: true, text: "Gdje su mi cipele?", audioSrc: "/audio/hr/gdje_su_cipele.mp3" },
      { challengeId: 161, correct: false, text: "Crvena kapa", audioSrc: "/audio/hr/crvena_kapa.mp3" },
      { challengeId: 161, correct: false, text: "Lijepa haljina", audioSrc: "/audio/hr/lijepa_haljina.mp3" },

      // --- UNIT 10 OPTIONS ---
      { challengeId: 162, correct: true, text: "Sunčano", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/suncano.mp3" },
      { challengeId: 162, correct: false, text: "Kiša", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/kisa.mp3" },
      { challengeId: 162, correct: false, text: "Vjetar", imageSrc: "/points.svg", audioSrc: "/audio/hr/vjetar.mp3" },

      { challengeId: 163, correct: true, text: "Kiša", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/kisa.mp3" },
      { challengeId: 163, correct: false, text: "Snijeg", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/snijeg.mp3" },
      { challengeId: 163, correct: false, text: "Sunčano", imageSrc: "/points.svg", audioSrc: "/audio/hr/suncano.mp3" },

      { challengeId: 164, correct: true, text: "Vjetar", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/vjetar.mp3" },
      { challengeId: 164, correct: false, text: "Oblak", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/oblak.mp3" },
      { challengeId: 164, correct: false, text: "Kiša", imageSrc: "/points.svg", audioSrc: "/audio/hr/kisa.mp3" },

      { challengeId: 165, correct: true, text: "Snijeg", audioSrc: "/audio/hr/snijeg.mp3" },
      { challengeId: 165, correct: false, text: "Kiša", audioSrc: "/audio/hr/kisa.mp3" },
      { challengeId: 165, correct: false, text: "Vjetar", audioSrc: "/audio/hr/vjetar.mp3" },

      { challengeId: 166, correct: true, text: "Toplo", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/toplo.mp3" },
      { challengeId: 166, correct: false, text: "Hladno", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/hladno.mp3" },
      { challengeId: 166, correct: false, text: "Oblak", imageSrc: "/points.svg", audioSrc: "/audio/hr/oblak.mp3" },

      { challengeId: 167, correct: true, text: "Hladno", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/hladno.mp3" },
      { challengeId: 167, correct: false, text: "Toplo", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/toplo.mp3" },
      { challengeId: 167, correct: false, text: "Duga", imageSrc: "/points.svg", audioSrc: "/audio/hr/duga.mp3" },

      { challengeId: 168, correct: true, text: "Oblak", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/oblak.mp3" },
      { challengeId: 168, correct: false, text: "Duga", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/duga.mp3" },
      { challengeId: 168, correct: false, text: "Kiša", imageSrc: "/points.svg", audioSrc: "/audio/hr/kisa.mp3" },

      { challengeId: 169, correct: true, text: "Duga", audioSrc: "/audio/hr/duga.mp3" },
      { challengeId: 169, correct: false, text: "Oblak", audioSrc: "/audio/hr/oblak.mp3" },
      { challengeId: 169, correct: false, text: "Sunčano", audioSrc: "/audio/hr/suncano.mp3" },

      { challengeId: 170, correct: true, text: "Sretan", audioSrc: "/audio/hr/sretan.mp3" },
      { challengeId: 170, correct: false, text: "Umoran", audioSrc: "/audio/hr/umoran.mp3" },
      { challengeId: 170, correct: false, text: "Hladno", audioSrc: "/audio/hr/hladno.mp3" },

      { challengeId: 171, correct: true, text: "Umoran", audioSrc: "/audio/hr/umoran.mp3" },
      { challengeId: 171, correct: false, text: "Sretan", audioSrc: "/audio/hr/sretan.mp3" },
      { challengeId: 171, correct: false, text: "Nasmijan", audioSrc: "/audio/hr/nasmijan.mp3" },

      { challengeId: 172, correct: true, text: "Nasmijan", audioSrc: "/audio/hr/nasmijan.mp3" },
      { challengeId: 172, correct: false, text: "Umoran", audioSrc: "/audio/hr/umoran.mp3" },
      { challengeId: 172, correct: false, text: "Toplo", audioSrc: "/audio/hr/toplo.mp3" },

      { challengeId: 173, correct: true, text: "Ja sam sretan!", audioSrc: "/audio/hr/ja_sam_sretan.mp3" },
      { challengeId: 173, correct: false, text: "Gladan sam", audioSrc: "/audio/hr/gladan_sam.mp3" },
      { challengeId: 173, correct: false, text: "Umoran", audioSrc: "/audio/hr/umoran.mp3" },

      { challengeId: 174, correct: true, text: "Sunčano", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/suncano.mp3" },
      { challengeId: 174, correct: false, text: "Kiša", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/kisa.mp3" },
      { challengeId: 174, correct: false, text: "Snijeg", imageSrc: "/points.svg", audioSrc: "/audio/hr/snijeg.mp3" },

      { challengeId: 175, correct: true, text: "Kiša", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/kisa.mp3" },
      { challengeId: 175, correct: false, text: "Oblak", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/oblak.mp3" },
      { challengeId: 175, correct: false, text: "Sunčano", imageSrc: "/points.svg", audioSrc: "/audio/hr/suncano.mp3" },

      { challengeId: 176, correct: true, text: "Duga", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/duga.mp3" },
      { challengeId: 176, correct: false, text: "Oblak", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/oblak.mp3" },
      { challengeId: 176, correct: false, text: "Vjetar", imageSrc: "/points.svg", audioSrc: "/audio/hr/vjetar.mp3" },

      { challengeId: 177, correct: true, text: "Pada kiša", audioSrc: "/audio/hr/pada_kisa.mp3" },
      { challengeId: 177, correct: false, text: "Sija sunce", audioSrc: "/audio/hr/sija_sunce.mp3" },
      { challengeId: 177, correct: false, text: "Hladan vjetar", audioSrc: "/audio/hr/hladan_vjetar.mp3" },

      { challengeId: 178, correct: true, text: "Sija sunce", audioSrc: "/audio/hr/sija_sunce.mp3" },
      { challengeId: 178, correct: false, text: "Pada kiša", audioSrc: "/audio/hr/pada_kisa.mp3" },
      { challengeId: 178, correct: false, text: "Ja sam sretan!", audioSrc: "/audio/hr/ja_sam_sretan.mp3" },

      { challengeId: 179, correct: true, text: "Ja sam sretan!", audioSrc: "/audio/hr/ja_sam_sretan.mp3" },
      { challengeId: 179, correct: false, text: "Pada kiša", audioSrc: "/audio/hr/pada_kisa.mp3" },
      { challengeId: 179, correct: false, text: "Sija sunce", audioSrc: "/audio/hr/sija_sunce.mp3" },
      // --- UNIT 11 OPTIONS ---
      { challengeId: 180, correct: true, text: "Spavam", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/spavam.mp3" },
      { challengeId: 180, correct: false, text: "Jedem", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/jedem.mp3" },
      { challengeId: 180, correct: false, text: "Pijem", imageSrc: "/points.svg", audioSrc: "/audio/hr/pijem.mp3" },

      { challengeId: 181, correct: true, text: "Jedem", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/jedem.mp3" },
      { challengeId: 181, correct: false, text: "Spavam", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/spavam.mp3" },
      { challengeId: 181, correct: false, text: "Igram se", imageSrc: "/points.svg", audioSrc: "/audio/hr/igram_se.mp3" },

      { challengeId: 182, correct: true, text: "Pijem", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/pijem.mp3" },
      { challengeId: 182, correct: false, text: "Jedem", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/jedem.mp3" },
      { challengeId: 182, correct: false, text: "Čitam", imageSrc: "/points.svg", audioSrc: "/audio/hr/citam.mp3" },

      { challengeId: 183, correct: true, text: "Igram se", audioSrc: "/audio/hr/igram_se.mp3" },
      { challengeId: 183, correct: false, text: "Spavam", audioSrc: "/audio/hr/spavam.mp3" },
      { challengeId: 183, correct: false, text: "Učim", audioSrc: "/audio/hr/ucim.mp3" },

      { challengeId: 184, correct: true, text: "Gledam", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/gledam.mp3" },
      { challengeId: 184, correct: false, text: "Čitam", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/citam.mp3" },
      { challengeId: 184, correct: false, text: "Pjevam", imageSrc: "/points.svg", audioSrc: "/audio/hr/pjevam.mp3" },

      { challengeId: 185, correct: true, text: "Čitam", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/citam.mp3" },
      { challengeId: 185, correct: false, text: "Gledam", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/gledam.mp3" },
      { challengeId: 185, correct: false, text: "Učim", imageSrc: "/points.svg", audioSrc: "/audio/hr/ucim.mp3" },

      { challengeId: 186, correct: true, text: "Pjevam", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/pjevam.mp3" },
      { challengeId: 186, correct: false, text: "Pijem", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/pijem.mp3" },
      { challengeId: 186, correct: false, text: "Spavam", imageSrc: "/points.svg", audioSrc: "/audio/hr/spavam.mp3" },

      { challengeId: 187, correct: true, text: "Učim", audioSrc: "/audio/hr/ucim.mp3" },
      { challengeId: 187, correct: false, text: "Pjevam", audioSrc: "/audio/hr/pjevam.mp3" },
      { challengeId: 187, correct: false, text: "Čitam", audioSrc: "/audio/hr/citam.mp3" },

      { challengeId: 188, correct: true, text: "Pijem vodu", audioSrc: "/audio/hr/pijem_vodu.mp3" },
      { challengeId: 188, correct: false, text: "Jedem jabuku", audioSrc: "/audio/hr/jedem_jabuku.mp3" },
      { challengeId: 188, correct: false, text: "Čitam knjigu", audioSrc: "/audio/hr/citam_knjigu.mp3" },

      { challengeId: 189, correct: true, text: "Jedem jabuku", audioSrc: "/audio/hr/jedem_jabuku.mp3" },
      { challengeId: 189, correct: false, text: "Pijem vodu", audioSrc: "/audio/hr/pijem_vodu.mp3" },
      { challengeId: 189, correct: false, text: "Igram se s psom", audioSrc: "/audio/hr/igram_se_s_psom.mp3" },

      { challengeId: 190, correct: true, text: "Čitam knjigu", audioSrc: "/audio/hr/citam_knjigu.mp3" },
      { challengeId: 190, correct: false, text: "Pjevam i plešem!", audioSrc: "/audio/hr/pjevam_i_plesem.mp3" },
      { challengeId: 190, correct: false, text: "Jedem jabuku", audioSrc: "/audio/hr/jedem_jabuku.mp3" },

      { challengeId: 191, correct: true, text: "Igram se s psom", audioSrc: "/audio/hr/igram_se_s_psom.mp3" },
      { challengeId: 191, correct: false, text: "Pijem vodu", audioSrc: "/audio/hr/pijem_vodu.mp3" },
      { challengeId: 191, correct: false, text: "Čitam knjigu", audioSrc: "/audio/hr/citam_knjigu.mp3" },

      { challengeId: 192, correct: true, text: "Spavam", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/spavam.mp3" },
      { challengeId: 192, correct: false, text: "Jedem", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/jedem.mp3" },
      { challengeId: 192, correct: false, text: "Čitam", imageSrc: "/points.svg", audioSrc: "/audio/hr/citam.mp3" },

      { challengeId: 193, correct: true, text: "Jedem", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/jedem.mp3" },
      { challengeId: 193, correct: false, text: "Pijem", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/pijem.mp3" },
      { challengeId: 193, correct: false, text: "Pjevam", imageSrc: "/points.svg", audioSrc: "/audio/hr/pjevam.mp3" },

      { challengeId: 194, correct: true, text: "Čitam", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/citam.mp3" },
      { challengeId: 194, correct: false, text: "Gledam", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/gledam.mp3" },
      { challengeId: 194, correct: false, text: "Spavam", imageSrc: "/points.svg", audioSrc: "/audio/hr/spavam.mp3" },

      { challengeId: 195, correct: true, text: "Pjevam i plešem!", audioSrc: "/audio/hr/pjevam_i_plesem.mp3" },
      { challengeId: 195, correct: false, text: "Pijem mlijeko", audioSrc: "/audio/hr/pijem_mlijeko.mp3" },
      { challengeId: 195, correct: false, text: "Volim učiti!", audioSrc: "/audio/hr/volim_uciti.mp3" },

      { challengeId: 196, correct: true, text: "Pijem mlijeko", audioSrc: "/audio/hr/pijem_mlijeko.mp3" },
      { challengeId: 196, correct: false, text: "Jedem jabuku", audioSrc: "/audio/hr/jedem_jabuku.mp3" },
      { challengeId: 196, correct: false, text: "Pjevam i plešem!", audioSrc: "/audio/hr/pjevam_i_plesem.mp3" },

      { challengeId: 197, correct: true, text: "Volim učiti!", audioSrc: "/audio/hr/volim_uciti.mp3" },
      { challengeId: 197, correct: false, text: "Čitam knjigu", audioSrc: "/audio/hr/citam_knjigu.mp3" },
      { challengeId: 197, correct: false, text: "Pijem vodu", audioSrc: "/audio/hr/pijem_vodu.mp3" },

      // --- UNIT 12 OPTIONS ---
      { challengeId: 198, correct: true, text: "Park", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/park.mp3" },
      { challengeId: 198, correct: false, text: "Ulica", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/ulica.mp3" },
      { challengeId: 198, correct: false, text: "Drvo", imageSrc: "/points.svg", audioSrc: "/audio/hr/drvo.mp3" },

      { challengeId: 199, correct: true, text: "Ljuljačka", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/ljuljacka.mp3" },
      { challengeId: 199, correct: false, text: "Tobogan", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/tobogan.mp3" },
      { challengeId: 199, correct: false, text: "Trava", imageSrc: "/points.svg", audioSrc: "/audio/hr/trava.mp3" },

      { challengeId: 200, correct: true, text: "Tobogan", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/tobogan.mp3" },
      { challengeId: 200, correct: false, text: "Ljuljačka", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/ljuljacka.mp3" },
      { challengeId: 200, correct: false, text: "Bicikl", imageSrc: "/points.svg", audioSrc: "/audio/hr/bicikl.mp3" },

      { challengeId: 201, correct: true, text: "Trava", audioSrc: "/audio/hr/trava.mp3" },
      { challengeId: 201, correct: false, text: "Drvo", audioSrc: "/audio/hr/drvo.mp3" },
      { challengeId: 201, correct: false, text: "Park", audioSrc: "/audio/hr/park.mp3" },

      { challengeId: 202, correct: true, text: "Drvo", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/drvo.mp3" },
      { challengeId: 202, correct: false, text: "Trava", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/trava.mp3" },
      { challengeId: 202, correct: false, text: "Auto", imageSrc: "/points.svg", audioSrc: "/audio/hr/auto.mp3" },

      { challengeId: 203, correct: true, text: "Auto", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/auto.mp3" },
      { challengeId: 203, correct: false, text: "Bicikl", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/bicikl.mp3" },
      { challengeId: 203, correct: false, text: "Ulica", imageSrc: "/points.svg", audioSrc: "/audio/hr/ulica.mp3" },

      { challengeId: 204, correct: true, text: "Bicikl", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/bicikl.mp3" },
      { challengeId: 204, correct: false, text: "Auto", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/auto.mp3" },
      { challengeId: 204, correct: false, text: "Tobogan", imageSrc: "/points.svg", audioSrc: "/audio/hr/tobogan.mp3" },

      { challengeId: 205, correct: true, text: "Ulica", audioSrc: "/audio/hr/ulica.mp3" },
      { challengeId: 205, correct: false, text: "Park", audioSrc: "/audio/hr/park.mp3" },
      { challengeId: 205, correct: false, text: "Auto", audioSrc: "/audio/hr/auto.mp3" },

      { challengeId: 206, correct: true, text: "Idemo u park!", audioSrc: "/audio/hr/idemo_u_park.mp3" },
      { challengeId: 206, correct: false, text: "Vozim bicikl", audioSrc: "/audio/hr/vozim_bicikl.mp3" },
      { challengeId: 206, correct: false, text: "Brzi auto", audioSrc: "/audio/hr/brzi_auto.mp3" },

      { challengeId: 207, correct: true, text: "Vozim bicikl", audioSrc: "/audio/hr/vozim_bicikl.mp3" },
      { challengeId: 207, correct: false, text: "Idemo u park!", audioSrc: "/audio/hr/idemo_u_park.mp3" },
      { challengeId: 207, correct: false, text: "Zeleno drvo", audioSrc: "/audio/hr/zeleno_drvo.mp3" },

      { challengeId: 208, correct: true, text: "Brzi auto", audioSrc: "/audio/hr/brzi_auto.mp3" },
      { challengeId: 208, correct: false, text: "Vozim bicikl", audioSrc: "/audio/hr/vozim_bicikl.mp3" },
      { challengeId: 208, correct: false, text: "Zeleno drvo", audioSrc: "/audio/hr/zeleno_drvo.mp3" },

      { challengeId: 209, correct: true, text: "Zeleno drvo", audioSrc: "/audio/hr/zeleno_drvo.mp3" },
      { challengeId: 209, correct: false, text: "Brzi auto", audioSrc: "/audio/hr/brzi_auto.mp3" },
      { challengeId: 209, correct: false, text: "Idemo u park!", audioSrc: "/audio/hr/idemo_u_park.mp3" },

      { challengeId: 210, correct: true, text: "Tobogan", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/tobogan.mp3" },
      { challengeId: 210, correct: false, text: "Ljuljačka", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/ljuljacka.mp3" },
      { challengeId: 210, correct: false, text: "Trava", imageSrc: "/points.svg", audioSrc: "/audio/hr/trava.mp3" },

      { challengeId: 211, correct: true, text: "Ljuljačka", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/ljuljacka.mp3" },
      { challengeId: 211, correct: false, text: "Tobogan", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/tobogan.mp3" },
      { challengeId: 211, correct: false, text: "Drvo", imageSrc: "/points.svg", audioSrc: "/audio/hr/drvo.mp3" },

      { challengeId: 212, correct: true, text: "Bicikl", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/bicikl.mp3" },
      { challengeId: 212, correct: false, text: "Auto", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/auto.mp3" },
      { challengeId: 212, correct: false, text: "Ulica", imageSrc: "/points.svg", audioSrc: "/audio/hr/ulica.mp3" },

      { challengeId: 213, correct: true, text: "Idemo u park!", audioSrc: "/audio/hr/idemo_u_park.mp3" },
      { challengeId: 213, correct: false, text: "Ljuljam se visoko!", audioSrc: "/audio/hr/ljuljam_se_visoko.mp3" },
      { challengeId: 213, correct: false, text: "Brzi auto", audioSrc: "/audio/hr/brzi_auto.mp3" },

      { challengeId: 214, correct: true, text: "Ljuljam se visoko!", audioSrc: "/audio/hr/ljuljam_se_visoko.mp3" },
      { challengeId: 214, correct: false, text: "Vozim bicikl", audioSrc: "/audio/hr/vozim_bicikl.mp3" },
      { challengeId: 214, correct: false, text: "Idemo u park!", audioSrc: "/audio/hr/idemo_u_park.mp3" },

      { challengeId: 215, correct: true, text: "Vozim bicikl", audioSrc: "/audio/hr/vozim_bicikl.mp3" },
      { challengeId: 215, correct: false, text: "Ljuljam se visoko!", audioSrc: "/audio/hr/ljuljam_se_visoko.mp3" },
      { challengeId: 215, correct: false, text: "Zeleno drvo", audioSrc: "/audio/hr/zeleno_drvo.mp3" },

      // --- UNIT 13 OPTIONS ---
      { challengeId: 216, correct: true, text: "Ovdje", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/ovdje.mp3" },
      { challengeId: 216, correct: false, text: "Tamo", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/tamo.mp3" },
      { challengeId: 216, correct: false, text: "Gore", imageSrc: "/points.svg", audioSrc: "/audio/hr/gore.mp3" },

      { challengeId: 217, correct: true, text: "Tamo", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/tamo.mp3" },
      { challengeId: 217, correct: false, text: "Ovdje", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/ovdje.mp3" },
      { challengeId: 217, correct: false, text: "Dolje", imageSrc: "/points.svg", audioSrc: "/audio/hr/dolje.mp3" },

      { challengeId: 218, correct: true, text: "Gore", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/gore.mp3" },
      { challengeId: 218, correct: false, text: "Dolje", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/dolje.mp3" },
      { challengeId: 218, correct: false, text: "Ispod", imageSrc: "/points.svg", audioSrc: "/audio/hr/ispod.mp3" },

      { challengeId: 219, correct: true, text: "Dolje", audioSrc: "/audio/hr/dolje.mp3" },
      { challengeId: 219, correct: false, text: "Gore", audioSrc: "/audio/hr/gore.mp3" },
      { challengeId: 219, correct: false, text: "Blizu", audioSrc: "/audio/hr/blizu.mp3" },

      { challengeId: 220, correct: true, text: "U", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/u.mp3" },
      { challengeId: 220, correct: false, text: "Na", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/na.mp3" },
      { challengeId: 220, correct: false, text: "Ispod", imageSrc: "/points.svg", audioSrc: "/audio/hr/ispod.mp3" },

      { challengeId: 221, correct: true, text: "Na", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/na.mp3" },
      { challengeId: 221, correct: false, text: "U", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/u.mp3" },
      { challengeId: 221, correct: false, text: "Blizu", imageSrc: "/points.svg", audioSrc: "/audio/hr/blizu.mp3" },

      { challengeId: 222, correct: true, text: "Ispod", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/ispod.mp3" },
      { challengeId: 222, correct: false, text: "Na", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/na.mp3" },
      { challengeId: 222, correct: false, text: "Gore", imageSrc: "/points.svg", audioSrc: "/audio/hr/gore.mp3" },

      { challengeId: 223, correct: true, text: "Blizu", audioSrc: "/audio/hr/blizu.mp3" },
      { challengeId: 223, correct: false, text: "Tamo", audioSrc: "/audio/hr/tamo.mp3" },
      { challengeId: 223, correct: false, text: "Ovdje", audioSrc: "/audio/hr/ovdje.mp3" },

      { challengeId: 224, correct: true, text: "Ispod stola", audioSrc: "/audio/hr/ispod_stola.mp3" },
      { challengeId: 224, correct: false, text: "Na stolu", audioSrc: "/audio/hr/na_stolu.mp3" },
      { challengeId: 224, correct: false, text: "U sobi", audioSrc: "/audio/hr/u_sobi.mp3" },

      { challengeId: 225, correct: true, text: "Na stolu", audioSrc: "/audio/hr/na_stolu.mp3" },
      { challengeId: 225, correct: false, text: "Ispod stola", audioSrc: "/audio/hr/ispod_stola.mp3" },
      { challengeId: 225, correct: false, text: "Pogledaj gore!", audioSrc: "/audio/hr/pogledaj_gore.mp3" },

      { challengeId: 226, correct: true, text: "U sobi", audioSrc: "/audio/hr/u_sobi.mp3" },
      { challengeId: 226, correct: false, text: "Ispod kreveta", audioSrc: "/audio/hr/ispod_kreveta.mp3" },
      { challengeId: 226, correct: false, text: "Na stolu", audioSrc: "/audio/hr/na_stolu.mp3" },

      { challengeId: 227, correct: true, text: "Pogledaj gore!", audioSrc: "/audio/hr/pogledaj_gore.mp3" },
      { challengeId: 227, correct: false, text: "Ovdje sam!", audioSrc: "/audio/hr/ovdje_sam.mp3" },
      { challengeId: 227, correct: false, text: "Ispod stola", audioSrc: "/audio/hr/ispod_stola.mp3" },

      { challengeId: 228, correct: true, text: "Ispod", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/ispod.mp3" },
      { challengeId: 228, correct: false, text: "Na", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/na.mp3" },
      { challengeId: 228, correct: false, text: "Gore", imageSrc: "/points.svg", audioSrc: "/audio/hr/gore.mp3" },

      { challengeId: 229, correct: true, text: "Gore", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/gore.mp3" },
      { challengeId: 229, correct: false, text: "Dolje", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/dolje.mp3" },
      { challengeId: 229, correct: false, text: "Ovdje", imageSrc: "/points.svg", audioSrc: "/audio/hr/ovdje.mp3" },

      { challengeId: 230, correct: true, text: "Ovdje", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/ovdje.mp3" },
      { challengeId: 230, correct: false, text: "Tamo", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/tamo.mp3" },
      { challengeId: 230, correct: false, text: "Ispod", imageSrc: "/points.svg", audioSrc: "/audio/hr/ispod.mp3" },

      { challengeId: 231, correct: true, text: "Ispod kreveta", audioSrc: "/audio/hr/ispod_kreveta.mp3" },
      { challengeId: 231, correct: false, text: "Na stolu", audioSrc: "/audio/hr/na_stolu.mp3" },
      { challengeId: 231, correct: false, text: "Pogledaj gore!", audioSrc: "/audio/hr/pogledaj_gore.mp3" },

      { challengeId: 232, correct: true, text: "Na stolu", audioSrc: "/audio/hr/na_stolu.mp3" },
      { challengeId: 232, correct: false, text: "Ispod kreveta", audioSrc: "/audio/hr/ispod_kreveta.mp3" },
      { challengeId: 232, correct: false, text: "Ovdje sam!", audioSrc: "/audio/hr/ovdje_sam.mp3" },

      { challengeId: 233, correct: true, text: "Ovdje sam!", audioSrc: "/audio/hr/ovdje_sam.mp3" },
      { challengeId: 233, correct: false, text: "Pogledaj gore!", audioSrc: "/audio/hr/pogledaj_gore.mp3" },
      { challengeId: 233, correct: false, text: "Ispod stola", audioSrc: "/audio/hr/ispod_stola.mp3" },

      // --- UNIT 14 OPTIONS ---
      { challengeId: 234, correct: true, text: "Pekara", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/pekara.mp3" },
      { challengeId: 234, correct: false, text: "Trgovina", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/trgovina.mp3" },
      { challengeId: 234, correct: false, text: "Kruh", imageSrc: "/points.svg", audioSrc: "/audio/hr/kruh.mp3" },

      { challengeId: 235, correct: true, text: "Kiflica", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/kiflica.mp3" },
      { challengeId: 235, correct: false, text: "Burek", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/burek.mp3" },
      { challengeId: 235, correct: false, text: "Sir", imageSrc: "/points.svg", audioSrc: "/audio/hr/sir.mp3" },

      { challengeId: 236, correct: true, text: "Kruh", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/kruh.mp3" },
      { challengeId: 236, correct: false, text: "Kiflica", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/kiflica.mp3" },
      { challengeId: 236, correct: false, text: "Pekara", imageSrc: "/points.svg", audioSrc: "/audio/hr/pekara.mp3" },

      { challengeId: 237, correct: true, text: "Burek", audioSrc: "/audio/hr/burek.mp3" },
      { challengeId: 237, correct: false, text: "Kiflica", audioSrc: "/audio/hr/kiflica.mp3" },
      { challengeId: 237, correct: false, text: "Sir", audioSrc: "/audio/hr/sir.mp3" },

      { challengeId: 238, correct: true, text: "Sir", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/sir.mp3" },
      { challengeId: 238, correct: false, text: "Rajčica", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/rajcica.mp3" },
      { challengeId: 238, correct: false, text: "Naranča", imageSrc: "/points.svg", audioSrc: "/audio/hr/naranca.mp3" },

      { challengeId: 239, correct: true, text: "Rajčica", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/rajcica.mp3" },
      { challengeId: 239, correct: false, text: "Naranča", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/naranca.mp3" },
      { challengeId: 239, correct: false, text: "Sir", imageSrc: "/points.svg", audioSrc: "/audio/hr/sir.mp3" },

      { challengeId: 240, correct: true, text: "Naranča", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/naranca.mp3" },
      { challengeId: 240, correct: false, text: "Rajčica", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/rajcica.mp3" },
      { challengeId: 240, correct: false, text: "Burek", imageSrc: "/points.svg", audioSrc: "/audio/hr/burek.mp3" },

      { challengeId: 241, correct: true, text: "Trgovina", audioSrc: "/audio/hr/trgovina.mp3" },
      { challengeId: 241, correct: false, text: "Pekara", audioSrc: "/audio/hr/pekara.mp3" },
      { challengeId: 241, correct: false, text: "Sir", audioSrc: "/audio/hr/sir.mp3" },

      { challengeId: 242, correct: true, text: "Molim jednu kiflicu!", audioSrc: "/audio/hr/molim_jednu_kiflicu.mp3" },
      { challengeId: 242, correct: false, text: "Izvolite!", audioSrc: "/audio/hr/izvolite.mp3" },
      { challengeId: 242, correct: false, text: "Svježi sir", audioSrc: "/audio/hr/svjezi_sir.mp3" },

      { challengeId: 243, correct: true, text: "Izvolite!", audioSrc: "/audio/hr/izvolite.mp3" },
      { challengeId: 243, correct: false, text: "Molim jednu kiflicu!", audioSrc: "/audio/hr/molim_jednu_kiflicu.mp3" },
      { challengeId: 243, correct: false, text: "Hvala i doviđenja!", audioSrc: "/audio/hr/hvala_i_dovidenja.mp3" },

      { challengeId: 244, correct: true, text: "Svježi sir", audioSrc: "/audio/hr/svjezi_sir.mp3" },
      { challengeId: 244, correct: false, text: "Slatka naranča", audioSrc: "/audio/hr/slatka_naranca.mp3" },
      { challengeId: 244, correct: false, text: "Molim jednu kiflicu!", audioSrc: "/audio/hr/molim_jednu_kiflicu.mp3" },

      { challengeId: 245, correct: true, text: "Slatka naranča", audioSrc: "/audio/hr/slatka_naranca.mp3" },
      { challengeId: 245, correct: false, text: "Svježi sir", audioSrc: "/audio/hr/svjezi_sir.mp3" },
      { challengeId: 245, correct: false, text: "Izvolite!", audioSrc: "/audio/hr/izvolite.mp3" },

      { challengeId: 246, correct: true, text: "Pekara", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/pekara.mp3" },
      { challengeId: 246, correct: false, text: "Trgovina", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/trgovina.mp3" },
      { challengeId: 246, correct: false, text: "Sir", imageSrc: "/points.svg", audioSrc: "/audio/hr/sir.mp3" },

      { challengeId: 247, correct: true, text: "Kiflica", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/kiflica.mp3" },
      { challengeId: 247, correct: false, text: "Burek", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/burek.mp3" },
      { challengeId: 247, correct: false, text: "Kruh", imageSrc: "/points.svg", audioSrc: "/audio/hr/kruh.mp3" },

      { challengeId: 248, correct: true, text: "Sir", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/sir.mp3" },
      { challengeId: 248, correct: false, text: "Rajčica", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/rajcica.mp3" },
      { challengeId: 248, correct: false, text: "Naranča", imageSrc: "/points.svg", audioSrc: "/audio/hr/naranca.mp3" },

      { challengeId: 249, correct: true, text: "Molim jednu kiflicu!", audioSrc: "/audio/hr/molim_jednu_kiflicu.mp3" },
      { challengeId: 249, correct: false, text: "Hvala i doviđenja!", audioSrc: "/audio/hr/hvala_i_dovidenja.mp3" },
      { challengeId: 249, correct: false, text: "Izvolite!", audioSrc: "/audio/hr/izvolite.mp3" },

      { challengeId: 250, correct: true, text: "Hvala i doviđenja!", audioSrc: "/audio/hr/hvala_i_dovidenja.mp3" },
      { challengeId: 250, correct: false, text: "Molim jednu kiflicu!", audioSrc: "/audio/hr/molim_jednu_kiflicu.mp3" },
      { challengeId: 250, correct: false, text: "Izvolite!", audioSrc: "/audio/hr/izvolite.mp3" },

      { challengeId: 251, correct: true, text: "Izvolite!", audioSrc: "/audio/hr/izvolite.mp3" },
      { challengeId: 251, correct: false, text: "Hvala i doviđenja!", audioSrc: "/audio/hr/hvala_i_dovidenja.mp3" },
      { challengeId: 251, correct: false, text: "Svježi sir", audioSrc: "/audio/hr/svjezi_sir.mp3" },

      // --- UNIT 15 OPTIONS ---
      { challengeId: 252, correct: true, text: "Lopta", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/lopta.mp3" },
      { challengeId: 252, correct: false, text: "Nogomet", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/nogomet.mp3" },
      { challengeId: 252, correct: false, text: "Gol!", imageSrc: "/points.svg", audioSrc: "/audio/hr/gol.mp3" },

      { challengeId: 253, correct: true, text: "Nogomet", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/nogomet.mp3" },
      { challengeId: 253, correct: false, text: "Lopta", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/lopta.mp3" },
      { challengeId: 253, correct: false, text: "Igra", imageSrc: "/points.svg", audioSrc: "/audio/hr/igra.mp3" },

      { challengeId: 254, correct: true, text: "Gol!", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/gol.mp3" },
      { challengeId: 254, correct: false, text: "Pobjeda!", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/pobjeda.mp3" },
      { challengeId: 254, correct: false, text: "Lopta", imageSrc: "/points.svg", audioSrc: "/audio/hr/lopta.mp3" },

      { challengeId: 255, correct: true, text: "Igra", audioSrc: "/audio/hr/igra.mp3" },
      { challengeId: 255, correct: false, text: "Nogomet", audioSrc: "/audio/hr/nogomet.mp3" },
      { challengeId: 255, correct: false, text: "Glazba", audioSrc: "/audio/hr/glazba.mp3" },

      { challengeId: 256, correct: true, text: "Glazba", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/glazba.mp3" },
      { challengeId: 256, correct: false, text: "Pjesma", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/pjesma.mp3" },
      { challengeId: 256, correct: false, text: "Crtanje", imageSrc: "/points.svg", audioSrc: "/audio/hr/crtanje.mp3" },

      { challengeId: 257, correct: true, text: "Pjesma", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/pjesma.mp3" },
      { challengeId: 257, correct: false, text: "Glazba", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/glazba.mp3" },
      { challengeId: 257, correct: false, text: "Pobjeda!", imageSrc: "/points.svg", audioSrc: "/audio/hr/pobjeda.mp3" },

      { challengeId: 258, correct: true, text: "Crtanje", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/crtanje.mp3" },
      { challengeId: 258, correct: false, text: "Glazba", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/glazba.mp3" },
      { challengeId: 258, correct: false, text: "Igra", imageSrc: "/points.svg", audioSrc: "/audio/hr/igra.mp3" },

      { challengeId: 259, correct: true, text: "Pobjeda!", audioSrc: "/audio/hr/pobjeda.mp3" },
      { challengeId: 259, correct: false, text: "Igra", audioSrc: "/audio/hr/igra.mp3" },
      { challengeId: 259, correct: false, text: "Pjesma", audioSrc: "/audio/hr/pjesma.mp3" },

      { challengeId: 260, correct: true, text: "Zabij gol!", audioSrc: "/audio/hr/zabij_gol.mp3" },
      { challengeId: 260, correct: false, text: "Dodaj loptu!", audioSrc: "/audio/hr/dodaj_loptu.mp3" },
      { challengeId: 260, correct: false, text: "Bravo!", audioSrc: "/audio/hr/bravo.mp3" },

      { challengeId: 261, correct: true, text: "Dodaj loptu!", audioSrc: "/audio/hr/dodaj_loptu.mp3" },
      { challengeId: 261, correct: false, text: "Zabij gol!", audioSrc: "/audio/hr/zabij_gol.mp3" },
      { challengeId: 261, correct: false, text: "Lijepa pjesma", audioSrc: "/audio/hr/lijepa_pjesma.mp3" },

      { challengeId: 262, correct: true, text: "Lijepa pjesma", audioSrc: "/audio/hr/lijepa_pjesma.mp3" },
      { challengeId: 262, correct: false, text: "Bravo!", audioSrc: "/audio/hr/bravo.mp3" },
      { challengeId: 262, correct: false, text: "Zabij gol!", audioSrc: "/audio/hr/zabij_gol.mp3" },

      { challengeId: 263, correct: true, text: "Bravo!", audioSrc: "/audio/hr/bravo.mp3" },
      { challengeId: 263, correct: false, text: "Dodaj loptu!", audioSrc: "/audio/hr/dodaj_loptu.mp3" },
      { challengeId: 263, correct: false, text: "Pobjeda!", audioSrc: "/audio/hr/pobjeda.mp3" },

      { challengeId: 264, correct: true, text: "Lopta", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/lopta.mp3" },
      { challengeId: 264, correct: false, text: "Nogomet", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/nogomet.mp3" },
      { challengeId: 264, correct: false, text: "Gol!", imageSrc: "/points.svg", audioSrc: "/audio/hr/gol.mp3" },

      { challengeId: 265, correct: true, text: "Nogomet", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/nogomet.mp3" },
      { challengeId: 265, correct: false, text: "Lopta", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/lopta.mp3" },
      { challengeId: 265, correct: false, text: "Pobjeda!", imageSrc: "/points.svg", audioSrc: "/audio/hr/pobjeda.mp3" },

      { challengeId: 266, correct: true, text: "Pobjeda!", imageSrc: "/mascot.svg", audioSrc: "/audio/hr/pobjeda.mp3" },
      { challengeId: 266, correct: false, text: "Gol!", imageSrc: "/mascot_sad.svg", audioSrc: "/audio/hr/gol.mp3" },
      { challengeId: 266, correct: false, text: "Igra", imageSrc: "/points.svg", audioSrc: "/audio/hr/igra.mp3" },

      { challengeId: 267, correct: true, text: "Zabij gol!", audioSrc: "/audio/hr/zabij_gol.mp3" },
      { challengeId: 267, correct: false, text: "Dodaj loptu!", audioSrc: "/audio/hr/dodaj_loptu.mp3" },
      { challengeId: 267, correct: false, text: "Mi smo prvaci!", audioSrc: "/audio/hr/mi_smo_prvaci.mp3" },

      { challengeId: 268, correct: true, text: "Dodaj loptu!", audioSrc: "/audio/hr/dodaj_loptu.mp3" },
      { challengeId: 268, correct: false, text: "Zabij gol!", audioSrc: "/audio/hr/zabij_gol.mp3" },
      { challengeId: 268, correct: false, text: "Bravo!", audioSrc: "/audio/hr/bravo.mp3" },

      { challengeId: 269, correct: true, text: "Mi smo prvaci!", audioSrc: "/audio/hr/mi_smo_prvaci.mp3" },
      { challengeId: 269, correct: false, text: "Dodaj loptu!", audioSrc: "/audio/hr/dodaj_loptu.mp3" },
      { challengeId: 269, correct: false, text: "Bravo!", audioSrc: "/audio/hr/bravo.mp3" },




    ]);

    // Restore existing users and subscriptions
    if (savedUserProgress.length > 0) {
      console.log(`Restoring progress for ${savedUserProgress.length} user(s)...`);
      for (const u of savedUserProgress) {
        await db.insert(schema.userProgress).values({
          ...u,
          activeCourseId: 1,
        });

        // Auto-complete challenges according to their earned XP
        const points = u.points || 0;
        const countToComplete = Math.floor(points / 10);
        if (countToComplete > 0) {
          const allCurriculumChallenges = await db.query.challenges.findMany({
            orderBy: (ch, { asc }) => [asc(ch.id)],
          });
          const sliceToComplete = allCurriculumChallenges.slice(0, countToComplete);
          for (const ch of sliceToComplete) {
            await db.insert(schema.challengeProgress).values({
              userId: u.userId,
              challengeId: ch.id,
              completed: true,
            });
          }
        }
      }
    }

    if (savedSubscriptions.length > 0) {
      for (const s of savedSubscriptions) {
        await db.insert(schema.userSubscription).values(s);
      }
    }

    console.log("Croatian curriculum seeding finished successfully with HD audio! (15 Units, 60 Lessons (including 15 Boss Quests), 269 Challenges)");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  }
};

main();
