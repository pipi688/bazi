<template>
  <div>
    <!-- 开始页 -->
    <div v-if="stage === 'start'" class="welcome-page">
      <h1 class="page-title">子女运势测算</h1>
      <p class="page-subtitle">通过选择各项条件，逐步了解子女星、子女宫<br>以及生育相关的命理信息</p>
      <button class="btn btn-primary" style="font-size:18px; padding:14px 50px;" @click="startQuiz">开始测算</button>
    </div>

    <!-- 题目页 -->
    <div v-if="stage === 'question'" class="card">
      <div style="margin-bottom: 8px; padding-bottom: 12px; border-bottom: 2px solid var(--border-color);">
        <h2 style="font-size: 18px; color: var(--ink-dark);">{{ currentQData.title }}</h2>
        <div style="font-size: 13px; color: var(--text-muted);">{{ currentQData.subtitle }}</div>
      </div>
      <div class="progress-wrap">
        <div class="progress-bar"><div class="progress-fill" :style="{ width: ((currentQ) / questions.length * 100) + '%' }"></div></div>
      </div>

      <!-- Q1-Q4: 普通单选 -->
      <div v-if="currentQ < 4" class="option-list">
        <button
          v-for="(opt, i) in currentQData.options"
          :key="i"
          class="option-item"
          :class="{ selected: answers[currentQ] === i }"
          @click="answers[currentQ] = i"
        >{{ opt.text }}</button>
      </div>

      <!-- Q5: 两步单选 -->
      <div v-if="currentQ === 4">
        <template v-if="q5Step === 1">
          <div><span class="tag tag-blue" style="margin-bottom: 12px;">第一步</span></div>
          <div style="font-size:14px;color:var(--text-muted);margin-bottom:16px;">请选择子女星与子女宫的喜忌组合</div>
          <div class="option-list">
            <button
              v-for="(opt, i) in questions[4].step1Options"
              :key="i"
              class="option-item"
              :class="{ selected: q5Step1Sel === i }"
              @click="selectQ5Step1(i)"
            >{{ opt.text }}</button>
          </div>
        </template>
        <template v-if="q5Step === 2">
          <div><span class="tag tag-blue">第一步（已完成）</span></div>
          <div style="font-size:13px;color:var(--green-ink);margin-bottom:16px;" v-if="q5Step1Sel >= 0">
            已选择：{{ questions[4].step1Options[q5Step1Sel].text }}
          </div>
          <div style="height:1px;background:var(--border-light);margin:16px 0;"></div>
          <div><span class="tag tag-green" style="margin-bottom:12px;">第二步</span></div>
          <div style="font-size:14px;color:var(--text-muted);margin-bottom:16px;">请选择星与宫的互动模式</div>
          <div class="option-list">
            <button
              v-for="(opt, i) in questions[4].step2Options"
              :key="i"
              class="option-item"
              :class="{ selected: q5Step2Sel === i }"
              @click="selectQ5Step2(i)"
            >{{ opt.text }}</button>
          </div>
        </template>
      </div>

      <div class="nav-row">
        <button v-if="currentQ > 0" class="btn" @click="prevQuestion">上一题</button>
        <span v-else></span>
        <button class="btn btn-primary" :disabled="!canProceed" @click="nextQuestion">
          {{ currentQ < questions.length - 1 ? '下一题' : '查看总结' }}
        </button>
      </div>
    </div>

    <!-- 总结页 -->
    <div v-if="stage === 'summary'" class="card">
      <h2 class="page-title" style="padding-bottom: 20px; border-bottom: 2px solid var(--border-color);">归纳总结</h2>

      <div class="result-section" v-for="i in 4" :key="i">
        <h3>{{ questions[i - 1].title }}</h3>
        <div class="summary-card">
          <div class="summary-card-label">您的选择</div>
          <div class="summary-card-choice">{{ questions[i - 1].options[answers[i - 1]].text }}</div>
          <div class="summary-card-result">{{ questions[i - 1].options[answers[i - 1]].result }}</div>
        </div>
      </div>

      <div class="result-section">
        <h3>{{ questions[4].title }}</h3>
        <div class="summary-card">
          <div class="summary-card-label">喜忌组合</div>
          <div class="summary-card-choice">{{ q5Step1Text }}</div>
          <div class="summary-card-label" style="margin-top:12px;">互动方式</div>
          <div class="summary-card-choice">{{ q5Step2Text }}</div>
          <div class="summary-card-result" style="margin-top:8px;">{{ q5DetailResult }}</div>
        </div>
      </div>

      <div class="result-box" style="margin-top:30px;">
        <h3 style="font-size:17px;color:var(--ink-dark);margin-bottom:12px;">生孩子应期</h3>
        <p style="font-size:14px;color:var(--text-secondary);line-height:1.8;">
          1.流年引动子女星：流年出现子女星、流年合住子女星、流年冲克子女星<br>
          2.流年引动子女宫：流年冲开子女宫、流年合住子女宫、流年伏吟子女宫<br>
          3.引动的是'喜神'：怀孕过程顺利，生下来孩子乖巧<br>
          引动的是'忌神'：怀孕极其辛苦，或者生完孩子后经济压力骤增
        </p>
      </div>

      <div class="result-box" style="margin-top:12px;">
        <h3 style="font-size:17px;color:var(--ink-dark);margin-bottom:12px;">生几个孩子</h3>
        <p style="font-size:14px;color:var(--text-secondary);line-height:1.8;">
          <strong>多子之象：</strong>子女星旺且没有严重冲克。先天气生殖能力强。<br><br>
          <strong>独子之象：</strong>子女星只有一个，或其中一个被冲坏。子女缘分偏薄或来得晚。<br><br>
          <strong>无子之象：</strong>八字完全无子女星，且子女宫被严重破坏。需借助大运流年引动或医学辅助。
        </p>
      </div>

      <div class="result-box" style="margin-top:12px;">
        <h3 style="font-size:17px;color:var(--ink-dark);margin-bottom:12px;">生男生女</h3>
        <p style="font-size:14px;color:var(--text-secondary);line-height:1.8;">
          <strong>1. 传统看法（看十神的阴阳）：</strong><br>
          男命：以官杀为子女。七杀是阳干，生男孩概率大。正官是阴干，生女孩概率大。<br>
          女命：以食伤为子女。食神是阳干，生男孩概率大。伤官是阴干，生女孩概率大。<br><br>
          <strong>2. 看宫位法（看时柱的阴阳）：</strong><br>
          时柱天干地支是阳（如甲子、丙寅）：偏男。时柱天干地支是阴（如乙丑、丁卯）：偏女。<br>
          一阴一阳（如甲丑）：看地支，地支代表实处，阴支主女，阳支主男。
        </p>
      </div>

      <button class="btn btn-accent" style="display:block;width:100%;padding:14px;margin-top:30px;" @click="restart">重新测算</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const stage = ref<'start' | 'question' | 'summary'>('start')
