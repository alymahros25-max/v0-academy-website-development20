export type CountryPageRegistryEntry = {
  href: string
  label: string
  flag: string
  renderer: "static-route"
  migrationStatus: "baseline"
}

/**
 * Single source of truth for the public country landing routes.
 * Keep URLs stable while individual pages migrate to the central renderer.
 */
export const countryPageRegistry = [
  { href: "/saudi-arabia", label: "تحفيظ القرآن والعربية في السعودية", flag: "🇸🇦" },
  { href: "/united-arab-emirates", label: "تحفيظ القرآن والعربية في الإمارات", flag: "🇦🇪" },
  { href: "/united-states", label: "تحفيظ القرآن والعربية في الولايات المتحدة", flag: "🇺🇸" },
  { href: "/canada", label: "تحفيظ القرآن والعربية في كندا", flag: "🇨🇦" },
  { href: "/united-kingdom", label: "تحفيظ القرآن والعربية في المملكة المتحدة", flag: "🇬🇧" },
  { href: "/australia", label: "تحفيظ القرآن والعربية في أستراليا", flag: "🇦🇺" },
  { href: "/germany", label: "تحفيظ القرآن والعربية في ألمانيا", flag: "🇩🇪" },
  { href: "/kuwait", label: "تحفيظ القرآن والعربية في الكويت", flag: "🇰🇼" },
  { href: "/qatar", label: "تحفيظ القرآن والعربية في قطر", flag: "🇶🇦" },
  { href: "/oman", label: "تحفيظ القرآن والعربية في عُمان", flag: "🇴🇲" },
  { href: "/jordan", label: "تحفيظ القرآن والعربية في الأردن", flag: "🇯🇴" },
  { href: "/bahrain", label: "تحفيظ القرآن والعربية في البحرين", flag: "🇧🇭" },
  { href: "/france", label: "تحفيظ القرآن والعربية في فرنسا", flag: "🇫🇷" },
  { href: "/spain", label: "تحفيظ القرآن والعربية في إسبانيا", flag: "🇪🇸" },
  { href: "/netherlands", label: "تحفيظ القرآن والعربية في هولندا", flag: "🇳🇱" },
  { href: "/belgium", label: "تحفيظ القرآن والعربية في بلجيكا", flag: "🇧🇪" },
  { href: "/sweden", label: "تحفيظ القرآن والعربية في السويد", flag: "🇸🇪" },
  { href: "/south-africa", label: "تحفيظ القرآن والعربية في جنوب أفريقيا", flag: "🇿🇦" },
  { href: "/china", label: "تحفيظ القرآن والعربية في الصين", flag: "🇨🇳" },
  { href: "/italy", label: "تحفيظ القرآن والعربية في إيطاليا", flag: "🇮🇹" },
  { href: "/russia", label: "تحفيظ القرآن والعربية في روسيا", flag: "🇷🇺" },
  { href: "/norway", label: "تحفيظ القرآن والعربية في النرويج", flag: "🇳🇴" },
  { href: "/austria", label: "تحفيظ القرآن والعربية في النمسا", flag: "🇦🇹" },
  { href: "/switzerland", label: "تحفيظ القرآن والعربية في سويسرا", flag: "🇨🇭" },
  { href: "/brazil", label: "تحفيظ القرآن والعربية في البرازيل", flag: "🇧🇷" },
  { href: "/mexico", label: "تحفيظ القرآن والعربية في المكسيك", flag: "🇲🇽" },
  { href: "/colombia", label: "تحفيظ القرآن والعربية في كولومبيا", flag: "🇨🇴" },
  { href: "/venezuela", label: "تحفيظ القرآن والعربية في فنزويلا", flag: "🇻🇪" },
  { href: "/denmark", label: "تحفيظ القرآن والعربية في الدنمارك", flag: "🇩🇰" },
  { href: "/greece", label: "تحفيظ القرآن والعربية في اليونان", flag: "🇬🇷" },
  { href: "/new-zealand", label: "تحفيظ القرآن والعربية في نيوزيلندا", flag: "🇳🇿" },
  { href: "/finland", label: "تحفيظ القرآن والعربية في فنلندا", flag: "🇫🇮" },
  { href: "/turkey", label: "تحفيظ القرآن والعربية في تركيا", flag: "🇹🇷" },
  { href: "/indonesia", label: "تحفيظ القرآن والعربية في إندونيسيا", flag: "🇮🇩" },
  { href: "/malaysia", label: "تحفيظ القرآن والعربية في ماليزيا", flag: "🇲🇾" },
  { href: "/portugal", label: "تحفيظ القرآن والعربية في البرتغال", flag: "🇵🇹" },
  { href: "/poland", label: "تحفيظ القرآن والعربية في بولندا", flag: "🇵🇱" },
  { href: "/argentina", label: "تحفيظ القرآن والعربية في الأرجنتين", flag: "🇦🇷" },
  { href: "/senegal", label: "تحفيظ القرآن والعربية في السنغال", flag: "🇸🇳" },
  { href: "/nigeria", label: "تحفيظ القرآن والعربية في نيجيريا", flag: "🇳🇬" },
].map((country) => ({
  ...country,
  renderer: "static-route" as const,
  migrationStatus: "baseline" as const,
})) satisfies readonly CountryPageRegistryEntry[]

export const countryPages = countryPageRegistry
