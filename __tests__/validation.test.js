/**
 * Tests for pure validation functions: okClient, okProdus, okLivrare, setState
 */

let app

beforeEach(() => {
    document.body.innerHTML = '<div class="hero"></div>'
    localStorage.clear()
    jest.resetModules()
    app = require('../script')
    // Reset state to empty before each test
    app.client.nume = ''
    app.client.prenume = ''
    app.client.telefon = ''
    app.produs.nume = ''
    app.produs.cantitate = ''
    app.livrare.adresa = ''
    app.livrare.data = ''
})

// ---------------------------------------------------------------------------
// okClient
// ---------------------------------------------------------------------------

describe('okClient()', () => {
    test('returns true when all fields are valid', () => {
        app.client.nume = 'Alexandru'
        app.client.prenume = 'Ionescu'
        app.client.telefon = '12345678'
        expect(app.okClient()).toBe(true)
    })

    test('returns false when all fields are empty', () => {
        expect(app.okClient()).toBe(false)
    })

    test('returns false when name is too short (< 5 chars)', () => {
        app.client.nume = 'Ana'
        app.client.prenume = 'Ionescu'
        app.client.telefon = '12345678'
        expect(app.okClient()).toBe(false)
    })

    test('returns true when name is exactly 5 chars (boundary)', () => {
        app.client.nume = 'Maria'
        app.client.prenume = 'Ionescu'
        app.client.telefon = '12345678'
        expect(app.okClient()).toBe(true)
    })

    test('returns false when name is exactly 4 chars (boundary)', () => {
        app.client.nume = 'Mari'
        app.client.prenume = 'Ionescu'
        app.client.telefon = '12345678'
        expect(app.okClient()).toBe(false)
    })

    test('returns false when surname is too short (< 5 chars)', () => {
        app.client.nume = 'Alexandru'
        app.client.prenume = 'Ion'
        app.client.telefon = '12345678'
        expect(app.okClient()).toBe(false)
    })

    test('returns false when phone has fewer than 8 digits', () => {
        app.client.nume = 'Alexandru'
        app.client.prenume = 'Ionescu'
        app.client.telefon = '1234567'
        expect(app.okClient()).toBe(false)
    })

    test('returns false when phone has more than 8 digits', () => {
        app.client.nume = 'Alexandru'
        app.client.prenume = 'Ionescu'
        app.client.telefon = '123456789'
        expect(app.okClient()).toBe(false)
    })

    test('returns false when phone contains non-digit characters', () => {
        app.client.nume = 'Alexandru'
        app.client.prenume = 'Ionescu'
        app.client.telefon = '1234-678'
        expect(app.okClient()).toBe(false)
    })

    test('returns false when phone contains spaces', () => {
        app.client.nume = 'Alexandru'
        app.client.prenume = 'Ionescu'
        app.client.telefon = '1234 678'
        expect(app.okClient()).toBe(false)
    })

    test('returns false when phone is empty', () => {
        app.client.nume = 'Alexandru'
        app.client.prenume = 'Ionescu'
        app.client.telefon = ''
        expect(app.okClient()).toBe(false)
    })

    test('ignores leading/trailing whitespace in name and surname', () => {
        app.client.nume = '  Maria  '
        app.client.prenume = '  Ionescu  '
        app.client.telefon = '12345678'
        expect(app.okClient()).toBe(true)
    })

    test('returns false when name is only whitespace', () => {
        app.client.nume = '     '
        app.client.prenume = 'Ionescu'
        app.client.telefon = '12345678'
        expect(app.okClient()).toBe(false)
    })
})

// ---------------------------------------------------------------------------
// okProdus
// ---------------------------------------------------------------------------

