export const logger = {
  info: (...a: any[]) => console.log('[INFO]', ...a),
  warn: (...a: any[]) => console.warn('[WARN]', ...a),
  error: (...a: any[]) => console.error('[ERROR]', ...a),
};