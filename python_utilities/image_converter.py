import os
import subprocess
import shutil
from concurrent.futures import ThreadPoolExecutor, as_completed


def png_to_webp(root_dir, image_quality, image_extensions):
    num_images = count_image_files(root_dir, image_extensions)
    images_converted = 0

    if num_images == 0:
        print("No images found!")
    else:
        with ThreadPoolExecutor() as executor:
            futures = [executor.submit(convert_to_webp, dirpath, filename, image_quality)
                       for dirpath, dirnames, filenames in os.walk(root_dir)
                       for filename in filenames if any(filename.lower().endswith(ext.lower()) for ext in image_extensions)]

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
    output_path = os.path.join(dirpath, os.path.splitext(filename)[0] + '.webp')

    result = subprocess.run(['cwebp', '-q', str(image_quality), '-m', '6', '-pass', '10', '-mt', input_path, '-o', output_path],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    if result.returncode == 0 and os.path.exists(output_path):
        if input_path != output_path:
            os.remove(input_path)
        return filename
    else:
        return None


def webp_to_png(root_dir):
    num_images = count_image_files(root_dir, ['.webp'])
    images_converted = 0

    if num_images == 0:
        print("No images found!")
        return

    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(convert_to_png, dirpath, filename)
                   for dirpath, dirnames, filenames in os.walk(root_dir)
                   for filename in filenames if filename.lower().endswith('.webp')]

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
                if file.lower().endswith(ext.lower()):
                    image_count += 1
                    break

    return image_count


def valid_dir(image_dir):
    if image_dir == "":
        new_input = input("Enter the path to the image directory: ")
        if new_input == "":
            default_dir = r"D:\programming_projects\zombiesGuidesPublic\games"
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
    import sys
    import argparse

    # Set up argument parser for non-interactive usage
    parser = argparse.ArgumentParser(description='Convert images to WebP or PNG')
    parser.add_argument('--mode', choices=['webp', 'png'], default='webp',
                        help='Conversion mode: webp (default) or png')
    parser.add_argument('--dir', type=str, default=None,
                        help='Directory to process (default: src/games)')
    parser.add_argument('--quality', type=int, default=90,
                        help='WebP quality 1-100 (default: 90)')
    parser.add_argument('--include-webp', action='store_true',
                        help='Include existing webp files in conversion')
    parser.add_argument('--interactive', action='store_true',
                        help='Run in interactive mode')

    args = parser.parse_args()

    # Interactive mode (original behavior)
    if args.interactive:
        image_dir = ""
        while True:
            convert_option = input("Convert to WebP (1), convert to PNG (2), or Quit (3)? ")

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
                    image_extensions = ['.png', '.jpg', '.jpeg', '.bmp']
                    path = r"D:\programming_projects\zombiesGuidesPublic\games"
                    png_to_webp(path, "90", image_extensions)

            elif convert_option == "2":
                image_dir = valid_dir(image_dir)
                webp_to_png(image_dir)

            elif convert_option == "3":
                break
    else:
        # Non-interactive mode (for build scripts)
        # Determine directory
        if args.dir:
            target_dir = args.dir
        else:
            # Get script directory and construct path to src/games
            script_dir = os.path.dirname(os.path.abspath(__file__))
            target_dir = os.path.join(script_dir, '..', 'src', 'games')
            target_dir = os.path.normpath(target_dir)

        if not os.path.exists(target_dir):
            print(f"Error: Directory {target_dir} does not exist!")
            sys.exit(1)

        print(f"Processing directory: {target_dir}")

        if args.mode == 'webp':
            image_extensions = ['.png', '.jpg', '.jpeg', '.bmp']
            if args.include_webp:
                image_extensions.append('.webp')
            png_to_webp(target_dir, args.quality, image_extensions)
        elif args.mode == 'png':
            webp_to_png(target_dir)