import se4son1 from '../se4son/se4son1.webp'
import se4son2 from '../se4son/se4son2.webp'
import se4son3 from '../se4son/se4son3.webp'
import se4son4 from '../se4son/se4son4.webp'
import se4son5 from '../se4son/se4son5.webp'
import se4son6 from '../se4son/se4son6.webp'
import se4son7 from '../se4son/se4son7.webp'
import se4son8 from '../se4son/se4son8.webp'
import se4son9 from '../se4son/se4son9.webp'
import se4son10 from '../se4son/se4son10.webp'

import diseaseme1 from '../diseaseme/diseaseme1.webp'
import diseaseme2 from '../diseaseme/diseaseme2.webp'
import diseaseme3 from '../diseaseme/diseaseme3.webp'
import diseaseme4 from '../diseaseme/diseaseme4.webp'
import diseaseme5 from '../diseaseme/diseaseme5.webp'
import diseaseme6 from '../diseaseme/diseaseme6.webp'
import diseaseme7 from '../diseaseme/diseaseme7.webp'

import drumbeater1 from '../drumbeater/drumbeater1.webp'
import drumbeater2 from '../drumbeater/drumbeater2.webp'
import drumbeater3 from '../drumbeater/drumbeater3.webp'
import drumbeater4 from '../drumbeater/drumbeater4.webp'
import drumbeater5 from '../drumbeater/drumbeater5.webp'

import cuberis1 from '../cuberis/cuberis1.webp'
import cuberis2 from '../cuberis/cuberis2.webp'
import cuberis3 from '../cuberis/cuberis3.webp'
import cuberis4 from '../cuberis/cuberis4.webp'
import cuberis5 from '../cuberis/cuberis5.webp'
import cuberis6 from '../cuberis/cuberis6.webp'

import pos1 from '../pos/pos1.webp'
import pos2 from '../pos/pos2.webp'
import pos3 from '../pos/pos3.webp'
import pos4 from '../pos/pos4.webp'
import pos5 from '../pos/pos5.webp'

import ai1 from '../tps/ai1.webp'
import alertedpatrolling from '../tps/alertedpatrolling.webp'
import behaviourtree from '../tps/behaviourtree.webp'
import covers from '../tps/covers.webp'
import fsm1 from '../tps/fsm1.webp'
import fsm2 from '../tps/fsm2.webp'
import investigation from '../tps/investigation.webp'
import patrolling from '../tps/patrolling.webp'

import STBanner from '../strangerthings/STBanner.webp'
import broken1 from '../strangerthings/broken1.webp'
import broken2 from '../strangerthings/broken2.webp'
import laboratory1 from '../strangerthings/laboratory1.webp'
import laboratory2 from '../strangerthings/laboratory2.webp'
import tab1 from '../strangerthings/tab1.webp'
import tab2 from '../strangerthings/tab2.webp'
import tab3 from '../strangerthings/tab3.webp'
import prototype from '../strangerthings/prototype.webp'

const code = (lang, src) => `~~~${lang}\n${src.trim()}\n~~~`;

const isVisible = String.raw`public bool IsSomethingVisible(GameObject something, bool isTrigger = false)
{
    if (something == null)
        return false;

    // Check if the object is too far from me
    if (Vector3.Distance(something.transform.position, eyesPosition.position) > viewRadius)
        return false;

    // Calculate the direction vector between me and the object
    Vector3 direction = (something.transform.position - new Vector3(eyesPosition.position.x, something.transform.position.y, eyesPosition.position.z)).normalized;

    // Check if the object does not fall in my vision cone
    if (Vector3.Angle(direction, eyesPosition.forward) > viewAngle / 2)
        return false;

    Ray shootRay = new Ray();
    RaycastHit shootHit;
    shootRay.origin = eyesPosition.position;
    shootRay.direction = ((something.transform.position + Vector3.up * something.transform.lossyScale.y / 2.2f) - eyesPosition.position).normalized;

    // Perform the raycast against gameobjects and if it hits something...
    if (Physics.Raycast(shootRay, out shootHit, viewRadius, hitLayer, isTrigger ? QueryTriggerInteraction.Collide : QueryTriggerInteraction.Ignore))
    {
        // ... test if it is the player
        if (shootHit.collider.transform.gameObject.CompareTag(something.tag))
            return true;
    }

    // If the tests above failed, then the object is not visible
    return false;
}`;

