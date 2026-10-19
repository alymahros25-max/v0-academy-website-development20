import type { Metadata } from "next"
import countrySeoPlan from "./country-seo-plan.json"

export const COUNTRY_SEO_BASE_URL = "https://quran-elhafez.com"

export type CountrySeoPage = { slug: string; country: string; keyword: string; title: string; description: string; h1: string }
export type CountrySeoPlanDetails = {
  supportingKeywords: readonly string[]
  contentAngle: string
  contextualCities: string
  recommendedInternalLinks: readonly string[]
  localArticleTopic: string
  schemaTypes: readonly string[]
}
export type CompleteCountrySeoPage = CountrySeoPage & CountrySeoPlanDetails

export const countrySeoPages: readonly CountrySeoPage[] = [
  {"slug": "saudi-arabia", "country": "السعودية", "keyword": "تحفيظ القرآن أونلاين في السعودية", "title": "تحفيظ القرآن أونلاين في السعودية | أكاديمية الحافظ المتميز", "description": "حصص فردية أونلاين بالعربية لتحفيظ القرآن ومراجعته وتصحيح التلاوة، مع دروس لتأسيس القراءة والكتابة العربية للطلاب في السعودية.", "h1": "تحفيظ القرآن وتعليم العربية أونلاين في السعودية"},
  {"slug": "united-arab-emirates", "country": "الإمارات العربية المتحدة", "keyword": "تحفيظ القرآن أونلاين في الإمارات", "title": "تحفيظ القرآن أونلاين في الإمارات | أكاديمية الحافظ المتميز", "description": "حصص فردية مباشرة بالعربية لحفظ القرآن ومراجعته وتعلّم التلاوة والتجويد، مع تأسيس القراءة والكتابة بالعربية أونلاين للطلاب في الإمارات.", "h1": "تحفيظ القرآن ومراجعته أونلاين في الإمارات"},
  {"slug": "united-states", "country": "الولايات المتحدة", "keyword": "تحفيظ القرآن أونلاين للعرب في الولايات المتحدة", "title": "تحفيظ القرآن أونلاين للعرب في أمريكا | الحافظ", "description": "حصص فردية مباشرة أونلاين بالعربية لتحفيظ القرآن ومراجعته، مع تصحيح التلاوة ومسار لتأسيس القراءة والكتابة العربية للطلاب في الولايات المتحدة.", "h1": "تحفيظ القرآن ومراجعته أونلاين للعرب في الولايات المتحدة"},
  {"slug": "canada", "country": "كندا", "keyword": "تحفيظ القرآن أونلاين للعرب في كندا", "title": "تحفيظ القرآن أونلاين للعرب في كندا | أكاديمية الحافظ", "description": "حصص فردية مباشرة بالعربية للطلاب العرب في كندا لتحفيظ القرآن ومراجعته وتعلّم التلاوة والتجويد، مع مسار لتأسيس القراءة والكتابة بالعربية.", "h1": "تحفيظ القرآن أونلاين للعرب في كندا"},
  {"slug": "united-kingdom", "country": "المملكة المتحدة", "keyword": "تحفيظ القرآن أونلاين للعرب في المملكة المتحدة", "title": "تحفيظ القرآن أونلاين في المملكة المتحدة", "description": "حصص فردية مباشرة أونلاين بالعربية لحفظ القرآن ومراجعته وتعلّم التلاوة والتجويد، مع دروس تأسيس القراءة والكتابة للطلاب العرب في المملكة المتحدة.", "h1": "تحفيظ القرآن ومراجعته أونلاين للعرب في المملكة المتحدة"},
  {"slug": "australia", "country": "أستراليا", "keyword": "تحفيظ القرآن أونلاين للعرب في أستراليا", "title": "تحفيظ القرآن أونلاين للعرب في أستراليا | حصة فردية بالعربية", "description": "حصص فردية أونلاين بالعربية للعرب في أستراليا لحفظ القرآن ومراجعته وتصحيح التلاوة، مع تأسيس العربية ومواعيد تراعي فرق التوقيت. الحصة الأولى مجانية.", "h1": "حلقة حفظ قرآن خاصة للعرب في أستراليا"},
  {"slug": "germany", "country": "ألمانيا", "keyword": "تحفيظ القرآن أونلاين بالعربية في ألمانيا", "title": "تحفيظ القرآن أونلاين بالعربية في ألمانيا | أكاديمية الحافظ", "description": "حصص فردية مباشرة بالعربية لتحفيظ القرآن ومراجعته والتدرّب على التلاوة والتجويد أونلاين للطلاب في ألمانيا، مع مسار لتأسيس القراءة والكتابة العربية.", "h1": "تحفيظ القرآن ومراجعته أونلاين بالعربية في ألمانيا"},
  {"slug": "kuwait", "country": "الكويت", "keyword": "تحفيظ القرآن أونلاين في الكويت", "title": "تحفيظ القرآن أونلاين في الكويت | للأطفال والكبار بالعربية", "description": "حصص فردية أونلاين في الكويت لتحفيظ القرآن ومراجعته والتجويد، مع تأسيس القراءة والكتابة العربية وحصة تجريبية مجانية.", "h1": "تحفيظ القرآن للأطفال أونلاين في الكويت"},
  {"slug": "qatar", "country": "قطر", "keyword": "تحفيظ القرآن أونلاين في قطر", "title": "تحفيظ القرآن أونلاين في قطر | حصص فردية بالعربية", "description": "حصص قرآن فردية أونلاين بالعربية في قطر للحفظ والمراجعة والتجويد، مع تأسيس العربية ومواعيد مرنة للعائلات. الحصة الأولى مجانية.", "h1": "تحفيظ القرآن أونلاين للعائلات في قطر"},
  {"slug": "oman", "country": "عُمان", "keyword": "تحفيظ القرآن أونلاين في عُمان", "title": "تحفيظ القرآن أونلاين في عُمان | حفظ ومراجعة وتجويد", "description": "تعلم القرآن أونلاين في عُمان بحصص فردية بالعربية للحفظ والمراجعة والتجويد، مع تأسيس القراءة والكتابة. الحصة الأولى مجانية.", "h1": "حفظ القرآن ومراجعته أونلاين في عُمان"},
  {"slug": "jordan", "country": "الأردن", "keyword": "تحفيظ القرآن أونلاين في الأردن", "title": "تحفيظ القرآن أونلاين في الأردن | حفظ ومراجعة وتجويد", "description": "حصص فردية مباشرة بالعربية في الأردن لحفظ القرآن ومراجعته والتجويد أونلاين، مع تأسيس القراءة والكتابة. الحصة الأولى مجانية.", "h1": "تحفيظ القرآن وتجويده أونلاين في الأردن"},
  {"slug": "bahrain", "country": "البحرين", "keyword": "تحفيظ القرآن أونلاين في البحرين", "title": "تحفيظ القرآن أونلاين في البحرين | حصص فردية بالعربية", "description": "حصص فردية أونلاين بالعربية في البحرين لتحفيظ القرآن ومراجعته وتصحيح التلاوة، مع تأسيس العربية ومراجعة أسبوعية. الحصة الأولى مجانية.", "h1": "دروس قرآن فردية أونلاين في البحرين"},
  {"slug": "france", "country": "فرنسا", "keyword": "تحفيظ القرآن أونلاين للعرب في فرنسا", "title": "تحفيظ القرآن أونلاين للعرب في فرنسا | حصة فردية بالعربية", "description": "حصص قرآن فردية أونلاين بالعربية للعرب في فرنسا للحفظ والمراجعة والتجويد، مع تأسيس القراءة والكتابة العربية. الحصة الأولى مجانية.", "h1": "تحفيظ القرآن بالعربية للعرب في فرنسا"},
  {"slug": "spain", "country": "إسبانيا", "keyword": "تحفيظ القرآن أونلاين للعرب في إسبانيا", "title": "تحفيظ القرآن أونلاين للعرب في إسبانيا | حصة فردية بالعربية", "description": "تعلم القرآن أونلاين بالعربية للعرب في إسبانيا عبر حصص فردية للحفظ والمراجعة والتجويد، مع تأسيس القراءة والكتابة. الحصة الأولى مجانية.", "h1": "حفظ القرآن ومراجعته أونلاين في إسبانيا"},
  {"slug": "netherlands", "country": "هولندا", "keyword": "تحفيظ القرآن أونلاين للعرب في هولندا", "title": "تحفيظ القرآن أونلاين للعرب في هولندا | حصة فردية بالعربية", "description": "حصص فردية أونلاين بالعربية للعرب في هولندا لحفظ القرآن ومراجعته والتجويد، مع تأسيس القراءة والكتابة. الحصة الأولى مجانية.", "h1": "دروس قرآن فردية للعرب في هولندا"},
  {"slug": "belgium", "country": "بلجيكا", "keyword": "تحفيظ القرآن أونلاين للعرب في بلجيكا", "title": "تحفيظ القرآن أونلاين للعرب في بلجيكا | حصة فردية بالعربية", "description": "حصص فردية أونلاين بالعربية للأطفال العرب في بلجيكا لحفظ القرآن ومراجعته والتجويد، مع تأسيس القراءة والكتابة العربية.", "h1": "تحفيظ القرآن للأطفال العرب في بلجيكا"},
  {"slug": "sweden", "country": "السويد", "keyword": "تحفيظ القرآن أونلاين للعرب في السويد", "title": "تحفيظ القرآن أونلاين للعرب في السويد | حصة فردية بالعربية", "description": "حصص فردية أونلاين بالعربية للعرب في السويد لحفظ القرآن ومراجعته والتجويد، مع تأسيس العربية ومواعيد تناسب الدراسة.", "h1": "حلقة فردية لحفظ القرآن للعرب في السويد"},
  {"slug": "south-africa", "country": "جنوب أفريقيا", "keyword": "حلقة قرآن فردية للعائلات العربية في جنوب أفريقيا", "title": "تحفيظ القرآن أونلاين بالعربية في جنوب أفريقيا", "description": "تعلم القرآن أونلاين من جنوب أفريقيا في حصص فردية بالعربية للحفظ والمراجعة والتلاوة، مع مسار لتأسيس القراءة والكتابة العربية.", "h1": "حلقة قرآن فردية للعائلات العربية في جنوب أفريقيا"},
  {"slug": "china", "country": "الصين", "keyword": "تحفيظ القرآن أونلاين بالعربية في الصين", "title": "تحفيظ القرآن أونلاين بالعربية في الصين | أكاديمية الحافظ", "description": "حصص فردية أونلاين لتحفيظ القرآن ومراجعته بالعربية في الصين. تعرّف إلى خيارات التعلم المناسبة لهدفك واسأل عن تفاصيل البرنامج والموعد قبل الاختيار.", "h1": "تحفيظ القرآن ومراجعته أونلاين بالعربية في الصين"},
  {"slug": "italy", "country": "إيطاليا", "keyword": "حلقة قرآن فردية للعرب في إيطاليا", "title": "حلقة قرآن فردية للعرب في إيطاليا | أكاديمية الحافظ", "description": "دروس فردية أونلاين بالعربية في إيطاليا لحفظ القرآن ومراجعته والتلاوة والتجويد، مع مسار لتأسيس القراءة والكتابة العربية.", "h1": "حلقة قرآن فردية للعرب في إيطاليا"},
  {"slug": "russia", "country": "روسيا", "keyword": "حلقة تحفيظ قرآن عربية للعرب في روسيا", "title": "حلقة تحفيظ قرآن عربية للعرب في روسيا | أكاديمية الحافظ", "description": "حصص فردية أونلاين بالعربية في روسيا لحفظ القرآن ومراجعته والتلاوة، مع تأسيس القراءة والكتابة العربية ومتابعة الحفظ.", "h1": "حلقة تحفيظ قرآن عربية للعرب في روسيا"},
  {"slug": "norway", "country": "النرويج", "keyword": "حلقة قرآن فردية للعرب في النرويج", "title": "حلقة قرآن فردية للعرب في النرويج | أكاديمية الحافظ", "description": "من النرويج، تعلم القرآن أونلاين في حلقة فردية بالعربية للحفظ والمراجعة والتلاوة، أو ابدأ بتأسيس القراءة والكتابة العربية.", "h1": "حلقة قرآن فردية للعرب في النرويج"},
  {"slug": "austria", "country": "النمسا", "keyword": "تحفيظ القرآن أونلاين للعرب في النمسا", "title": "تحفيظ القرآن أونلاين للعرب في النمسا | حصة فردية بالعربية", "description": "حصص فردية أونلاين بالعربية للعرب في النمسا لحفظ القرآن ومراجعته والتجويد، مع تأسيس القراءة والكتابة العربية.", "h1": "حلقة قرآن فردية للعرب في النمسا"},
  {"slug": "switzerland", "country": "سويسرا", "keyword": "حلقة حفظ قرآن فردية للعرب في سويسرا", "title": "حلقة حفظ قرآن فردية للعرب في سويسرا | أكاديمية الحافظ", "description": "تعلم القرآن أونلاين من سويسرا في حلقات فردية بالعربية للحفظ والمراجعة والتلاوة، مع مسار لتأسيس القراءة والكتابة.", "h1": "حلقة حفظ قرآن فردية للعرب في سويسرا"},
  {"slug": "brazil", "country": "البرازيل", "keyword": "تحفيظ القرآن أونلاين للعرب في البرازيل", "title": "تحفيظ القرآن أونلاين للعرب في البرازيل | أكاديمية الحافظ", "description": "حصص فردية أونلاين بالعربية لتحفيظ القرآن ومراجعته للطلاب في البرازيل، مع مسار لتأسيس القراءة والكتابة العربية والتواصل مع الأكاديمية بالعربية.", "h1": "تحفيظ القرآن ومراجعته أونلاين للعرب في البرازيل"},
  {"slug": "mexico", "country": "المكسيك", "keyword": "حلقة قرآن فردية بالعربية للعرب في المكسيك", "title": "حلقة قرآن فردية بالعربية للعرب في المكسيك | أكاديمية الحافظ", "description": "حصص فردية أونلاين بالعربية في المكسيك لحفظ القرآن ومراجعته والتلاوة والتجويد، مع باقات لتأسيس القراءة والكتابة العربية.", "h1": "حلقة قرآن فردية بالعربية للعرب في المكسيك"},
  {"slug": "colombia", "country": "كولومبيا", "keyword": "حلقة قرآن خاصة بالعربية للعرب في كولومبيا", "title": "حلقة قرآن خاصة بالعربية للعرب في كولومبيا | أكاديمية الحافظ", "description": "تعلم القرآن أونلاين من كولومبيا بحصص فردية بالعربية للحفظ والمراجعة والتلاوة، مع تأسيس القراءة والكتابة العربية.", "h1": "حلقة قرآن خاصة بالعربية للعرب في كولومبيا"},
  {"slug": "venezuela", "country": "فنزويلا", "keyword": "حلقة تحفيظ قرآن فردية للعرب في فنزويلا", "title": "حلقة تحفيظ قرآن فردية للعرب في فنزويلا | أكاديمية الحافظ", "description": "حصص فردية أونلاين بالعربية في فنزويلا لحفظ القرآن ومراجعته والتلاوة، مع مسار تأسيس الحروف والقراءة والكتابة.", "h1": "حلقة تحفيظ قرآن فردية للعرب في فنزويلا"},
  {"slug": "denmark", "country": "الدنمارك", "keyword": "حلقة قرآن فردية بالعربية للعرب في الدنمارك", "title": "حلقة قرآن فردية بالعربية للعرب في الدنمارك | أكاديمية الحافظ", "description": "حصص فردية أونلاين بالعربية في الدنمارك للأطفال والعائلات لحفظ القرآن ومراجعته، مع تأسيس القراءة والكتابة العربية.", "h1": "حلقة قرآن فردية بالعربية للعرب في الدنمارك"},
  {"slug": "greece", "country": "اليونان", "keyword": "حلقة حفظ قرآن خاصة بالعرب في اليونان", "title": "حلقة حفظ قرآن خاصة بالعرب في اليونان | أكاديمية الحافظ", "description": "تعلم القرآن أونلاين من اليونان في حلقات فردية بالعربية للحفظ والمراجعة والتلاوة، مع تأسيس القراءة والكتابة.", "h1": "حلقة حفظ قرآن خاصة بالعرب في اليونان"},
  {"slug": "new-zealand", "country": "نيوزيلندا", "keyword": "حلقة قرآن فردية للعرب في نيوزيلندا", "title": "حلقة قرآن فردية للعرب في نيوزيلندا | أكاديمية الحافظ", "description": "حصص فردية أونلاين بالعربية للعائلات في نيوزيلندا لحفظ القرآن ومراجعته والتلاوة، مع مسار لتأسيس القراءة والكتابة.", "h1": "حلقة قرآن فردية للعرب في نيوزيلندا"},
  {"slug": "finland", "country": "فنلندا", "keyword": "حلقة تحفيظ قرآن فردية للعرب في فنلندا", "title": "حلقة تحفيظ قرآن فردية للعرب في فنلندا | أكاديمية الحافظ", "description": "تعلم القرآن أونلاين من فنلندا بحلقات فردية بالعربية للحفظ والمراجعة والتجويد، مع متابعة منتظمة وتأسيس القراءة والكتابة.", "h1": "حلقة تحفيظ قرآن فردية للعرب في فنلندا"},
  {"slug": "turkey", "country": "تركيا", "keyword": "حلقة قرآن خاصة بالعرب في تركيا", "title": "حلقة قرآن خاصة بالعرب في تركيا | أكاديمية الحافظ", "description": "حصص فردية أونلاين بالعربية في تركيا للأطفال والكبار لحفظ القرآن ومراجعته والتجويد، مع تأسيس القراءة والكتابة العربية.", "h1": "حلقة قرآن خاصة بالعرب في تركيا"},
  {"slug": "indonesia", "country": "إندونيسيا", "keyword": "تحفيظ القرآن أونلاين في إندونيسيا", "title": "تحفيظ القرآن أونلاين في إندونيسيا | أكاديمية الحافظ", "description": "حصص فردية أونلاين بالعربية للطلاب في إندونيسيا لتحفيظ القرآن ومراجعته وتصحيح التلاوة، مع مسار مستقل لتأسيس القراءة والكتابة العربية.", "h1": "تحفيظ القرآن أونلاين للطلاب الناطقين بالعربية في إندونيسيا"},
  {"slug": "malaysia", "country": "ماليزيا", "keyword": "حلقة تحفيظ قرآن فردية للعرب في ماليزيا", "title": "حلقة تحفيظ قرآن فردية للعرب في ماليزيا | أكاديمية الحافظ", "description": "تعلم القرآن أونلاين في ماليزيا بحصص فردية بالعربية للأطفال والعائلات للحفظ والمراجعة، مع تأسيس القراءة والكتابة.", "h1": "حلقة تحفيظ قرآن فردية للعرب في ماليزيا"},
  {"slug": "portugal", "country": "البرتغال", "keyword": "حلقة قرآن فردية بالعربية للعرب في البرتغال", "title": "حلقة قرآن فردية بالعربية للعرب في البرتغال | أكاديمية الحافظ", "description": "حصص فردية أونلاين بالعربية في البرتغال للمبتدئين والعائلات لحفظ القرآن ومراجعته والتلاوة، مع تأسيس القراءة والكتابة.", "h1": "حلقة قرآن فردية بالعربية للعرب في البرتغال"},
  {"slug": "poland", "country": "بولندا", "keyword": "حلقة حفظ قرآن خاصة بالعرب في بولندا", "title": "حلقة حفظ قرآن خاصة بالعرب في بولندا | أكاديمية الحافظ", "description": "تعلم القرآن أونلاين من بولندا بحصص فردية بالعربية للحفظ والمراجعة والتلاوة، مع مسار لتأسيس القراءة والكتابة العربية.", "h1": "حلقة حفظ قرآن خاصة بالعرب في بولندا"},
  {"slug": "argentina", "country": "الأرجنتين", "keyword": "حلقة قرآن فردية بالعربية للعرب في الأرجنتين", "title": "تحفيظ القرآن أونلاين للعرب في الأرجنتين", "description": "حصص فردية أونلاين بالعربية في الأرجنتين لحفظ القرآن ومراجعته والتلاوة والتجويد، مع تأسيس القراءة والكتابة العربية.", "h1": "حلقة قرآن فردية بالعربية للعرب في الأرجنتين"},
  {"slug": "senegal", "country": "السنغال", "keyword": "حلقة تحفيظ قرآن فردية بالعربية في السنغال", "title": "حلقة تحفيظ قرآن فردية بالعربية في السنغال | أكاديمية الحافظ", "description": "تعلم القرآن أونلاين من السنغال في حلقات فردية بالعربية للحفظ والمراجعة والتلاوة، مع تأسيس القراءة والكتابة العربية.", "h1": "حلقة تحفيظ قرآن فردية بالعربية في السنغال"},
  {"slug": "nigeria", "country": "نيجيريا", "keyword": "تحفيظ القرآن أونلاين بالعربية في نيجيريا", "title": "تحفيظ القرآن أونلاين بالعربية في نيجيريا | أكاديمية الحافظ", "description": "حصص فردية أونلاين بالعربية في نيجيريا لتحفيظ القرآن ومراجعته، مع مسار لتأسيس القراءة والكتابة. اذكر هدف الطالب ومستواه.", "h1": "تحفيظ القرآن أونلاين بالعربية للطلاب في نيجيريا"},
] as const

