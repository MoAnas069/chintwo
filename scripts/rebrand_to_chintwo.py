import os
import re

replacements = [
    # Full names & titles
    ('Abhinand Sankeerthanam', 'Chintwo'),
    ('Abhinand', 'Chintwo'),
    ('abhinand s', 'chintwo'),
    ('abhinand', 'chintwo'),
    ('ARTONAUT', 'CHINTWO'),
    ('Artonaut', 'Chintwo'),
    ('artonaut.', 'chintwo.'),
    ('artonaut', 'chintwo'),

    # Professional descriptors
    ('Hospitality &amp; Lifestyle Photographer, London', 'Contemporary &amp; Visual Artist, London'),
    ('Hospitality & Lifestyle Photographer, London', 'Contemporary & Visual Artist, London'),
    ('Professional Photographer &amp; Storyteller', 'Contemporary Artist &amp; Spatial Visionary'),
    ('Professional Photographer & Storyteller', 'Contemporary Artist & Spatial Visionary'),
    ('Professional Photographer', 'Contemporary Artist'),
    ('Hospitality &amp; Lifestyle Photographer', 'Contemporary &amp; Visual Artist'),
    ('Hospitality & Lifestyle Photographer', 'Contemporary & Visual Artist'),
    ('photographer and visual artist based in London', 'contemporary visual artist based in London'),
    
    # Meta descriptions
    (
        'London-based photographer Abhinand, also known as Artonaut, specializes in hospitality, interiors, food, and lifestyle photography. His work focuses on light, texture, and mood  creating refined imagery that brings spaces and stories to life.',
        'London-based contemporary artist Chintwo creates evocative, texture-rich artworks exploring light, spatial harmony, and visual emotion. His work brings spaces, collections, and stories to life.'
    ),
    (
        'London-based photographer Abhinand, also known as Artonaut, specializes in hospitality, interiors, food, and lifestyle photography.',
        'London-based contemporary artist Chintwo specializes in original paintings, sculptural works, and spatial installations.'
    ),
    (
        'London hospitality, lifestyle, food and interior photography by Abhinand, creating refined imagery for spaces, stories and brands.',
        'London contemporary artworks, textured canvases, and spatial installations by Chintwo, creating refined visual presence for spaces and collections.'
    ),
    (
        'Get in touch with Abhinand (Artonaut) to book your portrait, real estate, product, food, wedding, events, or motography session. Lets create something extraordinary together. Reach out today!',
        'Get in touch with Chintwo to inquire about original works, bespoke private commissions, spatial installations, or studio visits in London. Let us create something extraordinary together.'
    ),
    (
        'Discover photography insights, creative shoots, and behind-the-scenes stories by Abhinand (Artonaut). Explore portrait, real estate, product, food, wedding, events, and motography through expert tips and visual storytelling.',
        'Discover artist essays, creative processes, and studio notes by Chintwo. Explore contemporary painting, spatial curation, and fine art collecting.'
    ),
    (
        'Abhinand, aka Artonaut, is a London-based photographer specializing in portrait, real estate, product, food, wedding, events, and motography. He crafts timeless visuals through photography and cinematography. Book a session today to turn moments into art.',
        'Chintwo is a London-based contemporary artist creating timeless artworks across canvas, sculptural forms, and spatial installations. Inquire today for original acquisitions and bespoke commissions.'
    ),

    # Bio / About paragraphs
    (
        'Hey, Im Abhinand, also known as Artonaut  a photographer and visual artist based in London. I work across interiors, food, people, and products, creating images that feel honest, thoughtful, and timeless. My work focuses on atmosphere and detail  how light, texture, and colour come together to tell a story.',
        'Hey, I’m Chintwo – a contemporary visual artist based in London. I work across textured canvases, spatial installations, figurative studies, and sculptural forms, creating works that feel evocative, thoughtful, and timeless. My practice focuses on atmosphere, raw material, and scale – how light, texture, and colour come together to transform spaces and provoke emotion.'
    ),
    (
        'I believe photography is about more than just visuals  its about connection. Whether its a calm interior, the artistry of food, or a simple human moment, I try to capture what feels real. My aim is to make every image reflect both the subject and the emotion behind it. Each project is carefully built around mood and story, with a focus on keeping things natural, elegant, and true to life.',
        'I believe art is about more than aesthetics – it’s about spatial resonance and deep emotional connection. Whether it’s a large-scale commission for an architectural space, the quiet intimacy of a textural canvas, or a sculptural still-life study, I seek to reveal what feels authentic and enduring. Each piece is crafted with intention and presence, balancing minimalism with tactile richness.'
    ),
    (
        'Whether youre ready to book a session or just have a few questions, Id love to hear from you.',
        'Whether you’re ready to acquire an original work, commission a bespoke piece, or arrange a private studio viewing in London, I’d love to connect.'
    ),
    (
        'Fill out the form below or drop me a message directly, and Ill get back to you as soon as I can. Lets create something memorable together!',
        'Fill out the form below or drop me an inquiry directly, and I’ll get back to you promptly. Let’s create something extraordinary together!'
    ),

    # Headings and categories
    ("Photographer's diary", "Artist's Journal"),
    ("Photographer’s diary", "Artist’s Journal"),
    ("Food &amp; Culinary Photography", "Still Life &amp; Sensory Art"),
    ("Food & Culinary Photography", "Still Life & Sensory Art"),
    ("Real Estate &amp; Interior Photography", "Spatial Art &amp; Murals"),
    ("Real Estate & Interior Photography", "Spatial Art & Murals"),
    ("Product &amp; Still Life Photography", "Sculptural Objects &amp; Form"),
    ("Product & Still Life Photography", "Sculptural Objects & Form"),
    ("Portrait &amp; Lifestyle Photography", "Figurative Studies &amp; Presence"),
    ("Portrait & Lifestyle Photography", "Figurative Studies & Presence"),
    ("Event &amp; Brand Photography", "Exhibitions &amp; Live Installations"),
    ("Event & Brand Photography", "Exhibitions & Live Installations"),
    ("From interiors to food and faces  visual stories crafted with calm and intention.", "From spatial canvases to sculptural forms and emotive portraits  original artworks crafted with depth and intention."),
    ("spaces - I translate atmospheres into art. Every frame designed to evoke, invite, and endure.", "I translate atmospheres into visual art. Every canvas and installation designed to evoke, invite, and endure."),
    
    # CTA buttons
    ("Book your session", "Acquire / Commission"),
    ("Ready to capture the moments that matter most?", "Looking to elevate your space with original contemporary art?"),
    ("Lets make it happen.  Contact me today!", "Let’s create something extraordinary. Inquire today!"),
    ("Lets make it happen. Contact me today!", "Let’s create something extraordinary. Inquire today!"),
    ("Let’s make it happen. Contact me today!", "Let’s create something extraordinary. Inquire today!"),

    # Article titles & topics
    ("Airbnb Photography: The One Investment That Can Instantly Boost Your Bookings & Revenue", "Living with Art: How Original Artwork Transforms Spaces & Elevates Architecture"),
    ("Airbnb Photography: The One Investment", "Living with Art: Elevating Spaces"),
    ("Crop Sensor vs. Full-Frame: Which Camera is Right for You?", "Scale, Medium & Texture: Curating the Ideal Artwork for Your Space"),
    ("The Impact of Stunning Visuals on Brand Perception", "The Power of Visual Presence: How Fine Art Shapes Contemporary Atmosphere"),
    ("A Picture is Worth a Thousand Tastes", "Sensory & Atmospheric Art: Beyond Visuals into Emotion"),

    # Contact & links
    ("hi@artonaut.in", "hello@chintwo.com"),
    ("hello@artonaut.in", "hello@chintwo.com"),
    ("https://www.artonaut.in", "https://chintwo.com"),
    ("https://www.instagram.com/artonaut.in", "https://www.instagram.com/chintwo"),
    ("https://www.linkedin.com/in/abhinandsankeerthanam", "https://www.linkedin.com/in/chintwo"),
    ("Photographer", "Visual Artist"),
    ("photographer", "visual artist")
]

modified_files = 0

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root:
        continue
    for f in files:
        if f.endswith(('.html', '.mjs', '.json', '.js', '.md')):
            if f in ['rebrand_to_chintwo.py', 'find_branding.py', 'inspect_phrases.py', 'inspect_paragraphs.py', 'inspect_index_p.py', 'inspect_contact_p.py', 'inspect_portfolio_p.py']:
                continue
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
            
            orig = content
            for src, dst in replacements:
                content = content.replace(src, dst)
            
            if content != orig:
                with open(path, 'w', encoding='utf-8') as out:
                    out.write(content)
                modified_files += 1
                print(f"Updated {path}")

print(f"\nRebranding completed! Total files modified: {modified_files}")
