import urllib.request
import zipfile
import os

url = "https://github.com/pmmp/PHP-Binaries/releases/download/php-8.2.6/php-8.2.6-nts-Win32-vs16-x64.zip"
dest = "C:/Users/chs91/Desktop/php.zip"
extract_to = "C:/Users/chs91/Desktop/php"

print("Downloading PHP 8.2...")
urllib.request.urlretrieve(url, dest)
print("Extracting...")
with zipfile.ZipFile(dest, 'r') as z:
    z.extractall(extract_to)

print("Preparing php.ini...")
ini_src = os.path.join(extract_to, "php.ini-development")
ini_dest = os.path.join(extract_to, "php.ini")
with open(ini_src, "r", encoding="utf-8") as f:
    ini_content = f.read()

ini_content += "\n켰=1"
ini_content += "\nextension_dir = \"ext\"\n"
ini_content += "extension=pdo_sqlite\n"
ini_content += "extension=sqlite3\n"
ini_content += "extension=curl\n"
ini_content += "extension=mbstring\n"
ini_content += "extension=openssl\n"
ini_content += "extension=gd\n"
ini_content += "extension=fileinfo\n"

with open(ini_dest, "w", encoding="utf-8") as f:
    f.write(ini_content)

print("Done")
