'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
//'7079badf29514dec95f16dbdb204068d';
const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
// const REDIRECT_URI = 'http://localhost:3000/spotify-callback';
// const REDIRECT_URI = 'https://partytime-two.vercel.app/spotify-callback';

interface Playlist {
  id: string;
  name: string;
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

export default function StartRoom() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [player, setPlayer] = useState<Window['Spotify']['Player'] | null>(null);
    const [currentTrack, setCurrentTrack] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isDeviceReady, setIsDeviceReady] = useState(false);
    const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (token) {
      setIsAuthenticated(true);
      fetchPlaylists(token);
      initializePlayer(token);
    }
  }, []);

  const handleSpotifyLogin = () => {
    const scope = 'streaming user-read-email user-read-private playlist-read-private playlist-read-collaborative';
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(scope)}`;
  };

  const fetchPlaylists = async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setPlaylists(data.items);
  };

  const initializePlayer = (token: string) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Party Time Player',
        getOAuthToken: (cb: (token: string) => void) => { cb(token); }
      });
  
      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
        setPlayer(player);
        setDeviceId(device_id);
        setIsDeviceReady(true);
      });
  
      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
        setIsDeviceReady(false);
        setDeviceId(null);
      });
  
      player.addListener('player_state_changed', (state: any) => {
        if (state) {
          setCurrentTrack(state.track_window.current_track.name);
          setIsPlaying(!state.paused);
        }
      });
  
      player.connect().then((success: boolean) => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      });
    };
  };

  const startPlayback = async (playlistId: string) => {
    if (!player || !isDeviceReady || !deviceId) {
      console.error('Player not initialized, device not ready, or device ID not available');
      return;
    }
  
    const token = localStorage.getItem('spotify_token');
    if (!token) return;
  
    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ context_uri: `spotify:playlist:${playlistId}` }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      console.log('Playback started for playlist:', playlistId);
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  };

  const togglePlayPause = () => {
    if (player) {
      player.togglePlay();
    }
  };

  const nextTrack = () => {
    if (player) {
      player.nextTrack();
    }
  };

  const previousTrack = () => {
    if (player) {
      player.previousTrack();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Script src="https://sdk.scdn.co/spotify-player.js" />
      <h1 className="text-3xl font-bold mb-8">Start Room</h1>
      {!isAuthenticated ? (
        <button onClick={handleSpotifyLogin} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Connect Spotify Account
        </button>
      ) : (
        <div>
          <h2 className="text-2xl mb-4">Select a Playlist</h2>
          {currentTrack && (
            <div className="text-center">
              <p className="mb-2">Now Playing: {currentTrack}</p>
              <div className="flex justify-center space-x-4">
                <button onClick={previousTrack} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                  Previous
                </button>
                <button onClick={togglePlayPause} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={nextTrack} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                  Next
                </button>
              </div>
            </div>
          )}
          <table className="w-full mb-8">
            <thead>
              <tr>
                <th className="text-left">Playlist Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {playlists.map((playlist) => (
                <tr key={playlist.id}>
                  <td>{playlist.name}</td>
                  <td>
                    <button onClick={() => startPlayback(playlist.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                      Start
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>    
        </div>
      )}
    </div>
  );
}