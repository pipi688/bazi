<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const stage = ref<'question' | 'result'>('question')
const currentStep = ref(0)
const totalSteps = 11
const selections = reactive<Record<string, string | string[]>>({})

interface RootData {
  状态: string
  化解: string
}

const db: Record<string, any> = {
  '没有夫妻星': '命局中无正官、七杀（女命）或无正财、偏财（男命），说明命主与婚姻缘分较薄，异性缘差，需要大运流年引动才可能出现婚姻机会。',
  '夫妻星的强弱': {
    '夫妻星强-喜神': '夫妻星旺且为喜用神，配偶能力强、对你有助益。婚姻是你人生的重要助力。',
    '夫妻星强-忌神': '夫妻星旺且为忌神，配偶对你消耗大、控制欲强。婚姻是你人生的主要压力源。',
    '夫妻星弱-喜神': '夫妻星弱且为喜用神，配偶本是贵人但力量不足。需大运流年帮扶才能显现。',
    '夫妻星弱-忌神': '夫妻星弱且为忌神，配偶对你影响有限。婚姻关系平淡、存在感弱。'
  },
  '夫妻星的位置': {
    '夫妻星在年干': '夫妻星出现在年干，说明早婚概率大，或配偶来自远方、外地。',
    '夫妻星在年支': '夫妻星在年支，配偶家庭背景可能较好，或婚姻关系受长辈影响较大。',
    '夫妻星在月干': '夫妻星在月干，配偶与你的社交圈、工作环境密切相关。',
    '夫妻星在月支': '夫妻星在月支，配偶可能通过朋友、同事介绍认识。',
    '夫妻星在日支': '夫妻星坐于日支（夫妻宫），夫妻星与夫妻宫同位，婚姻关系紧密。',
    '夫妻星在时干': '夫妻星在时干，晚婚概率大，或再婚时遇到的对象。',
    '夫妻星在时支': '夫妻星在时支，晚婚或晚育后才稳定婚姻关系。',
    '夫妻星不显': '命局中不见夫妻星，婚姻缘分薄，需大运流年引动才出现。',
    '夫妻星与日主相合/相克': '夫妻星与日主相合，关系亲密；相克则关系紧张、冲突多。'
  },
  '夫妻宫的喜忌': {
    '夫妻宫为喜': '夫妻宫为喜用神，婚姻是你人生的加分项，配偶和家庭对你有助益。',
    '夫妻宫为忌': '夫妻宫为忌神，婚姻是你人生的减分项，配偶和家庭可能成为你的负担。'
  },
  '夫妻宫是否被引动': {
    '夫妻宫被冲': '夫妻宫被冲，婚姻不稳定，容易分居、冷战甚至分离。逢冲之年往往是婚姻变动的关键期。',
    '夫妻宫被害': '夫妻宫被害，婚姻关系中有暗伤，双方互相消耗，容易冷战内耗。',
    '夫妻宫被刑': '夫妻宫被刑，婚姻中有纠缠不清的矛盾，容易翻旧账、反复争吵。',
    '夫妻宫被合': '夫妻宫被合，配偶的心可能被外面的人或事吸引，注意力不在家庭上。',
    '被年支合绊': '被年支合绊，原生家庭/长辈牵制了你的婚姻，如父母干涉择偶或婚后仍依赖父母。',
    '被月支合绊': '被月支合绊，事业/社交圈牵制了你的婚姻，忙于工作社交而忽略家庭。',
    '被时支合绊': '被时支合绊，子女/未来规划牵制了你的婚姻，如为子女牺牲或对未来顾虑太多。',
    '夫妻宫没有被引动': '夫妻宫安静没有被引动，婚姻关系稳定，没有大的波动。'
  },
  '夫妻宫坐着谁': {
    '印星旺-喜神': '配偶温柔顾家，像母亲一样照顾你，给你安全感和精神依靠。',
    '印星旺-忌神': '配偶过度依赖你或控制你，像被妈管一样窒息，缺乏独立空间。',
    '印星弱-喜神': '配偶愿意照顾你但能力有限，需要你更多支持和理解。',
    '印星弱-忌神': '配偶想依靠你但自身问题多，反而成为你的负担。',
    '食伤旺-喜神': '配偶聪明有才华，生活有趣，你们之间交流愉快。',
    '食伤旺-忌神': '配偶太作、情绪化、嘴毒，吵架时句句扎心。',
    '食伤弱-喜神': '配偶有才华但不够自信表达，需要你鼓励。',
    '食伤弱-忌神': '配偶内心有想法但不敢说，容易积怨成疾。',
    '比劫旺-喜神': '配偶独立有主见，是你可以并肩作战的伙伴。',
    '比劫旺-忌神': '配偶固执强势，吵架互不相让，容易两败俱伤。',
    '比劫弱-喜神': '配偶愿意配合你但缺乏主见，需要你多拿主意。',
    '比劫弱-忌神': '配偶优柔寡断，遇事退缩，关键时刻靠不住。',
    '财星旺-喜神': '配偶务实会赚钱，物质基础好，给你实实在在的安全感。',
    '财星旺-忌神': '配偶过于看重金钱物质，婚姻中斤斤计较。',
    '财星弱-喜神': '配偶有理财意识但能力有限，需要共同奋斗。',
    '财星弱-忌神': '配偶在金钱上对你有消耗，容易因钱产生矛盾。',
    '官杀旺-喜神': '配偶有责任感、有担当，给你规则和秩序感。',
    '官杀旺-忌神': '配偶控制欲极强，像被监视一样，窒息感严重。',
    '官杀弱-喜神': '配偶有责任心但魄力不足，需要你适当主导。',
    '官杀弱-忌神': '配偶缺乏担当，遇事逃避，你被迫承担一切。'
  },
  '日支藏干的十神': {
    '官杀': '你在亲密关系中渴望被保护和引导，容易把伴侣当成权威人物或"保护伞"。',
    '财星': '你在亲密关系中看重现实保障，把伴侣当成"财神爷"和生活依靠。',
    '印星': '你在亲密关系中容易产生依赖，把伴侣当成"妈"或精神避风港。',
    '比劫': '你在亲密关系中把伴侣当"哥们"，容易互怼、争高低。',
    '食伤': '你在亲密关系中需要被欣赏和崇拜，把伴侣当成粉丝或崇拜者。'
  },
  '夫妻星与夫妻宫的喜忌互动': {
    '喜+喜-夫妻星生夫妻宫': '夫妻星生夫妻宫，配偶主动营造家庭氛围，婚姻温馨和谐。',
    '喜+喜-夫妻星克夫妻宫': '夫妻星克夫妻宫，配偶以自己方式爱你但让你有压力。',
    '喜+喜-夫妻宫生夫妻星': '夫妻宫生夫妻星，你为家庭付出多，配偶享受你的照顾。',
    '喜+喜-夫妻宫克夫妻星': '夫妻宫克夫妻星，你在婚姻中压抑，想改变配偶很难。',
    '喜+喜-同五行': '夫妻星与夫妻宫同五行，星宫合一，婚姻紧密但缺乏变化。',
    '喜+喜-同位': '夫妻星与夫妻宫同位，婚姻核心就是配偶本人，关系不可分割。',
    '喜+忌-夫妻星生夫妻宫': '配偶本是贵人，但家风/婚姻环境让你不适。',
    '喜+忌-夫妻星克夫妻宫': '配偶本是贵人，但婚姻环境让你感到被压制。',
    '喜+忌-夫妻宫生夫妻星': '配偶本是贵人，但家庭环境滋养了配偶的缺点。',
    '喜+忌-夫妻宫克夫妻星': '配偶本是贵人，但家庭环境对配偶有克制。',
    '喜+忌-同五行': '配偶本是贵人，但家庭氛围让你压抑。',
    '喜+忌-同位': '配偶本是贵人，但婚姻环境让你极其压抑，想改变也难。',
    '忌+喜-夫妻星生夫妻宫': '配偶本身是问题，但婚姻环境帮你化解了一部分。',
    '忌+喜-夫妻星克夫妻宫': '配偶本身让你有压力，但婚姻环境稍微缓解。',
    '忌+喜-夫妻宫生夫妻星': '配偶本身是问题，但家庭环境让你愿意包容。',
    '忌+喜-夫妻宫克夫妻星': '配偶本身是问题，家庭环境也在抑制配偶的负面影响。',
    '忌+喜-同五行': '配偶与家庭同一种问题，但喜忌对冲有所缓解。',
    '忌+喜-同位': '配偶与家庭同一核心，问题集中但环境帮你缓冲。',
    '忌+忌-夫妻星生夫妻宫': '配偶有问题，还在不断给家庭"输血"，越陷越深。',
    '忌+忌-夫妻星克夫妻宫': '配偶压制家庭，婚姻中你处于被支配地位。',
    '忌+忌-夫妻宫生夫妻星': '家庭滋养了配偶的缺点，纵容了问题。',
    '忌+忌-夫妻宫克夫妻星': '家庭与配偶互克，婚姻关系极度紧张。',
    '忌+忌-同五行': '配偶与家庭同属问题属性，婚姻整体偏负面。',
    '忌+忌-同位': '配偶与家庭完全合一，问题无处可逃，婚姻整体堪忧。'
  },
  '全局病根': {
    '淤堵-食伤旺透': { 状态: '食伤旺透，克制官杀、泄财星。表现为嘴毒、太作、不服管，把好事搞砸。心里想要爱，但行为上总是在推开人。', 化解: '修口业，学会闭嘴。用食伤的才华去创造价值，而不是用来伤人。找大运流年制住食伤的时段再谈婚论嫁。' },
    '淤堵-食伤克官杀': { 状态: '食伤直接克制官杀，女命尤其明显。看不上任何男人，觉得谁都不够好，高标准变成拒人于千里。', 化解: '降低期待，看到对方的优点而非盯着缺点。找印星大运来化食伤，或官杀强旺的流年去冲合。' },
    '淤堵-比劫林立': { 状态: '比劫林立无制，性格刚硬不服输，争强好胜。感情中不懂示弱，把伴侣当竞争对手。', 化解: '学会示弱和妥协。找官杀大运来制比劫，或食伤流年泄比劫之气。' },
    '淤堵-印星过旺': { 状态: '印星过旺克制食伤，表现为过度依赖、没有主见、妈宝。或者极度缺乏安全感，把伴侣榨干。', 化解: '培养独立人格，找财星大运来破印，或食伤流年泄印星之力。' },
    '火灾-烂桃花不断': { 状态: '火土燥烈，官杀/财星为忌且有力；或官杀/财星被火烤干，质量差。总遇错的人，烂桃花不断。', 化解: '先提升自己，搞清楚自己真正需要什么。等夫妻星被制或夫妻宫逢合的大运流年再行动。' },
    '火灾-对方消耗你': { 状态: '火土克水，官杀/财星为忌攻身；或官杀/财星被火烤干。对方不断消耗你，经济上、情感上都是黑洞。', 化解: '认清现实，及时止损。等大运流年冲开忌神、引动喜神时再做选择。' },
    '火灾-控制欲强': { 状态: '火土旺，官杀/财星攻身无化。伴侣控制欲极强，窒息式婚姻。', 化解: '建立边界感。如果无法改变对方，等冲官杀、合官杀的大运流年寻找出路。' },
    '水灾-缘分不出现': { 状态: '满盘金水，官杀/财星弱；圈子窄、没机会，缘分就是不出现。', 化解: '主动社交，扩大圈子。等夫妻星出现、夫妻宫被引动的大运流年。' },
    '水灾-付出没回报': { 状态: '比劫夺官杀，印旺生比劫。您对伴侣好，但被朋友、家人、琐事截胡。', 化解: '停止过度付出，把精力放在自我提升上。等喜神大运帮扶夫妻星时再投入。' },
    '水灾-不敢投入': { 状态: '印星过旺，克制食伤。自我保护机制过强，不敢敞开心扉。', 化解: '先疗愈自己，建立安全感。等食伤被制、财星/官杀被引动的流年尝试打开心扉。' },
    '断裂-无通关': { 状态: '夫妻宫被冲、被刑、被害，且无通关。感情极其脆弱，一点小事就翻脸。', 化解: '物理隔离（缓冲带）：异地、分居、找个第三方目标（孩子/事业）分散火力。' },
    '断裂-被迫分离': { 状态: '夫妻宫被冲，或官杀在远处与宫位无情。被迫分离，异地阻隔。', 化解: '物理隔离 + 找通关：先接受异地，再找"合"来锁住关系。' },
    '错位-搅局': { 状态: '官杀/财星被合走或合绊，化神为忌。缘分被第三方牵制。', 化解: '切断源头（破合）：搬家、换圈子、物理远离"搅局者"。' },
    '错位-原生家庭干预': { 状态: '官杀/财星被印星（父母）合走，或被比劫（闺蜜）合走。伴侣被"带坏"。', 化解: '切断源头：搬家、换社交圈、物理远离"搅局者"。' }
  },
  '有夫妻星_男': {
    '夫妻星弱-喜神': '财星为喜且弱，说明妻子是贵人，对你有助益，但力量不足，需要大运流年帮扶。',
    '夫妻星弱-忌神': '财星为忌且弱，妻子对你影响小，婚姻对你的消耗有限，关系平淡。',
    '夫妻星强-喜神': '财星为喜且强，妻子非常优秀，对你事业和生活帮助极大，旺夫命。',
    '夫妻星强-忌神': '财星为忌且强，妻子对你消耗大，婚姻关系中你处于被动受压状态。'
  },
  '有夫妻星_女': {
    '夫妻星弱-喜神': '官杀为喜且弱，说明丈夫是贵人，但力量不足，需大运流年帮扶。',
    '夫妻星弱-忌神': '官杀为忌且弱，丈夫对你影响小，婚姻中你占据主导地位。',
    '夫妻星强-喜神': '官杀为喜且强，丈夫非常优秀，对你有助益，旺妻命。',
    '夫妻星强-忌神': '官杀为忌且强，丈夫对你消耗大，婚姻中你受压、被控制。'
  },
  '婚姻状态_未婚': {
    '夫妻星是否出现': '关注大运流年是否引动夫妻星（出现、被合出），夫妻星现身或被合出来时，伴侣极其想娶/嫁你，进度极快，可能闪婚。',
    '夫妻宫是否被引动': '被冲=物理分离（分居、冷战）；被合走=伴侣心被外面吸走；合绊=精力被牵制（长辈/事业/子女）；被害/被刑=冷战内耗。',
    '夫妻星与夫妻宫互动': '生/合夫妻宫=伴侣极想结婚，可能闪婚；克/冲夫妻宫=伴侣追你但家里反对或压迫感太强，谈得痛苦落不了地。',
    '结婚应期': '流年带红鸾或天喜，会加大"想恋爱、想成家"的情绪波动。大运流年补足喜用神力量时，是结婚的最佳窗口。'
  },
  '婚姻状态_已婚': {
    '夫妻星到位': '夫妻星到位，婚姻成立。关注夫妻宫是否被引动来判断婚姻质量。',
    '夫妻宫被引动': '被冲=物理分离（分居、冷战）；被合走=伴侣心被外面吸走；合绊=精力被牵制；被害/被刑=冷战内耗。',
    '离婚应期': '夫妻星被克或合走=纽带断了；夫妻宫逢冲=突然破裂或剧烈冲突；忌神加力=对婚姻极度厌烦，主动想离。'
  },
  '婚姻状态_离婚': {
    '离婚应期': '夫妻星被克或合走=纽带断了；夫妻宫逢冲=突然破裂或剧烈冲突；忌神加力=对婚姻极度厌烦，主动想离。',
    '离婚后状态': '忌神再来=前夫纠缠或心理创伤复发；克制忌神=彻底走出来；夫妻宫为忌=财产分割、抚养权撕逼。'
  }
}

