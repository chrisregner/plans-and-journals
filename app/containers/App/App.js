import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { AnimatedSwitch } from 'react-router-transition'
import { LastLocationProvider } from 'react-router-last-location'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import 'react-responsive-carousel/lib/styles/carousel.min.css'
import './App.css'
import './animated.css'
import { uiGetters } from 'state'
import Nav from 'components/Nav'
import MapCmpt from 'components/MapCmpt'
import PaperRoutes from 'components/PaperRoutes'
import NotFound from 'components/NotFound'
import ScrollOnRouteChange from 'components/ScrollOnRouteChange'
import FadingMounter from 'components/FadingMounter'
import NotifSnackbar from 'containers/NotifSnackbar'
import NotFoundSetter from 'containers/NotFoundSetter'
import checkIfMobile from 'services/checkIfMobile'

const muiTheme = getMuiTheme({
  appBar: {
    height: 48,
  },
})

const Pages = () => (
  <AnimatedSwitch
    atEnter={{ opacity: 0 }}
    atLeave={{ opacity: 0 }}
    atActive={{ opacity: 1 }}
    className='relative'
  >
    <Route path='/:path(countries|stats|about)' component={PaperRoutes} />
    <Route exact path='/' />
    <Route component={NotFoundSetter} />
  </AnimatedSwitch>
)

class BareApp extends React.Component {
  static propTypes = {
    isPathNotFound: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  }

  state = { isMobile: checkIfMobile() }

  componentDidMount = () => window.addEventListener('optimizedResize', this.handleWindowResize)
  componentWillUnmount = () => window.addEventListener('optimizedResize', this.handleWindowResize)

  hasRendered = false

  handleWindowResize = () => {
    if (this.state.isMobile !== checkIfMobile()) {
      this.hasRendered = false
      this.setState({ isMobile: checkIfMobile() }, () => {
        if (!this.hasRendered) this.forceUpdate()
      })
    }
  }

  render = () => {
    const { isPathNotFound, location } = this.props
    const isNotFound = isPathNotFound(location.pathname) || false

    this.hasRendered = true

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={{ minWidth: 300 }} className='relative min-vh-100 animated fadeIn'>
          <div className='fixed z-1 top-0 right-0 left-0'>
            <Nav />
          </div>

          <div
            className='fixed right-0 left-0 bottom-0'
            style={{
              top: 48,
              height: 'calc(100vh - 48px)',
            }}
          >
            <Switch>
              <Route path='/countries/:countryId' component={MapCmpt} />
              <Route component={MapCmpt} />
            </Switch>
          </div>

          <div className='absolute w-100' style={{ top: 48 }} >
            <FadingMounter className='app-not-found' isVisible={isNotFound} component={NotFound} />

            <LastLocationProvider>
              <FadingMounter className='app-routes' isVisible={!isNotFound} component={Pages} />
            </LastLocationProvider>
          </div>

          <ScrollOnRouteChange />
          <NotifSnackbar />
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = state => ({
  isPathNotFound: path => uiGetters.isPathNotFound(state, path),
})

const App = withRouter(connect(mapStateToProps)(BareApp))

export { BareApp }
export default App
