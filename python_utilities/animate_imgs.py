from PIL import Image
import os

def create_animation(image_folder, output_gif, frame_duration=2):
    # Collect all images from the folder
    images = []
    for file_name in sorted(os.listdir(image_folder)):
        if file_name.endswith(".png"):
            file_path = os.path.join(image_folder, file_name)
            images.append(Image.open(file_path))

    # Ensure there are images to animate
    if not images:
        raise ValueError("No images found in the specified folder.")

    # Convert frame duration to milliseconds (1 frame = 1/30th second, so 2 frames = ~66ms)
    duration_in_ms = frame_duration * (1000 / 30)

    # Save as an animated GIF
    images[0].save(
        output_gif,
        save_all=True,
        append_images=images[1:],  # Add the rest of the images
        duration=duration_in_ms,  # Duration for each frame in milliseconds
        loop=0  # Infinite loop
    )

    print(f"Animation saved as {output_gif}")

# Example usage
create_animation(
    image_folder=r"D:\zombiesGuidesPublic\python_utilities\imgs",  # Folder where cropped images are stored
    output_gif="message_rerouted_calling_card.gif",
    frame_duration=2  # Each image displayed for 2 frames
)
