import React from 'react';

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
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0, 0, 0, 0.5)', color: '#fff', width: '100%', }}>
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
      <button onClick={toggleFullScreen}>{isFullScreen ? 'Exit FullScreen' : 'FullScreen'}</button>
    </div>
  );
};

export default CustomControls;
