import Spinner from './Spinner'
import React from 'react'
import {render} from '@testing-library/react'
import '@testing-library/jest-dom'

test('Spinner shows when on', () => {
  const {queryByText, rerender} = render(<Spinner on={true}/>)
  expect(queryByText(/please wait.../i)).toBeInTheDocument()
  rerender(<Spinner on={false}/>)
  expect(queryByText(/please wait.../i)).not.toBeInTheDocument()
})