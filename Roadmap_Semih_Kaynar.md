# 🚀 Akademik Proje Yol Haritası: Güvenlik ve Tersine Mühendislik

Bu dosya, iki ayrı ders kapsamında yürütülecek olan üç bağımsız projenin uygulama adımlarını ve kritik analiz noktalarını içermektedir.

---

## 🏗️ PROJE 1: Ollama Yerel LLM Altyapı Analizi (Zorunlu Kısımlar)
*Hedef: Modern bir altyapının kurulum, izolasyon, CI/CD, Docker ve kod akış güvenliğini test etmek.*

### Adım 1: Kurulum ve `install.sh` Analizi (Reverse Engineering)
- **Görev:** Kurulum scriptinin dizin oluşturma, yetki isteme ve dosya taşıma süreçlerini raporlamak.
- **Kritik Soru:** Dış kaynaklı paketlerde imza (hash) kontrolü var mı, yoksa `curl | bash` ile körü körüne mi çalışıyor?

### Adım 2: İzolasyon ve İz Bırakmadan Temizlik (Forensics)
- **Görev:** Aracın sistemden (VM ortamında) tamamen kaldırılması.
- **Kritik Soru:** Kayıtlar (log), portlar ve arka plan servislerinin tamamen silindiği nasıl ispatlanır?

### Adım 3: İş Akışları ve CI/CD Pipeline Analizi (.github/workflows)
- **Görev:** Repodaki bir CI/CD paketini seçip adım adım (test, build, deploy) incelemek.
- **Kritik Soru:** Webhook mekanizması bu projede otomasyonu nasıl tetikliyor?

### Adım 4: Docker Mimarisi ve Konteyner Güvenliği
- **Görev:** Docker imaj katmanlarını ve Compose dosyalarını incelemek.
- **Kritik Soru:** Konteyner sistem kaynaklarına ne kadar erişebiliyor? İzolasyonu artırmak için Kubernetes veya VM farkı nasıl kullanılır?

### Adım 5: Kaynak Kod ve Tehdit Modelleme (Threat Modeling)
- **Görev:** Entrypoint ve Auth (Kimlik Doğrulama) mekanizmalarını tespit etmek.
- **Kritik Soru:** Bir saldırgan kaynak kodu inceleyerek hangi verilere (token, api key vb.) ulaşabilir?

---

## 🛡️ PROJE 2: Güvenli Web Yazılımı Geliştirme (Bağımsız Proje)
**Konu: 5. Form Saldırısı (XSS Koruyucusu)**

- **Amacı:** Kullanıcıdan gelen zararlı Javascript kodlarının (XSS) tarayıcıda çalışmasını engellemek.
- **Uygulama Adımları:**
    1. Frontend tarafında `Input Sanitization` (Girdi Temizleme) entegre edilecek.
    2. Backend tarafında `Entity Escaping` (Karakter Dönüştürme) yapılacak.
- **Teknik Detay:** `<` ve `>` gibi tehlikeli karakterlerin `&lt;` ve `&gt;` gibi zararsız HTML karakterlerine dönüştürülmesi sağlanacak.

---

## 🔍 PROJE 3: Tersine Mühendislik (Bağımsız Proje)
**Konu: 8. String Çıkarıcı (String Extractor)**

- **Amacı:** Bir binary (ikili) dosya içindeki düz metinleri tarayarak hassas bilgileri sızdırmak.
- **Uygulama Adımları:**
    1. Hedef dosyanın bayt bayt taranması.
    2. Regex tabanlı analizci ile "API_KEY", "PASSWORD", "URL" gibi anahtar kelimelerin yakalanması.
- **Araç Kutusu:** `goblin` veya özel geliştirilmiş Python/C++ scripti.
- **Senaryo:** Zararlı yazılımların C2 (Komuta Kontrol) sunucu adreslerini deşifre etmek.

---

## 📅 Takvim ve Teslimat
1. **Hafta 1-2:** Ollama 5 Adım Teknik Analiz Raporu.
2. **Hafta 3:** XSS Koruyucu Modül Geliştirme.
3. **Hafta 4:** String Çıkarıcı Tool ve Analiz Sonuçları.