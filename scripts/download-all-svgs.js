const https = require('https');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const EMOJI_MAP = {
  // Unit 3: Animals
  'dog.svg': '1f436',
  'cat.svg': '1f431',
  'bird.svg': '1f426',
  'fish.svg': '1f41f',
  'horse.svg': '1f434',
  'cow.svg': '1f42e',
  'pig.svg': '1f437',
  'duck.svg': '1f986',

  // Unit 4: Numbers & Colors
  'one.svg': '31-20e3',
  'two.svg': '32-20e3',
  'three.svg': '33-20e3',
  'four.svg': '34-20e3',
  'five.svg': '35-20e3',
  'six.svg': '36-20e3',
  'seven.svg': '37-20e3',
  'eight.svg': '38-20e3',
  'nine.svg': '39-20e3',
  'ten.svg': '1f51f',
  'red.svg': '1f534',
  'blue.svg': '1f535',
  'green.svg': '1f7e2',
  'yellow.svg': '1f7e1',
  'black.svg': '2b1b',

  // Unit 5: Food & Drink
  'apple.svg': '1f34e',
  'banana.svg': '1f34c',
  'orange.svg': '1f34a',
  'tomato.svg': '1f345',
  'bread.svg': '1f35e',
  'cheese.svg': '1f9c0',
  'milk.svg': '1f95b',
  'water.svg': '1f4a7',
  'juice.svg': '1f9c3',
  'chocolate.svg': '1f36b',
  'ice_cream.svg': '1f366',
  'croissant.svg': '1f950',
  'burek.svg': '1f95f',

  // Unit 6: House & Room
  'house.svg': '1f3e0',
  'room.svg': '1f6cb',
  'bed.svg': '1f6cf',
  'krevet.svg': '1f6cf',
  'table.svg': '1fa91',
  'window.svg': '1fa9f',
  'door.svg': '1f6aa',
  'toy.svg': '1f9f8',
  'ball.svg': '26bd',
  'book.svg': '1f4d6',

  // Unit 7: Body & Face
  'head.svg': '1f9d1',
  'eye.svg': '1f441',
  'ear.svg': '1f442',
  'nose.svg': '1f443',
  'mouth.svg': '1f444',
  'hand.svg': '270b',
  'foot.svg': '1f9b6',
  'hair.svg': '1f9b0',

  // Unit 8: Summer & Adriatic
  'sea.svg': '1f30a',
  'beach.svg': '1f3d6',
  'sun.svg': '2600',
  'sunce.svg': '2600',
  'sunny.svg': '2600',
  'island.svg': '1f3dd',
  'boat.svg': '26f5',
  'swimming.svg': '1f3ca',
  'shell.svg': '1f41a',
  'dolphin.svg': '1f42c',
  'seagull.svg': '1f54a',
  'sand.svg': '1f3d6',

  // Unit 9: Clothes
  'hat.svg': '1f9e2',
  'tshirt.svg': '1f455',
  'pants.svg': '1f456',
  'shoes.svg': '1f45f',
  'jacket.svg': '1f9e5',
  'socks.svg': '1f9e6',
  'dress.svg': '1f457',
  'scarf.svg': '1f9e3',

  // Unit 10: Weather
  'rain.svg': '1f327',
  'wind.svg': '1f4a8',
  'snow.svg': '2744',
  'cloud.svg': '2601',
  'rainbow.svg': '1f308',
  'hot.svg': '1f975',
  'cold.svg': '1f976',

  // Unit 11: Daily Verbs
  'sleep.svg': '1f634',
  'eat.svg': '1f37d',
  'drink.svg': '1f964',
  'study.svg': '1f4da',
  'play.svg': '1f3ae',
  'watch.svg': '1f440',
  'read.svg': '1f4d6',

  // Unit 12: Town, Vehicles & Park
  'car.svg': '1f697',
  'bike.svg': '1f6b2',
  'park.svg': '1f3de',
  'street.svg': '1f6e3',
  'tree.svg': '1f333',
  'grass.svg': '1f33f',
  'slide.svg': '1f6dd',
  'swing.svg': '1f6dd',

  // Unit 13: Prepositions
  'in.svg': '1f4e5',
  'on.svg': '1f51b',
  'under.svg': '2b07',
  'up.svg': '2b06',
  'down.svg': '2b07',
  'here.svg': '1f4cd',
  'there.svg': '1f449',
  'near.svg': '1f50e',

  // Unit 14: Bakery & Store
  'bakery.svg': '1f950',

  // Unit 15: Sports & Celebrations
  'soccer.svg': '26bd',
  'goal.svg': '1f945',
  'trophy.svg': '1f3c6',
  'sing.svg': '1f3a4',
  'music.svg': '1f3b5',
  'song.svg': '1f3b6',
  'art.svg': '1f3a8',

  // Units 16-20 (Stage 4)
  'school.svg': '1f3eb',
  'pencil.svg': '270f',
  'notebook.svg': '1f4d3',
  'backpack.svg': '1f392',
  'vlak.svg': '1f686',
  'avion.svg': '2708',
  'trajekt.svg': '26f4',
  'autobus.svg': '1f68c',
  'karta.svg': '1f3ab',
  'kofer.svg': '1f9f3',
  'kolodvor.svg': '1f689',
  'suma.svg': '1f332',
  'planina.svg': '26f0',
  'rijeka.svg': '1f3de',
  'kamen.svg': '1faa8',
  'medvjed.svg': '1f43b',
  'vuk.svg': '1f43a',
  'jelen.svg': '1f98c',
  'orao.svg': '1f985',
  'kuhinja.svg': '1f373',
  'tanjur.svg': '1f37d',
  'zlica.svg': '1f944',
  'vilica.svg': '1f374',
  'juha.svg': '1f372',
  'rucak.svg': '1f371',
  'dorucak.svg': '1f95e',
  'rodendan.svg': '1f382',
  'torta.svg': '1f370',
  'poklon.svg': '1f381',
  'svjecice.svg': '1f56f',
  'balon.svg': '1f388',
  'ples.svg': '1f483'
};

function downloadSvg(filename, codepoint) {
  return new Promise((resolve, reject) => {
    const dest = path.join(PUBLIC_DIR, filename);
    const url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codepoint}.svg`;

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${filename} (${codepoint}) from ${url}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve(filename);
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log(`Starting download of ${Object.keys(EMOJI_MAP).length} vector SVGs into ${PUBLIC_DIR}...`);

  let count = 0;
  let errors = 0;

  for (const [filename, codepoint] of Object.entries(EMOJI_MAP)) {
    try {
      await downloadSvg(filename, codepoint);
      count++;
      process.stdout.write(`[${count}/${Object.keys(EMOJI_MAP).length}] Downloaded ${filename}\n`);
    } catch (err) {
      console.error(`Error downloading ${filename}:`, err.message);
      errors++;
    }
  }

  console.log(`\nDownload finished! Successfully downloaded: ${count}, Errors: ${errors}`);
}

main();
