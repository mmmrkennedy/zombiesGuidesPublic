import fnmatch
import os
from bs4 import BeautifulSoup


def find_html_and_pictures_folder(directory):
    html_file_path = None
    pictures_folder_path = None

    # Walk through the directory
    for root, dirs, files in os.walk(directory):
        # Look for HTML file in the directory
        for file in files:
            if file.lower().endswith('.html'):
                html_file_path = os.path.join(root, file)
                break  # Assuming only one HTML file

        # Look for 'pictures' subfolder
        if 'pictures' in dirs:
            pictures_folder_path = os.path.join(root, 'pictures')

        # If both are found, no need to continue
        if html_file_path and pictures_folder_path:
            break

    return html_file_path, pictures_folder_path


def find_webp_image_names(path):
    """
    Returns a list of names of all .webp images in the given directory path and all its subdirectories.

    :param path: The directory path to search for .webp image names.
    :return: A list of .webp image names including their relative paths.
    """
    webp_image_names = []
    webp_image_names_w_paths = []
    for root, dirs, files in os.walk(path):
        for file in fnmatch.filter(files, '*.webp'):
            webp_image_names.append(file)
            webp_image_names_w_paths.append(os.path.relpath(os.path.join(root, file), path))

    return webp_image_names, webp_image_names_w_paths


def find_webp_in_a_tags(html_path):
    """
    Returns the file names of .webp images that are linked within <a> tags in the given HTML file.

    :param html_path: The file path to the HTML document.
    :return: A list of .webp image file names used in <a> tags.
    """
    webp_image_names = []

    # Read the HTML file
    with open(html_path, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')

    # Find all <a> tags
    a_tags = soup.find_all('a')

    for tag in a_tags:
        # Check if 'href' attribute points to a .webp file
        href = tag.get('href')
        if href and href.lower().endswith('.webp'):
            webp_image_names.append(os.path.basename(href))

        # Check for any <img> tags inside <a> tag
        for img in tag.find_all('img'):
            src = img.get('src')
            if src and src.lower().endswith('.webp'):
                webp_image_names.append(os.path.basename(src))

    return webp_image_names


def find_files_abs_paths(file_names, search_path):
    """
    Returns a list of absolute paths for the files in file_names within the search_path directory.

    :param file_names: A list of file names to search for.
    :param search_path: The directory path to search in.
    :return: A list of absolute file paths.
    """
    matched_files = []

    # Convert file_names to a set for faster lookup
    file_names_set = set(file_names)

    for root, dirs, files in os.walk(search_path):
        # Intersect the set of files in this directory with our set of file names
        matches = file_names_set.intersection(files)
        for file_name in matches:
            matched_files.append(os.path.join(root, file_name))

    return matched_files


def compare(webp_from_folder, webp_from_html):
    """
    Compares the two lists of .webp image names and returns the names of the unused images.

    :param webp_from_folder: A list of .webp image names from the 'pictures' folder.
    :param webp_from_html: A list of .webp image names from the HTML document.
    :return: A list of .webp image names that are not used in the HTML document.
    """
    return list(set(webp_from_folder) - set(webp_from_html))

def list_direct_subfolders(folder_path):
    """
    Returns a list of names of all direct subfolders in the given folder path.

    :param folder_path: The folder path to search for subfolders.
    :return: A list of subfolder names.
    """
    subfolders = [name for name in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, name))]
    return subfolders


if __name__ == "__main__":
    paths = []

    game_path = input("Game Path (games\\BO4\\) or Map Path (\games\BO4\\tag_der_toten) (g or m): ").lower()

    if game_path == "g":
        game_path = input("Enter game path (Example: D:\zombiesGuidesPublic\games\BO4\\): ")

        all_subfolder_paths = list_direct_subfolders(game_path)

        for subfolder_path in all_subfolder_paths:
            subfolder_path = os.path.join(game_path, subfolder_path)
            html_path, pictures_path = find_html_and_pictures_folder(subfolder_path)

            webp_images, webp_images_w_paths = find_webp_image_names(pictures_path)
            a_tags = find_webp_in_a_tags(html_path)

            unreferenced_images = compare(webp_images, a_tags)

            unused_images = find_files_abs_paths(unreferenced_images, pictures_path)

            if len(unused_images) != 0:
                for path in unused_images:
                    paths.append(path)

    else:
        html_path, pictures_path = find_html_and_pictures_folder(input("Enter directory path (Example: D:\zombiesGuidesPublic\games\BO4\\tag_der_toten): "))

        webp_images, webp_images_w_paths = find_webp_image_names(pictures_path)
        a_tags = find_webp_in_a_tags(html_path)

        unreferenced_images = compare(webp_images, a_tags)

        paths = find_files_abs_paths(unreferenced_images, pictures_path)

    if len(paths) == 0:
        print("All images are being used")
    else:
        print("Unused images:")
        for path in paths:
            print(path)