const progressPct = computed(() => ((currentStep.value) / totalSteps * 100).toFixed(0))

function getGender() {
  return selections['p0'] as string || ''
}

function selectOption(pageIdx: number, val: string, isMulti: boolean) {
  const key = 'p' + pageIdx
  if (isMulti) {
    if (!Array.isArray(selections[key])) selections[key] = []
    const arr = selections[key] as string[]
    const idx = arr.indexOf(val)
    if (idx === -1) arr.push(val)
    else arr.splice(idx, 1)
  } else {
    selections[key] = val
  }
}

function isPageSelected(pageIdx: number, val: string): boolean {
  const key = 'p' + pageIdx
  const sel = selections[key]
  if (!sel) return false
  if (Array.isArray(sel)) return sel.includes(val)
  return sel === val
}

// Step definitions
const step0Options = ['男', '女']
const step1Options = ['没有夫妻星', '有夫妻星']
const step2Options = ['夫妻星强-喜神', '夫妻星强-忌神', '夫妻星弱-喜神', '夫妻星弱-忌神']
const step3Options = ['夫妻星在年干', '夫妻星在年支', '夫妻星在月干', '夫妻星在月支', '夫妻星在日支', '夫妻星在时干', '夫妻星在时支', '夫妻星不显', '夫妻星与日主相合/相克']
const step4Options = ['夫妻宫为喜', '夫妻宫为忌']
const step5Options = ['夫妻宫被冲', '夫妻宫被害', '夫妻宫被刑', '夫妻宫被合', '被年支合绊', '被月支合绊', '被时支合绊', '夫妻宫没有被引动']
const step6Options = [
  '印星旺-喜神', '印星旺-忌神', '印星弱-喜神', '印星弱-忌神',
  '食伤旺-喜神', '食伤旺-忌神', '食伤弱-喜神', '食伤弱-忌神',
  '比劫旺-喜神', '比劫旺-忌神', '比劫弱-喜神', '比劫弱-忌神',
  '财星旺-喜神', '财星旺-忌神', '财星弱-喜神', '财星弱-忌神',
  '官杀旺-喜神', '官杀旺-忌神', '官杀弱-喜神', '官杀弱-忌神'
]
const step7MultiOptions = ['官杀', '财星', '印星', '比劫', '食伤']
const step8Options = [
  '喜+喜-夫妻星生夫妻宫', '喜+喜-夫妻星克夫妻宫', '喜+喜-夫妻宫生夫妻星', '喜+喜-夫妻宫克夫妻星', '喜+喜-同五行', '喜+喜-同位',
  '喜+忌-夫妻星生夫妻宫', '喜+忌-夫妻星克夫妻宫', '喜+忌-夫妻宫生夫妻星', '喜+忌-夫妻宫克夫妻星', '喜+忌-同五行', '喜+忌-同位',
  '忌+喜-夫妻星生夫妻宫', '忌+喜-夫妻星克夫妻宫', '忌+喜-夫妻宫生夫妻星', '忌+喜-夫妻宫克夫妻星', '忌+喜-同五行', '忌+喜-同位',
  '忌+忌-夫妻星生夫妻宫', '忌+忌-夫妻星克夫妻宫', '忌+忌-夫妻宫生夫妻星', '忌+忌-夫妻宫克夫妻星', '忌+忌-同五行', '忌+忌-同位'
]
const step9MultiOptions = [
  '淤堵-食伤旺透', '淤堵-食伤克官杀', '淤堵-比劫林立', '淤堵-印星过旺',
  '火灾-烂桃花不断', '火灾-对方消耗你', '火灾-控制欲强',
  '水灾-缘分不出现', '水灾-付出没回报', '水灾-不敢投入',
  '断裂-无通关', '断裂-被迫分离',
  '错位-搅局', '错位-原生家庭干预'
]
const step10Options = ['未婚', '已婚', '离婚']

