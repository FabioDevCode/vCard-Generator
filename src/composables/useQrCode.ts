import { ref } from 'vue'
import QRCode from 'qrcode'

export function useQrCode() {
    const qrDataUrl = ref<string>('')
    const isGenerating = ref(false)

    const generateQrCode = async (data: string): Promise<string> => {
        isGenerating.value = true
        try {
            const dataUrl = await QRCode.toDataURL(data, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                },
                errorCorrectionLevel: 'M'
            })
            qrDataUrl.value = dataUrl
            return dataUrl
        } finally {
            isGenerating.value = false
        }
    }

    const downloadAsJpeg = (filename: string = 'vcard-qrcode'): void => {
        if (!qrDataUrl.value) return

        // Create a canvas to convert PNG to JPEG
        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            // Fill white background for JPEG
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)

            // Convert to JPEG and download
            const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.95)
            const link = document.createElement('a')
            link.download = `${filename}.jpg`
            link.href = jpegDataUrl
            link.click()
        }
        img.src = qrDataUrl.value
    }

    const clearQrCode = (): void => {
        qrDataUrl.value = ''
    }

    return {
        qrDataUrl,
        isGenerating,
        generateQrCode,
        downloadAsJpeg,
        clearQrCode
    }
}