export const countrySeoBySlug: Readonly<Record<string, CompleteCountrySeoPage>> = Object.fromEntries(
  countrySeoPages.map((page) => [page.slug, { ...page, ...countrySeoPlan[page.slug as keyof typeof countrySeoPlan] }]),
)

export function getCountrySeoPlan(slug: string): CompleteCountrySeoPage | undefined {
  return countrySeoBySlug[slug]
}

type SeoContentValue = { content_key: string; content_ar?: string | null }

/** Prefer an explicitly seeded DB SEO snapshot; otherwise preserve the code baseline. */
export function resolveCountrySeoPlan(slug: string, content: readonly SeoContentValue[] = []): CompleteCountrySeoPage | undefined {
  const fallback = getCountrySeoPlan(slug)
  if (!fallback) return undefined
  const value = (key: string) => content.find((item) => item.content_key === `country_seo_v2_${key}`)?.content_ar?.trim() || ""
  const title = value("title")
  const description = value("description")
  const h1 = value("h1")
  const keyword = value("keyword")
  const rawKeywords = value("supporting_keywords")
  if (!title || !description || !h1 || !keyword) return fallback
  let supportingKeywords = fallback.supportingKeywords
  if (rawKeywords) {
    try {
      const parsed: unknown = JSON.parse(rawKeywords)
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) supportingKeywords = parsed
    } catch {
      // An invalid DB keyword payload must never blank otherwise valid metadata.
    }
  }
  return { ...fallback, title, description, h1, keyword, supportingKeywords }
}

