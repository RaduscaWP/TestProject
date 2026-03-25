/**
 * Tests for state management functions: makeOrder, clearData, updateShowBtn
 */

let app

beforeEach(() => {
    document.body.innerHTML = '<div class="hero"></div>'
    localStorage.clear()
    jest.resetModules()
    app = require('../script')
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
// makeOrder
// ---------------------------------------------------------------------------

describe('makeOrder()', () => {
    test('returns an object with all 7 required fields', () => {
        setValidState()
        const order = app.makeOrder()
        expect(order).toHaveProperty('nume')
        expect(order).toHaveProperty('prenume')
        expect(order).toHaveProperty('telefon')
        expect(order).toHaveProperty('produs')
        expect(order).toHaveProperty('cantitate')
        expect(order).toHaveProperty('adresa')
        expect(order).toHaveProperty('data')
    })

    test('maps client fields correctly', () => {
        setValidState()
        const order = app.makeOrder()
        expect(order.nume).toBe('Alexandru')
        expect(order.prenume).toBe('Ionescu')
        expect(order.telefon).toBe('12345678')
    })

    test('maps product fields correctly', () => {
        setValidState()
        const order = app.makeOrder()
        expect(order.produs).toBe('Laptop Pro X')
        expect(order.cantitate).toBe('2')
    })

    test('maps delivery fields correctly', () => {
        setValidState()
        const order = app.makeOrder()
        expect(order.adresa).toBe('Strada Florilor 12')
        expect(order.data).toBe('2026-04-01')
    })

    test('reflects current state values at time of call', () => {
        app.client.nume = 'Grigore'
        app.client.prenume = 'Popescu'
        app.client.telefon = '87654321'
        app.produs.nume = 'Tastatura wireless'
        app.produs.cantitate = '5'
        app.livrare.adresa = 'Bulevardul Unirii 7'
        app.livrare.data = '2026-05-15'

        const order = app.makeOrder()
        expect(order.nume).toBe('Grigore')
        expect(order.produs).toBe('Tastatura wireless')
        expect(order.cantitate).toBe('5')
    })
})

// ---------------------------------------------------------------------------
// clearData
// ---------------------------------------------------------------------------

describe('clearData()', () => {
    test('resets client fields to empty strings', () => {
        setValidState()
        app.clearData()
        expect(app.client.nume).toBe('')
        expect(app.client.prenume).toBe('')
        expect(app.client.telefon).toBe('')
    })

    test('resets produs fields to empty strings', () => {
        setValidState()
        app.clearData()
        expect(app.produs.nume).toBe('')
        expect(app.produs.cantitate).toBe('')
    })

    test('resets livrare fields to empty strings', () => {
        setValidState()
        app.clearData()
        expect(app.livrare.adresa).toBe('')
        expect(app.livrare.data).toBe('')
    })

    test('resets editId to -1', () => {
        app.setEditId(3)
        expect(app.getEditId()).toBe(3)
        app.clearData()
        expect(app.getEditId()).toBe(-1)
    })

    test('makes all validators return false after reset', () => {
        setValidState()
        app.clearData()
        expect(app.okClient()).toBe(false)
        expect(app.okProdus()).toBe(false)
        expect(app.okLivrare()).toBe(false)
    })
})

// ---------------------------------------------------------------------------
// updateShowBtn
// ---------------------------------------------------------------------------

describe('updateShowBtn()', () => {
    test('shows the "show order" button when all validators pass', () => {
        setValidState()
        app.updateShowBtn()
        const btn = document.querySelector('.show-order')
        expect(btn.style.display).toBe('inline-block')
    })

    test('hides the button when client data is invalid', () => {
        setValidState()
        app.client.nome = ''  // intentional invalid field via clearing
        app.client.nume = 'Ana'  // too short
        app.updateShowBtn()
        const btn = document.querySelector('.show-order')
        expect(btn.style.display).toBe('none')
    })

    test('hides the button when product data is invalid', () => {
        setValidState()
        app.produs.nume = 'Mic'  // too short
        app.updateShowBtn()
        const btn = document.querySelector('.show-order')
        expect(btn.style.display).toBe('none')
    })

    test('hides the button when delivery data is invalid', () => {
        setValidState()
        app.livrare.data = ''
        app.updateShowBtn()
        const btn = document.querySelector('.show-order')
        expect(btn.style.display).toBe('none')
    })

    test('hides the button when all state is empty (initial state)', () => {
        // Already called by script on load with empty state
        const btn = document.querySelector('.show-order')
        expect(btn.style.display).toBe('none')
    })

    test('shows button after partial fix — hides when one section becomes invalid again', () => {
        setValidState()
        app.updateShowBtn()
        expect(document.querySelector('.show-order').style.display).toBe('inline-block')

        app.livrare.adresa = 'Str'  // too short now
        app.updateShowBtn()
        expect(document.querySelector('.show-order').style.display).toBe('none')
    })
})
