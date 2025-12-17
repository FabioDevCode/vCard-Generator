import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { z } from 'zod'

export interface VCardData {
    firstName: string
    lastName: string
    phone: string
    email: string
    company: string
    jobTitle: string
    website: string
}

export interface SavedProfile {
    id: string
    name: string
    data: VCardData
    createdAt: number
}

export const vCardSchema = z.object({
    firstName: z.string().min(1, 'required'),
    lastName: z.string().min(1, 'required'),
    phone: z.string().regex(/^[\d\s\+\-\(\)]+$/, 'invalidPhone').optional().or(z.literal('')),
    email: z.string().email('invalidEmail').optional().or(z.literal('')),
    company: z.string().optional(),
    jobTitle: z.string().optional(),
    website: z.string().url('invalidUrl').optional().or(z.literal(''))
})

export function useVCard() {
    const savedProfiles = useLocalStorage<SavedProfile[]>('vcard-profiles', [])

    const createEmptyVCard = (): VCardData => ({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        company: '',
        jobTitle: '',
        website: ''
    })

    const generateVCardString = (data: VCardData): string => {
        const lines: string[] = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `N:${data.lastName};${data.firstName};;;`,
            `FN:${data.firstName} ${data.lastName}`
        ]

        if (data.phone) {
            lines.push(`TEL;TYPE=CELL:${data.phone}`)
        }

        if (data.email) {
            lines.push(`EMAIL:${data.email}`)
        }

        if (data.company) {
            lines.push(`ORG:${data.company}`)
        }

        if (data.jobTitle) {
            lines.push(`TITLE:${data.jobTitle}`)
        }

        if (data.website) {
            lines.push(`URL:${data.website}`)
        }

        lines.push('END:VCARD')

        return lines.join('\r\n')
    }

    const validateVCard = (data: VCardData) => {
        return vCardSchema.safeParse(data)
    }

    const saveProfile = (name: string, data: VCardData): SavedProfile => {
        const profile: SavedProfile = {
            id: `profile-${Date.now()}`,
            name,
            data: { ...data },
            createdAt: Date.now()
        }
        savedProfiles.value = [...savedProfiles.value, profile]
        return profile
    }

    const deleteProfile = (id: string): void => {
        savedProfiles.value = savedProfiles.value.filter(p => p.id !== id)
    }

    const getProfile = (id: string): SavedProfile | undefined => {
        return savedProfiles.value.find(p => p.id === id)
    }

    return {
        savedProfiles: computed(() => savedProfiles.value),
        createEmptyVCard,
        generateVCardString,
        validateVCard,
        saveProfile,
        deleteProfile,
        getProfile
    }
}
