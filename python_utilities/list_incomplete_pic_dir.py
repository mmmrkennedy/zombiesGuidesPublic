import re
import os

def is_incomplete_link(line):
    if '<a href="' not in line:
        return False

    if '<a href="#' in line:
        return False

    if '/">' not in line:
        return False

    return True

def extract_link_name(line):
    start_index = line.find('/">') + 3
    line_after_start = line[start_index:]
    end_index = line_after_start.find('</a>') + start_index
    return line[start_index:end_index]

def save_incomplete_links(html_path):
    current_header = None
    last_written_header = None
    lines_to_write = []  # Store lines to write here

    with open(html_path, 'r', encoding='utf-8') as f:
        for line in f:
            stripped_line = line.strip()
            h2_match = re.search(r'<h2.*?>(.*?)</h2>', stripped_line)
            p_upgrade_title_match = re.search(r'<p class="step-group-title".*?>(.*?)</p>', stripped_line)

            if h2_match:
                current_header = h2_match.group(1)
            elif p_upgrade_title_match:
                current_header = p_upgrade_title_match.group(1)
            elif is_incomplete_link(stripped_line):
                link_name = extract_link_name(stripped_line)

                # Only write the header if it's different from the last one we wrote.
                if current_header != last_written_header:
                    lines_to_write.append(f"\n{current_header}\n")
                    last_written_header = current_header

                lines_to_write.append(f" - {link_name}\n")

    if lines_to_write:  # Only write if there are lines to write
        with open("incomplete_links.txt", 'w', encoding='utf-8') as out:
            out.writelines(lines_to_write)

        if os.name == 'nt':  # for Windows
            os.system('start incomplete_links.txt')
        elif os.name == 'posix':  # for Linux/MacOS
            os.system('open incomplete_links.txt')
    else:
        print("No incomplete links found")


if __name__ == "__main__":
    html_path = input("Enter the path or URL to the HTML file: ").strip('\'"')
    save_incomplete_links(html_path)
