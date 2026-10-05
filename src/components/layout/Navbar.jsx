import { HugeiconsIcon } from '@hugeicons/react';
import {Moon02Icon, Sun02Icon} from '@hugeicons/core-free-icons'
import { flushSync } from 'react-dom'

export default function Navbar({dark, setDark}){    
    function toggleTheme(e) {
        const next = !dark;
        const root = document.documentElement;

        const applyTheme = () => {
            root.classList.toggle('dark', next);
            try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
            flushSync(() => setDark(next));
        };

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!document.startViewTransition || prefersReducedMotion) {
            applyTheme();
            return;
        }

        // Origine del cerchio: il centro del pulsante (funziona anche con la tastiera)
        const rect = e.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Raggio: distanza dal punto al angolo più lontano dello schermo
        const radius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const transition = document.startViewTransition(applyTheme);

        transition.ready.then(() => {
            root.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${radius}px at ${x}px ${y}px)`,
                    ],
                },
                {
                    duration: 600,
                    easing: 'ease-in-out',
                    pseudoElement: '::view-transition-new(root)',
                }
            );
        }).catch((err) => console.error('View transition fallita:', err));
    }


    return(
        <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
            <nav className="px-(--gutter) py-2 flex justify-between items-center">
                <a className="font-display font-medium text-primary hover:text-accent cursor-pointer" href='#top'>G.Criscuolo</a>
                
                <div className="hidden md:flex gap-6 text-normal">
                    <a className="text-primary cursor-pointer hover:text-accent font-sans" href='#works'>Works</a>
                    <a className="text-primary cursor-pointer hover:text-accent font-sans" href='#about'>About</a>     
                    <a className="text-primary cursor-pointer hover:text-accent font-sans" href='#contacts'>Contacts</a>     
                </div>
                
                <div className='flex items-center justify-center'>                    
                    <button 
                        aria-label='switch color scheme'
                        className="p-2 text-primary hover:text-accent transition-colors cursor-pointer group"
                        onClick={toggleTheme}
                        >
                        <HugeiconsIcon icon={dark ? Sun02Icon : Moon02Icon} className={`w-5 h-5 transition-transform duration-400 ease-out group-hover:scale-110 ${dark ? "group-hover:rotate-180" : "group-hover:rotate-20"}`} />
                    </button>
                    {/* <select name='language' className='text-primary bg-background border-none'>
                        <option value='english' className='border-none'>English</option>
                        <option value='italian' className='border-none'>Italiano</option>
                    </select> */}
                </div>
            </nav>
        </header>
    );
}       