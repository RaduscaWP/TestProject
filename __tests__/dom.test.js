/**
 * Tests for DOM rendering and routing: showPage, showClient, showProdus,
 * showLivrare, showComanda, showLista
 */

let app

beforeEach(() => {
    document.body.innerHTML = '<div class="hero"></div>'
    localStorage.clear()
    jest.resetModules()
    app = require('../script')
    // Reset state
    app.client.nume = ''
    app.client.prenume = ''
    app.client.telefon = ''
    app.produs.nume = ''
    app.produs.cantitate = ''
    app.livrare.adresa = ''
    app.livrare.data = ''
})

function setValidState() {
    app.client.nume = 'Alexandru'
    app.client.prenume = 'Ionescu'
    app.client.telefon = '12345678'
    app.produs.nume = 'Laptop Pro X'
    app.produs.cantitate = '2'
    app.livrare.adresa = 'Strada Florilor 12'
    app.livrare.data = '2026-04-01'
}

// ---------------------------------------------------------------------------
// showPage routing
// ---------------------------------------------------------------------------

describe('showPage(page)', () => {
    test('"client" renders the client form', () => {
        app.showPage('client')
        expect(document.querySelector('.save-client')).not.toBeNull()
    })

    test('"produse" renders the product form', () => {
        app.showPage('produse')
        expect(document.querySelector('.save-produs')).not.toBeNull()
    })

    test('"livrare" renders the delivery form', () => {
        app.showPage('livrare')
        expect(document.querySelector('.save-livrare')).not.toBeNull()
    })

    test('"lista" renders the order list section', () => {
        app.showPage('lista')
        const zone = document.querySelector('.exam-zone')
        expect(zone.innerHTML).toContain('Lista comenzi')
    })

    test('"comanda" with invalid state shows error message', () => {
        app.showPage('comanda')
        const zone = document.querySelector('.exam-zone')
        expect(zone.innerHTML).toContain('Completează corect')
    })

    test('unknown page falls back to client form', () => {
        app.showPage('nonexistent')
        expect(document.querySelector('.save-client')).not.toBeNull()
    })
})

// ---------------------------------------------------------------------------
// showClient
// ---------------------------------------------------------------------------

describe('showClient()', () => {
    test('renders name, surname, and phone inputs', () => {
        app.showClient()
        expect(document.querySelector('.nume')).not.toBeNull()
        expect(document.querySelector('.prenume')).not.toBeNull()
        expect(document.querySelector('.telefon')).not.toBeNull()
    })

    test('pre-populates inputs with current state values', () => {
        app.client.nume = 'Teodora'
        app.client.prenume = 'Mateescu'
        app.client.telefon = '99887766'
        app.showClient()

        expect(document.querySelector('.nume').value).toBe('Teodora')
        expect(document.querySelector('.prenume').value).toBe('Mateescu')
        expect(document.querySelector('.telefon').value).toBe('99887766')
    })

    test('save button updates state when all fields are valid', () => {
        app.showClient()
        document.querySelector('.nume').value = 'Teodora'
        document.querySelector('.prenume').value = 'Mateescu'
        document.querySelector('.telefon').value = '99887766'
        document.querySelector('.save-client').click()

        expect(app.client.nume).toBe('Teodora')
        expect(app.client.prenume).toBe('Mateescu')
        expect(app.client.telefon).toBe('99887766')
    })

    test('save button does NOT update state when fields are invalid', () => {
        app.showClient()
        document.querySelector('.nume').value = 'Ana'       // too short
        document.querySelector('.prenume').value = 'Ion'    // too short
        document.querySelector('.telefon').value = '123'    // invalid
        document.querySelector('.save-client').click()

        expect(app.client.nume).toBe('')  // state unchanged
    })

    test('shows success message after valid save', () => {
        app.showClient()
        document.querySelector('.nume').value = 'Teodora'
        document.querySelector('.prenume').value = 'Mateescu'
        document.querySelector('.telefon').value = '99887766'
        document.querySelector('.save-client').click()

        expect(document.querySelector('.text-client').textContent).toContain('salvate')
    })

    test('clears success message when save is invalid', () => {
        app.showClient()
        // Pre-set a success message manually
        document.querySelector('.text-client').textContent = 'previous message'
        document.querySelector('.nume').value = 'Ana'
        document.querySelector('.save-client').click()

        expect(document.querySelector('.text-client').textContent).toBe('')
    })
})

// ---------------------------------------------------------------------------
// showProdus
// ---------------------------------------------------------------------------

describe('showProdus()', () => {
    test('renders product name and quantity inputs', () => {
        app.showProdus()
        expect(document.querySelector('.produs')).not.toBeNull()
        expect(document.querySelector('.cantitate')).not.toBeNull()
    })

    test('pre-populates inputs with current state values', () => {
        app.produs.nume = 'Tastatura mecanica'
        app.produs.cantitate = '4'
        app.showProdus()

        expect(document.querySelector('.produs').value).toBe('Tastatura mecanica')
        expect(document.querySelector('.cantitate').value).toBe('4')
    })

    test('save button updates state when all fields are valid', () => {
        app.showProdus()
        document.querySelector('.produs').value = 'Tastatura mecanica'
        document.querySelector('.cantitate').value = '4'
        document.querySelector('.save-produs').click()

        expect(app.produs.nume).toBe('Tastatura mecanica')
        expect(app.produs.cantitate).toBe('4')
    })

    test('save button does NOT update state when fields are invalid', () => {
        app.showProdus()
        document.querySelector('.produs').value = 'Mouse'  // too short (5 chars)
        document.querySelector('.cantitate').value = '0'   // invalid
        document.querySelector('.save-produs').click()

        expect(app.produs.nume).toBe('')
    })

    test('shows success message after valid save', () => {
        app.showProdus()
        document.querySelector('.produs').value = 'Tastatura mecanica'
        document.querySelector('.cantitate').value = '4'
        document.querySelector('.save-produs').click()

        expect(document.querySelector('.text-produs').textContent).toContain('salvate')
    })
})

