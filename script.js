const hero = document.querySelector('.hero')
const loginBtn = document.querySelector('.login')
const startBtn = document.querySelector('.singUp')
const viewBtn = document.querySelector('.btn-verify')
const infoBtn = document.querySelector('.btn-info')
const emailBtn = document.querySelector('.button')

const style = document.createElement('style')
style.textContent = `
.exam-app {
    width: 100%;
    padding: 40px 30px;
}

.exam-box {
    max-width: 1100px;
    margin: 0 auto;
    background: #1a1e35;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 16px;
    padding: 30px;
}

.exam-box h2 {
    color: #ffffff;
    margin: 0 0 20px 0;
}

.exam-menu {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 24px;
}

.exam-menu button {
    background: #394560;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 12px 18px;
    cursor: pointer;
    font-size: 15px;
}

.exam-menu .show-order {
    display: none;
    background: #4f6ef7;
}

.exam-zone {
    color: #ffffff;
}

.exam-zone h3 {
    margin-top: 0;
    color: #ffffff;
}

.exam-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.exam-form input {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #252a45;
    background: #0d0f1a;
    color: #ffffff;
    font-size: 15px;
}

.exam-form button,
.final-btn,
.back-btn,
.del-btn,
.open-btn {
    padding: 12px 18px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 15px;
}

.exam-form button,
.final-btn,
.open-btn {
    background: #4f6ef7;
    color: #ffffff;
}

.back-btn,
.del-btn {
    background: #394560;
    color: #ffffff;
}

.valid {
    border: 2px solid #22c55e !important;
}

.error {
    border: 2px solid #ef4444 !important;
}

.done {
    margin-top: 10px;
    color: #22c55e;
    font-size: 14px;
}

.exam-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;
}

.exam-table th,
.exam-table td {
    border: 1px solid #394560;
    padding: 10px;
    text-align: left;
    color: #ffffff;
}

.exam-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.sum-box {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.sum-box p {
    margin: 0;
}

@media (max-width: 800px) {
    .exam-box {
        padding: 20px;
    }

    .exam-table {
        display: block;
        overflow-x: auto;
    }
}
`
document.head.appendChild(style)

const app = document.createElement('section')
app.className = 'exam-app'
app.innerHTML = `
    <div class="exam-box">
        <h2>Order App</h2>
        <div class="exam-menu">
            <button class="btn-client">Client</button>
            <button class="btn-prod">Produse</button>
            <button class="btn-liv">Livrare</button>
            <button class="btn-list">Lista comenzi</button>
            <button class="show-order">Afișează comanda</button>
        </div>
        <div class="exam-zone"></div>
    </div>
`
hero.appendChild(app)

const zone = document.querySelector('.exam-zone')
const btnClient = document.querySelector('.btn-client')
const btnProd = document.querySelector('.btn-prod')
const btnLiv = document.querySelector('.btn-liv')
const btnList = document.querySelector('.btn-list')
const showOrder = document.querySelector('.show-order')

let client = {
    nume: '',
    prenume: '',
    telefon: ''
}

let produs = {
    nume: '',
    cantitate: ''
}

let livrare = {
    adresa: '',
    data: ''
}

let editId = -1

function emptyFn() {}

window.login = emptyFn
window.signUp = emptyFn
window.verificare = emptyFn
window.registerMe = emptyFn

