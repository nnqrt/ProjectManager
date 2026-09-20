/* ==========================================================================
   Korean Choseong (초성) Search Utility for Political CRM
   Allows ultra-fast searching by Korean initial consonants:
   e.g., "ㄱㅁㅅ" matches "김민수", "ㄱㄷ" matches "상계동", "010" matches phone numbers.
   ========================================================================== */

const CHOSEONG_LIST = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 
  'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

/**
 * Decomposes a Hangul string into its initial consonants (Choseong).
 * Non-Hangul characters (numbers, English, spaces) are kept as-is.
 * @param {string} str 
 * @returns {string} Choseong string
 */
function getChoseong(str) {
  if (!str) return '';
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // Hangul syllables range: 0xAC00 (44032) to 0xD7A3 (55203)
    if (code >= 44032 && code <= 55203) {
      const choseongIndex = Math.floor((code - 44032) / 588);
      result += CHOSEONG_LIST[choseongIndex];
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}

/**
 * Checks if target string matches query (supports normal text, numbers, and Choseong).
 * @param {string} target 
 * @param {string} query 
 * @returns {boolean}
 */
function matchChoseong(target, query) {
  if (!target || !query) return false;

  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return true;

  const cleanTarget = target.toLowerCase();

  // Direct substring match
  if (cleanTarget.includes(cleanQuery)) {
    return true;
  }

  // Choseong match
  const targetChoseong = getChoseong(cleanTarget);
  if (targetChoseong.includes(cleanQuery)) {
    return true;
  }

  return false;
}

// Export for browser script usage
window.ChoseongUtil = {
  getChoseong,
  matchChoseong
};