function getOptions(pageIdx: number): string[] {
  const map: Record<number, string[]> = {
    0: step0Options, 1: step1Options, 2: step2Options, 3: step3Options,
    4: step4Options, 5: step5Options, 6: step6Options, 8: step8Options, 10: step10Options
  }
  return map[pageIdx] || []
}

function getSingleResult(idx: number, val: string): string {
  let results: string[] = []
  if (idx === 1) {
    if (val === '没有夫妻星') {
      results.push(db['没有夫妻星'])
    } else {
      const gender = getGender()
      if (gender === '男') results.push('您为男性，夫妻星为财星。请下一步选择夫妻星的强弱（财星的强弱及喜忌）。')
      else results.push('您为女性，夫妻星为官杀。请下一步选择夫妻星的强弱（官杀的强弱及喜忌）。')
    }
  } else if (idx === 2) {
    results.push(db['夫妻星的强弱'][val])
  } else if (idx === 3) {
    results.push(db['夫妻星的位置'][val])
  } else if (idx === 4) {
    results.push(db['夫妻宫的喜忌'][val])
  } else if (idx === 5) {
    results.push(db['夫妻宫是否被引动'][val])
  } else if (idx === 6) {
    results.push(db['夫妻宫坐着谁'][val])
  } else if (idx === 8) {
    results.push(db['夫妻星与夫妻宫的喜忌互动'][val])
  } else if (idx === 10) {
    if (val === '未婚') results.push('未婚状态：重点关注以下关键词 —— 夫妻星是否出现、夫妻宫是否被引动、夫妻星与夫妻宫互动、结婚应期。')
    else if (val === '已婚') results.push('已婚状态：重点关注以下关键词 —— 夫妻星到位、夫妻宫被引动、离婚应期。')
    else results.push('离婚状态：重点关注以下关键词 —— 离婚应期、离婚后状态。')
  }
  return results.join('<br>')
}

