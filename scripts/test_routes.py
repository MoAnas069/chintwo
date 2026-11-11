import subprocess
import time
import urllib.request
import urllib.error
import sys

routes_to_test = [
    '/',
    '/about',
    '/portfolio',
    '/portfolio/the-cartographers-dream',
    '/portfolio/arrival-in-the-cold-mist',
    '/portfolio/the-silent-hour',
    '/portfolio/nocturne-for-two-solitudes',
    '/portfolio/fine-art-editions',
    '/portfolio/exhibitions-archive',
    '/blog',
    '/blog/on-the-weight-of-quiet-images',
    '/blog/the-poetry-of-chiaroscuro',
    '/blog/monoprint-textures-and-synthesis',
    '/contact',
    '/assets/scripts/script_main.vSW-S8Dy.mjs',
    '/assets/images/chintwo_emblem.svg',
    '/assets/images/fDh0jZF0V8L0VApCB9oAHIFgd8.webp',
    '/assets/images/LcTxyeMFm5sIiiSm4Iop5zds.webp',
    '/assets/images/peaa6VBBdWRSL3icJ2tpwsIXZI.webp'
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
            def http_error_308(self, req, fp, code, msg, headers):
                return fp
        opener = urllib.request.build_opener(NoRedirectHandler)
        resp = opener.open(base + '/about/')
        if resp.code == 308:
            print(f"[{resp.code}] /about/ correctly redirected 308 to /about")
        else:
            print(f"[FAIL] /about/ returned {resp.code}")
            all_ok = False
    except Exception as e:
        print(f"[FAIL] redirect test: {e}")
        all_ok = False

finally:
    proc.terminate()
    proc.wait()

if all_ok:
    print("\nAll tests passed successfully!")
    sys.exit(0)
else:
    print("\nSome tests failed!")
    sys.exit(1)
