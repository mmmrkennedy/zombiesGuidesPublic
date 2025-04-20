str = """
    On top of the bloody statue in the middle of the map
    In a pot inside the kitchen
    On the roof inside a barrier in the Mule Kick room
    Inside a furnace in one of the Spawn rooms
    On the dentist chair
    On top of a mannequin next to Double Tap
    In a barrier below the power room
"""

arr = str.split('\n')

for item in arr:
    if item != '':
        print(f"<li>{item.strip()}</li>")