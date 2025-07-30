export function normalizeDate(dateValue: any): Date {
  if (!dateValue) return new Date(0);
  return typeof dateValue === "number" ? new Date(dateValue * 1000) : dateValue;
}

export function sanitizeTweetText(text: string): string {
  const markdownBoldRegex = /\*\*(.*?)\*\*/g;
  const hashtagNormalizeRegex = /#+(\S+)/g;
  const multipleSpacesRegex = /\s+/g;
  const smartQuotesRegex = /[“”]/g;
  const smartApostrophesRegex = /[‘’]/g;

  return text
    .replace(markdownBoldRegex, '$1')      
    .replace(hashtagNormalizeRegex, '#$1') 
    .replace(multipleSpacesRegex, ' ')     
    .replace(smartQuotesRegex, '"')        
    .replace(smartApostrophesRegex, "'")   
    .trim();
}