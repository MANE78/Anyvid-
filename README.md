# Anyvid - Video Downloader

Anyvid is a simple web application that allows you to download videos from various websites. Just paste the video URL and get download links for different formats and qualities.

This project is configured for deployment on Netlify.

## Tech Stack

- **Backend:** Python, Flask
- **Video Processing:** `yt-dlp`
- **Frontend:** HTML, CSS, JavaScript
- **Deployment:** Netlify Serverless Functions

## How to Run Locally

To run this project locally, you'll need to have Python 3.9+ installed. It's not possible to run this project by simply executing `python app.py` because it's designed for a serverless environment. You would need a serverless emulator like `netlify-cli`.

The primary purpose of this setup is for deployment.

## Deployment on Netlify

1.  Connect your GitHub repository to Netlify.
2.  Netlify will automatically detect the `netlify.toml` file.
3.  The build command should be `pip install -r requirements.txt`.
4.  The functions directory should be `netlify/functions`.
5.  Netlify will handle the rest. The site will be deployed as a serverless function.

---
*README in Arabic as requested by the user:*

# Anyvid - تحميل الفيديوهات

هو تطبيق ويب بسيط يسمح لك بتحميل مقاطع الفيديو من مواقع مختلفة. ما عليك سوى لصق رابط الفيديو والحصول على روابط تنزيل بتنسيقات وجودات مختلفة.

.تم تهيئة هذا المشروع للنشر على منصة Netlify

## التقنيات المستخدمة

- **الواجهة الخلفية:** Python, Flask
- **معالجة الفيديو:** `yt-dlp`
- **الواجهة الأمامية:** HTML, CSS, JavaScript
- **النشر:** Netlify Serverless Functions

## التشغيل المحلي

لتشغيل هذا المشروع محليًا، ستحتاج إلى تثبيت Python 3.9+. لا يمكن تشغيل هذا المشروع ببساطة عن طريق تنفيذ `python app.py` لأنه مصمم لبيئة بدون خادم (serverless). ستحتاج إلى محاكي بيئة serverless مثل `netlify-cli`.

الغرض الأساسي من هذا الإعداد هو النشر على الإنترنت.

## النشر على Netlify

1.  اربط مستودع GitHub الخاص بك بـ Netlify.
2.  سيكتشف Netlify تلقائيًا ملف `netlify.toml`.
3.  يجب أن يكون أمر البناء هو `pip install -r requirements.txt`.
4.  يجب أن يكون مجلد الدوال هو `netlify/functions`.
5.  سيتولى Netlify الباقي. سيتم نشر الموقع كوظيفة بدون خادم.
