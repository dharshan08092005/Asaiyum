import { NextResponse } from "next/server";

const JIKAN_BASE = "https://api.jikan.moe/v4";

// Simple in-memory cache to respect Jikan's rate limits (3 req/sec)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchJikan(path) {
    const cacheKey = path;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    const res = await fetch(`${JIKAN_BASE}${path}`, {
        headers: { Accept: "application/json" },
    });

    if (!res.ok) {
        throw new Error(`Jikan API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
}

// Normalize Jikan anime object to our app's shape
function normalizeAnime(item) {
    return {
        malId: item.mal_id,
        title: item.title || item.title_english || "",
        titleEnglish: item.title_english || "",
        titleJp: item.title_japanese || "",
        synopsis: item.synopsis || "",
        studio:
            item.studios?.map((s) => s.name).join(", ") || "Unknown",
        airDate: item.aired?.from || null,
        status: item.status || "",
        trailerUrl: item.trailer?.url || null,
        posterUrl: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || null,
        genres: [
            ...(item.genres?.map((g) => g.name) || []),
            ...(item.demographics?.map((d) => d.name) || []),
        ],
        themes: item.themes?.map((t) => t.name) || [],
        rating: item.rating || "",
        score: item.score || null,
        scoredBy: item.scored_by || 0,
        rank: item.rank || null,
        popularity: item.popularity || null,
        members: item.members || 0,
        episodes: item.episodes || null,
        duration: item.duration || "",
        type: item.type || "",
        source: item.source || "",
        season: item.season || null,
        year: item.year || null,
    };
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "top";

    try {
        let data;

        switch (action) {
            // Top anime
            case "top": {
                const page = searchParams.get("page") || "1";
                const filter = searchParams.get("filter") || ""; // airing, upcoming, bypopularity, favorite
                const limit = searchParams.get("limit") || "24";
                let path = `/top/anime?page=${page}&limit=${limit}`;
                if (filter) path += `&filter=${filter}`;
                data = await fetchJikan(path);
                break;
            }

            // Search anime
            case "search": {
                const q = searchParams.get("q") || "";
                const page = searchParams.get("page") || "1";
                const limit = searchParams.get("limit") || "24";
                const genres = searchParams.get("genres") || "";
                const orderBy = searchParams.get("order_by") || "score";
                const sort = searchParams.get("sort") || "desc";
                let path = `/anime?page=${page}&limit=${limit}&order_by=${orderBy}&sort=${sort}`;
                if (q) path += `&q=${encodeURIComponent(q)}`;
                if (genres) path += `&genres=${genres}`;
                data = await fetchJikan(path);
                break;
            }

            // Current season
            case "season": {
                const page = searchParams.get("page") || "1";
                const limit = searchParams.get("limit") || "24";
                data = await fetchJikan(`/seasons/now?page=${page}&limit=${limit}`);
                break;
            }

            // Upcoming season
            case "upcoming": {
                const page = searchParams.get("page") || "1";
                const limit = searchParams.get("limit") || "24";
                data = await fetchJikan(
                    `/seasons/upcoming?page=${page}&limit=${limit}`
                );
                break;
            }

            // Single anime details by MAL ID
            case "details": {
                const id = searchParams.get("id");
                if (!id) {
                    return NextResponse.json(
                        { error: "Missing 'id' parameter" },
                        { status: 400 }
                    );
                }
                const [animeData, charsData, recsData] = await Promise.all([
                    fetchJikan(`/anime/${id}/full`),
                    fetchJikan(`/anime/${id}/characters`),
                    fetchJikan(`/anime/${id}/recommendations`),
                ]);
                return NextResponse.json({
                    anime: normalizeAnime(animeData.data),
                    characters: (charsData.data || []).slice(0, 12).map((c) => ({
                        name: c.character?.name || "",
                        image:
                            c.character?.images?.jpg?.image_url || null,
                        role: c.role || "",
                    })),
                    recommendations: (recsData.data || []).slice(0, 8).map((r) => ({
                        malId: r.entry?.mal_id,
                        title: r.entry?.title || "",
                        posterUrl: r.entry?.images?.jpg?.large_image_url || null,
                        votes: r.votes || 0,
                    })),
                });
            }

            // Anime genres list
            case "genres": {
                data = await fetchJikan("/genres/anime");
                return NextResponse.json({
                    genres: (data.data || []).map((g) => ({
                        id: g.mal_id,
                        name: g.name,
                        count: g.count,
                    })),
                });
            }

            default:
                return NextResponse.json(
                    { error: `Unknown action: ${action}` },
                    { status: 400 }
                );
        }

        // Generic response for list endpoints
        return NextResponse.json({
            anime: (data.data || []).map(normalizeAnime),
            pagination: data.pagination || null,
        });
    } catch (error) {
        console.error("Jikan proxy error:", error);
        return NextResponse.json(
            { error: "Failed to fetch anime data. Please try again." },
            { status: 502 }
        );
    }
}
