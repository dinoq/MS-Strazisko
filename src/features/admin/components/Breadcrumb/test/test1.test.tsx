import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Breadcrumb from "../Breadcrumb"
import BreadcrumbContainer from "../BreadcrumbContainer"
import { BreadcrumbLight } from '../BreadcrumbLight'
import { useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('Home', () => {
  beforeEach(()=>{
    jest.clearAllMocks();
    (useSelector as unknown as jest.Mock).mockReturnValue([
      "item1", "V"
    ])
  })
  it('renders a BreadcrumbLight', async () => {
    render(<BreadcrumbLight hideDetailFrame={()=>{alert("hidden")}} />)
 
    const test1 = await screen.findByText("item1")
 
    expect(test1).toBeInTheDocument();
  })
})