const resultContent = computed(() => {
  const key = 'p' + currentStep.value
  const sel = selections[key]

  if (currentStep.value === 7 || currentStep.value === 9) {
    // Multi
    if (!Array.isArray(sel) || sel.length === 0) return ''
    let html = ''
    if (currentStep.value === 7) {
      for (const v of sel as string[]) {
        html += `<div><b>${v}</b>：${db['日支藏干的十神'][v]}</div>`
      }
    } else {
      for (const v of sel as string[]) {
        const rd = db['全局病根'][v] as RootData
        const label = v.split('-')[1]
        html += `<div><b>【${label}】</b></div><div>【状态】${rd.状态}</div><div>【化解方法】${rd.化解}</div>`
      }
    }
    return html
  } else {
    const val = sel as string | undefined
    if (!val) return ''
    return getSingleResult(currentStep.value, val)
  }
})

function validatePage(idx: number): boolean {
  const key = 'p' + idx
  if (idx === 7 || idx === 9) {
    if (!selections[key] || (selections[key] as string[]).length === 0) { alert('请至少选择一个选项'); return false }
  } else {
    if (!selections[key]) { alert('请先做出选择'); return false }
  }
  return true
}

function nextStep() {
  if (!validatePage(currentStep.value)) return
  if (currentStep.value < totalSteps - 1) {
    currentStep.value++
    window.scrollTo(0, 0)
  } else {
    stage.value = 'result'
    window.scrollTo(0, 0)
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo(0, 0)
  }
}

