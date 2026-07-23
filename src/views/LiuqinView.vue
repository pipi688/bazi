<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const stage = ref<'question' | 'result'>('question')
const currentPage = ref(0)

interface Option {
  value: string
  label: string
}

interface DataItem {
  title: string
  desc: string
  type: 'single' | 'multi'
  options: Option[]
}

const data: Record<string, DataItem> = {
  gender: {
    title: '选择性别',
    desc: '请先选择您的性别',
    type: 'single',
    options: [
      { value: 'male', label: '男' },
      { value: 'female', label: '女' }
    ]
  },
  motherStar: {
    title: '母亲星状态',
    desc: '请选择母亲星的状态',
    type: 'single',
    options: [
      { value: 'yin_xi_wang', label: '印星为喜神，印星旺' },
      { value: 'yin_xi_ruo', label: '印星为喜神，印星弱' },
      { value: 'yin_ji_wang', label: '印星为忌神，印星旺' },
      { value: 'yin_ji_ruo', label: '印星为忌神，印星弱' }
    ]
  },
  motherPalace: {
    title: '年支—母亲宫状态',
    desc: '请选择年支（母亲宫）的星神属性',
    type: 'single',
    options: [
      { value: 'yin_xi', label: '印星喜神' },
      { value: 'yin_ji', label: '印星忌神' },
      { value: 'cai_xi', label: '财星喜神' },
      { value: 'cai_ji', label: '财星忌神' },
      { value: 'shishang_xi', label: '食伤喜神' },
      { value: 'shishang_ji', label: '食伤忌神' },
      { value: 'guansha_xi', label: '官杀喜神' },
      { value: 'guansha_ji', label: '官杀忌神' },
      { value: 'bijie_xi', label: '比劫喜神' },
      { value: 'bijie_ji', label: '比劫忌神' }
    ]
  },
  motherXingChongHeHuiHai: {
    title: '母亲星的刑冲合会害',
    desc: '请选择母亲星所受到的刑冲合会害影响（可多选）',
    type: 'multi',
    options: [
      { value: 'chong', label: '被冲' },
      { value: 'san_hui', label: '被三会' },
      { value: 'he', label: '被合' },
      { value: 'he_zou', label: '被合走' },
      { value: 'he_ban', label: '被合绊' },
      { value: 'xing', label: '被刑' },
      { value: 'hai', label: '被害' },
      { value: 'wu_ming_xian_shou_shang', label: '无明显受伤' }
    ]
  },
  motherStarAndPalace: {
    title: '母亲星与父母宫组合',
    desc: '请选择母亲星与父母宫的组合关系',
    type: 'single',
    options: [
      { value: 'star_xi_palace_xi', label: '母亲星为喜 + 父母宫为喜' },
      { value: 'star_xi_palace_ji', label: '母亲星为喜 + 父母宫为忌' },
      { value: 'star_ji_palace_xi', label: '母亲星为忌 + 父母宫为喜' },
      { value: 'star_ji_palace_ji', label: '母亲星为忌 + 父母宫为忌' }
    ]
  },
  parentPalaceXiJi: {
    title: '父母宫喜忌',
    desc: '请选择父母宫的喜忌',
    type: 'single',
    options: [
      { value: 'xi', label: '父母宫为喜' },
      { value: 'ji', label: '父母宫为忌' }
    ]
  },
  fatherStar: {
    title: '父亲星状态',
    desc: '请选择父亲星的状态',
    type: 'single',
    options: [
      { value: 'cai_xi_wang', label: '财星为喜神，财星旺' },
      { value: 'cai_xi_ruo', label: '财星为喜神，财星弱' },
      { value: 'cai_ji_wang', label: '财星为忌神，财星旺' },
      { value: 'cai_ji_ruo', label: '财星为忌神，财星弱' }
    ]
  },
  fatherPalace: {
    title: '年支—父亲宫状态',
    desc: '请选择年支（父亲宫）的星神属性',
    type: 'single',
    options: [
      { value: 'cai_xi', label: '财星喜神' },
      { value: 'cai_ji', label: '财星忌神' },
      { value: 'guansha_xi', label: '官杀喜神' },
      { value: 'guansha_ji', label: '官杀忌神' },
      { value: 'bijie_xi', label: '比劫喜神' },
      { value: 'bijie_ji', label: '比劫忌神' }
    ]
  },
  fatherXingChongHeHuiHai: {
    title: '父亲星的刑冲合会害',
    desc: '请选择父亲星所受到的刑冲合会害影响（可多选）',
    type: 'multi',
    options: [
      { value: 'chong', label: '被冲' },
      { value: 'san_hui', label: '被三会' },
      { value: 'he', label: '被合' },
      { value: 'he_zou', label: '被合走' },
      { value: 'he_ban', label: '被合绊' },
      { value: 'xing', label: '被刑' },
      { value: 'hai', label: '被害' },
      { value: 'wu_ming_xian_shou_shang', label: '无明显受伤' }
    ]
  },
  fatherStarAndPalace: {
    title: '父亲星与父/母宫组合',
    desc: '请选择父亲星与父/母宫的组合关系',
    type: 'single',
    options: [
      { value: 'star_xi_palace_xi', label: '父亲星为喜 + 父/母宫为喜' },
      { value: 'star_xi_palace_ji', label: '父亲星为喜 + 父/母宫为忌' },
      { value: 'star_ji_palace_xi', label: '父亲星为忌 + 父/母宫为喜' },
      { value: 'star_ji_palace_ji', label: '父亲星为忌 + 父/母宫为忌' }
    ]
  },
  parentPalaceStatus: {
    title: '父/母宫状态',
    desc: '请选择父/母宫的刑冲合会害状态（可多选）',
    type: 'multi',
    options: [
      { value: 'san_hui', label: '父/母宫被三会' },
      { value: 'he', label: '父/母宫逢合' },
      { value: 'he_ban', label: '父/母宫被合绊' },
      { value: 'chong', label: '父/母宫逢冲' },
      { value: 'xing', label: '父/母宫逢刑' },
      { value: 'hai', label: '父/母宫逢害' }
    ]
  },
  siblingPalaceXiJi: {
    title: '兄妹朋友宫的喜忌',
    desc: '请选择兄妹朋友宫的喜忌',
    type: 'single',
    options: [
      { value: 'xi', label: '兄妹朋友宫为喜' },
      { value: 'ji', label: '兄妹朋友宫为忌' }
    ]
  },
  monthGanXiJi: {
    title: '月干是喜是忌',
    desc: '请选择月干的喜忌',
    type: 'single',
    options: [
      { value: 'xi', label: '月干喜神' },
      { value: 'ji', label: '月干忌神' }
    ]
  },
  monthGanStar: {
    title: '月干—表面上与兄妹朋友的相处',
    desc: '请选择月干所代表的星神',
    type: 'single',
    options: [
      { value: 'yin', label: '印星' },
      { value: 'cai', label: '财星' },
      { value: 'shishang', label: '食伤' },
      { value: 'guansha', label: '官杀' },
      { value: 'bijie', label: '比劫' }
    ]
  },
  monthZhiXiJi: {
    title: '月支是喜是忌',
    desc: '请选择月支的喜忌',
    type: 'single',
    options: [
      { value: 'xi', label: '月支喜神' },
      { value: 'ji', label: '月支忌神' }
    ]
  },
  monthZhiStar: {
    title: '月支—与兄妹朋友的真实利益关系',
    desc: '请选择月支所代表的星神',
    type: 'single',
    options: [
      { value: 'yin', label: '印星' },
      { value: 'cai', label: '财星' },
      { value: 'shishang', label: '食伤' },
      { value: 'guansha', label: '官杀' },
      { value: 'bijie', label: '比劫' }
    ]
  },
  childrenPalaceXiJi: {
    title: '子女宫是喜是忌',
    desc: '请选择子女宫的喜忌',
    type: 'single',
    options: [
      { value: 'xi', label: '子女宫是喜神' },
      { value: 'ji', label: '子女宫是忌神' }
    ]
  },
  hourGanXiJi: {
    title: '时干是喜是忌',
    desc: '请选择时干的喜忌',
    type: 'single',
    options: [
      { value: 'xi', label: '时干喜神' },
      { value: 'ji', label: '时干忌神' }
    ]
  },
  hourGanStar: {
    title: '时干—子女/下属的外在表现',
    desc: '请选择时干所代表的星神',
    type: 'single',
    options: [
      { value: 'yin', label: '印星' },
      { value: 'cai', label: '财星' },
      { value: 'shishang', label: '食伤' },
      { value: 'guansha', label: '官杀' },
      { value: 'bijie', label: '比劫' }
    ]
  },
  hourZhiXiJi: {
    title: '时支是喜是忌',
    desc: '请选择时支的喜忌',
    type: 'single',
    options: [
      { value: 'xi', label: '时支喜神' },
      { value: 'ji', label: '时支忌神' }
    ]
  },
  hourZhiStar: {
    title: '时支—子女/下属的内在本质',
    desc: '请选择时支所代表的星神',
    type: 'single',
    options: [
      { value: 'yin', label: '印星' },
      { value: 'cai', label: '财星' },
      { value: 'shishang', label: '食伤' },
      { value: 'guansha', label: '官杀' },
      { value: 'bijie', label: '比劫' }
    ]
  }
}

