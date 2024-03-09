import React, { useRef, useState, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1); // Default volume is 1 (max volume)
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      const currentTime = video ? video.currentTime : 0;
      const duration = video ? video.duration : 0;
      setProgress((currentTime / duration) * 100);
    };

    const handleVolumeChange = () => {
      setVolume(video ? video.volume : 0);
      setIsMuted(video ? video.muted : false);
    };

    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('volumechange', handleVolumeChange);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('volumechange', handleVolumeChange);
      };
    }
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleFullScreen = () => {
    const video = videoRef.current;
    if (video) {
      if (!isFullScreen) {
        video.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
      if (newVolume > 0) {
        video.muted = false;
        setIsMuted(false);
      }
    }
  };
  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (video) {
      const boundingRect = event.currentTarget.getBoundingClientRect();
      const offsetX = event.clientX - boundingRect.left;
      const width = boundingRect.width;
      const percent = offsetX / width;
      const duration = video.duration;
      const newTime = percent * duration;
      video.currentTime = newTime;
    }
  };

  return (
    <div className='media-player'>
      <video
        className='video-player'
        src={src}
        ref={videoRef}
        controls={false}
        onClick={togglePlayPause}
        onDoubleClick={toggleFullScreen}
      />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0, 0, 0, 0.5)', color: '#fff' , width: '100%',}}>
        <div onClick={handleProgressClick} style={{ width: '100%', height: '5px', background: '#fff', marginBottom: '10px' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'blue' }} />
        </div>
        <button onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <input
          type='range'
          min='0'
          max='1'
          step='0.01'
          value={volume}
          onChange={handleVolumeChange}
        />
        <button onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
        <button onClick={toggleFullScreen}>
          Full Screen
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
