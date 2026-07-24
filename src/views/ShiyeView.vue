<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const stage = ref<'question' | 'result'>('question')
const currentStep = ref(1)
const answers = reactive<Record<string, string>>({})
const totalSteps = 10

const progressPct = computed(() => ((currentStep.value) / totalSteps * 100).toFixed(0))

const stepLabels: Record<string, string> = {
  step1: '工作武器 — 天干透干的十神',
  step2: '原局喜神定行业',
  step3: '工作武器在地支的位置 — 你的工作平台',
  step4: '身强身弱',
  step5: '看透干坐下的地支—工作模式',
  step6: '看透干坐下的地支—你的抗压能力与心理状态',
  step7: '财富天花板',
  step8: '地位天花板',
  step9: '日支—工作舒适区',
  step10: '大运流年分析'
}

const jobTexts: Record<string, string> = {
  '食神': '靠手艺、靠技术、靠服务吃饭。\n代表岗位：程序员、厨师、医生、设计师、慢条斯理的培训老师。',
  '伤官': '靠演说、靠打破常规、靠吸引眼球吃饭。\n代表岗位：辩护律师、营销策划、带货主播、演员、爱挑刺的质量检测。',
  '正财': '靠守财、靠精细化管理、靠体力干活换钱。\n代表岗位：出纳、会计、仓库管理员、常规销售、按件计酬的熟练工。',
  '偏财': '靠人脉、靠融资、靠资源整合、靠眼光吃饭。\n代表岗位：投资人、大客户销售、采购、贸易商人、微商大佬。',
  '正官': '靠流程、靠制度、靠情商和体面吃饭。\n代表岗位：公务员、HR、行政主管、国企中层、顺风顺水的职业经理人。',
  '七杀': '靠镇压、靠冒险、靠解决老大难问题吃饭。\n代表岗位：创业老板、刑警、外科医生、危机公关、带兵打仗的狼性团队头目。',
  '正印': '靠背景、靠学历、靠慈悲心和服务意识吃饭。\n代表岗位：老师、后勤大管家、体制内边缘闲职（但有面子）、拿着名校文凭进大厂做螺丝钉。',
  '偏印': '靠冷门技术、靠直觉、靠不走寻常路吃饭。\n代表岗位：命理师、黑客、非主流艺术工作者、研发怪才、幕后军师。',
  '比肩': '靠独立干活、靠死磕、靠单打独斗吃饭。\n代表岗位：自由职业者、长途司机、独立设计师、个体户。',
  '劫财': ''
}

const industryTexts: Record<string, string> = {
  '木': '文本、教育、植物、服装、医药、木材。',
  '火': '电能、互联网平台、媒体、餐饮、灯光、化工。',
  '土': '房产、土地、建筑、石头、陶瓷、咨询中介。',
  '金': '钱财、金属、机械、法律、医疗器械、汽车。',
  '水': '数据、信息、液体、物流、旅游、传播、互联网软件。'
}

const platformTexts: Record<string, string> = {
  '年干': '吃红利的传统大盘平台、靠资质/牌照吃饭的平台、异地发展。',
  '月干': '',
  '日干': '极度去中心化，不依附于任何公司，超级个体/个人IP、手艺在身的游侠、夫妻店/家族微型企业。',
  '时干': '灵活、外包、自由职业、不坐班、具体的一线落地、或者大厂里的边缘创新业务。',
  '年支': '依靠老家关系网谋生的人、在异地干着跟当地主流不符的冷门工作、吃学历/老家红利的边缘岗。',
  '月支': '大平台里的"无名英雄"、核心部门的底层实操者、不挂管理名但却干着管理活的老黄牛。',
  '日支': '小团队里的边缘技术人员、SOHO（居家办公）一族、不与人打交道纯靠手艺吃饭的闭门造车者。',
  '时支': '副业狂魔、纯纯的自由职业者、外包接单侠、新兴行业的个体户。'
}

