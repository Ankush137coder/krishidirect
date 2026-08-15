// components/FarmerVoiceWidget.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Volume2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation, SPEECH_LANG_CODE } from "@/lib/i18n";

// Minimal ambient typing so this compiles without adding @types/dom-speech-recognition.
interface SpeechRecognitionResultLike {
    transcript: string;
}
interface SpeechRecognitionLike extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start: () => void;
    stop: () => void;
    onresult: ((event: { results: ArrayLike<ArrayLike<SpeechRecognitionResultLike>> }) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
}

interface FarmerVoiceWidgetProps {
    open: boolean;
    onClose: () => void;
    /** Called with the raw transcript once the farmer finishes speaking — parent decides how to parse it. */
    onTranscript: (text: string) => void;
}

export default function FarmerVoiceWidget({
    open,
    onClose,
    onTranscript,
}: FarmerVoiceWidgetProps) {
    const { language, t } = useTranslation();
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [supported, setSupported] = useState(true);
    const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

    useEffect(() => {
        if (!open) return;
        const SpeechRecognitionCtor =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognitionCtor) {
            setSupported(false);
            return;
        }
        const recognition: SpeechRecognitionLike = new SpeechRecognitionCtor();
        recognition.lang = SPEECH_LANG_CODE[language];
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.onresult = (event) => {
            const text = Array.from(event.results)
                .map((r) => r[0]?.transcript ?? "")
                .join(" ");
            setTranscript(text);
        };
        recognition.onend = () => setListening(false);
        recognition.onerror = () => setListening(false);
        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
            recognitionRef.current = null;
        };
    }, [open, language]);

    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) return;
        if (listening) {
            recognitionRef.current.stop();
            setListening(false);
        } else {
            setTranscript("");
            recognitionRef.current.start();
            setListening(true);
        }
    }, [listening]);

    const handleConfirm = () => {
        if (transcript.trim()) onTranscript(transcript.trim());
        setTranscript("");
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 grid place-items-end bg-[#1B4332]/60 backdrop-blur-sm sm:place-items-center"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 60, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm rounded-t-3xl bg-[#FBF7EF] p-6 pb-8 sm:rounded-3xl"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[#1B4332]">
                                <Volume2 className="h-5 w-5" />
                                <span className="font-serif text-lg font-semibold">{t("voice.title")}</span>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Close voice widget"
                                className="grid h-9 w-9 place-items-center rounded-full bg-[#EFE8D6] text-[#3D4A42] hover:bg-[#E4DCC8]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {!supported ? (
                            <p className="rounded-xl bg-[#FBEAEA] p-4 text-sm text-[#8C2F2F]">
                                {t("voice.notSupported")}
                            </p>
                        ) : (
                            <>
                                <p className="mb-6 text-center text-base font-medium text-[#3D4A42]">
                                    {t("voice.prompt")}
                                </p>

                                <div className="relative mx-auto mb-6 grid h-36 w-36 place-items-center">
                                    {listening && (
                                        <motion.span
                                            className="absolute inset-0 rounded-full bg-[#E8A33D]/40"
                                            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                    )}
                                    <button
                                        onClick={toggleListening}
                                        aria-pressed={listening}
                                        aria-label={listening ? "Stop recording" : "Start recording"}
                                        className={cn(
                                            "relative grid h-28 w-28 place-items-center rounded-full shadow-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]",
                                            listening ? "bg-[#C4622D]" : "bg-[#1B4332]"
                                        )}
                                    >
                                        <Mic className="h-11 w-11 text-[#FBF7EF]" strokeWidth={1.75} />
                                    </button>
                                </div>

                                <div className="mb-6 min-h-[3.5rem] rounded-2xl border border-dashed border-[#E4DCC8] bg-white px-4 py-3 text-center text-[#3D4A42]">
                                    {transcript || (
                                        <span className="inline-flex items-center gap-1.5 text-[#9A9483]">
                                            <Sparkles className="h-4 w-4" /> {t("voice.placeholder")}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={handleConfirm}
                                    disabled={!transcript.trim()}
                                    className="w-full rounded-2xl bg-[#E8A33D] py-3.5 text-base font-semibold text-[#1B4332] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {t("voice.useThis")}
                                </button>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
