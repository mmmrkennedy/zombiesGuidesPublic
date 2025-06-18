import requests
from bs4 import BeautifulSoup
import time

def extract_text_from_html(html_file):
    """Extract plain text from HTML file."""
    with open(html_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
        return soup.get_text()

def check_grammar(text, language='en-GB'):
    """Send text to LanguageTool API and return suggestions."""
    # Split text into chunks if too long (LanguageTool has limits)
    max_length = 20000  # Conservative limit
    if len(text) > max_length:
        print(f"Text is {len(text)} characters. Truncating to {max_length} characters.")
        text = text[:max_length]

    try:
        response = requests.post(
            'https://api.languagetool.org/v2/check',
            data={'text': text, 'language': language},
            timeout=30  # Add timeout
        )

        # Check if request was successful
        if response.status_code != 200:
            print(f"API Error: Status code {response.status_code}")
            print(f"Response content: {response.text[:500]}...")
            return {'matches': []}

        # Check if response is valid JSON
        try:
            return response.json()
        except requests.exceptions.JSONDecodeError:
            print("Error: API returned invalid JSON")
            print(f"Response content: {response.text[:500]}...")
            return {'matches': []}

    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return {'matches': []}

def print_suggestions(result, ignore_rules=None):
    """Print suggestions, skipping ignored rules."""
    if ignore_rules is None:
        ignore_rules = set()  # Default: empty set

    matches = result.get('matches', [])
    if not matches:
        print("No grammar issues found (or API error occurred).")
        return

    print(f"Found {len(matches)} potential issues:")
    print("=" * 50)

    for i, match in enumerate(matches, 1):
        rule_id = match.get('rule', {}).get('id', 'UNKNOWN')
        if rule_id in ignore_rules:
            continue  # Skip this error

        print(f"{i}. Error: {match.get('message', 'No message')} (Rule: {rule_id})")

        context = match.get('context', {})
        if context:
            context_text = context.get('text', '')
            offset = context.get('offset', 0)
            length = context.get('length', 0)

            # Highlight the error in context
            before = context_text[:offset]
            error_part = context_text[offset:offset+length]
            after = context_text[offset+length:]
            print(f"   Context: {before}[{error_part}]{after}")

        replacements = match.get('replacements', [])
        if replacements:
            suggestions = [r.get('value', '') for r in replacements[:3]]  # Show max 3 suggestions
            print(f"   Suggestions: {', '.join(suggestions)}")
        else:
            print("   Suggestions: [None]")
        print("-" * 30)

def process_text_in_chunks(text, chunk_size=15000):
    """Process large text in smaller chunks."""
    chunks = []
    for i in range(0, len(text), chunk_size):
        chunk = text[i:i + chunk_size]
        chunks.append(chunk)
    return chunks

# Example usage
if __name__ == "__main__":
    try:
        html_file = input("Enter HTML file path: ")

        print("Extracting text from HTML...")
        text = extract_text_from_html(html_file)

        # Clean up text (remove excessive whitespace)
        text = ' '.join(text.split())

        print(f"Text length: {len(text)} characters")

        if len(text) > 20000:
            print("Large text detected. Processing in chunks...")
            chunks = process_text_in_chunks(text)
            all_matches = []

            for i, chunk in enumerate(chunks, 1):
                print(f"Processing chunk {i}/{len(chunks)}...")
                result = check_grammar(chunk)
                all_matches.extend(result.get('matches', []))
                time.sleep(1)  # Be nice to the API

            # Combine results
            grammar_result = {'matches': all_matches}
        else:
            print("Checking grammar...")
            grammar_result = check_grammar(text)

        # Define rules to ignore (customize as needed)
        ignore_rules = {
            'EN_DASH',
            'HYPHEN_TO_EN',
            'MORFOLOGIK_RULE_EN_GB',
            'WHITESPACE_RULE'  # Often too noisy
        }

        print_suggestions(grammar_result, ignore_rules)

    except FileNotFoundError:
        print("Error: HTML file not found. Please check the file path.")
    except Exception as e:
        print(f"Unexpected error: {e}")
        print("Please check your input and try again.")