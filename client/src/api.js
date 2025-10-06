const API = import.meta.env.VITE_API_URL || 'http://localhost:4000' // при билде на Pages используем мок-данные

// --- Mock Data (генерируем из изображений Davines) ---

const davRoot = 'dav shampoo'

// Списки файлов по подпапкам (перечислены все предоставленные файлы)
const topLevelImages = [
  'davines-71262-calming-shampoo-250ml-8004608256519-1.jpg',
  'davines-71264-detoxifying-scrub-shampoo-250ml-8004608256533-1.jpg',
  'davines-71266-replumping-shampoo-250ml-8004608256557-1.jpg',
  'davines-71300-nourishing-shampoo-250ml-8004608269113-1.jpg',
  'davines-75052fr-volu-shampoo-250-ml-8004608287872-1.jpg',
  'davines-75532-love-curl-cleansing-cream-500ml-8004608257172-1.jpg',
  'davines-75579-momo-shampoo-bar-100gr-8004608273127-1.jpg',
  'davines-75586-love-smoothing-shampoo-250ml-8004608274865-1-3.jpg',
  'davines-75626-solu-shampoo-250ml-8004608280477-1-1.jpg',
  'davines-75628-dede-shampoo-250ml-8004608280484-1-1.jpg',
  'davines-76017-oi-body-wash-280ml-8004608247760-1.jpg',
  'davines-90141-su-hair-body-wash-250ml-8004608261803-1.jpg'
]

const condImages = [
  'davines-76043-oi-conditioner-250ml-8004608266495-1.jpg',
  'davines-75609-dede-conditioner-250ml-8004608276937-1.jpg',
  'davines-75608-melu-conditioner-250ml-8004608276722-1-1.jpg',
  'davines-75607-momo-conditioner-250ml-8004608276715-1.jpg',
  'davines-75606-love-curl-conditioner-250ml-8004608275893-1-1.jpg',
  'davines-75605-nounou-conditioner-250ml-8004608275886-1-1.jpg',
  'davines-75604-minu-conditioner-250ml-8004608275879-1-1.jpg',
  'davines-75588-love-smoothing-conditioner-250ml-8004608274889-1-1.jpg',
  'davines-72003-rich-conditioner-250ml-8004608271697-1-1.jpg',
  'davines-71314-nourishing-vegetarian-miracle-conditioner-250ml-8004608269250-1.jpg',
  'davines-71219-replumping-conditioner-150ml-8004608240419-1.jpg',
  'davines-71174-wellbeing-conditioner-150ml-8004608230762-1.jpg'
]

const maskTreatImages = [
  'davines-90157-su-hair-mask-150ml-8004608270591-1.jpg',
  'davines-77016-the-restless-circle-50ml-8004608267263-1.jpg',
  'davines-77012-the-let-it-go-circle-50ml-8004608264170-1-1.jpg',
  'davines-77008-the-renaissance-circle-50ml-8004608258230-1-1.jpg',
  'davines-77006-the-quick-fix-circle-50ml-8004608258216-1.jpg',
  'davines-77004-the-wake-up-circle-50ml-8004608258193-1-1.jpg',
  'davines-77002-the-purity-circle-50ml-8004608258179-1.jpg',
  'davines-77000-the-spotlight-circle-50ml-8004608258155-1.jpg',
  'davines-76038-oi-hair-butter-250ml-8004608264590-1.jpg',
  'davines-75613-minu-hair-mask-250ml-8004608276753-1.jpg',
  'davines-75612-nounou-hair-mask-250ml-8004608276746-1.jpg',
  'davines-75611-love-curl-mask-250ml-8004608276739-1.jpg',
  'davines-75584-love-smoothing-instant-mask-250ml-8004608275565-1 (1).jpg',
  'davines-71308-nourishing-hair-building-pak-250ml-8004608269199-1-1.jpg',
  'davines-71304-nourishing-vegetarian-miracle-mask-250ml-8004608269151-1.jpg'
]

