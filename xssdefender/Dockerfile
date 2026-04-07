# Minimal ve güvenli bir base image
FROM node:18-alpine

# Defense in Depth: Uygulamayı root yetkisiyle ÇALIŞTIRMAMA kuralı
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Çalışma dizinini ayarla
WORKDIR /usr/src/app

# Önce sadece paket dosyalarını kopyala (Cache optimizasyonu)
COPY package*.json ./

# Sadece production bağımlılıklarını kur
RUN npm install --only=production

# Kaynak kodları kopyala
COPY . .

# Yetkileri güvenli kullanıcıya devret
RUN chown -R appuser:appgroup /usr/src/app

# Root olmayan kullanıcıya geçiş yap (Kritik Güvenlik Adımı!)
USER appuser

EXPOSE 3000

CMD ["npm", "start"]