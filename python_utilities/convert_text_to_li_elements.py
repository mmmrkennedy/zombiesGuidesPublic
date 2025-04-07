str = """The Mephistopheles (Meph for short) boss fight is very complicated, and I feel I can’t effectively explain it with in the website’s format. See this video (https://www.youtube.com/watch?v=5MzGgYfQ08o&t=139s) by samuel the 17th (https://www.youtube.com/@samuelthe17th) for how to beat the fight (this video is half educational, and half entertainment, but it was the best one I could find).
Tips for completion:
ALWAYS, ALWAYS, ALWAYS pay attention to Meph. All the attacks have specific animations that indicate the coming attack. The only exception to this is the Wall spawning/Zombie spawning animation, which share the raises both arms animation. I always assume this is the wall attack, and get out of the way.
Prioritize safety over completion. There is no downside to taking your time and being safe. It will probably save you time when you consider the reset time (redoing the Beast Quest). Don’t try to be the hero, and die standing on the talisman circle; just run, be safe, and try again.
Practice in the Boss Battles mode. The worst part of the Meph fight is the long reset time when you die. This can be mitigated by playing in the Boss Battles mode in the lobby menu. You won’t get the rewards, but you will be able to quickly retry the fight after dying.
"""

arr = str.split('\n')

for item in arr:
    if item != '':
        print(f"<li>{item.strip()}</li>")