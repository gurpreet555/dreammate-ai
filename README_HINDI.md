# DreamMate AI — Android mobile se test karne ke liye

Ye ek **mobile-friendly PWA prototype** hai. Pehle version mein character gallery, chat UI, local chat history aur offline demo replies hain. Live AI optional hai.

## Sabse aasan test (sirf Android phone)

### Option A — ZIP ko browser mein kholna
1. ZIP extract karne ke liye Android ka Files app ya koi trusted archive app use karo.
2. `index.html` ko browser mein kholne ki koshish karo. Kuch browsers local files par restrictions lagate hain; agar page ya styling sahi na aaye to Option B use karo.
3. Demo replies ke liye API key ki zaroorat nahi.

### Option B — Free static hosting (recommended)
1. ZIP extract karo.
2. GitHub account banao/login karo: https://github.com/
3. New **public** repository banao, example `dreammate-ai`.
4. Repository mein `Add file` → `Upload files` select karo. Extracted project ke **andar ke files** upload karo (folder ko ZIP ke roop mein upload mat karna). `index.html`, `app.js`, `styles.css`, `manifest.json`, `sw.js` aur `icons` folder repository ke root mein hon.
5. Commit changes.
6. Repository ke `Settings` → `Pages` mein jao.
7. `Deploy from a branch` select karo, branch `main`, folder `/(root)` choose karo, Save.
8. GitHub Pages ka URL banne ka wait karo. Us URL ko Chrome on Android mein kholo.
9. Chrome menu `⋮` → `Add to Home screen` (ya `Install app`, agar dikhe) select karo.

**Privacy:** GitHub Pages par upload ki gayi files public hoti hain. Is project mein koi API key pre-filled nahi hai. Apni key kabhi code file mein add mat karna.

## Live AI enable karna (optional)
1. Google AI Studio kholo: https://aistudio.google.com/
2. API key create karo; account/model/region ke hisaab se free availability aur quota check karo.
3. Published DreamMate page par Settings (⚙) kholo.
4. Apni key Settings ke optional key field mein paste karo, `Use live AI` tick karo aur Save settings dabao.
5. Chat mein test karo. Agar error aaye, model name, key restrictions, internet aur quota check karo.

### Security warning — important
- Browser se direct Gemini API call karna **sirf personal prototype testing** ke liye hai.
- Browser key ko user ke apne session storage mein rakhta hai, lekin page ke JavaScript se use access kiya ja sakta hai. Isliye public app users ko apni key dalne ke liye mat kaho aur API key ko HTML/JS mein hard-code mat karo.
- Public app release ke liye secure backend/proxy, rate limiting, usage monitoring, privacy policy, data deletion and abuse controls add karo.
- `store` ya local browser storage settings ko privacy guarantee na samjho. Chat history isi device/browser ke local storage mein save hoti hai. Shared phone par private chats store mat karo.

## APK ke baare mein
Is ZIP mein Flutter/Android APK build output nahi hai. Sirf phone par project ko edit/test karne ke liye PWA approach use ki gayi hai. Proper APK ke liye baad mein Flutter/Android build environment ya trusted cloud build workflow chahiye.

## Features
- Three fictional characters: Alex, Noah, Luna
- Character-specific greeting, personality and story
- Offline demo responses
- Optional live Gemini API
- Local chat history and clear-history button
- Responsive dark theme and home-screen install support