const refilImages = [
  'screenshot-2024-05-24-at-13.31.48.jpg',
  'screenshot-2024-05-24-at-13.31.41.jpg',
  'screenshot-2024-05-24-at-13.31.33.jpg',
  'screenshot-2024-05-24-at-13.31.26.jpg',
  'screenshot-2024-05-24-at-13.31.17.jpg'
]

const leaveInImages = [
  'we_stand_for_regeneration_butter-300dpi_warm_grey.jpg',
  'mobile_file_2025-07-27_18-22-40.jpg',
  'davines-love-curl-primer-150ml-8004608284475-1-1.jpg',
  'davines-90144-su-milk-135ml-8004608261780-1.jpg',
  'davines-79008-liquid-spell-reinforcing-bodifying-fluid-125ml-8004608286417-1.jpg',
  'davines-76120-oi-all-in-one-milk-50ml-8004608285205-1.jpg',
  'davines-76119-oi-all-in-one-milk-135ml-8004608285199-1.jpg',
  'davines-76001-oi-oil-50ml-no-label-8004608247609-1.jpg',
  'davines-76000-oi-oil-135ml-no-label-8004608247593-1.jpg',
  'davines-75590-love-hair-smoother-150ml-8004608275039-1.jpg',
  'davines-75583-love-smoothing-perfector-150ml-8004608275558-1.jpg',
  'davines-75552-momo-hair-potion-150ml-8004608262466-1.jpg',
  'davines-75541-love-curl-revitalizer-75ml-8004608257943-1.jpg',
  'davines-75540-love-curl-cream-150ml-8004608257271-1.jpg',
  'davines-75535-love-curl-controller-150ml-8004608284482-1.jpg',
  'davines-75534-love-curl-revitalizer-250ml-8004608257196-1.jpg',
  'davines-75067-minu-hair-serum-150ml-8004608242666-1.jpg',
  'davines-75055-volu-hair-mist-250ml-8004608242543-1-1.jpg',
  'davines-75051-melu-hair-shield-250ml-8004608242505-1.jpg',
  'davines-75022-dede-hair-mist-250ml-8004608242215-1-1.jpg',
  'davines-72008-sheer-glaze-150ml-8004608271741-1.jpg',
  'davines-71337-replumping-hair-filler-superactive-leave-in-100ml-8004608275411-1-1.jpg',
  'davines-71311-nourishing-keratin-sealer-100ml-8004608269229-1.jpg',
  'davines_oi_souffle.png',
  '91ab0e58-a845-420e-85d9-77b40c5f2ef3.jpeg',
  '71225-calming-superactive-100ml-8004608244509.jpg'
]

const stylingImages = [
  'p8xk0ym18fkwcffljk5z_2000x-3.webp',
  'davines-this-is-a-volume-boosting-mousse-250ml-8004608247197-1.jpg',
  'davines-this-is-a-texturizing-serum-150ml-8004608284437-1.jpg',
  'davines-this-is-a-texturizing-dust-8gr-8004608237518-1.jpg',
  'davines-this-is-a-strong-hair-spray-400ml-8004608252139-1.jpg',
  'davines-this-is-a-shimmering-mist-200ml-8004608252153-1.jpg',
  'davines-this-is-a-sea-salt-spray-250ml-8004608258346-1.jpg',
  'davines-this-is-a-relaxing-moisturizing-fluid-125ml-8004608237495-1.jpg',
  'davines-this-is-an-oil-non-oil-250ml-8004608258865-1.jpg',
  'davines-this-is-an-invisible-serum-50ml-8004608237402-1.jpg',
  'davines-this-is-an-invisible-no-gas-spray-250ml-8004608252146-1.jpg',
  'davines-this-is-an-extra-strong-hair-spray-400ml-8004608248965-1.jpg',
  'davines-this-is-a-medium-hold-modeling-gel-250ml-8004608237464-1.jpg',
  'davines-this-is-a-medium-hair-spray-400ml-8004608252122-1.jpg',
  'davines-this-is-a-dry-texturizer-250ml-8004608248941-1.jpg',
  'davines-this-is-a-curl-moisturizing-mousse-250ml-8004608247203-1-1.jpg',
  'davines-this-is-a-curl-gel-oil-250ml-8004608279310-1-kopiya.jpg',
  'davines-this-is-a-curl-building-serum-250ml-8004608284390-1.jpg',
  'davines-87149-this-is-a-primer-250ml-8004608286950-1.jpg',
  'davines-87126-dry-wax-200ml-8004608285816-1.jpg',
  'd0136abd30db815e63e973b4f4f96f9010c3e73e_2000x-3.webp'
]

