import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import xml.etree.ElementTree as ET
from datetime import datetime

def is_html_url(url):
    """Check if URL is likely to be HTML content"""
    excluded_extensions = ['.webp', '.jpg', '.jpeg', '.png', '.gif', '.pdf',
                           '.zip', '.exe', '.mp3', '.mp4', '.avi', '.mov']
    return not any(url.lower().endswith(ext) for ext in excluded_extensions)

def get_all_links(base_url, max_pages=100):
    """Crawl website and find all internal links"""
    base_domain = urlparse(base_url).netloc
    visited = set()
    to_visit = {base_url}
    all_links = set()
    session = requests.Session()

    while to_visit and len(visited) < max_pages:
        url = to_visit.pop()

        if url in visited:
            continue

        if not is_html_url(url):
            continue

        try:
            print(f"Crawling: {url}")
            response = session.get(url, timeout=5, headers={'User-Agent': 'Mozilla/5.0'})

            if response.status_code != 200:
                print(f"Skipping {url} - Status code: {response.status_code}")
                continue

            content_type = response.headers.get('Content-Type', '')
            if 'text/html' not in content_type:
                print(f"Skipping {url} - Content-Type: {content_type}")
                continue

            soup = BeautifulSoup(response.text, 'html.parser')
            visited.add(url)
            all_links.add(url)

            # Find all links on page
            for link in soup.find_all('a', href=True):
                href = link['href'].split('#')[0]  # Remove fragment identifiers
                if not href:
                    continue

                absolute_url = urljoin(url, href)

                # Only include links from the same domain
                if urlparse(absolute_url).netloc == base_domain:
                    if absolute_url not in visited and is_html_url(absolute_url):
                        to_visit.add(absolute_url)

        except KeyboardInterrupt:
            print("\nCrawling interrupted by user")
            break
        except Exception as e:
            print(f"Error crawling {url}: {str(e)[:100]}")  # Print first 100 chars of error

    return sorted(all_links)

def create_sitemap(base_url, filename='sitemap.xml', max_pages=100):
    print(f"Crawling {base_url} to find all pages...")
    urls = get_all_links(base_url, max_pages)
    print(f"\nFound {len(urls)} pages.")

    # Create XML structure
    urlset = ET.Element('urlset', xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')

    for url in urls:
        url_element = ET.SubElement(urlset, 'url')
        ET.SubElement(url_element, 'loc').text = url
        ET.SubElement(url_element, 'lastmod').text = datetime.now().strftime('%Y-%m-%d')
        ET.SubElement(url_element, 'changefreq').text = 'weekly'
        ET.SubElement(url_element, 'priority').text = '0.8'

    # Write to file with proper XML declaration
    tree = ET.ElementTree(urlset)
    ET.indent(tree, space="\t", level=0)
    tree.write(filename, encoding='utf-8', xml_declaration=True)
    print(f"Sitemap created at {filename} with {len(urls)} URLs.")

# Example usage
if __name__ == "__main__":
    create_sitemap('https://mmmrkennedy.github.io/zombiesGuidesPublic/', max_pages=500)