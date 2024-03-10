import React, { useState, useEffect } from 'react';

interface CustomControlsProps {
  isPlaying: boolean;
  progress: number;
  volume: number;
  isMuted: boolean;
  togglePlayPause: () => void;
  handleVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleMute: () => void;
  toggleFullScreen: () => void;
  isFullScreen: boolean;
  handleProgressClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const CustomControls: React.FC<CustomControlsProps> = ({
  isPlaying,
  progress,
  volume,
  isMuted,
  togglePlayPause,
  handleVolumeChange,
  toggleMute,
  toggleFullScreen,
  isFullScreen,
  handleProgressClick,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    function hideItems() {
      setIsVisible(false);
    }

    function resetTimeout() {
      clearTimeout(timeoutId);
      setIsVisible(true);
      timeoutId = setTimeout(hideItems, 3000);
    }

    const onMouseMove = () => {
      resetTimeout();
    };

    const onKeyPress = () => {
      resetTimeout();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keypress', onKeyPress);

    resetTimeout();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keypress', onKeyPress);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={`controls ${isVisible ? 'visible' : 'hidden'}`}>
      <div onClick={handleProgressClick} className={`progress-bar-empty`}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'blue' }} />
      </div>
      <div className='custom-controls'>
        <div>
          <button onClick={togglePlayPause} style={{ width: '100px' }}>
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
        </div>
        <button onClick={toggleFullScreen}>{isFullScreen ? 'Exit FullScreen' : 'FullScreen'}</button>
      </div>
    </div>
  );
};

export default CustomControls;
