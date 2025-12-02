import { useEffect, useState } from 'react';

// Type definitions for YouTube and Vimeo players
interface YouTubePlayer {
  mute: () => void;
  unMute: () => void;
}

interface VimeoPlayer {
  setVolume: (volume: number) => Promise<void>;
  ready: () => Promise<void>;
}

interface WindowWithPlayers extends Window {
  YT?: {
    Player: new (element: HTMLElement | string, config: { events: { onReady: () => void } }) => YouTubePlayer;
  };
  onYouTubeIframeAPIReady?: () => void;
  Vimeo?: {
    Player: new (element: HTMLElement | string) => VimeoPlayer;
  };
}

interface UseEmbeddedVideoPlayerProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  videoType?: 'vimeo' | 'youtube' | 'custom';
  videoUrl?: string;
}

export function useEmbeddedVideoPlayer({
  iframeRef,
  videoType,
  videoUrl
}: UseEmbeddedVideoPlayerProps) {
  const [player, setPlayer] = useState<YouTubePlayer | VimeoPlayer | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!iframeRef.current || !videoType || videoType === 'custom' || !videoUrl) {
      return;
    }

    let cleanup: (() => void) | undefined;

    const initializePlayer = async () => {
      const win = window as unknown as WindowWithPlayers;
      
      if (videoType === 'youtube') {
        // Load YouTube IFrame API
        if (!win.YT) {
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

          await new Promise<void>((resolve) => {
            // Store original callback if it exists
            const originalCallback = win.onYouTubeIframeAPIReady;
            win.onYouTubeIframeAPIReady = () => {
              if (originalCallback) originalCallback();
              resolve();
            };
            // Check if API is already loaded
            const checkInterval = setInterval(() => {
              if (win.YT && win.YT.Player) {
                clearInterval(checkInterval);
                resolve();
              }
            }, 100);
          });
        }

        // Wait for YT to be available and iframe to be ready
        const checkYT = setInterval(() => {
          if (win.YT && win.YT.Player && iframeRef.current) {
            clearInterval(checkYT);
            try {
              const ytPlayer = new win.YT!.Player(iframeRef.current, {
                events: {
                  onReady: () => {
                    setIsReady(true);
                  }
                }
              });
              setPlayer(ytPlayer);
            } catch (error) {
              console.error('Error initializing YouTube player:', error);
            }
          }
        }, 100);

        cleanup = () => clearInterval(checkYT);
      } else if (videoType === 'vimeo') {
        // Load Vimeo Player API
        if (!win.Vimeo) {
          const tag = document.createElement('script');
          tag.src = 'https://player.vimeo.com/api/player.js';
          document.body.appendChild(tag);

          await new Promise<void>((resolve) => {
            const checkVimeo = setInterval(() => {
              if (win.Vimeo) {
                clearInterval(checkVimeo);
                resolve();
              }
            }, 100);
          });
        }

        // Initialize Vimeo player
        if (win.Vimeo && iframeRef.current) {
          try {
            const vimeoPlayer = new win.Vimeo.Player(iframeRef.current);
            vimeoPlayer.ready().then(() => {
              setIsReady(true);
            });
            setPlayer(vimeoPlayer);
          } catch (error) {
            console.error('Error initializing Vimeo player:', error);
          }
        }
      }
    };

    initializePlayer();

    return cleanup;
  }, [iframeRef, videoType, videoUrl]);

  const setMuted = async (muted: boolean) => {
    if (!player || !isReady) return;

    try {
      if (videoType === 'youtube') {
        const ytPlayer = player as YouTubePlayer;
        if (muted) {
          ytPlayer.mute();
        } else {
          ytPlayer.unMute();
        }
      } else if (videoType === 'vimeo') {
        const vimeoPlayer = player as VimeoPlayer;
        await vimeoPlayer.setVolume(muted ? 0 : 1);
      }
    } catch (error) {
      console.error('Error setting mute state:', error);
    }
  };

  return { setMuted, isReady };
}