// ---------------------------------------------------------------------------
// showLivrare
// ---------------------------------------------------------------------------

describe('showLivrare()', () => {
    test('renders address and date inputs', () => {
        app.showLivrare()
        expect(document.querySelector('.adresa')).not.toBeNull()
        expect(document.querySelector('.data')).not.toBeNull()
    })

    test('pre-populates inputs with current state values', () => {
        app.livrare.adresa = 'Bulevardul Unirii 7'
        app.livrare.data = '2026-05-10'
        app.showLivrare()

        expect(document.querySelector('.adresa').value).toBe('Bulevardul Unirii 7')
        expect(document.querySelector('.data').value).toBe('2026-05-10')
    })

    test('save button updates state when all fields are valid', () => {
        app.showLivrare()
        document.querySelector('.adresa').value = 'Bulevardul Unirii 7'
        document.querySelector('.data').value = '2026-05-10'
        document.querySelector('.save-livrare').click()

        expect(app.livrare.adresa).toBe('Bulevardul Unirii 7')
        expect(app.livrare.data).toBe('2026-05-10')
    })

    test('save button does NOT update state when address is too short', () => {
        app.showLivrare()
        document.querySelector('.adresa').value = 'Str'
        document.querySelector('.data').value = '2026-05-10'
        document.querySelector('.save-livrare').click()

        expect(app.livrare.adresa).toBe('')
    })

    test('shows success message after valid save', () => {
        app.showLivrare()
        document.querySelector('.adresa').value = 'Bulevardul Unirii 7'
        document.querySelector('.data').value = '2026-05-10'
        document.querySelector('.save-livrare').click()

        expect(document.querySelector('.text-livrare').textContent).toContain('salvate')
    })
})

// ---------------------------------------------------------------------------
// showComanda
// ---------------------------------------------------------------------------

describe('showComanda()', () => {
    test('shows error message when validation is incomplete', () => {
        app.showComanda()
        const zone = document.querySelector('.exam-zone')
        expect(zone.innerHTML).toContain('Completează corect')
    })

    test('shows order summary with all data when validation passes', () => {
        setValidState()
        app.showComanda()

        const zone = document.querySelector('.exam-zone')
        expect(zone.innerHTML).toContain('Alexandru')
        expect(zone.innerHTML).toContain('Ionescu')
        expect(zone.innerHTML).toContain('12345678')
        expect(zone.innerHTML).toContain('Laptop Pro X')
        expect(zone.innerHTML).toContain('Strada Florilor 12')
    })

    test('renders the "Înregistrează comanda" button when valid', () => {
        setValidState()
        app.showComanda()
        expect(document.querySelector('.final-btn')).not.toBeNull()
    })
})

// ---------------------------------------------------------------------------
// showLista
// ---------------------------------------------------------------------------

describe('showLista()', () => {
    test('shows "no orders" message when localStorage is empty', () => {
        app.showLista()
        const zone = document.querySelector('.exam-zone')
        expect(zone.innerHTML).toContain('Nu există comenzi')
    })

    test('renders a table when orders exist', () => {
        localStorage.setItem('listaComenzi', JSON.stringify([
            { nume: 'Test', prenume: 'Testescu', telefon: '12345678', produs: 'Produs Test XL', cantitate: '1', adresa: 'Adresa Test', data: '2026-04-01' }
        ]))
        app.showLista()
        expect(document.querySelector('.exam-table')).not.toBeNull()
    })

    test('renders one row per order', () => {
        const orders = [
            { nume: 'A', prenume: 'Andrei', telefon: '11111111', produs: 'Produs Alpha X', cantitate: '1', adresa: 'Adresa A', data: '2026-04-01' },
            { nume: 'B', prenume: 'Bogdan', telefon: '22222222', produs: 'Produs Beta XY', cantitate: '2', adresa: 'Adresa B', data: '2026-04-02' }
        ]
        localStorage.setItem('listaComenzi', JSON.stringify(orders))
        app.showLista()

        const rows = document.querySelectorAll('tbody tr')
        expect(rows).toHaveLength(2)
    })

    test('renders delete and open buttons for each order', () => {
        const orders = [
            { nume: 'A', prenume: 'Andrei', telefon: '11111111', produs: 'Produs Alpha X', cantitate: '1', adresa: 'Adresa A', data: '2026-04-01' },
            { nume: 'B', prenume: 'Bogdan', telefon: '22222222', produs: 'Produs Beta XY', cantitate: '2', adresa: 'Adresa B', data: '2026-04-02' }
        ]
        localStorage.setItem('listaComenzi', JSON.stringify(orders))
        app.showLista()

        expect(document.querySelectorAll('.del-btn')).toHaveLength(2)
        expect(document.querySelectorAll('.open-btn')).toHaveLength(2)
    })

    test('displays order data in table cells', () => {
        localStorage.setItem('listaComenzi', JSON.stringify([
            { nume: 'Florin', prenume: 'Florescu', telefon: '55555555', produs: 'Produs Florin X', cantitate: '7', adresa: 'Calea Victoriei 1', data: '2026-06-01' }
        ]))
        app.showLista()

        const zone = document.querySelector('.exam-zone')
        expect(zone.innerHTML).toContain('Florin')
        expect(zone.innerHTML).toContain('Florescu')
        expect(zone.innerHTML).toContain('Produs Florin X')
        expect(zone.innerHTML).toContain('Calea Victoriei 1')
    })
})