function buildDescriptionFromName(fileName) {
  const name = fileName.toLowerCase()
  const parts = []
  if (/oi\b/.test(name)) parts.push('Аромат: тёплый, обволакивающий. Эффект: блеск и шелковистость, антифриз-эффект.')
  if (/momo\b/.test(name)) parts.push('Аромат: свежий, акватический. Эффект: глубокое увлажнение для сухих волос.')
  if (/minu\b/.test(name)) parts.push('Аромат: цитрусовый. Эффект: защита и сияние окрашенных волос.')
  if (/nounou\b/.test(name)) parts.push('Аромат: кремовый. Эффект: питание и восстановление повреждённых волос.')
  if (/melu\b/.test(name)) parts.push('Аромат: чистый, мягкий. Эффект: укрепление и защита от ломкости для длинных волос.')
  if (/dede\b/.test(name)) parts.push('Аромат: деликатный, свежий. Эффект: мягкое ежедневное очищение.')
  if (/solu\b/.test(name)) parts.push('Аромат: травяной. Эффект: глубокое очищение и детокс накоплений стайлинга.')
  if (/replumping\b/.test(name)) parts.push('Аромат: цветочный. Эффект: упругость и эластичность благодаря гиалуроновой кислоте.')
  if (/calming\b/.test(name)) parts.push('Аромат: лёгкий. Эффект: успокоение чувствительной кожи головы.')
  if (/su\b/.test(name)) parts.push('Аромат: солнечный, цитрусовый. Эффект: мягкое очищение после солнца.')
  if (/love-?curl|curl\b/.test(name)) parts.push('Аромат: лёгкий. Эффект: эластичные, очерченные кудри без пушистости.')
  if (/love-?smoothing|smoothing\b/.test(name)) parts.push('Аромат: мягкий. Эффект: сглаживание, контроль пушистости, мягкий блеск.')
  if (/volume|volu\b/.test(name)) parts.push('Эффект: объём от корней и лёгкость для тонких волос.')
  if (/body wash|body-wash|body_wash|body\b/.test(name)) parts.push('Для тела: деликатное очищение, ощущение свежести кожи.')
  if (/mask|butter|pak/.test(name)) parts.push('Текстура: насыщенная. Эффект: интенсивное восстановление и питание.')
  if (/conditioner/.test(name)) parts.push('Кондиционер: разглаживание, лёгкость расчёсывания, уменьшение пушистости.')
  if (/shampoo|cleansing|wash|bar/.test(name)) parts.push('Шампунь: мягкая пена, бережное очищение без утяжеления.')
  if (/milk|serum|oil|spray|fluid|mist|wax|gel|mousse|primer|textur/i.test(name)) parts.push('Стайлинг/уход: подчёркивает текстуру, защищает и придаёт форму.')
  const text = parts.join(' ')
  return text || 'Аромат: чистый и деликатный. Эффект: ухоженный вид и комфорт в использовании.'
}

function prettifyTitle(fileName) {
  const base = decodeURIComponent(fileName.replace(/\.[^.]+$/, ''))
  const cleaned = base
    .replace(/%20/g, ' ')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+\(1\)$/i, '')
    .replace(/\bkopiya\b/gi, '')
    .replace(/\s+1(?:\b|$)/, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return cleaned
}

