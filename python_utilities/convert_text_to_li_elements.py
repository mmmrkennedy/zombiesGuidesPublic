def remove_li_tags(text):
    text = text.strip()  # Remove leading/trailing whitespace
    if text.startswith('<li>') and text.endswith('</li>'):
        return text[4:-5]  # Remove first 4 and last 5 characters
    return text

def add_li_tags(str_to_add_to):
    arr = str_to_add_to.split('\n')
    for item in arr:
        if item.strip():  # better empty check
            print(f"<li>{item.strip()}</li>")

def add_a_tags_to_li(str_to_add_to, optional_path=""):
    if optional_path != "" and optional_path[-1] != "/":
        optional_path += "/"

    arr = str_to_add_to.split('\n')
    for item in arr:
        if item.strip():
            print(f'<li><a href="pictures/{optional_path}">{remove_li_tags(item.strip())}</a></li>')

if __name__ == "__main__":
    ask = input("1 for add li tags (default) or 2 for add a tags to li tags: ")

    if ask == "2":
        path = input("Enter the path of pictures (after 'pictures/': ")

    print("Paste your multiline text (Ctrl+V or right-click paste), then press Enter twice:")
    lines = []
    while True:
        line = input()
        if line == '':  # Stop on double enter
            break
        lines.append(line)

    str_to_input = '\n'.join(lines)

    if ask == "2":  # Note: compare with string "2" not integer 2
        add_a_tags_to_li(str_to_input, path)
    else:
        add_li_tags(str_to_input)