const perceptionRaycast = String.raw`perceptionHits = Physics.RaycastAll(shootRay, range, perceptionLayer, QueryTriggerInteraction.Collide);
System.Array.Sort(perceptionHits, (x, y) => x.distance.CompareTo(y.distance));

foreach (RaycastHit hit in perceptionHits)
{
    if (hit.transform.gameObject.layer == LayerMask.NameToLayer("Wall") || hit.transform.gameObject.layer == LayerMask.NameToLayer("Default"))
        break;
    hit.transform.GetComponentInParent<AISenses>().shot();
}`;

const potentialCovers = String.raw`public List<Cover> getPotentialCovers()
{
    List<Cover> potentialCovers = new List<Cover>();

    foreach (Cover c in repairs)
    {
        if (c.free && !c.isVisible && Vector3.Distance(c.gameObject.transform.position, Status.instance.playerLastPosMarker.transform.position) > 5)
            potentialCovers.Add(c);
    }
    return potentialCovers;
}`;

const checkVisible = String.raw`private void checkVisible()
{
    RaycastHit hit;
    Vector3 hypotheticalCameraPosition = Status.instance.playerLastPosMarker.transform.position + Vector3.up * 2;
    Vector3 direction = (transform.position - hypotheticalCameraPosition).normalized;

    if (Physics.Raycast(hypotheticalCameraPosition, direction, out hit, Mathf.Infinity, mask))
        isVisible = hit.transform.gameObject == gameObject ? true : false;
}`;

const shotOffset = String.raw`Vector3 playerPos;
if (GetComponentInParent<AISenses>().seeingPlayer)
    playerPos = GetComponentInParent<AISenses>().player.transform.position;
else
    playerPos = Status.instance.playerLastPosMarker.transform.position;

float distance = Vector3.Distance(transform.position, playerPos);
float distanceOnRange = distance / range;

Vector3 offset = new Vector3(Random.Range(-maxOffsetX * distanceOnRange, maxOffsetX * distanceOnRange), 
                             Random.Range(-maxOffsetY * distanceOnRange, maxOffsetY * distanceOnRange), 
                             Random.Range(-maxOffsetZ * distanceOnRange, maxOffsetZ * distanceOnRange));
`;

