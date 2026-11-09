# Bellashuv (frontend + backend)
- `backend/` — Node.js + Express + Socket.IO (port 3000)
- `frontend/` — React + Vite (port 5173)
## Ishga tushirish
Windows: `ishga-tushir.bat` | Mac/Linux: `sh ishga-tushir.sh` → http://localhost:5173
## Google orqali ro'yxatdan o'tish
1. console.cloud.google.com → APIs & Services → Credentials → Create credentials → OAuth client ID (Web application).
2. Authorized JavaScript origins: `http://localhost:5173` (deploy qilsangiz, sayt manzilini ham qo'shing).
3. `backend/.env.example` ni `backend/.env` qiling va `GOOGLE_CLIENT_ID=...` yozing, backendni qayta ishga tushiring.
ID yozilmasa — test uchun "Mehmon" kirishi ishlaydi.
## Profil rasmi
Yuqoridagi avatarni (yoki "Profil" tugmasini) bosing: qurilmadan rasm yuklash yoki tayyor avatar tanlash, ismni o'zgartirish mumkin.
## Savollar
`backend/questions.js`: har fan `P(savol1, savol2, "kalit:javob|kalit:javob")` ko'rinishida; savollar shu juftliklardan avtomatik tuziladi (har juftlikdan 2 ta savol). Matematika fanlari avtomatik generatsiya qilinadi.
## Balans
Koin: g'alaba 12, durang 4, mag'lubiyat 1. XP: g'alaba 30+, mag'lubiyat 12+; har 50 XP — yangi daraja (server.js → finish()).
## Serverga (hostingga) joylash
1. `cd frontend && npm install && npm run build` (dist/ papkasi hosil bo'ladi)
2. `cd backend && npm install && npm start`
3. Brauzerda `http://SERVER_IP:3000` ni oching — sayt ham, API ham bitta portdan beriladi.
"Yuklanmoqda..." yoki "Serverga ulanib bo'lmadi" chiqsa: `http://SERVER_IP:3000/api/data` ochilishini va 3000-port (firewall) ochiqligini tekshiring.
Google kirish uchun Authorized JavaScript origins ga sayt manzilini (https://...) qo'shing.
