# Yamamo Shop — เว็บไซต์ร้านค้า Roblox และบริการภายในเกม

<p align="center">
  <a href="https://jiraphatsrajan.github.io/Yamamo-Shop/"><strong>เปิดดู Yamamo Shop Live Preview →</strong></a>
</p>

> เว็บไซต์ร้านค้าดิจิทัลสำหรับสินค้าและบริการที่เกี่ยวข้องกับ Roblox ออกแบบให้ผู้ใช้สามารถค้นหาสินค้า เลือกหมวดหมู่ เพิ่มสินค้าลงตะกร้า ทดลองขั้นตอน Checkout และตรวจสอบสถานะคำสั่งซื้อได้ในรูปแบบ Web Application

- **Repository:**[JiraphatSrajan/Yamamo-Shop](https://github.com/JiraphatSrajan/Yamamo-Shop)
- **แพลตฟอร์ม:**Responsive Web Application
- **สถานะ:**Portfolio Demo / Public Preview
- **Live Preview:**[jiraphatsrajan.github.io/Yamamo-Shop](https://jiraphatsrajan.github.io/Yamamo-Shop/)

## Project Overview

Yamamo Shop เป็นโปรเจกต์เว็บไซต์ร้านค้าออนไลน์ที่พัฒนาขึ้นเพื่อฝึกและแสดงทักษะด้าน Web Development และ UX/UI Design โดยจำลองระบบร้านค้าสำหรับสินค้าและบริการภายในเกม Roblox

เว็บไซต์รองรับสินค้าและบริการหลายประเภท เช่น Robux, Roblox Toy Code, Gamepass และบริการรับฟาร์มในเกม พร้อมระบบค้นหา กรองหมวดหมู่ เรียงสินค้า ตะกร้าสินค้า Checkout Demo ระบบติดตามสถานะคำสั่งซื้อ และหน้าเติมเงินแบบ Demo

แนวคิดหลักของโปรเจกต์คือการออกแบบ User Flow ตั้งแต่การเลือกสินค้าไปจนถึงการชำระเงินและติดตามออเดอร์ โดยเน้นให้หน้าตาเว็บไซต์ใช้งานง่าย รองรับทั้ง Desktop และ Mobile และมี Animation เพื่อเพิ่มประสบการณ์ในการใช้งาน

## ระบบหลัก

### Product Catalog

- แสดงรายการสินค้าและบริการหลายหมวดหมู่
- ค้นหาสินค้าจากชื่อหรือรายละเอียด
- กรองสินค้าตามประเภท เช่น Toy Code, Gamepass, Robux และ Farming Service
- เรียงสินค้าตามราคา
- แสดงสถานะสินค้า เช่น **Sold Out**และ **Coming Soon**
- รองรับหมวดหมู่แบบหลายชั้น เช่น **Farming Service → Fisch → รายการบริการ**

### Shopping Cart

- เพิ่มสินค้าเข้าตะกร้า
- เพิ่มหรือลดจำนวนสินค้า
- ลบสินค้าออกจากตะกร้า
- คำนวณยอดรวมแบบอัตโนมัติ
- บันทึกข้อมูลตะกร้าด้วย LocalStorage

### Checkout Demo

- ตรวจสอบรายการสินค้าก่อนชำระเงิน
- เลือกช่องทางชำระเงินแบบ Demo
  - QR Code
  - ซองอั่งเปา
  - TrueMoney Wallet
- สร้างเลขคำสั่งซื้อจำลอง
- แสดงยอดรวมและข้อมูลคำสั่งซื้อ

> ระบบ Checkout และ Payment เป็น Demo สำหรับ Portfolio เท่านั้น และยังไม่มีการเชื่อมต่อ Payment Gateway หรือรับเงินจริง

### Order Status

- ค้นหาสถานะด้วยเลขคำสั่งซื้อ
- แสดงขั้นตอนของออเดอร์
  1. รับคำสั่งซื้อ
  2. ตรวจสอบการชำระเงิน
  3. กำลังดำเนินการ
  4. เสร็จสิ้น
- แสดงรายการสินค้าและยอดรวมของแต่ละออเดอร์
- มีระบบจำลองการเปลี่ยนสถานะเพื่อสาธิต User Flow

### Account UI

- หน้าเข้าสู่ระบบ
- หน้าสมัครสมาชิก
- ลืมรหัสผ่านแบบ Demo
- Login / Register เป็น UI Flow สำหรับสาธิตเท่านั้น ยังไม่มี Backend Authentication จริง

### Top Up Demo

- หน้าเติมเงินแยกจากหน้าหลัก
- รองรับตัวเลือก QR Code, ซองอั่งเปา และ TrueMoney Wallet
- ออกแบบเพื่อแสดงขั้นตอนและหน้าตาของระบบเติมเงิน

### Responsive Design

- รองรับ Desktop
- รองรับ Tablet
- รองรับ Mobile
- Navigation ปรับรูปแบบตามขนาดหน้าจอ
- Product Grid และ Modal ปรับตามพื้นที่แสดงผล

## User Flow

1. ผู้ใช้เปิดหน้า Yamamo Shop
2. เลือกหมวดหมู่หรือค้นหาสินค้าที่ต้องการ
3. เปิดดูรายการสินค้าและบริการ
4. เพิ่มสินค้าลงตะกร้า
5. ตรวจสอบจำนวนและยอดรวม
6. ไปยัง Checkout Demo
7. เลือกช่องทางชำระเงิน
8. ระบบสร้างเลขคำสั่งซื้อจำลอง
9. ผู้ใช้สามารถนำเลขออเดอร์ไปตรวจสอบในหน้า Order Status

## หลักการทำงานของระบบ

1. ข้อมูลสินค้าเก็บอยู่ใน JavaScript และนำมา Render ตามหมวดหมู่ที่ผู้ใช้เลือก
2. Search และ Filter จะคัดกรองรายการสินค้าแบบทันทีโดยไม่ต้อง Reload หน้าเว็บ
3. ตะกร้าสินค้าถูกจัดการด้วย JavaScript และบันทึกไว้ใน LocalStorage
4. Checkout Demo จะคำนวณยอดรวมจากสินค้าในตะกร้า
5. เมื่อยืนยัน Checkout ระบบจะสร้างเลข Order จำลองและบันทึกข้อมูลไว้ใน LocalStorage
6. ระบบ Order Status อ่านข้อมูลคำสั่งซื้อที่บันทึกไว้และแสดง Progress ของออเดอร์
7. Animation และ Responsive Layout ถูกควบคุมผ่าน CSS และ JavaScript

## เทคโนโลยี

| ด้าน | เทคโนโลยี |
| --- | --- |
| Frontend | HTML5, CSS3, JavaScript |
| UI / Responsive | CSS Grid, Flexbox, Media Queries |
| Data Storage | Browser LocalStorage |
| Interaction | Vanilla JavaScript |
| Deployment | GitHub Pages |
| Development | Visual Studio Code, GitHub |

## โครงสร้างโปรเจกต์

```text
Yamamo-Shop/
├── index.html        หน้าหลักของร้าน
├── topup.html        หน้าเติมเงินแบบ Demo
├── styles.css        UI, Animation และ Responsive Design
├── app.js            ข้อมูลสินค้า, Cart, Checkout และ Order Status
├── assets/           โลโก้และรูปประกอบสินค้า/บริการ
├── .github/
│   └── workflows/
│       └── pages.yml ระบบ Deploy GitHub Pages
└── README.md         รายละเอียดโปรเจกต์
```

## Live Preview

สามารถเปิดใช้งานเว็บไซต์ได้จาก:

**[Yamamo Shop Live Preview](https://jiraphatsrajan.github.io/Yamamo-Shop/)**

หน้า Preview ใช้สำหรับทดลอง UI และ User Flow ของโปรเจกต์ เช่น Product Catalog, Cart, Checkout Demo, Order Status และ Responsive Design

## ข้อจำกัดปัจจุบัน

- ระบบ Login / Register ยังไม่มี Backend จริง
- ระบบชำระเงินและเติมเงินเป็น Demo และไม่มีการรับเงินจริง
- ข้อมูล Cart และ Order ถูกจัดเก็บด้วย LocalStorage ของ Browser
- ยังไม่มี Database หรือระบบ Sync ข้ามอุปกรณ์
- สถานะ Order เป็นระบบจำลองสำหรับแสดง User Flow
- ข้อมูลสินค้าในเว็บไซต์เป็นข้อมูลตัวอย่างสำหรับ Portfolio Project

## Current Status

- พัฒนา Frontend หลักเสร็จแล้ว
- มี Product Catalog, Search, Filter และ Sort
- มีระบบ Cart และ Checkout Demo
- มีระบบ Order Status
- มีหน้า Top Up Demo
- รองรับ Responsive Design
- มี Animation และ Interactive UI
- ตั้งค่า GitHub Pages สำหรับ Public Preview แล้ว

## Developer

**Jiraphat Srajan (จิรภัทร สระจันทร์)**
