import VideoPlayer from './components/VideoPlayer';
import video from './assets/testvideo2.mp4'

function App() {
  return (
    <div className="App">
      <VideoPlayer src={video} />
    </div>
  );
}

export default App;
