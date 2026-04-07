# 🔍 Tehdit Modellemesi ve Mimari Analiz (Threat Modeling)

Bu doküman, repodaki projelerin varsayılan saldırı vektörlerini ve alınan savunma önlemlerini detaylandırır.

## 1. XSS Defender Saldırı Vektörü
- **Tehdit:** Kötü niyetli bir kullanıcının yorum kısmına `<script>alert(document.cookie)</script>` enjekte ederek diğer kullanıcıların oturumlarını çalması (Stored XSS).
- **Savunma:** İstemci tarafında `DOM manipulation` kısıtlaması ve sunucu tarafında gelen verilerin veritabanına işlenmeden önce özel `xssSanitizerMiddleware` ile HTML Entity karşılıklarına (`&lt;` ve `&gt;`) dönüştürülmesi.
- **Ek Güvenlik:** `Helmet.js` ile HTTP güvenlik başlıklarının zorlanması.

## 2. Container Privilege Escalation (Docker Zafiyeti)
- **Tehdit:** İhlal edilen bir Docker konteynerinden ana makineye (Host) sızılması (Container Breakout).
- **Savunma:** Dockerfile içerisinde `USER appuser` tanımlanarak uygulamanın root haklarından mahrum bırakılması sağlanmıştır.