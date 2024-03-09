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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile: File = e.dataTransfer.files[0];
    const ext = droppedFile.name.split('.').pop()?.toLowerCase() || '';
    const isVideo = ext === 'mp4';

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      onFileSelected(url, isVideo);
    };
    reader.readAsDataURL(droppedFile);
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
        width: '100vw', // Set width to 100% of viewport width
        height: '200px', // Set height as needed
      }}
    >
      <h2>Drag & Drop File Here</h2>
    </div>
  );
};

export default DropZone;