const currentQ = ref(0)
const answers: number[] = reactive([])
const q5Step = ref(1)
const q5Step1Sel = ref(-1)
const q5Step2Sel = ref(-1)

const questions: any[] = [
  {
    title: '有没有子女星', subtitle: '请选择您的子女星情况',
    options: [
      { text: '有子女星', result: '有子女星的人，命中有子女缘分，具备生育后代的先天条件。具体子女的优劣和数量，还需结合子女星的旺衰、喜忌以及子女宫的情况综合判断。' },
      { text: '无子女星', result: '八字中无子女星，说明先天子女缘分较为淡薄。但这并不代表完全没有子女，只是需要借助大运或流年的引动，或者在特定时机才容易怀孕。也可能需要借助医学辅助生殖技术。' }
    ]
  },
  {
    title: '子女星旺衰', subtitle: '请选择您的子女星旺衰情况',
    options: [
      { text: '子女星旺', result: '孩子先天身体素质好，精力旺盛，有冲劲。在成长过程中表现出较强的行动力和竞争意识。' },
      { text: '子女星弱', result: '孩子往往体弱，或者性格极其内向懦弱，难担大任。需要父母更多关爱和呵护，后天培养尤为重要。' }
    ]
  },
  {
    title: '子女星的喜忌', subtitle: '请选择您的子女星喜忌情况',
    options: [
      { text: '子女星为喜，且得生扶', result: '这孩子天生就是来"报恩"的，智商超群，情商极高，自带能量场推着他往前走。' },
      { text: '子女星为忌，有制化', result: '小时候混世魔王，顽劣不堪。一旦开窍（制化发力），必然是顶级学霸或技术大牛。' },
      { text: '子女星为忌，无制化', result: '属于"平安是福"的类型。教他一门踏实的谋生手艺，能陪在你们身边就是最大的出息。' }
    ]
  },
  {
    title: '子女宫的喜忌', subtitle: '请选择您的子女宫喜忌情况',
    options: [
      { text: '子女宫为喜', result: '你提供的家庭环境、教育资源、物质基础，刚好是孩子需要的，"好种落在肥田里"。' },
      { text: '子女宫为忌', result: '你给孩子提供的"家庭土壤"从根本上就是错的，是消耗你们的，养育过程极其痛苦且低效。' }
    ]
  },
  {
    title: '子女星与子女宫的互动', subtitle: '请先选择喜忌组合，再选择互动方式',
    step1Options: [
      { text: '子女星为喜 + 子女宫为喜' },
      { text: '子女星为喜 + 子女宫为忌' },
      { text: '子女星为忌 + 子女宫为喜' },
      { text: '子女星为忌 + 子女宫为忌' }
    ],
    step2Options: [
      { text: '星生宫' }, { text: '星无力生宫' }, { text: '星克宫' }, { text: '星无力克宫' },
      { text: '宫生星' }, { text: '宫无力生星' }, { text: '宫克星' }, { text: '宫无力克星' }
    ]
  }
]

