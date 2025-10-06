import React, { useEffect, useMemo, useState, useRef } from 'react'
import { getProducts, getCart, addToCart, removeFromCart, createOrderWithDelivery, createOrderPayment } from './api.js'
import ProductCard from './components/ProductCard.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import PromoCategories from './components/PromoCategories.jsx'
import OrderForm from './components/OrderForm.jsx'

export default function App() {
  // Простейший вход в админку без роутера
  try {
    const w = window
    const isAdmin = (
      w?.location?.hash?.includes('admin') ||
      /\/admin$/.test(w?.location?.pathname || '') ||
      new URLSearchParams(w?.location?.search || '').get('admin') === '1'
    )
    if (isAdmin) return <AdminPanel />
  } catch {}
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])
  const drawerRef = useRef(null)
  const [promoInput, setPromoInput] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmPromoInput, setConfirmPromoInput] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [activeTab, setActiveTab] = useState('catalog') // catalog | favorites | search
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('catalog') // home|catalog|cart|fav|profile
  const [visibleCount, setVisibleCount] = useState(20)
  const sentinelRef = useRef(null)
  
  // Новые состояния для формы заказа
  const [orderFormOpen, setOrderFormOpen] = useState(false)
  const [orderSubmitting, setOrderSubmitting] = useState(false)

  useEffect(() => {
    // Инициализация Telegram WebApp (если открыто внутри Telegram)
    let cleanup = () => {}
    try {
      const w = window
      if (w?.Telegram?.WebApp) {
        const tg = w.Telegram.WebApp
        tg.ready()
        if (typeof tg.expand === 'function') tg.expand()
        if (typeof tg.setBackgroundColor === 'function') tg.setBackgroundColor('#ffffff')
        if (typeof tg.setHeaderColor === 'function') tg.setHeaderColor('#ffffff')
        if (typeof tg.disableVerticalSwipes === 'function') tg.disableVerticalSwipes()
      }
    } catch {}
    Promise.all([getProducts(), getCart()])
      .then(([p, c]) => { setProducts(p.items || []); setCart(c.items || []) })
      .finally(() => setLoading(false))
    return cleanup
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('mini_favorites_v1')
      if (raw) setFavorites(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('mini_favorites_v1', JSON.stringify(favorites)) } catch {}
  }, [favorites])

  const categories = useMemo(() => {
    const available = Array.from(new Set(products.map(p => p.category))).filter(Boolean)
    const map = {
      dav_shampoo: { title: 'Шампуни', color: '#e0f3ff' },
      dav_body: { title: 'Гели/Body', color: '#fbe0ff' },
      dav_cond: { title: 'Кондиционеры', color: '#d1f7c4' },
      dav_mask_treat: { title: 'Маски/Уход', color: '#ffe9f0' },
      dav_leave_in: { title: 'Несмываемый уход', color: '#ffdfba' },
      dav_styling: { title: 'Стайлинг', color: '#e0ffe0' },
      dav_refil: { title: 'Рефил/Скрин', color: '#eee' }
    }
    return available.map((value, i) => ({ id: i + 1, value, title: map[value]?.title || value, color: map[value]?.color || '#eee' }))
  }, [products])

  const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart])
  const discountPercent = useMemo(() => (promoCode === 'SKIDKA' ? 10 : 0), [promoCode])
  const discount = useMemo(() => Math.round(total * discountPercent / 100), [total, discountPercent])
  const payable = useMemo(() => Math.max(total - discount, 0), [total, discount])
  const filteredProducts = useMemo(() => {
    if (!selectedCategories.length) return products
    const set = new Set(selectedCategories)
    return products.filter(p => set.has(p.category))
  }, [products, selectedCategories])

  const searchFilteredProducts = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase()
    const base = selectedCategories.length ? filteredProducts : products
    if (!q) return base
    return base.filter(p => (p.title || '').toLowerCase().includes(q))
  }, [products, filteredProducts, selectedCategories, searchQuery])

  const favoriteProducts = useMemo(() => {
    if (!favorites.length) return []
    const set = new Set(favorites)
    const base = selectedCategories.length ? filteredProducts : products
    return base.filter(p => set.has(p.id))
  }, [products, filteredProducts, selectedCategories, favorites])

  const displayedProducts = useMemo(() => {
    if (activeTab === 'favorites') return favoriteProducts
    if (activeTab === 'search') return searchFilteredProducts
    return filteredProducts
  }, [activeTab, filteredProducts, searchFilteredProducts, favoriteProducts])

  const slicedProducts = useMemo(() => displayedProducts.slice(0, visibleCount), [displayedProducts, visibleCount])

  useEffect(() => {
    // Сброс пагинации при смене источника данных
    setVisibleCount(20)
  }, [activeTab, searchQuery, selectedCategories])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          setVisibleCount((c) => (c < displayedProducts.length ? Math.min(c + 20, displayedProducts.length) : c))
        }
      }
    }, { rootMargin: '200px 0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [displayedProducts])

  const toggleCategory = (value) => {
    setSelectedCategories(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }

  const handleAdd = async (productId) => {
    const res = await addToCart(productId, 1)
    setCart(res.items)
  }

  const handleRemove = async (productId) => {
    const res = await removeFromCart(productId)
    setCart(res.items)
  }

  const handleDecrement = async (productId) => {
    const item = cart.find(i => i.productId === productId)
    if (!item) return
    if (item.qty > 1) {
      const res = await addToCart(productId, -1)
      setCart(res.items)
    } else {
      const res = await removeFromCart(productId)
      setCart(res.items)
    }
  }

  const toggleFavorite = (productId) => {
    setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId])
  }

  const clearFavorites = () => {
    setFavorites([])
    try { localStorage.removeItem('mini_favorites_v1') } catch {}
  }

  const handleCheckout = async (orderData) => {
    setOrderSubmitting(true)
    try {
      // Создаем заказ с данными доставки
      const orderResponse = await createOrderWithDelivery(orderData)
      const orderId = orderResponse.order.id

      // Создаем платеж для заказа  
      const w = window
      const returnUrl = `${w.location.origin}${w.location.pathname}`
      const paymentResponse = await createOrderPayment(orderId, returnUrl)
      
      if (paymentResponse?.confirmation_url) {
        setOrderFormOpen(false)
        setConfirmOpen(false)
        w.location.href = paymentResponse.confirmation_url
      } else {
        alert('Не удалось получить ссылку на оплату')
      }
    } catch (e) {
      alert(`Ошибка оформления заказа: ${e?.message || e}`)
    } finally {
      setOrderSubmitting(false)
    }
  }

  const openOrderForm = () => {
    setOrderFormOpen(true)
    setCartOpen(false)
  }

  const applyConfirmPromo = () => {
    const code = (confirmPromoInput || '').trim().toUpperCase()
    if (!code) { setPromoCode(''); setPromoInput(''); setConfirmError(''); return }
    if (code === 'SKIDKA') { setPromoCode(code); setPromoInput(code); setConfirmError('') }
    else { setConfirmError('Неверный промокод') }
  }

  const goToCart = () => { setCartOpen(true) }

  if (loading) return <div className="page"><div className="toolbar"><h1>Магазин</h1></div><div className="content">Загрузка…</div></div>

  return (
    <div className="page">
      <div className="neon"><span>Скидка 10% по промокоду SKIDKA</span></div>
      
      <PromoCategories />
      
      <div className="toolbar">
        <h1>{activeTab === 'favorites' ? 'Избранное' : (activeTab === 'search' ? 'Поиск' : 'Каталог')}</h1>
        <div className="tabs" style={{ display: 'flex', gap: 8, alignItems: 'center', position: 'relative' }}>
          <button className="icon-btn" aria-label="Поиск" title="Поиск" onClick={() => { setActiveNav('search'); setActiveTab('search'); setSearchOpen(true); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="icon-btn" aria-label="Фильтры" title="Фильтры" onClick={() => setFilterOpen(v => !v)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          {selectedCategories.length > 0 && (
            <span className="badge-count" title="Выбрано категорий">{selectedCategories.length}</span>
          )}
          {filterOpen && (
            <>
              <div className="filter-overlay" onClick={() => setFilterOpen(false)} />
              <div className="filter-popover">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={selectedCategories.length === 0} onChange={() => setSelectedCategories([])} /> Все
                </label>
                {categories.map(cat => (
                  <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={selectedCategories.includes(cat.value)} onChange={() => toggleCategory(cat.value)} /> {cat.title}
                  </label>
                ))}
                <button className="primary w-100" onClick={() => setFilterOpen(false)}>Готово</button>
              </div>
            </>
          )}
        </div>
        
      </div>
      {activeTab === 'favorites' && displayedProducts.length === 0 && (
        <div style={{ fontWeight:800, padding:'16px 4px' }}>Избранное пусто</div>
      )}
      <div className="grid">
        {slicedProducts.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            allProducts={products}
            onAddProduct={(id) => handleAdd(id)}
            isFavorite={favorites.includes(p.id)}
            onToggleFavoriteProduct={(id) => toggleFavorite(id)}
            isFavoriteId={(id) => favorites.includes(id)}
          />
        ))}
        {/* Сентинел для подгрузки */}
        {slicedProducts.length < displayedProducts.length && (
          <div ref={sentinelRef} style={{ height: 1 }} />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button className={"nav-btn" + (activeNav==='home'?' active':'')} onClick={() => { setActiveNav('home'); setActiveTab('catalog'); setSearchOpen(false); setFilterOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2v-9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="label">Главная</span>
        </button>
        <button className={"nav-btn" + (activeNav==='cart'?' active':'')} onClick={() => { setActiveNav('cart'); setCartOpen(true); }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h15l-1.5 9h-12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="20" r="1.6" fill="currentColor"/><circle cx="18" cy="20" r="1.6" fill="currentColor"/></svg>
          <span className="label">Корзина</span>
        </button>
        <button className={"nav-btn" + (activeNav==='fav'?' active':'')} onClick={() => { setActiveNav('fav'); setActiveTab('favorites'); }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.61C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
          <span className="label">Избранное</span>
        </button>
      </div>

      {searchOpen && (
        <>
          <div className="filter-overlay" onClick={() => setSearchOpen(false)} />
          <div className="search-popover" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <div className="search-title">Поиск</div>
            <input
              autoFocus
              className="search-input"
              type="search"
              placeholder="Искать по названию"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <div className="search-actions">
              <button className="link" onClick={() => { setSearchQuery('') }}>Очистить</button>
              <button className="primary" onClick={() => setSearchOpen(false)}>Готово</button>
            </div>
          </div>
        </>
      )}

      <div className="drawer" ref={drawerRef}>
        <div className="drawer-title">Корзина</div>
        {cart.length === 0 && <div className="muted">Пока пусто</div>}
        <div className="cart-cards">
          {cart.map(i => {
            const p = products.find(p => p.id === i.productId)
            const img = p?.image ? encodeURI(`${import.meta.env.BASE_URL}${p.image.replace(/^\//,'')}`) : ''
            return (
              <div key={i.productId} className="cart-card">
                <div className="cart-card-media">
                  {img ? (
                    <img src={img} alt={p?.title || i.productId} />
                  ) : (
                    <div className="placeholder">4:5</div>
                  )}
                </div>
                <div className="cart-card-info">
                  <div className="cart-card-title" title={p?.title || i.productId}>{p?.title || i.productId}</div>
                  <div className="cart-card-meta">
                    <span className="cart-card-qty">×{i.qty}</span>
                    <span className="price">{i.price * i.qty} ₽</span>
                  </div>
                  <div className="cart-card-actions">
                    <div className="qty-control">
                      <button className="qty-btn" aria-label="Уменьшить" onClick={() => handleDecrement(i.productId)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      </button>
                      <span className="qty">{i.qty}</span>
                      <button className="qty-btn" aria-label="Увеличить" onClick={() => handleAdd(i.productId)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                    <button className="trash-btn" aria-label="Удалить" title="Удалить" onClick={() => handleRemove(i.productId)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-1 0l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 4v8m4-8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {/* Убрали промокод и скидку из drawer для компактности */}
      </div>
      {cartOpen && (
        <div className="fullscreen-overlay" role="dialog" aria-modal="true" onClick={() => setCartOpen(false)}>
          <div className="fullscreen-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-title">Корзина</div>
            {cart.length === 0 && <div className="muted" style={{ marginBottom: 10 }}>Пока пусто</div>}
            <div className="cart-cards">
              {cart.map(i => {
                const p = products.find(p => p.id === i.productId)
                const img = p?.image ? encodeURI(`${import.meta.env.BASE_URL}${p.image.replace(/^\//,'')}`) : ''
                return (
                  <div key={i.productId} className="cart-card">
                    <div className="cart-card-media">
                      {img ? (
                        <img src={img} alt={p?.title || i.productId} />
                      ) : (
                        <div className="placeholder">4:5</div>
                      )}
                    </div>
                    <div className="cart-card-info">
                      <div className="cart-card-title" title={p?.title || i.productId}>{p?.title || i.productId}</div>
                      <div className="cart-card-meta">
                        <span className="cart-card-qty">×{i.qty}</span>
                        <span className="price">{i.price * i.qty} ₽</span>
                      </div>
                      <div className="cart-card-actions">
                        <div className="qty-control">
                          <button className="qty-btn" aria-label="Уменьшить" onClick={() => handleDecrement(i.productId)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                          </button>
                          <span className="qty">{i.qty}</span>
                          <button className="qty-btn" aria-label="Увеличить" onClick={() => handleAdd(i.productId)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                          </button>
                        </div>
                        <button className="trash-btn" aria-label="Удалить" title="Удалить" onClick={() => handleRemove(i.productId)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-1 0l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 4v8m4-8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Убрали промокод и скидку из полноэкранной корзины */}
            <div className="confirm-actions" style={{ marginTop: 14 }}>
              <button className="primary" onClick={() => setCartOpen(false)}>Назад</button>
              <button className="primary" disabled={!payable || placing} onClick={openOrderForm}>Оформить</button>
            </div>

            {/* Рекомендации в корзине */}
            {products.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div className="sheet-title" style={{ marginBottom: 8 }}>Вам может понравиться</div>
                <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:6 }}>
                  {products.slice(0, 16).map(p => (
                    <div key={p.id} style={{ minWidth: 160, border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', background:'#fff' }}>
                      <div style={{ width:160, height:120, background:'#f6f6f6', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {p.image ? <img src={encodeURI(`${import.meta.env.BASE_URL}${p.image.replace(/^\//,'')}`)} alt={p.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <div className="placeholder">4:5</div>}
                      </div>
                      <div style={{ padding:8 }}>
                        <div style={{ fontSize:12, lineHeight:1.3, height:34, overflow:'hidden' }} title={p.title}>{p.title}</div>
                        <div style={{ display:'flex', gap:6, alignItems:'baseline', margin:'6px 0' }}>
                          <div className="price" style={{ fontSize:13 }}>{p.price} ₽</div>
                          {p.oldPrice > 0 && <div className="old" style={{ fontSize:12 }}>{p.oldPrice} ₽</div>}
                        </div>
                        <button className="secondary" style={{ width:'100%' }} onClick={() => handleAdd(p.id)}>В корзину</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {orderFormOpen && (
        <OrderForm
          cart={cart}
          totalAmount={total}
          finalAmount={payable}
          discountAmount={discount}
          promoCode={promoCode}
          onClose={() => setOrderFormOpen(false)}
          onSubmit={handleCheckout}
          isSubmitting={orderSubmitting}
        />
      )}
      {confirmOpen && (
        <div className="confirm-overlay" role="dialog" aria-modal="true">
          <div className="confirm-sheet">
            <div className="confirm-grabber" />
            <div className="confirm-title">Подтвердите заказ</div>
            <div className="confirm-summary">
              <div>Товары: {cart.reduce((s,i)=>s+i.qty,0)} шт.</div>
              <div>Сумма: {total} ₽</div>
              {discount > 0 && <div>Скидка: −{discount} ₽</div>}
              <div className="confirm-total">К оплате: {payable} ₽</div>
            </div>
            <div className="promo-row" style={{ marginTop: 12 }}>
              <span>Старый способ оформления заказа больше не поддерживается</span>
            </div>
            <div className="confirm-actions">
              <button className="link" onClick={() => setConfirmOpen(false)}>Назад</button>
              <button className="primary" onClick={openOrderForm}>Новое оформление</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


