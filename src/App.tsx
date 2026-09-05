import { useEffect, useLayoutEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { A } from './assets'

type Route =
  | '/onboarding/1' | '/onboarding/2' | '/onboarding/3'
  | '/login' | '/register' | '/home' | '/home/diy'
  | '/activities' | '/activity/1' | '/activity/2' | '/activity/3'
  | '/publish' | '/publish/editor'
  | '/search' | '/cart' | '/orders' | '/footprints' | '/pets' | '/pets/edit' | '/addresses' | '/addresses/new' | '/collections' | '/settings' | '/schedule'
  | '/profile/edit' | '/profile/level' | '/profile/points'
  | '/settings/account' | '/settings/notifications' | '/settings/privacy' | '/settings/display' | '/settings/about'
  | '/community/post' | '/message/detail' | '/shop/brands' | '/shop/outfits' | '/shop/sale' | '/shop/fan-list'
  | '/messages/likes' | '/messages/follows' | '/messages/comments' | '/messages/system' | '/messages/activity'
  | '/friends/add'
  | '/messages/chat/handmade' | '/messages/chat/dahuang' | '/messages/chat/support' | '/messages/chat/shelter'
  | '/recycle/pickup' | '/recycle/dropoff' | '/recycle/success'
  | '/workshops' | '/workshop/profile' | '/workshop/diy' | '/workshop/time' | '/workshop/success'
  | '/fabrics' | '/fabrics/detail' | '/fabrics/checkout'
  | '/shop' | '/shop/kits' | '/product'
  | '/messages' | '/profile' | '/achievements' | '/achievements/action' | '/achievements/history'

const routes = new Set<Route>([
  '/onboarding/1', '/onboarding/2', '/onboarding/3', '/login', '/register', '/home', '/home/diy',
  '/activities', '/activity/1', '/activity/2', '/activity/3', '/publish', '/publish/editor',
  '/search', '/cart', '/orders', '/footprints', '/pets', '/pets/edit', '/addresses', '/addresses/new', '/collections', '/settings', '/schedule',
  '/profile/edit', '/profile/level', '/profile/points',
  '/settings/account', '/settings/notifications', '/settings/privacy', '/settings/display', '/settings/about',
  '/community/post', '/message/detail', '/shop/brands', '/shop/outfits', '/shop/sale', '/shop/fan-list',
  '/messages/likes', '/messages/follows', '/messages/comments', '/messages/system', '/messages/activity',
  '/friends/add',
  '/messages/chat/handmade', '/messages/chat/dahuang', '/messages/chat/support', '/messages/chat/shelter',
  '/recycle/pickup', '/recycle/dropoff', '/recycle/success', '/workshops', '/workshop/profile', '/workshop/diy',
  '/workshop/time', '/workshop/success', '/fabrics', '/fabrics/detail', '/fabrics/checkout', '/shop', '/shop/kits',
  '/product', '/messages', '/profile', '/achievements', '/achievements/action', '/achievements/history',
])

function currentRoute(): Route {
  const value = ((location.hash.slice(1) || '/onboarding/1').split('?')[0]) as Route
  return routes.has(value) ? value : '/onboarding/1'
}

function go(route: Route) {
  location.hash = route
}

function openProduct(id: string, back: Route = '/shop/kits') {
  location.hash = `/product?id=${encodeURIComponent(id)}&back=${encodeURIComponent(back)}`
}

function openPost(id: CommunityPostId) {
  location.hash = `/community/post?id=${encodeURIComponent(id)}`
}

function useRoute() {
  const [route, setRoute] = useState<Route>(currentRoute)
  useEffect(() => {
    const change = () => setRoute(currentRoute())
    addEventListener('hashchange', change)
    return () => removeEventListener('hashchange', change)
  }, [])
  return route
}

function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <main className={`phone-screen ${className}`}>{children}</main>
}

function TextureButton({ children, onClick, className = '', dark = false, disabled = false }: {
  children: ReactNode; onClick?: () => void; className?: string; dark?: boolean; disabled?: boolean
}) {
  return (
    <button className={`texture-button ${dark ? 'dark' : ''} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

function Header({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <header className="paper-header">
      <button className="back-button" onClick={onBack || (() => history.back())} aria-label="返回">
        <img src={A.back} alt="" />
      </button>
      <h1>{title}</h1>
    </header>
  )
}

const navItems: Array<{ icon: string; label: string; route: Route }> = [
  { icon: '⌂', label: '首页', route: '/home' },
  { icon: '♧', label: '商店', route: '/shop' },
  { icon: '✉', label: '消息', route: '/messages' },
  { icon: '♙', label: '我的', route: '/profile' },
]

function BottomNav({ active }: { active: 'home' | 'shop' | 'messages' | 'profile' }) {
  return (
    <nav className="bottom-nav">
      {navItems.map((item, index) => {
        const key = ['home', 'shop', 'messages', 'profile'][index]
        return (
          <button key={item.route} className={active === key ? 'active' : ''} onClick={() => go(item.route)}>
            <span>{item.icon}</span><small>{item.label}</small>
          </button>
        )
      })}
      <button className="nav-plus" onClick={() => go('/home/diy')} aria-label="DIY">＋</button>
    </nav>
  )
}

function Onboarding({ step }: { step: 1 | 2 | 3 }) {
  const data = {
    1: { title: <>衣物新生<br />让爱循环</>, en: <>From children’s clothes to pet wear,<br />nothing goes to waste.</>, img: A.onboardRecycle },
    2: { title: <>亲手制作<br />专属宠爱</>, en: <>Create pet wear with care,<br />time, and love.</>, img: A.onboardSew },
    3: { title: <>不仅是宠物<br />更是家人</>, en: <>Sharing everyday<br />moments, step by step.</>, img: A.onboardWalk },
  }[step]
  return (
    <Screen className="onboarding">
      <section className="onboard-copy"><h1>{data.title}</h1><p>{data.en}</p></section>
      <img className="onboard-illustration" src={data.img} alt="" />
      <div className="pager"><i className={step === 1 ? 'current' : ''} /><i className={step === 2 ? 'current' : ''} /><i className={step === 3 ? 'current' : ''} /></div>
      <TextureButton onClick={() => step < 3 ? go(`/onboarding/${step + 1}` as Route) : go('/login')}>
        {step === 3 ? '开启旅程' : '下一页  →'}
      </TextureButton>
    </Screen>
  )
}

function OnboardingExperience({ initialStep }: { initialStep: 1 | 2 | 3 }) {
  const [step, setStep] = useState(initialStep - 1)
  const pointerStart = useRef<{ x: number; y: number; id: number } | null>(null)
  const suppressSwipeClick = useRef(false)
  const selectStep = (next: number) => {
    const bounded = Math.max(0, Math.min(2, next))
    if (bounded === step) return
    setStep(bounded)
    history.replaceState(null, '', `#/onboarding/${bounded + 1}`)
  }
  const advance = () => step < 2 ? selectStep(step + 1) : go('/login')
  return <main
    className="reference-stage onboarding-experience"
    data-step={step + 1}
    onPointerDown={event => {
      if (!event.isPrimary || event.button !== 0) return
      pointerStart.current = { x: event.clientX, y: event.clientY, id: event.pointerId }
      suppressSwipeClick.current = false
    }}
    onPointerMove={event => {
      const start = pointerStart.current
      if (!start || start.id !== event.pointerId) return
      const dx = event.clientX - start.x
      const dy = event.clientY - start.y
      // Capture only a horizontal drag; ordinary clicks must stay on the button.
      if (Math.abs(dx) >= 42 && Math.abs(dx) > Math.abs(dy)) {
        event.currentTarget.setPointerCapture(event.pointerId)
        suppressSwipeClick.current = true
      }
    }}
    onPointerUp={event => {
      const start = pointerStart.current
      if (!start || start.id !== event.pointerId) return
      pointerStart.current = null
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
      const dx = event.clientX - start.x
      const dy = event.clientY - start.y
      if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy)) return
      suppressSwipeClick.current = true
      selectStep(step + (dx < 0 ? 1 : -1))
    }}
    onPointerCancel={() => { pointerStart.current = null; suppressSwipeClick.current = false }}
    onLostPointerCapture={() => { pointerStart.current = null }}
    onClickCapture={event => {
      if (!suppressSwipeClick.current || event.detail === 0) return
      event.preventDefault()
      event.stopPropagation()
      suppressSwipeClick.current = false
    }}
  >
    <div className="onboarding-slide-track" style={{ transform: `translate3d(-${step * 100}%,0,0)` }}>
      {[1, 2, 3].map(index => <section className="onboarding-reference-slide" key={index}><img src={`./reference/onboarding-${index}.png`} alt={`欢迎页 ${index}`} draggable={false} /></section>)}
    </div>
    <button className="onboarding-next-hotspot" onClick={advance} aria-label={step === 2 ? '开启旅程' : '下一页'} />
  </main>
}

function AuthPage({ register = false }: { register?: boolean }) {
  const [role, setRole] = useState<'dog' | 'cat'>('dog')
  return (
    <Screen className="auth-page">
      <section className="auth-box">
        <img className="auth-logo" src={A.authLogo} alt="" />
        <h1>{register ? '加入环保大家庭' : '欢迎回家'}</h1>
        <p>{register ? '开启旧衣改造之旅' : '继续旧衣改造之旅'}</p>
        <label className="paper-input"><span>✉</span><input type="email" placeholder="邮箱地址" /></label>
        <label className="paper-input"><span>♙</span><input type="password" placeholder="密码" /></label>
        {register && (
          <div className="role-grid">
            <button className={role === 'dog' ? 'selected' : ''} onClick={() => setRole('dog')}><b>♙</b>是宠爸/宠妈</button>
            <button className={role === 'cat' ? 'selected' : ''} onClick={() => setRole('cat')}><b>♘</b>是铲屎官</button>
          </div>
        )}
        <TextureButton onClick={() => go('/home')}>{register ? '注册' : '登录'}</TextureButton>
        <p className="auth-switch">{register ? '已有账号？' : '还没有账号？'} <button onClick={() => go(register ? '/login' : '/register')}>{register ? '去登录' : '去注册'}</button></p>
      </section>
    </Screen>
  )
}

function HomePage({ modal = false }: { modal?: boolean }) {
  const [accepted, setAccepted] = useState(false)
  return (
    <Screen className="home-page">
      <div className="search">⌕</div>
      <section className="section-title"><b>✦ 当季活动</b><button>查看全部 〉</button></section>
      <button className="event-card"><img src={A.homeEvent} alt="" /><em>报名中</em><strong>旧衣新生·亲子宠物工坊</strong></button>
      <div className="pager compact"><i className="current" /><i /><i /></div>
      <section className="action-grid">
        <button onClick={() => go('/recycle/pickup')}><img src={A.homeRecycle} alt="" /><b>婴童旧衣回收</b><small>预约上门/投递</small></button>
        <button onClick={() => go('/home/diy')}><img src={A.homeDiy} alt="" /><b>宠物服饰DIY</b><small>工作坊/材料包</small></button>
      </section>
      <section className="section-title community-title"><b>✚ 社区精选</b></section>
      <section className="community-grid">
        <article><img src={A.homeCommunity1} alt="" /><b>宝宝的连体衣变成狗子战袍！</b><small>Momo妈</small></article>
        <article><img src={A.homeCommunity2} alt="" /><b>8月回收成果：500件童装的新生</b><small>官方回收君</small></article>
      </section>
      <BottomNav active="home" />
      {modal && (
        <div className="scrim">
          <section className="choice-sheet">
            <i className="handle" />
            <TextureButton onClick={() => accepted && go('/workshops')}><span>▣</span> 我要去线下工坊DIY</TextureButton>
            <TextureButton className="pale" onClick={() => accepted && go('/shop/kits')}><span>⌂</span> 我要在家自己DIY</TextureButton>
            <label><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} /> 我已阅读并同意《DIY预约须知》</label>
          </section>
        </div>
      )}
    </Screen>
  )
}

function DiyChoiceExperience() {
  const [accepted, setAccepted] = useState(false)
  return (
    <main className="reference-stage diy-choice-experience" data-route="/home/diy">
      <div className="reference-canvas">
        <img className="reference-page-image" src="./reference/home-modal.png" alt="" draggable={false} />
        <button className="diy-choice-dismiss" type="button" aria-label="关闭 DIY 选择" onClick={() => go('/home')} />
        <button className="diy-choice-button workshop" type="button" disabled={!accepted} aria-describedby="diy-choice-consent" onClick={() => go('/workshops')}>
          <img src="./reference/home-modal.png" alt="我要去线下工坊 DIY" draggable={false} />
        </button>
        <button className="diy-choice-button home" type="button" disabled={!accepted} aria-describedby="diy-choice-consent" onClick={() => go('/shop/kits')}>
          <img src="./reference/home-modal.png" alt="我要在家自己 DIY" draggable={false} />
        </button>
        <label className={`diy-choice-consent ${accepted ? 'is-accepted' : ''}`} id="diy-choice-consent">
          <input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} />
          <span className="visually-hidden">我已阅读并同意《DIY预约须知》</span>
        </label>
      </div>
    </main>
  )
}

function Segmented({ active, onChange }: { active: 'pickup' | 'dropoff'; onChange: (v: 'pickup' | 'dropoff') => void }) {
  return (
    <div className={`segmented ${active}`}>
      <button aria-pressed={active === 'pickup'} onClick={() => onChange('pickup')}>上门回收</button>
      <button aria-pressed={active === 'dropoff'} onClick={() => onChange('dropoff')}>门店投递</button>
    </div>
  )
}

