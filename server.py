import http.server
import socketserver
import json
import urllib.parse

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        
        # Vercel Rewrite 시뮬레이션: /admin -> /admin/index.html
        if parsed.path == "/admin" or parsed.path == "/admin/":
            self.path = "/admin/index.html"
            
        if parsed.path.endswith(".php"):
            # 실제 PHP 로직 실행 대신 JSON 모킹 (필요시)
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            qs = urllib.parse.parse_qs(parsed.query)
            action = qs.get("action", [""])[0]
            data = []
            if action == "team":
                data = [{"id":1,"name":"Leader","role":"CEO","photo":"","bio":"Hello"}]
            elif action == "hero":
                data = {"subcopy":"Test","title":"THE 3 STUDIO","description":""}
            self.wfile.write(json.dumps(data).encode("utf-8"))
        else:
            super().do_GET()

if __name__ == "__main__":
    with socketserver.TCPServer(("", 8080), MyHandler) as httpd:
        httpd.serve_forever()
