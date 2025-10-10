import re
import os

def find_incomplete_links(line):
    """Find all incomplete links in a line and return their names."""
    incomplete_links = []

    # Pattern to match <a href="..."/> or <a href="..." class="..."/> followed by text and </a>
    # Excludes links starting with # (anchors)
    pattern = r'<a\s+href="(?!#)([^"]*?)/"(?:\s+class="[^"]*")?>(.*?)</a>'

    matches = re.finditer(pattern, line)
    for match in matches:
        link_text = match.group(2).strip()
        if link_text:  # Only add if there's actual text
            incomplete_links.append(link_text)

    return incomplete_links

def save_incomplete_links(html_path):
    current_header = None
    last_written_header = None
    lines_to_write = []

    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            for line in f:
                stripped_line = line.strip()

                # Check for headers
                h2_match = re.search(r'<h2.*?>(.*?)</h2>', stripped_line)
                p_upgrade_title_match = re.search(r'<p class="step-group-title".*?>(.*?)</p>', stripped_line)

                if h2_match:
                    current_header = h2_match.group(1)
                elif p_upgrade_title_match:
                    current_header = p_upgrade_title_match.group(1)
                else:
                    # Check for incomplete links
                    link_names = find_incomplete_links(stripped_line)

                    if link_names:
                        # Only write the header if it's different from the last one we wrote
                        if current_header and current_header != last_written_header:
                            lines_to_write.append(f"\n{current_header}\n")
                            last_written_header = current_header

                        # Add all found links
                        for link_name in link_names:
                            lines_to_write.append(f" - {link_name}\n")

        if lines_to_write:
            with open("incomplete_links.txt", 'w', encoding='utf-8') as out:
                out.writelines(lines_to_write)

            print(f"Found incomplete links. Saved to incomplete_links.txt")

            # Open the file
            if os.name == 'nt':  # Windows
                os.system('start incomplete_links.txt')
            elif os.name == 'posix':  # Linux/MacOS
                os.system('open incomplete_links.txt')
        else:
            print("No incomplete links found")

    except FileNotFoundError:
        print(f"Error: File '{html_path}' not found")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    html_path = input("Enter the path to the HTML file: ").strip('\'"')
    save_incomplete_links(html_path)
