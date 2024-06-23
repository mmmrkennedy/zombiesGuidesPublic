import os
from PIL import Image

def list_pictures(folder, size):
    pictures = []

    for root, _, files in os.walk(folder):
        for file in files:
            if file.lower().endswith(('png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp')):
                file_path = os.path.join(root, file)
                try:
                    with Image.open(file_path) as img:
                        if img.size == size:
                            pictures.append(file_path)
                except Exception as e:
                    print(f"Error opening image {file_path}: {e}")

    return pictures

def main():
    folder = input("Enter the folder path: ")
    default_sizes = [(3840, 2160), (2560, 1440), (1920, 1080)]
    default_ask = int(input("Enter resolution options (1: 4K, 2: 2K, 3:1080p, 4:Custom): "))
    if default_ask > 3:
        width = int(input("Enter the width of the images: "))
        height = int(input("Enter the height of the images: "))
        size = (width, height)
    else:
        size = default_sizes[default_ask-1]

    pictures = list_pictures(folder, size)

    if pictures:
        print(f"Found {len(pictures)} pictures of size {size}:")
        for picture in pictures:
            print(picture)
    else:
        print(f"No pictures of size {size} found in {folder}")

if __name__ == "__main__":
    main()
