"use client";
import { Download, PictureInPicture } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";

declare global {
    interface Window {
        deferredPrompt: any;
    }
}

function isIOS() {
    return /iPad|iPhone|iPod/i.test(navigator.userAgent);
}

export default function InstallOrOpenPWAButton() {
    const { t } = useLanguage();
    const [mode, setMode] = useState<"hidden" | "install" | "open">(() => {
        if (isIOS()) {
            return "hidden";
        }
        return "open";
    });

    useEffect(() => {
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setMode("hidden");
            return;
        }

        if ("getInstalledRelatedApps" in navigator) {
            (navigator as any).getInstalledRelatedApps().then((apps: any[]) => {
                if (apps.length > 0) {
                    setMode("open");
                }
            });
        }

        const handler = (e: Event) => {
            e.preventDefault();
            window.deferredPrompt = e;
            setMode("install");
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        const promptEvent = window.deferredPrompt;
        if (!promptEvent) return;
        promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        if (choiceResult.outcome === "accepted") {
            console.log("User accepted install");
        }
        window.deferredPrompt = null;
        setMode("hidden");
    };

    const handleOpenApp = () => {
        const now = Date.now();
        window.location.href = "web+owwi://open";

        setTimeout(() => {
            if (Date.now() - now < 1500) {
                handleInstall();
            }
        }, 1000);
    };

    if (mode === "hidden") return null;

    return (
        <button
            onClick={mode === "install" ? handleInstall : handleOpenApp}
            className="w-full flex items-center justify-start gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
            {mode === "install" ?
                <>
                    <Download />
                    {t("common.downloadApp")}
                </> :
                <>
                    <PictureInPicture />
                    {t("common.openInApp")}
                </>}
        </button>
    );
}
