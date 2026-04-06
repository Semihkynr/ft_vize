# 🛡️ PROJE : Güvenli Web Yazılımı Geliştirme ve XSS Defans Mimarisi

**Tarih:** Nisan 2026
**Konu:** Cross-Site Scripting (XSS) Zafiyet Analizi ve Giderilmesi (Remediation)
**Metodoloji:** Derinlemesine Savunma (Defense in Depth), Input Sanitization, Entity Escaping
**Teknoloji Stack'i:** Node.js, Express.js, Vanilla JS, HTML5

---

## 📑 Yönetici Özeti
Bu çalışmada, web uygulamalarındaki en kritik ve yaygın zafiyetlerden biri olan XSS (Cross-Site Scripting) saldırısı simüle edilmiştir. Zafiyetin varlığı PoC (Kavram Kanıtı) ile kanıtlandıktan sonra, sistemi korumak için "İstemci (Frontend)" ve "Sunucu (Backend)" olmak üzere iki farklı katmanda güvenlik zırhı geliştirilmiştir.

---

## 🚨 AŞAMA 1: Zafiyet Simülasyonu ve PoC (Kavram Kanıtı)

İlk aşamada Node.js ve Express.js kullanılarak kasıtlı olarak zafiyetli bir "Kullanıcı Yorum Formu" oluşturulmuştur.

* **Zafiyetin Nedeni:** Form üzerinden kullanıcıdan alınan POST verisi, hiçbir güvenlik filtresinden (escaping/sanitization) geçirilmeden doğrudan DOM içerisine, yani HTML'in ortasına yerleştirilmektedir.
* **Sömürü (Exploitation):** Yorum kutusuna standart bir metin yerine aşağıdaki zararlı JavaScript (Payload) kodu girilmiştir:
  ```html
  <script>alert('Sistem Hacklendi! Çerezleriniz çalındı: ' + document.cookie);</script>
Sonuç: Tarayıcı, gelen veriyi bir yorum metni olarak değil, doğrudan çalıştırılabilir bir betik (script) olarak algılamış ve kodu execute etmiştir. Sistemin XSS saldırılarına karşı tamamen savunmasız olduğu ispatlanmıştır.

## 🛡️ AŞAMA 2: Frontend Katmanı (Input Sanitization)
Saldırıyı engellemek için kurulan ilk savunma hattı tarayıcı (Client-side) seviyesindedir.

Teknik Uygulama (Girdi Temizleme): Kullanıcı "Gönder" butonuna bastığında olay Javascript ile yakalanır (e.preventDefault()). Kullanıcının girdiği ham veri sanal bir HTML elementi olan div.innerText içerisine atanır. Bu DOM özelliği, içerikteki zararlı HTML etiketlerini otomatik olarak nötralize ederek düz metne (plain text) çevirir. Temizlenen veri sonrasında fetch API ile sunucuya iletilir.

Mimari Uyarı (Bypass Riski): Frontend koruması faydalı bir filtre olsa da, bir saldırgan Postman, cURL veya Burp Suite gibi araçlarla tarayıcıyı tamamen es geçerek doğrudan Backend'e zararlı istek (Request) atabilir. Bu nedenle Frontend güvenliği tek başına yetersizdir.

## 🧱 AŞAMA 3: Backend Katmanı (Entity Escaping - Altın Standart)

Frontend'in atlatılma riskine karşılık, sistemin asıl kurşun geçirmez zırhı Sunucu (Server-side) seviyesinde inşa edilmiştir.

### 🔧 Teknik Uygulama (Karakter Dönüştürme)

İstemciden Backend'e ulaşan veri, ekrana basılmadan veya veritabanına yazılmadan hemen önce `escapeHtml` fonksiyonu ile işlenir. Bu fonksiyon, Regex (Düzenli İfadeler) kullanarak HTML parser'ı manipüle edebilecek kritik karakterleri zararsız **HTML Entity** karşılıklarına dönüştürür.

### 🔄 Dönüşüm Tablosu

- `<` işareti → `&lt;`
- `>` işareti → `&gt;`
- `&` işareti → `&amp;`
- `"` işareti → `&quot;`
- `'` işareti → `&#039;`

### 🛡️ Geliştirilen Güvenlik Yaması (Remediation Code)

```javascript
function escapeHtml(unsafeString) {
    if (!unsafeString) return "";

    return unsafeString
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Güvenli Endpoint
app.post('/submit', (req, res) => {
    const rawComment = req.body.comment;
    const safeComment = escapeHtml(rawComment); // Asıl Güvenlik Duvarı
    // ...
});
Sonuç: Saldırgan tarayıcıyı atlatıp Backend'e doğrudan script etiketi yollasa bile, sistem bunu &lt;script&gt; olarak işler. Tarayıcı bu kodu çalıştıramaz, sadece ekranda zararsız bir şekilde görüntüler.
``` 
## 🏁 Değerlendirme ve Sonuç
Web güvenliğinde "İstemciye Asla Güvenme" (Never Trust the Client) kuralı esastır. Bu projede uygulanan çift katmanlı mimari sayesinde, XSS saldırı vektörü hem kullanıcı tarafında filtrelenmiş hem de sunucu tarafında kesin olarak bloklanmıştır.