function goToApp(page) {
    showPage(page)
    app.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

if (loginBtn) {
    loginBtn.addEventListener('click', function (e) {
        e.preventDefault()
        goToApp('client')
    })
}

if (startBtn) {
    startBtn.addEventListener('click', function (e) {
        e.preventDefault()
        goToApp('client')
    })
}

if (viewBtn) {
    viewBtn.addEventListener('click', function (e) {
        e.preventDefault()
        goToApp('produse')
    })
}

if (infoBtn) {
    infoBtn.addEventListener('click', function (e) {
        e.preventDefault()
        goToApp('livrare')
    })
}

if (emailBtn) {
    emailBtn.addEventListener('click', function (e) {
        e.preventDefault()
        goToApp('client')
    })
}

btnClient.addEventListener('click', function () {
    showPage('client')
})

btnProd.addEventListener('click', function () {
    showPage('produse')
})

btnLiv.addEventListener('click', function () {
    showPage('livrare')
})

btnList.addEventListener('click', function () {
    showPage('lista')
})

showOrder.addEventListener('click', function () {
    showPage('comanda')
})

function setState(input, ok) {
    input.classList.remove('valid')
    input.classList.remove('error')

    if (input.value.trim() === '') {
        return
    }

    if (ok) {
        input.classList.add('valid')
    } else {
        input.classList.add('error')
    }
}

function okClient() {
    const ok1 = client.nume.trim().length >= 5
    const ok2 = client.prenume.trim().length >= 5
    const ok3 = /^\d{8}$/.test(client.telefon)
    return ok1 && ok2 && ok3
}

function okProdus() {
    const ok1 = produs.nume.trim().length >= 7
    const ok2 = Number(produs.cantitate) > 0
    return ok1 && ok2
}

function okLivrare() {
    const ok1 = livrare.adresa.trim().length >= 5
    const ok2 = livrare.data.trim() !== ''
    return ok1 && ok2
}

function updateShowBtn() {
    if (okClient() && okProdus() && okLivrare()) {
        showOrder.style.display = 'inline-block'
    } else {
        showOrder.style.display = 'none'
    }
}

function showPage(page) {
    switch (page) {
        case 'client':
            showClient()
            break
        case 'produse':
            showProdus()
            break
        case 'livrare':
            showLivrare()
            break
        case 'comanda':
            showComanda()
            break
        case 'lista':
            showLista()
            break
        default:
            showClient()
    }
}

function showClient() {
    zone.innerHTML = `
        <h3>Client</h3>
        <div class="exam-form">
            <input type="text" class="nume" placeholder="Nume client" value="${client.nume}">
            <input type="text" class="prenume" placeholder="Prenume client" value="${client.prenume}">
            <input type="text" class="telefon" placeholder="Telefon" value="${client.telefon}">
            <button class="save-client">Salvează client</button>
            <div class="done text-client"></div>
        </div>
    `

    const nume = document.querySelector('.nume')
    const prenume = document.querySelector('.prenume')
    const telefon = document.querySelector('.telefon')
    const save = document.querySelector('.save-client')
    const text = document.querySelector('.text-client')

    function checkNow() {
        setState(nume, nume.value.trim().length >= 5)
        setState(prenume, prenume.value.trim().length >= 5)
        setState(telefon, /^\d{8}$/.test(telefon.value.trim()))
    }

    nume.addEventListener('input', function () {
        checkNow()
    })

    prenume.addEventListener('input', function () {
        checkNow()
    })

    telefon.addEventListener('input', function () {
        checkNow()
    })

    save.addEventListener('click', function () {
        checkNow()

        const ok1 = nume.value.trim().length >= 5
        const ok2 = prenume.value.trim().length >= 5
        const ok3 = /^\d{8}$/.test(telefon.value.trim())

        if (ok1 && ok2 && ok3) {
            client.nume = nume.value.trim()
            client.prenume = prenume.value.trim()
            client.telefon = telefon.value.trim()
            text.textContent = 'Datele clientului au fost salvate.'
            updateShowBtn()
        } else {
            text.textContent = ''
        }
    })
}

function showProdus() {
    zone.innerHTML = `
        <h3>Produse</h3>
        <div class="exam-form">
            <input type="text" class="produs" placeholder="Denumire produs" value="${produs.nume}">
            <input type="number" class="cantitate" placeholder="Cantitate" value="${produs.cantitate}">
            <button class="save-produs">Salvează produs</button>
            <div class="done text-produs"></div>
        </div>
    `

    const nume = document.querySelector('.produs')
    const cantitate = document.querySelector('.cantitate')
    const save = document.querySelector('.save-produs')
    const text = document.querySelector('.text-produs')

    function checkNow() {
        setState(nume, nume.value.trim().length >= 7)
        setState(cantitate, Number(cantitate.value) > 0)
    }

    nume.addEventListener('input', function () {
        checkNow()
    })

    cantitate.addEventListener('input', function () {
        checkNow()
    })

    save.addEventListener('click', function () {
        checkNow()

        const ok1 = nume.value.trim().length >= 7
        const ok2 = Number(cantitate.value) > 0

        if (ok1 && ok2) {
            produs.nume = nume.value.trim()
            produs.cantitate = cantitate.value.trim()
            text.textContent = 'Datele produsului au fost salvate.'
            updateShowBtn()
        } else {
            text.textContent = ''
        }
    })
}

function showLivrare() {
    zone.innerHTML = `
        <h3>Livrare</h3>
        <div class="exam-form">
            <input type="text" class="adresa" placeholder="Adresă" value="${livrare.adresa}">
            <input type="date" class="data" value="${livrare.data}">
            <button class="save-livrare">Salvează livrarea</button>
            <div class="done text-livrare"></div>
        </div>
    `

    const adresa = document.querySelector('.adresa')
    const data = document.querySelector('.data')
    const save = document.querySelector('.save-livrare')
    const text = document.querySelector('.text-livrare')

    function checkNow() {
        setState(adresa, adresa.value.trim().length >= 5)
        setState(data, data.value.trim() !== '')
    }

    adresa.addEventListener('input', function () {
        checkNow()
    })

    data.addEventListener('input', function () {
        checkNow()
    })

    save.addEventListener('click', function () {
        checkNow()

        const ok1 = adresa.value.trim().length >= 5
        const ok2 = data.value.trim() !== ''

        if (ok1 && ok2) {
            livrare.adresa = adresa.value.trim()
            livrare.data = data.value.trim()
            text.textContent = 'Datele livrării au fost salvate.'
            updateShowBtn()
        } else {
            text.textContent = ''
        }
    })
}

function makeOrder() {
    return {
        nume: client.nume,
        prenume: client.prenume,
        telefon: client.telefon,
        produs: produs.nume,
        cantitate: produs.cantitate,
        adresa: livrare.adresa,
        data: livrare.data
    }
}

function clearData() {
    client.nume = ''
    client.prenume = ''
    client.telefon = ''

    produs.nume = ''
    produs.cantitate = ''

    livrare.adresa = ''
    livrare.data = ''

    editId = -1
    updateShowBtn()
}

function showComanda() {
    if (!okClient() || !okProdus() || !okLivrare()) {
        zone.innerHTML = `<p>Completează corect toate cele 3 secțiuni.</p>`
        return
    }

    zone.innerHTML = `
        <h3>Comanda</h3>
        <div class="sum-box">
            <p><strong>Nume:</strong> ${client.nume}</p>
            <p><strong>Prenume:</strong> ${client.prenume}</p>
            <p><strong>Telefon:</strong> ${client.telefon}</p>
            <p><strong>Produs:</strong> ${produs.nume}</p>
            <p><strong>Cantitate:</strong> ${produs.cantitate}</p>
            <p><strong>Adresă:</strong> ${livrare.adresa}</p>
            <p><strong>Data livrării:</strong> ${livrare.data}</p>
            <button class="final-btn">Înregistrează comanda</button>
            <div class="done final-text"></div>
        </div>
    `

    const finalBtn = document.querySelector('.final-btn')
    const finalText = document.querySelector('.final-text')

    finalBtn.addEventListener('click', function () {
        const list = JSON.parse(localStorage.getItem('listaComenzi')) || []
        const data = makeOrder()

        if (editId === -1) {
            list.push(data)
        } else {
            list[editId] = data
        }

        localStorage.setItem('listaComenzi', JSON.stringify(list))
        finalText.textContent = 'Comanda a fost salvată în localStorage.'
        clearData()

        setTimeout(function () {
            showLista()
        }, 500)
    })
}

function showLista() {
    const list = JSON.parse(localStorage.getItem('listaComenzi')) || []

    if (list.length === 0) {
        zone.innerHTML = `
            <h3>Lista comenzi</h3>
            <p>Nu există comenzi salvate.</p>
        `
        return
    }

    let rows = ''

    for (let i = 0; i < list.length; i++) {
        rows += `
            <tr>
                <td>${list[i].nume} ${list[i].prenume}</td>
                <td>${list[i].telefon}</td>
                <td>${list[i].produs}</td>
                <td>${list[i].cantitate}</td>
                <td>${list[i].adresa}</td>
                <td>${list[i].data}</td>
                <td>
                    <div class="exam-actions">
                        <button class="open-btn" data-id="${i}">Deschide</button>
                        <button class="del-btn" data-id="${i}">Elimină</button>
                    </div>
                </td>
            </tr>
        `
    }

    zone.innerHTML = `
        <h3>Lista comenzi</h3>
        <table class="exam-table">
            <thead>
                <tr>
                    <th>Client</th>
                    <th>Telefon</th>
                    <th>Produs</th>
                    <th>Cantitate</th>
                    <th>Adresă</th>
                    <th>Data</th>
                    <th>Acțiuni</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `

    const delBtns = document.querySelectorAll('.del-btn')
    const openBtns = document.querySelectorAll('.open-btn')

    delBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const id = Number(btn.dataset.id)
            const newList = JSON.parse(localStorage.getItem('listaComenzi')) || []
            newList.splice(id, 1)
            localStorage.setItem('listaComenzi', JSON.stringify(newList))
            showLista()
        })
    })

    openBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const id = Number(btn.dataset.id)
            const newList = JSON.parse(localStorage.getItem('listaComenzi')) || []
            const item = newList[id]

            client.nume = item.nume
            client.prenume = item.prenume
            client.telefon = item.telefon

            produs.nume = item.produs
            produs.cantitate = item.cantitate

            livrare.adresa = item.adresa
            livrare.data = item.data

            editId = id
            updateShowBtn()
            showClient()
        })
    })
}

updateShowBtn()
showPage('client')

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        client,
        produs,
        livrare,
        getEditId: () => editId,
        setEditId: (id) => { editId = id },
        okClient,
        okProdus,
        okLivrare,
        setState,
        makeOrder,
        clearData,
        updateShowBtn,
        showPage,
        showClient,
        showProdus,
        showLivrare,
        showComanda,
        showLista
    }
}
