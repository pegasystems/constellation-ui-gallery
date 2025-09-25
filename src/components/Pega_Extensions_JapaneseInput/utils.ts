export const convertHiraganaToKatakana = (str: string) => {
  return str.replace(/[\u3041-\u3096]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) + 0x60);
  });
};

export const fullWidthToHalfWidth = (str: string): string => {
  str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) - 0xfee0);
  });
  // prettier-ignore
  const kanaMap: Record<string, string> = {
    ガ: 'ｶﾞ', ギ: 'ｷﾞ', グ: 'ｸﾞ', ゲ: 'ｹﾞ', ゴ: 'ｺﾞ',
    ザ: 'ｻﾞ', ジ: 'ｼﾞ', ズ: 'ｽﾞ', ゼ: 'ｾﾞ', ゾ: 'ｿﾞ',
    ダ: 'ﾀﾞ', ヂ: 'ﾁﾞ', ヅ: 'ﾂﾞ', デ: 'ﾃﾞ', ド: 'ﾄﾞ',
    バ: 'ﾊﾞ', ビ: 'ﾋﾞ', ブ: 'ﾌﾞ', ベ: 'ﾍﾞ', ボ: 'ﾎﾞ',
    パ: 'ﾊﾟ', ピ: 'ﾋﾟ', プ: 'ﾌﾟ', ペ: 'ﾍﾟ', ポ: 'ﾎﾟ',
    ヴ: 'ｳﾞ', ヷ: 'ﾜﾞ', ヺ: 'ｦﾞ',
    ア: 'ｱ', イ: 'ｲ', ウ: 'ｳ', エ: 'ｴ', オ: 'ｵ',
    カ: 'ｶ', キ: 'ｷ', ク: 'ｸ', ケ: 'ｹ', コ: 'ｺ',
    サ: 'ｻ', シ: 'ｼ', ス: 'ｽ', セ: 'ｾ', ソ: 'ｿ',
    タ: 'ﾀ', チ: 'ﾁ', ツ: 'ﾂ', テ: 'ﾃ', ト: 'ﾄ',
    ナ: 'ﾅ', ニ: 'ﾆ', ヌ: 'ﾇ', ネ: 'ﾈ', ノ: 'ﾉ',
    ハ: 'ﾊ', ヒ: 'ﾋ', フ: 'ﾌ', ヘ: 'ﾍ', ホ: 'ﾎ',
    マ: 'ﾏ', ミ: 'ﾐ', ム: 'ﾑ', メ: 'ﾒ', モ: 'ﾓ',
    ヤ: 'ﾔ', ユ: 'ﾕ', ヨ: 'ﾖ',
    ラ: 'ﾗ', リ: 'ﾘ', ル: 'ﾙ', レ: 'ﾚ', ロ: 'ﾛ',
    ワ: 'ﾜ', ヲ: 'ｦ', ン: 'ﾝ',
    ァ: 'ｧ', ィ: 'ｨ', ゥ: 'ｩ', ェ: 'ｪ', ォ: 'ｫ',
    ッ: 'ｯ', ャ: 'ｬ', ュ: 'ｭ', ョ: 'ｮ',
    '。': '｡', '、': '､', ー: 'ｰ', '「': '｢', '」': '｣', '・': '･'
  };
  const reg = new RegExp(`(${Object.keys(kanaMap).join('|')})`, 'g');
  return str
    .replace(reg, (match) => {
      return kanaMap[match];
    })
    .replace(/゛/g, 'ﾞ')
    .replace(/゜/g, 'ﾟ');
};

const toHalfDigits = (s: string): string =>
  s.replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xff10 + 0x30));

const toFullDigits = (s: string): string =>
  s.replace(/\d/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x30 + 0xff10));

export const convertGregorianToJapaneseEra = (str: string): string => {
  const regex = /([\d０-９]+)年(?:\s*([\d０-９]+)月(?:\s*([\d０-９]+)日)?)?/;
  return str.replace(regex, (match, yearStr, monthStr, dayStr) => {
    const isYearFull = /[０-９]/.test(yearStr);

    const gregYear = parseInt(toHalfDigits(yearStr), 10);
    if (Number.isNaN(gregYear)) return match;

    let gregMonth: number;
    let gregDay: number;
    if (monthStr !== undefined) {
      gregMonth = parseInt(toHalfDigits(monthStr), 10);
      if (Number.isNaN(gregMonth)) return match;
    } else {
      gregMonth = 12;
    }
    if (dayStr !== undefined) {
      gregDay = parseInt(toHalfDigits(dayStr), 10);
      if (Number.isNaN(gregDay)) return match;
    } else if (monthStr !== undefined) {
      gregDay = new Date(gregYear, gregMonth, 0).getDate();
    } else {
      gregDay = 31;
    }
    const inputDate = new Date(gregYear, gregMonth - 1, gregDay);

    const eras = [
      { era: '令和', start: new Date(2019, 4, 1) },
      { era: '平成', start: new Date(1989, 0, 8) },
      { era: '昭和', start: new Date(1926, 11, 25) },
      { era: '大正', start: new Date(1912, 6, 30) },
      { era: '明治', start: new Date(1868, 0, 25) },
    ];

    const selectedEra = eras.find((eraData) => inputDate >= eraData.start);
    if (!selectedEra) return match;

    const eraYear = gregYear - selectedEra.start.getFullYear() + 1;
    let eraYearStr: string;
    if (eraYear === 1) {
      eraYearStr = '元';
    } else {
      eraYearStr = isYearFull ? toFullDigits(eraYear.toString()) : eraYear.toString();
    }

    let result = `${selectedEra.era}${eraYearStr}年`;
    if (monthStr !== undefined) result += `${monthStr}月`;
    if (dayStr !== undefined) result += `${dayStr}日`;

    return result;
  });
};

export const convertJapaneseEraToGregorian = (str: string): string => {
  return str.replace(/(明治|大正|昭和|平成|令和)(元|[\d０-９]+)年/, (match, era, yearStr) => {
    const eraStartYears: { [key: string]: number } = {
      令和: 2019,
      平成: 1989,
      昭和: 1926,
      大正: 1912,
      明治: 1868,
    };
    const startYear = eraStartYears[era];
    if (!startYear) return match;

    const eraYearNumber = yearStr === '元' ? 1 : parseInt(toHalfDigits(yearStr), 10);

    const gregYear = startYear + eraYearNumber - 1;
    const isFullWidth = /[０-９]/.test(yearStr);
    const formattedYear = isFullWidth ? toFullDigits(gregYear.toString()) : gregYear.toString();

    return `${formattedYear}年`;
  });
};