function FormField({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return <label className="form-field"><span>{label}</span><input type={type} placeholder={placeholder} /></label>
}

type WorkshopLocationId = 'huanglong' | 'xixi' | 'hubin'

const workshopLocations: Array<{ id: WorkshopLocationId; name: string; time: string; address: string; distance: string }> = [
  { id: 'huanglong', name: '黄龙国际中心旗舰工坊', time: '10:00-21:00', address: '浙江省杭州市西湖区黄龙国际中心·中国银行对面', distance: '889m' },
  { id: 'xixi', name: '西溪银泰旧衣改造点', time: '10:00-22:00', address: '浙江省杭州市西湖区西溪银泰城2楼201', distance: '3.5km' },
  { id: 'hubin', name: '湖滨银泰手工小栈', time: '09:30-21:30', address: '浙江省杭州市上城区延安路98号', distance: '5.2km' },
]

type WorkshopDraft = {
  id: string
  workshopId: WorkshopLocationId | ''
  date: string
  time: string
  name: string
  phone: string
  petType: string
  bringPet: string
  petSize: string
  difficulty: string
  fabricSource: string
}

const emptyWorkshopDraft: WorkshopDraft = { id: '', workshopId: '', date: '', time: '', name: '', phone: '', petType: '', bringPet: '', petSize: '', difficulty: '', fabricSource: '' }

function readWorkshopDraft(): WorkshopDraft {
  try { return { ...emptyWorkshopDraft, ...JSON.parse(localStorage.getItem('pawtern-workshop-draft') || '{}') } } catch { return emptyWorkshopDraft }
}

function writeWorkshopDraft(next: WorkshopDraft) {
  localStorage.setItem('pawtern-workshop-draft', JSON.stringify(next))
}

function workshopDraftReady(draft: WorkshopDraft) {
  return Boolean(draft.workshopId && draft.date && draft.time && draft.name.trim() && draft.phone.trim() && draft.petType && draft.bringPet && draft.petSize && draft.difficulty && draft.fabricSource)
}

type RecycleDraft = { id: string; mode: 'pickup' | 'dropoff'; name: string; phone: string; address: string; store: string; date: string; time: string }
const emptyRecycleDraft: RecycleDraft = { id: '', mode: 'pickup', name: '', phone: '', address: '', store: '', date: '', time: '' }

function readRecycleDraft(): RecycleDraft {
  try { return { ...emptyRecycleDraft, ...JSON.parse(localStorage.getItem('pawtern-recycle-draft') || '{}') } } catch { return emptyRecycleDraft }
}

function writeRecycleDraft(next: RecycleDraft) {
  localStorage.setItem('pawtern-recycle-draft', JSON.stringify(next))
}

type StoredScheduleItem = { id: string; date: string; time: string; title: string; place: string; tone: string; target: Route }

function readStoredSchedule(): StoredScheduleItem[] {
  try { const value = JSON.parse(localStorage.getItem('pawtern-schedule') || '[]'); return Array.isArray(value) ? value : [] } catch { return [] }
}

function saveScheduleItem(item: StoredScheduleItem) {
  const items = readStoredSchedule().filter(existing => existing.id !== item.id)
  localStorage.setItem('pawtern-schedule', JSON.stringify([...items, item]))
}

function RecyclePage({ mode }: { mode: 'pickup' | 'dropoff' }) {
  const [draft, setDraft] = useState<RecycleDraft>(() => ({ ...readRecycleDraft(), mode }))
  const [reviewOpen, setReviewOpen] = useState(false)
  const update = (patch: Partial<RecycleDraft>) => setDraft(current => {
    const next = { ...current, ...patch, mode }
    writeRecycleDraft(next)
    return next
  })
  const swap = (next: 'pickup' | 'dropoff') => {
    update({ mode: next })
    go(next === 'pickup' ? '/recycle/pickup' : '/recycle/dropoff')
  }
  const complete = Boolean(draft.name.trim() && draft.phone.trim() && (mode === 'pickup' ? draft.address.trim() : draft.store) && draft.date && draft.time)
  const confirm = () => {
    if (!complete) return
    setReviewOpen(true)
  }
  const printReceipt = () => {
    const next = { ...draft, id: draft.id || `recycle-${Date.now()}`, mode }
    setDraft(next)
    writeRecycleDraft(next)
    go('/recycle/success')
  }
  return (
    <Screen className={`flow-page recycle-booking-page ${complete ? 'booking-ready' : ''}`}>
      <Header title="旧衣回收预约" onBack={() => go('/home')} />
      <div className="flow-body">
        <Segmented active={mode} onChange={swap} />
        <section className={`form-card ${mode === 'pickup' ? 'yellow' : 'blue'}`}>
          <h2>{mode === 'pickup' ? '上门信息' : '投递信息'}</h2>
          <div className="inner-form">
            <label className="form-field"><span>联系人姓名</span><input value={draft.name} onChange={event => update({ name: event.target.value })} placeholder="请输入姓名" /></label>
            <label className="form-field"><span>手机号码</span><input value={draft.phone} onChange={event => update({ phone: event.target.value.replace(/\D/g, '').slice(0, 11) })} placeholder="请输入11位手机号码" inputMode="tel" /></label>
            {mode === 'pickup'
              ? <label className="form-field"><span>详细地址</span><textarea value={draft.address} onChange={event => update({ address: event.target.value })} placeholder="街道、小区、门牌号等" /></label>
              : <label className="form-field"><span>选择门店</span><select value={draft.store} onChange={event => update({ store: event.target.value })}><option value="">请选择投递门店</option><option>黄龙国际中心回收点</option><option>西溪银泰回收点</option><option>湖滨银泰回收点</option></select></label>}
            <div className="two-fields">
              <label className="form-field"><span>日期</span><input type="date" min="2026-01-01" value={draft.date} onChange={event => update({ date: event.target.value })} /></label>
              <label className="form-field"><span>时段</span><select value={draft.time} onChange={event => update({ time: event.target.value })}><option value="">请选择</option><option>09:00-11:00</option><option>13:00-15:00</option><option>16:00-18:00</option></select></label>
            </div>
          </div>
        </section>
        <TextureButton className={`conditional-confirm ${mode}`} disabled={!complete} onClick={confirm}>确认预约</TextureButton>
      </div>
      <img className="flow-person" src="./assets/recycle-person-crop.png" alt="" />
      {reviewOpen && <div className="workshop-review-scrim recycle-review-scrim" role="presentation" onClick={() => setReviewOpen(false)}>
        <section className="workshop-review-sheet recycle-review-sheet" role="dialog" aria-modal="true" aria-labelledby="recycle-review-title" onClick={event => event.stopPropagation()}>
          <i className="handle" /><h2 id="recycle-review-title">核对回收预约</h2>
          <p>请确认以下信息无误，再打印预约取件码与清单。</p>
          <dl><div><dt>预约方式</dt><dd>{mode === 'pickup' ? '上门回收' : '门店投递'}</dd></div><div><dt>联系人</dt><dd>{draft.name} · {draft.phone}</dd></div><div><dt>日期</dt><dd>{draft.date.replace(/-/g, '/')}</dd></div><div><dt>时段</dt><dd>{draft.time}</dd></div><div><dt>{mode === 'pickup' ? '地址' : '门店'}</dt><dd>{mode === 'pickup' ? draft.address : draft.store}</dd></div></dl>
          <div className="workshop-review-actions"><button onClick={() => setReviewOpen(false)}>返回修改</button><TextureButton onClick={printReceipt}>确认</TextureButton></div>
        </section>
      </div>}
    </Screen>
  )
}

function WorkshopTop({ stepTitle }: { stepTitle: string }) {
  const draft = readWorkshopDraft()
  const location = workshopLocations.find(item => item.id === draft.workshopId) || workshopLocations[0]
  return (
    <>
      <Header title="DIY线下工坊预约" onBack={() => go('/workshops')} />
      <div className="workshop-location"><b><img src="./assets/location-pin.png" alt="" />{location.name}</b><small>距您{location.distance}</small></div>
      <h2 className="visually-hidden">{stepTitle}</h2>
    </>
  )
}

function CardStack({ tone = 'mint', children }: { tone?: 'mint' | 'blue' | 'yellow'; children: ReactNode }) {
  return (
    <section className={`card-stack ${tone}`}>
      <i /><i /><div>{children}</div>
    </section>
  )
}

function WorkshopProfile() {
  const [draft, setDraft] = useState<WorkshopDraft>(readWorkshopDraft)
  const update = (patch: Partial<WorkshopDraft>) => setDraft(current => { const next = { ...current, ...patch }; writeWorkshopDraft(next); return next })
  return (
    <Screen className="workshop-flow">
      <WorkshopTop stepTitle="基础信息" />
      <CardStack>
        <h2>基础信息</h2>
        <div className="workshop-form">
          <label className="form-field"><span>姓名</span><input value={draft.name} onChange={event => update({ name: event.target.value })} /></label>
          <label className="form-field"><span>联系方式</span><input inputMode="tel" value={draft.phone} onChange={event => update({ phone: event.target.value.replace(/\D/g, '').slice(0, 11) })} /></label>
        </div>
        <h2>宠物信息</h2>
        <div className="workshop-form pet-form">
          <div className="two-fields">
            <label className="form-field"><span>种类</span><select value={draft.petType} onChange={event => update({ petType: event.target.value })}><option value="">请选择</option><option>狗</option><option>猫</option><option>其他</option></select></label>
            <label className="form-field"><span>是否携带宠物</span><select value={draft.bringPet} onChange={event => update({ bringPet: event.target.value })}><option value="">请选择</option><option>是</option><option>否</option></select></label>
          </div>
          <label className="form-field"><span>体型</span><select value={draft.petSize} onChange={event => update({ petSize: event.target.value })}><option value="">请选择</option><option>超小体</option><option>小型</option><option>中型</option><option>大型</option></select></label>
        </div>
      </CardStack>
      <button className="side-arrow left" aria-label="上一步" onClick={() => go('/workshop/time')}><img src="./assets/workshop-arrow-right.svg" alt="" /></button><button className="side-arrow right" aria-label="下一步" onClick={() => go('/workshop/diy')}><img src="./assets/workshop-arrow-right.svg" alt="" /></button>
      <img className="sewing-person" src="./assets/workshop-person-crop.png" alt="" />
    </Screen>
  )
}

function WorkshopDiy() {
  const [draft, setDraft] = useState<WorkshopDraft>(readWorkshopDraft)
  const [reviewOpen, setReviewOpen] = useState(false)
  const update = (patch: Partial<WorkshopDraft>) => setDraft(current => { const next = { ...current, ...patch }; writeWorkshopDraft(next); return next })
  const ready = workshopDraftReady(draft)
  const location = workshopLocations.find(item => item.id === draft.workshopId) || workshopLocations[0]
  return (
    <Screen className={`workshop-flow ${ready ? 'booking-ready' : ''}`}>
      <WorkshopTop stepTitle="DIY选项" />
      <CardStack tone="yellow">
        <h2>DIY选项</h2>
        <div className="workshop-form diy-form">
          <label className="form-field"><span>难易程度</span><select value={draft.difficulty} onChange={event => update({ difficulty: event.target.value })}><option value="">请选择</option><option>初级（零基础）</option><option>进阶（有手作经验）</option><option>自由创作</option></select></label>
          <label className="form-field"><span>面料来源</span><select value={draft.fabricSource} onChange={event => update({ fabricSource: event.target.value })}><option value="">请选择</option><option>平台二手面料</option><option>自带宝宝旧衣</option><option>现场面料交换</option></select></label>
        </div>
      </CardStack>
      <button className="side-arrow left" aria-label="上一步" onClick={() => go('/workshop/profile')}><img src="./assets/workshop-arrow-right.svg" alt="" /></button>
      <button className="side-arrow right" aria-label="下一步" onClick={() => go('/workshop/time')}><img src="./assets/workshop-arrow-right.svg" alt="" /></button>
      <TextureButton className="workshop-confirm" disabled={!ready} onClick={() => ready && setReviewOpen(true)}>确认预约</TextureButton>
      <img className="sewing-person" src="./assets/workshop-person-crop.png" alt="" />
      {reviewOpen && <div className="workshop-review-scrim" role="presentation" onClick={() => setReviewOpen(false)}>
        <section className="workshop-review-sheet" role="dialog" aria-modal="true" aria-labelledby="workshop-review-title" onClick={event => event.stopPropagation()}>
          <i className="handle" />
          <h2 id="workshop-review-title">核对预约信息</h2>
          <p>请确认以下信息无误，再打印签到二维码与预约清单。</p>
          <dl>
            <div><dt>预约工坊</dt><dd>{location.name}</dd></div>
            <div><dt>日期</dt><dd>{draft.date.replace(/-/g, '/')}</dd></div>
            <div><dt>时段</dt><dd>{draft.time}</dd></div>
            <div><dt>联系人</dt><dd>{draft.name} · {draft.phone}</dd></div>
            <div><dt>宠物信息</dt><dd>{draft.petType} · {draft.petSize} · {draft.bringPet === '是' ? '携带宠物' : '不携带宠物'}</dd></div>
            <div><dt>DIY选项</dt><dd>{draft.difficulty} · {draft.fabricSource}</dd></div>
          </dl>
          <div className="workshop-review-actions">
            <button onClick={() => setReviewOpen(false)}>返回修改</button>
            <TextureButton onClick={() => go('/workshop/success')}>确认</TextureButton>
          </div>
        </section>
      </div>}
    </Screen>
  )
}

function Calendar({ selected, onSelect }: { selected: string; onSelect: (value: string) => void }) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const match = /^(\d{4})-(\d{2})/.exec(selected)
    return match ? new Date(Number(match[1]), Number(match[2]) - 1, 1) : new Date(2026, 0, 1)
  })
  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPreviousMonth = new Date(year, month, 0).getDate()
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7
  const dates = Array.from({ length: cellCount }, (_, index) => {
    const monthDay = index - firstWeekday + 1
    if (monthDay < 1) return { day: daysInPreviousMonth + monthDay, inMonth: false }
    if (monthDay > daysInMonth) return { day: monthDay - daysInMonth, inMonth: false }
    return { day: monthDay, inMonth: true }
  })
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(visibleMonth)
  const changeMonth = (offset: number) => setVisibleMonth(current => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  return (
    <div className="calendar">
      <label>日期 <input value={selected ? selected.replace(/-/g, '/') : '请选择日期'} readOnly /></label>
      <div className="week">{['Mo','Tu','We','Th','Fr','Sa','Su'].map(x => <b key={x}>{x}</b>)}</div>
      <div className="dates">{dates.map(({ day, inMonth }, index) => {
        const value = inMonth ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : ''
        return <button type="button" className={`${inMonth && selected === value ? 'selected' : ''} ${inMonth ? '' : 'outside'}`} disabled={!inMonth} onClick={() => value && onSelect(value)} key={`${year}-${month}-${day}-${index}`}>{day}</button>
      })}</div>
      <footer>
        <button className="calendar-month-arrow previous" type="button" onClick={() => changeMonth(-1)} aria-label="上一个月"><img src="./assets/calendar-arrow-left.svg" alt="" /></button>
        <span aria-live="polite">{monthLabel}</span>
        <button className="calendar-month-arrow next" type="button" onClick={() => changeMonth(1)} aria-label="下一个月"><img src="./assets/calendar-arrow-right.svg" alt="" /></button>
      </footer>
    </div>
  )
}

function WorkshopTime() {
  const [draft, setDraft] = useState<WorkshopDraft>(readWorkshopDraft)
  const update = (patch: Partial<WorkshopDraft>) => setDraft(current => { const next = { ...current, ...patch }; writeWorkshopDraft(next); return next })
  return (
    <Screen className="workshop-flow">
      <WorkshopTop stepTitle="时间选择" />
      <CardStack tone="blue">
        <h2>时间选择</h2>
        <Calendar selected={draft.date} onSelect={date => update({ date })} />
        <label className="time-select">时段 <select value={draft.time} onChange={event => update({ time: event.target.value })}><option value="">请选择时段</option><option>10:00-12:00</option><option>13:00-15:00</option><option>15:30-17:30</option></select></label>
      </CardStack>
      <button className="side-arrow left" aria-label="上一步" onClick={() => go('/workshop/diy')}><img src="./assets/workshop-arrow-right.svg" alt="" /></button><button className="side-arrow right" aria-label="下一步" onClick={() => go('/workshop/profile')}><img src="./assets/workshop-arrow-right.svg" alt="" /></button>
      <img className="sewing-person" src="./assets/workshop-person-crop.png" alt="" />
    </Screen>
  )
}

function Workshops() {
  const [selected, setSelected] = useState<WorkshopLocationId | ''>(() => readWorkshopDraft().workshopId)
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLocaleLowerCase('zh-CN')
  const filteredLocations = normalizedQuery
    ? workshopLocations.filter(item => `${item.name} ${item.address} ${item.distance} ${item.time}`.toLocaleLowerCase('zh-CN').includes(normalizedQuery))
    : workshopLocations
  const choose = (id: WorkshopLocationId) => {
    setSelected(id)
    const current = readWorkshopDraft()
    writeWorkshopDraft({ ...current, id: current.id || `workshop-${Date.now()}`, workshopId: id })
  }
  return (
    <Screen className="workshop-list">
      <div className="search-row">
        <button onClick={() => go('/home')} aria-label="返回"><img src={A.back} alt="" /></button>
        <label className="workshop-search">
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索服务地点" aria-label="搜索服务地点" />
          <span aria-hidden="true" />
        </label>
      </div>
      <span className="city-chip"><img src="./assets/workshop-city-chip.png" alt="杭州市" /></span>
      <section className="list-sheet">
        <i className="handle" /><h1>工坊列表</h1>
        <div className="workshop-results" aria-live="polite">
          {filteredLocations.map(item => {
            const imageIndex = workshopLocations.findIndex(location => location.id === item.id)
            return <button className={`workshop-item ${selected === item.id ? 'selected' : ''}`} aria-label={`选择${item.name}`} aria-pressed={selected === item.id} key={item.id} onClick={() => choose(item.id)}>
              <img src={`./assets/workshop-list-${imageIndex + 1}.png`} alt="" />
            </button>
          })}
          {!filteredLocations.length && <p className="workshop-empty">没有找到相关服务地点<br /><small>请尝试输入商圈、道路或工坊名称</small></p>}
        </div>
        <TextureButton disabled={!selected} onClick={() => selected && go('/workshop/time')}>确认预约</TextureButton>
      </section>
    </Screen>
  )
}

function PrintSuccessPage({ kind }: { kind: 'workshop' | 'recycle' }) {
  const [printing, setPrinting] = useState(true)
  const workshop = readWorkshopDraft()
  const recycle = readRecycleDraft()
  const location = workshopLocations.find(item => item.id === workshop.workshopId)
  const isWorkshop = kind === 'workshop'
  const date = isWorkshop ? workshop.date : recycle.date
  const time = isWorkshop ? workshop.time : recycle.time
  const name = isWorkshop ? workshop.name : recycle.name
  const place = isWorkshop ? (location?.name || '线下工坊') : (recycle.mode === 'pickup' ? recycle.address : recycle.store)
  useEffect(() => {
    const id = (isWorkshop ? workshop.id : recycle.id) || `${kind}-${Date.now()}`
    if (date && time) saveScheduleItem({ id, date, time, title: isWorkshop ? '宠物服饰 DIY 线下工坊' : recycle.mode === 'pickup' ? '旧衣上门回收' : '旧衣门店投递', place, tone: isWorkshop ? 'mint' : 'yellow', target: isWorkshop ? '/workshops' : '/recycle/pickup' })
    const timer = window.setTimeout(() => setPrinting(false), 2200)
    return () => window.clearTimeout(timer)
  }, [])
  return (
    <Screen className={`success-page print-success-page ${isWorkshop ? 'workshop-success' : 'recycle-success'} ${printing ? 'is-printing' : 'print-complete'}`}>
      <div className="success-top"><i className="handle" /><span>{printing ? '正在打印预约清单…' : '清单打印完成'}</span></div>
      <div className="success-print-window">
        {isWorkshop ? <section className="ticket">
          <div className="check">✓</div><h1>预约成功</h1><small>{date.replace(/-/g, '/')}</small>
          <hr /><div className="qr-wrap"><img src={A.successQr} alt="到店签到二维码" /></div><p>凭码到店签到</p><hr />
          <dl><div><dt>姓名</dt><dd>{name}</dd></div><div><dt>日期</dt><dd>{date}</dd></div><div><dt>时段</dt><dd>{time}</dd></div></dl>
          <footer>Thank you for your booking</footer>
        </section> : <section className="ticket recycle-ticket">
          <div className="check"><img src="./assets/recycle-success-check.svg" alt="" /></div><h1>预约成功</h1><small>{date.replace(/-/g, '/')}</small>
          <hr /><div className="pickup-code"><b>取件码</b><strong>0DMQ5Z</strong></div><hr />
          <dl><div><dt>姓名</dt><dd>{name}</dd></div><div><dt>日期</dt><dd>{date}</dd></div><div><dt>时段</dt><dd>{time}</dd></div></dl>
          <footer>Thank you for your booking</footer>
        </section>}
      </div>
      {!printing && <div className="print-success-actions">
        {isWorkshop && <TextureButton className="coral" onClick={() => go('/fabrics')}>预约面料</TextureButton>}
        <TextureButton onClick={() => go('/home')}>返回首页</TextureButton>
      </div>}
    </Screen>
  )
}

function WorkshopSuccess() { return <PrintSuccessPage kind="workshop" /> }
function RecycleSuccess() { return <PrintSuccessPage kind="recycle" /> }

type FabricId = 'yellow' | 'pink' | 'blue' | 'floral' | 'navy' | 'denim'
type FabricMode = 'workshop' | 'purchase'

type StoredFabricOrder = {
  id: string
  filter: 'shipping'
  status: string
  date: string
  productId: string
  image: string
  name: string
  meta: string
  price: string
}

function readFabricCheckout(): FabricId[] {
  try {
    const value = JSON.parse(localStorage.getItem('pawtern-fabric-checkout') || '[]')
    return Array.isArray(value) ? value.filter((id): id is FabricId => ['yellow','pink','blue','floral','navy','denim'].includes(id)) : []
  } catch { return [] }
}

function readStoredFabricOrders(): StoredFabricOrder[] {
  try {
    const value = JSON.parse(localStorage.getItem('pawtern-fabric-orders') || '[]')
    return Array.isArray(value) ? value : []
  } catch { return [] }
}

function saveStoredFabricOrder(order: StoredFabricOrder) {
  const orders = readStoredFabricOrders().filter(item => item.id !== order.id)
  localStorage.setItem('pawtern-fabric-orders', JSON.stringify([order, ...orders]))
}

const fabricItems: Array<{ id: FabricId; img: string; name: string; kind: string; size: string; season: string; story: string; rotate: string }> = [
  { id: 'yellow', img: A.fabricPink, name: '蜜糖黄格纹', kind: '精梳棉', size: '48cm × 52cm', season: '春 & 夏', story: '来自一件陪孩子度过第一个春天的小衬衫，明亮格纹适合制作领巾与小裙摆。', rotate: '-1deg' },
  { id: 'pink', img: A.fabricYellow, name: '樱粉波点', kind: '水洗棉', size: '45cm × 50cm', season: '四季', story: '柔软水洗棉取自闲置婴童床品，粉色波点温和耐看，适合贴身背心与装饰口袋。', rotate: '3deg' },
  { id: 'blue', img: A.fabricBlue, name: '奶蓝格纹', kind: '粗花呢', size: '45cm × 45cm', season: '春 & 夏', story: '清爽奶蓝格纹来自一条旧童裙，纱线结实又透气，适合做轻便外套与蝴蝶领结。', rotate: '4deg' },
  { id: 'floral', img: A.fabricFloral, name: '花园小雏菊', kind: '纯棉府绸', size: '50cm × 55cm', season: '春 & 秋', story: '曾经是一件亲子野餐裙，细小花朵保留着草地午后的记忆，适合制作裙装与包边。', rotate: '-5deg' },
  { id: 'navy', img: A.fabricDenim, name: '深海蓝波点', kind: '棉麻混纺', size: '46cm × 50cm', season: '秋 & 冬', story: '深蓝布面来自一件穿旧的儿童外套，耐磨有筋骨，适合制作背心前片和耐用口袋。', rotate: '3deg' },
  { id: 'denim', img: A.fabricNavy, name: '晴空蓝丹宁', kind: '轻薄牛仔', size: '52cm × 56cm', season: '四季', story: '轻薄丹宁取自孩子长高后穿不下的牛仔衬衣，留下自然水洗痕迹，适合工装造型。', rotate: '-3deg' },
]

