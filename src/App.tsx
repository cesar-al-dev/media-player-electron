import VideoPlayer from './components/VideoPlayer';
import { useEffect, useState } from 'react';

function App() {
  const [filePath, setFilePath] = useState<string | null>(null);

  useEffect(() => {
    const handleFileSelected = (_event: any, path: string) => {
      setFilePath(path);
    };

    window.ipcRenderer.on('file-selected', handleFileSelected);

    return () => {
      window.ipcRenderer.removeListener('file-selected', handleFileSelected);
    };

  }, []);

  return (
    <div className="App">
      <VideoPlayer src={filePath!} />
    </div>
  );
}

export default App;
