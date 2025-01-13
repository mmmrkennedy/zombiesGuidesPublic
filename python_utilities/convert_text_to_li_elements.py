str = """You will be teleported to the Beach, where you have to push the Nuke (by standing near it) to the water. While you’re pushing the Nuke, Crog-Zilla will launch Crogs eggs and Fireballs at you. He’ll do this whenever the nuke stops then starts moving again. Zombies will also start spawning. 
The eggs and fireballs can be shot out of the sky. Doing this will allow you to keep the nuke moving (because you won’t have to move away from it, which will stop it moving), meaning Crog-Zilla won’t fire more eggs/fireballs.
Once the Nuke reaches the water, it will stop moving, and launch into Crog-Zilla’s mouth.
Crog-Zilla will now get new attacks such as its insta-kill ground slam (indicated by raising either one or both claws), and laser beam (the antenna thing on its head will glow).
To avoid the ground slam, run from the area you’re currently in (example if you are on the elevated area near the OSA wallbuy, run across the bridge toward the RV Park. Tip: Keep moving until it slams its claw(s).
The laser beam attack, frankly, sucks and you will not need to move far to avoid it.
While attacking, a part of Crog-Zilla’s chest will glow. Using the death rays around the Beach, you will need to shoot the chest. After one successful hit (indicated by a skull icon), the chest will stay glowing and you can attack it whenever. Once the chest is hit once, you can also shoot the chest with the Spartan SA3 (there is a wallbuy near where the Nuke spawned). Death Ray locations:
Beside the OSA Wallbuy
On the path to RV Park
On the path up to the main street
After hitting the chest 3-4 times, the glowing part will disappear, and Crog-Zilla will stop attacking. All players must interact with the cart that the Nuke was on to start charging it.
Crog-Zilla will now “spit” radiation onto the front part of the beach. Standing in this radiation will do damage to you. Crog-Zilla will then shoot two sets of eggs/fireballs. After the two sets, Crog-Zilla will spit more radiation.
You must defend yourself there against Zombies and Crogs until the radiation makes it under the bridge. After the set of two eggs, the radiation will clear and lasers will spawn. All players must jump and slide to avoid the lasers to make it to the Nuke cart. There is a timer so go through the obstacle course quickly, but don’t rush yourself and make mistakes; the timer is loose enough to allow you to take your time with the more difficult jumps/slides. Try to always be moving.
If a player doesn’t make it to the Nuke in time, the lasers will disappear, then you’ll have to interact with the Nuke cart again. Crog-Zilla will spit radiation again, but this time only one set of eggs will be launched per spit, making this go by a lot quicker.
When all players have interacted with the Nuke after making through the lasers, you will be brought into Crog-Zilla's belly. You must input the code you got from the safe the same way you used the machine in spawn to make the Zombie. Each player gets 3 strikes per attempt, and 3 full attempts to input the code.
If you successfully input your code but a partner in co-op doesn’t, you can go over and do it for them; every player has to input the code.
If you fail by getting three strikes or taking too long, you’ll have to redo the radiation spit defence, and the obstacle course again. 
When you have input the code correctly, you will be teleported out of Crog-Zilla and the cutscene will start. Unlike the other maps, there is no Soul Key for you to pick up after the fight, but if you’re in Director’s Cut mode, the Talisman will spawn on the Beach.
"""

arr = str.split('\n')

for item in arr:
    if item != '':
        print(f"<li>{item}</li>")