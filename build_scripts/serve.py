#!/usr/bin/env python3
"""Local dev server that mimics Cloudflare Pages clean URL behaviour."""

import http.server
import os

PORT = 8080
DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist")


class CleanUrlHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST, **kwargs)

    def do_GET(self):
        # Strip query/fragment for file resolution
        path = self.path.split("?")[0].split("#")[0].rstrip("/") or "/index"
        candidate = os.path.join(DIST, path.lstrip("/"))

        if not os.path.exists(candidate) and not path.endswith(".html"):
            html_candidate = candidate + ".html"
            if os.path.exists(html_candidate):
                self.path = path + ".html"

        super().do_GET()

    def log_message(self, format, *args):
        print(f"  {args[1]}  {args[0]}")


if __name__ == "__main__":
    with http.server.HTTPServer(("", PORT), CleanUrlHandler) as httpd:
        print(f"Serving dist/ at http://localhost:{PORT}")
        httpd.serve_forever()
