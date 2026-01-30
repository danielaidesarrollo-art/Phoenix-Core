
export class CameraAdapter {
    private stream: MediaStream | null = null;
    private videoElement: HTMLVideoElement | null = null;

    async startCamera(videoElement: HTMLVideoElement): Promise<void> {
        this.videoElement = videoElement;
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Preferred for mobile/Smart Glasses
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });
            this.videoElement.srcObject = this.stream;
            await this.videoElement.play();
        } catch (error) {
            console.error('Error accessing camera:', error);
            throw new Error('Camera access denied or unavailable.');
        }
    }

    stopCamera(): void {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.videoElement) {
            this.videoElement.srcObject = null;
        }
    }

    captureFrame(): string {
        if (!this.videoElement) throw new Error('Camera not started');

        const canvas = document.createElement('canvas');
        canvas.width = this.videoElement.videoWidth;
        canvas.height = this.videoElement.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        ctx.drawImage(this.videoElement, 0, 0);

        // Return base64 without prefix for Astra Core
        return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    }
}

// Future Smart Glasses Adapter Placeholder
export const SmartGlassesAdapter = {
    isReady: () => false,
    capture: async () => {
        throw new Error('Smart Glasses hardware not detected. Falling back to Mobile/PC camera.');
    }
};