function FabricsExperience({ initialDetail }: { initialDetail?: FabricId }) {
  const [mode, setMode] = useState<FabricMode>('workshop')
  const [selected, setSelected] = useState<FabricId[]>([])
  const [detailId, setDetailId] = useState<FabricId | null>(initialDetail || null)
  const [toast, setToast] = useState('')
  const [pickupNoticeOpen, setPickupNoticeOpen] = useState(false)
  const detail = fabricItems.find(item => item.id === detailId)
  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 1600)
  }
  const toggleFabric = (id: FabricId) => {
    setSelected(items => {
      if (items.includes(id)) return items.filter(item => item !== id)
      if (items.length >= 3) {
        notify('最多选择 3 款面料')
        return items
      }
      return [...items, id]
    })
    setDetailId(null)
  }
  const confirmSelection = () => {
    if (!selected.length) {
      notify('请先挑选面料')
      return
    }
    if (mode === 'workshop') {
      setPickupNoticeOpen(true)
      return
    }
    localStorage.setItem('pawtern-fabric-checkout', JSON.stringify(selected))
    go('/fabrics/checkout')
  }

  return (
    <main className="extension-screen fabric-experience">
      <ExtensionHeader title="面料故事集" back="/shop/kits" />
      <nav className="fabric-mode-tabs" aria-label="面料用途">
        <button className={mode === 'workshop' ? 'active' : ''} onClick={() => setMode('workshop')}>预约工坊</button>
        <button className={mode === 'purchase' ? 'active' : ''} onClick={() => setMode('purchase')}>市集购买</button>
      </nav>
      <section className="fabric-board-scroll">
        <div className="fabric-story-board">
          <div className="fabric-story-grid">
            {fabricItems.map(item => (
              <button aria-label={`查看${item.name}`} className={selected.includes(item.id) ? 'selected' : ''} key={item.id} style={{ transform: `rotate(${item.rotate})` }} onClick={() => setDetailId(item.id)}>
                <img src={item.img} alt={item.name} /><i />
              </button>
            ))}
          </div>
        </div>
      </section>
      <footer className="fabric-selection-footer">
        <span>挑选灵感</span>
        <div className="fabric-selected-strip" aria-label="已选面料">
          {selected.map(id => {
            const item = fabricItems.find(fabric => fabric.id === id)!
            return <button key={id} aria-label={`查看或移除${item.name}`} onClick={() => setDetailId(id)}><img src={item.img} alt="" /><i onClick={event => { event.stopPropagation(); setSelected(items => items.filter(value => value !== id)) }}>×</i></button>
          })}
        </div>
        <em>已选 {selected.length}/3</em>
        <button className="extension-texture-button" onClick={confirmSelection}>{mode === 'purchase' ? '确认购买' : '确认带走'}</button>
      </footer>
      {detail && <div className="fabric-detail-layer" onClick={() => setDetailId(null)}>
          <section className="fabric-detail-card" onClick={event => event.stopPropagation()}>
            <i className="fabric-tape" /><button className="fabric-detail-close" onClick={() => setDetailId(null)}>×</button>
            <img src={detail.img} alt={detail.name} /><div className="fabric-detail-title"><h2>{detail.name}</h2><small>{detail.kind}</small></div>
            <p>{detail.story}</p>
            <dl><div><dt>尺寸</dt><dd>{detail.size}</dd></div><div><dt>季节</dt><dd>{detail.season}</dd></div></dl>
            <button className="extension-texture-button" onClick={() => toggleFabric(detail.id)}>{selected.includes(detail.id) ? '取消选定' : '选定这块面料'}</button>
          </section>
        </div>}
      {pickupNoticeOpen && <div className="fabric-pickup-layer" role="presentation" onClick={() => setPickupNoticeOpen(false)}>
        <section className="fabric-pickup-card" role="dialog" aria-modal="true" aria-labelledby="fabric-pickup-title" onClick={event => event.stopPropagation()}>
          <i>✓</i><h2 id="fabric-pickup-title">面料已为你留好</h2>
          <p>请在预约时间至预约工坊直接领取！</p>
          <button className="extension-texture-button" onClick={() => setPickupNoticeOpen(false)}>知道了</button>
        </section>
      </div>}
      {toast && <div className="toast">{toast}</div>}
    </main>
  )
}