const shenTexts: Record<string, string> = {
  '身强': '主导者、核心骨干、能扛事。绝对不是底层打杂的。',
  '身弱': '执行者、不抛头露面、单打独斗、不能抗大雷。'
}

const modeTexts: Record<string, string> = {
  '食伤旺': '极其享受工作本身的过程。不在乎赚多少钱，在乎"这个作品是不是够惊艳"、"这个方案是不是够酷"。工作模式是"灵感驱动，随性而为"，讨厌朝九晚五的打卡。\n典型：自由艺术家、创意总监、不求人的独立撰稿人。',
  '食伤弱': '脑子有想法，手里做不出。工作模式变成"眼高手低，间歇性踌躇满志，持续性混吃等死"。总觉得自己怀才不遇，一做事就卡壳。\n典型：满腹牢骚的底层设计员。',
  '伤官旺': '',
  '伤官弱': '',
  '财星旺': '极度务实，只看结果不看过程。工作模式是"无利不起早"，一切以变现、ROI（投资回报率）为导向。擅长资源整合，能把任何东西变成商品。\n典型：精明的生意人、结果导向的销售总监。',
  '财星弱': '极度缺钱，满脑子搞钱却总是抓瞎。工作模式变成"短视、对金钱极度敏感、为了蝇头小利牺牲长远发展"。\n典型：总是接别人不愿意接的麻烦活儿，或者被钱逼得频繁转行。',
  '官杀旺': '天生的体制内体质或大厂螺丝钉。工作模式是"按流程办事，在规则内寻求权力最大化"。极度自律，能扛住高压，懂得向上管理。\n典型：高级公务员、大厂中高层管理者、军人。',
  '官杀弱': '被规则压得喘不过气。工作模式变成"恐惧驱动"，怕犯错、怕领导、每天在职场PUA中瑟瑟发抖，干活全靠逼。\n典型：职场小透明、重度焦虑的打工人。',
  '印星旺': '稳如泰山。工作模式是"谋定而后动"，绝不打无准备之仗。极度依赖平台、学历、或者背后的靠山。擅长做后台支撑、理论研究、风控分析。\n典型：首席研究员、体制内闲差、有强大背景的顾问。',
  '印星弱': '严重的拖延症和行动力瘫痪。工作模式变成"纸上谈兵，光想不干"。遇到问题总想再查查资料，总觉得自己还没准备好，最后错过机会。\n典型：长期备考考不上的学生、重度拖延症患者。',
  '比劫旺': '极度独立，不需要任何人指导。工作模式是"给我目标，别管过程"。喜欢一个人或者和几个志同道合的兄弟单干，极其抗拒大公司的层级管理。\n典型：独立开发者、合伙开工作室。',
  '比劫弱': '想单干却没有实力，想合群却总被排挤。工作模式变成"盲目蛮干，不听劝阻，最后累死自己"。\n典型：不服从管理的刺头员工，频繁跳槽。'
}

