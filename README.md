<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/tr/b/b2/%C4%B0stinye_%C3%9Cniversitesi_logo.png" width="200" alt="İstinye Üniversitesi">
  
  <h1>ISU-Sec: Reverse Engineering & Defensive Coding</h1>

  <p>
    <img src="https://img.shields.io/badge/Status-Completed-brightgreen?style=flat-square" alt="Status">
    <img src="https://img.shields.io/badge/Security-Audited-blue?style=flat-square" alt="Security">
    <img src="https://img.shields.io/badge/Course-ISU--Sec-orange?style=flat-square" alt="Course">
    <img src="https://img.shields.io/badge/Docker-Isolated-blue?style=flat-square" alt="Docker">
  </p>
</div>

## 📖 İçindekiler
1. [🎓 Akademik Bilgiler](#-akademik-bilgiler)
2. [🚀 Proje ve Mimari Özeti](#-proje-ve-mimari-özeti)
3. [🛡️ Güvenlik Disiplinleri (Defense in Depth)](#️-güvenlik-disiplinleri-defense-in-depth)
4. [📁 Klasör Yapısı ve Dokümantasyon](#-klasör-yapısı-ve-dokümantasyon)

## 🎓 Akademik Bilgiler
- **Üniversite:** İstinye Üniversitesi
- **Bölüm/Ders:** Tersine Mühendislik (Bahar 2026)
- **Eğitmen ve Danışman:** Keyvan Arasteh
- **Geliştirici:** Semih Kaynar

## 🚀 Proje ve Mimari Özeti
Bu repo, iki bağımsız siber güvenlik projesini barındırır. Monolitik yapıdan kaçınılarak modüler bir mimari benimsenmiştir.

* **1. XSS Defender (Defensive Coding):** Node.js ve Express.js tabanlı, Cross-Site Scripting (XSS) saldırılarını çift katmanlı (Frontend innerText + Backend Entity Escaping Middleware) ile engelleyen güvenli form uygulaması.
* **2. Binary String Extractor (Reverse Engineering):** Statik malware analizi için geliştirilmiş, şüpheli ikili dosyalardaki (binary) Hardcoded API anahtarlarını, C2 bağlantılarını ve şifreleri regex tabanlı bayt taramasıyla deşifre eden Python aracıdır.

## 🛡️ Güvenlik Disiplinleri (Defense in Depth)
* **Temiz Repo (Clean Slate):** `.gitignore` ile yapılandırma dosyaları, `.env` sırları ve derlenmiş binary'ler repodan izole edilmiştir.
* **Konteyner İzolasyonu:** Uygulama `Dockerfile` içerisinde `root` olmayan özel `appuser` yetkileriyle çalıştırılarak Container Breakout zafiyetleri önlenmiştir.
* **Sürekli Güvenlik (CI/CD):** `.github/workflows` entegrasyonu ile otomatik NPM audit ve Python Syntax denetimleri aktiftir.

## 📁 Klasör Yapısı ve Dokümantasyon
Daha fazla teknik detay, tehdit modellemesi ve çalışma mantığı için lütfen `docs/` klasörüne göz atın.