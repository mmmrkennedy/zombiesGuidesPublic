import os
import subprocess
from PIL import Image
import shutil
from concurrent.futures import ThreadPoolExecutor, as_completed


def png_to_webp(root_dir, image_quality, image_extensions):
    num_images = count_image_files(root_dir, image_extensions)
    images_converted = 0

    if num_images == 0:
        print("No images found!")
    else:
        if input("Backup directory? (y/n), No is default: ") == "y":
            incremental_backup(root_dir, root_dir + "_backup")

        with ThreadPoolExecutor() as executor:
            futures = [executor.submit(convert_to_webp, dirpath, filename, image_quality)
                       for dirpath, dirnames, filenames in os.walk(root_dir)
                       for filename in filenames if any(filename.endswith(ext) for ext in image_extensions)]

            for future in as_completed(futures):
                result = future.result()
                if result:
                    images_converted += 1
                    print(f"Converted {images_converted} of {num_images} images - {result}")
                else:
                    print(f"Conversion failed for {result}")

        print(f"Conversion to WebP @ {image_quality} Quality Completed!")


def convert_to_webp(dirpath, filename, image_quality):
    input_path = os.path.join(dirpath, filename)

    with Image.open(input_path) as img:
        width, height = img.size

    output_path = os.path.join(dirpath, os.path.splitext(filename)[0] + '.webp')

    try:
        result = subprocess.run(['cwebp', '-q', str(image_quality), input_path, '-o', output_path],
                                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        if result.returncode == 0 and os.path.exists(output_path):
            if input_path != output_path:
                os.remove(input_path)
            return filename
        else:
            return None
    except subprocess.CalledProcessError:
        return None


def webp_to_png(root_dir):
    num_images = count_image_files(root_dir, ['.webp'])
    images_converted = 0

    if num_images == 0:
        print("No images found!")
    else:
        incremental_backup(root_dir, root_dir + "_backup")

        with ThreadPoolExecutor() as executor:
            futures = [executor.submit(convert_to_png, dirpath, filename)
                       for dirpath, dirnames, filenames in os.walk(root_dir)
                       for filename in filenames if filename.endswith('.webp')]

            for future in as_completed(futures):
                result = future.result()
                if result:
                    images_converted += 1
                    print(f"Converted {images_converted} of {num_images} images")
                else:
                    print(f"Conversion failed for {result}")

        print("Conversion to PNG Completed!")


def convert_to_png(dirpath, filename):
    input_path = os.path.join(dirpath, filename)
    output_path = os.path.join(dirpath, os.path.splitext(filename)[0] + '.png')

    try:
        result = subprocess.run(['dwebp', input_path, '-o', output_path], stdout=subprocess.DEVNULL,
                                stderr=subprocess.DEVNULL, check=True)

        if result.returncode == 0 and os.path.exists(output_path):
            os.remove(input_path)
            return filename
        else:
            return None
    except subprocess.CalledProcessError:
        return None


def remove_empty_dirs(dir_path):
    for dirpath, dirnames, filenames in os.walk(dir_path, topdown=False):
        try:
            if not os.listdir(dirpath):
                print(f"Removing empty directory: {dirpath}")
                os.rmdir(dirpath)
                parent_dir = os.path.dirname(dirpath)
                if parent_dir != dir_path:
                    remove_empty_dirs(parent_dir)
        except FileNotFoundError:
            continue


def incremental_backup(src_dir, dest_dir):
    if not os.path.exists(src_dir):
        raise ValueError(f"Source directory {src_dir} does not exist!")

    print(f"Backing up {src_dir} to {dest_dir}")

    image_extensions = {".jpg", ".jpeg", ".webp", ".png"}

    for dirpath, dirnames, filenames in os.walk(src_dir):
        rel_path = os.path.relpath(dirpath, src_dir)
        dest_path = os.path.join(dest_dir, rel_path)

        if not os.path.exists(dest_path):
            os.makedirs(dest_path)

        for filename in filenames:
            if os.path.splitext(filename)[1].lower() in image_extensions:
                src_file = os.path.join(dirpath, filename)
                dest_file = os.path.join(dest_path, filename)

                if (not os.path.exists(dest_file)) or (os.path.getmtime(src_file) > os.path.getmtime(dest_file)):
                    shutil.copy2(src_file, dest_file)
                    print(f"Copied {src_file} to {dest_file}")
                else:
                    print(f"Skipped {src_file}, already up to date.")

    remove_empty_dirs(dest_dir)


def count_image_files(directory_path, image_extensions):
    image_count = 0

    for root, dirs, files in os.walk(directory_path):
        for file in files:
            for ext in image_extensions:
                if file.lower().endswith(ext):
                    image_count += 1

    return image_count


def valid_dir(image_dir):
    if image_dir == "":
        new_input = input("Enter the path to the image directory: ")
        if new_input == "":
            default_dir = "D:\\zombiesGuidesPublic\\games"
            print(f"Using default directory: {default_dir}")
            return default_dir
        else:
            return new_input
    else:
        use_previous_dir = input("Use previous directory? (y/n): ")
        if use_previous_dir == "n":
            return input("Enter the path to the image directory: ").strip('\'"')
        else:
            print("Using previous directory...")
            return image_dir


if __name__ == "__main__":
    while 1:
        image_dir = ""

        convert_option = input(
            "Convert to webp (1), convert to png (2), Backup Directory in Full (Don't) (3), Change Directory (4) or "
            "Quit (5)? ")

        if convert_option == "1":
            if input("Default Config? (y/n): ") == "n":
                image_dir = valid_dir(image_dir)

                image_quality = input("Enter the image quality (1-100), 90 is Default: ")
                if image_quality == "":
                    image_quality = "90"

                include_webp = input("Include webp files? (y/n), No is default: ")
                if include_webp == "" or include_webp.lower() == "n":
                    image_extensions = ['.png', '.jpg', '.jpeg', '.bmp']
                else:
                    image_extensions = ['.png', '.jpg', '.jpeg', '.bmp', '.webp']

                png_to_webp(image_dir, image_quality, image_extensions)
            else:
                png_to_webp(r"D:\ZombiesGuidesHolder\zombiesGuidesPublic\games", "90", ['.png', '.jpg', '.jpeg', '.bmp'])

        elif convert_option == "2":
            image_dir = valid_dir(image_dir)

            webp_to_png(image_dir)

        elif convert_option == "3":
            image_dir = valid_dir(image_dir)

            incremental_backup(image_dir, image_dir + "_backup")
            print("Backup Completed!")

        elif convert_option == "4":
            image_dir = input("Enter the path to the image directory: ").strip('\'"')

        elif convert_option == "5":
            break