const resultsData: Record<string, Record<string, { text: string }>> = {
  motherStar: {
    yin_xi_wang: { text: '本质：母亲极其能干，且给你无尽的爱与包容。\n画像：母亲可能是女强人，或者学历高、修养好。她不仅把你照顾得无微不至，还能在你遇到任何困难时，给你最智慧的指导和强大的心理支撑。你是母女/母子关系中的大赢家。' },
    yin_xi_ruo: { text: '本质：母亲很爱你，但性格软弱，保护不了你。\n画像：母亲是个传统的好女人，隐忍、善良。但在家里没什么话语权（可能被你爸压制）。她只能偷偷给你塞零花钱，或者在你被骂时偷偷抹眼泪，无法站出来替你挡刀。' },
    yin_ji_wang: { text: '本质：母亲的爱变成了极强的控制欲，把你逼疯。\n画像：母亲极其强势、固执，打着"都是为了你好"的旗号，全方位干涉你的学业、工作、婚姻。她不让你离开她半步，用道德绑架你，让你感到极其压抑、甚至抑郁。' },
    yin_ji_ruo: { text: '本质：母亲思想消极，不仅帮不上忙，还天天传递负能量。\n画像：母亲可能身体不好，或者经常抱怨、怨天尤人。她不是想控制你，但她整天愁眉苦脸，或者过度担忧，把她的焦虑情绪全传染给你。' }
  },
  motherPalace: {
    yin_xi: { text: '父母极其疼爱你，给你极大的精神支持和兜底。旺则效果加倍；弱则心有余力不足；受制则父母有爱但表达受阻。' },
    yin_ji: { text: '父母过度保护，把你养成了废人，或者用"孝道"道德绑架你。旺则效果加倍；弱则心有余力不足；受制则父母有爱但表达受阻。' },
    cai_xi: { text: '父母能给你提供丰厚的物质基础。旺则家境优渥；弱则赚钱辛苦；受制则父母因财务问题焦虑。' },
    cai_ji: { text: '父母为了赚钱忽视了你，或者父母因为金钱问题拖累你。旺则效果加倍；弱则心有余力不足；受制则父母因财务问题焦虑。' },
    shishang_xi: { text: '父母思想开明，绝不控制你，鼓励你自由发展。旺则效果加倍；弱则心有余力不足；受制则父母想管但管不住。' },
    shishang_ji: { text: '父母过度干预、对你的选择指手画脚。旺则效果加倍；弱则心有余力不足；受制则父母想管但管不住。' },
    guansha_xi: { text: '有权威、能撑腰、有社会地位。旺则效果加倍；弱则心有余力不足；受制则压不住你。' },
    guansha_ji: { text: '父母极其严厉、控制欲极强，给你带来巨大的精神压抑。旺则效果加倍；弱则心有余力不足；受制则压不住你。' },
    bijie_xi: { text: '父母跟你是朋友式相处、讲义气、支持你社交。旺则效果加倍；弱则心有余力不足；受制则压不住你。' },
    bijie_ji: { text: '父母好面子、固执、爱瞎折腾，甚至会抢夺你的资源。旺则效果加倍；弱则心有余力不足；受制则压不住你。' }
  },
  motherXingChongHeHuiHai: {
    chong: { text: '母亲身体虚弱或脾气暴躁；家庭环境频繁搬迁（印代表家、房子）；母子之间容易发生激烈的价值观冲突，比如母亲强行干涉，孩子激烈反抗导致决裂。' },
    san_hui: { text: '会局是喜神：代表命主出生在大家庭，母亲背后有强大的娘家支撑。会局是忌神：代表母亲过度包办，命主的职业选择、婚姻全由母亲一手操控，没有自我。' },
    he: { text: '合来的是喜用神：代表跟父母关系极其亲密，父母不仅是亲人，还是贵人，能给孩子极大的财富、资源或精神支持。合来的是忌神：代表父母极其溺爱孩子，但这种爱反而害了孩子，或者孩子被父母死死拴在身边，无法独立发展。' },
    he_zou: { text: '父母星被合走：代表父母不在身边。可能是父母离异后跟着别人走了，或者是父母长期在外地工作，或者父母把精力全放在了别的兄弟姐妹身上，对孩子的关注度被合走了。' },
    he_ban: { text: '母亲陷入一种极其糟糕的婚姻或家庭关系里，想离离不掉，想过过不好。母亲把自己的"怨气"完全倾泻在孩子身上，用"我都是为了你才不离婚的"来绑架孩子。' },
    xing: { text: '母亲极其容易焦虑、神经质、过度操心（把"爱"变成了"刑"）；母亲经常抱怨、唠叨，用道德绑架孩子；家里有一种沉闷、压抑、让人喘不过气的氛围。' },
    hai: { text: '母亲在教育孩子的问题上，经常暗中使坏（比如答应的事背后反悔）；婆媳关系极度恶劣，母亲在孩子面前说奶奶坏话，挑拨离间；母亲容易有隐秘的心理疾病。' }
  },
  motherStarAndPalace: {
    star_xi_palace_xi: { text: '母亲本身是个很好、很正能量的人，且家庭环境也配合。她是你的贵人，能实实在在帮到你。' },
    star_xi_palace_ji: { text: '母亲本身人品好，心里也是为你好的，但由于某种客观原因（比如聚少离多、或者对方身体不好），你们无法长久相伴，或者她帮不到你。' },
    star_ji_palace_xi: { text: '母亲性格有问题（控制狂或负能量），但家庭环境还不错。你可能被寄养、或者早早离家独立，反而因祸得福，逃离了母亲的控制。' },
    star_ji_palace_ji: { text: '母亲不仅帮不到你，还会严重拖累你（经济上或精神上）。你们三观不合，经常吵架，甚至互相嫌弃。' }
  },
  parentPalaceXiJi: {
    xi: { text: '1. 物质加持：父母不仅给命主提供了优渥的童年，在命主成年后（买房、创业、升职关键期），父母总能神奇地拿出"压箱底的钱"或"关键人脉"来救急，属于"家里有矿，心里不慌"。\n2. 情绪价值：父母是命主的"定海神针"，无论外面风浪多大，只要回家吃顿饭，能量就恢复了。父母的认知水平较高，不会拖累命主，反而能给出高明的建议。\n3. 阶层跃迁：这类命主天生自带"起跑线优势"，宫位为喜用，代表祖上积德，父母的事业高度会直接成为命主进入更高圈层的跳板。' },
    ji: { text: '1. 家庭氛围是"消耗型"的：家里可能很豪华，但你一踏进家门就觉得胸闷、压抑。可能是母亲过度的唠叨（印星忌神在日支），或者是父亲极强的控制欲。你在家里连呼吸都要小心翼翼。\n2. 父母的婚姻状态是你内心的阴影：父母可能没离婚，但两人之间的冷暴力、互相折磨让你对整个婚姻制度产生恐惧。\n3. 父母成为你的"天花板"：不是给你托底，而是拖你的后腿。你的人生重大决策（选专业、结婚、创业）都会受到父母的强烈反对或消极影响。' }
  },
  fatherStar: {
    cai_xi_wang: { text: '本质：父亲不仅有钱，还极其靠谱，是你可以仰仗的终身靠山。\n画像：父亲可能是成功的企业家、高管，或者手握丰富人脉的实力派。他不仅给你钱，还能给你提供战略级的指导。他为你铺好了路，甚至帮你扫清了障碍。你是名副其实的"富二代/官二代"心态，底气十足。' },
    cai_xi_ruo: { text: '本质：父亲人品极好，很爱你，但心有余而力不足。\n画像：父亲是个老实、本分、顾家的人。他恨不得把心掏给你，但受限于能力、机遇或健康，他赚不到大钱，也帮不了你大忙。你心疼他，但也知道不能指望他替你遮风挡雨。' },
    cai_ji_wang: { text: '本质：父亲不仅不帮你，反而成了家庭的灾难或你的巨大拖累。\n画像：父亲极度贪婪、好赌、或者极其重男轻女/自私自利。他不仅不给你钱，反而可能掏空家底，或者天天逼着你给他兜底。他在家里就像个霸道的土皇帝，让你感到窒息和恐惧。' },
    cai_ji_ruo: { text: '本质：父亲本事不大，但毛病不少，经常给你添小堵。\n画像：父亲可能有些小算计、小市侩，或者有点大男子主义但没那个本事。他不会毁了你，但三句话不离钱，或者经常因为一些small利益跟你斤斤计较，让你觉得心累、没面子。' }
  },
  fatherPalace: {
    cai_xi: { text: '父母能给你提供丰厚的物质基础。旺则家境优渥；弱则赚钱辛苦；受制则父母因财务问题焦虑。' },
    cai_ji: { text: '父母为了赚钱忽视了你，或者父母因为金钱问题拖累你。旺则效果加倍；弱则心有余力不足；受制则父母因财务问题焦虑。' },
    guansha_xi: { text: '有权威、能撑腰、有社会地位。旺则效果加倍；弱则心有余力不足；受制则压不住你。' },
    guansha_ji: { text: '父母极其严厉、控制欲极强，给你带来巨大的精神压抑。旺则效果加倍；弱则心有余力不足；受制则压不住你。' },
    bijie_xi: { text: '父母跟你是朋友式相处、讲义气、支持你社交。旺则效果加倍；弱则心有余力不足；受制则压不住你。' },
    bijie_ji: { text: '父母好面子、固执、爱瞎折腾，甚至会抢夺你的资源。旺则效果加倍；弱则心有余力不足；受制则压不住你。' }
  },
  fatherXingChongHeHuiHai: {
    chong: { text: '父亲的健康容易有突发性的疾病（如心脑血管）；父亲的财运大起大落，容易破产；父母极其容易离婚（父亲离开家）；或者父亲的工作性质导致常年在外，聚少离多。' },
    san_hui: { text: '会局是喜神，父亲是生意场上的老江湖，人脉极广。会局是忌神，父亲控制欲极强，像一座大山一样压得孩子喘不过气，孩子一辈子都在原生家庭的阴影里打转。' },
    he: { text: '合来的是喜用神：代表跟父母关系极其亲密，父母不仅是亲人，还是贵人。父母能给孩子极大的财富、资源或精神支持。合来的是忌神：代表父母极其溺爱孩子，但这种爱反而害了孩子。或者孩子被父母死死拴在身边，无法独立发展。' },
    he_zou: { text: '父母星被合走：代表父母不在身边。可能是父母离异后跟着别人走了，或者是父母长期在外地工作，或者父母把精力全放在了别的兄弟姐妹身上，对孩子的关注度被合走了。' },
    he_ban: { text: '父亲极其倒霉，被某个人or某件事死死缠住。比如父亲染上赌博被高利贷缠身，或者父亲生了一场长年卧床的病。父亲不仅帮不了孩子，反而成了孩子一辈子甩不掉的"大包袱"。' },
    xing: { text: '父亲可能有长期治不好的慢性病；父亲性格极其固执、偏激，在家里经常发无名火，让人压抑；父亲容易惹上官司纠纷（刑也代表执法机构）。' },
    hai: { text: '父亲容易遇到小人算计、被骗钱；父亲可能有隐秘的婚外情，导致家庭名存实亡；父亲对孩子表面上过得去，但内心其实偏心其他兄弟姐妹。' }
  },
  fatherStarAndPalace: {
    star_xi_palace_xi: { text: '这个亲人是真心的，能实实在在帮到你。你们感情深厚，互相旺对方。' },
    star_xi_palace_ji: { text: '这个亲人本身是个好人，心里也是为你好的，但由于某种客观原因（比如聚少离多、或者对方身体不好），你们无法长久相伴，或者他帮不到你。' },
    star_ji_palace_xi: { text: '你们可能有条件住在一起，或者表面上家庭和睦，但内心觉得对方很烦，对方的性格让你很难受。' },
    star_ji_palace_ji: { text: '这个亲人不仅帮不到你，还会严重拖累你（经济上或精神上）。你们三观不合，经常吵架，甚至互相嫌弃。' }
  },
  parentPalaceStatus: {
    san_hui: { text: '会局是喜神：出生在非常庞大的家族企业、或者几代同堂的大家族里。父母在家族里有一定地位，家庭环境极其热闹、资源丰富，孩子从小见惯了大场面。会局是忌神："失去自我"。孩子的个人意志被庞大的家族规矩、宗族观念彻底淹没。父母为了大家族的利益，往往牺牲小家庭的感受。孩子觉得不是父母的专属孩子，而是家族的某个工具。' },
    he: { text: '合来的是喜用神：大吉。家庭环境极其温馨，父母的感情很好，家是孩子最大的充电站。合来的是忌神：羁绊。家变成了一张网，父母控制欲极强，以"爱"的名义把孩子死死拴在家里。' },
    he_ban: { text: '父母陷入了"烂尾的婚姻"里。家不是避风港，而是一个无底洞，不断吸食孩子的能量。孩子长大后，往往要花极大的力气去"拯救"原生家庭。' },
    chong: { text: '家庭环境：房子缺乏安宁感，经常搬家或装修。父母婚姻：极其容易破裂，容易吵架、分居、甚至离婚。孩子从小觉得家不是休息的地方，而是战场或中转站。' },
    xing: { text: '家庭环境：家里可能很干净、很有钱，但气氛极其压抑，像精美的笼子。父母婚姻：凑合着过，互相折磨。孩子回到家就觉得胸口闷，想要逃离。' },
    hai: { text: '家庭环境：表面上看起来和睦，但底下暗流涌动。父母一方经常在孩子面前说另一方坏话，或者家里总有莫名其妙的小人纠纷（比如邻里不和、亲戚借钱不还等烦心事）。\n父母婚姻：同床异梦。父母之间缺乏真正的信任，互相防备，甚至可能有一方有隐秘的出轨行为，导致家庭关系暗地里已经千疮百孔。\n对孩子的心理："不信任感"。孩子从小目睹大人的虚伪和算计，觉得人性复杂，很难轻易相信别人，防备心极重。' }
  },
  siblingPalaceXiJi: {
    xi: { text: '1.童年环境：亲兄弟姐妹之间感情深厚，且能力互补，在人生最艰难的节点，往往是兄弟姐妹第一个冲出来拉你一把。\n2.朋友质量：你的朋友圈不是酒肉朋友，而是能交心、共患难的挚友。\n3.职场环境：你极容易遇到好的合作伙伴、同事或领导。' },
    ji: { text: '1.童年环境：兄弟姐妹之间反目成仇，或者为了争家产打得头破血流。\n2.朋友质量：你身边围绕的都是消耗你的人，酒肉朋友居多，关键时刻没人帮你。\n3.职场环境：你极容易遇到抢功劳的同事。绝对不能跟朋友合伙做生意！你只适合单打独斗。' }
  },
  monthGanStar: {
    'yin_xi': { text: '看起来很有学问、有涵养，脾气温和，好说话。在同事眼里，你是个可以请教问题、有耐心、不争不抢的人。' },
    'yin_ji': { text: '显得有些端着架子、不合群，说话文绉绉的让人有距离感；或者显得极其没有主见，遇到事就"我不知道，听你们的"。' },
    'cai_xi': { text: '看起来很懂生活、很会来事，穿着讲究，出手比较大方。在朋友圈里，你是个很接地气、懂得利益交换、经常请大家喝奶茶的人。' },
    'cai_ji': { text: '三句不离钱，显得极其现实、市侩。在同事眼里，你是个"无利不起早"、"算账算得特别清"、"爱占小便宜"的人。' },
    'shishang_xi': { text: '极其聪明，口才极佳，幽默风趣，总是有很多新奇的点子。在圈子里，你是气氛组，大家都喜欢跟你聊天。' },
    'shishang_ji': { text: '嘴碎，爱抱怨，喜欢显摆自己，说话不过脑子（毒舌）。在同事眼里，你是个"站着说话不腰疼"、"只会吹牛不干活"的人。' },
    'guansha_xi': { text: '显得极其自律、守时、做事一丝不苟、有规矩。在平辈眼里，你是个值得信赖、能扛事、有职业素养的人。' },
    'guansha_ji': { text: '表面顺从、认命，唯唯诺诺，开口闭口"领导说……"、"公司规定……"。像个没有感情的打工机器。' },
    'bijie_xi': { text: '显得极其豪爽、讲义气、有号召力。你是朋友圈里组织聚会的人，有啥好事愿意分享，显得很有活力、很直爽。' },
    'bijie_ji': { text: '脾气很大，喜欢在人群中刷存在感，别人说啥你都要反驳一句。显得很自我中心，不照顾别人感受。' }
  },
  monthZhiStar: {
    'yin_xi': { text: '这个圈子的本质不是拼体力，而是拼"背景、学历、资质"。大家暗地里都有一条看不见的线连着（比如都是名校校友、都有某个大领导罩着）。' },
    'yin_ji': { text: '这个圈子表面不说，暗地里极度讲究"站队、资历、辈分"。没有硬后台的人在这里寸步难行。' },
    'cai_xi': { text: '这个圈子的唯一信仰就是"搞钱"。大家不搞虚的，暗地里的规则极其清晰：谁拉来的业务，谁分多少钱，白纸黑字算得清清楚楚。' },
    'cai_ji': { text: '同样是谈钱，但这里的钱是"带血"的。圈子暗地里全是算计、克扣、甚至贪腐。' },
    'shishang_xi': { text: '这个圈子里没人关心你会不会拍马屁，暗地里只认一样东西：硬实力（代码、设计、方案）。' },
    'shishang_ji': { text: '这是一个极度让人心累的圈子。大家表面上不说话，暗地里互相觉得对方是傻X，只会看笑话而绝不帮忙。' },
    'guansha_xi': { text: '这个圈子的等级极其森严，暗地里充满了PUA、穿小鞋、权力倾轧。' },
    'guansha_ji': { text: '这是一个让人做噩梦的圈子。表面上大家客客气气，暗地里却充满了恶毒的告密、孤立、造谣。' },
    'bijie_xi': { text: '这是一个极其内卷、竞争惨烈的圈子，但因为你是喜神，你足够强，你在这个绞肉机里是"头狼"。' },
    'bijie_ji': { text: '这是一个极其可怕的圈子。你赚到的每一分钱，暗地里都有一群眼睛盯着，想方设法来分一杯羹。' }
  },
  childrenPalaceXiJi: {
    xi: { text: '子女宫为喜：子女孝顺、有出息，晚年幸福。子女不仅能在经济上给你支持，精神上也给你极大的慰藉。你与子女的关系是你人生中最温暖的港湾。' },
    ji: { text: '子女宫为忌：子女可能不孝、败家，或者与你关系疏远。晚年不仅得不到子女的照顾，反而可能被子女拖累，为他们操心劳神。' }
  },
  hourGanStar: {
    'yin_xi': { text: '子女/下属在外人面前表现得极其有教养、听话、懂得关心长辈。他们可能学历不错，或者从事教育、体制内等有面子的工作。' },
    'yin_ji': { text: '子女/下属在外人眼里显得没什么冲劲、太老实、或者总黏着你。别人会在背后指指点点。' },
    'cai_xi': { text: '子女/下属很会来事，逢年过节大包小包买好东西来看你，开的车、穿的牌子都很体面。别人一见到你，都会因为你的孩子/下属而对你高看一眼。' },
    'cai_ji': { text: '子女/下属在外人眼里显得极其市侩、钻钱眼里了。或者虽然有钱，但对外人态度傲慢，显得很势利。' },
    'shishang_xi': { text: '子女/下属极其活泼可爱，嘴跟抹了蜜一样甜，或者在外人面前能歌善舞、展现出某项惊人的特长。' },
    'shishang_ji': { text: '子女/下属在外面疯疯癫癫、不懂分寸、乱开玩笑，或者总是因为多嘴多舌惹出乱子，让你去给别人赔礼道歉。' },
    'guansha_xi': { text: '子女/下属在外头有头有脸，可能是个小领导，或者穿着制服。外人一见到你，都会因为你的孩子/下属而对你高看一眼。' },
    'guansha_ji': { text: '子女/下属在外头是个小头目，但对你却像对待下属一样呼来喝去。或者外人看到你的孩子/下属对你极其严厉、冷漠。' },
    'bijie_xi': { text: '子女/下属跟你在一起时，没有代沟，勾肩搭背，称兄道弟。外人看着觉得你们家氛围真好。' },
    'bijie_ji': { text: '子女/下属在外人面前对你毫无敬畏之心，甚至当众顶撞你、打断你说话，或者狐假虎威打着你的旗号在外面惹事。' }
  },
  hourZhiStar: {
    'yin_xi': { text: '孩子/下属性格沉稳、有学问、重感情。晚年极其幸福，孩子无微不至地照顾你。' },
    'yin_ji': { text: '极度依赖你，缺乏独立性，甚至有些懒惰。典型的"啃老"或者"拖累"，你成了他们的提款机。' },
    'cai_xi': { text: '孩子/下属极其务实、会赚钱、懂理财。他们表达爱的方式就是"给钱"。晚年你不仅不缺钱，还能住他们买的大房子。' },
    'cai_ji': { text: '孩子/下属极其物质、败家，或者因为债务、生意失败把你拖下水。你成了孩子的"提款机"。' },
    'shishang_xi': { text: '孩子多才多艺、嘴巴甜、性格开朗。你的晚年绝对不会寂寞！他们把家里布置得像游乐园。' },
    'shishang_ji': { text: '孩子极其任性、胡作非为、好逸恶劳。他们是来"讨债"的，你晚年的大部分时间和金钱，都耗在给他们的烂摊子擦屁股上。' },
    'guansha_xi': { text: '孩子/下属极其有出息！大概率是当官的、大企业的高管。你晚年最大的享受是"面子"。' },
    'guansha_ji': { text: '孩子虽然可能有地位，但脾气极其暴躁、大男子/大女子主义。你在自己家里都活得小心翼翼，毫无晚年尊严可言。' },
    'bijie_xi': { text: '孩子/下属性格刚强、极其独立、有能力。你们之间没有传统的"依附感"，更像平等的哥们儿。你晚年很有自己的圈子，不依赖孩子，潇洒自在。' },
    'bijie_ji': { text: '孩子/下属极其自我、叛逆、不孝。典型的"养不熟的白眼狼"，他们不仅不赡养你，还可能为了家产跟你大打出手。' }
  }
}

