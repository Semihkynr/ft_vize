cat << 'EOF' > PROJE_3_EXTRACTOR_RAPORU.md
# 🔍 PROJE : Binary Analizi ve Hassas Veri Sızıntısı Tespiti (String Extractor)

**Tarih:** Nisan 2026  
**Konu:** Statik Binary Analizi ve Gizli Veri Çıkarımı  
**Metodoloji:** Bayt Seviyesinde Tarama, Regex Analizi, Tersine Mühendislik (Statik)  
**Araçlar:** Python 3, Custom Extractor Script, Binary Simulation  

---

## 📑 Yönetici Özeti
Bu çalışmada, derlenmiş bir ikili (binary) dosya içerisinde yer alan, insan tarafından okunabilen gizli metinlerin otomatik olarak tespit edilmesi ve sızdırılması hedeflenmiştir. Gerçek senaryolarda zararlı yazılımların (malware) içine gömülmüş C2 (Komuta Kontrol) sunucularını ve API anahtarlarını deşifre etmek için kullanılan "String Extraction" tekniği uygulanmıştır.

---

## 🚨 AŞAMA 1: Şüpheli Binary Simülasyonu

Analiz için, içerisinde hem makine kodları (okunamaz baytlar) hem de kritik "Hardcoded" (kod içine gömülmüş) sırlar barındıran bir test dosyası (`suspect_app`) üretilmiştir.

*   **Gizlenen Veriler:**
    *   Yönetici seviyesinde bir **API Anahtarı**.
    *   Zararlı yazılımın veri sızdıracağı bir **C2 Sunucu Adresi (URL)**.
    *   Statik olarak tanımlanmış bir **Sistem Parolası**.

---

## ⚙️ AŞAMA 2: Analiz Aracının Geliştirilmesi (The Extractor)

Geliştirilen Python tabanlı araç, hedef dosyayı bayt dizisi (byte array) olarak belleğe yükler ve iki aşamalı bir filtreleme yapar:

1.  **ASCII Tarama:** Dosya içindeki en az 4 karakter uzunluğundaki tüm okunabilir (printable) karakter dizileri yakalanır. Bu işlem, binlerce anlamsız bayt arasından anlamlı veriyi ayırır.
2.  **Regex Analizi:** Yakalanan diziler arasından spesifik paternler (RegEx) kullanılarak hassas bilgiler süzülür.

**Kullanılan Regex Paternleri:**
*   `API_KEY=[\w-]+` ➔ API anahtarlarını yakalar.
*   `https?://[\w./-]+` ➔ Web adreslerini ve C2 noktalarını tespit eder.
*   `PASSWORD=[\w!@#$%^&*]+` ➔ Parola tanımlamalarını deşifre eder.

---

## 🔬 AŞAMA 3: Analiz Sonuçları ve Deşifre

Yazılan `extractor.py` aracı `suspect_app` üzerinde koşturulduğunda, makine kodlarının arasından şu kritik bilgiler başarıyla çıkarılmıştır:

*   **[+] API KEY:** `sk-778899-admin-key-2026`
*   **[+] URL/C2:** `https://hacker-c2-server.com/collect`
*   **[+] PASSWORD:** `Admin12345!`

---

## 🏁 Teknik Değerlendirme ve Korunma
Bu analiz, kod geliştirirken hassas verilerin asla düz metin (plain-text) olarak kaynak koda gömülmemesi gerektiğini kanıtlamıştır.

**Güvenlik Önerileri:**
1.  **Obfuscation (Kod Karmaşıklaştırma):** String veriler binary içinde şifrelenmiş veya parçalanmış olarak saklanmalıdır.
2.  **Environment Variables:** Hassas anahtarlar kod içinde değil, çalışma ortamı değişkenlerinde tutulmalıdır.
3.  **Entropy Analysis:** Analiz araçlarına karşı direnç artırmak için dosya sıkıştırılmalı veya paketlenmelidir (Packer kullanımı).