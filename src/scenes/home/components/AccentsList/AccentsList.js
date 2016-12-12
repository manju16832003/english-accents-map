import React from 'react'
import { Link, browserHistory } from 'react-router'
import DocumentTitle from 'react-document-title'
import makeDocumentTitle from '../../../../services/documentTitle'
import './styles.scss'

const AccentsList = React.createClass({

  componentDidMount () {
    componentHandler.upgradeDom()
    this.loadCountryAndAccentFromUrl()
  },

  componentDidUpdate (prevProps) {
    componentHandler.upgradeDom()
    if (!this.props.countrySelected ||
      prevProps.params.accentId !== this.props.params.accentId) {
      this.loadCountryAndAccentFromUrl()
    }
  },

  loadCountryAndAccentFromUrl () {
    const { params, countries, accents, countriesLoading, accentsLoading,
      countrySelected, accentSelected, onSelectCountry, onSelectAccent } = this.props

    if (countriesLoading || accentsLoading) {
      return
    }

    // Load country
    if (params.countryId !== countrySelected) {
      const country = countries.byId[params.countryId]
      if (!country) {
        browserHistory.push('/') // TODO: 404?
        return
      }
      onSelectCountry(params.countryId)
    }

    // Load accent
    if (params.accentId !== accentSelected) {
      if (params.accentId) {
        const accent = accents.byId[params.accentId]
        if (!accent) {
          browserHistory.push('/' + countrySelected + '/') // TODO: 404?
          return
        }
      }
      onSelectAccent(params.accentId || null)
    }
  },

  selectAccent (id) {
    const { accents, accentSelected, countrySelected } = this.props
    if (accentSelected !== id) {
      const accentUrl = '/' + countrySelected + '/' + id + '/'
      const videos = accents.byId[id].videos
      const url = videos ? accentUrl + '#' + videos[0] : accentUrl
      browserHistory.push(url)
    }
  },

  render () {
    const { countries, accents, countriesLoading, accentsLoading, countrySelected,
      accentSelected, regionAccentIds, countryAccentIds } = this.props
    let header, body, menu, docTitle

    if (!countriesLoading && !accentsLoading && countrySelected) {
      docTitle = accentSelected
        ? accents.byId[accentSelected].name + ' - ' + countries.byId[countrySelected].name
        : countries.byId[countrySelected].name

      header = (
        <div className='mdl-card__title'>
          <img className='mdl-list__item-avatar'
            src={'/images/flags/' + countrySelected + '.svg'}
            alt={countries.byId[countrySelected].name} />
          <h2 className='mdl-card__title-text'>
            { countries.byId[countrySelected].name }
          </h2>
        </div>
      )

      body = (
        <section>
          {
            countryAccentIds.length > 0
            ? <div>
              <h3 className='eam-card__list-subheader'>General</h3>
              <AccentsListBody
                accentIds={countryAccentIds}
                accents={accents}
                accentSelected={accentSelected}
                onAccentClick={this.selectAccent}
              />
            </div>
            : null
          }
          {
            regionAccentIds.length > 0
            ? <div>
              <h3 className='eam-card__list-subheader'>By region</h3>
              <AccentsListBody
                accentIds={regionAccentIds}
                accents={accents}
                accentSelected={accentSelected}
                onAccentClick={this.selectAccent}
              />
            </div>
            : null
          }
        </section>
      )

      menu = (
        <Link className='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect'
          to={'/'}>
          <i className='material-icons'>arrow_back</i>
        </Link>
      )
    } else {
      docTitle = null
      header = null

      body = (
        <div className='loading-indicator'>
          <div ref='spinner' className='mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active' />
        </div>
      )
      menu = null
    }

    return (
      <div>
        <DocumentTitle title={makeDocumentTitle(docTitle)} />
        <div className='eam-card eam-card--accents-list mdl-card mdl-shadow--8dp'>
          { header }
          <div className='mdl-card__supporting-text'>{ body }</div>
          <div className='mdl-card__menu'>{ menu }</div>
        </div>
      </div>
    )
  },

  propTypes: {
    params: React.PropTypes.object,
    countries: React.PropTypes.object,
    accents: React.PropTypes.object,
    countryAccentIds: React.PropTypes.array,
    regionAccentIds: React.PropTypes.array,
    countriesLoading: React.PropTypes.bool,
    accentsLoading: React.PropTypes.bool,
    countrySelected: React.PropTypes.string,
    accentSelected: React.PropTypes.string,
    onSelectCountry: React.PropTypes.func,
    onSelectAccent: React.PropTypes.func
  }
})

const AccentsListBody = ({ accentIds, accents, accentSelected, onAccentClick }) => (
  <ul className='mdl-list'>
    { accentIds.map((id) => (
      <li key={id} className='mdl-list__item mdl-list__item--two-line'>
        <div
          className={'eam-card__link' + (accentSelected === id ? ' eam-card__link--active' : '')}
          onClick={() => onAccentClick(id)}>
          <span className='mdl-list__item-primary-content'>
            <span>{accents.byId[id].name}</span>
            <span className='mdl-list__item-sub-title'>{accents.byId[id].videos.length} videos</span>
          </span>
          <span className='mdl-list__item-secondary-action'>
            <i className='material-icons'>play_circle_outline</i>
          </span>
        </div>
      </li>
      )
    ) }
  </ul>
)

AccentsListBody.propTypes = {
  accents: React.PropTypes.object,
  accentIds: React.PropTypes.array,
  accentSelected: React.PropTypes.string,
  onAccentClick: React.PropTypes.func
}

export default AccentsList
