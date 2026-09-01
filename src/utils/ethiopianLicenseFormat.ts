import { TradingLicenseApplication } from '../types';

export interface EthiopianDate {
  day: number;
  month: number;
  year: number;
  formatted: string;
}

/**
 * Converts a Gregorian date string (YYYY-MM-DD) to Ethiopian Calendar (E.C.)
 * Uses the exact astronomical Julian Day Number (JDN) formula.
 * E.g., May 24, 2023 -> Ginbot 16, 2015 (16/9/2015)
 */
export function toEthiopianDate(gregorianStr?: string): EthiopianDate {
  if (!gregorianStr) {
    return { day: 16, month: 9, year: 2015, formatted: '16/9/2015' };
  }

  const d = new Date(gregorianStr);
  if (isNaN(d.getTime())) {
    return { day: 16, month: 9, year: 2015, formatted: '16/9/2015' };
  }

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  // Julian day number calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // JDN of Ethiopian calendar epoch
  const r = (jdn - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const ethYear =
    4 * Math.floor((jdn - 1723856) / 1461) +
    Math.floor(r / 365) -
    Math.floor(r / 1460);
  const ethMonth = Math.floor(n / 30) + 1;
  const ethDay = (n % 30) + 1;

  return {
    day: ethDay,
    month: ethMonth,
    year: ethYear,
    formatted: `${ethDay}/${ethMonth}/${ethYear}`,
  };
}

/**
 * Format Gregorian date as M/D/YYYY (e.g. 5/24/2023) to match reference document
 */
export function formatGregorianDate(gregorianStr?: string): string {
  if (!gregorianStr) return '5/24/2023';
  const d = new Date(gregorianStr);
  if (isNaN(d.getTime())) return gregorianStr;
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

const SUBCITY_AMHARIC: Record<string, string> = {
  kirkos: 'ቂርቆስ',
  bole: 'ቦሌ',
  arada: 'አራዳ',
  yeka: 'የካ',
  lideta: 'ልደታ',
  'addis ketema': 'አዲስ ከተማ',
  gullele: 'ጉለሌ',
  'kolfe keranio': 'ኮልፌ ቀራኒዮ',
  kolfe: 'ኮልፌ',
  'nifas silk-lafto': 'ንፋስ ስልክ ላፍቶ',
  'nifas silk': 'ንፋስ ስልክ',
  'akaky kaliti': 'አቃቂ ቃሊቲ',
  'akaki kality': 'አቃቂ ቃሊቲ',
  akaki: 'አቃቂ',
  'lemi kura': 'ለሚ ኩራ',
};

const REGION_AMHARIC: Record<string, string> = {
  'addis ababa': 'አዲስ አበባ',
  oromia: 'ኦሮሚያ',
  amhara: 'አማራ',
  sidama: 'ሲዳማ',
  'dire dawa': 'ድሬዳዋ',
  tigray: 'ትግራይ',
  somali: 'ሶማሌ',
  afar: 'አፋር',
  harari: 'ሐረሪ',
};

export function getSubCityAmharic(subCity?: string): string {
  if (!subCity) return 'ቂርቆስ';
  const key = subCity.trim().toLowerCase();
  return SUBCITY_AMHARIC[key] || subCity;
}

export function getRegionAmharic(region?: string): string {
  if (!region) return 'አዲስ አበባ';
  const key = region.trim().toLowerCase();
  return REGION_AMHARIC[key] || region;
}

/**
 * Name transliterations for demo applicants and companies
 */
const NAME_MAP: Record<string, string> = {
  'eyob derebay yemer': 'አቶ እዮብ ደርቤ ይመር',
  'eyob derebay': 'አቶ እዮብ ደርቤ ይመር',
  'abebe kebede': 'አቶ አበበ ከበደ',
  'sarah jenkins': 'ወ/ሪት ሳራ ጄንኪንስ',
  'meseret alemu': 'ወ/ሮ መሰረት አለሙ',
  'dawit haile': 'ዳዊት ኃይሌ',
  'officer dawit haile': 'ዳዊት ኃይሌ',
  'tigist debebe': 'ትግስት ደበበ',
  'officer tigist debebe': 'ትግስት ደበበ',
  'ትግስት ደበበ (officer tigist debebe)': 'ትግስት ደበበ',
  'y m e d trading plc': 'ዋይ ኤም ኢ ዲ ትሬዲንግ ኃላ/የተ/የግ/ማህበር',
  'ymed trading plc': 'ዋይ ኤም ኢ ዲ ትሬዲንግ ኃላ/የተ/የግ/ማህበር',
  'abay import & wholesale trading': 'አባይ አስመጪ እና ጅምላ ንግድ',
  'horizon agritech solutions plc': 'ሆራይዘን አግሪቴክ ሶሉሽንስ ኃላ/የተ/የግ/ማህበር',
  'habesha foods & beverage distribution': 'ሐበሻ ምግብና መጠጥ አከፋፋይ ኃላ/የተ/የግ/ማህበር',
};

export function getAmharicName(name?: string): string {
  if (!name) return 'አቶ እዮብ ደርቤ ይመር';
  const clean = name.trim().toLowerCase();
  if (NAME_MAP[clean]) return NAME_MAP[clean];
  return name;
}

export function getAmharicHonorific(gender: string, name: string): string {
  const am = getAmharicName(name);
  if (am.startsWith('አቶ ') || am.startsWith('ወ/ሮ ') || am.startsWith('ወ/ሪት ')) {
    return am;
  }
  const prefix = gender === 'Female' ? 'ወ/ሮ ' : 'አቶ ';
  return `${prefix}${am}`;
}

export function getEnglishHonorific(gender: string, name: string): string {
  if (name.startsWith('Mr. ') || name.startsWith('Ms. ') || name.startsWith('Mrs. ')) {
    return name;
  }
  const prefix = gender === 'Female' ? 'Ms. ' : 'Mr. ';
  return `${prefix}${name.toUpperCase()}`;
}

/**
 * Returns officer display name in Amharic and English
 */
export function getOfficerNames(assignedOfficerName?: string): { amharic: string; english: string } {
  if (!assignedOfficerName) {
    return { amharic: 'ትግስት ደበበ', english: 'Tigist Debebe' };
  }
  const clean = assignedOfficerName.toLowerCase();
  if (clean.includes('tigist') || clean.includes('ትግስት')) {
    return { amharic: 'ትግስት ደበበ', english: 'Tigist Debebe' };
  }
  if (clean.includes('dawit') || clean.includes('ዳዊት')) {
    return { amharic: 'ዳዊት ኃይሌ', english: 'Dawit Haile' };
  }
  return {
    amharic: getAmharicName(assignedOfficerName),
    english: assignedOfficerName.replace(/^(Officer|አቶ|ወ\/ሮ)\s+/i, '').trim(),
  };
}

/**
 * Returns authentic Amharic + English field of business strings
 */
export function getFieldOfBusiness(app: TradingLicenseApplication): {
  code: string;
  amharic: string;
  english: string;
} {
  const activity = app.businessActivity || '';
  const sector = app.businessSector || '';

  if (
    app.tradeName.toLowerCase().includes('y m e d') ||
    app.tradeName.toLowerCase().includes('ymed')
  ) {
    return {
      code: '(65711)(65711)',
      amharic:
        '(65711)(65711)ለኢንዱስትሪ፣ለግብርና ለኮንስትራክሽን እና ከሌሎች ስራዎች ጋር የተያያዙ መሳሪያዎችና መገልገያዎች አስመጪነት',
      english:
        '(65711)(65711)Import trade in industrial, agricultural and construction machineries, and other related works',
    };
  }

  if (
    activity.toLowerCase().includes('agriculture') ||
    sector.toLowerCase().includes('agriculture') ||
    app.tradeName.toLowerCase().includes('horizon')
  ) {
    return {
      code: '(65312)(65312)',
      amharic:
        '(65312)(65312)የዘመናዊ ግብርና ቴክኖሎጂ መሣሪያዎች አቅርቦት እና ተዛማጅ የሙያ ምክር አገልግሎት',
      english:
        '(65312)(65312)Supply of precision agriculture equipment, drone survey services and agricultural advisory works',
    };
  }

  if (
    activity.toLowerCase().includes('machin') ||
    activity.toLowerCase().includes('industrial') ||
    activity.toLowerCase().includes('construction machineries')
  ) {
    return {
      code: '(65711)(65711)',
      amharic:
        '(65711)(65711)ለኢንዱስትሪ፣ለግብርና ለኮንስትራክሽን እና ከሌሎች ስራዎች ጋር የተያያዙ መሳሪያዎችና መገልገያዎች አስመጪነት',
      english:
        '(65711)(65711)Import trade in industrial, agricultural and construction machineries, and other related works',
    };
  }

  if (
    activity.toLowerCase().includes('cement') ||
    activity.toLowerCase().includes('steel') ||
    activity.toLowerCase().includes('hardware')
  ) {
    return {
      code: '(65711)(65711)',
      amharic: '(65711)(65711)የኮንስትራክሽን ዕቃዎች፣ የብረትና ሲሚንቶ ጅምላ ንግድ እና ሌሎች ተዛማጅ ስራዎች',
      english:
        '(65711)(65711)Import trade and wholesale distribution of construction materials, steel and cement, and other related works',
    };
  }

  return {
    code: '(65711)(65711)',
    amharic: `(65711)(65711)${activity}`,
    english: `(65711)(65711)${activity}`,
  };
}

/**
 * Formats official business license number matching Addis Ababa trade registry format
 */
export function formatOfficialLicenseNo(app: TradingLicenseApplication, ethYear: number): string {
  if (app.licenseNumber && app.licenseNumber.includes('AA/ADISM')) {
    return app.licenseNumber;
  }
  const serial = (app.referenceNumber.replace(/[^0-9]/g, '') + '4464972').slice(0, 7);
  return `AA/ADISM/14/706/${serial}/${ethYear}`;
}

export function formatPrincipalRegNo(app: TradingLicenseApplication, ethYear: number): string {
  if (app.tradeNameRegistrationNo && app.tradeNameRegistrationNo.includes('AA/ADISM')) {
    return app.tradeNameRegistrationNo;
  }
  const regSerial = (app.referenceNumber.replace(/[^0-9]/g, '') + '0002516').slice(0, 7);
  return `AA/ADISM/2/${regSerial}/${ethYear}`;
}
