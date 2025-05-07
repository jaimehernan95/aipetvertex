export function formatTextForSpeech(text) {
    function numberToWords(num) {
      const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
      const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
      const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
      if (num === 0) return 'zero';
      let words = [];
      if (num >= 1000) {
        const thousands = Math.floor(num / 1000);
        words.push(numberToWords(thousands) + ' thousand');
        num %= 1000;
      }
      if (num >= 100) {
        words.push(units[Math.floor(num / 100)] + ' hundred');
        num %= 100;
      }
      if (num >= 10 && num < 20) {
        words.push(teens[num - 10]);
      } else if (num >= 20) {
        words.push(tens[Math.floor(num / 10)]);
        num %= 10;
      }
      if (num > 0 && num < 10) {
        words.push(units[num]);
      }
      return words.join(' ');
    }
  
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const parts = text.split(urlRegex);
  
    const countryMap = {
      US: "United States",
      USA: "United States",
      CA: "Canada",
      UK: "United Kingdom",
      NY: "New York",
      TX: "Texas",
      Canada: "Canada",
      "United States": "United States",
      "United Kingdom": "United Kingdom"
    };
  
    const abbreviationMap = {
      US: "U.S.",
      USA: "U.S.A.",
      UK: "U.K.",
      CA: "Canada"
    };
  
    const countryKeys = Object.keys(countryMap);
    const countryPairRegex = new RegExp(`\\b(${countryKeys.join('|')})\\b\\s*/\\s*\\b(${countryKeys.join('|')})\\b`, 'gi');
  
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 1) continue;
  
      let cleaned = parts[i]
        // Handle "$5000/year"
        .replace(/\$([0-9,]+)\s*(\/|per)\s*year/gi, (_, num, sep) => {
          const value = parseInt(num.replace(/,/g, ''), 10);
          return `${numberToWords(value)} dollars ${sep === '/' ? 'a year' : 'per year'}`;
        })
        // Handle "$400"
        .replace(/\$([0-9,]+)/g, (_, num) => {
          return `${numberToWords(parseInt(num.replace(/,/g, ''), 10))} dollars`;
        })
        // Handle country/country -> Country and Country
        .replace(countryPairRegex, (_, p1, p2) => {
          const c1 = countryMap[p1] || p1;
          const c2 = countryMap[p2] || p2;
          return `${c1} and ${c2}`;
        })
        // Replace "and/or"
        .replace(/and\/or/gi, 'and or')
        // Replace general word/word with "slash"
        .replace(/(\b[\w-]+\b)\s*\/\s*(\b[\w-]+\b)/gi, '$1 slash $2')
        // Expand abbreviations
        .replace(
          new RegExp(`\\b(${Object.keys(abbreviationMap).join('|')})\\b`, 'gi'),
          (match) => abbreviationMap[match.toUpperCase()] || match
        );
  
      parts[i] = cleaned;
    }
  
    return parts.join('');
  }
  