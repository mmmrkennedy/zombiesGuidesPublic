str = """Activate Power.
There are four Floppy Disks you need to collect around the map. These Floppy Disks can be collected in any order, each has a different symbol on it, and only one can be held at a time. Locations/collection methods:
Floppy Disk 1
Unlock Pack-a-Punch.
This floppy disk is dropped by the first Phantom (big blue Cryptid) you kill. One will always spawn the first time you leave the PAP Projector room.
Make sure to kill the Phantom near N31L to save you time later.

Floppy Disk 2
Unlock Pack-a-Punch.
This floppy disk is always sitting in the snow at the base of a pillar, left of the PAP Portal.

Floppy Disk 3
Obtain the Entangler weapon from Skull 2 of the Skull Breaker side quest.
In the hallway with the Proteus wallbuy, there will be a fence blocking a red room, under/near some stairs.
The vent on the floor at the end of the room will occasionally emit smoke and the Floppy Disk will be sitting on the floor in front of the vent. Using the Entangler, grab the Floppy Disk, and shoot it at the vent while the smoke is visable.
If you miss or shoot at the wrong time, the Disk will respawn on the floor, and you can retry.
If done correctly, the Floppy Disk will be sucked up and not respawn on the floor. It will be spit out of one of the vents near the floor around the hallway or Spawn.
Spawn - Left of the Magic Wheel
Cafeteria - Left of the Freezer, around the corner
Hallway - Right of the Cargo Bay door
Hallway - Across the hall from the previous location
Hallway - Right of the Fence where the Floppy Disk was
Hallway - At the top of the stairs
Hallway - Close to the door to the Ops Center
The Floppy Disk will stay in this location for the remainder of the game.

Floppy Disk 4
Obtain the Entangler weapon from Skull 2 of the Skull Breaker side quest.
Using the Entangler, grab a Space Helmet in the Hallway between the outside and the Cargo Bay.
Carry it over to the Medical Bay, where there is a door blocked by a force field. You need to shoot the helmet through the force field at the active monitor, above the microscope, to break it and disable the force field.
If you miss, grab another helmet from the hallway or spawn area, and try again.
The Floppy Disk can be picked on from the table left of the broken monitor.

Once you have access to all four Floppy Disks, you must insert them into N31L in the correct order based on the symbols on them. Use this image or the solver below to find the correct order. There are four slots in front of N31L that the disks can be placed in.
To use the image, find the row with all your disk symbols, then order your disks in that row’s order from left to right.
If done correctly, your scoreboard HUD will flash yellow, then red, and N31L will turn “evil.” While evil, N31L will randomly close doors (this can kill you but will most of the time just close in front of you), which you can open for free by interacting with them, and he will randomly activate traps around the map.
In the Theatre, use the Entangler to grab the button on the wall behind the Brute cardboard cutout. Take it to the Consession area, and shoot it into one of the Beast From Beyond posters.
Go to the force field room in the Medical Bay. Prone in front of the table with the Floppy Disk on it, and interact with the button under the table.
In the room with the dead cryptid, a panel with 16 handles inside will open. Note down all the handles that are currently horizontal.
Now interact with all the handles you noted down. As you interact with the handles, some will spin, make sure you interact with the ones that were initially horizontal, even if they are now vertical.
If you get to the end and some are still horizontal, flip the horizontal ones. Repeat until they are all vertical.
Once all the handles are vertical, N31L will be hacked (not evil anymore).
N31L will only be hacked for CHANGE ME before returning to evil.
You need to grab N31L with the Entangler, bring him to the Projector Room, and shoot him at this computer to “install” him. The problem with this is that once you pick up N31L all the doors around the map will close which you can’t open, and Zombies will start spawning. The only way to open them is to go where N31L is looking as you’re carrying him, which will take you on a long tour of the map.
This can and should be skipped one of two ways:
Option 1 (Recommended): Before you pick up N31L, shoot the Entangler at a N31L TV, switch weapons (while shooting), and then switch back to the Entangler. This allows you to open doors while carrying N31L.
Option 2 (Not as Recommended): Carry N31L like normal, but when you get to a locked door, spin around in front of it to (maybe) make it open. 
This works because N31L is coded to open the doors he is looking at. So when you spin, he doesn’t spin as fast as you, so you can kind of force him to look at a door.
Once N31L is in the computer and you’re boss fight ready, you can interact with it to start the Boss Fight.
"""

arr = str.split('\n')

for item in arr:
    if item != '':
        print(f"<li>{item.strip()}</li>")