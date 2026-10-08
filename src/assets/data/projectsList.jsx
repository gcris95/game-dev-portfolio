import breath from '../breath.webp'

export const projects = [
    {
        title: 'Drum Beater VR',
        date: '2025',
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
        images: [breath],
        videos: [{
                    heading: 'Gameplay Trailer',
                    url: '',
                },
                {
                    heading: 'Full song gameplay',
                    url: '',
                }
            ],
        tags: ['VR', 'Unity', 'C#', 'Game Design', 'UX Design', 'Game Programming'],
    },
    {
        title: 'Drum Bes',
        date: '2025',
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
        images: [breath],
        videos: [{
                    heading: 'Gameplay Trailer',
                    url: '',
                },
                {
                    heading: 'Full song gameplay',
                    url: '',
                }
            ],
        tags: ['VR', 'Unity', 'C#', 'Game Design', 'UX Design', 'Game Programming'],
    },
];