export function getCountryWebPageSchema(slug: string) {
  const page = getCountrySeoPlan(slug)
  if (!page) throw new Error(`Missing SEO plan for country: ${slug}`)
  const canonical = `${COUNTRY_SEO_BASE_URL}/${page.slug}`
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: page.title,
    description: page.description,
    inLanguage: "ar",
    keywords: [page.keyword, ...page.supportingKeywords],
  }
}

export function getCountrySchemaGraph(slug: string) {
  const page = getCountrySeoPlan(slug)
  if (!page) throw new Error(`Missing SEO plan for country: ${slug}`)

  const canonical = `${COUNTRY_SEO_BASE_URL}/${page.slug}`
  const organizationId = `${canonical}#organization`
  const graph: Record<string, unknown>[] = [getCountryWebPageSchema(slug)]

  graph.push({
    "@type": "EducationalOrganization",
    "@id": organizationId,
    name: "أكاديمية الحافظ المتميز",
    url: COUNTRY_SEO_BASE_URL,
    areaServed: { "@type": "Country", name: page.country },
  })
  graph.push(
    {
      "@type": "Course",
      name: page.h1,
      provider: { "@id": organizationId },
      inLanguage: "ar",
    },
    {
      "@type": "Course",
      name: `تأسيس العربية أونلاين في ${page.country}`,
      provider: { "@id": organizationId },
      inLanguage: "ar",
    },
  )

  return { "@context": "https://schema.org", "@graph": graph }
}

export function getCountrySeoMetadata(slug: string, canonicalOverride?: string): Metadata {
  const page = getCountrySeoPlan(slug)
  if (!page) throw new Error(`Missing SEO plan for country: ${slug}`)
  return countrySeoPageToMetadata(page, canonicalOverride)
}

export function countrySeoPageToMetadata(page: CompleteCountrySeoPage, canonicalOverride?: string): Metadata {
  const canonical = canonicalOverride ?? `${COUNTRY_SEO_BASE_URL}/${page.slug}`
  return {
    title: page.title,
    description: page.description,
    keywords: [page.keyword, ...page.supportingKeywords],
    alternates: { canonical, languages: { ar: canonical, "x-default": canonical } },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: "أكاديمية الحافظ المتميز",
      type: "website",
      locale: "ar",
      images: [{ url: `${COUNTRY_SEO_BASE_URL}/images/og-default.webp`, width: 1200, height: 630, alt: page.title }],
    },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: [`${COUNTRY_SEO_BASE_URL}/images/og-default.webp`] },
  }
}
