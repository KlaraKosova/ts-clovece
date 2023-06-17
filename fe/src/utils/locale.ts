import { type AppSettings } from '@/types/AppSettings'
import { type RecursiveRecord } from '@/types/utils'
import { cloneDeep } from 'lodash'

class Locale {
    private readonly lang: string
    private readonly supportedLangs = [
        {
            value: 'cs',
            label: '\u{1F1E8}\u{1F1FF} CZ'
        },
        {
            value: 'en',
            label: '\u{1F1EC}\u{1F1E7} EN'
        }
    ]

    constructor() {
        const settings = JSON.parse(localStorage.getItem('app') || '{}') as AppSettings

        if (settings) {
            const langValid = ['en', 'cs'].includes(settings.lang)

            this.lang = langValid ? settings.lang : process.env.DEFAULT_LOCALE || 'en'
        } else {
            this.setLang(process.env.DEFAULT_LOCALE || 'en')
        }
    }

    public getSupportedLangs(): Array<{ label: string, value: string }> {
        return cloneDeep(this.supportedLangs)
    }

    public setLang(lang: string): void {
        const isSuported = this.supportedLangs.some(s => s.value === lang)
        if (!isSuported) {
            throw new Error(`'${lang}' is not valid language option`)
        }

        const oldSettings = JSON.parse(localStorage.getItem('app') || '{}') as AppSettings
        const newSetings = {
            ...oldSettings,
            lang
        }

        localStorage.setItem('app', JSON.stringify(newSetings))
        location.reload()
    }

    public getLang(): { label: string, value: string } {
        const lang = this.supportedLangs.find(l => l.value === this.lang)
        return cloneDeep(lang)
    }

    public get(property: string): string {
        const split = property.split('.')
        split.push(this.lang)
        let currentObject: RecursiveRecord<string, string> = this.messages

        while (split.length > 0) {
            const currentKey: string = split.shift() as keyof typeof currentObject

            if (!Object.hasOwnProperty.call(currentObject, currentKey)) {
                throw new Error(`Locale property '${currentKey}' does not exist (current lang ${this.lang})`)
            }

            if (split.length === 0) {
                // last key === lang
                if (typeof currentObject[currentKey] !== 'string') {
                    throw new Error(`Incomplete path to locale property: '${property}'`)
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
                // @ts-ignore
                return currentObject[currentKey]
            }

            if (typeof currentObject[currentKey] === 'string') {
                throw new Error(`Terminated path to locale property: '${property}'`)
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
            // @ts-ignore
            currentObject = currentObject[currentKey]
        }
    }

    private readonly messages = {
        newGame: {
            cs: 'Nová hra',
            en: 'New game'
        },
        untitledGame: {
            cs: 'Hra bez názvu',
            en: 'Untitled game'
        },
        noMovesHeader: {
            cs: 'Žádné další tahy',
            en: 'No available moves'
        },
        noMovesDescription: {
            cs: 'Nejsou dostupné žádné další tahy',
            en: 'No moves are available'
        },
        nextPlayer: {
            cs: 'Další hráč',
            en: 'Next player'
        },
        homeMovesOnlyHeader: {
            cs: 'Omezené dostupné tahy',
            en: 'Limited available moves'
        },
        homeMovesOnlyDescription: {
            cs: 'Dostupné tahy pouze pro figurky "v domečku". Přeskočit kolo?',
            en: 'Only figures "at home" can be moved. Skip turn?'
        },
        gameOver: {
            cs: 'Konec hry',
            en: 'Game over'
        },
        yourTurn: {
            cs: 'Jste na tahu',
            en: 'Your turn'
        },
        otherPlayerTurnSuffix: {
            cs: ' hraje',
            en: "'s turn"
        },
        youWon: {
            cs: 'Vyhráli jste',
            en: 'You won'
        },
        otherPlayerWonSuffix: {
            cs: ' vyhrál',
            en: ' won'
        },
        players: {
            cs: 'Hráči',
            en: 'Players'
        },
        join: {
            cs: 'Přidat se',
            en: 'Join'
        },
        title: {
            cs: 'Název',
            en: 'Title'
        },
        create: {
            cs: 'Vytvořit',
            en: 'Create'
        },
        colors: {
            red: {
                cs: 'Červený',
                en: 'Red'
            },
            yellow: {
                cs: 'Žlutý',
                en: 'Yellow'
            },
            green: {
                cs: 'Zelený',
                en: 'Green'
            },
            blue: {
                cs: 'Modrý',
                en: 'Blue'
            }
        }
    }
}

export const locale = new Locale()