const pageKeys = Object.keys(data)
const pairMap: Record<string, string> = {
  monthGanXiJi: 'monthGanStar',
  monthZhiXiJi: 'monthZhiStar',
  hourGanXiJi: 'hourGanStar',
  hourZhiXiJi: 'hourZhiStar'
}
const starToXiJi: Record<string, string> = {}
Object.keys(pairMap).forEach(k => { starToXiJi[pairMap[k]] = k })

const selections = reactive<Record<string, string | string[]>>({})

function toggleOption(key: string, value: string) {
  const item = data[key]
  if (item.type === 'multi') {
    if (!Array.isArray(selections[key])) selections[key] = []
    const arr = selections[key] as string[]
    const idx = arr.indexOf(value)
    if (idx === -1) {
      arr.push(value)
    } else {
      arr.splice(idx, 1)
    }
  } else {
    selections[key] = value
  }
}

function isSelected(key: string, value: string): boolean {
  const sel = selections[key]
  if (!sel) return false
  if (Array.isArray(sel)) return sel.includes(value)
  return sel === value
}

function goNext() {
  const key = pageKeys[currentPage.value]
  const item = data[key]
  const sel = selections[key]

  if (item.type === 'multi') {
    if (!sel || !Array.isArray(sel) || sel.length === 0) { alert('请至少选择一项'); return }
  } else {
    if (!sel) { alert('请先做出选择'); return }
  }

  if (currentPage.value < pageKeys.length - 1) {
    currentPage.value++
  } else {
    stage.value = 'result'
  }
}

