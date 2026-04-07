# ISU-Sec: Reverse Engineering & Defensive Coding

Bu depo, İstinye Üniversitesi Bilişim Güvenliği (Bahar 2026) Tersine Mühendislik ve Güvenli Yazılım Geliştirme dersi için oluşturulmuş hibrit bir güvenlik laboratuvarıdır.

## 🏗️ Mimari ve Projeler

### 1. XSS Defender (Defensive Coding)
Node.js ve Express.js tabanlı, Cross-Site Scripting (XSS) saldırılarını çift katmanlı bir mimari ile engelleyen web modülüdür.
- **Frontend Koruması:** DOM manipülasyonunda `innerText` kullanımı.
- **Backend Koruması:** Özel `xssSanitizerMiddleware` ile Entity Escaping ve `Helmet.js` HTTP güvenlik başlıkları.
- **Çalıştırma:** `cd xssdefender && npm install && npm start`

### 2. Binary String Extractor (Reverse Engineering)
Statik malware analizi için geliştirilmiş, şüpheli ikili dosyalardaki (binary) Hardcoded API anahtarlarını, C2 bağlantılarını ve şifreleri deşifre eden araçtır.
- **Yöntem:** Regex tabanlı bayt taraması (Strings konsepti).
- **Çalıştırma:** `python3 string_extraction/extractor.py <hedef_binary_dosya>`

## 🔐 Güvenlik Disiplini (Defense in Depth)
- **Konteyner İzolasyonu:** Docker imajında `root` yetkileri düşürülmüş, özel `appuser` atanmıştır.
- **Sürekli Entegrasyon (CI/CD):** Her push/pull request işleminde `npm audit` ve Python syntax kontrolleri GitHub Actions üzerinden otomatik çalıştırılır.