const summaryInfo = computed(() => {
  const gender = getGender()
  const p10val = selections['p10'] as string || ''
  const p9vals = (selections['p9'] as string[]) || []
  const rootTypes = p9vals.map(v => v.split('-')[1])
  return { gender, status: p10val, roots: rootTypes.join(' / ') }
})

const summaryContent = computed(() => {
  if (stage.value !== 'result') return ''
  const gender = getGender()
  const p1val = selections['p1'] as string || ''
  const p2val = selections['p2'] as string || ''
  const p3val = selections['p3'] as string || ''
  const p4val = selections['p4'] as string || ''
  const p5val = selections['p5'] as string || ''
  const p6val = selections['p6'] as string || ''
  const p7val = (selections['p7'] as string[]) || []
  const p8val = selections['p8'] as string || ''
  const p9vals = (selections['p9'] as string[]) || []
  const p10val = selections['p10'] as string || ''

  let html = ''

  html += `<div class="summary-block"><div class="summary-block-title">基本信息</div><div class="summary-card"><div class="summary-card-label">性别</div><div class="summary-card-choice">${gender}</div></div></div>`

  html += `<div class="summary-block"><div class="summary-block-title">有无夫妻星</div><div class="summary-card"><div class="summary-card-label">选择</div><div class="summary-card-choice">${p1val}</div>`
  if (p1val === '没有夫妻星') {
    html += `<div class="summary-card-result">${db['没有夫妻星']}</div>`
  } else {
    const strongKey = gender === '男' ? '有夫妻星_男' : '有夫妻星_女'
    html += `<div class="summary-card-result">${db[strongKey][p2val] || ''}</div>`
  }
  html += `</div></div>`

  html += `<div class="summary-block"><div class="summary-block-title">夫妻星的位置</div><div class="summary-card"><div class="summary-card-label">选择</div><div class="summary-card-choice">${p3val}</div><div class="summary-card-result">${db['夫妻星的位置'][p3val] || ''}</div></div></div>`
  html += `<div class="summary-block"><div class="summary-block-title">夫妻宫的喜忌</div><div class="summary-card"><div class="summary-card-label">选择</div><div class="summary-card-choice">${p4val}</div><div class="summary-card-result">${db['夫妻宫的喜忌'][p4val] || ''}</div></div></div>`
  html += `<div class="summary-block"><div class="summary-block-title">夫妻宫是否被引动</div><div class="summary-card"><div class="summary-card-label">选择</div><div class="summary-card-choice">${p5val}</div><div class="summary-card-result">${db['夫妻宫是否被引动'][p5val] || ''}</div></div></div>`
  html += `<div class="summary-block"><div class="summary-block-title">夫妻宫坐着谁</div><div class="summary-card"><div class="summary-card-label">选择</div><div class="summary-card-choice">${p6val}</div><div class="summary-card-result">${db['夫妻宫坐着谁'][p6val] || ''}</div></div></div>`

  if (p7val.length > 0) {
    html += `<div class="summary-block"><div class="summary-block-title">日支藏干的十神</div>`
    for (const v of p7val) {
      html += `<div class="summary-card"><div class="summary-card-label">选择</div><div class="summary-card-choice">${v}</div><div class="summary-card-result">${db['日支藏干的十神'][v]}</div></div>`
    }
    html += `</div>`
  }

  html += `<div class="summary-block"><div class="summary-block-title">夫妻星与夫妻宫的喜忌互动</div><div class="summary-card"><div class="summary-card-label">选择</div><div class="summary-card-choice">${p8val}</div><div class="summary-card-result">${db['夫妻星与夫妻宫的喜忌互动'][p8val] || ''}</div></div></div>`

  if (p9vals.length > 0) {
    html += `<div class="summary-block"><div class="summary-block-title">全局病根与状态</div>`
    for (const v of p9vals) {
      const rd = db['全局病根'][v] as RootData
      const label = v.split('-')[1]
      html += `<div class="summary-card"><div class="summary-card-label">模式</div><div class="summary-card-choice">${label}</div><div class="summary-card-result"><b>【状态】</b>${rd.状态}</div><div class="summary-card-result" style="margin-top:6px;"><b>【化解方法】</b>${rd.化解}</div></div>`
    }
    html += `</div>`
  }

  // Marital zone
  const maritalKey = '婚姻状态_' + p10val
  html += `<div class="marital-zone"><div class="marital-zone-title">婚姻状态：${p10val}</div><div class="marital-grid">`
  const maritalData = db[maritalKey]
  if (maritalData) {
    for (const [label, value] of Object.entries(maritalData)) {
      html += `<div class="marital-card"><div class="marital-card-label">${label}</div><div class="marital-card-value">${value || '-'}</div></div>`
    }
  }
  html += `</div></div>`

  return html
})

