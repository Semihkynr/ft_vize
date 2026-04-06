import re
import sys

# Terminal Renkleri
CYAN = '\033[96m'
RED = '\033[91m'
GREEN = '\033[92m'
RESET = '\033[0m'

def extract_strings(file_path):
    print(f"{CYAN}[INFO] Analiz Başlatılıyor: {file_path}{RESET}\n")
    
    try:
        with open(file_path, "rb") as f:
            data = f.read()
    except FileNotFoundError:
        print(f"{RED}[HATA] Dosya bulunamadı.{RESET}")
        return

    # 1. Aşama: Dosyadaki en az 4 karakter uzunluğundaki tüm okunabilir metinleri bul
    # (Strings komutu mantığı: ASCII karakterleri yakalar)
    readable_strings = re.findall(rb"[ -~]{4,}", data)

    # 2. Aşama: Yakalanan metinlerin içinde hassas kelimeleri tara
    findings = []
    patterns = {
        "API KEY": rb"API_KEY=[\w-]+",
        "URL/C2": rb"https?://[\w./-]+",
        "PASSWORD": rb"PASSWORD=[\w!@#$%^&*]+"
    }

    print(f"{CYAN}--- TESPİT EDİLEN HASSAS VERİLER ---{RESET}")
    found_any = False
    for s in readable_strings:
        for label, pattern in patterns.items():
            if re.search(pattern, s):
                print(f"{GREEN}[+] {label} BULUNDU:{RESET} {s.decode('utf-8', errors='ignore')}")
                found_any = True
    
    if not found_any:
        print(f"{RED}[!] Kritik bir string bulunamadı.{RESET}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Kullanım: python3 extractor.py <dosya_adı>")
    else:
        extract_strings(sys.argv[1])