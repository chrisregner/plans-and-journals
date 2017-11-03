import { test } from 'mocha'
import { assert } from 'chai'
import td from 'testdouble'
import I from 'immutable'
import D from 'date-fns'

import * as TU from 'services/testUtils'
import { JournalFormShell } from './JournalForm'

const deps = {
  theCloudinary: {
    openUploadWidget: td.func()
  }
}

const JournalForm = JournalFormShell(deps)

const mockData = {
  ev: { preventDefault: () => {} },
  inOneDay: new Date(),
  inTenDays: D.addDays(new Date(), 10),
}

const defProps = {
  handleSubmit: td.func(),
  history: {
    push: td.func(),
  },
  match: {
    params: { countryId: '' },
  },
  id: '',
}

const setup = TU.makeTestSetup({
  Component: JournalForm,
  tools: ['td'],
  defaultProps: defProps,
})

const fillForm = (values, wrapper) => {
  Object.entries(values).forEach((entry) => {
    const getField = () => wrapper.find(`.journal-form-${entry[0]}`)

    getField().simulate('change', mockData.ev, entry[1])
  })
}

test('JournalForm | it should render without error', () => {
  const wrapper = setup()
  const actual = wrapper.exists()

  assert.isTrue(actual)
})

test('JournalForm | it should render CountryName with correct props', () => {
  const testWithVar = (countryId) => {
    const props = {
      match: {
        params: { countryId },
      },
    }
    const wrapper = setup({ props })
    const countryNameWrpr = wrapper.find('.journal-form-country-name')

    const actual = countryNameWrpr.prop('countryId')
    const expected = countryId

    assert.equal(actual, expected)
  }

  testWithVar('PH')
  testWithVar('US')
  testWithVar('JP')
})

/**
 * TitleField
 */

test('JournalForm > TitleField | it should work', () => {
  const wrapper = setup()
  const getField = () => wrapper.find('.journal-form-title-field')

  const value = 'Sample Journal Title'
  getField().simulate('change', null, value)

  const expected = value
  const actual = getField().prop('value')

  assert.equal(actual, expected)
})

test('JournalForm > TitleField | if changed to blank, it should show error', () => {
  const wrapper = setup()
  const getField = () => wrapper.find('.journal-form-title-field')

  getField().simulate('change', null, '')

  const actual = getField().prop('errorText')

  assert.ok(actual)
})

test('JournalForm > TitleField | if NOT filled and submitted, it should NOT call handleSubmit()', () => {
  const wrapper = setup()

  wrapper.find('form').simulate('submit', mockData.ev)

  td.verify(defProps.handleSubmit(), { times: 0, ignoreExtraArgs: true })
})

test('JournalForm > TitleField | if NOT filled and submitted, it should show error', () => {
  const wrapper = setup()

  wrapper.find('form').simulate('submit', mockData.ev)

  const getField = () => wrapper.find('.journal-form-title-field')
  const actual = getField().prop('errorText')

  assert.ok(actual)
})

test('JournalForm > TitleField | it should accept initial value', () => {
  const props = {
    initialValues: I.Map({
      id: 'randomId',
      title: 'Random Initial Title',
    }),
  }

  const titleWrpr = setup({ props })
    .find('.journal-form-title-field')

  const actual = titleWrpr.prop('value')
  const expected = 'Random Initial Title'

  assert.equal(actual, expected)
})

test('JournalForm > TitleField | if initial value is provided, it should still be emptiable', () => {
  const props = {
    initialValues: I.Map({
      id: 'randomId',
      title: 'Random Initial Title',
    }),
  }

  const wrapper = setup({ props })
  const getField = () => wrapper.find('.journal-form-title-field')
  const newEmptyVal = ''

  getField().simulate('change', null, newEmptyVal)

  const actual = getField().prop('value')

  assert.isNotOk(actual)
})

/**
 * TextContentField
 */

test('JournalForm > TextContentField | it should work', () => {
  const wrapper = setup()
  const getField = () => wrapper.find('.journal-form-text-content-field')

  const value = 'Sample Text Content'
  getField().simulate('change', null, value)

  const expected = value
  const actual = getField().prop('value')

  assert.equal(actual, expected)
})

