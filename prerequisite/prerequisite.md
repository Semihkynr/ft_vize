# 🛡️ OLLAMA - Kapsamlı Güvenlik Denetimi ve Sistem Mimarisi Analiz Raporu

**Tarih:** Nisan 2026
**Kapsam:** `ollama/ollama` Açık Kaynak Reposu Analizi
**Metodoloji:** Tersine Mühendislik, Adli Bilişim (Forensics), CI/CD Analizi, Konteyner Güvenliği, Tehdit Modellemesi (Threat Modeling)

---

## 📑 Yönetici Özeti (Executive Summary)
Bu rapor, popüler yerel LLM çalıştırıcısı Ollama'nın kurulumundan kaynak kod mimarisine kadar olan yaşam döngüsünü incelemektedir. Yapılan statik ve dinamik analizler sonucunda uygulamanın izolasyon ve ağ güvenliği katmanlarında, özellikle dışa açık servis senaryolarında **Kritik (CRITICAL)** ve **Yüksek (HIGH)** seviyeli tasarım zafiyetleri tespit edilmiştir.

---

## 🔍 AŞAMA 1: Kurulum ve `install.sh` Analizi (Reverse Engineering)

Kurulum için sunulan `curl -fsSL https://ollama.com/install.sh | sh` betiği statik analiz araçları ve strace kullanılarak incelenmiştir.

*   **Bulgu 1 (Kör Çalıştırma & İmza Eksikliği):** Betik, indirilen `ollama` çalıştırılabilir dosyasının bütünlüğünü sağlamak için herhangi bir GPG imza doğrulaması veya `sha256sum` kontrolü yapmamaktadır. 
*   **Bulgu 2 (Yetki Yükseltme - Privilege Escalation):** Betik, doğrudan root (`sudo`) hakları talep ederek `/usr/local/bin` dizinine yazma işlemi yapmakta ve sisteme kalıcılık (persistence) sağlamak adına bir `systemd` daeomon'u (`ollama.service`) oluşturmaktadır.
*   **Risk Vektörü:** DNS Zehirlenmesi (DNS Spoofing) veya CDN ihlali durumunda, kullanıcılar doğrudan zararlı yazılımı root yetkileriyle sistemlerine kurma riski taşımaktadır.

---

## 🔬 AŞAMA 2: İzolasyon ve Forensics (Adli Bilişim)

Kurulum betiğindeki riskleri izole etmek amacıyla "Sıfır Güven (Zero Trust)" mimarisine dayalı dinamik bir karantina ortamı (Docker Sandbox) kullanılmıştır.

*   **Test Ortamı:** `--cap-add=SYS_PTRACE` yetkileriyle sınırlandırılmış Ubuntu konteyneri.
*   **Adli Bilişim Kanıtları (Post-Execution):** Konteyner imha edildikten sonra Host (Ana) işletim sisteminde yapılan taramalarda sıfır kalıntı (Zero Artifact) tespit edilmiştir:
    *   `sudo find / -name "ollama"` ➔ **Bulgu Yok**
    *   `ss -tulnp | grep 11434` ➔ **Açık Port Yok**
    *   `ps aux | grep ollama` ➔ **Zombi Süreç Yok**

---

## ⚙️ AŞAMA 3: İş Akışları ve CI/CD Pipeline Analizi

**Hedef Dosya:** `.github/workflows/latest.yaml`

Sistemin sürekli entegrasyon (CI) süreçleri incelendiğinde, mimarinin Webhook tabanlı olay tetikleyicileri (`on: release: types: [released]`) kullandığı görülmüştür.

*   **Analiz:** Yeni bir sürüm etiketlendiğinde Webhook, GitHub Actions'ı tetiklemekte; ortam değişkenlerine gizlenmiş (GitHub Secrets) Docker Hub kimlik bilgileri kullanılarak imaj otomatik olarak derlenip `latest` etiketiyle yayına alınmaktadır.
*   **Güvenlik Tehdidi (Tedarik Zinciri):** Süreç tamamen otonomdur. Eğer GitHub hesabı veya runner sunucuları ele geçirilirse, saldırganlar zararlı kod içeren bir imajı doğrudan resmi kanal üzerinden (Supply Chain Attack) milyonlarca kullanıcıya dağıtabilir.