const mentalTexts: Record<string, string> = {
  '食神_强': '自信度：极高。我知道我技术好，我不跟你们卷速度。\n抗压：极强。天塌下来我也能先吃完这顿饭再修bug。\n画风：职场里的定海神针，不急不躁，产出的东西质量极高，老板还得哄着他。',
  '伤官_强': '自信度：爆表。觉得全公司都是傻X，只有我最聪明。\n抗压：强。你开除我？分分钟我去竞品公司干翻你。\n画风：职场刺头，但确实有底气。敢在大会上直接怼老板，怼完还能拿出完美的替代方案。',
  '正财_强': '自信度：强。我凭本事赚钱，理直气壮。\n抗压：强。为了目标可以连续加班，因为知道回报是实打实的。\n画风：极其靠谱的业务骨干或财务。算账算得门儿清，不占人便宜，但也绝不吃亏，目标感极强。',
  '偏财_强': '自信度：爆表。觉得没有我搞不定的关系，没有我谈不下来的单子。\n抗压：极强。在这个酒局被拒，转身去下一个酒局，情绪毫无波澜。\n画风：职场社交达人。能把黑的说成白的，能在各种利益方之间游刃有余地走钢丝，赚大钱。',
  '正官_强': '自信度：强。我的位置坐得稳，我说的话就是规矩。\n抗压：强。能扛住上面的压力，转化为下面的KPI。\n画风：有手腕但讲规矩的管理者。既能向上管理，又能恩威并施，下属服气且敬畏。',
  '七杀_强': '自信度：狂妄。顺我者昌，逆我者亡。\n抗压：变态级强。越乱越兴奋，在绝境中能爆发出恐怖的战斗力。\n画风：救火队长、铁腕清洗者。能干别人干不了的脏活累活，虽然得罪人，但能拿到不可思议的战果。',
  '正印_强': '自信度：强。我代表的可是公司制度/领导意志。\n抗压：强。只要按流程走，哪怕天塌下来也不关我的事。\n画风：极其霸道的"守门员"。拿捏着签字权，你不符合规定，天王老子来了我也不批，心理素质极好。',
  '偏印_强': '自信度：极高（且不屑于证明）。你们不懂没关系，我自己知道我有多牛。\n抗压：强。完全活在自己的精神世界里，外界的评价对他无效。\n画风：职场里的怪才。不回消息、不参加团建，但能搞出别人根本看不懂的黑科技，你拿他完全没办法。',
  '比肩_强': '自信度：强。我不需要任何人帮忙。\n抗压：强。靠着一己之力硬扛所有困难。\n画风：极度独立的技术大牛或自由职业者。你派活给他，他做完了就走，绝不跟你废话。',
  '劫财_强': '自信度：极高。兄弟遍天下，谁敢动我？\n抗压：强。打群架我不怕，大不了换一个地方重头再来。\n画风：极具煽动性的团队头目。能带着一群人去抢地盘、抢单子，分赃也很仗义，是乱世中的枭雄。',
  '食神_弱': '自信度：低。总觉得自己做的不够好，怕被批评。\n抗压：极弱。一催他就手抖，越急越写不出东西。\n画风：严重的拖延症患者。不是因为懒，是因为害怕结果不完美而迟迟不敢动手，最后在焦虑中熬秃了头。',
  '伤官_弱': '自信度：虚假的高。嘴上天下第一，心里慌得一比。\n抗压：极弱。一遇到真正的强压，立马认怂。\n画风：背后疯狂吐槽公司和同事，显得自己很懂，但真让他挑大梁，他立刻找借口退缩。典型的"语言上的巨人，行动上的矮子"。',
  '正财_弱': '自信度：低。总觉得钱难赚，患得患失。\n抗压：弱。一遇到降薪裁员，立刻觉得天塌了。\n画风：为了几百块全勤奖带病上班。对钱极其焦虑，但越焦虑越抓不住钱，常常因为过于算计而错失机会。',
  '偏财_弱': '自信度：虚假的高。靠装阔和吹牛撑场面。\n抗压：极弱。资金链一断，或者被人拆穿，立刻崩溃。\n画风：看起来天天混圈子，其实自己根本没赚到钱。被上游拖欠，被下游催债，每天在夹缝中求生存，最后往往因为财务问题翻车。',
  '正官_弱': '自信度：极低。怕上面骂，怕下面反。\n抗压：极弱。一有责任就想往下推，一有荣誉就想往上送。\n画风：最憋屈的小主管。拿着鸡毛当令箭，底下人根本不听他的。天天在中间受气，最后把自己憋出病来。',
  '七杀_弱': '自信度：零。觉得自己是个废物，每天都在等死。\n抗压：负数。直接被压力 physically（生理上）击垮。\n画风：职场霸凌的绝对受害者。被老板PUA到抑郁、甚至出现身体器质性病变（如突发性耳聋、严重失眠、甲状腺问题）。只想逃跑。',
  '正印_弱': '自信度：零。毫无主见，极度害怕担责。\n抗压：极弱。领导一皱眉，他连话都说不利索。\n画风："好好先生"，谁安排活都接，最后全砸在自己手里。一遇到需要拍板的事就疯狂请示，成了领导眼里"扶不起的阿斗"。',
  '偏印_弱': '自信度：负数。总觉得别人在针对自己，觉得自己有病。\n抗压：极弱。容易钻牛角尖，一件小事能在脑子里演成恐怖片。\n画风：职场里的林黛玉。极度敏感，同事关门声音大了一点，他能抑郁三天。工作总是断断续续，因为精神能量经常耗尽。',
  '比肩_弱': '自信度：低。其实干不动，但嘴硬。\n抗压：弱。死扛到最后把自己扛进医院。\n画风：遇到困难绝不开口求人，自己一个人熬夜瞎琢磨，最后把事情搞砸，还委屈得不行。',
  '劫财_弱': '自信度：虚假的高。狐假虎威，靠小团体壮胆。\n抗压：极弱。一旦小团体散了，或者出事了，他第一个被抛弃。\n画风：职场里拉帮结派搞小动作的那些人。跟着别人一起排挤同事，出了事马上甩锅，最后往往被所有人嫌弃，里外不是人。'
}