test('JournalForm > TextContentField | it should accept initial value', () => {
  const props = {
    initialValues: I.Map({
      id: 'randomId',
      title: '',
      textContent: 'Random Initial Text Content',
    }),
  }

  const textContentWrpr = setup({ props })
    .find('.journal-form-text-content-field')

  const actual = textContentWrpr.prop('value')
  const expected = 'Random Initial Text Content'

  assert.equal(actual, expected)
})

test('JournalForm > TextContentField | if initial value is provided, it should still be emptiable', () => {
  const props = {
    initialValues: I.Map({
      id: 'randomId',
      title: '',
      textContent: 'Random Initial Text Content',
    }),
  }

  const wrapper = setup({ props })
  const getField = () => wrapper.find('.journal-form-text-content-field')
  const newEmptyVal = ''

  getField().simulate('change', null, newEmptyVal)

  const actual = getField().prop('value')

  assert.isNotOk(actual)
})

/**
 * Departure
 */

test('JournalForm > DepartureField | it should work', () => {
  const wrapper = setup()
  const getField = () => wrapper.find('.journal-form-departure-field')

  const value = mockData.inOneDay
  getField().simulate('change', null, value)

  const expected = value
  const actual = getField().prop('value')

  assert.equal(actual, expected)
})

test('JournalForm > DepartureField | if HomecomingField is filled, it should have maxDate equal to HomecomingField\'s value', () => {
  const wrapper = setup()
  const getDepartureField = () => wrapper.find('.journal-form-departure-field')
  const getHomecomingField = () => wrapper.find('.journal-form-homecoming-field')

  const value = mockData.inOneDay
  getHomecomingField().simulate('change', null, value)

  const expected = value
  const actual = getDepartureField().prop('maxDate')

  assert.equal(actual, expected)
})

test('JournalForm > DepartureField | it should accept initial value', () => {
  const props = {
    initialValues: I.Map({
      id: 'randomId',
      title: '',
      departure: mockData.inOneDay,
    }),
  }
  const fieldWrpr = setup({ props }).find('.journal-form-departure-field')

  const actual = fieldWrpr.prop('value')
  const expected = mockData.inOneDay

  assert.deepEqual(actual, expected)
})

/**
 * Homecoming
 */

test('JournalForm > HomecomingField | it should work', () => {
  const wrapper = setup()
  const getField = () => wrapper.find('.journal-form-homecoming-field')

  const value = mockData.inOneDay
  getField().simulate('change', null, value)

  const expected = value
  const actual = getField().prop('value')

  assert.equal(actual, expected)
})

test('JournalForm > HomecomingField | if DepartureField is filled, it should have minDate equal to DepartureField\'s value', () => {
  const wrapper = setup()
  const getHomecomingField = () => wrapper.find('.journal-form-homecoming-field')
  const getDepartureField = () => wrapper.find('.journal-form-departure-field')

  const value = mockData.inOneDay
  getDepartureField().simulate('change', null, value)

  const expected = value
  const actual = getHomecomingField().prop('minDate')

  assert.equal(actual, expected)
})

test('JournalForm > HomecomingField | it should accept initial value', () => {
  const props = {
    initialValues: I.Map({
      id: 'randomId',
      title: '',
      homecoming: mockData.inOneDay,
    }),
  }
  const fieldWrpr = setup({ props }).find('.journal-form-homecoming-field')

  const actual = fieldWrpr.prop('value')
  const expected = mockData.inOneDay

  assert.deepEqual(actual, expected)
})

/**
 * Delete
 */

test('JournalForm > DeleteBtn | if id is provided, it should the render a delete button', () => {
  const props = {
    initialValues: I.Map({
      id: 'randomId',
      title: '',
    }),
  }
  const deleteBtnWrpr = setup({ props })
    .find('.journal-form-delete-btn')

  const actual = deleteBtnWrpr.exists()

  assert.isTrue(actual)
})

test('JournalForm > DeleteBtn | if delete button is clicked, it should handleDelete with id', () => {
  const fakeHandleDelete = td.func()
  const props = {
    initialValues: I.Map({
      id: 'randomId',
      title: '',
    }),
    handleDelete: fakeHandleDelete,
  }
  const deleteBtnWrpr = setup({ props })
    .find('.journal-form-delete-btn')

  deleteBtnWrpr.simulate('click')

  td.verify(fakeHandleDelete('randomId'), { times: 1 })
})