const resultMap: Record<string, Record<string, string>> = {
  '星生宫': {
    '子女星为喜 + 子女宫为喜': '孩子极其出息，赚了大钱或有了大权。把强大的正能量注入温暖家庭。大吉大利，教科书般的幸福晚年。',
    '子女星为喜 + 子女宫为忌': '孩子混世魔王，家庭也不是好鸟。黑吃黑，内部火并，家破人亡。',
    '子女星为忌 + 子女宫为喜': '孩子极其有钱有权想尽孝，但家庭是忌神体质。孩子越有本事，家庭吸得越狠。',
    '子女星为忌 + 子女宫为忌': '孩子在外边混成了黑恶势力，把黑恶能量注入老实本分的家庭。好端端的家庭被毁了。'
  },
  '星无力生宫': {
    '子女星为喜 + 子女宫为喜': '孩子极其孝顺懂事，但自己混得很惨。"心有余而力不足的孝子"。',
    '子女星为喜 + 子女宫为忌': '孩子想吸家里的血，但家里也没血可吸。底层互害，掀不起大浪。',
    '子女星为忌 + 子女宫为喜': '孩子本性极好想拯救家庭，但家庭是个无底洞。孝子被吸血鬼家庭活活榨干。',
    '子女星为忌 + 子女宫为忌': '孩子眼高手低但家庭底子好父母宽容。"妈，我明天就赚大钱给你买别墅"，实际鸡蛋都买不起。'
  },
  '星克宫': {
    '子女星为喜 + 子女宫为喜': '优秀的孩子为追求更大事业打破温馨家庭模式。父母觉得"白眼狼把我们甩了"。',
    '子女星为喜 + 子女宫为忌': '败家孩子把本就千疮百孔的家彻底砸烂。',
    '子女星为忌 + 子女宫为喜': '优秀的孩子强势掀翻原生家庭泥潭！通过"克"家庭完成自我救赎。',
    '子女星为忌 + 子女宫为忌': '糟糕的孩子强势摧毁幸福美满家庭。一粒老鼠屎坏了一锅粥。'
  },
  '星无力克宫': {
    '子女星为喜 + 子女宫为喜': '有出息的孩子想改变家庭观念但羽翼未丰，被家族联名声讨，陷入抑郁。',
    '子女星为喜 + 子女宫为忌': '废物孩子想折腾烂家，无能的狂怒。',
    '子女星为忌 + 子女宫为喜': '好孩子想拯救烂家庭，被死死拖下水。最让人意难平的悲剧。',
    '子女星为忌 + 子女宫为忌': '熊孩子想作妖但家庭根基太稳，像个跳梁小丑。'
  },
  '宫生星': {
    '子女星为喜 + 子女宫为喜': '家里把纯正的爱和资源灌输给孩子，孩子成为学霸精英反哺家庭。',
    '子女星为喜 + 子女宫为忌': '家里给了最好资源但孩子是扶不上墙的坏种。富二代败家。',
    '子女星为忌 + 子女宫为喜': '高压家庭逼出优秀孩子，但内心扭曲冷酷。用优秀报复家庭。',
    '子女星为忌 + 子女宫为忌': '病态家庭灌输给有恶习的孩子，培养出反社会的混世魔王。'
  },
  '宫无力生星': {
    '子女星为喜 + 子女宫为喜': '父母通情达理但能力不够，孩子懂事优秀但心里有遗憾。',
    '子女星为喜 + 子女宫为忌': '父母掏心掏肺但孩子是扶不上墙的学渣。升米恩，斗米仇。',
    '子女星为忌 + 子女宫为喜': '烂家庭想把好孩子拉下水但力不从心。孩子像野草般逃离原生家庭。',
    '子女星为忌 + 子女宫为忌': '糟糕家庭想管教糟糕孩子，菜鸡互啄谁也管不了谁。'
  },
  '宫克星': {
    '子女星为喜 + 子女宫为喜': '好人父母用"为了你好"折断了天才孩子的翅膀。乖孩子但郁郁寡欢。',
    '子女星为喜 + 子女宫为忌': '正直父母用雷霆手段强行把歪路孩子拉回正轨。浪子回头金不换。',
    '子女星为忌 + 子女宫为喜': '自私父母用冷暴力摧毁优秀有灵气的孩子，人间惨剧。',
    '子女星为忌 + 子女宫为忌': '病态家庭压制混混孩子。狗咬狗一嘴毛。'
  },
  '宫无力克星': {
    '子女星为喜 + 子女宫为喜': '软弱父母想给好孩子立规矩但镇不住。温和的分离，不伤感情。',
    '子女星为喜 + 子女宫为忌': '好父母想管教坏孩子但镇不住。眼睁睁看着孩子滑向深渊。',
    '子女星为忌 + 子女宫为喜': '烂家庭想拖好孩子下水但孩子实力太强。直接拉黑远走高飞。',
    '子女星为忌 + 子女宫为忌': '烂环境想管烂孩子，谁也奈何不了谁。互相摆烂的日常。'
  }
}