function FabricCheckoutPage() {
  const selectedIds = readFabricCheckout()
  const selectedFabrics = selectedIds.map(id => fabricItems.find(item => item.id === id)).filter((item): item is (typeof fabricItems)[number] => Boolean(item))
  const total = (selectedFabrics.length * 12.9).toFixed(2)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [payment, setPayment] = useState('微信支付')
  const [paid, setPaid] = useState(false)
  const ready = Boolean(selectedFabrics.length && name.trim() && /^1\d{10}$/.test(phone) && address.trim())
  const pay = () => {
    if (!ready) return
    const now = new Date()
    const order: StoredFabricOrder = {
      id: `PAWFAB${Date.now()}`,
      filter: 'shipping',
      status: '已支付 · 待发货',
      date: now.toISOString().slice(0, 10),
      productId: 'cotton-fabric-pack',
      image: selectedFabrics[0].img,
      name: selectedFabrics.map(item => item.name).join('、'),
      meta: `环保面料 · ${selectedFabrics.length}件${note.trim() ? ` · 备注：${note.trim()}` : ''}`,
      price: `¥${total}`,
    }
    saveStoredFabricOrder(order)
    setPaid(true)
  }
  return <main className="extension-screen fabric-checkout-screen">
    <ExtensionHeader title="订单结算" back="/fabrics" />
    <div className="extension-scroll fabric-checkout-scroll">
      {!selectedFabrics.length ? <section className="fabric-checkout-empty"><h2>还没有选择面料</h2><p>请返回面料故事集，最多挑选三款面料。</p><button onClick={() => go('/fabrics')}>返回挑选</button></section> : <>
        <section className="fabric-checkout-card checkout-address">
          <header><h2>收货地址</h2><span>请填写完整信息</span></header>
          <label><span>收货人</span><input value={name} onChange={event => setName(event.target.value)} placeholder="请输入姓名" /></label>
          <label><span>手机号</span><input inputMode="tel" value={phone} onChange={event => setPhone(event.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="请输入11位手机号码" /></label>
          <label><span>详细地址</span><textarea value={address} onChange={event => setAddress(event.target.value)} placeholder="省、市、区、街道及门牌号" /></label>
        </section>
        <section className="fabric-checkout-card checkout-goods">
          <header><h2>面料清单</h2><span>共 {selectedFabrics.length} 件</span></header>
          {selectedFabrics.map(item => <article key={item.id}><img src={item.img} alt={item.name} /><span><b>{item.name}</b><small>{item.kind} · {item.size}</small></span><em>¥12.90</em></article>)}
          <label className="checkout-note"><span>订单备注</span><input value={note} onChange={event => setNote(event.target.value)} placeholder="选填，可填写配送或面料需求" /></label>
        </section>
        <section className="fabric-checkout-card checkout-payment">
          <h2>支付方式</h2>
          {['微信支付','支付宝','银行卡'].map(item => <button className={payment === item ? 'selected' : ''} key={item} onClick={() => setPayment(item)}><span>{item}</span><i>{payment === item ? '✓' : ''}</i></button>)}
        </section>
        <section className="checkout-summary"><span>面料金额</span><b>¥{total}</b><span>配送费</span><b>¥0.00</b><strong>实付款</strong><em>¥{total}</em></section>
      </>}
    </div>
    {!!selectedFabrics.length && <footer className="fabric-checkout-footer"><span>合计 <b>¥{total}</b></span><button disabled={!ready} onClick={pay}>确认支付</button></footer>}
    {paid && <div className="fabric-payment-layer"><section role="dialog" aria-modal="true"><i>✓</i><h2>您已支付</h2><p>{payment}支付成功，面料订单已载入“我的订单”。</p><button onClick={() => go('/orders')}>查看我的订单</button><button onClick={() => go('/shop/kits')}>返回市集</button></section></div>}
  </main>
}

type Product = {
  id: string
  img: string
  tag: string
  name: string
  price: string
  sold: string
  shipping: string
  description: string
}

const products: Product[] = [
  { id: 'kidswear-kit', img: A.productKit, tag: '材料包', name: '童装改造辅助包', price: '¥29', sold: '销量 368', shipping: '48小时内发货 · 满99包邮 · 教程卡随包附赠', description: '为旧童装改造准备的入门辅助包，含纸样、包边条、环保线与定位贴。适合第一次尝试宠物服饰制作的家庭。' },
  { id: 'cotton-fabric-pack', img: A.productFabric, tag: '面料', name: '二手纯棉面料包', price: '¥19', sold: '销量 200+', shipping: '48小时内发货 · 满99包邮 · 7天无理由退换', description: '经过清洁与安全筛选的婴童级纯棉面料，柔软透气。每包包含协调花色，可制作宠物领巾、背心或互动玩具。' },
  { id: 'wood-buttons', img: A.productButtons, tag: '辅料', name: '天然木质纽扣', price: '¥9.9', sold: '销量 156', shipping: '24小时内发货 · 与材料包合单免运费', description: '天然原木打磨的小尺寸纽扣，边缘圆润，保留温暖木纹。可用于宠物服饰门襟、口袋与装饰细节。' },
  { id: 'sewing-tool-set', img: A.productTools, tag: '工具', name: '缝纫工具套装', price: '¥89', sold: '销量 89', shipping: '48小时内发货 · 工具一年保修', description: '包含布剪、软尺、拆线器、珠针、顶针和收纳包，一套满足旧衣拆解、量体与手缝制作需求。' },
]

const brandProducts: Product[] = [
  { id: 'mori-knit', img: A.marketBrand1, tag: 'MORI PET', name: 'MORI PET 羊毛针织系列', price: '¥128', sold: '销量 72', shipping: '品牌直发 · 预计3日内发货', description: '采用回收羊毛混纺纱线，以柔和中性色和细密针法打造轻暖宠物针织衣，适合秋冬日常穿着。' },
  { id: 'paw-hoodie', img: A.marketBrand2, tag: 'PAW & CO.', name: 'PAW & CO. 轻暖连帽衫', price: '¥99', sold: '销量 118', shipping: '品牌直发 · 支持尺码更换', description: '旧棉卫衣再设计的轻暖连帽款，腹部留有活动空间，柔软罗纹不会勒住毛孩子。' },
  { id: 'bowwow-bow', img: A.marketBrand3, tag: 'BOWWOW', name: 'BOWWOW 礼服领结系列', price: '¥69', sold: '销量 96', shipping: '48小时内发货 · 附可调节颈带', description: '将闲置衬衫与领带裁片重新组合成礼服领结，轻巧可调，适合节日、生日和拍照场景。' },
  { id: 'urban-red-hoodie', img: A.marketBrand4, tag: 'URBAN TAIL', name: 'URBAN TAIL 红色卫衣', price: '¥109', sold: '销量 64', shipping: '品牌直发 · 预计3日内发货', description: '醒目的城市红连帽卫衣，使用回收棉布与弹力袖口，适合春秋散步与户外活动。' },
]

const outfitProducts: Product[] = [
  { id: 'cream-knit-look', img: A.marketOutfit1, tag: '针织穿搭', name: '奶油色针织日常造型', price: '¥79', sold: '搭配收藏 286', shipping: '造型单品48小时内发货', description: '奶油色针织背心搭配同色领巾，保留旧毛衣细腻肌理，呈现柔和温暖的居家日常感。' },
  { id: 'city-hoodie-look', img: A.marketOutfit2, tag: '街头穿搭', name: '城市散步连帽造型', price: '¥89', sold: '搭配收藏 193', shipping: '造型单品48小时内发货', description: '用旧卫衣重组的轻便连帽造型，短身剪裁方便活动，适合城市散步与咖啡店小憩。' },
  { id: 'color-sweat-look', img: A.marketOutfit3, tag: '公园穿搭', name: '彩色卫衣活力搭配', price: '¥75', sold: '搭配收藏 167', shipping: '造型单品48小时内发货', description: '高饱和彩色拼接来自儿童卫衣余料，宽松袖口和背部开口让公园奔跑更舒适。' },
  { id: 'yellow-rain-look', img: A.marketOutfit4, tag: '雨季穿搭', name: '姜黄色轻便外套', price: '¥99', sold: '搭配收藏 221', shipping: '造型单品72小时内发货', description: '轻薄防泼水旧风衣面料再制，姜黄色在阴雨天依旧醒目，适合雨后散步。' },
]

const saleProducts: Product[] = products.map((product, index) => ({
  ...product,
  id: `sale-${product.id}`,
  name: [`童装改造辅助包·满减专享`, `二手纯棉面料包·两件减10`, `天然木质纽扣·加购优惠`, `缝纫工具套装·限时直降`][index],
  price: ['¥24.9', '¥16.9', '¥6.9', '¥79'][index],
  description: `${product.description} 当前商品参加旧衣新生优惠季满减活动。`,
}))

const fanProducts: Product[] = [
  { ...outfitProducts[0], id: 'fan-cream-knit', tag: '本周人气' },
  { ...brandProducts[1], id: 'fan-paw-hoodie', tag: '新手友好' },
  { ...outfitProducts[3], id: 'fan-yellow-rain', tag: '雨季必备' },
  { ...products[0], id: 'fan-kidswear-kit', tag: '改造入门', name: '童装改造辅助材料包' },
]

const allProducts = [...products, ...brandProducts, ...outfitProducts, ...saleProducts, ...fanProducts]

function Shop({ kits = false }: { kits?: boolean }) {
  const [cart, setCart] = useState(0)
  return (
    <Screen className="shop-page">
      <div className="shop-search">⌕</div><button className="cart">🛒<i>{cart || ''}</i></button>
      <div className="shop-tabs">
        {['推荐','DIY材料包','品牌','穿搭'].map((t, i) => <button key={t} className={(kits ? i === 1 : i === 0) ? 'active' : ''} onClick={() => i === 1 ? go('/shop/kits') : i === 0 ? go('/shop') : undefined}>{t}</button>)}
      </div>
      {!kits && <section className="shop-shortcuts">{['DIY材料包','美妙商店','超级满减','宠粉清单','我的订单','购物车','我的足迹'].map((x, i) => <button key={x}><b>{['🧵','🏪','🎫','📋','🧾','🛒','🐾'][i]}</b>{x}</button>)}</section>}
      {kits && <button className="fabric-banner" onClick={() => go('/fabrics')}>✂ 购买/预约独一无二的面料　〉</button>}
      <section className="product-grid">
        {products.map(p => (
          <article key={p.name} onClick={() => openProduct(p.id, kits ? '/shop/kits' : '/shop')}>
            <div><img src={p.img} alt="" /><span>{p.tag}</span></div><h3>{p.name}</h3><b>{p.price}</b>
            <button onClick={e => { e.stopPropagation(); setCart(v => v + 1) }}>＋</button>
          </article>
        ))}
      </section>
      <BottomNav active="shop" />
    </Screen>
  )
}

function ProductDetailPage() {
  const [toast, setToast] = useState('')
  const notify = (text: string) => { setToast(text); setTimeout(() => setToast(''), 1800) }
  const params = new URLSearchParams(location.hash.split('?')[1] || '')
  const id = params.get('id')
  const requestedBack = params.get('back') as Route | null
  const backRoute = requestedBack && routes.has(requestedBack) ? requestedBack : '/shop/kits'
  const product = allProducts.find(item => item.id === id) || products[1]
  return (
    <main className="extension-screen dynamic-product-page">
      <ExtensionHeader title="商品详情" back={backRoute} />
      <div className="extension-scroll dynamic-product-scroll">
        <section className="dynamic-product-hero"><img src={product.img} alt={product.name} /><span>{product.tag}</span></section>
        <section className="dynamic-product-sheet">
          <i className="sheet-handle" />
          <div className="product-meta"><span>{product.tag}</span><small>{product.sold}</small></div>
          <h1>{product.name}</h1><strong>{product.price}</strong>
          <article><h3>配送服务</h3><p>{product.shipping}</p></article>
          <article><h3>商品描述</h3><p>{product.description}</p></article>
        </section>
      </div>
      <div className="product-fixed-actions"><TextureButton onClick={() => notify('已加入购物车')}>加入购物车</TextureButton><TextureButton dark onClick={() => notify('已生成购买订单')}>立即购买</TextureButton></div>
      {toast && <div className="toast">{toast}</div>}
    </main>
  )
}

function Messages() {
  const contacts = [
    ['手工小能手','亲，材料包里有教程吗？我是新手不太…','5分钟前','2'],
    ['大黄的主人','上次活动的图片发我一下哈，谢谢！','1小时前',''],
    ['Pawtern官方客服','您的反馈我们已经收到了，会尽快处理。','昨天',''],
    ['流浪动物基地','感谢您的捐赠！猫窝已经收到啦。','3天前',''],
  ]
  return (
    <Screen className="messages-page">
      <Header title="消息" onBack={() => go('/home')} />
      <section className="message-actions">
        {['赞和收藏','新增关注','评论和@'].map((x, i) => <button key={x}><b>{['💗','🧩','💬'][i]}</b>{x}</button>)}
      </section>
      <button className="notice-card"><b>🔔</b><span><strong>系统通知</strong><small>您的订单 20231025001 已发货</small></span><em>10:00</em></button>
      <button className="notice-card"><b>〽</b><span><strong>活动消息</strong><small>您的订单 20231025001 已发货</small></span><em>10:00</em></button>
      <h2 className="private-title">💬 私信</h2>
      {contacts.map(([name,msg,time,badge], i) => <button className="contact" key={name}><i className={`avatar a${i}`} /><span><strong>{name}</strong><small>{msg}</small></span><em>{time}</em>{badge && <b>{badge}</b>}</button>)}
      <BottomNav active="messages" />
    </Screen>
  )
}

function Profile() {
  return (
    <Screen className="profile-page">
      <button className="settings">⚙</button>
      <section className="identity"><i /><div><h1>Sarah</h1><p>ID: 680979018　▦</p><span>LV.3 环保达人</span><span>积分: 1205</span></div></section>
      <button className="schedule"><b>▣　我的日程</b><small>查看工坊预约与活动</small><em>2个待参加 〉</em></button>
      <section className="services"><h2>⭐ 我的服务</h2><div>
        {[['📋','我的订单','/shop'],['🐶','我的宠物','/profile'],['🏆','我的成就','/achievements'],['⌖','我的地址','/profile']].map(([ic,label,route]) => <button key={label} onClick={() => go(route as Route)}><b>{ic}</b>{label}</button>)}
      </div></section>
      <section className="likes"><div className="likes-tabs"><button className="active">喜欢</button><button>收藏 (5)</button><button>笔记 (2)</button></div>
        <div className="posts"><article><img src={A.profilePost1} alt="" /><p>宝宝的连体衣变成狗子战袍</p></article><article><img src={A.profilePost2} alt="" /><p>闲置衬衫领子秒变绅士领结</p></article></div>
      </section>
      <BottomNav active="profile" />
    </Screen>
  )
}

function Achievements({ action = false }: { action?: boolean }) {
  return (
    <Screen className="achievement-page">
      <Header title="我的成就" onBack={() => go('/profile')} />
      <section className="basket-copy"><p>你参与回收了<br />多少旧衣？</p><p>你DIY了多少<br />宠物服饰？</p></section>
      <section className="baskets"><div><img src={A.achievementA} alt="" /><span>婴童闲置旧衣<br /><b>20件</b></span></div><div><img src={A.achievementB} alt="" /><span>已制作宠物新衣<br /><b>4件</b></span></div></section>
      <section className={`achievement-sheet ${action ? 'tall' : ''}`}>
        <i className="handle" />
        <article className="wide-stat"><span>已制作宠物新衣<strong>4<small> 件</small></strong></span><b>✂</b></article>
        <div className="stat-grid"><article>循环使用旧衣<strong>20<small> 件</small></strong></article><article>转化面料<strong>2.8<small> ㎡</small></strong></article></div>
        <div className="footprint-title"><b>▦ 成长足迹</b><span>本周　 <i>本月</i></span></div>
        <article className="timeline"><b>🏪　线下工坊 - 旧衣DIY</b><small>+1 件 / 0.4㎡</small><em>12-15</em></article>
        <button className="history">查看全部历史 →</button>
        {action && <TextureButton dark onClick={() => go('/workshops')}>▣　预约线下工坊 DIY</TextureButton>}
      </section>
    </Screen>
  )
}

type RefScreen = {
  image: string
  fixedBar?: boolean
}

const referenceScreens: Partial<Record<Route, RefScreen>> = {
  '/onboarding/1': { image: './reference/onboarding-1.png' },
  '/onboarding/2': { image: './reference/onboarding-2.png' },
  '/onboarding/3': { image: './reference/onboarding-3.png' },
  '/login': { image: './reference/login.png' },
  '/register': { image: './reference/register.png' },
  '/home': { image: './reference/home.png', fixedBar: true },
  '/home/diy': { image: './reference/home-modal.png' },
  '/recycle/pickup': { image: './reference/recycle-pickup.png' },
  '/recycle/dropoff': { image: './reference/recycle-dropoff.png' },
  '/workshops': { image: './reference/workshops.png' },
  '/workshop/profile': { image: './reference/workshop-profile.png' },
  '/workshop/diy': { image: './reference/workshop-diy.png' },
  '/workshop/time': { image: './reference/workshop-time.png' },
  '/workshop/success': { image: './reference/workshop-success.png' },
  '/fabrics': { image: './reference/fabrics.png' },
  '/fabrics/detail': { image: './reference/fabric-detail.png' },
  '/shop': { image: './reference/shop.png', fixedBar: true },
  '/shop/kits': { image: './reference/shop-kits.png', fixedBar: true },
  '/product': { image: './reference/product.png' },
  '/messages': { image: './reference/messages.png', fixedBar: true },
  '/profile': { image: './reference/profile.png', fixedBar: true },
  '/achievements': { image: './reference/achievements.png' },
  '/achievements/action': { image: './reference/achievements-action.png' },
}

function hotspotStyle(x: number, y: number, width: number, height: number) {
  return {
    left: `${x / 390 * 100}%`,
    top: `${y / 844 * 100}%`,
    width: `${width / 390 * 100}%`,
    height: `${height / 844 * 100}%`,
  }
}

function Hotspot({ label, to, x, y, width, height, onClick }: {
  label: string
  to?: Route
  x: number
  y: number
  width: number
  height: number
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className="reference-hotspot"
      style={hotspotStyle(x, y, width, height)}
      aria-label={label}
      title={label}
      onClick={onClick || (() => to && go(to))}
    />
  )
}

function ReferenceInput({ label, type = 'text', x, y, width, height }: {
  label: string
  type?: string
  x: number
  y: number
  width: number
  height: number
}) {
  return (
    <input
      className="reference-input"
      aria-label={label}
      type={type}
      placeholder=" "
      style={hotspotStyle(x, y, width, height)}
    />
  )
}

function AuthReferenceInput({ type, y, register = false }: {
  type: 'email' | 'password'
  y: number
  register?: boolean
}) {
  const label = type === 'email' ? '邮箱地址' : '密码'
  return (
    <div className="auth-reference-field" style={hotspotStyle(76, y, 264, 49)}>
      <input
        className="auth-reference-input"
        aria-label={label}
        name={type}
        type={type}
        placeholder={label}
        autoComplete={type === 'email' ? 'email' : register ? 'new-password' : 'current-password'}
        autoCapitalize="none"
        spellCheck={false}
      />
    </div>
  )
}

function FixedReferenceNav({ route }: { route: Route }) {
  const homeActive = route === '/home'
  const shopActive = route.startsWith('/shop')
  const messagesActive = route === '/messages'
  const profileActive = route === '/profile'

  return (
    <>
      <div className="reference-nav-surface" aria-hidden="true" />
      <nav className="reference-nav-icons" aria-label="固定底部导航">
        <button className={homeActive ? 'is-active' : ''} aria-label="首页" onClick={() => go('/home')}>
          <img src={homeActive ? A.navHomeActive : A.navHome} alt="" draggable={false} />
        </button>
        <button className={shopActive ? 'is-active' : ''} aria-label="商店" onClick={() => go('/shop')}>
          <img src={shopActive ? A.navShopActive : A.navShop} alt="" draggable={false} />
        </button>
        <span className="reference-nav-center-gap" aria-hidden="true" />
        <button className={messagesActive ? 'is-active' : ''} aria-label="消息" onClick={() => go('/messages')}>
          <img src={messagesActive ? A.navMessageActive : A.navMessage} alt="" draggable={false} />
        </button>
        <button className={profileActive ? 'is-active' : ''} aria-label="我的" onClick={() => go('/profile')}>
          <img src={profileActive ? A.navProfileActive : A.navProfile} alt="" draggable={false} />
        </button>
      </nav>
      <button className="reference-plus" aria-label="发布社区笔记" onClick={() => go('/publish')}>
        <img src={A.navPlus} alt="" draggable={false} />
      </button>
    </>
  )
}

function RouteHotspots({ route }: { route: Route }) {
  switch (route) {
    case '/onboarding/1':
      return <Hotspot label="下一页" to="/onboarding/2" x={31} y={699} width={324} height={62} />
    case '/onboarding/2':
      return <Hotspot label="下一页" to="/onboarding/3" x={31} y={699} width={324} height={62} />
    case '/onboarding/3':
      return <Hotspot label="开启旅程" to="/login" x={31} y={699} width={324} height={62} />
    case '/login':
      return <>
        <AuthReferenceInput type="email" y={355} />
        <AuthReferenceInput type="password" y={423} />
        <Hotspot label="登录" to="/home" x={32} y={490} width={322} height={61} />
        <Hotspot label="去注册" to="/register" x={217} y={569} width={58} height={28} />
      </>
    case '/register':
      return <>
        <AuthReferenceInput type="email" y={355} register />
        <AuthReferenceInput type="password" y={423} register />
        <Hotspot label="注册" to="/home" x={32} y={594} width={322} height={62} />
        <Hotspot label="去登录" to="/login" x={217} y={677} width={58} height={28} />
      </>
    case '/home':
      return <>
        <Hotspot label="搜索" to="/search" x={28} y={56} width={334} height={38} />
        <Hotspot label="全部活动" to="/activities" x={278} y={108} width={88} height={42} />
        <Hotspot label="旧衣回收预约" to="/recycle/pickup" x={16} y={398} width={174} height={121} />
        <Hotspot label="宠物服饰DIY" to="/home/diy" x={200} y={398} width={174} height={121} />
        <Hotspot label="宝宝旧衣改造笔记" x={20} y={604} width={168} height={212} onClick={() => openPost('baby')} />
        <Hotspot label="旧衣回收成果笔记" x={201} y={604} width={168} height={212} onClick={() => openPost('recycle')} />
      </>
    case '/home/diy':
      return <>
        <Hotspot label="前往线下工坊DIY" to="/workshops" x={18} y={589} width={354} height={69} />
        <Hotspot label="在家DIY" to="/shop/kits" x={18} y={665} width={354} height={69} />
        <Hotspot label="关闭" to="/home" x={0} y={0} width={390} height={548} />
      </>
    case '/recycle/pickup':
      return <>
        <Hotspot label="返回" to="/home" x={19} y={53} width={42} height={42} />
        <Hotspot label="门店投递" to="/recycle/dropoff" x={195} y={111} width={170} height={48} />
        <ReferenceInput label="联系人姓名" x={67} y={288} width={256} height={36} />
        <ReferenceInput label="手机号码" type="tel" x={67} y={366} width={256} height={36} />
        <ReferenceInput label="详细地址" x={67} y={445} width={256} height={56} />
        <Hotspot label="确认预约" to="/home" x={24} y={687} width={342} height={69} />
      </>
    case '/recycle/dropoff':
      return <>
        <Hotspot label="返回" to="/home" x={19} y={53} width={42} height={42} />
        <Hotspot label="上门回收" to="/recycle/pickup" x={24} y={111} width={171} height={48} />
        <ReferenceInput label="联系人姓名" x={67} y={290} width={256} height={36} />
        <ReferenceInput label="手机号码" type="tel" x={67} y={369} width={256} height={36} />
        <Hotspot label="确认预约" to="/home" x={24} y={688} width={342} height={69} />
      </>
    case '/workshops':
      return <>
        <Hotspot label="返回" to="/home" x={19} y={72} width={42} height={42} />
        <Hotspot label="选择黄龙国际中心旗舰工坊" to="/workshop/profile" x={22} y={279} width={345} height={120} />
        <Hotspot label="选择西溪银泰旧衣改造点" to="/workshop/profile" x={22} y={415} width={345} height={120} />
        <Hotspot label="选择湖滨银泰手工小栈" to="/workshop/profile" x={22} y={551} width={345} height={120} />
        <Hotspot label="确认预约" to="/workshop/profile" x={22} y={750} width={345} height={69} />
      </>
    case '/workshop/profile':
      return <>
        <Hotspot label="返回" to="/workshops" x={20} y={53} width={42} height={42} />
        <Hotspot label="下一步" to="/workshop/diy" x={350} y={344} width={38} height={72} />
        <ReferenceInput label="姓名" x={108} y={259} width={173} height={26} />
        <ReferenceInput label="联系方式" x={108} y={311} width={173} height={26} />
      </>
    case '/workshop/diy':
      return <>
        <Hotspot label="上一步" to="/workshop/profile" x={0} y={344} width={40} height={72} />
        <Hotspot label="下一步" to="/workshop/time" x={350} y={344} width={40} height={72} />
        <Hotspot label="确认预约" to="/workshop/time" x={67} y={612} width={256} height={69} />
      </>
    case '/workshop/time':
      return <>
        <Hotspot label="上一步" to="/workshop/diy" x={0} y={344} width={40} height={72} />
        <Hotspot label="完成预约" to="/workshop/success" x={350} y={344} width={40} height={72} />
      </>
    case '/workshop/success':
      return <>
        <Hotspot label="预约面料" to="/fabrics" x={121} y={669} width={144} height={40} />
        <Hotspot label="返回首页" to="/home" x={121} y={717} width={144} height={40} />
      </>
    case '/fabrics':
      return <>
        <Hotspot label="返回" to="/home" x={19} y={53} width={42} height={42} />
        <Hotspot label="市集购买" to="/shop/kits" x={195} y={108} width={174} height={53} />
        <Hotspot label="查看面料详情" to="/fabrics/detail" x={52} y={177} width={286} height={480} />
        <Hotspot label="确认带走" to="/workshop/success" x={19} y={757} width={334} height={69} />
      </>
    case '/fabrics/detail':
      return <>
        <Hotspot label="关闭面料详情" to="/fabrics" x={0} y={0} width={390} height={190} />
        <Hotspot label="关闭面料详情" to="/fabrics" x={0} y={665} width={390} height={179} />
        <Hotspot label="选定面料" to="/fabrics" x={60} y={586} width={269} height={55} />
      </>
    case '/shop':
      return <>
        <Hotspot label="搜索" to="/search" x={20} y={54} width={293} height={40} />
        <Hotspot label="购物车" to="/cart" x={328} y={53} width={44} height={42} />
        <Hotspot label="DIY材料包" to="/shop/kits" x={95} y={116} width={116} height={43} />
        <Hotspot label="品牌" to="/shop/brands" x={220} y={116} width={80} height={43} />
        <Hotspot label="穿搭" to="/shop/outfits" x={307} y={116} width={75} height={43} />
        <Hotspot label="DIY材料包" to="/shop/kits" x={20} y={190} width={82} height={100} />
        <Hotspot label="品牌商店" to="/shop/brands" x={111} y={190} width={82} height={100} />
        <Hotspot label="超级满减" to="/shop/sale" x={202} y={190} width={82} height={100} />
        <Hotspot label="宠粉清单" to="/shop/fan-list" x={293} y={190} width={82} height={100} />
        <Hotspot label="我的订单" to="/orders" x={20} y={313} width={82} height={101} />
        <Hotspot label="购物车" to="/cart" x={111} y={313} width={82} height={101} />
        <Hotspot label="我的足迹" to="/footprints" x={202} y={313} width={82} height={101} />
        <Hotspot label="打开童装改造辅助包" to="/product" x={20} y={442} width={164} height={266} />
        <Hotspot label="打开二手纯棉面料包" to="/product" x={204} y={442} width={164} height={266} />
      </>
    case '/shop/kits':
      return <>
        <Hotspot label="搜索" to="/search" x={20} y={54} width={293} height={40} />
        <Hotspot label="购物车" to="/cart" x={328} y={53} width={44} height={42} />
        <Hotspot label="推荐" to="/shop" x={20} y={116} width={68} height={43} />
        <Hotspot label="品牌" to="/shop/brands" x={220} y={116} width={80} height={43} />
        <Hotspot label="穿搭" to="/shop/outfits" x={307} y={116} width={75} height={43} />
        <Hotspot label="预约独一无二的面料" to="/fabrics" x={15} y={192} width={360} height={63} />
        <Hotspot label="打开童装改造辅助包" to="/product" x={19} y={274} width={165} height={266} />
        <Hotspot label="打开二手纯棉面料包" to="/product" x={203} y={274} width={165} height={266} />
      </>
    case '/product':
      return <>
        <Hotspot label="返回商店" to="/shop/kits" x={19} y={71} width={42} height={42} />
        <Hotspot label="加入购物车" to="/cart" x={20} y={757} width={168} height={56} />
        <Hotspot label="立即购买" to="/orders" x={198} y={757} width={167} height={56} />
      </>
    case '/messages':
      return <>
        <Hotspot label="返回" to="/home" x={20} y={53} width={42} height={42} />
        <Hotspot label="赞和收藏" to="/messages/likes" x={43} y={127} width={75} height={76} />
        <Hotspot label="新增关注" to="/messages/follows" x={157} y={127} width={75} height={76} />
        <Hotspot label="评论和@" to="/messages/comments" x={274} y={127} width={75} height={76} />
        <Hotspot label="系统通知" to="/messages/system" x={20} y={237} width={352} height={74} />
        <Hotspot label="活动消息" to="/messages/activity" x={20} y={322} width={352} height={74} />
      </>
    case '/profile':
      return <>
        <Hotspot label="设置" to="/settings" x={330} y={54} width={43} height={43} />
        <Hotspot label="编辑头像" to="/profile/edit" x={21} y={87} width={91} height={91} />
        <Hotspot label="编辑个人资料" to="/profile/edit" x={117} y={91} width={155} height={42} />
        <Hotspot label="查看环保等级" to="/profile/level" x={117} y={137} width={101} height={32} />
        <Hotspot label="查看环保积分" to="/profile/points" x={222} y={137} width={101} height={32} />
        <Hotspot label="我的日程" to="/schedule" x={19} y={201} width={352} height={75} />
        <Hotspot label="我的成就" to="/achievements" x={198} y={375} width={72} height={96} />
        <Hotspot label="我的订单" to="/orders" x={40} y={375} width={72} height={96} />
        <Hotspot label="我的宠物" to="/pets" x={119} y={375} width={72} height={96} />
        <Hotspot label="我的地址" to="/addresses" x={277} y={375} width={72} height={96} />
      </>
    case '/achievements':
      return <>
        <Hotspot label="返回" to="/profile" x={20} y={53} width={42} height={42} />
        <Hotspot label="展开成就操作" to="/achievements/action" x={0} y={411} width={390} height={433} />
        <Hotspot label="查看全部历史" to="/achievements/history" x={120} y={809} width={150} height={30} />
      </>
    case '/achievements/action':
      return <>
        <Hotspot label="返回" to="/achievements" x={20} y={53} width={42} height={42} />
        <Hotspot label="预约线下工坊DIY" to="/workshops" x={15} y={749} width={359} height={63} />
      </>
  }
}

const activityData = [
  {
    title: '旧衣新生·亲子宠物工坊',
    summary: '带上宝宝穿不下的连体衣，亲手改造成狗狗的防风背心！',
    date: '4月15日',
    place: '798艺术区',
    status: '报名中',
    image: A.homeEvent,
  },
  {
    title: '环保市集·二手面料交换',
    summary: '家里闲置的纯棉童装，来这里交换其他花色的面料吧。',
    date: '4月22日',
    place: '三里屯',
    status: '即将开始',
    image: A.homeMarket,
  },
  {
    title: '草地秀场·旧衣改造大赏',
    summary: '看看谁家的毛孩子穿得最潮最环保！',
    date: '5月01日',
    place: '朝阳公园',
    status: '预告',
    image: A.homeGrassShow,
  },
]

function ActivityCarousel() {
  const [active, setActive] = useState(0)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const ignoreClick = useRef(false)
  useEffect(() => {
    const timer = window.setInterval(() => setActive(value => (value + 1) % activityData.length), 3600)
    return () => window.clearInterval(timer)
  }, [active])
  return (
    <>
      <section
        className="home-activity-carousel"
        aria-label={`当季活动：${activityData[active].title}`}
        onPointerDown={event => { pointerStart.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId) }}
        onPointerUp={event => {
          const start = pointerStart.current
          pointerStart.current = null
          if (!start) return
          const dx = event.clientX - start.x
          const dy = event.clientY - start.y
          if (Math.abs(dx) < 38 || Math.abs(dx) < Math.abs(dy)) return
          ignoreClick.current = true
          setActive(value => (value + (dx < 0 ? 1 : -1) + activityData.length) % activityData.length)
        }}
        onClick={() => {
          if (ignoreClick.current) {
            ignoreClick.current = false
            return
          }
          go(`/activity/${active + 1}` as Route)
        }}
      >
        <div className="home-activity-track" style={{ transform: `translate3d(-${active * 100}%,0,0)` }}>
          {activityData.map(item => <article className="home-activity-slide" key={item.title}>
            <img src={item.image} alt={item.title} draggable={false} />
            <div className="carousel-shade" />
            <span>{item.status}</span>
            <strong>{item.title}</strong>
          </article>)}
        </div>
      </section>
      <nav className="activity-outer-dots" aria-label="切换当季活动">
        {activityData.map((item, index) => <button className={index === active ? 'active' : ''} onClick={() => setActive(index)} key={item.title} aria-label={`查看${item.title}`} />)}
      </nav>
    </>
  )
}

function ExtensionHeader({ title, back = '/home' }: { title: string; back?: Route }) {
  return (
    <header className="extension-header">
      <img src={A.paperHeader} alt="" />
      <button aria-label="返回" onClick={() => go(back)}><img src={A.back} alt="" /></button>
      <h1>{title}</h1>
    </header>
  )
}

function ActivitiesPage() {
  return (
    <main className="extension-screen activities-screen">
      <ExtensionHeader title="全部活动" />
      <div className="extension-scroll activities-scroll">
        <section className="activity-list" aria-label="全部活动列表">
          {activityData.map((item, index) => (
            <button className="activity-list-card" type="button" key={item.title} onClick={() => go(`/activity/${index + 1}` as Route)}>
              <figure>
                <img src={item.image} alt={item.title} />
                <span>{item.status}</span>
              </figure>
              <span className="activity-list-copy">
                <strong>{item.title}</strong>
                <small>{item.summary}</small>
                <em><i aria-hidden="true">◷</i>{item.date}<b aria-hidden="true">·</b>{item.place}</em>
              </span>
            </button>
          ))}
        </section>
        <p className="activity-list-tip">更多环保活动正在筹备中</p>
      </div>
    </main>
  )
}

function ActivityDetailPage({ index }: { index: number }) {
  const item = activityData[index]
  return (
    <main className="extension-screen activity-detail-screen">
      <ExtensionHeader title="活动详情" back="/activities" />
      <div className="extension-scroll activity-detail-scroll">
        <section className="activity-detail-card">
          <img className="activity-detail-hero" src={item.image} alt={item.title} />
          <span className="activity-status">{item.status}</span>
          <h1>{item.title}</h1>
          <p>{item.summary}</p>
          <dl>
            <div><dt>日期</dt><dd>{item.date}</dd></div>
            <div><dt>地点</dt><dd>{item.place}</dd></div>
            <div><dt>活动内容</dt><dd>旧衣回收、面料交换、宠物服饰改造与作品分享</dd></div>
          </dl>
        </section>
        <button className="extension-texture-button" onClick={() => go('/workshops')}>{index === 2 ? '查看活动安排' : '立即报名'}</button>
      </div>
    </main>
  )
}

function PublishMenu({ onSelectImages }: { onSelectImages: (value: string[]) => void }) {
  const choose = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).slice(0, 9)
    if (!files.length) return
    onSelectImages(files.map(file => URL.createObjectURL(file)))
    go('/publish/editor')
  }
  return (
    <main className="reference-stage publish-stage">
      <img className="publish-home" src="./reference/home.png" alt="" />
      <button className="publish-dismiss" aria-label="关闭发布菜单" onClick={() => go('/home')} />
      <section className="publish-sheet">
        <i />
        <label className="publish-option"><b>从相册选择</b><small>最多选择 9 张图片</small><input type="file" accept="image/*" multiple onChange={choose} /></label>
        <label className="publish-option publish-option-pale"><b>相机</b><small>拍摄一张新照片</small><input type="file" accept="image/*" capture="environment" onChange={choose} /></label>
        <button className="publish-option" onClick={() => { onSelectImages([]); go('/publish/editor') }}><b>写文字</b><small>直接记录改造灵感</small></button>
      </section>
    </main>
  )
}

