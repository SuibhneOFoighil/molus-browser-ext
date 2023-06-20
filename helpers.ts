//HELPER FUNCTIONS
function extractTextBetween(start: string, end:string, str:string): string {
    let startIndex = str.indexOf(start) + start.length;
    let endIndex = str.indexOf(end, startIndex);
    return str.substring(startIndex, endIndex).trim();
  }
  
  function formatTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export {extractTextBetween, formatTimestamp}