const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

// --- BACKEND SANITIZATION (ENTITY ESCAPING) FONKSİYONU ---
// Kurşun geçirmez zırhımız: Tehlikeli karakterleri zararsız HTML kodlarına dönüştürür
function escapeHtml(unsafeString) {
    if (!unsafeString) return "";
    return unsafeString
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

app.get('/', (req, res) => {
    res.send(`
        <html>
        <head><title>Kayıt Formu</title></head>
        <body style="font-family: Arial; margin: 40px;">
            <h2>Kullanıcı Yorum Formu (Tam Korumalı)</h2>
            <form id="commentForm">
                <input type="text" id="userInput" name="comment" placeholder="Yorumunuzu yazın..." style="width: 300px; padding: 5px;">
                <button type="submit" style="padding: 5px 15px;">Gönder</button>
            </form>

            <script>
                // 1. KATMAN: Frontend Zırhı
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

// 2. KATMAN: Backend Zırhı (Asıl Güvenlik Duvarı)
app.post('/submit', (req, res) => {
    const rawComment = req.body.comment;
    
    // Gelen veriyi ekrana basmadan veya veritabanına kaydetmeden ÖNCE temizliyoruz!
    const safeComment = escapeHtml(rawComment);
    
    console.log("Backend'e Ulaşan Ham Veri:", rawComment);
    console.log("Ekrana Basılan Güvenli Veri:", safeComment);

    res.send(`
        <h3 style="color: green;">Yorumunuz güvenle eklendi:</h3>
        <div style="border: 1px solid #ccc; padding: 10px; width: 300px;">
            ${safeComment}
        </div>
        <br>
        <a href="/">Geri Dön</a>
    `);
});

app.listen(3000, () => {
    console.log('Tam Korumalı Sunucu http://localhost:3000 adresinde çalışıyor...');
});