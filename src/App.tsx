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
    <div>
      {
        filePath != null?
          isVideo == true? 
            <VideoPlayer src={filePath!}/>
            : 
            <MusicPlayer src={filePath!}></MusicPlayer>
        : <>Select a file</>
      }
    </div>
  );
}

export default App;
