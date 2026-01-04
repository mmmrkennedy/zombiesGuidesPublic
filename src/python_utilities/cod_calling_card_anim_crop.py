from PIL import Image
import os

def split_image_fixed(image_path, output_folder, rows, cols):
    # Open the image
    image = Image.open(image_path)
    width, height = image.size

    sub_image_width = width / cols
    sub_image_height = height / rows

    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    counter = -1

    # Loop through the grid and crop each sub-image
    for row in range(rows):
        for col in range(cols):
            counter += 1
            left = col * sub_image_width
            upper = row * sub_image_height
            right = left + sub_image_width
            lower = upper + sub_image_height

            # Crop the sub-image
            cropped_image = image.crop((left, upper, right, lower))

            # Save the cropped image
            counter_str = str(counter)
            if len(counter_str) == 1:
                counter_str = '0' + counter_str
            cropped_image.save(os.path.join(output_folder, f"picture_{counter_str}.png"))

    print(f"Image split into {rows}x{cols} grid with sub-images of size {sub_image_width}x{sub_image_height}px and saved to {output_folder}.")

# Example usage
split_image_fixed(
    image_path=r"C:\Users\Markk\OneDrive\Desktop\Cod Ripping Tools\Greyhound\exported_files\infinite_warfare\ximages\ui_playercard_829.png",
    output_folder=r"C:\Users\Markk\OneDrive\Desktop\Cod Ripping Tools\Greyhound\exported_files\infinite_warfare\ximages\Cropped",
    rows=3,
    cols=5
)
