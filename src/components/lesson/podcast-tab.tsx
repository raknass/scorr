'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Headphones, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react'
import type { LessonWithProblems } from '@/lib/queries/lessons'

interface PodcastTabProps {
  lesson: LessonWithProblems
}

export function PodcastTab({ lesson }: PodcastTabProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const { podcast_url, podcast_duration, podcast_transcript, title } = lesson

  // Update audio element when speed or volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
      audioRef.current.volume = volume
      audioRef.current.muted = isMuted
    }
  }, [speed, volume, isMuted])

  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime
      const total = audioRef.current.duration
      setCurrentTime(current)
      if (total > 0) {
        setProgress((current / total) * 100)
      }
    }
  }

  // Handle duration on loadedmetadata
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = Math.max(0, Math.min(1, x / rect.width))
      const newTime = percentage * audioRef.current.duration
      
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
      setProgress(percentage * 100)
    }
  }

  // Handle skip actions
  const skipTime = (amount: number) => {
    if (audioRef.current) {
      let newTime = audioRef.current.currentTime + amount
      newTime = Math.max(0, Math.min(newTime, audioRef.current.duration || 0))
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  // Format time (seconds to M:SS)
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00"
    const m = Math.floor(timeInSeconds / 60)
    const s = Math.floor(timeInSeconds % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const speedOptions = [0.75, 1, 1.25, 1.5, 2]

  // Render "Coming Soon" if no podcast URL
  if (!podcast_url) {
    return (
      <div className="flex flex-col h-full bg-[#FAFAFA] p-6 lg:p-12 items-center justify-center">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Headphones size={32} className="text-slate-400" />
          </div>
          <h3 className="text-[#0F172A] text-xl font-bold mb-2">Podcast episode coming soon</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            We're recording the audio version of this lesson. Check back in a few days.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] overflow-y-auto p-4 sm:p-6 lg:p-10 hide-scrollbar">
      <div className="max-w-2xl w-full mx-auto space-y-6">
        
        {/* Main Audio Player Card */}
        <div className="bg-white rounded-[16px] border border-slate-200 shadow-sm p-6 sm:p-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
                <Headphones size={24} className="text-[#0D9488]" />
              </div>
              <div>
                <h2 className="text-[#0F172A] text-lg font-bold leading-tight mb-1">Scorr Physics Podcast</h2>
                <p className="text-slate-500 text-sm">Episode: {title}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="bg-teal-50 text-[#0D9488] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                Study on the go
              </span>
              {(duration > 0 || podcast_duration) && (
                <span className="text-slate-400 text-xs font-medium">
                  {duration > 0 ? formatTime(duration) : podcast_duration}
                </span>
              )}
            </div>
          </div>

          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={podcast_url}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            preload="metadata"
          />

          {/* Controls Container */}
          <div className="flex flex-col items-center mb-6">
            
            <div className="flex items-center justify-center gap-6 sm:gap-8 mb-6">
              {/* Rewind 15s */}
              <button 
                onClick={() => skipTime(-15)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-[#0F172A] hover:bg-slate-50 transition-colors"
                aria-label="Rewind 15 seconds"
              >
                <div className="relative flex items-center justify-center">
                  <RotateCcw size={22} />
                  <span className="absolute text-[9px] font-bold mt-1">15</span>
                </div>
              </button>

              {/* Play/Pause (Large) */}
              <button
                onClick={togglePlay}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0D9488] hover:bg-teal-600 active:scale-95 transition-all rounded-full flex items-center justify-center shadow-md shadow-teal-500/20 text-white"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={32} className="fill-white" /> : <Play size={34} className="ml-2 fill-white" />}
              </button>

              {/* Forward 30s */}
              <button 
                onClick={() => skipTime(30)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-[#0F172A] hover:bg-slate-50 transition-colors"
                aria-label="Forward 30 seconds"
              >
                <div className="relative flex items-center justify-center">
                  <RotateCw size={22} />
                  <span className="absolute text-[9px] font-bold mt-1">30</span>
                </div>
              </button>
            </div>

            {/* Progress Bar Area */}
            <div className="w-full flex items-center gap-3 sm:gap-4 mb-5">
              <span className="text-slate-500 text-xs font-medium w-10 text-right shrink-0">
                {formatTime(currentTime)}
              </span>
              
              <div 
                ref={progressRef}
                onClick={handleProgressClick}
                className="h-4 flex-1 flex items-center cursor-pointer group"
              >
                <div className="w-full h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#0D9488] rounded-full group-hover:bg-teal-500 transition-colors"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              <span className="text-slate-500 text-xs font-medium w-10 shrink-0">
                {formatTime(duration)}
              </span>
            </div>

            {/* Bottom Controls (Speed & Volume) */}
            <div className="w-full flex items-center justify-between mt-2">
              
              {/* Playback Speed */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-100 hidden sm:flex">
                {speedOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSpeed(opt)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                      speed === opt 
                        ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-[#0D9488]' 
                        : 'text-slate-500 hover:text-[#0F172A]'
                    }`}
                  >
                    {opt}x
                  </button>
                ))}
              </div>
              
              {/* Fallback speed selector for very small screens */}
              <div className="sm:hidden flex items-center">
                 <button
                    onClick={() => {
                      const currentIndex = speedOptions.indexOf(speed)
                      const nextIndex = (currentIndex + 1) % speedOptions.length
                      setSpeed(speedOptions[nextIndex])
                    }}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-[#0D9488] text-xs font-bold rounded-lg"
                 >
                   {speed}x speed
                 </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className="text-slate-400 hover:text-[#0F172A] w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50"
                  aria-label="Toggle Mute"
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value))
                    if (isMuted) setIsMuted(false)
                  }}
                  className="w-20 sm:w-24 h-1.5 accent-[#0D9488] bg-slate-200 rounded-full appearance-none cursor-pointer"
                  style={{
                     background: `linear-gradient(to right, #0D9488 ${(isMuted ? 0 : volume) * 100}%, #e2e8f0 ${(isMuted ? 0 : volume) * 100}%)`
                  }}
                />
              </div>

            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-[16px] border border-slate-200 shadow-sm p-6 sm:p-8">
           <h3 className="text-[#0F172A] text-sm font-bold uppercase tracking-wider mb-4">What's covered in this episode</h3>
           <ul className="space-y-3 mb-8">
             <li className="flex items-start gap-3">
               <span className="w-1.5 h-1.5 bg-[#0D9488] rounded-full mt-2 shrink-0" />
               <span className="text-[#374151] text-sm leading-relaxed">A verbal breakdown of the core concepts in {title}.</span>
             </li>
             <li className="flex items-start gap-3">
               <span className="w-1.5 h-1.5 bg-[#0D9488] rounded-full mt-2 shrink-0" />
               <span className="text-[#374151] text-sm leading-relaxed">Common AP Exam traps to watch out for.</span>
             </li>
             <li className="flex items-start gap-3">
               <span className="w-1.5 h-1.5 bg-[#0D9488] rounded-full mt-2 shrink-0" />
               <span className="text-[#374151] text-sm leading-relaxed">Mental models to help you remember formulas and relationships without rote memorization.</span>
             </li>
           </ul>

           <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-3">
             <span className="text-xl shrink-0">💡</span>
             <div>
               <p className="text-[#0F172A] text-sm font-semibold mb-1">Listen while you...</p>
               <p className="text-slate-500 text-sm">Perfect for: commuting, the gym, walking between classes, or reinforcing concepts right before bed.</p>
             </div>
           </div>
        </div>

        {/* Transcript Section */}
        {podcast_transcript && (
          <div className="bg-white rounded-[16px] border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
            >
              <span className="text-[#0F172A] text-sm font-bold uppercase tracking-wider">Episode Transcript</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                {showTranscript ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>
            
            {showTranscript && (
              <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                <div className="prose prose-sm max-w-none text-slate-600 leading-chill">
                  {podcast_transcript.split('\n\n').map((paragraph, idx) => {
                    // Simple logic to inject a fake timestamp every few paragraphs if none exist, 
                    // or parse "[01:23]" formats if they are embedded in the text.
                    // Assuming the transcript might have standard formatting or plain text.
                    const text = paragraph.trim()
                    if (!text) return null
                    
                    const timeMatch = text.match(/^\[([\d:]+)\]/)
                    let timestamp = null
                    let content = text

                    if (timeMatch) {
                      timestamp = timeMatch[1]
                      content = text.replace(/^\[([\d:]+)\]\s*/, '')
                    }

                    return (
                      <p key={idx} className="mb-4 flex flex-col sm:flex-row sm:gap-4 relative">
                        {(timestamp || idx % 4 === 0) && (
                           <span className="text-xs font-mono text-slate-400 font-medium whitespace-nowrap pt-0.5 sm:w-12 shrink-0">
                             {timestamp || formatTime(idx * 30)}
                           </span>
                        )}
                        <span className="flex-1 text-[15px] leading-relaxed text-[#374151]">{content}</span>
                      </p>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="h-8" /> {/* extra padding at end of scroll */}
      </div>
    </div>
  )
}
