import { test } from 'mocha'
import { assert } from 'chai'

import * as TU from 'services/testUtils'
import InsertPaperTransition from './InsertPaperTransition'

const setup = TU.makeTestSetup({
  Component: InsertPaperTransition,
})

test('components.InsertPaperTransition | it should render without error', () => {
  const actual = setup().exists()
  assert.isTrue(actual)
})