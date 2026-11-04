import os
from PIL import Image

images_dir = 'assets/images'
files = [f for f in os.listdir(images_dir) if os.path.isfile(os.path.join(images_dir, f))]

before_total = 0
after_total = 0

for f in sorted(files):
    p = os.path.join(images_dir, f)
    size_before = os.path.getsize(p)
    before_total += size_before
    
    ext = os.path.splitext(f)[1].lower()
    if ext in ['.jpg', '.jpeg']:
        try:
            with Image.open(p) as im:
                if im.mode in ('RGBA', 'P', 'CMYK'):
                    im = im.convert('RGB')
                im.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
                im.save(p, 'JPEG', quality=82, optimize=True, progressive=True)
            size_after = os.path.getsize(p)
            after_total += size_after
            print(f"Optimized {f}: {size_before // 1024}KB -> {size_after // 1024}KB")
        except Exception as e:
            print(f"Error optimizing {f}: {e}")
            after_total += size_before
    elif ext == '.png':
        try:
            with Image.open(p) as im:
                if im.size[0] > 1920 or im.size[1] > 1920:
                    im.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
                # If RGB without alpha, save optimized
                if im.mode == 'RGB':
                    im.save(p, 'PNG', optimize=True)
                else:
                    im.save(p, 'PNG', optimize=True)
            size_after = os.path.getsize(p)
            after_total += size_after
            print(f"Optimized PNG {f}: {size_before // 1024}KB -> {size_after // 1024}KB")
        except Exception as e:
            print(f"Error optimizing {f}: {e}")
            after_total += size_before
    else:
        after_total += size_before

print(f"\nOptimization Finished!")
print(f"Before: {before_total / (1024*1024):.2f} MB")
print(f"After:  {after_total / (1024*1024):.2f} MB")
print(f"Saved:  {(before_total - after_total) / (1024*1024):.2f} MB ({(1 - after_total/before_total)*100:.1f}%)")