function restart() {
  Object.keys(selections).forEach(k => delete selections[k])
  currentStep.value = 0
  stage.value = 'question'
  window.scrollTo(0, 0)
}
</script>

<template>
  <div class="qinggan-view">
    <div v-if="stage === 'question'">
      <div class="progress-bar"><div class="progress-fill" :style="{ width: progressPct + '%' }"></div></div>
      <div class="progress-text">第 {{ currentStep + 1 }} 步 / 共 {{ totalSteps }} 步</div>

      <!-- Step 0: Gender -->
      <div v-show="currentStep === 0" class="card">
        <div class="page-title">性别</div>
        <div class="page-desc">请选择您的性别</div>
        <div v-for="opt in step0Options" :key="opt" class="option-item" :class="{ selected: isPageSelected(0, opt) }" @click="selectOption(0, opt, false)">{{ opt }}</div>
        <div class="btn-group"><div></div><button class="btn btn-primary" @click="nextStep">下一步</button></div>
      </div>

      <!-- Step 1-6, 8, 10: single select -->
      <div v-for="stepIdx in [1,2,3,4,5,6,8,10]" :key="stepIdx" v-show="currentStep === stepIdx" class="card">
        <div class="page-title">{{ {
          1:'有无夫妻星', 2:'夫妻星的强弱', 3:'夫妻星的位置', 4:'夫妻宫的喜忌', 5:'夫妻宫是否被引动', 6:'夫妻宫坐着谁（日支本气）', 8:'夫妻星与夫妻宫的喜忌互动', 10:'婚姻状态'
        }[stepIdx] }}</div>
        <div class="page-desc">{{ {
          1:'请选择您的夫妻星情况', 2:'请选择夫妻星的强弱及喜忌', 3:'请选择夫妻星所在的位置', 4:'请选择夫妻宫的喜忌情况', 5:'请选择夫妻宫的状态', 6:'请选择日支本气所对应的十神及喜忌', 8:'请选择夫妻星与夫妻宫的喜忌互动关系', 10:'请选择您当前的婚姻状态'
        }[stepIdx] }}</div>
        <div v-for="opt in getOptions(stepIdx)" :key="opt" class="option-item" :class="{ selected: isPageSelected(stepIdx, opt) }" @click="selectOption(stepIdx, opt, false)">{{ opt }}</div>
        <div v-if="resultContent" class="result-box">
          <div class="result-title">结果</div>
          <div class="result-content" v-html="resultContent"></div>
        </div>
        <div class="btn-group">
          <button class="btn" @click="prevStep">上一步</button>
          <button class="btn btn-primary" @click="nextStep">{{ stepIdx === 10 ? '查看总结' : '下一步' }}</button>
        </div>
      </div>

      <!-- Step 7: Multi select 日支藏干 -->
      <div v-show="currentStep === 7" class="card">
        <div class="page-title">日支藏干的十神</div>
        <div class="page-desc">请选择日支藏干对应的十神（可多选）</div>
        <div v-for="opt in step7MultiOptions" :key="opt" class="option-item multi" :class="{ selected: isPageSelected(7, opt) }" @click="selectOption(7, opt, true)">
          {{ { 官杀: '官杀 — 把伴侣当"权威/保护伞"', 财星: '财星 — 把伴侣当"财神爷/现实依靠"', 印星: '印星 — 把伴侣当"妈/精神避风港"，容易产生依赖', 比劫: '比劫 — 把伴侣当"哥们/竞争对手"，容易互怼', 食伤: '食伤 — 把伴侣当"粉丝/被崇拜者"' }[opt] }}
        </div>
        <div v-if="resultContent" class="result-box">
          <div class="result-title">结果</div>
          <div class="result-content" v-html="resultContent"></div>
        </div>
        <div class="btn-group">
          <button class="btn" @click="prevStep">上一步</button>
          <button class="btn btn-primary" @click="nextStep">下一步</button>
        </div>
      </div>

      <!-- Step 9: Multi select 全局病根 -->
      <div v-show="currentStep === 9" class="card">
        <div class="page-title">全局病根与状态</div>
        <div class="page-desc">请选择您的全局病根类型（可多选）</div>
        <div v-for="opt in step9MultiOptions" :key="opt" class="option-item multi" :class="{ selected: isPageSelected(9, opt) }" @click="selectOption(9, opt, true)">
          {{ { '淤堵-食伤旺透':'淤堵型：食伤旺透，克制官杀、泄财星', '淤堵-食伤克官杀':'淤堵型：食伤直接克制官杀', '淤堵-比劫林立':'淤堵型：比劫林立，无官杀制、无食伤泄', '淤堵-印星过旺':'淤堵型：印星过旺，克制食伤',
              '火灾-烂桃花不断':'火灾型：火土燥烈，官杀/财星为忌且有力；烂桃花不断', '火灾-对方消耗你':'火灾型：火土克水，对方消耗你', '火灾-控制欲强':'火灾型：火土旺，对方强势控制',
              '水灾-缘分不出现':'水灾型：满盘金水，缘分就是不出现', '水灾-付出没回报':'水灾型：付出没回报，单向奔赴', '水灾-不敢投入':'水灾型：不敢敞开心扉，恐惧亲密关系',
              '断裂-无通关':'断裂型：夫妻宫被冲、被刑、被害，无通关', '断裂-被迫分离':'断裂型：被迫分离，异地阻隔',
              '错位-搅局':'错位型：缘分被第三方牵制', '错位-原生家庭干预':'错位型：原生家庭干预，伴侣被"带坏"' }[opt] }}
        </div>
        <div v-if="resultContent" class="result-box">
          <div class="result-title">结果</div>
          <div class="result-content" v-html="resultContent"></div>
        </div>
        <div class="btn-group">
          <button class="btn" @click="prevStep">上一步</button>
          <button class="btn btn-primary" @click="nextStep">下一步</button>
        </div>
      </div>
    </div>

    <!-- Result Page -->
    <div v-if="stage === 'result'" class="card">
      <div class="summary-title">婚姻分析报告 · 总结</div>
      <div class="summary-subtitle">共 11 步分析完成，以下为完整婚姻分析报告</div>
      <div class="summary-info-bar">
        <div class="summary-info-item"><div class="summary-info-label">性别</div><div class="summary-info-value">{{ summaryInfo.gender }}</div></div>
        <div class="summary-info-item"><div class="summary-info-label">婚姻状态</div><div class="summary-info-value">{{ summaryInfo.status }}</div></div>
        <div class="summary-info-item"><div class="summary-info-label">全局病根</div><div class="summary-info-value">{{ summaryInfo.roots }}</div></div>
      </div>
      <div v-html="summaryContent"></div>
      <button class="btn btn-primary restart-btn" @click="restart">重新分析</button>
    </div>
  </div>
