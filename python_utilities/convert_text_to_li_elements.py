str = """Unlock the Director’s Cut mode.
Complete the first four Main Quests again in Director’s Cut mode (not including Beast). 
Complete The Beast From Beyond Quest. Upon completion, you will be put into the Mephistopheles boss fight (See the Mephistopheles Boss Fight section for how to beat him).
After defeating Mephistopheles, complete the Main Quest on Zombies in Spaceland while playing as Willard Wyler. 
Upon completion, the mode’s final cutscene will play, and you will unlock the Willard's Test animated calling card
"""

arr = str.split('\n')

for item in arr:
    if item != '':
        print(f"<li>{item.strip()}</li>")