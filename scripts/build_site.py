import os
import re

page_mappings = {
    'index.html': [
        'index.html'
    ],
    'about.html': [
        'about/index.html',
        'about.html'
    ],
    'portfolio.html': [
        'portfolio/index.html',
        'portfolio.html'
    ],
    'contact.html': [
        'contact/index.html',
        'contact.html'
    ],
    'blog.html': [
        'blog/index.html',
        'blog.html'
    ],
    'portfolio__editorial-shoot.html': [
        'portfolio/editorial-shoot/index.html',
        'portfolio/editorial-shoot.html'
    ],
    'portfolio__event-brand-photography.html': [
        'portfolio/event-brand-photography/index.html',
        'portfolio/event-brand-photography.html'
    ],
    'portfolio__food-photography.html': [
        'portfolio/food-photography/index.html',
        'portfolio/food-photography.html'
    ],
    'portfolio__interior-architectural-photography.html': [
        'portfolio/interior-architectural-photography/index.html',
        'portfolio/interior-architectural-photography.html'
    ],
    'portfolio__portrait-lifestyle-photography.html': [
        'portfolio/portrait-lifestyle-photography/index.html',
        'portfolio/portrait-lifestyle-photography.html'
    ],
    'portfolio__product-photography.html': [
        'portfolio/product-photography/index.html',
        'portfolio/product-photography.html'
    ],
    'blog__airbnb-photography-the-one-investment.html': [
        'blog/airbnb-photography-the-one-investment/index.html',
        'blog/airbnb-photography-the-one-investment.html'
    ],
    'blog__crop-sensor-vs-full-frame-which-camera-is-right-for-you.html': [
        'blog/crop-sensor-vs-full-frame-which-camera-is-right-for-you/index.html',
        'blog/crop-sensor-vs-full-frame-which-camera-is-right-for-you.html'
    ],
    'blog__the-impact-of-stunning-visuals-on-brand-perception.html': [
        'blog/the-impact-of-stunning-visuals-on-brand-perception/index.html',
        'blog/the-impact-of-stunning-visuals-on-brand-perception.html'
    ],
    '404.html': [
        '404.html'
    ]
}

def transform_html(html):
    # Replace Framer image URLs with local /assets/images/
    html = re.sub(
        r'https://framerusercontent\.com/images/',
        '/assets/images/',
        html
    )
    # Replace Framer site scripts/assets with local /assets/scripts/
    html = re.sub(
        r'https://framerusercontent\.com/sites/2taSyT2OLbVMIVlKVrycdC/',
        '/assets/scripts/',
        html
    )
    # Suppress console errors for Framer telemetry if events.framer.com fails
    telemetry_stub = '<script>window.__framer_events=window.__framer_events||[];window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}</script>'
    html = html.replace('<head>', '<head>\n\t' + telemetry_stub)
    return html

# 1. Process HTML pages
for src_file, targets in page_mappings.items():
    src_path = os.path.join('scraped_pages', src_file)
    if not os.path.exists(src_path):
        print(f"Warning: {src_path} not found!")
        continue
    with open(src_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    transformed = transform_html(content)
    
    for t in targets:
        os.makedirs(os.path.dirname(t) if os.path.dirname(t) else '.', exist_ok=True)
        with open(t, 'w', encoding='utf-8') as out:
            out.write(transformed)
        print(f"Wrote {t}")

# 2. Process JS modules in assets/scripts/
scripts_dir = 'assets/scripts'
if os.path.exists(scripts_dir):
    for s in os.listdir(scripts_dir):
        if s.endswith('.mjs') or s.endswith('.json') or s.endswith('.js'):
            p = os.path.join(scripts_dir, s)
            with open(p, 'r', encoding='utf-8', errors='ignore') as f:
                txt = f.read()
            
            new_txt = txt.replace('https://framerusercontent.com/images/', '/assets/images/')
            new_txt = new_txt.replace('https://framerusercontent.com/sites/2taSyT2OLbVMIVlKVrycdC/', '/assets/scripts/')
            
            if new_txt != txt:
                with open(p, 'w', encoding='utf-8') as f:
                    f.write(new_txt)
                print(f"Updated references in {s}")

print("\nBuild complete!")
