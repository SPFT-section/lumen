# LUMEN Writing Studio

ห้องเขียนนิยาย + คลังข้อมูลโลกนิยาย ในไฟล์เดียว ทำงานในเครื่อง 100% และติดตั้งเป็นแอป (PWA) ได้

## ⬇️ ติดตั้ง / ดาวน์โหลด

| แบบ | ลิงก์ |
| --- | --- |
| **PWA (เว็บแอป)** | เปิด `lumen.html` แล้วกด **ติดตั้ง** ที่แถบด้านบน หรือเมนูเบราว์เซอร์ → *ติดตั้งแอป* |
| **APK (Android)** | https://github.com/SPFT-section/lumen/releases/latest/download/lumen-studio.apk |

> PWA ต้องเปิดผ่าน **HTTPS** หรือ `localhost` (service worker ทำงานเฉพาะสองกรณีนี้) การเปิดไฟล์ด้วย `file://` ยังใช้แอปได้ แต่จะไม่มีการแคชออฟไลน์/ติดตั้ง

## PWA

- `lumen.html` — ตัวแอป (single file, ไม่มี build step)
- `manifest.webmanifest` — ชื่อ ไอคอน ทางลัด (เขียนต่อ / คลังข้อมูล / เรื่องใหม่)
- `sw.js` — service worker: แคช app shell, ฟอนต์ Google, ใช้งานออฟไลน์, แจ้งอัปเดต
- `icons/` — ไอคอน 192/512, maskable, apple-touch, favicon

### ติดตั้งบนมือถือ

- **Android / Chrome:** เปิดเว็บ → ปุ่ม **ติดตั้ง** ในแอป หรือเมนู ⋮ → *ติดตั้งแอป / เพิ่มไปยังหน้าจอโฮม*
- **iPhone / Safari:** ปุ่มแชร์ → *เพิ่มไปยังหน้าจอโฮม* (iOS ไม่มีปุ่มติดตั้งอัตโนมัติ)
- เปิดแบบ standalone เต็มจอ, ใช้ต่อได้แม้ไม่มีเน็ตหลังเปิดครั้งแรก

### ทดสอบในเครื่อง

```bash
# ต้องเสิร์ฟผ่าน HTTP ไม่ใช่ file://
python3 -m http.server 8080
# เปิด http://localhost:8080/lumen.html
```

หลังแก้ `lumen.html` ให้ bump `CACHE_VERSION` ใน `sw.js` เพื่อให้ผู้ใช้ได้รับเวอร์ชันใหม่

### Deploy ขึ้น GitHub Pages

มี workflow `.github/workflows/pages.yml` แล้ว:

1. Repo → **Settings → Pages → Source: GitHub Actions**
2. Push ไป `master` (หรือ Run workflow **Deploy PWA**)
3. เปิด `https://<owner>.github.io/lumen/lumen.html`

Workflow จะคัดลอกเฉพาะ `lumen.html`, manifest, service worker และ `icons/` ขึ้น Pages
(ไม่แตะ `index.html` เกม Three.js ที่อยู่ราก repo)

## คลังข้อมูล (Archive)

- 3 คอลัมน์: หมวดหมู่/แท็ก/พื้นที่จัดเก็บ → การ์ดรายการ → รายละเอียด
- เชื่อมโยงรายการถึงกันได้จริง (two-way links + backlinks), ปักหมุด, เรียงลำดับ, ค้นหา, กรองแท็ก
- บันทึกอิสระในหน้ารายละเอียด พร้อม autosave
- ส่งออก Markdown ทั้งคลัง, นำเข้า/รวม JSON
- สำรองอัตโนมัติลง IndexedDB สูงสุด 6 ชุด + กู้คืนเมื่อข้อมูลหลักหาย/เสียหาย
- ขอพื้นที่จัดเก็บถาวร (`navigator.storage.persist`) และแสดงโควตา

## โครงสร้างอื่น

- `index.html`, `js/`, `css/`, `forge/` — เกม Three.js แยกต่างหาก (ไม่เกี่ยวกับ LUMEN)
- `android/` — WebView wrapper `com.lumen.studio` → ดู `README-APK.md`
- `sedan.html`, `viewer.html`, `cover-previews/` — ไฟล์ประกอบอื่น ๆ

## License

ดูไฟล์ใน repo
