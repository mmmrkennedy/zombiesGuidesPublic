str = """Shoot this painting in the 'Apartments,' just inside from 'Main Street.' The painting should fall, revealing a record to you to pick up. 
Obtain the Wunderbuss.
Place the record on the player, left of the door to the 'CHANGE ME.' Shoot the record player with the Wunderbuss until it starts playing music.
Interact with the Woman on the Bed.
"""

arr = str.split('\n')

for item in arr:
    if item != '':
        print(f"<li>{item.strip()}</li>")