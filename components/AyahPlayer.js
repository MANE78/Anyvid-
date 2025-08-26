"use client";

import { useState, useRef } from 'react';

// A simple play/pause icon component
function PlayIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.536 0 3.284L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>;
}

function PauseIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 00-.75.75v12a.75.75 0 00.75.75h3a.75.75 0 00.75-.75v-12a.75.75 0 00-.75-.75h-3zM14.25 5.25a.75.75 0 00-.75.75v12a.75.75 0 00.75.75h3a.75.75 0 00.75-.75v-12a.75.75 0 00-.75-.75h-3z" clipRule="evenodd" /></svg>;
}

export default function AyahPlayer({ ayah }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        if (!audioRef.current) {
            audioRef.current = new Audio(ayah.audio);
            audioRef.current.onended = () => {
                setIsPlaying(false);
            };
        }

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            // A good practice: pause any other playing audio before starting a new one.
            // This requires a global state, which is too complex for now.
            // For now, the user can manually pause.
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4 mb-4">
                <span className="text-lg font-bold text-green-600 bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full">{ayah.numberInSurah}</span>
                <button onClick={handlePlayPause} className="text-green-600 hover:text-green-800 disabled:opacity-50" disabled={!ayah.audio}>
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
            </div>
            <p className="text-3xl leading-loose text-right" style={{fontFamily: "'Amiri Quran', serif"}}>
                {ayah.text}
            </p>
            <p className="text-md mt-4 text-left text-gray-600">
                {ayah.translation}
            </p>
        </div>
    );
}