function PublishEditor({ previews }: { previews: string[] }) {
  const [images, setImages] = useState(previews)
  const [coverIndex, setCoverIndex] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [toast, setToast] = useState('')
  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 1200)
  }
  const addImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    setImages(items => [...items, ...files.map(file => URL.createObjectURL(file))].slice(0, 9))
  }
  const removeImage = (index: number) => {
    setImages(items => items.filter((_, itemIndex) => itemIndex !== index))
    setCoverIndex(current => Math.max(0, current > index ? current - 1 : current === index ? 0 : current))
  }
  return (
    <main className="extension-screen publish-editor-screen">
      <ExtensionHeader title="发布笔记" back="/publish" />
      <div className="extension-scroll publish-editor-scroll">
        <section className="publish-media-block">
          <header><b>图片与封面</b><small>{images.length}/9</small></header>
          <div className="publish-media-strip">
            {images.map((src, index) => (
              <figure className={coverIndex === index ? 'cover' : ''} key={`${src}-${index}`}>
                <button className="publish-media-remove" aria-label="移除图片" onClick={() => removeImage(index)}>×</button>
                <button className="publish-media-preview" onClick={() => setCoverIndex(index)}><img src={src} alt={`待发布图片 ${index + 1}`} /><span>{coverIndex === index ? '封面' : index + 1}</span></button>
              </figure>
            ))}
            {images.length < 9 && <label className="publish-media-add"><b>＋</b><small>添加图片</small><input type="file" accept="image/*" multiple onChange={addImages} /></label>}
          </div>
          <p>{images.length ? '点击图片设为封面，可继续添加或删除图片' : '添加图片，或直接发布一篇文字笔记'}</p>
        </section>
        <section className="publish-copy-editor">
          <label className="publish-title-field"><input value={title} maxLength={20} onChange={event => setTitle(event.target.value)} placeholder="填写标题会有更多赞哦" /><em>{title.length}/20</em></label>
          <textarea value={body} maxLength={1000} onChange={event => setBody(event.target.value)} placeholder="分享旧衣改造心得、宠物穿搭或你的环保日常…" />
          <div className="publish-copy-tools"><button onClick={() => setBody(value => `${value}${value ? ' ' : ''}#旧衣新生`)}># 话题</button><button onClick={() => setBody(value => `${value}${value ? ' ' : ''}@`)}>@ 用户</button><button onClick={() => setBody(value => `${value} ♡`)}>♡ 表情</button></div>
        </section>
        <section className="publish-note-settings">
          <button onClick={() => showToast('已添加：旧衣改造')}><span>添加话题</span><em>#旧衣改造　〉</em></button>
          <button onClick={() => showToast('已选择当前位置')}><span>添加地点</span><em>杭州　〉</em></button>
          <button onClick={() => showToast('公开可见')}><span>谁可以看</span><em>公开　〉</em></button>
        </section>
      </div>
      <footer className="publish-editor-footer"><button onClick={() => showToast('已保存到草稿')}>存草稿</button><button onClick={() => { showToast('发布成功'); window.setTimeout(() => go('/home'), 900) }}>发布笔记</button></footer>
      {toast && <div className="publish-toast">{toast}</div>}
    </main>
  )
}

type CommunityPostId = 'baby' | 'recycle' | 'tie' | 'knit'

const communityPostData: Record<CommunityPostId, {
  author: string
  subtitle: string
  image: string
  title: string
  body: string
  tags: string[]
  likes: number
  saves: number
  comments: number
}> = {
  baby: {
    author: 'Momo妈', subtitle: '今天 14:28 · 北京', image: A.profilePost1,
    title: '宝宝的连体衣变成狗子战袍！',
    body: '把闲置的小衣服重新拆解、裁剪，再根据 Momo 的胸围调整尺寸。原来的纽扣和花边都保留下来了，每一处都装着熟悉的回忆。第一次做虽然针脚不完美，但穿上的那一刻真的太值得！',
    tags: ['旧衣改造', '宠物穿搭', '手作日常'], likes: 238, saves: 56, comments: 18,
  },
  recycle: {
    author: '官方回收君', subtitle: '昨天 18:05 · 杭州', image: A.homeCommunity2,
    title: '8月回收成果：500件童装的新生',
    body: '这个月收到的旧童装已经完成清洁、分拣和面料归档。适合继续穿着的衣物会进入公益流转，柔软的纯棉面料则会成为宠物服饰和亲子工坊的材料。谢谢每一位参与循环的朋友。',
    tags: ['环保回收', '循环生活', '旧衣新生'], likes: 516, saves: 92, comments: 34,
  },
  tie: {
    author: '手作小能手', subtitle: '3天前 · 上海', image: A.profilePost2,
    title: '闲置衬衫领子秒变绅士领结',
    body: '衬衫领口拆下来以后刚好能做一只轻巧的宠物领结。内侧加一层柔软棉布，不磨毛也不会勒脖子，最后用原衬衫的纽扣固定。',
    tags: ['衬衫改造', '宠物领结', 'DIY教程'], likes: 179, saves: 73, comments: 12,
  },
  knit: {
    author: '大黄的主人', subtitle: '5天前 · 成都', image: A.homeCommunity1,
    title: '旧针织衫改成了毛孩子的小背心',
    body: '选了弹性比较好的旧针织衫，按照背长重新画纸样，袖口的位置做成前腿开口。剩下的边角料还缝了一只同色小口袋。',
    tags: ['针织改造', '宠物背心', '低碳生活'], likes: 322, saves: 105, comments: 26,
  },
}

function currentCommunityPostId(): CommunityPostId {
  const params = new URLSearchParams(location.hash.split('?')[1] || '')
  const value = params.get('id') as CommunityPostId | null
  return value && value in communityPostData ? value : 'baby'
}

function PostActionIcon({ type, filled = false }: { type: 'heart' | 'bookmark' | 'comment'; filled?: boolean }) {
  if (type === 'heart') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" fill={filled ? 'currentColor' : 'none'} /></svg>
  if (type === 'bookmark') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h12v17l-6-4-6 4v-17Z" fill={filled ? 'currentColor' : 'none'} /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.5a4 4 0 0 1-4 4H8l-4.5 2.5V7.5a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v7Z" fill="none" /></svg>
}

function CommunityPostPage() {
  const post = communityPostData[currentCommunityPostId()]
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [following, setFollowing] = useState(false)
  const [draft, setDraft] = useState('')
  const [newComments, setNewComments] = useState<string[]>([])
  const submitComment = () => {
    const value = draft.trim()
    if (!value) return
    setNewComments(items => [...items, value])
    setDraft('')
  }
  return (
    <main className="reference-stage community-post-screen">
      <header className="community-post-header">
        <button className="community-post-back" aria-label="返回" onClick={() => history.length > 1 ? history.back() : go('/home')}><img src={A.back} alt="" /></button>
        <i className="community-post-avatar">{post.author.slice(0, 1)}</i>
        <span><b>{post.author}</b><small>{post.subtitle}</small></span>
        <button className={`community-follow ${following ? 'following' : ''}`} onClick={() => setFollowing(value => !value)}>{following ? '已关注' : '关注'}</button>
        <button className="community-post-more" aria-label="更多操作">•••</button>
      </header>
      <div className="community-post-scroll">
        <figure className="community-post-hero"><img src={post.image} alt={post.title} /><figcaption><i /><i className="active" /><i /></figcaption></figure>
        <article className="community-post-copy">
          <h1>{post.title}</h1>
          <p>{post.body}</p>
          <div>{post.tags.map(tag => <button key={tag}>#{tag}</button>)}</div>
          <time>编辑于 8月28日</time>
        </article>
        <section className="community-comments">
          <h2>共 {post.comments + newComments.length} 条评论</h2>
          <article><i>棉</i><div><b>棉花糖的日常</b><p>这个配色也太温柔了，原来的小衣服被好好保存下来了。</p><small>昨天 21:16　 回复</small></div><button aria-label="点赞评论"><PostActionIcon type="heart" /><small>12</small></button></article>
          <article><i className="yellow">手</i><div><b>手作小能手</b><p>领口和前腿的位置处理得很舒服，新手也很有参考价值！</p><small>今天 09:30　 回复</small></div><button aria-label="点赞评论"><PostActionIcon type="heart" /><small>8</small></button></article>
          {newComments.map((comment, index) => <article key={`${comment}-${index}`}><i className="mint">我</i><div><b>Sarah</b><p>{comment}</p><small>刚刚　 回复</small></div><button aria-label="点赞评论"><PostActionIcon type="heart" /></button></article>)}
        </section>
      </div>
      <form className="community-post-actions" onSubmit={event => { event.preventDefault(); submitComment() }}>
        <label><PostActionIcon type="comment" /><input value={draft} onChange={event => setDraft(event.target.value)} placeholder="说点什么…" /></label>
        <button type="button" className={liked ? 'selected like' : ''} onClick={() => setLiked(value => !value)} aria-label="点赞"><PostActionIcon type="heart" filled={liked} /><small>{post.likes + (liked ? 1 : 0)}</small></button>
        <button type="button" className={saved ? 'selected save' : ''} onClick={() => setSaved(value => !value)} aria-label="收藏"><PostActionIcon type="bookmark" filled={saved} /><small>{post.saves + (saved ? 1 : 0)}</small></button>
        {draft.trim() && <button type="submit" className="community-comment-send" aria-label="发送评论">发送</button>}
      </form>
    </main>
  )
}

const utilityTitles: Partial<Record<Route, string>> = {
  '/search': '搜索',
  '/cart': '购物车',
  '/orders': '我的订单',
  '/pets': '我的宠物',
  '/addresses': '我的地址',
  '/collections': '收藏',
  '/settings': '设置',
  '/community/post': '社区笔记',
  '/message/detail': '消息详情',
  '/shop/brands': '品牌',
  '/shop/outfits': '宠物穿搭',
}

const settingsLinks: Array<{ label: string; hint: string; route: Route }> = [
  { label: '账号与安全', hint: '邮箱、手机号与密码', route: '/settings/account' },
  { label: '消息通知', hint: '活动、订单与社区提醒', route: '/settings/notifications' },
  { label: '隐私设置', hint: '主页可见范围与互动权限', route: '/settings/privacy' },
  { label: '字体与显示', hint: '字号、动效与界面显示', route: '/settings/display' },
  { label: '关于 PAWTERN', hint: '版本、协议与品牌故事', route: '/settings/about' },
]

function UtilityPage({ route }: { route: Route }) {
  if (route === '/community/post') return <CommunityPostPage />
  const title = utilityTitles[route] || '详情'
  const shopRoute = route === '/shop/brands' || route === '/shop/outfits'
  const backRoute: Route = shopRoute || route === '/cart' || route === '/orders' ? '/shop'
    : route === '/search' ? '/home'
    : route === '/message/detail' ? '/messages'
    : '/profile'
  return (
    <main className="extension-screen utility-screen">
      <ExtensionHeader title={title} back={backRoute} />
      <div className="extension-scroll utility-scroll">
        {route === '/search' && <>
          <form className="utility-search" onSubmit={event => event.preventDefault()}>
            <input autoFocus placeholder="搜索活动、材料包、社区笔记" aria-label="搜索活动、材料包、社区笔记" />
            <button type="submit" aria-label="搜索"><span aria-hidden="true" /></button>
          </form>
          <h2>热门搜索</h2><div className="utility-chips"><button>旧衣改造</button><button>宠物背心</button><button>亲子工坊</button></div>
        </>}
        {(route === '/cart' || shopRoute) && <div className="utility-product-list">
          {products.map((product, index) => <button key={product.name} onClick={() => openProduct(product.id, route)}><img src={product.img} alt="" /><span><b>{shopRoute && index > 1 ? ['ZEZE宠物项圈','法式田园连衣裙'][index - 2] : product.name}</b><small>{product.tag}</small><em>{product.price}</em></span></button>)}
        </div>}
        {route === '/pets' && <section className="pet-profile-card"><i /><h2>Momo</h2><p>柯基 · 2岁 · 12.5kg</p><dl><div><dt>胸围</dt><dd>52cm</dd></div><div><dt>背长</dt><dd>38cm</dd></div><div><dt>颈围</dt><dd>34cm</dd></div></dl><button className="extension-texture-button" onClick={() => go('/pets/edit')}>编辑宠物信息</button></section>}
        {route === '/addresses' && <section className="utility-stack"><article><b>Sarah　138****6809</b><p>北京市朝阳区酒仙桥路798艺术区</p><span>默认地址</span></article><article><b>Sarah　138****6809</b><p>杭州市西湖区黄龙国际中心</p></article><button className="extension-texture-button" onClick={() => go('/addresses/new')}>新增地址</button></section>}
        {route === '/collections' && <div className="continuation-posts utility-posts"><button onClick={() => go('/community/post')}><img src={A.profilePost1} alt="" /><b>宝宝的连体衣变成狗子战袍</b></button><button onClick={() => go('/community/post')}><img src={A.profilePost2} alt="" /><b>闲置领带变成宠物领结</b></button><button onClick={() => go('/community/post')}><img src={A.homeCommunity1} alt="" /><b>社区旧衣改造成果</b></button></div>}
        {route === '/settings' && <section className="utility-stack settings-stack">{settingsLinks.map(item => <button key={item.route} onClick={() => go(item.route)}><span><b>{item.label}</b><small>{item.hint}</small></span><em>〉</em></button>)}<button className="settings-logout" onClick={() => go('/login')}><span><b>退出登录</b><small>退出当前账号并返回登录页</small></span><em>〉</em></button></section>}
        {route === '/message/detail' && <section className="message-thread"><p>亲，材料包里有教程吗？我是新手不太会。</p><p className="mine">有的，扫描包装内的教程码就可以观看完整步骤。</p><p>太好了，谢谢！</p><label><input placeholder="输入消息" /><button>发送</button></label></section>}
        {route === '/search' && <div className="continuation-posts search-results"><button onClick={() => go('/community/post')}><img src={A.homeCommunity1} alt="" /><b>旧衣改造灵感</b></button><button onClick={() => go('/activity/1')}><img src={A.homeEvent} alt="" /><b>亲子宠物工坊</b></button></div>}
      </div>
    </main>
  )
}

type StoredProfile = { name: string; bio: string; city: string; avatar: string }

const defaultProfile: StoredProfile = { name: 'Sarah', bio: '和 Momo 一起，让每件旧衣重新被喜欢。', city: '北京', avatar: '' }

function readStoredProfile(): StoredProfile {
  try {
    const stored = localStorage.getItem('pawtern-profile')
    return stored ? { ...defaultProfile, ...JSON.parse(stored) } : defaultProfile
  } catch {
    return defaultProfile
  }
}

function ProfileDashboard() {
  const profile = readStoredProfile()
  const services: Array<{ label: string; route: Route; icon: string }> = [
    { label: '我的订单', route: '/orders', icon: 'orders' },
    { label: '我的宠物', route: '/pets', icon: 'pets' },
    { label: '我的成就', route: '/achievements', icon: 'achievements' },
    { label: '我的地址', route: '/addresses', icon: 'addresses' },
  ]

  return (
    <section className="profile-dashboard-native" aria-label="我的资料与服务">
      <button className="profile-settings-button" type="button" aria-label="设置" onClick={() => go('/settings')}>
        <i className="profile-sprite profile-settings-art" aria-hidden="true" />
      </button>

      <div className="profile-identity-native">
        <button className="profile-avatar-button" type="button" aria-label="编辑头像" onClick={() => go('/profile/edit')}>
          <i style={profile.avatar ? { backgroundImage: `url(${profile.avatar})` } : undefined} />
        </button>
        <div className="profile-identity-copy">
          <button className="profile-user-name" type="button" onClick={() => go('/profile/edit')}>{profile.name}</button>
          <small>ID: 680979018　▦</small>
          <div className="profile-badges">
            <button type="button" onClick={() => go('/profile/level')}>LV.3&nbsp; 环保达人</button>
            <button type="button" onClick={() => go('/profile/points')}>积分: 1205</button>
          </div>
        </div>
      </div>

      <button className="profile-schedule-card" type="button" onClick={() => go('/schedule')}>
        <i className="profile-sprite profile-calendar-art" aria-hidden="true" />
        <span><b>我的日程</b><small>查看工坊预约与活动</small></span>
        <strong>7个待参加</strong><em aria-hidden="true">›</em>
      </button>

      <section className="profile-services-card" aria-labelledby="profile-services-title">
        <header>
          <i className="profile-sprite profile-star-art" aria-hidden="true" />
          <h2 id="profile-services-title">我的服务</h2>
        </header>
        <nav aria-label="我的服务入口">
          {services.map(service => (
            <button key={service.label} type="button" onClick={() => go(service.route)}>
              <i className={`profile-sprite profile-service-art profile-service-${service.icon}`} aria-hidden="true" />
              <span>{service.label}</span>
            </button>
          ))}
        </nav>
      </section>
    </section>
  )
}

function ProfileEditPage() {
  const initial = readStoredProfile()
  const [name, setName] = useState(initial.name)
  const [bio, setBio] = useState(initial.bio)
  const [city, setCity] = useState(initial.city)
  const [avatar, setAvatar] = useState(initial.avatar)
  const [saved, setSaved] = useState(false)
  const chooseAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(String(reader.result || ''))
    reader.readAsDataURL(file)
  }
  const save = () => {
    localStorage.setItem('pawtern-profile', JSON.stringify({ name: name.trim() || 'Sarah', bio, city, avatar }))
    setSaved(true)
    window.setTimeout(() => go('/profile'), 700)
  }
  return <main className="extension-screen profile-edit-screen">
    <ExtensionHeader title="编辑个人资料" back="/profile" />
    <div className="extension-scroll settings-detail-scroll">
      <section className="profile-edit-card">
        <label className="profile-avatar-editor"><i style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}>{avatar ? '' : 'S'}</i><span>更换头像<small>支持从相册选择图片</small></span><em>〉</em><input type="file" accept="image/*" onChange={chooseAvatar} /></label>
        <label className="settings-field"><span>昵称</span><input value={name} onChange={event => setName(event.target.value)} maxLength={16} /></label>
        <label className="settings-field"><span>个人简介</span><textarea value={bio} onChange={event => setBio(event.target.value)} maxLength={48} /></label>
        <label className="settings-field"><span>所在城市</span><input value={city} onChange={event => setCity(event.target.value)} maxLength={12} /></label>
        <label className="settings-field readonly"><span>PAWTERN ID</span><input value="680979018" readOnly /></label>
      </section>
      <button className="extension-texture-button" onClick={save}>保存个人资料</button>
    </div>
    {saved && <div className="publish-toast">资料已保存</div>}
  </main>
}