function detectVolumeFromName(name) {
  const m = name.match(/(\d+)(ml|gr)/i)
  if (!m) return ''
  const num = m[1]
  const unit = m[2].toLowerCase() === 'gr' ? 'г' : 'мл'
  return `${num} ${unit}`
}

function makeCategory(folder, fileName, isTop = false) {
  if (folder === 'dav cond') return 'dav_cond'
  if (folder === 'dav mask treat') return 'dav_mask_treat'
  if (folder === 'dav nesm uhod') return 'dav_leave_in'
  if (folder === 'dav styling') return 'dav_styling'
  if (folder === 'dav refil') return 'dav_refil'
  if (isTop) {
    return /body-wash/i.test(fileName) ? 'dav_body' : 'dav_shampoo'
  }
  return 'davines'
}

function buildDavinesProducts() {
  const groups = [
    { folder: '', list: topLevelImages, isTop: true },
    { folder: 'dav cond', list: condImages },
    { folder: 'dav mask treat', list: maskTreatImages },
    { folder: 'dav refil', list: refilImages },
    { folder: 'dav nesm uhod', list: leaveInImages },
    { folder: 'dav styling', list: stylingImages }
  ]

  let id = 1
  const products = []
  for (const g of groups) {
    for (const f of g.list) {
      const category = makeCategory(g.folder, f, !!g.isTop)
      const title = prettifyTitle(f)
      const volume = detectVolumeFromName(f)
      const image = g.folder ? `${davRoot}/${g.folder}/${f}` : `${davRoot}/${f}`
      const priceBase = 2500
      const priceRand = 100 * ((id % 9) + 1)
      const price = priceBase + priceRand
      products.push({
        id: id++,
        sku: `DAV-${id.toString().padStart(4, '0')}`,
        title,
        brand: 'Davines',
        price,
        oldPrice: 0,
        volume: volume || ' ',
        country: 'Италия',
        badges: [],
        category,
        image,
        description: buildDescriptionFromName(f)
      })
    }
  }
  return products
}

const STORAGE_KEY = 'mini_products_v1'
function loadProductsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch(e) {}
  return null
}
function saveProductsToStorage(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) } catch(e) {}
}

const db = {
  products: loadProductsFromStorage() || buildDavinesProducts(),
  cart: []
}

// Function to simulate async API calls
const mockRequest = (data, delay = 100) => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Deep copy to prevent mutation issues
      resolve(JSON.parse(JSON.stringify(data)))
    }, delay)
  })
}

function uid() {
  const k = 'mini_uid'
  let v = localStorage.getItem(k)
  if (!v) { v = Math.random().toString(36).slice(2); localStorage.setItem(k, v) }
  return v
}

