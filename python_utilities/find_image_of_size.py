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
    width = int(input("Enter the width of the images: "))
    height = int(input("Enter the height of the images: "))
    size = (width, height)

    pictures = list_pictures(folder, size)

    if pictures:
        print(f"Found {len(pictures)} pictures of size {size}:")
        for picture in pictures:
            print(picture)
    else:
        print(f"No pictures of size {size} found in {folder}")

if __name__ == "__main__":
    main()