export const projects = [
    /* {
        title: 'Echoes of Deepcrest',
        date: 'WIP',
        teamsize: '1',
        duration: '-',
        role: ['Game Designer', 'Narrative Designer', 'Programmer', 'UX Designer'],
        shortDescriptionEng: "Echoes of Deepcrest is a metroidvania game in which lovecraft's inspired cosmic horrors mix with nature fantasy and wood's elements.",
        descriptionEng: [
  {
    heading: "Overview",
    body: ``,
  }
],
        images: [],
        videos: [],
        tags: ['C#', 'Unity', 'Metroidvania'],
    }, */
    /* {
        title: 'GenGram - Procedural Dungeon Generator',
        date: '2025',
        teamsize: '1',
        duration: '4 months',
        role: ['Programmer'],
        shortDescriptionEng: "A procedural dungeon generator that uses genetic algorithms and shape grammar to generate dungeons in real-time during the game or in the development phase to support rapid prototyping",
        descriptionEng: [
            {heading: "Overview",
            body: `
            `},

            ],
        images: [],
        videos: [],
        tags: ['C#', 'Unity', 'Game Programming', 'Genetic Algorithms', 'shape grammar', 'AI', 'PCG' ],
    }, */
 
    {
        title: 'Drum Beater VR',
        date: '2022',
        banner: drumbeater3,
        teamsize: '2',
        duration: '4 months',
        role: ['Game Designer', 'Programmer', 'UX Designer'],
        shortDescriptionEng: "A VR rhythm game that takes you to play virtual drums to the beat of the music.",
        descriptionEng: [
            {heading: "Overview",
            body: `Drum Beater is a VR rhythm game developed during university's Virtual Reality course. Players use hand tracking via Leap Motion and Google Cardboard to hit virtual drums to the beat of the music, choosing between 3 difficulty levels mapped through custom MIDI files.

MIDI files were chosen as the charting format for several reasons. Compared to custom JSON, they are less error-prone to author and easier to synchronize with the audio track. Compared to automatic beat detection, they give full manual control over note placement and difficulty design. Moreover, a song's track can be converted into a playable chart simply by exporting it from any DAW, with no manual note entry required.

Charts were created and edited through a MIDI editor, keeping the pipeline fast and completely decoupled from code - changing a chart never meant touching Unity scripts. The game was designed taking inspiration from Band Hero and focusing on the expressiveness of drumming.

My contributions to the project include:

- Designed and iterated song charting across 3 difficulty levels using MIDI files;
- Designed UX feedback systems for timing comprehension, including visual cues for hit accuracy;
- Programmed beat-matching, timing-windows synchronization, MIDI import, score system, hand gesture recognition, and data saving;
- Curated the game's look & feel: created UI icons and fine-tuned visual and audio feedback for the VR experience;
- Managed task planning and edited the gameplay trailer.
            `},

            ],
        images: [drumbeater1, drumbeater2, drumbeater3, drumbeater4, drumbeater5],
        videos: [{
                    heading: 'Trailer',
                    url: 'https://www.youtube.com/watch?v=K2DC3FLJgUM',
                },
                {
                    heading: 'Full song gameplay',
                    url: 'https://www.youtube.com/watch?v=EfNXGw415XY',
                }
            ],
        tags: ['VR', 'C#', 'Unity', 'Game Design', 'UX Design', 'Game Programming', 'Rhythm game'],
    },
    {
        title: 'TPS Enemy AI',
        date: '2022',
        banner: ai1,
        teamsize: '1',
        duration: '4 months',
        role: ['Game Programmer'],
        shortDescriptionEng: "A simple AI for enemies that patrol, shoot and take covers in a third person shooter. With a blockout of a simple level.",
        descriptionEng: [
            {heading: "Overview",
            body: `For this project I developed an AI for a group of agents of a 3D third person shooter stealth game, in which groups of enemies patrol an area and react to the presence and actions of the player, shooting them, healing or getting cover.

To do so, I used an Hierarchical Finite State Machine and a Behavior Tree for decision making and Unity's NavMesh for pathfinding.

In particular, the AI is able to:

- Patrol
- Investigate a position considered suspicious
- Shoot
- Take cover
- Reload the weapon
- Heal
- Retrieve medkits from dead bodies

A very simple level design and blockout was done to prototype and test the AI.
            `},
            {heading: "AI Design",
            body: `**Patrolling**

When the player has not been spotted yet, the AI patrols the area, following a certain path and stopping at waypoints. 

![Patrolling paths](${patrolling})

When the AI is aware of the player's presence, the waypoints change and it enters into an alerted patrol.
            
![Alerted patrolling paths](${alertedpatrolling})

**Investigation**

When the AI sees the dead body of another agent, or doesn't see the player for a while after they were spotted, it searches for the player in the suspected position and the near possible hiding positions. The AI returns to an alerted patrol, together with other agents, if it doesn't find them.

![Investigation sites](${investigation})

**Shooting**

Once the player is spotted, the AI can shoot them. This happens both if the player is uncovered or covered, to put pressure. The probability to shoot in the two cases is different: if the player is uncovered the probability to shoot is higher.

If the shot can't reach the player's surrounding area, the agent moves towards him/her until the shot can reach them.

**Take cover**

The agent can take cover to flee from the player or to protect itself during reloading and healing.

To have a more dynamic behavior, the agent is able to take cover even after firing a random number of shots (between 2 and 5).

The covers the agent can choose depend on three things: 

- If it is occupied by another agent.
- If the cover is visible to the player.
- The distance between the cover and the player.

![Cover points](${covers})

**Heal and reload**

Each agent starts with 1 medikit to heal itself when its health is below 50%, but it can use it only when in cover, while the reload can be done both when it is in cover or after shooting.


**Retrieving medikit**

When agents don't have medikits available and their health is below 50%, they can take the medikits of another dead agent, choosing it between those who still have a medikit and are not visible to the player.
            `},
            {heading: "Implementation",
            body: `**Perception**

The perception module of the AI is used to retrieve the informations needed during the decision making. These data can concern both the internal knowledge of the agent and the external knowledge about the world state.

The world state is saved in the class Status, in particular it saves:

- The last time the player has been seen: Saved as seconds from the start of the application;
- If the player has been spotted;
- The last known position of the player: Saved as a placeholder, represented by an empty gameobject in the Unity hierarchy, with just a trigger collider attached to it;
- A list of agents that are actually shooting the player;
- The unseen dead agents;
- All the covers of the map;
- An array containing the living agents: Sorted based on the distance between him and the player, updated every 5 seconds.

During the game, the AI doesn't refer directly to the player position, but always to the placeholder, to give the idea to the player that the AI doesn't actually know where they are, except during the shoot if the player is visible.

**Agent's sensing**

The class AISenses takes care of managing the agent's sensing, checking if the agent is seeing the player or the dead body of another agent, through the method IsSomethingVisible:

${code("csharp", isVisible)}

This method is called in a Coroutine which is started in the Start method. The coroutine at each frame calls IsSomethingVisible passing the player as parameter.

If the player has already been spotted it would just update the state in the Status class, otherwise the agent will spot the player only if they have been visible for a certain time (inversely proportional to the distance) or if the distance is less than a certain threshold.

Other ways the player can be spotted are

- If they touch the agent, through the OnCollisionEnter method;
- If they shoot the agent and the shot hits it or passes within a certain distance from the agent.

To check if a shot passes near an agent, a trigger collider is attached to a child gameobject, and when the player shoots, a raycast is performed to check if it collides with the child gameobject's collider. The raycast stops on the first occurrence of a solid object.

${code("csharp", perceptionRaycast)}

**Decision making**

For the decision making, a Hierarchical Finite State Machine was used, which at each step checks the conditions needed to go from one state to another and triggers the relative transition if the conditions are met. It has also been evaluated to use a Decision Tree during the early phase of the project, but the HFSM has been deemed more straightforward and easier to design and maintain.

The base layer FSM is made of 4 states:

- Patrol: The patrol state is the starting state of the FSM. When starting the game the agents start to patrol following a certain path, until a transition to another state is triggered. When the agent is aware of the player's presence, the path of the patrolling and the speed of the agent change.
- Investigate: The agent enters this state when it sees a dead body of another agent (if player has not been spotted), if the player has not been seen for a certain time or if it sees that the player is no more in the last known position. The agent will investigate the position of the dead body or the one of the player, searching for him/her in the surrounding area.
- Search Medikit: When entering this state, the agent will go to take the medikit of one of the dead agents.
- Combat: The internal FSM which manages the agent's behavior during the fight with the player.

![Base fsm](${fsm1})

The inner FSM Combat manages the agent's behavior during the fight with the player, deciding if the agent has to take cover or shoot. The idle state is used as a transitory state for two reasons:

- To decide the right state for the agents based on the current world state and internal knowledge
- In order to add a bit of randomness for the first state of the combat FSM.

![Combat fsm](${fsm2})

Healing and reloading happens in the Cover state, when the agent has reached the chosen cover.

Considering the kind of game, a value similar to the human's reaction time (330ms) for the update time value of the FSM should be enough, so I have found a value of 0.5 seconds to be quite good considering both performances and behavior's believability.

**Cover choice**

To choose the cover, tests on the possible covers are made, in particular, it should not be occupied by another agent, it should not be visible to the player and it should be quite far away from the player. So the method getPotentialCovers() is called.

${code("csharp", potentialCovers)}

Then between all the potential covers found, the agent chooses the closest one. 

The visibility of a cover is evaluated through a coroutine present in the class Cover, which calls the method checkVisibility every 0.5 seconds.

${code("csharp", checkVisible)}

Since the agent has to refer to the last known position and not to the current position of the player, an hypothetical position for the camera is computed, rather than the real position of the camera, and it is used to calculate the direction of the raycast. This mechanism simulates the perception that the player is still there and thus that they can see the cover.

No assumptions are made about the camera field of view and orientation, because the cover is considered visible even if the player is not directly looking at it.


**Shooting**

The fire state of the HFSM runs a Behavior Tree which evaluates what to do before shooting. In particular, since there is the possibility for the agent to not go to cover when the gun is empty, it first evaluates if it needs to be loaded, then it evaluates if the shot can reach the player and in case it shoots, otherwise it goes towards the player. The probability to go to cover when the gun is empty is calculated during the stay action of the Fire state, after the step of the behavior tree.

![Behaviour Tree](${behaviourtree})

The probability to actually shoot the player during the fire action depends on if the player is behind a cover or they are actually visible to the agent. In particular after some testing I have considered the behavior believable using a probability of 85% in case the player is uncovered and 50% in case the player is covered. If the agent hasn't shot for a certain time then it just shoots without considering the probability.

The precision of the shot depends on the distance between the agent and the player, with a maximum offset when the distance is the same as the agent's range:

${code("csharp", shotOffset)}

After testing I've found that using 2 as value for the maximum offsets is a good compromise.
            `},
            ],
        images: [],
        videos: [],
        tags: ['C#', 'Unity', 'Game Programming', 'AI', 'HFSM', 'Behaviour tree'],
    },
    {
        title: 'Disease Me',
        date: '2020',
        banner: diseaseme2,
        teamsize: '3',
        duration: '5 month',
        role: ['Game Designer', 'Narrative Designer', 'Programmer'],
        shortDescriptionEng: "A 3D side-scroller puzzle platform game for two players, embarking on a journey inside a boy's mind to get rid of his demons.",
        descriptionEng: [
  {
    heading: "Overview",
    body: `Disease Me is a 3D side-scrolling co-op puzzle platformer developed during the Online Game Design course at university, winner of the NGD Contest 2020.

The game's narrative explores depression and the struggle to overcome past traumas. One player controls a boy; the other plays as Hoop, a spirit representing his will to live. The two characters have asymmetric, complementary abilities. This asymmetry was designed to enforce constant communication between players, reinforcing the narrative of dependency and mutual support in overcoming depression.

Some of my contributions:

- Crafted the narrative design for a co-op campaign of 6 levels, including storyboarding and design documentation;
- Conducted target analysis on age, gender and player type based on Bartle's taxonomy to define the game's audience;
- Gameplay scripting: enemies' AI via FSM, camera system, co-op networking, environment puzzles, data saving;
- Designed environment puzzles for the co-op campaign;
- Estimated server workload and user distribution based on expected concurrent players and data usage;
- Art directed the CG artist on character and environment 3D asset creation and animation;
- Edited the concept trailer and the gameplay trailer.`,
  },
    {
    heading: "Links",
    body: `[Full Game Design Document](https://drive.google.com/file/d/1SgYs8Krph4HashlBf7sckDENSdGwAakE/view)

[Technical Document](https://drive.google.com/file/d/1sUiNVSuva-nmhrmt6w4bQ0TdhUoc3pX2/view)

`,
  }
],
        images: [diseaseme1, diseaseme2, diseaseme3, diseaseme4, diseaseme5, diseaseme6, diseaseme7],
        videos: [],
        tags: ['C#', 'Unity', 'Game Design', 'Narrative Design', 'Game Programming', 'FSM', 'Puzzle adventure', 'Online multiplayer'],
    },
    {
        title: 'Stranger Things: Lost Contacts',
        date: '2020',
        banner: STBanner,
        teamsize: '3',
        duration: '4 months',
        role: ['Level Designer', 'Narrative Designer'],
        shortDescriptionEng: "A level design project developed during university for a game set in the world of Stranger Things.",
        descriptionEng: [
  {
    heading: "Overview",
    body: `Stranger Things: Lost Contact is a project developed during the Level Design course. During the project we had to develop a narrative, an overall world and levels structure and a detailed level design (for a level of our choice) for a videogame based on the Stranger Things world and the D&D manual, producing documentations and digital/physical prototypes of the level.

The story revolves around a doppelganger of Eleven being created in the Upside Down during the Season 1 finale. This double retains all the memories of the original Eleven, but ends up in a russian military base trying to come out of the Upside Down and now needs to find a way to go back to Mike and her friends again.

My contributions include:

- Designed two skill charts (in-combat/off-combat) with 10 unique abilities and 29 upgrades across a 45-level progression system;
- Conceived the upside down/normal world switch mechanic.
- Designed sections 2 and 3 of the level (the laboratory and the collapsed laboratory), including world and section diagrams;
- Collaborated with a writer to integrate level and narrative design into a coherent experience;
- Wrote and maintained the Level Design Document and the Data Management Document (linked above);
- Prototyped the level both digitally and physically - collected feedback from colleagues, friends and family to balance difficulty;
- Balanced and tested difficulty curve by managing resources, combat encounters and skill usage.
`,
  },
  {
    heading: "The World Switch Mechanic",
    body: `Considering the relatively small world in which the game is set, we needed a way to expand the game world and create greater variety. Fortunately, the Stranger Things universe offers a parallel world (the Upside Down) which Eleven can potentially enter by opening portals, as we saw at the end of Season 1.

By incorporating this mechanic into the game, we've added the variety we were looking for and introduced a layer of tactical depth to the player's movement, including through other unlockable abilities that allow the player to sense or see who is in the parallel world, enabling the player to adopt a more stealthy approach to exploration and progressing through the story.`,
  },
    {
    heading: "Level Design Section 2 (The laboratory)",
    body: `The level we chose to design in detail was the 9th. This level is a nightmare induced by the Upside down and is a very important turning point for her in the story. In the first section of the level, Eleven sees her friends but is unable to reach them, becoming increasingly frustrated at the thing until the spider monster arrives and starts chasing her.

The second section, on the other hand, is set in Hawkins' lab and continues the nightmare that eleven is having, with the upside down using her memories to manipulate her, using Dr. Brenner as a conduit. 

In this section, the goal of Elevel is to go out of the laboratory using the locked exit door shown in the very first part of the section and the objective of the player is to find 4 of the 5 keys necessary to open the door and put them in their correct slot on the door. Each key has a letter engraved on it and the correct order is deducted by the number printed on the slot that needs to match the letter's position in the alphabet. As a hint to the player, one of the key is already inserted in the right slot.

The player has to explore the laboratory, both in the normal world and in the upside down to find the keys, while having the voice of Dr. Brenner talking and inviting Eleven to stay with him in the Upside Down, recalling a sort of Hellblade kind of voice in the head or also Micolash talking during his bossfight in Bloodborne.
![Seasons preview](${laboratory1})
![Seasons preview](${laboratory2})
`,
  },
  {
    heading: "Level Design Section 3 (Broken laboratory)",
    body: `Once the player reaches the exit, the laboratory crumbles, revealing that Eleven never actually left the astral plane during the nightmare, with some of the rooms that are still floating, connected by some scattered pieces of walls, cealings and floors.

I wanted to give the player a sense of fear and strong danger in the culmination of this nightmare, and I got inspired by the Scarecrow's nightmares in Batman: Arkham Asylum, putting Eleven in a collapsed environment at the center of which there is the Spider Monster, with the player having to move between rooms avoiding the gaze of the Spider Monster to reach some special rooms that will collapse to damage it. Additionally the player needs to rotate the rooms with a mechanism present in them, so that their exits match the paths.

**Level Diagram**

![Seasons preview](${broken1})
![Seasons preview](${broken2})
![Seasons preview](${tab1})
![Seasons preview](${tab2})
![Seasons preview](${tab3})

**Physical Prototype**

A physical prototype was made to test the room puzzles in this section, and various people including colleagues, friends, and family members served as testers, using their feedback to balance the difficulty.

![Seasons preview](${prototype})
`,
  },
    {
    heading: "Links",
    body: `[Full Level Design Document](https://drive.google.com/file/d/1EqXEBdgmnZGHlcexh3FA7WoO3KMAAaqk/view)

[Data Management Document](https://drive.google.com/file/d/1zcPP_ChjK9G1OhR8ZhbnHTkYo6t59sTu/view)

`,
  }
],
        images: [],
        videos: [],
        tags: ['Level Design', 'Narrative Design'],
    },
    {
        title: 'Se4son',
        date: '2020',
        banner: se4son4,
        teamsize: '3',
        duration: '5 months',
        role: ['Programmer'],
        shortDescriptionEng: "An interactive 3D graphics demo. It features a natural scene that can be explored from a first-person perspective, with changing seasons and weather conditions.",
        descriptionEng: [
  {
    heading: "Overview",
    body: `This was my project for the real-time graphic programming course. The main purpose was to re-create real world situations and phenomena present in the 4 seasons.
The virtual world is depicted as a forest positioned on a suspended isle, bordered by rocks, whose purpose is to limit the movement of the character within the terrain.

![Seasons preview](${se4son10})

Each season has its own characteristics: lighting of the sun coming from different points according to the season (in this case we have considered the two equinoxes and the two solstices), phenomena such as rain, snow and fog, each one present only in certain seasons, and characteristics of trees and ground that change according to the season.

Moreover, we have realized footsteps using the tessellation technique and a circular transition for season change. Finally we added a collision detection to prevent the character from crossing the models or coming out of the ground.

My contributions include:

- Fully implemented collision detection;
- Fully implemented particle system for rain and snow;
- Season change transition;
- Snow accumulation on the ground;
- Object positioning in world coordinates;
- Tessellation shader for footprints;
- Performance optimization and code cleaning.`,
  },
  {
    heading: "Performance",
    body: `Performance-wise, the main goal was to stay above a minimum of 30 frames per second and it was reached in every scenario with a rendering resolution of 1920x1080.

Some of the methods adopted to avoid useless operations and enhance performances include clipping, uniform variables caching and tessellation focusing.`,
  },
  {
    heading: "Tech Stack",
    body: `The project was developed using C++ and OpenGL 4.2. Libraries we used include:

- **GLFW**: to manage input, OpenGL context and window;
- **glm**: as mathematics library;
- **glad**: to use OpenGL functions;
- **assimp**: for model loading;
- **stbi**: for texture loading.`,
  }
],
        images: [se4son1, se4son2, se4son3, se4son4, se4son5, se4son6, se4son7, se4son8, se4son9],
        videos: [{
                    heading: 'Demo Video',
                    url: 'https://www.youtube.com/watch?v=jhkbkmBuBdg',
                }
            ],
        tags: ['C++', 'Low-Level Graphics', 'GLSL', 'Game Programming', 'Real-Time Rendering', 'Shader Programming'],
    },
    {
        title: 'Path Of Sacrifice',
        date: '2020',
        banner: pos1,
        teamsize: '5',
        duration: '3 months',
        role: ['Game Director', 'Level Designer', 'Programmer'],
        shortDescriptionEng: "A platform adventure game, in which the player must sacrifice one of his ability at the end of each level in order to access to the next one.",
        descriptionEng: [
            {heading: "Overview",
            body: `Path of Sacrifice is a 2D platform adventure game that follows the journey of Hermod to save his brother Baldr from Helheim.

I pitched this game for the Video game Design and Programming class and it was one of the 20 games chosen by students vote to be implemented during the three months of the course.
The goal was to propose an experimental game, which in this case consists of having a reverse progression for player skill through the game. The player starts gaining the skills during the tutorial and then at each level they progressively lose one of them. The idea was to make the player find new strategies to overcome the obstacles. The game was highly appreciated by other students and was rated with full grade, ending up being one of the best of the course.

Some of my contributions:

- Pitched the game
- Directed a team of 4 other people including 3 programmers and 1 artist.
- Scheduled activities following given milestones and deadlines.
- Worked on the game narrative design and dialogues.
- Designed all levels in the game.
- Gameplay scripting (Data saving, Checkpoint system, Dash movement, and others).
            `},
            {heading: "Post Mortem",
            body: `Looking back to it, the game actually lacks from different points of view, first among all the platforming system. It doesn't feel as good to play as I wanted being inspired by great platformer games like Celeste, Mario, Super Meat Boy, etc... and this is due to many things we missed during the development from a design point of view, which can be resumed in two words: forgiveness and feedback... no coyote time, no jump buffering, no camera shakes, no gravity decreasing etc.

Plus I personally think the structure of the game and the skills should have been investigated more and other things could have been better. 

But at the end, with the amount of time and experience we had, I am fairly happy with how it ended. As I said, it was considered by other students and the professor as one of the best games, but most importantly it teached me many things about design, programming, teamwork, team direction and more.
            `},
            ],
        images: [pos1, pos2, pos3, pos4, pos5],
        videos: [{
                    heading: 'Trailer',
                    url: 'https://www.youtube.com/watch?v=K4kiT3QWrvA',
                },
                {
                    heading: 'Gameplay',
                    url: 'https://www.youtube.com/watch?v=rkwSdPApLw4',
                }
            ],
        tags: ['C#', 'Unity', 'Game Design', 'Level Design', 'Game Programming', 'Platform adventure'],
    },
    {
        title: 'Cuberis',
        date: '2019',
        banner: cuberis3,
        teamsize: '1',
        duration: '1 month',
        role: ['Game Designer', 'Programmer', 'UX Designer'],
        shortDescriptionEng: "An endless puzzle game. Reinterpretation of the famous and immortal tetris, in which the player has at his disposal 4 different game boards.",
        descriptionEng: [
  {
    heading: "Overview",
    body: `Cuberis is an endless puzzle game, a reinterpretation of Tetris in which the player can use 4 different boards to place pieces on. It was a solo project that I developed as my first Unity game, taking care of all aspects of the game: game design, scripting, UI/UX and more.

The boards are distributed along a parallelepipedon that is rotated to switch game board and, in order to clear a row and take points, the player must complete the row along the entire perimeter.`,
  },
    {
    heading: "Links",
    body: `[Play it on itch.io](https://giocriscuolo.itch.io/cuberis)`,
  }
],
        images: [cuberis1, cuberis2, cuberis3, cuberis4, cuberis5, cuberis6],
        videos: [],
        tags: ['C#', 'Unity', 'Game Design', 'UX Design', 'Game Programming', 'puzzle'],
    },
];