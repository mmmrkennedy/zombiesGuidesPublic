from PIL import Image
import os

def split_image_fixed(image_path, output_folder, sub_image_width, sub_image_height, rows, cols):
    # Open the image
    image = Image.open(image_path)
    width, height = image.size

    # Verify the image dimensions are sufficient for the given rows/cols
    if width < cols * sub_image_width or height < rows * sub_image_height:
        raise ValueError("Image dimensions are too small for the specified rows, columns, and sub-image size.")

    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Loop through the grid and crop each sub-image
    for row in range(rows):
        for col in range(cols):
            left = col * sub_image_width
            upper = row * sub_image_height
            right = left + sub_image_width
            lower = upper + sub_image_height

            # Crop the sub-image
            cropped_image = image.crop((left, upper, right, lower))

            # Save the cropped image
            cropped_image.save(os.path.join(output_folder, f"sub_image_{row}_{col}.png"))

    print(f"Image split into {rows}x{cols} grid with sub-images of size {sub_image_width}x{sub_image_height}px and saved to {output_folder}.")

# Example usage
split_image_fixed(
    image_path=r"D:\zombiesGuidesPublic\python_utilities\ui_playercard_785.png",
    output_folder=r"D:\zombiesGuidesPublic\python_utilities",
    sub_image_width=376,
    sub_image_height=148,
    rows=3,
    cols=5
)
