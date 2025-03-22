# AI Chat Text Direction Fixer

A Chrome extension that automatically applies correct text direction (RTL/LTR) for Persian and Arabic text in various AI chat platforms.

<div dir="rtl">
افزونه کروم که به صورت خودکار جهت صحیح متن (RTL/LTR) را برای متن فارسی و عربی در پلتفرم‌های مختلف چت هوش مصنوعی اعمال می‌کند.
</div>

## Features / ویژگی‌ها

- Automatically detects Persian/Arabic text and applies RTL direction
- Fixes text alignment and direction for all text elements
- Applies RTL direction to input fields when typing in Persian/Arabic
- Works in real-time as you type
- Supports ordered and unordered lists with proper RTL formatting
- Special handling for headers, paragraphs, and list elements
- Remembers your preferences (enabled/disabled state)

<div dir="rtl">
- تشخیص خودکار متن فارسی/عربی و اعمال جهت راست به چپ
- تصحیح تراز و جهت متن برای تمام عناصر متنی
- اعمال جهت راست به چپ برای فیلدهای ورودی هنگام تایپ به فارسی/عربی
- عملکرد آنی و همزمان با تایپ
- پشتیبانی از لیست‌های مرتب و نامرتب با قالب‌بندی مناسب RTL
- مدیریت ویژه برای سرتیترها، پاراگراف‌ها و عناصر لیست
- به خاطر سپردن تنظیمات شما (وضعیت فعال/غیرفعال)
</div>

## Supported Platforms / پلتفرم‌های پشتیبانی شده

- ChatGPT (chat.openai.com)
- DeepSeek Chat
- Perplexity.ai
- X.com/i/grok
- Grok.com/chat
- Google AI Studio (aistudio.google.com/live)
- Claude.ai
- Qwen (chat.qwenlm.ai)

## Installation / نصب

### English

1. **Download the Repository**:
   - Click the green "Code" button above and select "Download ZIP"
   - Extract the ZIP file to a folder on your computer

2. **Install in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right corner)
   - Click "Load unpacked" and select the extracted folder
   - The extension is now installed and active!
   - Pin the extension for easy access

3. **How to Use**:
   - The extension works automatically on supported AI chat platforms
   - When you type in Persian, text will automatically align right-to-left
   - When you type in English, text will automatically align left-to-right
   - You can toggle the extension on/off by clicking the extension icon

<div dir="rtl">
### فارسی

1. **دانلود مخزن**:
   - روی دکمه سبز "Code" در بالا کلیک کنید و گزینه "Download ZIP" را انتخاب کنید
   - فایل ZIP را در یک پوشه در کامپیوتر خود استخراج کنید

2. **نصب در کروم**:
   - کروم را باز کنید و به آدرس `chrome://extensions/` بروید
   - حالت "Developer mode" را فعال کنید (دکمه در گوشه بالا سمت راست)
   - روی "Load unpacked" کلیک کنید و پوشه استخراج شده را انتخاب کنید
   - افزونه اکنون نصب شده و فعال است!
   - افزونه را برای دسترسی آسان پین کنید

3. **نحوه استفاده**:
   - افزونه به طور خودکار در پلتفرم‌های چت هوش مصنوعی پشتیبانی شده کار می‌کند
   - وقتی به فارسی تایپ می‌کنید، متن به طور خودکار از راست به چپ تراز می‌شود
   - وقتی به انگلیسی تایپ می‌کنید، متن به طور خودکار از چپ به راست تراز می‌شود
   - می‌توانید با کلیک روی آیکون افزونه، آن را روشن/خاموش کنید
</div>

## How It Works / نحوه کارکرد

The extension uses JavaScript to:

1. Detect Persian/Arabic text using Unicode character ranges
2. Apply RTL direction and right alignment to text containers
3. Set input fields to RTL when Persian/Arabic text is detected
4. Observe dynamic content changes and apply direction fixes in real-time
5. Handle special cases like lists, headers, and nested elements

<div dir="rtl">
این افزونه از جاوااسکریپت برای موارد زیر استفاده می‌کند:

1. تشخیص متن فارسی/عربی با استفاده از محدوده کاراکترهای یونیکد
2. اعمال جهت RTL و تراز راست برای ظروف متنی
3. تنظیم فیلدهای ورودی به RTL هنگام تشخیص متن فارسی/عربی
4. نظارت بر تغییرات محتوای پویا و اعمال اصلاحات جهت در زمان واقعی
5. مدیریت موارد خاص مانند لیست‌ها، سرتیترها و عناصر تودرتو
</div>

## Screenshots / تصاویر

![Image of the extension in action](https://github.com/user-attachments/assets/e8744e95-50a6-4227-8db5-dba420b1473c)

## Contributing / مشارکت

Contributions are welcome! Feel free to submit issues or pull requests to improve the extension.

<div dir="rtl">
از مشارکت‌ها استقبال می‌شود! لطفاً برای بهبود افزونه، مشکلات را گزارش دهید یا درخواست‌های pull ارسال کنید.
</div>

## License / مجوز

This project is licensed under the MIT License.

<div dir="rtl">
این پروژه تحت مجوز MIT منتشر شده است.
</div>


![Image](https://github.com/user-attachments/assets/e8744e95-50a6-4227-8db5-dba420b1473c)


این افزونه کروم به شما کمک می‌کنه تا جهت متن‌های فارسی و انگلیسی رو به‌صورت خودکار توی Deepseek تنظیم کنید. برای مثال، وقتی متن فارسی دارید، به‌طور خودکار راست‌چین میشه و وقتی متن انگلیسی دارید، چپ‌چین میشه ، همچنین توی چت باکس DeepSeek وقتی فارسی مینویسید از راست به چپ مینویسه!

---
## ویژگی‌ها
- شناسایی متن فارسی و انگلیسی و مرتب کردنشون
- تنظیم خودکار جهت متن به `rtl` یا `ltr` چه در چت باکس چه در پاسخ های DeepSeek

---

## نحوه نصب
وارد صفحه Extensions در کروم بشید:

chrome://extensions/

گزینه Developer mode رو روشن کنید.

روی Load unpacked کلیک کنید و پوشه پروژه رو انتخاب کنید.

پیشنهاد میکنم حتما اکستنشن رو پین کنید!

افزونه نصب شد و آماده استفاده است!

نحوه استفاده این افزونه به‌صورت خودکار روی صفحه‌ پشتیبانی‌شده کار می‌کنه و جهت متن رو بر اساس زبان تنظیم می‌کنه.