</template>

<style scoped>
.qinggan-view { max-width: 760px; margin: 0 auto; padding: 20px 16px 40px; }

.progress-bar { width: 100%; height: 4px; background: #e0e0e0; border-radius: 2px; margin-bottom: 6px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), #6b5b3a); border-radius: 2px; transition: width 0.3s; }
.progress-text { text-align: center; color: #bbb; font-size: 12px; margin-bottom: 18px; }

.page-title { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 4px; color: #1a1a1a; }
.page-desc { text-align: center; color: #999; margin-bottom: 22px; font-size: 13px; }

.option-item { display: block; padding: 11px 14px; margin: 5px 0; border: 1.5px solid #e0e0e0; border-radius: 6px; cursor: pointer; transition: all 0.15s; font-size: 13.5px; line-height: 1.6; color: #333; user-select: none; }
.option-item:hover { border-color: var(--accent); background: #f0f7ff; }
.option-item.selected { border-color: var(--accent); background: #e8f0fe; color: var(--accent); font-weight: 600; }
.option-item.multi { padding-left: 38px; position: relative; }
.option-item.multi::before { content: ''; position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; border: 1.5px solid #ccc; border-radius: 3px; transition: all 0.15s; }
.option-item.multi.selected::before { background: var(--accent); border-color: var(--accent); }

.result-box { background: #f8f9fa; border-left: 3px solid var(--accent); padding: 14px 16px; margin-top: 16px; border-radius: 0 6px 6px 0; }
.result-box .result-title { font-weight: 600; color: var(--accent); margin-bottom: 6px; font-size: 14px; }
.result-box .result-content { color: #444; line-height: 1.8; font-size: 13px; }

.btn-group { display: flex; justify-content: space-between; margin-top: 24px; }

.summary-title { font-size: 22px; font-weight: bold; text-align: center; color: #1a1a1a; margin-bottom: 6px; }
.summary-subtitle { text-align: center; color: #999; font-size: 13px; margin-bottom: 24px; }

.summary-info-bar { display: flex; justify-content: center; gap: 32px; margin-bottom: 28px; padding: 14px 0; background: #f8f9fa; border-radius: 8px; }
.summary-info-item { text-align: center; }
.summary-info-label { font-size: 11px; color: #aaa; font-weight: 600; letter-spacing: 0.5px; }
.summary-info-value { font-size: 15px; font-weight: 700; color: var(--accent); }

.summary-block { margin-bottom: 24px; }
.summary-block-title { font-size: 15px; font-weight: 700; color: #333; margin-bottom: 12px; padding-left: 14px; border-left: 4px solid var(--accent); }
.summary-card { background: #f8f9fa; border-radius: 8px; padding: 14px 18px; margin-bottom: 10px; }
.summary-card-label { font-size: 11px; color: #aaa; font-weight: 600; margin-bottom: 3px; }
.summary-card-choice { font-size: 14px; color: var(--accent); font-weight: 700; margin-bottom: 6px; }
.summary-card-result { font-size: 12.5px; color: #555; line-height: 1.8; white-space: pre-line; }

.marital-zone { background: #fff5f5; border-radius: 10px; padding: 24px; margin: 28px 0; border-left: 5px solid var(--red-ink); }
.marital-zone-title { font-size: 17px; font-weight: 700; color: var(--red-ink); margin-bottom: 18px; text-align: center; padding-bottom: 10px; border-bottom: 1px solid #f0d0d0; }
.marital-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.marital-card { background: #fff; border-radius: 8px; padding: 14px 16px; border: 1px solid #f0d0d0; }
.marital-card-label { font-size: 11px; color: #bbb; font-weight: 600; margin-bottom: 3px; letter-spacing: 0.5px; }
.marital-card-value { font-size: 13px; color: #666; line-height: 1.7; white-space: pre-line; }

.restart-btn { display: block; margin: 28px auto 0; padding: 11px 36px; }
</style>