function ProfileLevelPage() {
  const levels = [
    { level: 'LV.1', name: '循环新手', target: '完成首次旧衣回收', done: true },
    { level: 'LV.2', name: '改造学徒', target: '制作第一件宠物新衣', done: true },
    { level: 'LV.3', name: '环保达人', target: '累计循环 20 件旧衣', done: true },
    { level: 'LV.4', name: '社区匠人', target: '完成 8 件改造作品', done: false },
  ]
  return <main className="extension-screen profile-level-screen"><ExtensionHeader title="环保等级" back="/profile" /><div className="extension-scroll settings-detail-scroll">
    <section className="level-hero"><small>当前等级</small><h1>LV.3 环保达人</h1><p>还需制作 4 件宠物新衣升级</p><div><i /><span>4 / 8</span></div></section>
    <section className="level-list">{levels.map(item => <article className={item.done ? 'done' : ''} key={item.level}><b>{item.level}</b><span><strong>{item.name}</strong><small>{item.target}</small></span><em>{item.done ? '✓' : '4/8'}</em></article>)}</section>
    <button className="extension-texture-button" onClick={() => go('/achievements')}>查看我的环保成就</button>
  </div></main>
}

function ProfilePointsPage() {
  const [points, setPoints] = useState(1205)
  const [toast, setToast] = useState('')
  const redeem = (cost: number, name: string) => {
    if (points < cost) return
    setPoints(value => value - cost)
    setToast(`已兑换${name}`)
    window.setTimeout(() => setToast(''), 1300)
  }
  const rewards = [{ name: '材料包 ¥5 优惠券', cost: 300 }, { name: '工坊预约优先券', cost: 500 }, { name: '限定木质纽扣组', cost: 800 }]
  return <main className="extension-screen profile-points-screen"><ExtensionHeader title="环保积分" back="/profile" /><div className="extension-scroll settings-detail-scroll">
    <section className="points-balance"><small>当前可用积分</small><h1>{points}</h1><p>回收旧衣、参加工坊和分享笔记都能获得积分</p></section>
    <section className="points-record"><header><h2>最近明细</h2><button onClick={() => go('/achievements/history')}>全部记录 〉</button></header>{[['完成旧衣上门回收','+80','今天'],['发布改造笔记','+40','8月29日'],['兑换满减优惠券','-300','8月18日']].map(item => <article key={item[0]}><span><b>{item[0]}</b><small>{item[2]}</small></span><em className={item[1].startsWith('+') ? 'plus' : ''}>{item[1]}</em></article>)}</section>
    <section className="reward-list"><h2>积分兑换</h2>{rewards.map(reward => <article key={reward.name}><span><b>{reward.name}</b><small>{reward.cost} 积分</small></span><button disabled={points < reward.cost} onClick={() => redeem(reward.cost, reward.name)}>兑换</button></article>)}</section>
  </div>{toast && <div className="toast">{toast}</div>}</main>
}

function SettingsToggle({ label, hint, initial = true }: { label: string; hint: string; initial?: boolean }) {
  const [enabled, setEnabled] = useState(initial)
  return <button className="settings-toggle-row" role="switch" aria-checked={enabled} onClick={() => setEnabled(value => !value)}><span><b>{label}</b><small>{hint}</small></span><i className={enabled ? 'on' : ''}><em /></i></button>
}

type SettingsKind = 'account' | 'notifications' | 'privacy' | 'display' | 'about'

function SettingsDetailPage({ kind }: { kind: SettingsKind }) {
  const titles: Record<SettingsKind, string> = { account: '账号与安全', notifications: '消息通知', privacy: '隐私设置', display: '字体与显示', about: '关于 PAWTERN' }
  const [toast, setToast] = useState('')
  const [fontSize, setFontSize] = useState<'小' | '标准' | '大'>('标准')
  const [documentName, setDocumentName] = useState('')
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 1300) }
  return <main className="extension-screen settings-detail-screen"><ExtensionHeader title={titles[kind]} back="/settings" /><div className="extension-scroll settings-detail-scroll">
    {kind === 'account' && <><section className="settings-detail-card account-card"><button onClick={() => notify('邮箱验证信息已发送')}><span><b>邮箱地址</b><small>7181687448@qq.com</small></span><em>已验证 〉</em></button><button onClick={() => notify('进入手机号更换流程')}><span><b>手机号码</b><small>138****6809</small></span><em>更换 〉</em></button><button onClick={() => notify('已发送密码重置验证码')}><span><b>登录密码</b><small>建议定期修改密码</small></span><em>修改 〉</em></button><button onClick={() => notify('当前仅登录 1 台设备')}><span><b>登录设备</b><small>管理已登录的手机与浏览器</small></span><em>1 台 〉</em></button></section><button className="danger-paper-button" onClick={() => go('/login')}>退出当前账号</button></>}
    {kind === 'notifications' && <section className="settings-detail-card"><h2>通知类型</h2><SettingsToggle label="活动提醒" hint="报名、开场与材料准备提醒" /><SettingsToggle label="订单与物流" hint="付款、制作和配送状态" /><SettingsToggle label="社区互动" hint="赞、收藏、评论与新增关注" /><SettingsToggle label="私信消息" hint="收到新私信时提醒" /><SettingsToggle label="环保周报" hint="每周日发送本周循环成果" initial={false} /></section>}
    {kind === 'privacy' && <><section className="settings-detail-card"><h2>主页与互动</h2><SettingsToggle label="公开我的改造笔记" hint="其他社区用户可以浏览" /><SettingsToggle label="展示环保成就" hint="在个人主页展示等级与足迹" /><SettingsToggle label="允许陌生人私信" hint="关闭后仅关注的人可私信" initial={false} /><SettingsToggle label="个性化推荐" hint="根据浏览记录推荐内容" /></section><section className="privacy-note"><b>你的旧衣回收地址不会公开</b><p>地址和联系方式仅用于预约、配送与售后服务。</p></section></>}
    {kind === 'display' && <><section className="settings-detail-card display-card"><h2>文字大小</h2><div className="font-size-options">{(['小','标准','大'] as const).map(size => <button className={fontSize === size ? 'active' : ''} key={size} onClick={() => setFontSize(size)}>{size}</button>)}</div><p className={`font-preview font-${fontSize}`}>让旧衣在陪伴中获得新的生命。</p></section><section className="settings-detail-card"><SettingsToggle label="页面切换动效" hint="保留轻柔的左右滑动与淡入效果" /><SettingsToggle label="减少透明效果" hint="提高纸纹卡片文字清晰度" initial={false} /><button className="settings-action-row" onClick={() => notify('显示设置已恢复默认')}><span><b>恢复默认显示</b><small>标准字号与完整动效</small></span><em>〉</em></button></section></>}
    {kind === 'about' && <><section className="about-pawtern"><i>♥</i><h1>PAWTERN</h1><p>把孩子穿过的旧衣，变成继续陪伴家庭的宠物服饰。</p><small>版本 1.0.0</small></section><section className="settings-detail-card about-links">{['用户服务协议','隐私政策','开源许可','品牌故事'].map(item => <button key={item} onClick={() => setDocumentName(item)}><b>{item}</b><em>〉</em></button>)}</section>{documentName && <section className="about-document"><header><b>{documentName}</b><button onClick={() => setDocumentName('')}>×</button></header><p>{documentName === '品牌故事' ? 'PAWTERN 从一件穿不下的宝宝连体衣开始，希望保留旧衣上的记忆，也让宠物获得舒适、独特的新衣。' : '我们以清晰、必要和安全为原则处理账号、订单与回收服务信息，并持续保护每一位用户的权益。'}</p></section>}</>}
  </div>{toast && <div className="toast">{toast}</div>}</main>
}

function PetEditPage() {
  const [saved, setSaved] = useState(false)
  return <main className="extension-screen pet-edit-screen"><ExtensionHeader title="编辑宠物信息" back="/pets" /><div className="extension-scroll settings-detail-scroll"><section className="profile-edit-card pet-edit-card"><i className="pet-edit-avatar" /><label className="settings-field"><span>宠物昵称</span><input defaultValue="Momo" /></label><label className="settings-field"><span>品种</span><input defaultValue="柯基" /></label><div className="pet-measures"><label><span>胸围</span><input defaultValue="52" /><em>cm</em></label><label><span>背长</span><input defaultValue="38" /><em>cm</em></label><label><span>颈围</span><input defaultValue="34" /><em>cm</em></label></div></section><button className="extension-texture-button" onClick={() => { setSaved(true); window.setTimeout(() => go('/pets'), 650) }}>保存宠物信息</button></div>{saved && <div className="publish-toast">宠物信息已保存</div>}</main>
}

function AddressNewPage() {
  const [saved, setSaved] = useState(false)
  return <main className="extension-screen address-edit-screen"><ExtensionHeader title="新增地址" back="/addresses" /><div className="extension-scroll settings-detail-scroll"><section className="profile-edit-card"><label className="settings-field"><span>收件人</span><input placeholder="请输入姓名" /></label><label className="settings-field"><span>手机号码</span><input inputMode="tel" placeholder="请输入手机号码" /></label><label className="settings-field"><span>所在地区</span><input placeholder="省 / 市 / 区" /></label><label className="settings-field"><span>详细地址</span><textarea placeholder="街道、门牌号等" /></label><SettingsToggle label="设为默认地址" hint="优先用于材料包配送" initial={false} /></section><button className="extension-texture-button" onClick={() => { setSaved(true); window.setTimeout(() => go('/addresses'), 650) }}>保存地址</button></div>{saved && <div className="publish-toast">地址已保存</div>}</main>
}

function FeatureProductGrid({ items, back = '/shop' }: { items: Product[]; back?: Route }) {
  return (
    <div className="feature-product-grid">
      {items.map(item => (
        <button key={item.name} onClick={() => openProduct(item.id, back)}>
          <img src={item.img} alt="" />
          <span>{item.tag}</span>
          <b>{item.name}</b>
          <em>{item.price}</em>
        </button>
      ))}
    </div>
  )
}

function SalePage() {
  return (
    <main className="extension-screen market-feature-screen">
      <ExtensionHeader title="超级满减" back="/shop" />
      <div className="extension-scroll market-feature-scroll">
        <section className="sale-hero">
          <span>旧衣新生优惠季</span>
          <h1>跨店每满 99 减 20</h1>
          <p>材料包、环保面料与宠物穿搭均可参与</p>
        </section>
        <div className="coupon-row">
          <button><b>¥10</b><span>满59可用</span><em>领取</em></button>
          <button><b>¥20</b><span>满99可用</span><em>领取</em></button>
        </div>
        <h2 className="feature-section-title">满减好物</h2>
        <FeatureProductGrid items={saleProducts} back="/shop/sale" />
      </div>
    </main>
  )
}

function FanListPage() {
  return (
    <main className="extension-screen market-feature-screen">
      <ExtensionHeader title="宠粉清单" back="/shop" />
      <div className="extension-scroll market-feature-scroll">
        <section className="fan-list-intro">
          <small>PAWTERN 编辑部</small>
          <h1>毛孩子本周心愿清单</h1>
          <p>从舒适、实穿与旧衣再利用三个维度，选出适合日常陪伴的环保好物。</p>
          <div><span>01 轻暖针织</span><span>02 户外防护</span><span>03 DIY入门</span></div>
        </section>
        <h2 className="feature-section-title">清单精选</h2>
        <FeatureProductGrid items={fanProducts} back="/shop/fan-list" />
      </div>
    </main>
  )
}

type OrderFilter = 'all' | 'pending' | 'shipping' | 'done'

const orderCards: Array<{ id: string; filter: Exclude<OrderFilter, 'all'>; status: string; date: string; productId: string; image: string; name: string; meta: string; price: string }> = [
  { id: 'PAW20260831018', filter: 'pending', status: '待付款', date: '2026-08-31', productId: 'wood-buttons', image: A.productButtons, name: '天然木质纽扣', meta: '辅料 · 2组', price: '¥19.8' },
  { id: 'PAW20260831001', filter: 'shipping', status: '待收货', date: '2026-08-30', productId: 'kidswear-kit', image: A.productKit, name: '童装改造辅助包', meta: '材料包 · 1件', price: '¥29' },
  { id: 'PAW20260818016', filter: 'done', status: '已完成', date: '2026-08-18', productId: 'cream-knit-look', image: A.marketOutfit1, name: '奶油色针织日常造型', meta: '宠物穿搭 · 1件', price: '¥79' },
  { id: 'PAW20260729008', filter: 'done', status: '已完成', date: '2026-07-29', productId: 'cotton-fabric-pack', image: A.productFabric, name: '二手纯棉面料包', meta: '面料 · 2件', price: '¥38' },
]

