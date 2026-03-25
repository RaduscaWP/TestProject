/**
 * Tests for localStorage persistence: save, edit, and delete orders
 */

let app

function setValidState(overrides = {}) {
    app.client.nume = overrides.nume || 'Alexandru'
    app.client.prenume = overrides.prenume || 'Ionescu'
    app.client.telefon = overrides.telefon || '12345678'
    app.produs.nume = overrides.produs || 'Laptop Pro X'
    app.produs.cantitate = overrides.cantitate || '2'
    app.livrare.adresa = overrides.adresa || 'Strada Florilor 12'
    app.livrare.data = overrides.data || '2026-04-01'
}

function getSavedOrders() {
    return JSON.parse(localStorage.getItem('listaComenzi')) || []
}

beforeEach(() => {
    document.body.innerHTML = '<div class="hero"></div>'
    localStorage.clear()
    jest.resetModules()
    app = require('../script')
})

// ---------------------------------------------------------------------------
// Saving a new order
// ---------------------------------------------------------------------------

describe('Saving a new order', () => {
    test('clicking "Înregistrează comanda" adds one order to localStorage', () => {
        setValidState()
        app.showComanda()

        document.querySelector('.final-btn').click()

        expect(getSavedOrders()).toHaveLength(1)
    })

    test('saved order contains correct client data', () => {
        setValidState()
        app.showComanda()
        document.querySelector('.final-btn').click()

        const order = getSavedOrders()[0]
        expect(order.nume).toBe('Alexandru')
        expect(order.prenume).toBe('Ionescu')
        expect(order.telefon).toBe('12345678')
    })

    test('saved order contains correct product and delivery data', () => {
        setValidState()
        app.showComanda()
        document.querySelector('.final-btn').click()

        const order = getSavedOrders()[0]
        expect(order.produs).toBe('Laptop Pro X')
        expect(order.cantitate).toBe('2')
        expect(order.adresa).toBe('Strada Florilor 12')
        expect(order.data).toBe('2026-04-01')
    })

    test('saving a second order appends to the list', () => {
        setValidState()
        app.showComanda()
        document.querySelector('.final-btn').click()

        // Set up second order
        setValidState({ nume: 'Mihaela', prenume: 'Popescu', telefon: '87654321' })
        app.showComanda()
        document.querySelector('.final-btn').click()

        expect(getSavedOrders()).toHaveLength(2)
        expect(getSavedOrders()[1].nume).toBe('Mihaela')
    })

    test('state is cleared after saving (editId reset to -1)', () => {
        setValidState()
        app.showComanda()
        document.querySelector('.final-btn').click()

        expect(app.getEditId()).toBe(-1)
        expect(app.client.nume).toBe('')
    })
})

// ---------------------------------------------------------------------------
// Editing an existing order
// ---------------------------------------------------------------------------

describe('Editing an existing order', () => {
    function seedOrders(count = 2) {
        const orders = []
        for (let i = 0; i < count; i++) {
            orders.push({
                nume: `Client${i}`,
                prenume: `Prenume${i}`,
                telefon: `1234567${i}`,
                produs: `Produs Testare ${i}`,
                cantitate: `${i + 1}`,
                adresa: `Adresa Testare ${i}`,
                data: '2026-04-01'
            })
        }
        localStorage.setItem('listaComenzi', JSON.stringify(orders))
    }

    test('opening an order loads its data into state', () => {
        seedOrders(2)
        app.showLista()

        document.querySelectorAll('.open-btn')[0].click()

        expect(app.client.nume).toBe('Client0')
        expect(app.produs.nume).toBe('Produs Testare 0')
        expect(app.livrare.adresa).toBe('Adresa Testare 0')
    })

    test('opening an order sets editId to the correct index', () => {
        seedOrders(3)
        app.showLista()

        document.querySelectorAll('.open-btn')[1].click()
        expect(app.getEditId()).toBe(1)

        // Re-render and open third
        app.showLista()
        document.querySelectorAll('.open-btn')[2].click()
        expect(app.getEditId()).toBe(2)
    })

    test('saving in edit mode updates the correct order instead of adding a new one', () => {
        seedOrders(2)
        app.showLista()
        document.querySelectorAll('.open-btn')[0].click()

        // Modify the loaded data and save
        app.client.nume = 'ModifiedName'
        app.client.prenume = 'ModifiedSurname'
        app.client.telefon = '11111111'
        app.produs.nume = 'Produs Modificat X'
        app.produs.cantitate = '9'
        app.livrare.adresa = 'Adresa Modificata 99'
        app.livrare.data = '2026-06-15'

        app.showComanda()
        document.querySelector('.final-btn').click()

        const orders = getSavedOrders()
        expect(orders).toHaveLength(2)  // no new order added
        expect(orders[0].nume).toBe('ModifiedName')
        expect(orders[0].produs).toBe('Produs Modificat X')
        expect(orders[1].nume).toBe('Client1')  // second order untouched
    })
})

// ---------------------------------------------------------------------------
// Deleting an order
// ---------------------------------------------------------------------------

describe('Deleting an order', () => {
    function seedOrders() {
        const orders = [
            { nume: 'Alpha', prenume: 'Andrei', telefon: '11111111', produs: 'Produs Alpha X', cantitate: '1', adresa: 'Adresa Alpha', data: '2026-04-01' },
            { nume: 'Beta', prenume: 'Bogdan', telefon: '22222222', produs: 'Produs Beta XY', cantitate: '2', adresa: 'Adresa Beta', data: '2026-04-02' },
            { nume: 'Gamma', prenume: 'George', telefon: '33333333', produs: 'Produs Gamma Z', cantitate: '3', adresa: 'Adresa Gamma', data: '2026-04-03' }
        ]
        localStorage.setItem('listaComenzi', JSON.stringify(orders))
    }

    test('clicking delete removes one order from localStorage', () => {
        seedOrders()
        app.showLista()

        document.querySelectorAll('.del-btn')[0].click()

        expect(getSavedOrders()).toHaveLength(2)
    })

    test('deleting first order removes the correct order and preserves others', () => {
        seedOrders()
        app.showLista()

        document.querySelectorAll('.del-btn')[0].click()

        const orders = getSavedOrders()
        expect(orders[0].nume).toBe('Beta')
        expect(orders[1].nume).toBe('Gamma')
    })

    test('deleting middle order preserves surrounding orders', () => {
        seedOrders()
        app.showLista()

        document.querySelectorAll('.del-btn')[1].click()

        const orders = getSavedOrders()
        expect(orders).toHaveLength(2)
        expect(orders[0].nume).toBe('Alpha')
        expect(orders[1].nume).toBe('Gamma')
    })

    test('deleting last order removes it and preserves the rest', () => {
        seedOrders()
        app.showLista()

        document.querySelectorAll('.del-btn')[2].click()

        const orders = getSavedOrders()
        expect(orders).toHaveLength(2)
        expect(orders[0].nume).toBe('Alpha')
        expect(orders[1].nume).toBe('Beta')
    })

    test('deleting the only order results in empty list', () => {
        localStorage.setItem('listaComenzi', JSON.stringify([
            { nume: 'Solo', prenume: 'Solescu', telefon: '55555555', produs: 'Produs Solo X', cantitate: '1', adresa: 'Adresa Solo', data: '2026-04-01' }
        ]))
        app.showLista()
        document.querySelector('.del-btn').click()

        expect(getSavedOrders()).toHaveLength(0)
    })
})
