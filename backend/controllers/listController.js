const { AppError } = require('../middleware');

const ANILIST_API = 'https://graphql.anilist.co';

const FETCH_USER_LIST_QUERY = `
  query ($username: String, $type: MediaType) {
    MediaListCollection(userName: $username, type: $type) {
      lists {
        name
        entries {
          media {
            id
            title { romaji english }
            format
            status
            genres
            averageScore
            episodes
            chapters
            coverImage { large }
          }
          status
          score
          progress
        }
      }
    }
  }
`;

async function fetchFromAniList(username, type) {
  const response = await fetch(ANILIST_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      query: FETCH_USER_LIST_QUERY,
      variables: { username, type: type.toUpperCase() },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new AppError(
      error.message || `AniList API returned status ${response.status}`,
      response.status
    );
  }

  return response.json();
}

async function fetchFromMyAnimeList(_username) {
  // MyAnimeList API v2 requires OAuth, so we return a helpful error for now
  throw new AppError(
    'MyAnimeList integration requires OAuth setup. Use AniList for now.',
    501
  );
}

const listController = {
  async fetchList(req, res, next) {
    try {
      const { provider } = req.params;
      const { profileId, refresh: _refresh } = req.query;

      if (!profileId) {
        throw new AppError('profileId query parameter is required.', 400);
      }

      let data;
      switch (provider.toLowerCase()) {
        case 'anilist':
          data = await fetchFromAniList(profileId, refresh || 'anime');
          break;
        case 'myanimelist':
          data = await fetchFromMyAnimeList(profileId);
          break;
        default:
          throw new AppError('Unsupported provider. Use "anilist" or "myanimelist".', 400);
      }

      res.json({
        data,
        code: 200,
        metadata: { cache: false, provider, profileName: profileId },
      });
    } catch (err) {
      next(err);
    }
  },

  async syncList(req, res, next) {
    try {
      const { provider } = req.params;
      const { profileId } = req.body;

      if (!profileId) {
        throw new AppError('profileId is required in request body.', 400);
      }

      // For now, just return a confirmation that sync would happen
      res.json({
        data: {
          message: `Sync initiated for ${provider} profile "${profileId}".`,
          status: 'pending',
          provider,
        },
        code: 200,
        metadata: { cache: false },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = listController;
