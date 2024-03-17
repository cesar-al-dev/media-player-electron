import React, { useRef, useState, useEffect } from 'react';
import CustomControls from './CustomControls';

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

    const handleKeyPress = (ev: KeyboardEvent) => {
      const currentTime = video ? video.currentTime : 0;
      const duration = video ? video.duration : 0;
      switch (ev.key.toLowerCase()) {
        case 'escape':
          if (isFullScreen === true) {
            toggleFullScreen();
          }
          break;

        case ' ':
          togglePlayPause();
          break;

        case 'p':
          togglePlayPause();
          break;
        
        case 'm':
          toggleMute();
          break;

        case 'f':
          toggleFullScreen();
          break;

        case 'arrowup':
          if (video) {
            if (video?.volume + 0.1 >= 1) {
              setVolume(video ? video!.volume = 1 : 0);
            } else {
              setVolume(video? video!.volume = video!.volume + 0.1 : 0);
            }
          }
          break;

        case 'arrowdown':
          if (video) {
            if (video.volume - 0.1 <= 0){
              setVolume(video? video!.volume = 0 : 0);
            } else {
              setVolume(video? video!.volume = video!.volume - 0.1 : 0);
            }
          }
          break;

        case 'arrowright':
          setProgress(((currentTime + 10) / duration) * 100);
          if (video) {
            video!.currentTime = currentTime + 10;
          }
          break;

        case 'arrowleft':
          setProgress(((currentTime - 10) / duration) * 100);
          if (video) {
            video!.currentTime = currentTime - 10;
          }
          break;

        default:
          break;
      }
    }
  
    
    

    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('volumechange', handleVolumeChange);
      document.addEventListener('keydown', handleKeyPress);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('volumechange', handleVolumeChange);
        document.removeEventListener('keydown', handleKeyPress);
      };
    }

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
      console.log(percent, newTime)
      video.currentTime = newTime;
    }
  };

  const toggleFullScreen = () => {
    window.ipcRenderer.send('toggle-fullscreen');
    setIsFullScreen(!isFullScreen);
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
      <CustomControls
        isPlaying={isPlaying}
        progress={progress}
        volume={volume}
        isMuted={isMuted}
        togglePlayPause={togglePlayPause}
        handleVolumeChange={handleVolumeChange}
        toggleMute={toggleMute}
        toggleFullScreen={toggleFullScreen}
        isFullScreen={isFullScreen}
        handleProgressClick={handleProgressClick}
      />
    </div>
  );
};

export default VideoPlayer;