const wealthTexts: Record<string, string> = {
  '财星有根、不受克': '比如财星在月令，或者有力量保护。说明她所处的赛道本身利润丰厚，或者她能接触到核心资源。同样的岗位，别人赚一万，她能赚十万。',
  '财星无根、被克泄': '比如戌土（财）被木疯狂克，被火烤。说明她所在的领域可能本身就不怎么赚钱，或者她赚到的钱都是"辛苦钱、熬夜钱"，甚至钱一到手就因为各种原因流失。她能靠技能（丁火）混个温饱甚至小富，但绝对成不了大富豪。'
}

const statusTexts: Record<string, string> = {
  '官杀有印星化解': '说明不仅有钱赚，还有地位。她的专业能力能转化为管理权限，容易成为高管或行业权威。',
  '官杀被制太过/无官杀': '比如庚金（官杀）被丁火死克。说明她绝对不适合走管理路线，哪怕专业能力再强，老板也不敢提拔她，因为她太刺头。她的天花板就是"高级技术专家"，永远当不了"带团队的领导"。'
}

const comfortTexts: Record<string, string> = {
  '食神': '灵魂状态：必须好玩，必须由着我性子，无聊的事杀了我也不干。\n舒适区画像：极度厌恶重复性劳动和死板流程。最舒服的状态是"搞创作、玩艺术、做策划"。哪怕是做一份普通工作，她也必须能在里面加点自己的"小创意"。一旦工作变成纯粹的机械执行，她的灵魂就会枯萎。',
  '财星': '灵魂状态：别跟我谈理想，画大饼没用，钱到手了才算数。\n舒适区画像：极度缺乏安全感，如果没有实质性的物质回报，就会焦虑。最舒服的状态是"做销售、搞运营、谈生意"，看着数字增长、资源在自己手里整合。让她去干拿死工资且没有提成的工作，她会觉得人生没有意义。',
  '官杀': '灵魂状态：万物皆有序，没有规矩不成方圆，我得知道我的边界在哪。\n舒适区画像：官杀坐日支的人，在混乱无序的环境中会极度崩溃。他们最舒服的状态反而是"在大厂、在体制内、在有明确SOP（标准作业程序）的团队里"。只要规则清晰、晋升路径明确，他们能在这种结构里如鱼得水，甚至享受那种"扛指标、扛压力"的充实感。',
  '印星': '灵魂状态：别让我做没把握的事，让我先查查资料，或者找个靠谱的人带我。\n舒适区画像：极度讨厌风险和突如其来的变故。最舒服的状态是"在大平台做后台支撑、搞研究、当顾问、或者考个编制"。不需要在一线冲锋陷阵，只要有个强大的平台或领导（印星）罩着，安安稳稳地输出专业知识就行。',
  '比劫': '灵魂状态：别管我，别烦我，我跟我志同道合的朋友玩得挺好。\n舒适区画像：极度讨厌微观管理。最舒服的状态不是当大老板（那太累），也不是当小员工（那太憋屈），而是"自由职业者"、"工作室合伙人"。只要能自己掌控节奏，哪怕赚少点，也比在格子间里受气强一万倍。'
}