const currentQData = computed(() => questions[currentQ.value])
const q5Step1Text = computed(() => q5Step1Sel.value >= 0 ? questions[4].step1Options[q5Step1Sel.value].text : '-')
const q5Step2Text = computed(() => q5Step2Sel.value >= 0 ? questions[4].step2Options[q5Step2Sel.value].text : '-')
const q5DetailResult = computed(() => {
  if (q5Step1Sel.value < 0 || q5Step2Sel.value < 0) return ''
  return resultMap[questions[4].step2Options[q5Step2Sel.value].text]?.[questions[4].step1Options[q5Step1Sel.value].text] || ''
})

const canProceed = computed(() => {
  if (currentQ.value < 4) return answers[currentQ.value] !== undefined
  return q5Step2Sel.value >= 0
})

function startQuiz() {
  stage.value = 'question'
  currentQ.value = 0
  q5Step.value = 1
  q5Step1Sel.value = -1
  q5Step2Sel.value = -1
  answers.length = 0
}

function selectQ5Step1(i: number) {
  q5Step1Sel.value = i
  q5Step.value = 2
}

function selectQ5Step2(i: number) {
  q5Step2Sel.value = i
}

function nextQuestion() {
  if (currentQ.value === 4) {
    answers[4] = { step1: q5Step1Sel.value, step2: q5Step2Sel.value } as any
    stage.value = 'summary'
    return
  }
  if (currentQ.value < 4) {
    currentQ.value++
  } else {
    stage.value = 'summary'
  }
}

function prevQuestion() {
  if (currentQ.value === 4 && q5Step.value === 2 && q5Step2Sel.value === -1) {
    q5Step.value = 1
    q5Step1Sel.value = -1
    return
  }
  if (currentQ.value > 0) {
    currentQ.value--
    q5Step.value = 1
    q5Step1Sel.value = -1
    q5Step2Sel.value = -1
  }
}

function restart() {
  stage.value = 'start'
  currentQ.value = 0
  q5Step.value = 1
  q5Step1Sel.value = -1
  q5Step2Sel.value = -1
  answers.length = 0
}
</script>
