const TAG_HIERARCHY = {
  anime: {
    Cast: {
      subcategories: {
        'Protagonist': ['Strong Lead', 'Reluctant Hero', 'Anti-Hero', 'Female Protagonist', 'Child Protagonist'],
        'Supporting': ['Love Interest', 'Rival', 'Mentor', 'Comic Relief', 'Sidekick'],
        'Antagonist': ['Villain', 'Anti-Villain', 'Final Boss', 'Organization'],
      },
    },
    Demographic: {
      subcategories: {
        'Age Group': ['Shounen', 'Shoujo', 'Seinen', 'Josei', 'Kodomomuke'],
        'Audience': ['General', 'Adult', 'Family', 'Mature'],
      },
    },
    Setting: {
      subcategories: {
        'Time': ['Historical', 'Modern', 'Futuristic', 'Medieval', 'Fantasy World'],
        'Place': ['School', 'Urban', 'Rural', 'Space', 'Virtual World', 'Post-Apocalyptic'],
        'Themes': ['Slice of Life', 'Military', 'Workplace', 'Travel', 'Survival'],
      },
    },
    Technical: {
      subcategories: {
        'Production': ['TV', 'Movie', 'OVA', 'ONA', 'Special', 'Music Video'],
        'Visual': ['CGI', '2D', '3D', 'Hand-Drawn', 'Stop Motion'],
        'Narrative': ['Episodic', 'Serial', 'Anthology', 'Non-Linear', 'Episodic'],
      },
    },
    Theme: {
      subcategories: {
        'Core': ['Action', 'Adventure', 'Comedy', 'Drama', 'Romance', 'Fantasy', 'Sci-Fi'],
        'Genre Mix': ['Romantic Comedy', 'Action Comedy', 'Dark Fantasy', 'Sci-Fi Fantasy', 'Magical Girl'],
        'Mood': ['Psychological', 'Thriller', 'Horror', 'Mystery', 'Heartwarming', 'Tragedy'],
        'Special Interest': ['Mecha', 'Sports', 'Music', 'Gourmet', 'Idol', 'Harem', 'Ecchi'],
      },
    },
  },
  manga: {
    Cast: {
      subcategories: {
        'Protagonist': ['Strong Lead', 'Reluctant Hero', 'Anti-Hero', 'Female Protagonist', 'Child Protagonist'],
        'Supporting': ['Love Interest', 'Rival', 'Mentor', 'Comic Relief', 'Sidekick'],
        'Antagonist': ['Villain', 'Anti-Villain', 'Final Boss', 'Organization'],
      },
    },
    Demographic: {
      subcategories: {
        'Age Group': ['Shounen', 'Shoujo', 'Seinen', 'Josei', 'Kodomomuke'],
        'Audience': ['General', 'Adult', 'Family', 'Mature'],
      },
    },
    Setting: {
      subcategories: {
        'Time': ['Historical', 'Modern', 'Futuristic', 'Medieval', 'Fantasy World'],
        'Place': ['School', 'Urban', 'Rural', 'Space', 'Virtual World', 'Post-Apocalyptic'],
        'Themes': ['Slice of Life', 'Military', 'Workplace', 'Travel', 'Survival'],
      },
    },
    Technical: {
      subcategories: {
        'Format': ['Manga', 'One-Shot', 'Doujinshi', 'Web Manga', 'Light Novel'],
        'Art Style': ['Detailed', 'Minimalist', 'Realistic', 'Cartoon'],
        'Publishing': ['Serialized', 'Completed', 'Ongoing', 'Hiatus', 'Discontinued'],
      },
    },
    Theme: {
      subcategories: {
        'Core': ['Action', 'Adventure', 'Comedy', 'Drama', 'Romance', 'Fantasy', 'Sci-Fi'],
        'Genre Mix': ['Romantic Comedy', 'Action Comedy', 'Dark Fantasy', 'Sci-Fi Fantasy'],
        'Mood': ['Psychological', 'Thriller', 'Horror', 'Mystery', 'Heartwarming', 'Tragedy'],
        'Special Interest': ['Mecha', 'Sports', 'Music', 'Gourmet', 'Isekai', 'Harem', 'Ecchi'],
      },
    },
  },
};

const tagsController = {
  getTags(req, res) {
    const { mediaType } = req.query;
    const type = mediaType || 'anime';

    const hierarchy = TAG_HIERARCHY[type] || TAG_HIERARCHY.anime;

    res.json({
      data: hierarchy,
      code: 200,
      metadata: { cache: true },
    });
  },
};

module.exports = tagsController;