const dayunTexts: Record<string, string> = {
  '大运喜': '这十年即便流年差，也只是小磕碰，整体趋势是向上走的，敢折腾。\n找几个流年是"水逆、容易飘、会犯错"的年份（大运交替年份、病根加重的年份、喜用神被"合绊/克死"的年份）',
  '大运忌': '这十年即便流年好，也只是回光返照或短暂喘息，整体趋势是向下走的，核心策略是"苟住防守"。\n找几个流年是"稍微好一点、能喘口气"的年份（大运的燥寒平衡，大运交替的年份、解决病根的年份、忌神被冲走/合住的年份）'
}

const leiquText = `1. "比劫夺财"的雷（合伙人陷阱）：\n财为喜神，这辈子绝对、绝对不能跟朋友合伙，不能借钱给人，否则必破大财。\n当"财"在月柱或时柱被克时，不仅不能合伙，连团队里跟你平级的同事，你都要防着他们抢你的业绩/单子，你的钱都是被身边看似跟你最好的人分走的。\n财为忌神，比劫夺财反而是好事，代表合伙把烂摊子接盘了。\n\n2. "伤官见官"的雷：\n正官为喜，伤官见官为大忌，职场上最大的雷就是顶撞领导。哪怕领导错了，你也别当面指出来。学会闭嘴，是你升职加薪的唯一前提。\n\n3."制杀太过"的雷：\n手段太狠，如果八字火太旺把金克死了，职场上最大的雷是'用力过猛'。领导交给你一个整顿的任务，你恨不得把人全开除，搞得公司鸡飞狗跳，最后领导觉得你是个威胁，反而把你干掉。学会留一线，是你的保命符。\n\n4. "枭神夺食"的雷（内耗陷阱）：\n最大的问题是想太多做太少。遇到项目别追求完美，先干出个60分，再修改，否则你永远在焦虑中错失良机。你不需要完美方案，你需要的是'截止日期'。只要设置了deadline，你的食神就活了。\n\n5."财破印"的雷（短视贪婪陷阱）：\n这辈子最大的雷就是'因小失大'。为了赚点快钱（或者为了那点提成/副业），把主业给扔了，或者把你在公司的口碑搞臭了。记住，你的大钱都在'印'（平台/口碑）上，千万别干杀鸡取卵的事！\n\n6. "官杀无制化"的雷（背锅侠/抑郁症陷阱）：\n职场上最大的雷是'不懂拒绝，全盘皆收'。领导塞给你什么烂摊子你都接，最后出了事，全是你的锅（背锅侠）。遇到不合理的要求，哪怕装病、装傻，也绝对不能大包大揽，否则你会被压力直接压出身体疾病！\n\n7. "冲"的雷（环境陷阱）：\n如果冲掉的是忌神（比如忌神子水，被午火冲掉），每次换工作、每次折腾，看着很惊险，但最后都因祸得福，这是你逼自己突破的基因。\n如果冲掉的是喜用神（比如用神午火，被子水冲掉），很难在一个地方安定下来，而且每次冲动换行/换城市，90%都是往火坑里跳，越折腾越差。\n\n8."自刑"（如辰刑辰、午刑午）的雷（内耗自毁陷阱）：\n最大的雷不是别人，是你自己。一件事情没做好，你能内耗三个月；领导一个眼神，你能脑补出一部电视剧。你的职场能量，90%都被你自己的'精神内耗'给吃光了。学会'钝感力'，是你翻盘的唯一出路。`

