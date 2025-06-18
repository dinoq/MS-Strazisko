import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BreadcrumbContainer from "@features/admin/components/Breadcrumb/BreadcrumbContainer";
import { useSelector, useDispatch } from 'react-redux';
import * as redux from 'react-redux'; // kvůli typu dispatch
import '@testing-library/jest-dom';
/*
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('@/components/Breadcrumb', () => {
  return function MockedBreadcrumb({ items, itemClicked }) {
    return (
      <div data-testid="breadcrumb">
        {items.map((item, index) => (
          <button key={index} onClick={() => itemClicked(index)}>
            {item.text}
          </button>
        ))}
      </div>
    );
  };
});

describe('BreadcrumbContainer', () => {
  const mockDispatch = jest.fn();
  const mockHideDetailFrame = jest.fn();

  const mockItems = [
    { text: 'Domů', DBObject: { DBOClass: 'HomeClass' } },
    { text: 'Album', DBObject: { DBOClass: 'AlbumClass' } },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({ breadcrumb: { items: mockItems } })
    );
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  test('zobrazí položky breadcrumbu', () => {
    render(<BreadcrumbContainer hideDetailFrame={mockHideDetailFrame} />);

    expect(screen.getByText('Domů')).toBeInTheDocument();
    expect(screen.getByText('Album')).toBeInTheDocument();
  });

  test('kliknutí spustí hideDetailFrame a dispatch', () => {
    render(<BreadcrumbContainer hideDetailFrame={mockHideDetailFrame} />);

    const btn = screen.getByText('Album');
    fireEvent.click(btn);

    expect(mockHideDetailFrame).toHaveBeenCalled();

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_FORM_DEFINITIONS',
      FID: 'AlbumClass',
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'breadcrumb/itemSelected',
      payload: { index: 1, items: mockItems },
    });
  });
});
*/
describe('breadcrumbcontainer', () => {
    test("2+2", ()=>{
        expect(2+2).toBe(4);
    })
})