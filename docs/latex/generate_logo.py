from PIL import Image, ImageDraw, ImageFont
import os

img = Image.new('RGB', (400, 400), color = 'white')
d = ImageDraw.Draw(img)

# Draw a red circle
d.ellipse([10, 10, 390, 390], outline="red", width=10)
# Draw an inner red circle
d.ellipse([30, 30, 370, 370], outline="red", width=5)

try:
    font = ImageFont.truetype("LiberationSans-Bold.ttf", 60)
except:
    font = ImageFont.load_default()

# Add text
text = "TIET"
d.text((120, 170), text, fill="red", font=font)

img.save('thapar_logo.png')
