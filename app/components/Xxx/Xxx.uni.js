import test from 'tape'
import React from 'react'
import { shallow } from 'enzyme'
import td from 'testdouble'

import * as IU from 'services/immutablejsUtils'

import Xxx from './Xxx'

const setup = (args = {}) => {
  td.reset()

  const { props } = args

  const defaultProps = {}
  const finalProps = IU.smartMergeDeep(defaultProps, props)

  return shallow(<Xxx {...finalProps} />)
}

test('it should render without error', t => {
  const wrapper = setup()

  const actual = wrapper.exists()
  const expected = true

  t.true(actual, expected)
  t.end()
})