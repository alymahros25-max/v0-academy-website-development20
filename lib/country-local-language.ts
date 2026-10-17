export type CountryLocalLanguage = {
  localCountryName: string
  localLanguagePhrase?: string
}

const localCountryLanguageBySlug: Record<string, CountryLocalLanguage> = {
  "saudi-arabia": { localCountryName: "السعودية" },
  "united-arab-emirates": { localCountryName: "الإمارات العربية المتحدة" },
  "united-states": {
    localCountryName: "United States",
    localLanguagePhrase: "Online Quran classes for Arabic-speaking families in the United States.",
  },
  canada: {
    localCountryName: "Canada",
    localLanguagePhrase: "Online Quran classes for Arabic-speaking families in Canada.",
  },
  "united-kingdom": {
    localCountryName: "United Kingdom",
    localLanguagePhrase: "Online Quran classes for Arabic-speaking families in the United Kingdom.",
  },
  australia: {
    localCountryName: "Australia",
    localLanguagePhrase: "Online Quran classes for Arabic-speaking families in Australia.",
  },
  austria: {
    localCountryName: "Österreich",
    localLanguagePhrase: "Online-Koranunterricht für arabischsprachige Familien in Österreich.",
  },
  germany: {
    localCountryName: "Deutschland",
    localLanguagePhrase: "Online-Koranunterricht für arabischsprachige Familien in Deutschland.",
  },
  kuwait: { localCountryName: "الكويت" },
  qatar: { localCountryName: "قطر" },
  oman: { localCountryName: "عُمان" },
  jordan: { localCountryName: "الأردن" },
  bahrain: { localCountryName: "البحرين" },
  france: {
    localCountryName: "France",
    localLanguagePhrase: "Cours de Coran en ligne pour les familles arabophones en France.",
  },
  spain: {
    localCountryName: "España",
    localLanguagePhrase: "Clases de Corán en línea para familias arabófonas en España.",
  },
  netherlands: {
    localCountryName: "Nederland",
    localLanguagePhrase: "Online Koranlessen voor Arabischtalige gezinnen in Nederland.",
  },
  belgium: {
    localCountryName: "Belgique",
    localLanguagePhrase: "Cours de Coran en ligne pour les familles arabophones en Belgique.",
  },
  sweden: {
    localCountryName: "Sverige",
    localLanguagePhrase: "Online Koranundervisning för arabisktalande familjer i Sverige.",
  },
  "south-africa": {
    localCountryName: "South Africa",
    localLanguagePhrase: "Online Quran classes for Arabic-speaking families in South Africa.",
  },
  china: {
    localCountryName: "中国",
    localLanguagePhrase: "为阿拉伯语家庭提供在线古兰经课程。",
  },
  italy: {
    localCountryName: "Italia",
    localLanguagePhrase: "Lezioni del Corano online per famiglie arabofone in Italia.",
  },
  russia: {
    localCountryName: "Россия",
    localLanguagePhrase: "Онлайн-занятия по Корану для арабоязычных семей в России.",
  },
  norway: {
    localCountryName: "Norge",
    localLanguagePhrase: "Nettbasert koranundervisning for arabisktalende familier i Norge.",
  },
  denmark: {
    localCountryName: "Danmark",
    localLanguagePhrase: "Online koranundervisning for arabisktalende familier i Danmark.",
  },
  greece: {
    localCountryName: "Ελλάδα",
    localLanguagePhrase: "Διαδικτυακά μαθήματα Κορανίου για αραβόφωνες οικογένειες στην Ελλάδα.",
  },
  "new-zealand": {
    localCountryName: "New Zealand",
    localLanguagePhrase: "Online Quran classes for Arabic-speaking families in New Zealand.",
  },
  finland: {
    localCountryName: "Suomi",
    localLanguagePhrase: "Koraanin verkko-opetusta arabiankielisille perheille Suomessa.",
  },
  turkey: {
    localCountryName: "Türkiye",
    localLanguagePhrase: "Türkiye'deki Arapça konuşan aileler için çevrim içi Kur'an dersleri.",
  },
  indonesia: {
    localCountryName: "Indonesia",
    localLanguagePhrase: "Kelas Al-Qur'an online untuk keluarga berbahasa Arab di Indonesia.",
  },
  malaysia: {
    localCountryName: "Malaysia",
    localLanguagePhrase: "Kelas al-Quran dalam talian untuk keluarga berbahasa Arab di Malaysia.",
  },
  portugal: {
    localCountryName: "Portugal",
    localLanguagePhrase: "Aulas de Alcorão online para famílias arabófonas em Portugal.",
  },
  poland: {
    localCountryName: "Polska",
    localLanguagePhrase: "Internetowe lekcje Koranu dla rodzin arabskojęzycznych w Polsce.",
  },
  argentina: {
    localCountryName: "Argentina",
    localLanguagePhrase: "Clases de Corán en línea para familias arabófonas en Argentina.",
  },
  senegal: {
    localCountryName: "Sénégal",
    localLanguagePhrase: "Cours de Coran en ligne pour les familles arabophones au Sénégal.",
  },
  nigeria: {
    localCountryName: "Nigeria",
    localLanguagePhrase: "Online Quran classes for Arabic-speaking families in Nigeria.",
  },
  mexico: {
    localCountryName: "México",
    localLanguagePhrase: "Clases de Corán en línea para familias arabófonas en México.",
  },
  brazil: {
    localCountryName: "Brasil",
    localLanguagePhrase: "Aulas de Alcorão online para famílias arabófonas no Brasil.",
  },
  colombia: {
    localCountryName: "Colombia",
    localLanguagePhrase: "Clases de Corán en línea para familias arabófonas en Colombia.",
  },
  venezuela: {
    localCountryName: "Venezuela",
    localLanguagePhrase: "Clases de Corán en línea para familias arabófonas en Venezuela.",
  },
  switzerland: {
    localCountryName: "Schweiz",
    localLanguagePhrase: "Online-Koranunterricht für arabischsprachige Familien in der Schweiz.",
  },
}

export function getCountryLocalLanguage(slug: string): CountryLocalLanguage {
  return localCountryLanguageBySlug[slug] ?? { localCountryName: slug }
}

export const countryLocalLanguageSlugs = Object.keys(localCountryLanguageBySlug)
