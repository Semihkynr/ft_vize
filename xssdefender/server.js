const express = require('express');
const helmet = require('helmet'); // Defense in Depth katmanı eklendi

const app = express();

// 1. KATMAN: HTTP Header Güvenliği (Sniffing ve XSS sömürüsünü zorlaştırır)
app.use(helmet()); 
app.use(express.urlencoded({ extended: true }));

/**
 * Entity Escaping Middleware
 * Gelen verideki tehlikeli karakterleri HTML Entity karşılıklarına dönüştürür.
 */
const xssSanitizerMiddleware = (req, res, next) => {
    if (req.body && req.body.comment) {
        req.body.comment = req.body.comment
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    next();
};

// --- ROUTELAR ---

app.get('/', (req, res) => {
    // Gerçek bir senaryoda bu yapı res.sendFile() ile ayrı bir .html dosyasından sunulmalıdır.
    res.send(`
        <html>
        <head><title>ISU-Sec Kayıt Formu</title></head>
        <body style="font-family: Arial; margin: 40px;">
            <h2>Kullanıcı Yorum Formu (Çift Katmanlı Koruma)</h2>
            <form id="commentForm">
                <input type="text" id="userInput" name="comment" placeholder="Yorumunuzu yazın..." style="width: 300px; padding: 5px;">
                <button type="submit" style="padding: 5px 15px;">Gönder</button>
            </form>
            <script>
                // DOM Tabanlı İstemci Koruması (innerText kullanımı)
                document.getElementById('commentForm').addEventListener('submit', function(e) {
                    e.preventDefault();
                    let rawInput = document.getElementById('userInput').value;
                    let div = document.createElement('div');
                    div.innerText = rawInput; 
                    let sanitizedInput = div.innerHTML;

                    fetch('/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: 'comment=' + encodeURIComponent(sanitizedInput)
                    }).then(response => response.text())
                      .then(html => { document.body.innerHTML = html; });
                });
            </script>
        </body>
        </html>
    `);
});

// 2. KATMAN: Backend XSS Temizliği (Middleware Devrede)
app.post('/submit', xssSanitizerMiddleware, (req, res) => {
    const safeComment = req.body.comment; // Middleware tarafından temizlendi
    
    console.log("[LOG] Ekrana Basılan Güvenli Veri:", safeComment);

    res.send(`
        <h3 style="color: green;">Yorumunuz güvenle eklendi:</h3>
        <div style="border: 1px solid #ccc; padding: 10px; width: 300px; background-color: #f9f9f9;">
            ${safeComment}
        </div>
        <br><a href="/">Geri Dön</a>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[INFO] ISU-Sec Sunucusu port${PORT} üzerinde aktif.`);
});