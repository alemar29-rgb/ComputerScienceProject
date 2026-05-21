const LASTFM_API_KEY = 'ad9c9901882e2f3ed3c0b99ffa648944';

// --- ARTIST SEARCH ---

// Fetches a list of artists similar to the queried artist using Last.fm,
// then grabs an image for each one from TheAudioDB
async function getSimilarArtists(query) {
    try {
        console.log(`Searching Last.fm for artists similar to: ${query}`);

        // Request similar artists from Last.fm
        const lastFmUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(query)}&api_key=${LASTFM_API_KEY}&format=json&limit=6`;

        const response = await fetch(lastFmUrl);
        if (!response.ok) throw new Error(`Last.fm API error: ${response.status}`);

        const data = await response.json();

        // Bail out early if no similar artists were found
        if (!data.similarartists || !Array.isArray(data.similarartists.artist)) {
            console.warn("No similar artists found.");
            return [];
        }

        const rawArtists = data.similarartists.artist;

        // For each artist, try to fetch a thumbnail from TheAudioDB
        const artistPromises = rawArtists.map(async (artist) => {
            const artistName = artist.name;
            let imageUrl = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300'; // Fallback image

            try {
                // TheAudioDB free-tier API key is '2'
                const audioDbUrl = `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(artistName)}`;
                const dbResponse = await fetch(audioDbUrl);

                if (dbResponse.ok) {
                    const dbData = await dbResponse.json();
                    if (dbData.artists && dbData.artists[0] && dbData.artists[0].strArtistThumb) {
                        imageUrl = dbData.artists[0].strArtistThumb;
                    }
                }
            } catch (imageError) {
                console.error(`Could not fetch image for ${artistName}:`, imageError);
            }

            return {
                name: artistName,
                image: imageUrl
            };
        });

        // Wait for all image requests to finish before returning
        return await Promise.all(artistPromises);

    } catch (error) {
        console.error("Error fetching similar artists:", error);
        return [];
    }
}