import {siHtml5, siMilanote, siReact, siGit, siTrello, siTailwindcss, siTypescript, siVite, siFigma, siUnity, siNpm, siCss, siCplusplus, siC, siPython} from 'simple-icons';

const siCsharp = {
  title: 'C#',
  hex: 'A179DC',
  viewBox: '0 -1.43 255.58 290.11',
  path: 'M255.57 84.45c0-4.83-1.04-9.1-3.13-12.76a24.4 24.4 0 0 0-9.24-9C209.17 43.05 175.1 23.5 141.1 3.86c-9.17-5.3-18.06-5.1-27.16.27-13.54 7.98-81.35 46.83-101.55 58.53C4.06 67.5.02 74.87 0 84.44v118.37c0 4.72 1 8.9 2.99 12.51 2.05 3.72 5.17 6.82 9.38 9.26 20.21 11.7 88.02 50.55 101.56 58.53 9.11 5.38 18 5.57 27.17.27 34.02-19.64 68.08-39.2 102.1-58.81a24.33 24.33 0 0 0 9.4-9.25c1.99-3.61 2.98-7.8 2.98-12.52l-.01-118.35z M201.9 116.3v13.47h13.47v-13.48h6.73v13.48h13.48v6.73H222.1v13.48h13.48v6.74H222.1v13.47h-6.73V156.7h-13.48v13.48h-6.73V156.7h-13.48v-6.73h13.47V136.5h-13.47v-6.74h13.47v-13.48zm13.47 20.2h-13.48v13.48h13.48z M128.46 48.63a94.96 94.96 0 0 1 82.26 47.45l-.16-.27-41.35 23.8A47.28 47.28 0 0 0 129 96.33h-.54a47.3 47.3 0 0 0-47.3 47.3 47.08 47.08 0 0 0 6.23 23.47 47.28 47.28 0 0 0 82.29-.27l-.2.35 41.29 23.91a94.97 94.97 0 0 1-81.25 47.54h-1.06a94.96 94.96 0 0 1-95-95 95 95 0 0 1 95-95z',
};

const stack = [siHtml5, siMilanote, siReact, siGit, siTrello, siTailwindcss, siTypescript, siVite, siFigma, siUnity, siNpm, siCss, siCplusplus, siCsharp, siC, siPython];

const MIN_ITEMS = 24;
const SECONDS_PER_ITEM = 5; 

export default function Marquee({ items = stack }) {
  const repeat = Math.ceil(MIN_ITEMS / items.length);
  const group = Array.from({ length: repeat }, () => items).flat();

  return (
    <div className="marquee flex overflow-hidden border-b border-border py-6 mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      {[0, 1].map((g) => (
        <ul
          key={g}
          aria-hidden={g === 1}
          className="marquee-group flex shrink-0 items-center"
          style={{ animationDuration: `${group.length * SECONDS_PER_ITEM}s` }}
        >
          {group.map((icon, i) => (
            <li
              key={`${g}-${i}`}
              style={{ '--brand': `#${icon.hex}` }}
              className="px-6 md:px-10 text-primary transition-colors hover:text-(--brand)"
            >
              <svg
                viewBox={icon.viewBox ?? '0 0 24 24'}
                role="img"
                aria-label={g === 0 ? icon.title : undefined}
                className="h-7 w-7 fill-current"
              >
                <title>{icon.title}</title>
                <path d={icon.path}/>                 
              </svg>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}