const isStrong = ref(true)

const step1Options = ['食神', '伤官', '正财', '偏财', '正官', '七杀', '正印', '偏印', '比肩', '劫财']
const step2Options = ['木', '火', '土', '金', '水']
const step3Options = ['年干', '月干', '日干', '时干', '年支', '月支', '日支', '时支']
const step4Options = ['身强', '身弱']
const step5Options = ['食伤旺', '食伤弱', '伤官旺', '伤官弱', '财星旺', '财星弱', '官杀旺', '官杀弱', '印星旺', '印星弱', '比劫旺', '比劫弱']
const step6Options = computed(() => isStrong.value ? step1Options : step1Options)
const step7Options = ['财星有根、不受克', '财星无根、被克泄']
const step8Options = ['官杀有印星化解', '官杀被制太过/无官杀']
const step9Options = ['食伤', '财星', '官杀', '印星', '比劫']
const step10Options = ['大运喜', '大运忌']

function getOptions(step: number): string[] {
  const map: Record<number, string[]> = {
    1: step1Options, 2: step2Options, 3: step3Options, 4: step4Options,
    5: step5Options, 6: step6Options.value, 7: step7Options, 8: step8Options,
    9: step9Options, 10: step10Options
  }
  return map[step] || []
}

function selectOption(step: number, val: string) {
  answers['step' + step] = val
  if (step === 4) {
    isStrong.value = val === '身强'
  }
}

function goNext(step: number) {
  const key = 'step' + step
  if (!answers[key]) { alert('请先选择一个选项'); return }
  if (step === 4) isStrong.value = answers[key] === '身强'
  if (step < totalSteps) {
    currentStep.value = step + 1
    window.scrollTo(0, 0)
  }
}

function goBack(step: number) {
  if (step > 1) {
    currentStep.value = step - 1
    window.scrollTo(0, 0)
  }
}

function showSummary() {
  for (let i = 1; i <= 10; i++) {
    const key = 'step' + i
    if (!answers[key]) { alert('请完成所有题目后再查看总结'); return }
  }
  stage.value = 'result'
  window.scrollTo(0, 0)
}

const texts = computed(() => ({
  step1: jobTexts[answers.step1] || '',
  step2: industryTexts[answers.step2] || '',
  step3: platformTexts[answers.step3] || '',
  step4: shenTexts[answers.step4] || '',
  step5: modeTexts[answers.step5] || '',
  step6: mentalTexts[(answers.step6 || '') + '_' + (isStrong.value ? '强' : '弱')] || '',
  step7: wealthTexts[answers.step7] || '',
  step8: statusTexts[answers.step8] || '',
  step9: comfortTexts[answers.step9] || '',
  step10: dayunTexts[answers.step10] || ''
}))
const summaryItmes = computed(() => {
  const items = []
  for (let i = 1; i <= 10; i++) {
    const key = 'step' + i
    const val = answers[key]
    if (!val) continue
    items.push({
      num: i,
      label: stepLabels[key],
      val,
      text: texts.value[key] || ''
    })
  }
  return items
})

function restart() {
  Object.keys(answers).forEach(k => delete answers[k])
  currentStep.value = 1
  isStrong.value = true
  stage.value = 'question'
  window.scrollTo(0, 0)
}
</script>

