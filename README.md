# 7-Minute Abs Conquest 💪
![7-Minute Abs Conquest](https://github.com/user-attachments/assets/dcc8a07f-f530-46c6-99a7-8d3631577aca)
ยินดีต้อนรับสู่ "7-Minute Abs Conquest" เว็บแอปพลิเคชันจับเวลาออกกำลังกายที่ออกแบบมาเพื่อช่วยให้คุณพิชิตเป้าหมายการสร้างกล้ามเนื้อหน้าท้องและแกนกลางลำตัว (Core Strength) ได้อย่างมีประสิทธิภาพ! พัฒนาด้วย Next.js, React, TypeScript, และ Tailwind CSS (ร่วมกับ Shadcn/ui)

แอปนี้จะนำทางคุณผ่านโปรแกรมฝึกหน้าท้องที่เน้นๆ ครบทุกส่วน ตั้งแต่การทำงาน (Work) พักสั้น (Rest) ไปจนถึงพักระหว่างเซ็ต (Set Rest) พร้อมเสียงและภาพที่ชัดเจน ช่วยให้คุณโฟกัสกับการออกกำลังกายได้อย่างเต็มที่

## ✨ ฟีเจอร์เด่น

* **โปรแกรมฝึกหน้าท้องเฉพาะทาง:** รวมท่าออกกำลังกายเน้นๆ สำหรับหน้าท้องส่วนบน, ส่วนล่าง, ด้านข้าง, และแกนกลางลำตัว:
  * Crunch (ท้องบน)
  * Reverse Crunch (ท้องล่าง)
  * Plank (แกนกลางลำตัว)
  * High Crunches (ท้องบน)
  * Flutter Kicks (ท้องล่าง)
  * Russian Twist (ท้องข้าง)
* **ตั้งค่าเวลามาตรฐาน:**
  * Work Time: 20 วินาที
  * Rest Time: 10 วินาที
  * Set Rest Time: 20 วินาที
  * Total Sets: 3 เซ็ต
* **หน้าจอจับเวลาชัดเจน:** แสดงเวลาที่เหลือในรูปแบบ MM:SS พร้อมสถานะปัจจุบัน (ออกกำลังกาย, พัก, พักเซ็ต)
* **Progress Bars:** ติดตามความคืบหน้าของช่วงปัจจุบัน และความคืบหน้าโดยรวมของโปรแกรม
* **แสดงท่าปัจจุบันและท่าถัดไป:** รู้ว่าต้องทำอะไร และเตรียมพร้อมสำหรับท่าต่อไปเสมอ
* **เสียงแจ้งเตือน (Audio Cues) 🔊:**
  * เสียงเริ่ม (Start) เมื่อเริ่มท่าใหม่
  * เสียงพัก (Go Rest) เมื่อหมดเวลาทำงาน
  * เสียงนับถอยหลัง (Countdown) 3 วินาทีสุดท้ายก่อนหมดเวลาแต่ละช่วง
* **ภาพนับถอยหลัง (Visual Countdown):** ตัวเลขขนาดใหญ่แสดง 3 วินาทีสุดท้าย ช่วยให้เร่งสปีดหรือเตรียมพร้อมได้ทัน
* **ปุ่มควบคุมง่าย:** เริ่ม/หยุดชั่วคราว/ทำต่อ (Play/Pause/Resume), รีเซ็ต (Reset), ปิด/เปิดเสียง (Mute/Unmute)
* **Responsive Design:** ใช้งานได้ดีบนหลากหลายขนาดหน้าจอ (คอมพิวเตอร์, แท็บเล็ต, มือถือ)
* **แยก Logic ชัดเจน:** ใช้ Custom Hook (`use-workout-timer`) จัดการสถานะและ Logic ทำให้โค้ด UI สะอาดตา

## 🚀 เทคโนโลยีที่ใช้

* **Next.js:** React Framework for Production
* **React:** JavaScript library for building user interfaces
* **TypeScript:** Typed superset of JavaScript
* **Tailwind CSS:** Utility-first CSS framework
* **Shadcn/ui:** UI components built using Radix UI and Tailwind CSS

## 🔧 การติดตั้งและใช้งาน (สำหรับ Developer)

หากต้องการรันโปรเจกต์นี้บนเครื่องของคุณ:

1. **Clone Repository:**
   ```bash
   git clone https://github.com/mengsokool/7-minute-abs-conquest
   cd 7-minute-abs-conquest
   ```
2. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   # หรือถ้าใช้ yarn
   # yarn install
   ```
3. **เตรียมไฟล์เสียง:** ตรวจสอบให้แน่ใจว่าคุณมีไฟล์เสียง `count.mp3`, `start.mp3`, และ `go-rest.mp3` อยู่ในโฟลเดอร์ `public/` ของโปรเจกต์
4. **รัน Development Server:**
   ```bash
   npm run dev
   # หรือถ้าใช้ yarn
   # yarn dev
   ```
5. เปิด Browser ไปที่ `http://localhost:3000` (หรือ Port ที่แสดงใน Terminal)

## 🖥️ วิธีใช้งาน (สำหรับ User)

1. เปิดหน้าเว็บแอปพลิเคชัน
2. หน้าจอจะแสดงสถานะ "พร้อมเริ่ม" และท่าออกกำลังกายแรก
3. กดปุ่ม **"เริ่ม"** (ไอคอน Play) เพื่อเริ่มจับเวลา
4. ทำตามท่าออกกำลังกายที่แสดงบนหน้าจอจนกว่าเวลา "ออกกำลังกาย" จะหมด
5. เมื่อเข้าสู่ช่วง "พัก" หรือ "พักระหว่างเซ็ต" ให้เตรียมพร้อมสำหรับท่าถัดไป
6. ทำซ้ำจนครบทุกท่าและทุกเซ็ต
7. **ปุ่มควบคุมอื่นๆ:**
   * **"หยุด"** (ไอคอน Pause): หยุดเวลาชั่วคราว กดอีกครั้ง (ไอคอน Play) เพื่อ "ทำต่อ"
   * **"รีเซ็ต"** (ไอคอน RotateCcw): เริ่มต้นโปรแกรมใหม่ทั้งหมด
   * **ไอคอนลำโพง:** กดเพื่อปิด/เปิดเสียงแจ้งเตือน

## 📂 โครงสร้างโปรเจกต์ (เบื้องต้น)

* **`hooks/use-workout-timer.ts`:** Custom Hook ที่เก็บ Business Logic ทั้งหมด (State, Timer, Controls, Calculations)
* **`app/page.tsx` (หรือไฟล์ Component หลัก):** UI Component ที่เรียกใช้ `use-workout-timer` และแสดงผลข้อมูลต่างๆ
* **`components/ui/`:** UI Components จาก Shadcn/ui
* **`public/`:** โฟลเดอร์สำหรับเก็บไฟล์สาธารณะ เช่น ไฟล์เสียง (`.mp3`)

## 🙏 พัฒนาโดย

* **เหม่ง (พัชรพล ศรีดา)** - ผู้พัฒนาหลัก
