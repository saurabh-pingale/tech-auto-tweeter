export function cleanText(text: string): string {
    if (!text) return '';

    const HTML_TAGS_REGEX = /<\/?[^>]+(>|$)/g;
    const URL_REGEX = /https?:\/\/\S+|www\.\S+/g;
    const EMOJI_REGEX = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\u24C2|\uD83E[\uDD00-\uDDFF])/g;
    const HTML_ENTITIES_REGEX = /&[a-z]+;/gi;
    const EXTRA_SPACES_REGEX = /\s+/g; 

    let cleaned = text.replace(HTML_TAGS_REGEX, '');
    cleaned = cleaned.replace(URL_REGEX, '');
    cleaned = cleaned.replace(HTML_ENTITIES_REGEX, '');
    cleaned = cleaned.replace(EMOJI_REGEX, '');
    cleaned = cleaned.replace(EXTRA_SPACES_REGEX, ' ').trim();
    
    return cleaned;
}