<template>
  <div class="shiye-view">
    <div v-if="stage === 'question'">
      <div class="progress-wrap">
        <div class="progress-bar"><div class="progress-fill" :style="{ width: progressPct + '%' }"></div></div>
        <div class="progress-text">第 {{ currentStep }} / {{ totalSteps }} 题</div>
      </div>

      <!-- Step 1 -->
      <div v-show="currentStep === 1" class="card">
        <div class="step-title">① 工作武器 — 天干透干的十神是谁？</div>
        <div class="options">
          <button v-for="opt in getOptions(1)" :key="opt" class="opt-btn" :class="{ selected: answers.step1 === opt }" @click="selectOption(1, opt)">{{ opt }}</button>
        </div>
        <div class="nav"><div></div><button class="btn btn-primary" @click="goNext(1)">下一步</button></div>
      </div>

      <!-- Step 2 -->
      <div v-show="currentStep === 2" class="card">
        <div class="step-title">② 原局喜神定行业 — 你的行业五行属什么？</div>
        <div class="options">
          <button v-for="opt in getOptions(2)" :key="opt" class="opt-btn" :class="{ selected: answers.step2 === opt }" @click="selectOption(2, opt)">{{ opt }}</button>
        </div>
        <div class="nav"><button class="btn" @click="goBack(2)">上一步</button><button class="btn btn-primary" @click="goNext(2)">下一步</button></div>
      </div>

      <!-- Step 3 -->
      <div v-show="currentStep === 3" class="card">
        <div class="step-title">③ 工作武器在地支的位置 — 你的工作平台？</div>
        <div class="options">
          <button v-for="opt in getOptions(3)" :key="opt" class="opt-btn" :class="{ selected: answers.step3 === opt }" @click="selectOption(3, opt)">{{ opt }}</button>
        </div>
        <div class="nav"><button class="btn" @click="goBack(3)">上一步</button><button class="btn btn-primary" @click="goNext(3)">下一步</button></div>
      </div>

      <!-- Step 4 -->
      <div v-show="currentStep === 4" class="card">
        <div class="step-title">④ 身强身弱 — 你在团队中的角色？</div>
        <div class="options">
          <button v-for="opt in getOptions(4)" :key="opt" class="opt-btn" :class="{ selected: answers.step4 === opt }" @click="selectOption(4, opt)">{{ opt }}</button>
        </div>
        <div class="nav"><button class="btn" @click="goBack(4)">上一步</button><button class="btn btn-primary" @click="goNext(4)">下一步</button></div>
      </div>

      <!-- Step 5 -->
      <div v-show="currentStep === 5" class="card">
        <div class="step-title">⑤ 看透干坐下的地支—工作模式</div>
        <div class="options">
          <button v-for="opt in getOptions(5)" :key="opt" class="opt-btn" :class="{ selected: answers.step5 === opt }" @click="selectOption(5, opt)">{{ opt }}</button>
        </div>
        <div class="nav"><button class="btn" @click="goBack(5)">上一步</button><button class="btn btn-primary" @click="goNext(5)">下一步</button></div>
      </div>

      <!-- Step 6 -->
      <div v-show="currentStep === 6" class="card">
        <div class="step-title">⑥ 看透干坐下的地支—你的抗压能力与心理状态？</div>
        <div class="options">
          <button v-for="opt in getOptions(6)" :key="opt" class="opt-btn" :class="{ selected: answers.step6 === opt }" @click="selectOption(6, opt)">{{ opt }}</button>
        </div>
        <div class="nav"><button class="btn" @click="goBack(6)">上一步</button><button class="btn btn-primary" @click="goNext(6)">下一步</button></div>
      </div>

      <!-- Step 7 -->
      <div v-show="currentStep === 7" class="card">
        <div class="step-title">⑦ 财富天花板</div>
        <div class="options">
          <button v-for="opt in getOptions(7)" :key="opt" class="opt-btn" :class="{ selected: answers.step7 === opt }" @click="selectOption(7, opt)">{{ opt }}</button>
        </div>
        <div class="nav"><button class="btn" @click="goBack(7)">上一步</button><button class="btn btn-primary" @click="goNext(7)">下一步</button></div>
      </div>

      <!-- Step 8 -->
      <div v-show="currentStep === 8" class="card">
        <div class="step-title">⑧ 地位天花板</div>
        <div class="options">
          <button v-for="opt in getOptions(8)" :key="opt" class="opt-btn" :class="{ selected: answers.step8 === opt }" @click="selectOption(8, opt)">{{ opt }}</button>
        </div>
        <div class="nav"><button class="btn" @click="goBack(8)">上一步</button><button class="btn btn-primary" @click="goNext(8)">下一步</button></div>
      </div>

      <!-- Step 9 -->
      <div v-show="currentStep === 9" class="card">
        <div class="step-title">⑨ 日支—工作舒适区</div>
        <div class="options">
          <button v-for="opt in getOptions(9)" :key="opt" class="opt-btn" :class="{ selected: answers.step9 === opt }" @click="selectOption(9, opt)">{{ opt }}</button>
        </div>
        <div class="nav"><button class="btn" @click="goBack(9)">上一步</button><button class="btn btn-primary" @click="goNext(9)">下一步</button></div>
      </div>

      <!-- Step 10 -->
      <div v-show="currentStep === 10" class="card">
        <div class="step-title">⑩ 大运流年分析 — 大运是喜还是忌？</div>
        <div class="options">
          <button v-for="opt in getOptions(10)" :key="opt" class="opt-btn" :class="{ selected: answers.step10 === opt }" @click="selectOption(10, opt)">{{ opt }}</button>
        </div>
        <div class="nav"><button class="btn" @click="goBack(10)">上一步</button><button class="btn btn-primary" @click="showSummary">查看总结</button></div>
      </div>
    </div>

    <!-- Result -->
    <div v-if="stage === 'result'" class="card">
      <h2 class="summary-title">总结归纳</h2>
      <div v-for="item in summaryItmes" :key="item.num" class="summary-block">
        <div class="summary-title"><span class="summary-num">{{ item.num }}</span>{{ item.label }}：<strong>{{ item.val }}</strong></div>
        <div v-if="item.text" class="summary-body">{{ item.text }}</div>
      </div>
      <div class="summary-block">
        <div class="summary-title"><span class="summary-num">!</span>引动职场雷区</div>
        <div class="summary-body">{{ leiquText }}</div>
      </div>
      <button class="btn btn-primary restart-btn" @click="restart">重新测试</button>
    </div>
  </div>
