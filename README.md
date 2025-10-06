# Emerald - Интернет-магазин косметики

Современный интернет-магазин косметики Davines, построенный на React и адаптированный для Telegram Mini Apps.

## 🌟 Особенности

- ✅ Современный дизайн с адаптивной версткой
- ✅ Каталог продукции Davines с изображениями
- ✅ Корзина покупок
- ✅ Интеграция с ЮKassa для оплаты
- ✅ Telegram Mini App поддержка
- ✅ Админ-панель для управления товарами
- ✅ Промокоды и скидки
- ✅ Система заказов

## 🚀 Быстрый старт

### Для GitHub Pages

Проект автоматически деплоится на GitHub Pages при push в ветку `main`.

URL: https://remor1s.github.io/emerald/

### Локальная разработка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/Remor1s/emerald.git
cd emerald
```

2. Установите зависимости для клиента:
```bash
cd client
npm install
```

3. Запустите клиент:
```bash
npm run dev
```

Клиент будет доступен по адресу http://localhost:5173

### Сервер (опционально)

Если нужен полнофункциональный сервер с базой данных:

1. Установите зависимости для сервера:
```bash
cd server
npm install
```

2. Создайте файл `.env`:
```env
YK_SHOP_ID=ваш_shop_id_из_личного_кабинета
YK_SECRET_KEY=ваш_secret_key_из_личного_кабинета
RETURN_URL=http://localhost:5173
PORT=4000
ORIGIN=*
ADMIN_KEY=your_admin_key
```

3. Запустите сервер:
```bash
npm run dev
```

## 📱 Telegram Mini App

Для использования как Telegram Mini App:

1. Создайте бота через @BotFather
2. Добавьте Web App URL: https://remor1s.github.io/emerald/
3. Настройте меню бота

## 🛠 Технологии

- **Frontend**: React, Vite, CSS3
- **Backend**: Node.js, Express, SQLite
- **Платежи**: ЮKassa API
- **Деплой**: GitHub Pages, GitHub Actions

## 📝 Структура проекта

```
emerald/
├── client/          # React приложение
│   ├── src/
│   │   ├── components/
│   │   ├── api.js
│   │   └── ...
│   └── dist/        # Собранные файлы
├── server/          # Node.js сервер
│   └── src/
├── images/          # Статические изображения
└── .github/         # GitHub Actions
```

## 🎨 Функциональность

### Пользователи
- Просмотр каталога товаров
- Добавление в корзину
- Оформление заказов
- Оплата через ЮKassa

### Админы
- Управление товарами
- Просмотр заказов
- Настройка промокодов

## 📦 Сборка

```bash
cd client
npm run build
```

Собранные файлы будут в папке `client/dist/`

## 🔧 Настройка

### Переменные окружения клиента

Создайте файл `client/.env.local`:
```env
VITE_API_URL=http://localhost:4000
VITE_ADMIN_KEY=your_admin_key
```

### Переменные окружения сервера

Создайте файл `server/.env`:
```env
YK_SHOP_ID=ваш_shop_id
YK_SECRET_KEY=ваш_secret_key
RETURN_URL=http://localhost:5173
PORT=4000
ORIGIN=*
ADMIN_KEY=your_admin_key
```

## 📄 Лицензия

MIT License

## 🤝 Вклад в проект

1. Форкните проект
2. Создайте ветку для вашей функции
3. Сделайте коммит изменений
4. Отправьте pull request

## 📞 Поддержка

При возникновении вопросов создайте issue в GitHub репозитории.