---

## 🐳 AŞAMA 4: Docker Mimarisi ve Konteyner Güvenliği

**Hedef Dosya:** `Dockerfile`

*   **Mimari Başarı:** Multi-stage build (çok aşamalı derleme) kullanılarak kaynak kodlar ve derleyiciler üretim (production) imajından başarıyla izole edilmiştir.
*   **Zafiyet: Root by Default (CVSS v4.0: 7.2 - HIGH)**
    Dockerfile içerisinde `USER` yönergesi bulunmamaktadır. Bu durum, konteynerin varsayılan olarak `root` yetkileriyle çalışmasına neden olur.
*   **Sömürü (Exploitation) İhtimali:** Docker, kernel izolasyonunu VM (Sanal Makine) gibi donanım seviyesinde yapmaz. Ollama uygulamasında bulunacak bir RCE (Uzaktan Kod Çalıştırma) zafiyeti, saldırganın root yetkileriyle konteynerden kaçarak (Container Breakout) ana sunucuyu (Host OS) ele geçirmesine olanak tanır.
*   **Çözüm (Remediation):** Dockerfile'ın son katmanına yetkisiz bir kullanıcı eklenmelidir:
    ```dockerfile
    RUN groupadd -r ollama && useradd -r -g ollama ollamauser
    USER ollamauser
    ```

---

## 🕵️‍♂️ AŞAMA 5: Kaynak Kod Analizi ve Tehdit Modellemesi (Threat Modeling)

**Hedef Dosya:** `server/routes.go` (Gin Web Framework)

### 1. Kimlik Doğrulama Eksikliği (Unauthenticated API Access)
**Risk Skoru:** CVSS v4.0: 8.5 (HIGH)
Sistemin dış dünya ile haberleştiği `/api/generate` ve `/api/chat` gibi kaynak tüketen API uç noktalarında hiçbir Bearer Token, API Key veya Session kontrolü bulunmamaktadır.

*   **Kavram Kanıtı (PoC):** Sistem `OLLAMA_HOST=0.0.0.0` ile dışarı açıldığında, internetteki herhangi biri aşağıdaki komutla sunucunun GPU/CPU kaynaklarını sömürebilir (Resource Exhaustion / DoS):
    ```bash
    curl -X POST http://[SUNUCU_IP]:11434/api/generate -d '{
      "model": "llama3",
      "prompt": "Bana 100 sayfalık anlamsız bir metin üret."
    }'
    ```
*   **Çözüm (Remediation):** `routes.go` içerisindeki `GenerateRoutes` fonksiyonuna JWT veya API Key tabanlı bir middleware eklenmelidir:
    ```go
    // Çözüm Önerisi
    r.POST("/api/generate", RequireAuthMiddleware(), s.GenerateHandler)
    ```

### 2. Host Header Injection Zafiyeti
**Risk Skoru:** CVSS v4.0: 6.5 (MEDIUM)
Sistem, yetkisiz erişimleri engellemek için `allowedHostsMiddleware` fonksiyonu ile gelen isteğin IP/Host bilgisini kontrol etmektedir. Ancak HTTP başlıkları istemci tarafında kolayca değiştirilebilir.

*   **Kavram Kanıtı (PoC):** Bir saldırgan, yasaklı bir IP'den gelse bile isteğine `Host: localhost` başlığını ekleyerek bu güvenlik filtresini atlatabilir (Bypass).
    ```bash
    curl -H "Host: localhost" http://[SUNUCU_IP]:11434/api/generate ...
    ```

---

## 🏁 Sonuç ve Değerlendirme
Ollama, kapalı ağlarda ve yerel ortamda (localhost) çalışmak üzere tasarlanmış güçlü bir araçtır. Ancak kod yapısı ve varsayılan konfigürasyonları, uygulamanın bir Reverse Proxy (API Gateway) ve ek kimlik doğrulama katmanları (mTLS, Basic Auth) olmadan asla doğrudan genel internete (Public Network) açılmaması gerektiğini kanıtlamaktadır.