str = """Randomly (you might have to be on Round 6) around the map, Dr. Straub (a man in a lab coat) will spawn in one of the locations. He will probably just stand there, but he could do other actions. You can shoot him to get the "Lurking Around" Trophy/Achievement. Potential spawn locations:
Village Entrance/Square - In the Zombie spawn, left of the door out of spawn
Village Square - In a second floor window above the Armour stand
Laboratory - In the Zombie spawn, behind Electric Cherry
Laboratory - Right of Speed Cola, where the bodies are hanging
Morgue - In the area behind the power switch
Morgue - In the Zombie spawn, right of the BAR wallbuy (Unconfirmed)
Morgue - In the "white" room, right of the Armour stand (Unconfirmed)
Morgue - Behind the metal gate in the Spike trap room
"""

arr = str.split('\n')

for item in arr:
    if item != '':
        print(f"<li>{item.strip()}</li>")