import DropZone from './components/DropZone';
import MusicPlayer from './components/MusicPlayer';
import VideoPlayer from './components/VideoPlayer';
import { useEffect, useState } from 'react';

function App() {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(true);

  useEffect(() => {
    const handleFileSelected = (_event: any, url: string, ext: string) => {
      setFilePath(url);
      switch (ext) {
        case "mp3":
          setIsVideo(false);
          break;
        case "mp4":
          setIsVideo(true);
          break;
        default:
          setIsVideo(false);
          break;
      }
    };

    window.ipcRenderer.on('file-selected', handleFileSelected);

    return () => {
      window.ipcRenderer.removeListener('file-selected', handleFileSelected);
    };

  }, []);

  return (
    <div style={{width:'100%', alignItems:'center', display:'flex', justifyContent:'center'}}>
      {filePath != null ? (
        isVideo ? <VideoPlayer src={filePath} /> : <MusicPlayer src={filePath} />
      ) : (
        <DropZone onFileSelected={(url, isVideo) => { setFilePath(url); setIsVideo(isVideo); }} />
      )}
    </div>

  );
}

export default App;