test('JournalForm > DeleteBtn | if delete button is clicked, it should call history.push() with correct args', () => {
  const testWithVar = (countryId) => {
    const props = {
      match: {
        params: { countryId },
      },
      initialValues: I.Map({
        id: 'randomId',
        title: '',
      }),
      handleDelete: () => {},
    }

    const deleteBtnWrpr = setup({ props })
      .find('.journal-form-delete-btn')

    deleteBtnWrpr.simulate('click')

    const expectedArg = `/countries/${countryId}`

    td.verify(defProps.history.push(expectedArg), { times: 1 })
  }

  testWithVar('PH')
  testWithVar('US')
  testWithVar('JP')
})

/**
 * onSubmit
 */

test('JournalForm > .onSubmit() | if form is valid and initial values were provided, it should call handleSubmit() with correct data including the id', () => {
  const testWithChangingSomeField = () => {
    const props = {
      initialValues: I.Map({
        id: 'randomId',
        title: 'Random Initial Title',
        homecoming: mockData.inOneDay,
      }),
    }
    const values = {
      'text-content-field': `
        Sample Spaceous Text Content
      `,
      'departure-field': mockData.inOneDay,
      'homecoming-field': mockData.inTenDays,
    }
    const wrapper = setup({ props })

    fillForm(values, wrapper)
    wrapper.find('form').simulate('submit', mockData.ev)

    const expectedArg = I.Map({
      id: 'randomId',
      title: 'Random Initial Title',
      textContent: 'Sample Spaceous Text Content',
      departure: mockData.inOneDay,
      homecoming: mockData.inTenDays,
    })

    td.verify(defProps.handleSubmit(expectedArg), { times: 1 })
  }

  const testWithChangingNoField = () => {
    const props = {
      initialValues: I.Map({
        id: 'randomId',
        title: 'Random Initial Title',
        homecoming: mockData.inOneDay,
      }),
    }
    const wrapper = setup({ props })

    wrapper.find('form').simulate('submit', mockData.ev)

    const expectedArg = I.Map({
      id: 'randomId',
      title: 'Random Initial Title',
      homecoming: mockData.inOneDay,
    })

    td.verify(defProps.handleSubmit(expectedArg), { times: 1 })
  }

  const testWithEmptiyingAField = () => {
    const props = {
      initialValues: I.Map({
        id: 'randomId',
        title: 'Random Initial Title',
        textContent: `
          Sample Spaceous Text Content
        `,
        homecoming: mockData.inOneDay,
      }),
    }
    const wrapper = setup({ props })
    const values = {
      'text-content-field': '',
    }

    fillForm(values, wrapper)
    wrapper.find('form').simulate('submit', mockData.ev)

    const expectedArg = I.Map({
      id: 'randomId',
      title: 'Random Initial Title',
      homecoming: mockData.inOneDay,
      textContent: '',
    })

    td.verify(defProps.handleSubmit(expectedArg), { times: 1 })
  }

  testWithChangingSomeField()
  testWithChangingNoField()
  testWithEmptiyingAField()
})

test('JournalForm > .onSubmit() | if form is valid, it should call history.push() with correct args', () => {
  const testWithVar = (countryId) => {
    const props = {
      match: {
        params: { countryId },
      },
    }
    const wrapper = setup({ props })

    fillForm({ 'title-field': 'Sample Journal Title' }, wrapper)
    wrapper.find('form').simulate('submit', mockData.ev)

    const expectedArg = `/countries/${countryId}`

    td.verify(defProps.history.push(expectedArg), { times: 1 })
  }

  testWithVar('PH')
  testWithVar('US')
  testWithVar('JP')
})

/**
 * Image Upload
 */

test.skip('JournalForm.state.photos | it should accept initial values')
test.skip('JournalForm > PhotoFieldSet | it should render it with correct props for each photo data in state')

test('JournalForm > UploadPhotoBtn | when clicked, it should call openUploadWidget()', () => {
  const uploadBtnWrpr = setup().find('.journal-form-upload-btn')
  uploadBtnWrpr.simulate('click')
  td.verify(deps.theCloudinary.openUploadWidget(), { times: 1, ignoreExtraArgs: true })
})

