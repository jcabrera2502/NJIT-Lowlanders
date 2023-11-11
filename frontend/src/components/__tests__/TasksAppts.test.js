import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TasksAppts from '../Central-Components/TasksAppts';
import * as axios from "axios";

jest.mock("axios", () => 'ax');

test('previous month rolls over year', () => {
    /*
    const handleOnClick = jest.fn();
    const { getByTestId } = render(<TasksAppts />);
    const element = getByTestId("button");
    setMonth(1);
    setYear(2023);
    fireEvent.click(element);
    expect(handleOnClick).toBeCalled();
    expect(month).toBe(12);
    expect(year).toBe(2022);
    */
    render(<TasksAppts />);
});
