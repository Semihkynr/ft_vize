import re
import sys
import os
from typing import List, Dict

# Terminal Renkleri
CYAN = '\033[96m'
RED = '\033[91m'
GREEN = '\033[92m'
RESET = '\033[0m'

PATTERNS: Dict[str, bytes] = {
    "API_KEY": rb"API_KEY=[\w-]+",
    "URL_C2": rb"https?://[\w./-]+",
    "PASSWORD": rb"PASSWORD=[\w!@#$%^&*]+"
}

def read_binary_file(file_path: str) -> bytes:
    """Dosyayı binary formatta güvenle okur."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"[HATA] Dosya bulunamadı: {file_path}")
    
    with open(file_path, "rb") as f:
        return f.read()

def scan_sensitive_data(data: bytes) -> bool:
    """Okunabilir bytelar içerisinde regex tabanlı imza avcılığı yapar."""
    readable_strings: List[bytes] = re.findall(rb"[ -~]{4,}", data)
    found_any: bool = False

    print(f"{CYAN}--- TESPİT EDİLEN HASSAS VERİLER ---{RESET}")
    for s in readable_strings:
        for label, pattern in PATTERNS.items():
            if re.search(pattern, s):
                decoded_str = s.decode('utf-8', errors='ignore')
                print(f"{GREEN}[+] {label} BULUNDU:{RESET} {decoded_str}")
                found_any = True
                
    return found_any

def main(file_path: str) -> None:
    print(f"{CYAN}[INFO] Statik Analiz Başlatılıyor: {file_path}{RESET}\n")
    try:
        data = read_binary_file(file_path)
        if not scan_sensitive_data(data):
            print(f"{RED}[!] Kritik bir string bulunamadı.{RESET}")
    except Exception as e:
        print(f"{RED}{e}{RESET}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Kullanım: python3 extractor.py <dosya_adı>")
        sys.exit(1)
    main(sys.argv[1])