test('JournalForm > UploadPhotoBtn | when openUploadWidget() succeeds and photo state has existing data, it should add the correct photo details to the state', () => {
  const wrapper = setup()

  wrapper.find('.journal-form-upload-btn')
    .simulate('click')

  const successHandler = TU.getArgs(deps.theCloudinary.openUploadWidget, 0)[1]
  const fakeRes = [{
    path:"fake/first/path",
    public_id:"fakeFirstPubId",
  }, {
    path:"fake/second/path",
    public_id:"fakeSecondPubId",
  }]
  const predefPhotoData = I.List([
    I.Map({
      id:"fakeFirstPredefinedPubId",
      path:"fake/first/predefined/path",
    }),
    I.Map({
      id:"fakeFirstPredefinedPubId",
      path:"fake/first/predefined/path",
    })
  ])

  wrapper.setState({ photos: predefPhotoData })
  successHandler(null, fakeRes)

  const actual = wrapper.state('photos')
  const expected = I.List([
    I.Map({
      id:"fakeFirstPredefinedPubId",
      path:"fake/first/predefined/path",
    }),
    I.Map({
      id:"fakeFirstPredefinedPubId",
      path:"fake/first/predefined/path",
    }),
    I.Map({
      id:"fakeFirstPubId",
      path:"fake/first/path",
    }),
    I.Map({
      id:"fakeSecondPubId",
      path:"fake/second/path",
    }),
  ])

  assert.isTrue(actual.equals(expected))
})

test('JournalForm > UploadPhotoBtn | when openUploadWidget() succeeds and photo state has NO existing data, it should add the correct photo data to the state', () => {
  const wrapper = setup()

  wrapper.find('.journal-form-upload-btn')
    .simulate('click')

  const successHandler = TU.getArgs(deps.theCloudinary.openUploadWidget, 0)[1]
  const fakeRes = [{
    path:"fake/first/path",
    public_id:"fakeFirstPubId",
  }, {
    path:"fake/second/path",
    public_id:"fakeSecondPubId",
  }]

  successHandler(null, fakeRes)

  const actual = wrapper.state('photos')
  const expected = I.List([
    I.Map({
      id:"fakeFirstPubId",
      path:"fake/first/path",
    }),
    I.Map({
      id:"fakeSecondPubId",
      path:"fake/second/path",
    }),
  ])

  assert.isTrue(actual.equals(expected))
})

test('JournalForm.handlePhotoDelete() | if there is some existing data, it should add the correct photo deletion data for each invocation', () => {
  const wrapper = setup()
  const predefDelData = ['firstPredefId', 'secondPredefId']

  wrapper.setState({ photosDeleted: predefDelData })

  wrapper.instance().handlePhotoDelete('firstId')
  wrapper.instance().handlePhotoDelete('secondId')

  const actual = wrapper.state('photosDeleted')
  const expected = [
    'firstPredefId',
    'secondPredefId',
    'firstId',
    'secondId',
  ]

  assert.sameMembers(actual, expected)
})

test('JournalForm.handlePhotoDelete() | if there is NO existing data, it should add the correct photo deletion data for each invocation', () => {
  const wrapper = setup()

  wrapper.instance().handlePhotoDelete('firstId')
  wrapper.instance().handlePhotoDelete('secondId')

  const actual = wrapper.state('photosDeleted')
  const expected = [
    'firstId',
    'secondId',
  ]

  assert.sameMembers(actual, expected)
})

test.skip('JournalForm > .onSubmit() | if form is valid, it should call handleSubmit with correct photo and photo deletion data')
test.skip('JournalForm | when unmounted and journal is NOT saved and there is photo deletion data, it should call deletePhotos() with correct args')
test.skip('JournalForm | when unmounted and journal is saved, it should NOT call deletePhotos()')
test.skip('JournalForm | when unmounted and journal is NOT saved and there is NO photo deletion data, it should NOT call deletePhotos()')

test.skip('PhotoFieldSet | it should display a photo')
test.skip('PhotoFieldSet | it should display a working description text area')
test.skip('PhotoFieldSet | it should display a working delete photo button for')