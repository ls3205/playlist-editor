interface TopArtistsDataReturn {
    href: string;
    items: Artist[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
}

interface Artist {
    external_urls: {
        spotify: string;
    };
    followers: {
        href: string;
        total: number;
    };
    genres: string[];
    href: string;
    id: string;
    images: SpotifyImage[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
}

interface SpotifyImage {
    url: string;
    height: number;
    width: number;
}

interface TopTracksDataReturn {
    href: string;
    items: Song[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
}

interface TrackArtists {
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    name: string
    type: string
    uri: string
}

interface Song {
    album: {
        album_type: string
        total_tracks: number
        available_markets: string[]
        external_urls: {
            spotify: string
        }
        href: string
        id: string
        images: SpotifyImage[]
        name: string
        release_date: string
        release_date_precision: string
        type: string
        uri: string
        artists: TrackArtists[]
    }
    artists: TrackArtists[]
    available_markets: string[]
    disc_number: number
    explicit: boolean
    external_ids: {
        isrc: string
    }
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    name: string
    popularity: number
    preview_url: string
    track_number: number
    type: string
    uri: string
    is_local: boolean
    duration_ms: number
}

interface RecentlyPlayedTrack {
    track: Song
    played_at: string
    context: {
        type: string
        href: string
        external_urls: {
            spotify: string
        }
        uri: string
    }
}

interface RecentlyPlayedDataReturn {
    href: string
    limit: number
    next: string
    cursors: {
        after: string
        before: string
    }
    total: number
    items: RecentlyPlayedTrack[]
}

interface UserProfileReturnData {
    country: string
    display_name: string
    explicit_content: {
        filter_enabled: false
        filter_locked: false
    }
    external_urls: {
        spotify: string
    }
    followers: {
        href: string
        total: number
    }
    href: string
    id: string
    images: SpotifyImage[]
    product: string
    type: string
    uri: string
}

interface PlayerStateReturnData {
    device: {
        id: string
        is_active: boolean
        is_private_session: boolean
        is_restricted: boolean
        name: string
        type: string
        volume_percent: number
        supports_volume: boolean
    }
    repeat_state: string
    shuffle_state: boolean
    context: {
        type: string
        href: string
        external_urls: {
            spotify: string
        }
        uri: string
    }
    timestamp: number
    progress_ms: number
    is_playing: boolean
    item: Song
    actions: {
        currently_playing_type: string
        interrupting_playback: boolean
        pausing: boolean
        resuming: boolean
        seeking: boolean
        skipping_next: boolean
        skipping_prev: boolean
        toggling_repeat_context: boolean
        toggling_shuffle: boolean
        toggling_repeat_track: boolean
        transferring_playback: boolean
    }
}

interface GetUserPlaylistsReturn {
    href: string,
    limit: number,
    next: string,
    offset: number,
    previous: string,
    total: number,
    items: SimplifiedPlaylist[]
}

interface Playlist {
    collaborative: boolean,
    description: string,
    external_urls: {
        spotify: string
    },
    followers: {
        href: string;
        total: number;
    },
    href: string,
    id: string,
    images: SpotifyImage[],
    name: string,
    owner: {
        external_urls: {
            spotify: string,
        },
        followers: {
            href: string;
            total: number;
        },
        id: string,
        type: "user",
        uri: string,
        display_name?: string
    },
    public: boolean,
    snapshot_id: string,
    tracks: {
        href: string,
        limit: number,
        next: string,
        offset: number,
        previous: string,
        total: number,
        items: PlaylistTrackObject[]
    }
}

interface PlaylistTrackObject {
    added_at: string,
    added_by: {
        external_urls: {
            spotify: string,
        },
        followers: {
            href: string;
            total: number;
        },
        id: string,
        type: "user",
        uri: string,
    }
    is_local: boolean,
    track: Song
}

interface SimplifiedPlaylist {
    collaborative: boolean,
    description: string,
    external_urls: {
        spotify: string
    },
    href: string,
    id: string,
    images: SpotifyImage[],
    name: string,
    owner: {
        external_urls: {
            spotify: string,
        },
        followers: {
            href: string;
            total: number;
        },
        id: string,
        type: "user",
        uri: string,
        display_name?: string
    },
    public: boolean,
    snapshot_id: string,
    tracks: {
        href: string,
        total: number
    },
    type: "playlist",
    uri: string
}

interface GetPlaylistSongsReturn {
    href: string,
    limit: number,
    next?: string,
    offset: number,
    previous?: string,
    total: string,
    items: PlaylistTrackObject[]
}