function goBack() {
  if (currentPage.value > 0) currentPage.value--
}

function getOptionLabel(key: string, value: string): string {
  const item = data[key]
  const opt = item.options.find(o => o.value === value)
  return opt ? opt.label : value
}

const summaryHtml = computed(() => {
  let html = ''
  pageKeys.forEach((key, i) => {
    const sel = selections[key]
    if (!sel || (Array.isArray(sel) && sel.length === 0)) return

    if (pairMap[key] && selections[pairMap[key]]) return

    html += '<div class="summary-row">'
    html += `<span class="row-title">${i + 1}. ${data[key].title}：</span>`

    if (Array.isArray(sel)) {
      const labels = sel.map((v: string) => getOptionLabel(key, v))
      html += `<span class="row-value">${labels.join('、')}</span>`
      sel.forEach((v: string) => {
        if (resultsData[key] && resultsData[key][v] && resultsData[key][v].text) {
          html += `<div style="width:100%;margin-top:4px;color:#555;">${resultsData[key][v].text.replace(/\n/g, '<br>')}</div>`
        }
      })
    } else {
      const pairedXiJiKey = starToXiJi[key]
      if (pairedXiJiKey && selections[pairedXiJiKey]) {
        const xiJiLabel = getOptionLabel(pairedXiJiKey, selections[pairedXiJiKey] as string)
        const starLabel = getOptionLabel(key, sel as string)
        html += `<span class="row-value">${xiJiLabel} — ${starLabel}</span>`
        const xiJiVal = selections[pairedXiJiKey] as string
        const combinedKey = (sel as string) + '_' + xiJiVal
        if (resultsData[key] && resultsData[key][combinedKey] && resultsData[key][combinedKey].text) {
          html += `<span class="row-result"> ${resultsData[key][combinedKey].text}</span>`
        }
      } else {
        html += `<span class="row-value">${getOptionLabel(key, sel as string)}</span>`
        if (resultsData[key] && resultsData[key][sel as string] && resultsData[key][sel as string].text) {
          html += `<span class="row-result"> ${resultsData[key][sel as string].text.replace(/\n/g, '<br>')}</span>`
        }
      }
    }
    html += '</div>'
  })
  return html
})