function OrdersPage() {
  const [active, setActive] = useState<OrderFilter>('all')
  const tabs: Array<{ id: OrderFilter; label: string }> = [
    { id: 'all', label: '全部' }, { id: 'pending', label: '待付款' }, { id: 'shipping', label: '待收货' }, { id: 'done', label: '已完成' },
  ]
  const savedFabricOrders = readStoredFabricOrders()
  const allOrderCards = [...savedFabricOrders, ...orderCards]
  const visibleOrders = active === 'all' ? allOrderCards : allOrderCards.filter(order => order.filter === active)
  return (
    <main className="extension-screen orders-screen">
      <ExtensionHeader title="我的订单" back="/shop" />
      <div className="extension-scroll orders-scroll">
        <nav className="order-status-tabs" aria-label="订单状态">{tabs.map(tab => <button key={tab.id} className={active === tab.id ? 'active' : ''} onClick={() => setActive(tab.id)}>{tab.label}</button>)}</nav>
        <section className="order-card-list" key={active}>
          {visibleOrders.map(order => (
            <article key={order.id}>
              <header><span>订单号 {order.id}</span><b>{order.status}</b></header>
              <button className="order-product" onClick={() => openProduct(order.productId, '/orders')}><img src={order.image} alt="" /><span><b>{order.name}</b><small>{order.meta}</small><em>{order.price}</em></span></button>
              <footer><small>{order.date}</small><div>{order.filter === 'shipping' && <button>查看物流</button>}<button className="primary">{order.filter === 'pending' ? '去付款' : order.filter === 'shipping' ? '确认收货' : '再次购买'}</button></div></footer>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}

function FootprintsPage() {
  const today = [products[0], brandProducts[1]]
  const earlier = [outfitProducts[3], products[1], products[3]]
  return (
    <main className="extension-screen footprints-screen">
      <ExtensionHeader title="我的足迹" back="/shop" />
      <div className="extension-scroll footprints-scroll">
        <section><header><h2>今天</h2><span>浏览了 {today.length} 件好物</span></header><FeatureProductGrid items={today} back="/footprints" /></section>
        <section><header><h2>更早</h2><span>最近 30 天</span></header><FeatureProductGrid items={earlier} back="/footprints" /></section>
      </div>
    </main>
  )
}

type AchievementPeriod = 'week' | 'month'

const achievementRecords: Record<AchievementPeriod, Array<{ date: string; title: string; detail: string; tone: string }>> = {
  week: [
    { date: '08-29', title: '线下工坊 · 旧衣DIY', detail: '+1 件新衣 / 循环面料 0.4㎡', tone: 'mint' },
    { date: '08-27', title: '童装回收投递', detail: '+4 件旧衣 / 环保积分 +80', tone: 'yellow' },
  ],
  month: [
    { date: '08-29', title: '线下工坊 · 旧衣DIY', detail: '+1 件新衣 / 循环面料 0.4㎡', tone: 'mint' },
    { date: '08-18', title: '完成宠物针织背心', detail: '+1 件新衣 / 环保积分 +120', tone: 'coral' },
    { date: '08-09', title: '旧衣上门回收', detail: '+8 件旧衣 / 减少碳排 2.3kg', tone: 'yellow' },
    { date: '08-02', title: '社区改造笔记获赞', detail: '+36 次互动 / 环保积分 +40', tone: 'mint' },
  ],
}

function AchievementsExperience() {
  const [period, setPeriod] = useState<AchievementPeriod>('week')
  const records = achievementRecords[period]
  return (
    <main className="extension-screen achievements-experience">
      <ExtensionHeader title="我的成就" back="/profile" />
      <div className="extension-scroll achievements-scroll">
        <section className="achievement-hero">
          <div><p>你参与回收了<br />多少旧衣？</p><img src={A.achievementA} alt="旧衣回收篮" /><span>婴童闲置旧衣<b>20 件</b></span></div>
          <div><p>你DIY了多少<br />宠物服饰？</p><img src={A.achievementB} alt="宠物新衣篮" /><span>已制作宠物新衣<b>4 件</b></span></div>
        </section>
        <section className="achievement-rise-sheet">
          <i className="sheet-handle" />
          <article className="wide-stat"><span>已制作宠物新衣<strong>4<small> 件</small></strong></span><b>✂</b></article>
          <div className="stat-grid"><article>循环使用旧衣<strong>20<small> 件</small></strong></article><article>转化面料<strong>2.8<small> ㎡</small></strong></article></div>
          <div className="achievement-history-heading"><b>成长足迹</b><nav><button className={period === 'week' ? 'active' : ''} onClick={() => setPeriod('week')}>本周</button><button className={period === 'month' ? 'active' : ''} onClick={() => setPeriod('month')}>本月</button></nav></div>
          <div className="achievement-record-list" key={period}>{records.map(record => <article className={record.tone} key={`${period}-${record.date}-${record.title}`}><time>{record.date}</time><span><b>{record.title}</b><small>{record.detail}</small></span></article>)}</div>
          <button className="achievement-history-link" onClick={() => go('/achievements/history')}>查看全部历史 〉</button>
          <button className="extension-texture-button achievement-workshop-button" onClick={() => go('/workshops')}>预约线下工坊 DIY</button>
        </section>
      </div>
    </main>
  )
}

const achievementHistory = [
  { month: '2026年8月', total: '循环 12 件旧衣', items: achievementRecords.month },
  { month: '2026年7月', total: '完成 2 次改造', items: [
    { date: '07-21', title: '旧衬衫改造领结', detail: '+1 件新衣 / 环保积分 +100', tone: 'coral' },
    { date: '07-12', title: '环保市集面料交换', detail: '循环面料 0.8㎡ / 环保积分 +60', tone: 'yellow' },
    { date: '07-03', title: '童装回收投递', detail: '+5 件旧衣 / 减少碳排 1.4kg', tone: 'mint' },
  ] },
  { month: '2026年6月', total: '完成 1 次改造', items: [
    { date: '06-18', title: '亲子宠物工坊', detail: '+1 件新衣 / 循环面料 0.5㎡', tone: 'mint' },
    { date: '06-04', title: '旧衣上门回收', detail: '+3 件旧衣 / 环保积分 +60', tone: 'yellow' },
  ] },
]

function AchievementHistoryPage() {
  return (
    <main className="extension-screen achievement-history-screen">
      <ExtensionHeader title="成就历史" back="/achievements" />
      <div className="extension-scroll achievement-history-scroll">
        <section className="history-summary"><small>从第一次旧衣新生开始</small><b>已坚持环保改造 86 天</b><span>累计环保积分 1,205</span></section>
        {achievementHistory.map(group => <section className="history-month" key={group.month}><header><h2>{group.month}</h2><span>{group.total}</span></header>{group.items.map(item => <article className={item.tone} key={`${group.month}-${item.date}`}><time>{item.date}</time><span><b>{item.title}</b><small>{item.detail}</small></span></article>)}</section>)}
      </div>
    </main>
  )
}

const scheduleEvents: Record<number, Array<{ time: string; title: string; place: string; tone: string }>> = {
  3: [{ time: '10:00–12:00', title: '旧衣新生 · 亲子宠物工坊', place: '798艺术区 PAWTERN 工坊', tone: 'mint' }],
  12: [{ time: '14:30–16:00', title: '宠物量体与纸样小课', place: '三里屯社区空间', tone: 'yellow' }],
  20: [{ time: '10:30–12:30', title: '二手面料交换日', place: '朝阳环保市集', tone: 'coral' }],
  27: [{ time: '15:00–17:00', title: '草地宠物穿搭分享会', place: '朝阳公园草坪区', tone: 'mint' }],
}

function SchedulePage() {
  const [stored] = useState<StoredScheduleItem[]>(readStoredSchedule)
  const latestStoredDate = [...stored].reverse().find(item => /^\d{4}-\d{2}-\d{2}$/.test(item.date))?.date
  const [monthOffset, setMonthOffset] = useState(() => {
    if (!latestStoredDate) return 0
    const [storedYear, storedMonth] = latestStoredDate.split('-').map(Number)
    return (storedYear - 2026) * 12 + storedMonth - 9
  })
  const [selectedDay, setSelectedDay] = useState(() => {
    return latestStoredDate ? Number(latestStoredDate.slice(-2)) : 3
  })
  const shown = new Date(2026, 8 + monthOffset, 1)
  const year = shown.getFullYear()
  const month = shown.getMonth()
  const days = new Date(year, month + 1, 0).getDate()
  const firstWeekday = new Date(year, month, 1).getDay()
  const isBaseMonth = year === 2026 && month === 8
  const storedThisMonth = stored.filter(item => {
    const [itemYear, itemMonth] = item.date.split('-').map(Number)
    return itemYear === year && itemMonth === month + 1
  })
  const storedForDay = storedThisMonth.filter(item => Number(item.date.slice(-2)) === selectedDay)
  const events = [...(isBaseMonth ? (scheduleEvents[selectedDay] || []).map(item => ({ ...item, target: '/workshops' as Route })) : []), ...storedForDay]
  const hasEvent = (day: number) => Boolean((isBaseMonth && scheduleEvents[day]) || storedThisMonth.some(item => Number(item.date.slice(-2)) === day))
  const changeMonth = (delta: number) => { setMonthOffset(value => value + delta); setSelectedDay(1) }
  return (
    <main className="extension-screen schedule-screen">
      <ExtensionHeader title="我的日程" back="/profile" />
      <div className="extension-scroll schedule-scroll">
        <section className="schedule-calendar-card">
          <header><button onClick={() => changeMonth(-1)}>‹</button><h1>{year} 年 {month + 1} 月</h1><button onClick={() => changeMonth(1)}>›</button></header>
          <div className="schedule-week">{['日','一','二','三','四','五','六'].map(day => <b key={day}>{day}</b>)}</div>
          <div className="schedule-days">{Array.from({ length: firstWeekday }).map((_, index) => <i key={`blank-${index}`} />)}{Array.from({ length: days }, (_, index) => index + 1).map(day => <button key={day} className={`${selectedDay === day ? 'selected' : ''} ${hasEvent(day) ? 'has-event' : ''}`} onClick={() => setSelectedDay(day)}><span>{day}</span></button>)}</div>
          <footer><span><i className="mint" />工坊预约</span><span><i className="coral" />社区活动</span></footer>
        </section>
        <section className="schedule-agenda"><header><h2>{month + 1}月{selectedDay}日</h2><span>{events.length ? `${events.length} 个日程` : '暂无安排'}</span></header>{events.length ? events.map((event, index) => <article className={event.tone} key={`${event.title}-${index}`}><time>{event.time}</time><div><b>{event.title}</b><small>{event.place}</small></div><button onClick={() => go(event.target)}>查看</button></article>) : <div className="schedule-empty"><b>今天可以慢一点</b><p>还没有预约活动，去看看附近的旧衣改造工坊吧。</p><button onClick={() => go('/workshops')}>浏览工坊</button></div>}</section>
      </div>
    </main>
  )
}

type MarketTab = 'recommend' | 'kits' | 'brands' | 'outfits'

const marketTabs: Array<{ id: MarketTab; label: string }> = [
  { id: 'recommend', label: '推荐' },
  { id: 'kits', label: 'DIY材料包' },
  { id: 'brands', label: '品牌' },
  { id: 'outfits', label: '穿搭' },
]

const marketCatalog: Record<MarketTab, Product[]> = {
  recommend: products,
  kits: products,
  brands: brandProducts,
  outfits: outfitProducts,
}

function MarketQuickLinks({ onSelectTab }: { onSelectTab: (tab: MarketTab) => void }) {
  const links: Array<{ label: string; icon: string; onClick: () => void }> = [
    { label: 'DIY材料包', icon: 'kits', onClick: () => onSelectTab('kits') },
    { label: '美妙商店', icon: 'brands', onClick: () => onSelectTab('brands') },
    { label: '超级满减', icon: 'sale', onClick: () => go('/shop/sale') },
    { label: '宠粉清单', icon: 'fans', onClick: () => go('/shop/fan-list') },
    { label: '我的订单', icon: 'orders', onClick: () => go('/orders') },
    { label: '购物车', icon: 'cart', onClick: () => go('/cart') },
    { label: '我的足迹', icon: 'footprints', onClick: () => go('/footprints') },
  ]

  return (
    <section className="market-quick-links" aria-label="市集快捷入口">
      {links.map(link => (
        <button key={link.label} type="button" onClick={link.onClick}>
          <i className={`market-sprite market-quick-art market-quick-${link.icon}`} aria-hidden="true" />
          <span>{link.label}</span>
        </button>
      ))}
    </section>
  )
}

function MarketProductGrid({ tab }: { tab: MarketTab }) {
  const backRoutes: Record<MarketTab, Route> = { recommend: '/shop', kits: '/shop/kits', brands: '/shop/brands', outfits: '/shop/outfits' }
  return (
    <section className="reference-continuation shop-continuation">
      <div className="continuation-products">
        {marketCatalog[tab].map(product => (
          <button key={`${tab}-${product.name}`} onClick={() => openProduct(product.id, backRoutes[tab])}>
            <img src={product.img} alt="" />
            <span>{product.tag}</span>
            <b>{product.name}</b>
            <em>{product.price}</em>
            <i className="market-product-plus" aria-hidden="true">＋</i>
          </button>
        ))}
      </div>
    </section>
  )
}

function MarketPanelBody({ tab, onSelectTab }: { tab: MarketTab; onSelectTab: (tab: MarketTab) => void }) {
  return <>
    {tab === 'recommend' && <MarketQuickLinks onSelectTab={onSelectTab} />}
    {tab === 'kits' && <button className="market-fabric-callout" type="button" onClick={() => go('/fabrics')}><span aria-hidden="true">✂</span>购买/预约独一无二的面料</button>}
    <MarketProductGrid tab={tab} />
  </>
}

function MarketExperience({ initialTab = 'recommend' }: { initialTab?: MarketTab }) {
  const [activeTab, setActiveTab] = useState<MarketTab>(initialTab)
  const [previousTab, setPreviousTab] = useState<MarketTab | null>(null)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const tabTouchStart = useRef<number | null>(null)
  const activeIndex = marketTabs.findIndex(tab => tab.id === activeTab)

  const selectTab = (nextTab: MarketTab) => {
    const nextIndex = marketTabs.findIndex(tab => tab.id === nextTab)
    if (nextIndex === activeIndex) return
    setPreviousTab(activeTab)
    setDirection(nextIndex > activeIndex ? 'forward' : 'backward')
    setActiveTab(nextTab)
  }

  useEffect(() => {
    if (!previousTab) return
    const timer = window.setTimeout(() => setPreviousTab(null), 360)
    return () => window.clearTimeout(timer)
  }, [previousTab, activeTab])

  return (
    <main className="reference-stage market-stage has-fixed-reference-bar" data-route="/shop" data-market-tab={activeTab}>
      <div className="reference-content market-content">
        <header className="market-header">
          <div className="market-search-row">
            <button className="market-search-button" type="button" aria-label="搜索" onClick={() => go('/search')}><img src="./assets/search.svg" alt="" /></button>
            <button className="market-cart-button" type="button" aria-label="购物车" onClick={() => go('/cart')}><i className="market-sprite market-cart-art" aria-hidden="true" /></button>
          </div>
          <nav className="market-tabs-shell" aria-label="市集分类">
            <div
              className="market-tabs"
              role="tablist"
              onTouchStart={event => { tabTouchStart.current = event.touches[0]?.clientX ?? null }}
              onTouchEnd={event => {
                const startX = tabTouchStart.current
                const endX = event.changedTouches[0]?.clientX
                tabTouchStart.current = null
                if (startX === null || endX === undefined || Math.abs(endX - startX) < 38) return
                const nextIndex = endX < startX ? activeIndex + 1 : activeIndex - 1
                if (nextIndex >= 0 && nextIndex < marketTabs.length) selectTab(marketTabs[nextIndex].id)
              }}
            >
              {marketTabs.map(tab => (
                <button
                  className={activeTab === tab.id ? 'active' : ''}
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-label={tab.label}
                  aria-selected={activeTab === tab.id}
                  onClick={() => selectTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
        </header>
        <div className="market-panels">
          {previousTab && (
            <div className={`market-panel market-panel-previous market-slide-out-${direction}`} aria-hidden="true">
              <MarketPanelBody tab={previousTab} onSelectTab={selectTab} />
            </div>
          )}
          <div
            className={`market-panel market-panel-active ${previousTab ? `market-slide-${direction}` : ''}`}
            key={activeTab}
            onTouchStart={event => {
              const touch = event.touches[0]
              touchStart.current = { x: touch.clientX, y: touch.clientY }
            }}
            onTouchEnd={event => {
              const start = touchStart.current
              const touch = event.changedTouches[0]
              touchStart.current = null
              if (!start || !touch) return
              const deltaX = touch.clientX - start.x
              const deltaY = touch.clientY - start.y
              if (Math.abs(deltaX) < 55 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return
              const nextIndex = deltaX < 0 ? activeIndex + 1 : activeIndex - 1
              if (nextIndex >= 0 && nextIndex < marketTabs.length) selectTab(marketTabs[nextIndex].id)
            }}
          >
            <MarketPanelBody tab={activeTab} onSelectTab={selectTab} />
          </div>
        </div>
      </div>
      <div className="reference-fixed-bar">
        <FixedReferenceNav route="/shop" />
      </div>
    </main>
  )
}

type ProfileTab = 'likes' | 'collections' | 'notes'

const profilePreviewItems: Record<ProfileTab, Array<{ image: string; title: string }>> = {
  likes: [
    { image: A.profilePost1, title: '宝宝的连体衣变成狗子战袍' },
    { image: A.profilePost2, title: '闲置衬衫领子秒变绅士领结' },
  ],
  collections: [
    { image: A.homeCommunity1, title: '旧衣改造成宠物针织背心' },
    { image: A.homeCommunity2, title: '环保旧衣回收改造成果' },
    { image: A.productKit, title: '童装改造辅助材料包' },
    { image: A.productFabric, title: '二手纯棉面料搭配灵感' },
    { image: A.profilePost2, title: '宠物绅士领结制作收藏' },
  ],
  notes: [
    { image: A.profilePost1, title: '宝宝旧衣改造记录' },
    { image: A.profilePost2, title: '衬衫领口的第二次新生' },
  ],
}

function ProfileContinuation() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('likes')
  const tabs: Array<{ id: ProfileTab; label: string }> = [
    { id: 'likes', label: '喜欢' },
    { id: 'collections', label: '收藏 (5)' },
    { id: 'notes', label: '笔记 (2)' },
  ]

  return (
    <section className="reference-continuation profile-continuation">
      <div className="profile-continuation-tabs" role="tablist" aria-label="个人内容分类">
        {tabs.map(tab => (
          <button
            className={activeTab === tab.id ? 'active' : ''}
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls="profile-preview-panel"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="continuation-posts profile-preview-panel" id="profile-preview-panel" role="tabpanel" key={activeTab}>
        {profilePreviewItems[activeTab].map((item, index) => (
          <button key={`${activeTab}-${index}`} onClick={() => openPost(item.image === A.profilePost2 ? 'tie' : item.image === A.homeCommunity1 ? 'knit' : item.image === A.homeCommunity2 ? 'recycle' : 'baby')}>
            <img src={item.image} alt="" />
            <b>{item.title}</b>
          </button>
        ))}
      </div>
    </section>
  )
}

type ChatId = 'handmade' | 'dahuang' | 'support' | 'shelter'

const privateChats: Record<ChatId, {
  name: string
  preview: string
  time: string
  avatar: string
  official?: boolean
  unread?: number
  messages: Array<{ mine?: boolean; text: string }>
}> = {
  handmade: {
    name: '手工小能手',
    preview: '亲，材料包里有教程吗？我是新手不太会。',
    time: '5分钟前',
    avatar: 'avatar-0',
    unread: 2,
    messages: [
      { text: '你好，我刚收到童装改造辅助包。' },
      { mine: true, text: '欢迎加入旧衣改造！包装内附有步骤卡和视频入口。' },
      { text: '亲，材料包里有教程吗？我是新手不太会。' },
    ],
  },
  dahuang: {
    name: '大黄的主人',
    preview: '上次活动的图片发我一下哈，谢谢！',
    time: '1小时前',
    avatar: 'avatar-1',
    messages: [
      { mine: true, text: '大黄上次的旧衣改造造型特别可爱。' },
      { text: '哈哈，它回家以后还一直舍不得脱。' },
      { text: '上次活动的图片发我一下哈，谢谢！' },
    ],
  },
  support: {
    name: 'Pawtern官方客服',
    preview: '您的反馈我们已经收到了，会尽快处理。',
    time: '昨天',
    avatar: 'avatar-2',
    official: true,
    messages: [
      { mine: true, text: '订单里的面料颜色与选择页不一致，可以帮忙确认吗？' },
      { text: '您好，我们已经核对了订单与出库记录。' },
      { text: '您的反馈我们已经收到了，会尽快处理。' },
    ],
  },
  shelter: {
    name: '流浪动物基地',
    preview: '感谢您的捐赠！猫窝已经收到啦。',
    time: '3天前',
    avatar: 'avatar-3',
    messages: [
      { mine: true, text: '旧衣做成的保暖猫窝已经寄出，麻烦注意查收。' },
      { text: '快递已经到基地，志愿者正在整理。' },
      { text: '感谢您的捐赠！猫窝已经收到啦。' },
    ],
  },
}

const messageNotices = {
  system: { title: '系统通知', preview: '您的订单 20231025001 已发货', time: '10:00', route: '/messages/system' as Route, tone: 'system' },
  activity: { title: '活动消息', preview: '您报名的亲子宠物工坊将在明天开始', time: '10:00', route: '/messages/activity' as Route, tone: 'activity' },
}

function MessagesExperience() {
  return (
    <main className="reference-stage messages-experience has-fixed-reference-bar" data-route="/messages">
      <div className="reference-content messages-content">
        <div className="messages-top-snapshot">
          <div className="reference-snapshot-full">
            <img className="reference-page-image" src="./reference/messages.png" alt="" draggable={false} />
            <button className="messages-add-friend" aria-label="添加好友" onClick={() => go('/friends/add')}><img src="./assets/user-round-plus.svg" alt="" /></button>
            <Hotspot label="赞和收藏" to="/messages/likes" x={43} y={127} width={75} height={76} />
            <Hotspot label="新增关注" to="/messages/follows" x={157} y={127} width={75} height={76} />
            <Hotspot label="评论和@" to="/messages/comments" x={274} y={127} width={75} height={76} />
          </div>
        </div>
        <section className="messages-main-list">
          {Object.values(messageNotices).map(notice => (
            <button className="message-notice-card" key={notice.title} onClick={() => go(notice.route)}>
              <i className={notice.tone}>{notice.title.slice(0, 1)}</i>
              <span><b>{notice.title}</b><small>{notice.preview}</small></span>
              <em>{notice.time}</em>
            </button>
          ))}
          <div className="messages-divider" />
          <h2 className="messages-private-title"><span>•••</span> 私信</h2>
          <div className="messages-contact-list">
            {(Object.entries(privateChats) as Array<[ChatId, (typeof privateChats)[ChatId]]>).map(([id, chat]) => (
              <button key={id} onClick={() => go(`/messages/chat/${id}` as Route)}>
                <i className={chat.avatar} />
                <span><b>{chat.name}{chat.official && <small>官方</small>}</b><em>{chat.preview}</em></span>
                <time>{chat.time}</time>
                {chat.unread && <strong>{chat.unread}</strong>}
              </button>
            ))}
          </div>
        </section>
      </div>
      <div className="reference-fixed-bar"><FixedReferenceNav route="/messages" /></div>
    </main>
  )
}

const friendCandidates = [
  { id: 'momo_mama', name: 'Momo的妈妈', note: '共同关注 3 人', tone: 'peach' },
  { id: 'handmade_paw', name: '手作小能手', note: '喜欢旧衣改造与宠物穿搭', tone: 'mint' },
  { id: 'dahuang_2026', name: '大黄的主人', note: '参加过同一场环保市集', tone: 'yellow' },
  { id: 'pawtern_base', name: '流浪动物基地', note: '你可能认识的公益伙伴', tone: 'blue' },
]

function AddFriendsPage() {
  const [query, setQuery] = useState('')
  const [added, setAdded] = useState<string[]>([])
  const [scannerOpen, setScannerOpen] = useState(false)
  const [toast, setToast] = useState('')
  const filtered = friendCandidates.filter(friend => `${friend.name}${friend.id}`.toLowerCase().includes(query.trim().toLowerCase()))
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 1300) }
  const toggleFriend = (id: string) => setAdded(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id])

  return <main className="extension-screen add-friends-screen">
    <ExtensionHeader title="添加好友" back="/messages" />
    <div className="extension-scroll add-friends-scroll">
      <section className="friend-search-section">
        <label><img src="./assets/search.svg" alt="" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索昵称或 PAWTERN ID" /></label>
        <button className="friend-scan-button" aria-label="扫一扫添加好友" onClick={() => setScannerOpen(true)}><img src="./assets/scan-line.svg" alt="" /></button>
      </section>
      <section className="my-friend-qr-card">
        <header><i>S</i><span><b>Sarah</b><small>PAWTERN ID：680979018</small></span><img src="./assets/qr-code.svg" alt="" /></header>
        <div><img src={A.successQr} alt="Sarah 的好友二维码" /></div>
        <p>扫一扫上面的二维码，添加我为好友</p>
      </section>
      <section className="friend-recommendations">
        <header><h2>{query ? '搜索结果' : '推荐好友'}</h2><small>{query ? `${filtered.length} 位用户` : '根据共同关注与活动推荐'}</small></header>
        <div>{filtered.map(friend => {
          const isAdded = added.includes(friend.id)
          return <article key={friend.id}><i className={`friend-avatar ${friend.tone}`}>{friend.name.slice(0, 1)}</i><span><b>{friend.name}</b><small>@{friend.id} · {friend.note}</small></span><button className={isAdded ? 'added' : ''} onClick={() => toggleFriend(friend.id)}>{isAdded ? '已添加' : '添加'}</button></article>
        })}</div>
        {!filtered.length && <p className="friend-empty">没有找到相关用户，试试完整昵称或 ID。</p>}
      </section>
    </div>
    {scannerOpen && <section className="friend-scanner-layer">
      <header><button aria-label="关闭扫一扫" onClick={() => setScannerOpen(false)}>×</button><h2>扫一扫</h2><span /></header>
      <div className="friend-scanner-frame"><i /><i /><i /><i /><em /></div>
      <p>将好友二维码放入框内，即可自动识别</p>
      <button className="friend-scan-demo" onClick={() => { setScannerOpen(false); notify('识别成功，已找到好友 Momo的妈妈') }}>模拟识别好友二维码</button>
    </section>}
    {toast && <div className="toast">{toast}</div>}
  </main>
}

type SocialNoticeKind = 'likes' | 'follows' | 'comments'

const socialNoticeData: Record<SocialNoticeKind, Array<{ name: string; action: string; detail: string; image?: string; avatar: string }>> = {
  likes: [
    { name: '小卷毛和妈妈', action: '赞了你的笔记', detail: '宝宝的连体衣变成狗子战袍', image: A.profilePost1, avatar: 'peach' },
    { name: '布丁今天拆家了吗', action: '收藏了你的笔记', detail: '衬衫领口的第二次新生', image: A.profilePost2, avatar: 'mint' },
    { name: '旧衣研究所', action: '赞了你的改造作品', detail: '一件旧衣的环保旅程', image: A.homeCommunity1, avatar: 'blue' },
  ],
  follows: [
    { name: '柯基团子', action: '开始关注你', detail: '喜欢旧衣改造和周末市集', avatar: 'peach' },
    { name: '猫咪裁缝铺', action: '开始关注你', detail: '分享猫咪衣服纸样与教程', avatar: 'mint' },
    { name: '环保遛狗人', action: '开始关注你', detail: '已完成 12 次旧衣循环', avatar: 'blue' },
  ],
  comments: [
    { name: '大黄的主人', action: '评论了你的笔记', detail: '这个背心的包边是怎么处理的？', image: A.profilePost1, avatar: 'mint' },
    { name: 'Momo妈', action: '在评论中提到了你', detail: '@Sarah 一起参加下周的改造工坊吗？', image: A.homeCommunity1, avatar: 'peach' },
    { name: 'Pawtern社区助手', action: '回复了你的评论', detail: '纸样已经更新，可以重新下载啦。', image: A.productKit, avatar: 'blue' },
  ],
}

function SocialNoticePage({ kind }: { kind: SocialNoticeKind }) {
  const titles: Record<SocialNoticeKind, string> = { likes: '赞和收藏', follows: '新增关注', comments: '评论和@' }
  return (
    <main className="extension-screen social-notice-screen">
      <ExtensionHeader title={titles[kind]} back="/messages" />
      <div className="extension-scroll social-notice-scroll">
        {socialNoticeData[kind].map((item, index) => (
          <article className="social-notice-row" key={`${item.name}-${index}`}>
            <i className={item.avatar}>{item.name.slice(0, 1)}</i>
            <span><b>{item.name}</b><small>{item.action}</small><p>{item.detail}</p></span>
            {kind === 'follows' ? <button className={index === 1 ? 'followed' : ''}>{index === 1 ? '已关注' : '关注'}</button> : item.image && <button className="social-note-thumb" onClick={() => go('/community/post')}><img src={item.image} alt="" /></button>}
          </article>
        ))}
      </div>
    </main>
  )
}

function MessageFeedPage({ kind }: { kind: 'system' | 'activity' }) {
  const isSystem = kind === 'system'
  const notice = messageNotices[kind]
  const items = isSystem ? [
    { date: '8月28日', title: '订单已完成', text: '订单 20260818016 已确认完成，感谢你的环保选择。' },
    { date: '今天 09:20', title: '包裹运输中', text: '你的包裹已抵达北京朝阳配送站。' },
    { date: notice.time, title: '订单已发货', text: notice.preview },
  ] : [
    { date: '8月25日', title: '报名成功', text: '旧衣新生·亲子宠物工坊报名成功。' },
    { date: '昨天', title: '材料提醒', text: '请准备一件干净、柔软且无破损的宝宝旧衣。' },
    { date: notice.time, title: '活动即将开始', text: notice.preview },
  ]
  return (
    <main className="extension-screen message-feed-screen">
      <ExtensionHeader title={notice.title} back="/messages" />
      <div className="extension-scroll message-feed-scroll">
        <section className={`message-feed-banner ${kind}`}><small>PAWTERN</small><h1>{isSystem ? '订单与服务进度' : '工坊活动提醒'}</h1><p>{isSystem ? '在这里查看配送、退款和服务处理进度。' : '不错过每一次旧衣新生的相聚。'}</p></section>
        <div className="message-feed-list">
          {items.map(item => <article key={`${item.date}-${item.title}`}><time>{item.date}</time><div><b>{item.title}</b><p>{item.text}</p></div></article>)}
        </div>
      </div>
    </main>
  )
}

function ChatPage({ chatId }: { chatId: ChatId }) {
  const chat = privateChats[chatId]
  const [draft, setDraft] = useState('')
  const [sent, setSent] = useState<string[]>([])
  const submit = () => {
    const text = draft.trim()
    if (!text) return
    setSent(items => [...items, text])
    setDraft('')
  }
  return (
    <main className="extension-screen chat-screen">
      <ExtensionHeader title={chat.name} back="/messages" />
      <div className="extension-scroll chat-scroll">
        <p className="chat-time">今天</p>
        {chat.messages.map((message, index) => <p className={`chat-bubble ${message.mine ? 'mine' : ''}`} key={index}>{message.text}</p>)}
        {sent.map((message, index) => <p className="chat-bubble mine" key={`sent-${index}`}>{message}</p>)}
      </div>
      <form className="chat-composer" onSubmit={event => { event.preventDefault(); submit() }}><input value={draft} onChange={event => setDraft(event.target.value)} placeholder="输入消息" /><button>发送</button></form>
    </main>
  )
}

function ReferenceContinuation({ route }: { route: Route }) {
  if (route === '/home') {
    return (
      <section className="reference-continuation home-continuation">
        <div className="continuation-posts">
          <button onClick={() => openPost('baby')}><img src={A.homeCommunity1} alt="" /><b>宝宝的连体衣变成狗子战袍！</b><small>Momo妈</small></button>
          <button onClick={() => openPost('recycle')}><img src={A.homeCommunity2} alt="" /><b>8月回收成果：500件童装的新生</b><small>官方回收君</small></button>
        </div>
      </section>
    )
  }
  if (route === '/shop' || route === '/shop/kits') {
    return (
      <section className="reference-continuation shop-continuation">
        <div className="continuation-products">
          {products.map(product => (
            <button key={product.name} onClick={() => openProduct(product.id, route)}>
              <img src={product.img} alt="" /><span>{product.tag}</span><b>{product.name}</b><em>{product.price}</em>
            </button>
          ))}
        </div>
      </section>
    )
  }
  if (route === '/profile') {
    return <ProfileContinuation />
  }
  return null
}

function ReferenceExperience({ route, draftImages, setDraftImages }: {
  route: Route
  draftImages: string[]
  setDraftImages: (value: string[]) => void
}) {
  if (route.startsWith('/onboarding/')) return <OnboardingExperience initialStep={Number(route.split('/').pop()) as 1 | 2 | 3} />
  if (route === '/home/diy') return <DiyChoiceExperience />
  if (route === '/recycle/pickup') return <RecyclePage mode="pickup" />
  if (route === '/recycle/dropoff') return <RecyclePage mode="dropoff" />
  if (route === '/recycle/success') return <RecycleSuccess />
  if (route === '/workshops') return <Workshops />
  if (route === '/workshop/time') return <WorkshopTime />
  if (route === '/workshop/profile') return <WorkshopProfile />
  if (route === '/workshop/diy') return <WorkshopDiy />
  if (route === '/workshop/success') return <WorkshopSuccess />
  if (route === '/activities') return <ActivitiesPage />
  if (route === '/activity/1') return <ActivityDetailPage index={0} />
  if (route === '/activity/2') return <ActivityDetailPage index={1} />
  if (route === '/activity/3') return <ActivityDetailPage index={2} />
  if (route === '/publish') return <PublishMenu onSelectImages={setDraftImages} />
  if (route === '/publish/editor') return <PublishEditor previews={draftImages} />
  if (route === '/shop/sale') return <SalePage />
  if (route === '/shop/fan-list') return <FanListPage />
  if (route === '/orders') return <OrdersPage />
  if (route === '/footprints') return <FootprintsPage />
  if (route === '/product') return <ProductDetailPage />
  if (route === '/fabrics') return <FabricsExperience />
  if (route === '/fabrics/detail') return <FabricsExperience initialDetail="blue" />
  if (route === '/fabrics/checkout') return <FabricCheckoutPage />
  if (route === '/achievements' || route === '/achievements/action') return <AchievementsExperience />
  if (route === '/achievements/history') return <AchievementHistoryPage />
  if (route === '/schedule') return <SchedulePage />
  if (route === '/profile/edit') return <ProfileEditPage />
  if (route === '/profile/level') return <ProfileLevelPage />
  if (route === '/profile/points') return <ProfilePointsPage />
  if (route === '/settings/account') return <SettingsDetailPage kind="account" />
  if (route === '/settings/notifications') return <SettingsDetailPage kind="notifications" />
  if (route === '/settings/privacy') return <SettingsDetailPage kind="privacy" />
  if (route === '/settings/display') return <SettingsDetailPage kind="display" />
  if (route === '/settings/about') return <SettingsDetailPage kind="about" />
  if (route === '/pets/edit') return <PetEditPage />
  if (route === '/addresses/new') return <AddressNewPage />
  if (route === '/shop') return <MarketExperience />
  if (route === '/shop/kits') return <MarketExperience initialTab="kits" />
  if (route === '/shop/brands') return <MarketExperience initialTab="brands" />
  if (route === '/shop/outfits') return <MarketExperience initialTab="outfits" />
  if (route === '/messages') return <MessagesExperience />
  if (route === '/friends/add') return <AddFriendsPage />
  if (route === '/messages/likes') return <SocialNoticePage kind="likes" />
  if (route === '/messages/follows') return <SocialNoticePage kind="follows" />
  if (route === '/messages/comments') return <SocialNoticePage kind="comments" />
  if (route === '/messages/system') return <MessageFeedPage kind="system" />
  if (route === '/messages/activity') return <MessageFeedPage kind="activity" />
  if (route.startsWith('/messages/chat/')) return <ChatPage chatId={route.split('/').pop() as ChatId} />
  if (utilityTitles[route]) return <UtilityPage route={route} />

  const screen = referenceScreens[route]!
  return (
    <main className={`reference-stage ${screen.fixedBar ? 'has-fixed-reference-bar' : ''}`} data-route={route}>
      <div className="reference-content">
        {screen.fixedBar ? <>
          {route === '/profile' ? <ProfileDashboard /> : <div className="reference-snapshot-clip">
            <div className="reference-snapshot-full">
              <img className="reference-page-image" src={screen.image} alt="" draggable={false} />
              {route === '/home' && <ActivityCarousel />}
              <RouteHotspots route={route} />
            </div>
          </div>}
          <ReferenceContinuation route={route} />
        </> : <div className="reference-canvas">
          <img className="reference-page-image" src={screen.image} alt="" draggable={false} />
          <RouteHotspots route={route} />
        </div>}
      </div>
      {screen.fixedBar && (
        <div className="reference-fixed-bar">
          <FixedReferenceNav route={route} />
        </div>
      )}
    </main>
  )
}

function App() {
  const route = useRoute()
  const [draftImages, setDraftImages] = useState<string[]>([])

  useLayoutEffect(() => {
    const updateScale = () => {
      const viewport = window.visualViewport
      const width = viewport?.width ?? window.innerWidth
      const height = viewport?.height ?? window.innerHeight
      const desktopInset = width >= 403 && height >= 875 ? 18 : 0
      const scale = Math.min(1, (width - desktopInset * 2) / 402, (height - desktopInset * 2) / 874)
      document.documentElement.style.setProperty('--pawtern-scale', String(Math.max(.1, scale)))
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    window.visualViewport?.addEventListener('resize', updateScale)
    return () => {
      window.removeEventListener('resize', updateScale)
      window.visualViewport?.removeEventListener('resize', updateScale)
      document.documentElement.style.removeProperty('--pawtern-scale')
    }
  }, [])

  return <div className="app-shell"><div className="app-frame"><ReferenceExperience key={route} route={route} draftImages={draftImages} setDraftImages={setDraftImages} /></div></div>
}

export default App
