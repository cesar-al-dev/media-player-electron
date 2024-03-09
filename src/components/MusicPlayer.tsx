import React, { useRef, useEffect, useState } from 'react';

interface MusicPlayerProps {
  src: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ src }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const isAudioConnectedRef = useRef<boolean>(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const video = audioRef.current;

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
        const video = audioRef.current;
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
        const video = audioRef.current;
        if (video) {
        if (!isFullScreen) {
            video.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        }
    };

    const toggleMute = () => {
        const video = audioRef.current;
        if (video) {
        video.muted = !video.muted;
        setIsMuted(video.muted);
        }
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        const video = audioRef.current;
        if (video) {
        video.volume = newVolume;
        if (newVolume > 0) {
            video.muted = false;
            setIsMuted(false);
        }
        }
    };
    const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const video = audioRef.current;
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

    useEffect(() => {
        const canvas = canvasRef.current!;
        const audio = audioRef.current!;

        const initializeAudio = async () => {
            try {
                let audioContext = audioContextRef.current;
                let analyser = analyserRef.current;
            
                if (!audioContext) {
                    audioContext = new (window.AudioContext)();
                    audioContextRef.current = audioContext;
                }
            
                if (!analyser) {
                    analyser = audioContext.createAnalyser();
                    analyserRef.current = analyser;
                }
            
                const source = audioContext.createMediaElementSource(audio);

                source.disconnect();
                
                source.connect(analyser);
                source.connect(audioContext.destination);
            
                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
            
                const ctx = canvas.getContext('2d')!;
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            
                const draw = () => {
                    animationFrameRef.current = requestAnimationFrame(draw);
                
                    analyser!.getByteFrequencyData(dataArray);
                
                    ctx.fillStyle = 'rgb(0, 0, 0)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                    const barWidth = (canvas.width / bufferLength) * 2.5;
                    let x = 0;
                
                    // Draw bars going upwards
                    ctx.fillStyle = 'rgb(100, 0, 0)';
                    for (let i = 0; i < bufferLength / 2; i++) {
                      const barHeight = dataArray[i];
                
                      ctx.fillRect(x, canvas.height / 2, barWidth, -(barHeight / 2));
                      x += barWidth + 1;
                    }
                
                    // Draw bars going downwards mirroring the top bars vertically
                    x = 0;
                    ctx.fillStyle = 'rgb(0, 100, 0)';
                    for (let i = 0; i < bufferLength / 2; i++) {
                      const barHeight = dataArray[i];
                
                      ctx.fillRect(x, canvas.height / 2, barWidth, barHeight / 2);
                      ctx.fillRect(x, canvas.height / 2, barWidth, -(barHeight / 2));
                      x += barWidth + 1;
                    }
                };
            
                if (!isAudioConnectedRef.current) {
                    isAudioConnectedRef.current = true;
                    draw();
                }
            } catch (error) {
                console.error('Failed to initialize audio:', error);
            }
            
            
            
        };

        initializeAudio();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close().catch((error) => console.error('Failed to close audio context:', error));
            }
        };
    }, [src]);

    return (
        <div style={{height:'80vh'}}>
            <canvas ref={canvasRef} className='media-player'/>
            <audio 
                ref={audioRef} 
                src={src} 
                controls={false} 
                onClick={togglePlayPause}
                className='video-player'
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

export default MusicPlayer;