describe('okProdus()', () => {
    test('returns true when product name >= 7 chars and quantity > 0', () => {
        app.produs.nume = 'Laptop Pro'
        app.produs.cantitate = '3'
        expect(app.okProdus()).toBe(true)
    })

    test('returns false when all fields are empty', () => {
        expect(app.okProdus()).toBe(false)
    })

    test('returns true when product name is exactly 7 chars (boundary)', () => {
        app.produs.nume = 'Monitor'
        app.produs.cantitate = '1'
        expect(app.okProdus()).toBe(true)
    })

    test('returns false when product name is exactly 6 chars (boundary)', () => {
        app.produs.nume = 'Pixeli'
        app.produs.cantitate = '1'
        expect(app.okProdus()).toBe(false)
    })

    test('returns false when product name is too short', () => {
        app.produs.nume = 'Mouse'
        app.produs.cantitate = '5'
        expect(app.okProdus()).toBe(false)
    })

    test('returns false when quantity is 0', () => {
        app.produs.nume = 'Tastatura'
        app.produs.cantitate = '0'
        expect(app.okProdus()).toBe(false)
    })

    test('returns false when quantity is negative', () => {
        app.produs.nume = 'Tastatura'
        app.produs.cantitate = '-1'
        expect(app.okProdus()).toBe(false)
    })

    test('returns false when quantity is empty string', () => {
        app.produs.nume = 'Tastatura'
        app.produs.cantitate = ''
        expect(app.okProdus()).toBe(false)
    })

    test('returns false when quantity is non-numeric string', () => {
        app.produs.nume = 'Tastatura'
        app.produs.cantitate = 'abc'
        expect(app.okProdus()).toBe(false)
    })

    test('returns false when product name is only whitespace', () => {
        app.produs.nume = '       '
        app.produs.cantitate = '1'
        expect(app.okProdus()).toBe(false)
    })
})

// ---------------------------------------------------------------------------
// okLivrare
// ---------------------------------------------------------------------------

describe('okLivrare()', () => {
    test('returns true when address >= 5 chars and date is set', () => {
        app.livrare.adresa = 'Strada Florilor 12'
        app.livrare.data = '2026-04-01'
        expect(app.okLivrare()).toBe(true)
    })

    test('returns false when all fields are empty', () => {
        expect(app.okLivrare()).toBe(false)
    })

    test('returns true when address is exactly 5 chars (boundary)', () => {
        app.livrare.adresa = 'Calea'
        app.livrare.data = '2026-04-01'
        expect(app.okLivrare()).toBe(true)
    })

    test('returns false when address is exactly 4 chars (boundary)', () => {
        app.livrare.adresa = 'Str.'
        app.livrare.data = '2026-04-01'
        expect(app.okLivrare()).toBe(false)
    })

    test('returns false when address is too short', () => {
        app.livrare.adresa = 'Str'
        app.livrare.data = '2026-04-01'
        expect(app.okLivrare()).toBe(false)
    })

    test('returns false when date is empty string', () => {
        app.livrare.adresa = 'Strada Florilor 12'
        app.livrare.data = ''
        expect(app.okLivrare()).toBe(false)
    })

    test('returns false when date is only whitespace', () => {
        app.livrare.adresa = 'Strada Florilor 12'
        app.livrare.data = '   '
        expect(app.okLivrare()).toBe(false)
    })

    test('returns false when address is only whitespace', () => {
        app.livrare.adresa = '     '
        app.livrare.data = '2026-04-01'
        expect(app.okLivrare()).toBe(false)
    })
})

// ---------------------------------------------------------------------------
// setState
// ---------------------------------------------------------------------------

describe('setState(input, ok)', () => {
    let input

    beforeEach(() => {
        input = document.createElement('input')
    })

    test('adds "valid" class when ok is true and value is non-empty', () => {
        input.value = 'hello'
        app.setState(input, true)
        expect(input.classList.contains('valid')).toBe(true)
        expect(input.classList.contains('error')).toBe(false)
    })

    test('adds "error" class when ok is false and value is non-empty', () => {
        input.value = 'hello'
        app.setState(input, false)
        expect(input.classList.contains('error')).toBe(true)
        expect(input.classList.contains('valid')).toBe(false)
    })

    test('adds no class when input value is empty', () => {
        input.value = ''
        app.setState(input, true)
        expect(input.classList.contains('valid')).toBe(false)
        expect(input.classList.contains('error')).toBe(false)
    })

    test('removes "error" class when switching to valid', () => {
        input.value = 'short'
        app.setState(input, false)
        expect(input.classList.contains('error')).toBe(true)

        input.value = 'long enough'
        app.setState(input, true)
        expect(input.classList.contains('valid')).toBe(true)
        expect(input.classList.contains('error')).toBe(false)
    })

    test('removes "valid" class when switching to error', () => {
        input.value = 'long enough'
        app.setState(input, true)
        expect(input.classList.contains('valid')).toBe(true)

        input.value = 'x'
        app.setState(input, false)
        expect(input.classList.contains('error')).toBe(true)
        expect(input.classList.contains('valid')).toBe(false)
    })

    test('clears both classes and adds nothing when value becomes empty', () => {
        input.value = 'hello'
        app.setState(input, true)
        expect(input.classList.contains('valid')).toBe(true)

        input.value = ''
        app.setState(input, true)
        expect(input.classList.contains('valid')).toBe(false)
        expect(input.classList.contains('error')).toBe(false)
    })
})
