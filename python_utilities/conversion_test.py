import subprocess
import os
import sys

def test_webp_qualities(input_path):
    """Test WebP conversion at different quality levels and report file sizes."""

    if not os.path.exists(input_path):
        print(f"Error: Input file '{input_path}' not found.")
        return

    # Get input file size
    input_size = os.path.getsize(input_path)
    print(f"Original PNG size: {input_size:,} bytes ({input_size/1024/1024:.2f} MB)")
    print("-" * 60)

    # Test qualities from 85 to 100
    results = []

    for quality in range(85, 101):
        # Generate output filename
        base_path = os.path.splitext(input_path)[0]
        output_path = f"{base_path}_{quality}q.webp"

        # Build command
        cmd = [
            'cwebp',
            '-q', str(quality),
            '-m', '6',
            '-pass', '10',
            '-mt',
            input_path,
            '-o', output_path
        ]

        try:
            # Run conversion
            print(f"Converting at quality {quality}...", end=" ")
            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0:
                # Get output file size
                output_size = os.path.getsize(output_path)
                reduction = ((input_size - output_size) / input_size) * 100

                results.append({
                    'quality': quality,
                    'size': output_size,
                    'reduction': reduction,
                    'path': output_path
                })

                print(f"Done! Size: {output_size:,} bytes ({reduction:.1f}% reduction)")

            else:
                print(f"Failed! Error: {result.stderr}")

        except Exception as e:
            print(f"Error running cwebp: {e}")

    # Print summary
    print("\n" + "="*60)
    print("SUMMARY:")
    print("="*60)
    print(f"{'Quality':<8} {'Size (bytes)':<12} {'Size (MB)':<10} {'Reduction':<10}")
    print("-"*60)

    for r in results:
        print(f"{r['quality']:<8} {r['size']:,<12} {r['size']/1024/1024:<10.2f} {r['reduction']:<10.1f}%")

    # Find best quality/size ratio
    if results:
        best_ratio = min(results, key=lambda x: x['size'])
        print(f"\nSmallest file: Quality {best_ratio['quality']} ({best_ratio['size']:,} bytes)")

        # Show quality 90 specifically if it exists
        q90 = next((r for r in results if r['quality'] == 90), None)
        if q90:
            print(f"Quality 90 reference: {q90['size']:,} bytes ({q90['reduction']:.1f}% reduction)")

if __name__ == "__main__":
    input_path = r"E:\Screenshots\Bloons TD 6\test.png"
    test_webp_qualities(input_path)