// This function is no longer used with mock data, but kept for reference
async function r(path, options={}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', 'x-user-id': uid(), ...(options.headers||{}) },
    ...options
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const getProducts = async () => {
  try {
    const res = await fetch(`${API}/api/products`)
    if (res.ok) {
      const data = await res.json()
      db.products = data.items || []
      return data
    }
  } catch(e) {}
  return mockRequest({ items: db.products })
}

export const getCart = async () => {
  if (API) {
    try {
      const res = await fetch(`${API}/api/cart`, {
        headers: { 'x-user-id': uid() }
      })
      if (res.ok) return res.json()
    } catch(e) {}
  }
  return mockRequest({ items: db.cart })
}

export const addToCart = async (productId, qty = 1) => {
  if (API) {
    try {
      const res = await fetch(`${API}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': uid() },
        body: JSON.stringify({ productId, qty })
      })
      if (res.ok) return res.json()
    } catch(e) {}
  }
  // Fallback: локальная корзина
  const product = db.products.find(p => p.id === productId)
  if (!product) return Promise.reject(new Error('Invalid productId'))
  const existing = db.cart.find(i => i.productId === productId)
  if (existing) existing.qty += qty
  else db.cart.push({ productId, qty, price: product.price, title: product.title })
  return mockRequest({ items: db.cart })
}

export const removeFromCart = async (productId) => {
  if (API) {
    try {
      const res = await fetch(`${API}/api/cart/${productId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': uid() }
      })
      if (res.ok) return res.json()
    } catch(e) {}
  }
  db.cart = db.cart.filter(i => i.productId !== productId)
  return mockRequest({ items: db.cart })
}

export const createOrder = (payload = {}) => {
  const total = db.cart.reduce((s, i) => s + i.price * i.qty, 0)
  const discountPercent = payload.discountPercent || (payload.promoCode === 'SKIDKA' ? 10 : 0)
  const discount = Math.round(total * discountPercent) / 100
  const payable = Math.max(total - discount, 0)
  const order = { id: Date.now(), status: 'created', total, discountPercent, discount, payable, promoCode: payload.promoCode || '', items: [...db.cart] }
  db.cart = [] // Clear the cart
  return mockRequest(order)
}

// ЮKassa: запрос на создание платежа (через сервер)
export const createYooKassaPayment = async (returnUrl) => {
  if (!API) throw new Error('Не задан API (VITE_API_URL). Оплата недоступна.')
  const res = await fetch(`${API}/api/payments/yookassa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': uid() },
    body: JSON.stringify({ returnUrl })
  })
  const data = await res.json()
  if (!res.ok) {
    const msg = data?.message || data?.error || (data?.details && data.details?.description) || 'Ошибка оплаты'
    throw new Error(msg)
  }
  return data
}

export const saveProducts = async (items) => {
  try {
    const res = await fetch(`${API}/api/admin/products`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': (import.meta.env.VITE_ADMIN_KEY || 'dev123') },
      body: JSON.stringify({ items })
    })
    if (!res.ok) throw new Error('save failed')
    const data = await res.json()
    db.products = JSON.parse(JSON.stringify(items))
    saveProductsToStorage(db.products)
    return data
  } catch(e) {
    db.products = JSON.parse(JSON.stringify(items))
    saveProductsToStorage(db.products)
    return mockRequest({ ok: true, local: true })
  }
}

// Promo config (code and percent) stored locally
const PROMO_CFG_KEY = 'mini_promo_cfg_v1'
export const getPromoConfig = () => {
  try {
    const raw = localStorage.getItem(PROMO_CFG_KEY)
    if (raw) return JSON.parse(raw)
  } catch(e) {}
  return { code: 'SKIDKA', percent: 10 }
}
export const savePromoConfig = (cfg = { code: '', percent: 0 }) => {
  try { localStorage.setItem(PROMO_CFG_KEY, JSON.stringify({ code: (cfg.code||'').toUpperCase(), percent: Number(cfg.percent)||0 })) } catch(e) {}
  return mockRequest({ ok: true })
}

// === Новые функции для работы с полным флоу заказов ===

export const createOrderWithDelivery = async (orderData) => {
  if (!API) throw new Error('API не настроен')
  
  const res = await fetch(`${API}/api/orders/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': uid() },
    body: JSON.stringify(orderData)
  })
  
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.message || data?.error || 'Ошибка создания заказа')
  }
  
  return data
}

export const createOrderPayment = async (orderId, returnUrl) => {
  if (!API) throw new Error('API не настроен')
  
  const res = await fetch(`${API}/api/orders/${orderId}/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': uid() },
    body: JSON.stringify({ returnUrl })
  })
  
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.message || data?.error || 'Ошибка создания платежа')
  }
  
  return data
}


export const getUserOrders = async () => {
  if (!API) return mockRequest({ orders: [] })
  
  try {
    const res = await fetch(`${API}/api/orders`, {
      headers: { 'x-user-id': uid() }
    })
    if (res.ok) return res.json()
  } catch(e) {}
  
  return mockRequest({ orders: [] })
}

export const getOrder = async (orderId) => {
  if (!API) throw new Error('API не настроен')
  
  const res = await fetch(`${API}/api/orders/${orderId}`, {
    headers: { 'x-user-id': uid() }
  })
  
  return res.json()
}


