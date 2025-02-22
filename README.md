wargames
========

Back in 2014 this was a real-time multiplayer global thermonuclear war game, built using the Google Maps API. It looked like this.

![2D Google Maps screenshot covered in red geodesic lines indicating missile trajectories and red circles indicating explosion sites](https://henry.catalinismith.com/2024/02/13/wargames.png)

It was in the news for a while because my landlord saw the designs for it and thought they were [suspicious enough to report me to the police](https://www.theguardian.com/technology/2014/aug/26/police-video-game-developer-global-thermonuclear-war-plans). That's probably why you've heard of it.

The news coverage generated a surge of interest in the game, but I didn't really do much with the traffic except for enjoying the learning experience of keeping a Node backend online with lots of traffic. In its glory era the game was a strangely artistic experience where you'd have these weird little exchanges of fire with people from all around the world, then get bored of that and try to draw something in the map using the explosion circles, then get bored of that and close the tab. There was no way to win, which was partly an on-purpose reference to the film, and partly because I didn't know how to code one.

After a while the traffic from the news coverage faded away and the game's long-term fanbase turned out to be weird gravy seal 4chan racists who got a kick out of nuking Middle Eastern countries and sending each other creepy little screenshots of it with captions like TANGO DOWN. So eventually I took the server offline.

If you're curious about what the code for a multiplayer JavaScript game looked like circa 2014, [`falken.js`](https://codeberg.org/henrycatalinismith/wargames/src/branch/main/src/falken.js) contains the client-side code and [`joshua.js`](https://codeberg.org/henrycatalinismith/wargames/src/branch/main/src/joshua.js) contains the back-end. If you're sad you missed the live experience, the video below is a visualisation of some of the millions of missiles that players launched while the game was online in the mid 2010s. It really did look this intense in its heyday and I had a lot of trouble getting the Google Maps API to cope with animating so many geodesic lines at once.

https://github.com/henrycatalinismith/wargames-wip/assets/566159/8c618d5e-7e73-46cc-97a7-81ea3136b603

And if you'd like to watch an even longer version of that, check out [henry.catalinismith.com/wargames](https://henry.catalinismith.com/wargames) for a Three.js-based demo that serves as a kind of shrine to this odd little episode in web history.

## License

[MIT](https://codeberg.org/henrycatalinismith/wargames/src/branch/main/license)
