import { connect } from 'react-redux'

import PlansAndJournals from 'components/PlansAndJournals'
import withHeightWatcher from 'containers/withHeightWatcher'
import { plansGetters } from 'state'

const mapStateToProps = (state, { match }) => ({
  plans: plansGetters.getPlansByCountryId(state, match.params.countryId),
})

const PopulatedPlansAndJournals = connect(mapStateToProps)(
  withHeightWatcher(PlansAndJournals, 'PopulatedPlansAndJournals')
)

export default PopulatedPlansAndJournals
