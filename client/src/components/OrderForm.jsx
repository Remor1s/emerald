import React, { useState, useEffect } from 'react'

export default function OrderForm({ 
  cart, 
  totalAmount, 
  finalAmount, 
  discountAmount, 
  promoCode, 
  onClose, 
  onSubmit,
  isSubmitting = false 
}) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    city: '',
    deliveryAddress: '',
    promoCode: promoCode || ''
  })
  
  const [errors, setErrors] = useState({})




  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Очищаем ошибки при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }


  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Введите имя'
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Введите телефон'
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.customerPhone.trim())) {
      newErrors.customerPhone = 'Некорректный формат телефона'
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'Введите город'
    }
    
    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Введите адрес доставки'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const orderData = {
      ...formData
    }

    onSubmit(orderData)
  }

  return (
    <div className="order-form-overlay" role="dialog" aria-modal="true">
      <div className="order-form-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-header">
          <h2 className="sheet-title">Оформление заказа</h2>
          <button className="close-btn" onClick={onClose} aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Товары: {cart.reduce((sum, item) => sum + item.qty, 0)} шт.</span>
            <span>{totalAmount} ₽</span>
          </div>
          {discountAmount > 0 && (
            <div className="summary-row discount">
              <span>Скидка:</span>
              <span>−{discountAmount} ₽</span>
            </div>
          )}
          <div className="summary-row total">
            <span>К оплате:</span>
            <span>{finalAmount} ₽</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-group">
            <label htmlFor="customerName">Имя получателя *</label>
            <input
              id="customerName"
              type="text"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              className={errors.customerName ? 'error' : ''}
              placeholder="Иван Иванов"
            />
            {errors.customerName && <div className="error-text">{errors.customerName}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="customerPhone">Телефон *</label>
            <input
              id="customerPhone"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleInputChange('customerPhone', e.target.value)}
              className={errors.customerPhone ? 'error' : ''}
              placeholder="+7 (900) 123-45-67"
            />
            {errors.customerPhone && <div className="error-text">{errors.customerPhone}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="city">Город доставки *</label>
            <input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={errors.city ? 'error' : ''}
              placeholder="Введите город"
            />
            {errors.city && <div className="error-text">{errors.city}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="deliveryAddress">Адрес доставки *</label>
            <textarea
              id="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
              className={errors.deliveryAddress ? 'error' : ''}
              placeholder="Улица, дом, квартира"
              rows="3"
            />
            {errors.deliveryAddress && <div className="error-text">{errors.deliveryAddress}</div>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Оформляем...' : 'Оформить заказ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