function restart() {
  Object.keys(selections).forEach(k => delete selections[k])
  currentPage.value = 0
  stage.value = 'question'
}
</script>

<template>
  <div class="liuqin-view">
    <div class="header">
      <h1>六亲关系分析系统</h1>
      <p>依次选择各项，获取专属分析结果</p>
    </div>

    <!-- Question -->
    <div v-if="stage === 'question'" class="card">
      <div class="page-title">{{ currentPage + 1 }}. {{ data[pageKeys[currentPage]].title }}</div>
      <div class="page-desc">{{ data[pageKeys[currentPage]].desc }}</div>
      <div v-if="data[pageKeys[currentPage]].type === 'multi'" class="multi-tip">（可多选，请选择所有符合的项）</div>
      <div class="option-list">
        <div
          v-for="opt in data[pageKeys[currentPage]].options"
          :key="opt.value"
          class="option-item"
          :class="{
            selected: data[pageKeys[currentPage]].type === 'single' && isSelected(pageKeys[currentPage], opt.value),
            'multi-selected': data[pageKeys[currentPage]].type === 'multi' && isSelected(pageKeys[currentPage], opt.value)
          }"
          @click="toggleOption(pageKeys[currentPage], opt.value)"
        >
          <div class="option-text">
            <div class="label">{{ opt.label }}</div>
          </div>
        </div>
      </div>
      <div class="nav-buttons">
        <button v-if="currentPage > 0" class="btn btn-prev" @click="goBack">上一步</button>
        <div v-else></div>
        <button class="btn btn-next" @click="goNext">下一步</button>
      </div>
    </div>

    <!-- Result -->
    <div v-if="stage === 'result'" class="card">
      <div class="page-title">综合分析总结</div>
      <div class="page-desc">以下是您在所有步骤中的选择及对应分析结果</div>
      <div v-html="summaryHtml"></div>
      <button class="restart-btn" @click="restart">重新分析</button>
    </div>
  </div>
