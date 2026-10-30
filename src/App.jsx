import {useState, useEffect, useCallback} from 'react'
import './index.css'
import Navbar from './components/layout/Navbar.jsx';
import HeroSection from './components/sections/HeroSection.jsx';
import Marquee from './components/sections/Marquee.jsx';
import ProjectsSection from './components/sections/ProjectsSection.jsx';
import AboutSection from './components/sections/AboutSection.jsx';
import ContactSection from './components/sections/ContactSection.jsx';
import JamsSection from './components/sections/JamsSection.jsx';
import Footer from './components/layout/Footer.jsx';
import { MotionConfig } from 'motion/react';
import useKonamiCode from './hooks/useKonamiCode.js';

export default function App() {
    const [dark, setDark] = useState(getInitialTheme);
    const [italian, setItalian] = useState(false);
    const [konami, setKonami] = useState(false)
    const [pulse, setPulse] = useState({ id: 0, progress: 0, total: 1 })

    const activate = useCallback(() => setKonami(true), [])
    const handlePulse = useCallback((progress, total) => setPulse((p) => ({ id: p.id + 1, progress, total })), [])
    const exit = useCallback(() => setKonami(false), [])
 
    useKonamiCode(
        activate,
        handlePulse,
    )

    function getInitialTheme() {
        try {
            const saved = localStorage.getItem('theme');
            if (saved) return saved === 'dark';
        } catch {}
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function getInitialLanguage(){
        try{
            const saved = localStorage.getItem('language');
            if(saved) return saved === 'italian';
        } catch{}
        return false;
    }
    
    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
    }, [dark]);

    return (
        <MotionConfig reducedMotion='user'>
            <div id='top'></div>
            <Navbar dark={dark} setDark={setDark}/>
            <main>
                <HeroSection konami={konami} pulse={pulse} onExit={exit} onActivate={activate} onPulse={handlePulse}/>
                <Marquee/>
                <ProjectsSection id='works'/>
                <JamsSection id='jams'/>
                <AboutSection id='about'/>
                <ContactSection id='contacts'/>
            </main>
            <Footer/>
        </MotionConfig>
    );
}