str = """In the hole in the roof to the left of the Wunderfizz

On a fence post in the farthest window of Spawn

On the pond, in the left window barrier of Spawn

On the end of the tank’s barrel, in the window next to Mule Kick

On the top floor, on top of a power line post

On top of a truck, in the farthest right window of the Spawn room

Next to a power generator on the top floor, visible through a window

In the hole in the ceiling on the bottom floor"""

arr = str.split('\n')

for item in arr:
    if item != '':
        print(f"<li>{item.strip()}</li>")