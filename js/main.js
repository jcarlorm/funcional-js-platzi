const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data)


const attrsToString = (obj = {}) => 
    Object.keys(obj)
        .map(key => `${key}="${obj[key]}"`)
        .join(' ')

const tagAttrs = obj => (content = '') =>
  `<${obj.tag}${obj.attrs ? ' ' :	 ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`

const tag = t => typeof t === 'string' ? tagAttrs({ tag: t}) : tagAttrs(t)

const tableRowTag = tag('tr')
const tableRow = items => compose(tableRowTag, tableCells)(items)

const tableCell = tag('td')
const tableCells = items => items.map(tableCell).join('')
const trashIcon = tag({ tag: 'i', attrs:{ class: 'fas fa-trash-alt' }})('')


let descripcion = document.getElementById('descripcion')
let carbs = document.getElementById('carbs')
let proteinas = document.getElementById('proteinas')
let calorias = document.getElementById('calorias')
let btnAgregar = document.getElementById('btnAgregar')

let list = []

const mostrarError = (el) => el.classList.add('is-invalid')
const ocultarError = (el) => el.classList.remove('is-invalid')

const validateInputs = () => {
    descripcion.value ? '' :  mostrarError(descripcion)
    carbs.value ? '' : mostrarError(carbs) 
    proteinas.value ? '' : mostrarError(proteinas) 
    calorias.value ? '' : mostrarError(calorias) 

    if (
        descripcion.value &&
        carbs.value &&
        proteinas.value &&
        calorias.value
    ) add()
}

const add = () =>  {
    const newItem = {
        descripcion: descripcion.value,
        carbs: parseInt(carbs.value),
        proteinas: parseInt(proteinas.value),
        calorias: parseInt(calorias.value),
    }
    list.push(newItem)
    cleanInputs()
    updateTotals()
    renderItems()
}

const updateTotals = () => {
    let calories = 0, proteins = 0, carbs = 0
    list.map(item => {
        calories += item.calorias
        proteins += item.proteinas
        carbs += item.carbs
    })

    document.getElementById('totalCalorias').innerText = calories
    document.getElementById('totalCarbs').innerText = carbs
    document.getElementById('totalProteins').innerText = proteins
}
const cleanInputs = () => {
    descripcion.value = ''
    calorias.value = ''
    carbs.value = ''
    proteinas.value = ''
}


const renderItems = () => {
    let tbody = document.querySelector('tbody')
    let htmlLista = []

    list.map((item, index) => {
        const removeButton  = tag({
            tag: 'button',
            attrs: {
                class: 'btn btn-outline-danger',
                onClick: `removeItem(${index})`
            }
        })(trashIcon)
        htmlLista.push(tableRow([item.descripcion, item.calorias, item.carbs, item.proteinas, removeButton]))
    })

    tbody.innerHTML = htmlLista.join('')
}

const removeItem = index => {
    list.splice(index, 1)
    updateTotals()
    renderItems()
}

btnAgregar.addEventListener('click', validateInputs)
descripcion.addEventListener('keydown', () => ocultarError(descripcion))
carbs.addEventListener('keydown', () => ocultarError(carbs))
proteinas.addEventListener('keydown', () => ocultarError(proteinas))
calorias.addEventListener('keydown', () => ocultarError(calorias))
