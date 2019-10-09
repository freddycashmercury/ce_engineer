import { Controller } from 'stimulus'
import { XHR } from 'classes/xhr'

export default class extends Controller {
  static targets = [
    'container',
    'currentPage',
    'paginationNext',
    'paginationPrev',
    'paginationTemplate',
    'template'
  ]

  initialize() {
    this.restaurants = {}
  }

  connect() {
    this._addPaginationControls()
    this._showRestaurantsByPage(1)
  }

  nextPage(event) {
    event.preventDefault()

    if (this.currentPage < this.lastPage) {
      this._showRestaurantsByPage(this.currentPage + 1)
    }
  }

  previousPage(event) {
    event.preventDefault()

    if (this.currentPage > 1) {
      this._showRestaurantsByPage(this.currentPage - 1)
    }
  }

  get container() {
    return this.containerTarget
  }

  get remoteUrl() {
    return this.data.get('endpoint')
  }

  get currentPage() {
    return parseInt(this.currentPageTarget.textContent)
  }

  set currentPage(value) {
    for (var target of this.currentPageTargets) {
      target.textContent = value
    }
  }

  get paginationTemplate() {
    return this.paginationTemplateTarget
  }

  get paginationTemplateClone() {
    return this.paginationTemplate.content.cloneNode(true)
  }

  get template() {
    return this.templateTarget
  }

  get templateClone() {
    return this.template.content.cloneNode(true)
  }

  _getRestaurantPage(page) {
    return this.restaurants[page - 1]
  }

  _hasRestaurantPage(page) {
    return (page - 1) in this.restaurants
  }

  _cacheRestaurantPage(page, restaurants) {
    this.restaurants[page - 1] = restaurants
  }

  _addPaginationControls() {
    this.element.insertBefore(this.paginationTemplateClone, this.container)
    this.element.appendChild(this.paginationTemplateClone)
  }

  _paginatedUrlFor(page) {
    const hasVariables = this.remoteUrl.includes('?')
    const querySeparator = hasVariables ? '&' : '?'
    return `${this.remoteUrl}${querySeparator}page=${page}`
  }


  /*
   * Example Restaurant JSON structure
   *
   * {
   *   "name": "Downing Street Grill",
   *   "address": "3090 Downing St",
   *   "image_url": "https://www.opentable.com/img/restimages/148537.jpg",
   *   "reserve_url": "http://www.opentable.com/single.aspx?rid=148537"
   * }
   */
  _injectRestaurants(page) {
    this._emptyContainer()

    for (var restaurant of this._getRestaurantPage(page)) {
      const clone = this.templateClone

      clone.querySelector('.restaurant__image').setAttribute('src', restaurant['image_url'])
      clone.querySelector('.restaurant__name').textContent = restaurant['name']
      clone.querySelector('.restaurant__address').textContent = restaurant['address']
      clone.querySelector('.restaurant__reserve').setAttribute('href', restaurant['reserve_url'])

      this.container.appendChild(clone)
    }
  }

  _emptyContainer() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild)
    }
  }

  _showRestaurantsByPage(page) {
    if (!this._hasRestaurantPage(page)) {
      this._remoteFetchAndInjectRestaurants(page)
    } else {
      this._injectRestaurants(page)
      this._updatePaginationUi(page)
    }
  }

  _remoteFetchAndInjectRestaurants(page) {
    const xhr = new XHR
    const paginatedUrl = this._paginatedUrlFor(page)

    xhr.get(paginatedUrl).then(response => {
      if (response !== ' ') {
        const jsonResponse = JSON.parse(response)
        const entriesCount = jsonResponse['total_entries']
        const entriesPerPage = jsonResponse['per_page']

        this._cacheRestaurantPage(page, new Set(jsonResponse['restaurants']))
        this._injectRestaurants(page)

        this._setLastPage(entriesCount, entriesPerPage)
        this._updatePaginationUi(page)
      } else {
        console.log('empty response')
      }
    }, error => console.log(error))
  }

  _updatePaginationUi(page) {
    this.currentPage = page
    const inactiveClass = 'pagination__link--inactive'

    if (page === 1) {
      this.paginationPrevTargets.map(link => link.classList.add(inactiveClass))
      this.paginationNextTargets.map(link => link.classList.remove(inactiveClass))
    } else if (page === this.lastPage) {
      this.paginationPrevTargets.map(link => link.classList.remove(inactiveClass))
      this.paginationNextTargets.map(link => link.classList.add(inactiveClass))
    } else {
      this.paginationPrevTargets.map(link => link.classList.remove(inactiveClass))
      this.paginationNextTargets.map(link => link.classList.remove(inactiveClass))
    }
  }

  _setLastPage(entriesCount, entriesPerPage) {
    this.lastPage = Math.ceil(entriesCount / entriesPerPage)
  }
}
