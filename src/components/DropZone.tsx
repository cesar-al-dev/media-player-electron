import React, { useState } from 'react';

interface DropZoneProps {
  onFileSelected: (url: string, isVideo: boolean) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileSelected }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>): Promise<void> => {
    e.preventDefault();
    setIsDragging(false);
  
    const droppedFile: File = e.dataTransfer.files[0];
    const ext = droppedFile.name.split('.').pop()?.toLowerCase() || '';
    const supportedVideoExtensions = ['mp4', 'webm', 'ogg'];
  
    const isVideo = supportedVideoExtensions.includes(ext);
  
    const reader = new FileReader();
    await new Promise<void>((resolve, reject) => {
      reader.onload = (event) => {
        const url = event.target?.result as string;
        onFileSelected(url, isVideo);
        resolve();
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(droppedFile);
    });
  };
  

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: isDragging ? '2px dashed blue' : '2px solid black',
        padding: '20px',
        textAlign: 'center',
        alignItems:'center',
        justifyContent:'center',
        width: '80vh',
        height: '50vh',
        display:'flex',
      }}
    >
      <h2>Drag & Drop File Here</h2>
    </div>
  );
};

export default DropZone;