</template>

<style scoped>
.shiye-view { max-width: 720px; margin: 0 auto; padding: 30px 20px; }

.progress-wrap { margin-bottom: 28px; }
.progress-bar { height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--ink-dark); border-radius: 3px; transition: width .3s; }
.progress-text { text-align: right; font-size: 12px; color: #999; margin-top: 4px; }

.step-title { font-size: 17px; font-weight: 600; margin-bottom: 18px; }
.options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px; }
.opt-btn { display: block; width: 100%; padding: 12px 16px; border: 1px solid #ddd; border-radius: 6px; background: #fff; font-size: 15px; cursor: pointer; text-align: left; transition: all .15s; }
.opt-btn:hover { border-color: var(--ink-dark); background: #fafafa; }
.opt-btn.selected { border-color: var(--ink-dark); background: var(--ink-dark); color: #fff; }

.nav { display: flex; justify-content: space-between; margin-top: 24px; }

.summary-title { font-size: 19px; margin-bottom: 20px; text-align: center; }
.summary-block { background: #fff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 12px 14px; margin-bottom: 10px; }
.summary-block .summary-title { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 4px; text-align: left; }
.summary-num { display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; background: var(--ink-dark); color: #fff; border-radius: 50%; font-size: 12px; margin-right: 6px; }
.summary-body { font-size: 13px; color: #555; line-height: 1.9; white-space: pre-line; padding-left: 28px; }

.restart-btn { display: block; margin: 30px auto 0; padding: 12px 40px; font-size: 15px; }
</style>
