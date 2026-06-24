const db = require('../config/database');

const sampleAnime = [
  {
    anilist_id: 1535,
    title: { english: 'Death Note', romaji: 'Death Note' },
    synopsis: 'A high school student discovers a supernatural notebook that allows him to kill anyone whose name he writes in it.',
    genres: ['Mystery', 'Psychological', 'Thriller', 'Supernatural'],
    tags: ['Detective', 'Anti-Hero', 'Psychological', 'Supernatural', 'Shounen'],
    metadata: { episodes: 37, status: 'FINISHED', season: 'Fall', seasonYear: 2006, averageScore: 86, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1079/138100.jpg' },
  },
  {
    anilist_id: 16498,
    title: { english: 'Attack on Titan', romaji: 'Shingeki no Kyojin' },
    synopsis: 'Humans fight for survival against giant humanoid Titans in a post-apocalyptic world.',
    genres: ['Action', 'Drama', 'Fantasy', 'Mystery'],
    tags: ['Military', 'Survival', 'Gore', 'Post-Apocalyptic', 'Shounen'],
    metadata: { episodes: 25, status: 'FINISHED', season: 'Spring', seasonYear: 2013, averageScore: 84, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1000/110531.jpg' },
  },
  {
    anilist_id: 19855,
    title: { english: 'One Punch Man', romaji: 'One Punch Man' },
    synopsis: 'A superhero who can defeat any opponent with a single punch grows bored with his power.',
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    tags: ['Superhero', 'Parody', 'Martial Arts', 'Seinen'],
    metadata: { episodes: 12, status: 'FINISHED', season: 'Fall', seasonYear: 2015, averageScore: 85, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1160/122627.jpg' },
  },
  {
    anilist_id: 5114,
    title: { english: 'Fullmetal Alchemist: Brotherhood', romaji: 'Fullmetal Alchemist: Brotherhood' },
    synopsis: 'Two brothers search for the Philosopher\'s Stone to restore their bodies after a failed alchemical experiment.',
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy'],
    tags: ['Alchemy', 'Military', 'Brotherhood', 'Steampunk', 'Shounen'],
    metadata: { episodes: 64, status: 'FINISHED', season: 'Spring', seasonYear: 2009, averageScore: 90, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg' },
  },
  {
    anilist_id: 21,
    title: { english: 'One Piece', romaji: 'One Piece' },
    synopsis: 'Monkey D. Luffy sets out on a journey to find the legendary One Piece treasure and become the Pirate King.',
    genres: ['Action', 'Adventure', 'Comedy', 'Fantasy'],
    tags: ['Pirates', 'Superpowers', 'Shounen', 'Long Running'],
    metadata: { episodes: 1000, status: 'RELEASING', season: 'Fall', seasonYear: 1999, averageScore: 86, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1244/138851.jpg' },
  },
  {
    anilist_id: 11061,
    title: { english: 'Hunter x Hunter (2011)', romaji: 'Hunter x Hunter (2011)' },
    synopsis: 'A young boy embarks on a journey to become a Hunter and find his missing father.',
    genres: ['Action', 'Adventure', 'Fantasy'],
    tags: ['Superpowers', 'Tournament', 'Shounen', 'Psychological'],
    metadata: { episodes: 148, status: 'FINISHED', season: 'Fall', seasonYear: 2011, averageScore: 88, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1337/99013.jpg' },
  },
  {
    anilist_id: 1735,
    title: { english: 'Naruto Shippuden', romaji: 'Naruto Shippuden' },
    synopsis: 'Naruto Uzumaki returns after training to face the Akatsuki organization and save his friend Sasuke.',
    genres: ['Action', 'Adventure', 'Fantasy'],
    tags: ['Ninja', 'Shounen', 'Martial Arts', 'Long Running'],
    metadata: { episodes: 500, status: 'FINISHED', season: 'Winter', seasonYear: 2007, averageScore: 80, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1565/111305.jpg' },
  },
  {
    anilist_id: 9253,
    title: { english: 'Steins;Gate', romaji: 'Steins;Gate' },
    synopsis: 'A self-proclaimed mad scientist accidentally invents a time machine and must deal with the consequences.',
    genres: ['Sci-Fi', 'Thriller', 'Drama'],
    tags: ['Time Travel', 'Psychological', 'Science', 'Seinen'],
    metadata: { episodes: 24, status: 'FINISHED', season: 'Spring', seasonYear: 2011, averageScore: 90, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1935/127974.jpg' },
  },
  {
    anilist_id: 1,
    title: { english: 'Cowboy Bebop', romaji: 'Cowboy Bebop' },
    synopsis: 'A ragtag crew of bounty hunters travels through space in search of their next big score.',
    genres: ['Action', 'Adventure', 'Drama', 'Sci-Fi'],
    tags: ['Space', 'Noir', 'Bounty Hunters', 'Adult Cast'],
    metadata: { episodes: 26, status: 'FINISHED', season: 'Spring', seasonYear: 1998, averageScore: 86, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1439/93480.jpg' },
  },
  {
    anilist_id: 30230,
    title: { english: 'Mob Psycho 100', romaji: 'Mob Psycho 100' },
    synopsis: 'A psychic middle schooler learns to control his powers while navigating adolescence.',
    genres: ['Action', 'Comedy', 'Supernatural'],
    tags: ['Psychic Powers', 'School', 'Coming of Age', 'Seinen'],
    metadata: { episodes: 12, status: 'FINISHED', season: 'Summer', seasonYear: 2016, averageScore: 86, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1764/138715.jpg' },
  },
  {
    anilist_id: 31240,
    title: { english: 'Re:Zero - Starting Life in Another World', romaji: 'Re:Zero kara Hajimeru Isekai Seikatsu' },
    synopsis: 'A boy transported to a fantasy world discovers he has the power to return from death.',
    genres: ['Drama', 'Fantasy', 'Thriller', 'Psychological'],
    tags: ['Isekai', 'Time Loop', 'Psychological', 'Suffering'],
    metadata: { episodes: 25, status: 'FINISHED', season: 'Spring', seasonYear: 2016, averageScore: 82, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1441/122795.jpg' },
  },
  {
    anilist_id: 11757,
    title: { english: 'Sword Art Online', romaji: 'Sword Art Online' },
    synopsis: 'Players trapped in a virtual reality MMORPG must clear 100 floors to escape.',
    genres: ['Action', 'Adventure', 'Fantasy', 'Romance'],
    tags: ['Virtual Reality', 'Game', 'Isekai', 'Romance'],
    metadata: { episodes: 25, status: 'FINISHED', season: 'Summer', seasonYear: 2012, averageScore: 75, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1680/122002.jpg' },
  },
  {
    anilist_id: 289,
    title: { english: 'Gurren Lagann', romaji: 'Tengen Toppa Gurren Lagann' },
    synopsis: 'Two boys from an underground village rise to fight against the Spiral King with their giant mecha.',
    genres: ['Action', 'Adventure', 'Comedy', 'Mecha', 'Sci-Fi'],
    tags: ['Mecha', 'Coming of Age', 'Hot Blooded', 'Epic'],
    metadata: { episodes: 27, status: 'FINISHED', season: 'Spring', seasonYear: 2007, averageScore: 84, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1770/145976.jpg' },
  },
  {
    anilist_id: 20583,
    title: { english: 'Haikyuu!!', romaji: 'Haikyuu!!' },
    synopsis: 'A short boy with a towering passion for volleyball joins his high school team.',
    genres: ['Comedy', 'Drama', 'Sports'],
    tags: ['Volleyball', 'School', 'Team Sports', 'Shounen'],
    metadata: { episodes: 25, status: 'FINISHED', season: 'Spring', seasonYear: 2014, averageScore: 83, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1940/141949.jpg' },
  },
  {
    anilist_id: 32281,
    title: { english: 'Your Lie in April', romaji: 'Shigatsu wa Kimi no Uso' },
    synopsis: 'A piano prodigy rediscovers his love for music with the help of a free-spirited violinist.',
    genres: ['Drama', 'Music', 'Romance'],
    tags: ['Music', 'School', 'Tragedy', 'Coming of Age'],
    metadata: { episodes: 22, status: 'FINISHED', season: 'Fall', seasonYear: 2014, averageScore: 87, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1408/127281.jpg' },
  },
  {
    anilist_id: 37987,
    title: { english: 'Violet Evergarden', romaji: 'Violet Evergarden' },
    synopsis: 'A former soldier becomes an Auto Memory Doll, writing letters to help others express their emotions.',
    genres: ['Drama', 'Fantasy', 'Slice of Life'],
    tags: ['Emotional', 'Post-War', 'Letters', 'Character Growth'],
    metadata: { episodes: 13, status: 'FINISHED', season: 'Winter', seasonYear: 2018, averageScore: 87, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1795/115089.jpg' },
  },
  {
    anilist_id: 20910,
    title: { english: 'Food Wars! Shokugeki no Soma', romaji: 'Shokugeki no Soma' },
    synopsis: 'A young chef battles in high-stakes cooking competitions at a prestigious culinary academy.',
    genres: ['Comedy', 'Ecchi', 'Gourmet'],
    tags: ['Cooking', 'School', 'Shounen', 'Competition'],
    metadata: { episodes: 24, status: 'FINISHED', season: 'Spring', seasonYear: 2015, averageScore: 80, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1171/135736.jpg' },
  },
  {
    anilist_id: 99473,
    title: { english: 'Jujutsu Kaisen', romaji: 'Jujutsu Kaisen' },
    synopsis: 'A boy swallows a cursed finger and joins a secret organization of sorcerers to fight curses.',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    tags: ['Curses', 'Sorcery', 'Shounen', 'School'],
    metadata: { episodes: 24, status: 'FINISHED', season: 'Fall', seasonYear: 2020, averageScore: 87, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1171/138044.jpg' },
  },
  {
    anilist_id: 113415,
    title: { english: 'Chainsaw Man', romaji: 'Chainsaw Man' },
    synopsis: 'A young man merges with his pet devil and becomes a Devil Hunter for a public safety organization.',
    genres: ['Action', 'Fantasy', 'Horror'],
    tags: ['Devils', 'Gore', 'Shounen', 'Dark Fantasy'],
    metadata: { episodes: 12, status: 'FINISHED', season: 'Fall', seasonYear: 2022, averageScore: 85, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1793/117610.jpg' },
  },
  {
    anilist_id: 101922,
    title: { english: 'Demon Slayer: Kimetsu no Yaiba', romaji: 'Kimetsu no Yaiba' },
    synopsis: 'A young boy becomes a demon slayer to avenge his family and cure his sister who has been turned into a demon.',
    genres: ['Action', 'Fantasy', 'Drama'],
    tags: ['Demons', 'Historical', 'Shounen', 'Martial Arts'],
    metadata: { episodes: 26, status: 'FINISHED', season: 'Spring', seasonYear: 2019, averageScore: 85, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg' },
  },
  {
    anilist_id: 101571,
    title: { english: 'Kaguya-sama: Love Is War', romaji: 'Kaguya-sama wa Kokurasetai' },
    synopsis: 'Two genius student council members engage in psychological warfare to make the other confess their love.',
    genres: ['Comedy', 'Romance'],
    tags: ['School', 'Psychological', 'Romantic Comedy', 'Seinen'],
    metadata: { episodes: 12, status: 'FINISHED', season: 'Winter', seasonYear: 2019, averageScore: 84, format: 'TV', image_url: 'https://cdn.myanimelist.net/images/anime/1764/138715.jpg' },
  },
];

const sampleManga = [
  {
    anilist_id: 30001,
    title: { english: 'Berserk', romaji: 'Berserk' },
    synopsis: 'A lone mercenary named Guts fights his way through a dark medieval world filled with demons.',
    genres: ['Action', 'Adventure', 'Fantasy', 'Horror'],
    tags: ['Dark Fantasy', 'Seinen', 'Medieval', 'Gore', 'Anti-Hero'],
    metadata: { chapters: 373, status: 'RELEASING', averageScore: 92, format: 'MANGA', image_url: 'https://cdn.myanimelist.net/images/manga/1/157931.jpg' },
  },
  {
    anilist_id: 30117,
    title: { english: 'Vagabond', romaji: 'Vagabond' },
    synopsis: 'The legendary samurai Miyamoto Musashi seeks to become the strongest swordsman in Japan.',
    genres: ['Action', 'Adventure', 'Drama', 'Historical'],
    tags: ['Samurai', 'Historical', 'Seinen', 'Martial Arts', 'Character Growth'],
    metadata: { chapters: 327, status: 'DISCONTINUED', averageScore: 91, format: 'MANGA', image_url: 'https://cdn.myanimelist.net/images/manga/1/157031.jpg' },
  },
  {
    anilist_id: 30205,
    title: { english: 'Monster', romaji: 'Monster' },
    synopsis: 'A brilliant neurosurgeon pursues a dangerous former patient across Germany.',
    genres: ['Drama', 'Mystery', 'Psychological', 'Thriller'],
    tags: ['Psychological', 'Medical', 'Seinen', 'Suspense'],
    metadata: { chapters: 162, status: 'FINISHED', averageScore: 89, format: 'MANGA', image_url: 'https://cdn.myanimelist.net/images/manga/3/54525.jpg' },
  },
  {
    anilist_id: 30414,
    title: { english: 'Oyasumi Punpun', romaji: 'Oyasumi Punpun' },
    synopsis: 'A bleak coming-of-age story following a boy named Punpun through his life struggles.',
    genres: ['Drama', 'Psychological', 'Slice of Life'],
    tags: ['Psychological', 'Seinen', 'Coming of Age', 'Tragedy'],
    metadata: { chapters: 147, status: 'FINISHED', averageScore: 87, format: 'MANGA', image_url: 'https://cdn.myanimelist.net/images/manga/3/164420.jpg' },
  },
  {
    anilist_id: 30016,
    title: { english: 'Vinland Saga', romaji: 'Vinland Saga' },
    synopsis: 'A young Viking seeks revenge against the man who killed his father.',
    genres: ['Action', 'Adventure', 'Drama', 'Historical'],
    tags: ['Vikings', 'Historical', 'Seinen', 'Revenge', 'Character Growth'],
    metadata: { chapters: 200, status: 'RELEASING', averageScore: 90, format: 'MANGA', image_url: 'https://cdn.myanimelist.net/images/manga/2/188835.jpg' },
  },
];

async function seed() {
  console.log('Seeding database with sample data...');
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('DELETE FROM media_cache');

    // Insert anime
    for (const anime of sampleAnime) {
      await client.query(
        `INSERT INTO media_cache (anilist_id, media_type, title, synopsis, genres, tags, metadata)
         VALUES ($1, 'anime', $2, $3, $4, $5, $6)
         ON CONFLICT (anilist_id, media_type) DO NOTHING`,
        [anime.anilist_id, JSON.stringify(anime.title), anime.synopsis, anime.genres, anime.tags, JSON.stringify(anime.metadata)]
      );
    }

    // Insert manga
    for (const manga of sampleManga) {
      await client.query(
        `INSERT INTO media_cache (anilist_id, media_type, title, synopsis, genres, tags, metadata)
         VALUES ($1, 'manga', $2, $3, $4, $5, $6)
         ON CONFLICT (anilist_id, media_type) DO NOTHING`,
        [manga.anilist_id, JSON.stringify(manga.title), manga.synopsis, manga.genres, manga.tags, JSON.stringify(manga.metadata)]
      );
    }

    await client.query('COMMIT');
    console.log(`Seeded ${sampleAnime.length} anime and ${sampleManga.length} manga entries.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await db.pool.end();
  }
}

seed();
