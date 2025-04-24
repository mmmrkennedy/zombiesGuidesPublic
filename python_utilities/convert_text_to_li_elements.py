str = """You will be teleported to the Beach. A short cutscene will play, and fog will roll in over the area. Four powerful Meistermeuchlers will appear. You must deal enough damage to drive them away. Some Meistermeuchlers have unique abilities, such as firing saw blades or unleashing a shellshock attack. Their attacks can take out three-quarters of your health bar and quickly destroy your shields. During this phase, various types of special zombies will also attack you alongside the Meistermeuchlers. Once you've dealt enough damage, the fog will clear, and the minecart will become available. Ride the minecart to proceed.

The minecart will take you to the U-Boat Pens. Upon arrival, a Brenner will spawn that you must defeat. After the Brenner is killed, parts of the ground will randomly catch fire, similar to the effect seen when opening the Corpse Gate. As before, you must deal enough damage to the Meistermeuchlers to continue. However, the added fire hazard makes this more challenging, and there is no way to extinguish the flames. Once enough damage has been dealt, the Meistermeuchlers will retreat, and the minecart will be available again.

Next, the minecart will take you to the Bunkers, which are shrouded in heavy fog. As before, you need to deal enough damage to the Meistermeuchlers to move on. This area is somewhat easier, as all perks and armor can be purchased here. Once the Meistermeuchlers take enough damage, they will leave, allowing you to take the minecart again.

Finally, the minecart will return you to the Beach. The fog will have lifted, and you must now finish off the four Meistermeuchlers. Once all of them are defeated, the ending cutscene will play. Afterward, you will be awarded all six perks."""

arr = str.split('\n')

for item in arr:
    if item != '':
        print(f"<li>{item.strip()}</li>")