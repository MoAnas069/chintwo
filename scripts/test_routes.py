import subprocess
import time
import urllib.request
import sys

routes_to_test = [
    '/',
    '/about',
    '/portfolio',
    '/portfolio/interior-architectural-photography',
    '/portfolio/food-photography',
    '/portfolio/product-photography',
    '/portfolio/editorial-shoot',
    '/portfolio/portrait-lifestyle-photography',
    '/portfolio/event-brand-photography',
    '/blog',
    '/blog/airbnb-photography-the-one-investment',
    '/blog/crop-sensor-vs-full-frame-which-camera-is-right-for-you',
    '/blog/the-impact-of-stunning-visuals-on-brand-perception',
    '/contact',
    '/assets/scripts/script_main.vSW-S8Dy.mjs',
    '/assets/images/IjGHZWRXoAgh4itRVP4GNn5St88.png'
]

print("Starting node server.js...")
proc = subprocess.Popen(['node', 'server.js'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
time.sleep(2)

base = 'http://localhost:3000'
all_ok = True

try:
    for r in routes_to_test:
        url = base + r
        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=5) as resp:
                code = resp.status
                ct = resp.headers.get('Content-Type')
                data = resp.read()
                print(f"[{code}] {r} ({ct}) - {len(data)} bytes")
        except Exception as e:
            print(f"[FAIL] {r}: {e}")
            all_ok = False

    # Test 404
    try:
        urllib.request.urlopen(base + '/some-non-existent-page')
        print("[FAIL] /some-non-existent-page did not return 404")
        all_ok = False
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print(f"[{e.code}] /some-non-existent-page correctly returned 404")
        else:
            print(f"[FAIL] unexpected code {e.code}")
            all_ok = False

    # Test 308 redirect
    try:
        class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, req, fp, code, msg, headers, newurl):
                return None
        opener = urllib.request.build_opener(NoRedirectHandler)
        resp = opener.open(base + '/about/')
    except urllib.error.HTTPError as e:
        if e.code == 308:
            print(f"[{e.code}] /about/ correctly redirected 308 to {e.headers.get('Location')}")
        else:
            print(f"Redirect test returned {e.code}")

finally:
    proc.terminate()
    proc.wait()

if all_ok:
    print("\nAll tests passed successfully!")
else:
    print("\nSome tests failed!")
    sys.exit(1)