</template>

<style scoped>
.liuqin-view { max-width: 800px; margin: 0 auto; padding: 20px; }
.header { text-align: center; padding: 30px 0; background: #fff; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.header h1 { font-size: 24px; color: var(--ink-dark); margin-bottom: 10px; }
.header p { color: #7f8c8d; font-size: 14px; }

.page-title { font-size: 20px; color: var(--ink-dark); margin-bottom: 8px; padding-bottom: 12px; border-bottom: 2px solid var(--accent); }
.page-desc { color: #7f8c8d; font-size: 14px; margin-bottom: 20px; }

.option-list { display: flex; flex-direction: column; gap: 8px; }
.option-item { display: flex; align-items: center; padding: 12px 15px; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
.option-item:hover { border-color: var(--accent); background: #f0f8ff; }
.option-item.selected { border-color: var(--accent); background: #e8f4fd; }
.option-item.multi-selected { border-color: #27ae60; background: #e8f8f0; }
.option-text { flex: 1; }
.option-text .label { font-size: 15px; color: #2c3e50; }
.multi-tip { font-size: 12px; color: #e67e22; margin-bottom: 10px; }

.nav-buttons { display: flex; justify-content: space-between; margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; }
.btn { padding: 10px 30px; border: none; border-radius: 6px; font-size: 15px; cursor: pointer; transition: all 0.2s; }
.btn-prev { background: #ecf0f1; color: #7f8c8d; }
.btn-prev:hover { background: #d5dbdb; }
.btn-next { background: var(--accent); color: #fff; }

.summary-row { display: flex; align-items: baseline; padding: 8px 12px; margin: 3px 0; background: var(--paper-light); border-radius: 4px; font-size: 14px; flex-wrap: wrap; }
.summary-row .row-title { font-weight: bold; color: #34495e; margin-right: 8px; white-space: nowrap; }
.summary-row .row-value { color: #555; }
.summary-row .row-result { color: #555; margin-left: 4px; }

.restart-btn { display: block; width: 200px; margin: 30px auto 0; padding: 12px; background: var(--accent); color: #fff; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; }
</style>
