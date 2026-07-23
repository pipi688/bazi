<template>
  <div>
    <!-- 欢迎页 -->
    <div v-if="stage === 'welcome'" class="welcome-page">
      <h1 class="page-title">财富分析测试</h1>
      <p class="page-subtitle">请根据您的八字信息，依次回答以下问题，系统将在最后为您生成完整的财富分析报告。</p>
      <div style="text-align:center; margin-top: 30px;">
        <button class="btn btn-primary" style="padding: 12px 48px; font-size: 16px;" @click="startTest">开始测试</button>
      </div>
    </div>

    <!-- 答题页 -->
    <div v-if="stage === 'question'" class="card">
      <div class="progress-wrap">
        <div class="progress-bar"><div class="progress-fill" :style="{ width: progressPercent + '%' }"></div></div>
        <div class="progress-text">{{ currentDisplayIndex }} / {{ activeQuestions.length }}</div>
      </div>
      <h2 style="font-size: 17px; font-weight: 600; margin-bottom: 16px; text-align: center;">{{ currentQuestion.title }}</h2>
      <div class="option-list">
        <div
          v-for="opt in currentQuestion.options"
          :key="opt.value"
          class="option-item"
          :class="{ selected: isSelected(opt.value) }"
          @click="toggleOption(opt.value)"
        >
          <span>{{ opt.text }}</span>
        </div>
      </div>
      <div class="nav-row">
        <button class="btn" :disabled="currentQuestionIndex === 0" @click="prevQuestion">上一题</button>
        <button class="btn btn-primary" @click="nextQuestion">{{ isLastQuestion ? '查看结果' : '下一题' }}</button>
      </div>
    </div>

    <!-- 结果页 -->
    <div v-if="stage === 'result'">
      <div class="page-title" style="margin-bottom: 24px;">财富分析报告</div>
      <div class="card result-section">
        <h3>基本信息</h3>
        <div class="info-row"><span class="info-label">有没有财星</span><span class="info-value">{{ answers['q_has_caixing'] || '-' }}</span></div>
        <div class="info-row"><span class="info-label">财星类型</span><span class="info-value">{{ answers['q_caixing_type'] || '-' }}</span></div>
        <div class="info-row"><span class="info-label">身强/身弱</span><span class="info-value">{{ answers['q_shen_qiang_ruo'] || '-' }}</span></div>
        <div class="info-row"><span class="info-label">财星喜忌</span><span class="info-value">{{ answers['q_caixing_xi_ji'] || '-' }}</span></div>
        <div class="info-row"><span class="info-label">财星旺衰</span><span class="info-value">{{ answers['q_caixing_wang_shuai'] || '-' }}</span></div>
      </div>

      <div class="result-section card">
        <h3>综合汇总表</h3>
        <table>
          <thead><tr>
            <th style="width:15%">项目</th><th style="width:20%">选择结果</th><th style="width:65%">对应分析</th>
          </tr></thead>
          <tbody>
            <tr>
              <td>有没有财星</td>
              <td>{{ answers['q_has_caixing'] || '-' }}</td>
              <td style="font-size:13px;color:#555;line-height:1.8;" v-html="nl2br(analysisText[answers['q_has_caixing']] || '')"></td>
            </tr>
            <tr v-if="answers['q_caixing_type']">
              <td>财星类型</td>
              <td>{{ answers['q_caixing_type'] }}</td>
              <td style="font-size:13px;color:#555;line-height:1.8;">{{ analysisText[answers['q_caixing_type']] || '' }}</td>
            </tr>
            <tr>
              <td>身强身弱</td>
              <td>{{ answers['q_shen_qiang_ruo'] || '-' }}</td>
              <td style="font-size:13px;color:#555;line-height:1.8;">{{ analysisText[answers['q_shen_qiang_ruo']] || '' }}</td>
            </tr>
            <tr>
              <td>财星喜忌</td>
              <td><span class="tag" :class="answers['q_caixing_xi_ji'] === '喜神' ? 'tag-green' : 'tag-red'">{{ answers['q_caixing_xi_ji'] || '-' }}</span></td>
              <td style="font-size:13px;color:#555;line-height:1.8;">{{ analysisText[answers['q_caixing_xi_ji']] || '' }}</td>
            </tr>
            <tr>
              <td>财星旺衰</td>
              <td>{{ answers['q_caixing_wang_shuai'] || '-' }}</td>
              <td style="font-size:13px;color:#555;line-height:1.8;">{{ analysisText[answers['q_caixing_wang_shuai']] || '' }}</td>
            </tr>
            <tr v-if="answers['q_shen_cai_jiaoliang']">
              <td>身与财的较量</td>
              <td>{{ answers['q_shen_cai_jiaoliang'] }}</td>
              <td style="font-size:13px;color:#555;line-height:1.8;" v-html="nl2br(analysisText[answers['q_shen_cai_jiaoliang']] || '')"></td>
            </tr>
            <tr v-if="answers['q_has_shishang']">
              <td>生财源头（食伤）</td>
              <td>{{ formatShishang(answers['q_has_shishang']) }}</td>
              <td style="font-size:13px;color:#555;line-height:1.8;">{{ analysisText[answers['q_has_shishang']] || '' }}</td>
            </tr>
            <tr v-if="answers['q_baobiao'] && answers['q_baobiao'].length > 0">
              <td>财星保镖</td>
              <td>{{ answers['q_baobiao'].join('、') }}</td>
              <td style="font-size:13px;color:#555;line-height:1.8;">
                <div v-for="b in answers['q_baobiao']" :key="b" style="margin-bottom:8px;">{{ analysisText[b] || '' }}</div>
              </td>
            </tr>
            <tr>
              <td>有没有财库</td>
              <td>{{ answers['q_caiku'] || '-' }}</td>
              <td style="font-size:13px;color:#555;line-height:1.8;">{{ analysisText[answers['q_caiku']] || '' }}</td>
            </tr>
            <tr v-if="answers['q_caiku_yindong']">
              <td>财库引动</td>
              <td>{{ answers['q_caiku_yindong'] }}</td>
              <td style="font-size:13px;color:#555;line-height:1.8;">{{ analysisText[answers['q_caiku_yindong']] || '' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card result-section" style="margin-top: 30px;">
        <h3>大运流年看财富</h3>
        <div style="font-size:13px;color:#555;line-height:2;padding:16px;" v-html="analysisText['dayun_liunian']"></div>
      </div>

      <div style="text-align:center; margin-top: 30px;">
        <button class="btn btn-accent" @click="restart">重新测试</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const stage = ref<'welcome' | 'question' | 'result'>('welcome')
const currentQuestionIndex = ref(0)
const answers: Record<string, any> = reactive({})

const questions = [
  { id: 'q_has_caixing', title: '原局有没有财星', type: 'single', options: [{ value: '有财星', text: '有财星' }, { value: '无财星', text: '无财星' }] },
  { id: 'q_caixing_type', title: '财星类型', type: 'single', dependsOn: 'q_has_caixing', dependsValue: '有财星', options: [{ value: '正财', text: '正财' }, { value: '偏财', text: '偏财' }] },
  { id: 'q_shen_qiang_ruo', title: '身强身弱', type: 'single', options: [{ value: '身强', text: '身强' }, { value: '身弱', text: '身弱' }] },
  { id: 'q_caixing_xi_ji', title: '财星是喜是忌', type: 'single', options: [{ value: '喜神', text: '喜神' }, { value: '忌神', text: '忌神' }] },
  { id: 'q_caixing_wang_shuai', title: '财星旺衰', type: 'single', options: [{ value: '财星旺', text: '财星旺' }, { value: '财星弱', text: '财星弱' }, { value: '财星极旺', text: '财星极旺' }] },
  { id: 'q_shen_cai_jiaoliang', title: '身与财的较量', type: 'single', options: [
    { value: '身强+财星旺+喜神', text: '身强 + 财星旺 + 喜神' }, { value: '身强+财星旺+忌神', text: '身强 + 财星旺 + 忌神' },
    { value: '身强+财星弱+喜神', text: '身强 + 财星弱 + 喜神' }, { value: '身强+财星弱+忌神', text: '身强 + 财星弱 + 忌神' },
    { value: '身弱+财星旺+喜神', text: '身弱 + 财星旺 + 喜神' }, { value: '身弱+财星旺+忌神', text: '身弱 + 财星旺 + 忌神' },
    { value: '身弱+财星弱+喜神', text: '身弱 + 财星弱 + 喜神' }, { value: '身弱+财星弱+忌神', text: '身弱 + 财星弱 + 忌神' }
  ]},
  { id: 'q_has_shishang', title: '有没有生财源头（食伤）', type: 'single', options: [
    { value: '有食伤_财旺', text: '有食伤 + 财星旺' }, { value: '有食伤_财弱', text: '有食伤 + 财星弱' }, { value: '无食伤', text: '无食伤' }
  ]},
  { id: 'q_baobiao', title: '财星有没有保镖（多选）', type: 'multi', options: [
    { value: '有保镖', text: '有保镖' }, { value: '无保镖_比劫', text: '无保镖（比劫夺财）' }, { value: '无保镖_印耗', text: '无保镖（印耗财）' }
  ]},
  { id: 'q_caiku', title: '有没有财库', type: 'single', options: [{ value: '有财库', text: '有财库' }, { value: '没有财库', text: '没有财库' }] },
  { id: 'q_caiku_yindong', title: '命局的财库有没有被引动', type: 'single', dependsOn: 'q_caiku', dependsValue: '有财库',
    options: [{ value: '财库无损', text: '财库无损' }, { value: '财库被冲被害被刑', text: '财库被冲/被害/被刑' }, { value: '财库不开', text: '财库不开' }]
  }
] as any[]

const analysisText: Record<string, string> = {
  '有财星': '正财：现金流 / 固定资产 / 硬劳动（工资、提成、店铺租金、按部就班的积蓄）\n偏财：资产溢价 / 杠杆 / 资本运作 / 机遇（股票、拆迁、风投、奖金、突然的暴利）',
  '无财星': '不直接跟钱打交道，而是通过"本事、名望、关系、平台"来变现',
  '正财': '正财：现金流 / 固定资产 / 硬劳动（工资、提成、店铺租金、按部就班的积蓄）',
  '偏财': '偏财：资产溢价 / 杠杆 / 资本运作 / 机遇（股票、拆迁、风投、奖金、突然的暴利）',
  '身强': '赚硬钱：靠实力、靠积累、靠熬出来的资源。财星旺的年份，是赚钱的黄金期。',
  '身弱': '赚活钱：靠人脉、靠时机、靠借力打力。把赚钱的事分出去，您反而能赚更多。',
  '喜神': '钱是工具，有能力承载财富，赚来的钱能为您所用，用钱生钱、用钱买自由，而不是被钱牵着走。',
  '忌神': '钱是主人，没有能力承载财富，赚来的钱要么留不住，要么带来了麻烦，为钱奔波、为钱焦虑。',
  '财星旺': '财富的量⼤，机会多，资源丰富。',
  '财星弱': '财富的量⼩，机会少，积累慢。',
  '财星极旺': '赚钱像呼吸一样自然，但花钱也像呼吸一样自然。对钱没有执念，但钱总跟着他。',
  '身强+财星旺+喜神': '能力极强，而现实中的钱和机会也极多。钱能极大地放大你的才华。\n建议：赚到钱后，绝对不要全部拿去滚动投资。立刻将至少50%的利润买成"死钱"（如优质房产、大额存单、长期国债）。',
  '身强+财星旺+忌神': '能赚钱，但守不住钱，容易因财生灾（投资失误、被骗、官司）。\n建议：绝对不要自己摸钱。把财政大权交给最无聊、保守但绝对靠谱的伴侣或专业理财师。',
  '身强+财星弱+喜神': '能力极强，且很渴望赚钱，但赚钱的机会少。需等运来扶起财星。\n建议：放弃"以小博大"的偏门。直接去打工/出卖技能，去大平台做高薪打工仔/高管。',
  '身强+财星弱+忌神': '看不上小钱，赚不到大钱，眼高手低。\n建议：面子不值钱，放下身段去赚钱。哪怕摆地摊、做点小生意，也是好的开始。',
  '身弱+财星旺+喜神': '赚钱的机会多，但底盘不稳，内心焦虑。\n建议：立刻用钱去买"土"（房产、大额保单、黄金），把钱死死锁在固定资产里。',
  '身弱+财星旺+忌神': '满眼是钱，但身体扛不住。因钱生病、因钱受累。\n建议：如果那个平台/伴侣在吸你的血，必须立刻切断联系。活着比有钱重要。',
  '身弱+财星弱+喜神': '极度渴望钱来保护你，但现实中不仅没钱，连赚钱的线索都找不到。\n建议：不要想赚大钱。每天存几十块，通过微小但确定的劳动赚到小钱。',
  '身弱+财星弱+忌神': '能力弱，对钱极其缺乏安全感，容易掉进杀猪盘、高利贷。\n建议：三不原则：不接触、不转账、不借钱。物理拉黑所有相关人。',
  '有食伤_财旺': '食伤代表你的头脑、点子、口才、技术。有食伤生财，说明你的钱是"活水"。',
  '有食伤_财弱': '别想着去创业或者靠技能赚钱，等待源头运或者源头被引动时，再去做。',
  '无食伤': '八字里有财星，但没有食神、伤官来生它。钱只能靠死工资、或者意外之财。',
  '有保镖': '适合合伙做生意，有人帮你管账、管人，钱丢不了。',
  '无保镖_比劫': '赚到钱马上就被兄弟借走、合伙人卷跑、或者乱投资亏掉。绝对不能合伙，不能借钱给人。',
  '无保镖_印耗': '花钱在提升自己、学习、健康或家庭上，属于必要支出；或因固执、保守而影响财务效率。',
  '有财库': '原局有财库',
  '没有财库': '原局没有财库',
  '财库无损': '原局有财库且没有被刑冲破害。极善理财，积蓄惊人。',
  '财库被冲被害被刑': '保险箱漏了个洞，赚多少漏多少，存不住现钱。',
  '财库不开': '有库但没被冲开，钱都压在固定资产里，得等特定流年才能爆发套现。',
  'dayun_liunian': '<h4 style="margin: 16px 0 8px 0; font-size: 14px;">1. 看大运是喜是忌</h4><p style="margin-bottom: 8px;">大运是喜神，尽管去折腾；大运是忌神，越折腾越惨。</p><h4 style="margin: 16px 0 8px 0; font-size: 14px;">2. 看流年</h4><p style="margin-bottom: 4px;"><strong>身强财喜</strong>：最喜欢走财运、食伤运，遇到财星流年满仓干！</p><p style="margin-bottom: 4px;"><strong>身强财忌</strong>：遇到财星流年赶紧扔！赚到立刻花掉，绝不留现金。</p><p style="margin-bottom: 4px;"><strong>身弱财喜</strong>：遇到财星流年找人帮！单打独斗必亏。</p><p style="margin-bottom: 8px;"><strong>身弱财忌</strong>：必须"借势"，找人帮，靠着别人才能喝口汤。</p><h4 style="margin: 16px 0 8px 0; font-size: 14px;">3. 看流年财星是否到位</h4><p style="margin-bottom: 4px;"><strong>流年遇到正财</strong>：通过本职工作、固定工资获得丰厚回报。钱来得稳，能存住。</p><p style="margin-bottom: 4px;"><strong>流年遇到偏财</strong>：意外之财、投资收益。但要注意是不是"过路财神"。</p><h4 style="margin: 16px 0 8px 0; font-size: 14px;">4. 看流年有没有生财的源头</h4><p style="margin-bottom: 4px;"><strong>原局有财，流年遇食伤</strong>：才华直接变成真金白银。</p><p style="margin-bottom: 8px;"><strong>原局无财，流年遇食伤</strong>：忙活一年，赚了名声没赚到钱。</p><h4 style="margin: 16px 0 8px 0; font-size: 14px;">5. 看流年有没有财星的护卫</h4><p style="margin-bottom: 4px;"><strong>官星护财</strong>：赚钱极有秩序，有贵人撑腰。（大吉）</p><p style="margin-bottom: 8px;"><strong>比劫夺财</strong>：赚到钱马上被兄弟借钱不还、合伙人卷款。（注意）</p><h4 style="margin: 16px 0 8px 0; font-size: 14px;">6. 看流年中财库的情况</h4><p style="margin-bottom: 4px;"><strong>财库被冲开</strong>：为喜神则发大财；为忌神则花钱如流水。</p><p style="margin-bottom: 4px;"><strong>财库被刑坏</strong>：钱在不知不觉中流失。</p><p style="margin-bottom: 4px;"><strong>财库被合</strong>：为喜神则资金高效整合；为忌神则被套牢。</p>'
}

const activeQuestions = computed(() => {
  return questions.filter(q => {
    if (q.dependsOn) {
      const depVal = answers[q.dependsOn]
      if (!depVal) return false
      if (Array.isArray(depVal)) return depVal.includes(q.dependsValue)
      return depVal === q.dependsValue
    }
    return true
  })
})

const currentQuestion = computed(() => activeQuestions.value[currentQuestionIndex.value] || activeQuestions.value[0])
const progressPercent = computed(() => {
  if (activeQuestions.value.length === 0) return 0
  return ((currentQuestionIndex.value + 1) / activeQuestions.value.length) * 100
})
const currentDisplayIndex = computed(() => currentQuestionIndex.value + 1)
const isLastQuestion = computed(() => currentQuestionIndex.value >= activeQuestions.value.length - 1)

function isSelected(val: string): boolean {
  const q = currentQuestion.value
  const saved = answers[q.id]
  if (q.type === 'multi') return Array.isArray(saved) && saved.includes(val)
  return saved === val
}

function toggleOption(val: string) {
  const q = currentQuestion.value
  if (q.type === 'multi') {
    const arr: string[] = answers[q.id] || []
    const idx = arr.indexOf(val)
    if (idx >= 0) arr.splice(idx, 1)
    else arr.push(val)
    answers[q.id] = [...arr]
  } else {
    answers[q.id] = val
  }
}

function canProceed(): boolean {
  const ans = answers[currentQuestion.value.id]
  if (currentQuestion.value.type === 'multi') return ans && ans.length > 0
  return !!ans
}

function startTest() {
  stage.value = 'question'
  currentQuestionIndex.value = 0
  Object.keys(answers).forEach(k => delete answers[k])
}

function nextQuestion() {
  if (!canProceed()) { alert('请先选择答案'); return }
  if (currentQuestionIndex.value < activeQuestions.value.length - 1) {
    currentQuestionIndex.value++
  } else {
    stage.value = 'result'
  }
}

function prevQuestion() {
  if (currentQuestionIndex.value > 0) currentQuestionIndex.value--
}

function restart() {
  Object.keys(answers).forEach(k => delete answers[k])
  currentQuestionIndex.value = 0
  stage.value = 'welcome'
}

function nl2br(text: string): string {
  return text ? text.replace(/\n/g, '<br><br>') : ''
}

function formatShishang(val: string): string {
  return val ? val.replace(/_/g, ' + ').replace('有食伤 + ', '有食伤 + 财星') : ''
}

// Keyboard
function onKeydown(e: KeyboardEvent) {
  if (stage.value !== 'question') return
  if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); nextQuestion() }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); prevQuestion() }
}
document.addEventListener('keydown', onKeydown)
</script>
