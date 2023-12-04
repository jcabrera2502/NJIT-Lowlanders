import React from 'react';
import { DateNav } from '../components/Central-Components/DateNav';
import { render, screen, fireEvent, within } from '@testing-library/react'; // Make sure to import the render function
import '@testing-library/jest-dom'
import userEvent from "@testing-library/user-event";
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded';

test('renders DateNav', () => {
    render(<DateNav />);
});

test('selecting month', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText(/January/));
    expect(screen.getAllByText("January")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText(/February/));
    expect(screen.getAllByText("February")[0]).toBeInTheDocument();
});

test('selecting day', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText("1"));
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("2"));
    expect(screen.getAllByText("2")[0]).toBeInTheDocument();
});

test('selecting year', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText("2025"));
    expect(screen.getAllByText("2025")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("2026"));
    expect(screen.getAllByText("2026")[0]).toBeInTheDocument();
});

test('no limit for 31 day months', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list0 = within(screen.getByRole('listbox'));
    fireEvent.click(list0.getByText(/January/));
    expect(screen.getAllByText("January")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText("30"));
    expect(screen.getAllByText("30")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("31"));
    expect(screen.getAllByText("31")[0]).toBeInTheDocument();
});

test('limit for 30 day months', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list0 = within(screen.getByRole('listbox'));
    fireEvent.click(list0.getByText(/April/));
    expect(screen.getAllByText("April")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText("30"));
    expect(screen.getAllByText("30")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    const look = list2.queryByText("31");
    expect(look).toBeNull();
    //fireEvent.click(list2.getByText("31"));
    //expect(screen.getAllByText("31")[0]).toBeInTheDocument();
});

test('limit for 28 day months', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list0 = within(screen.getByRole('listbox'));
    fireEvent.click(list0.getByText(/February/));
    expect(screen.getAllByText("February")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list5 = within(screen.getByRole('listbox'));
    fireEvent.click(list5.getByText("2025"));
    expect(screen.getAllByText("2025")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText("28"));
    expect(screen.getAllByText("28")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    const look2 = list2.queryByText("29");
    expect(look2).toBeNull();
    /*
    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list3 = within(screen.getByRole('listbox'));
    const look3 = list3.queryByText("30");
    expect(look3).toBeNull();
    
    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list4 = within(screen.getByRole('listbox'));
    const look4 = list4.queryByText("31");
    expect(look4).toBeNull();*/
});

test('show feb 29 on leap years', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list0 = within(screen.getByRole('listbox'));
    fireEvent.click(list0.getByText(/February/));
    expect(screen.getAllByText("February")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list5 = within(screen.getByRole('listbox'));
    fireEvent.click(list5.getByText("2024"));
    expect(screen.getAllByText("2024")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText("28"));
    expect(screen.getAllByText("28")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("29"));
    expect(screen.getAllByText("29")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list3 = within(screen.getByRole('listbox'));
    const look3 = list3.queryByText("30");
    expect(look3).toBeNull();
    /*
    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list4 = within(screen.getByRole('listbox'));
    const look4 = list4.queryByText("31");
    expect(look4).toBeNull();*/
});

test('lower day to 30 if new month doesn\'t have 31', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list0 = within(screen.getByRole('listbox'));
    fireEvent.click(list0.getByText(/January/));
    expect(screen.getAllByText("January")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText("31"));
    expect(screen.getAllByText("31")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText(/April/));
    expect(screen.getAllByText("April")[0]).toBeInTheDocument();

    expect(screen.queryByText("31")).toBeNull();
    expect(screen.getAllByText("30")[0]).toBeInTheDocument();
    /*
    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list4 = within(screen.getByRole('listbox'));
    const look4 = list4.queryByText("31");
    expect(look4).toBeNull();*/
});

test('lower day to 28 if new month doesn\'t have 30', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list0 = within(screen.getByRole('listbox'));
    fireEvent.click(list0.getByText(/January/));
    expect(screen.getAllByText("January")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText("30"));
    expect(screen.getAllByText("30")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list5 = within(screen.getByRole('listbox'));
    fireEvent.click(list5.getByText("2025"));
    expect(screen.getAllByText("2025")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText(/February/));
    expect(screen.getAllByText("February")[0]).toBeInTheDocument();

    expect(screen.queryByText("30")).toBeNull();
    expect(screen.getAllByText("28")[0]).toBeInTheDocument();
    /*
    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list4 = within(screen.getByRole('listbox'));
    const look4 = list4.queryByText("31");
    expect(look4).toBeNull();*/
});

test('lower day to 29 if new month doesn\'t have 30 and on leap year', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list0 = within(screen.getByRole('listbox'));
    fireEvent.click(list0.getByText(/January/));
    expect(screen.getAllByText("January")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText("30"));
    expect(screen.getAllByText("30")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list5 = within(screen.getByRole('listbox'));
    fireEvent.click(list5.getByText("2024"));
    expect(screen.getAllByText("2024")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText(/February/));
    expect(screen.getAllByText("February")[0]).toBeInTheDocument();

    expect(screen.queryByText("30")).toBeNull();
    expect(screen.getAllByText("29")[0]).toBeInTheDocument();
    /*
    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list4 = within(screen.getByRole('listbox'));
    const look4 = list4.queryByText("31");
    expect(look4).toBeNull();*/
});

test('previous month', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText(/February/));
    expect(screen.getAllByText("February")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[0];
    fireEvent.click(button);
    expect(screen.getAllByText("January")[0]).toBeInTheDocument();
});

test('next month', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText(/February/));
    expect(screen.getAllByText("February")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[1];
    fireEvent.click(button);
    expect(screen.getAllByText("March")[0]).toBeInTheDocument();
});

test('previous day', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("15"));
    expect(screen.getAllByText("15")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[2];
    fireEvent.click(button);
    expect(screen.getAllByText("14")[0]).toBeInTheDocument();
});

test('next day', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("15"));
    expect(screen.getAllByText("15")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[3];
    fireEvent.click(button);
    expect(screen.getAllByText("16")[0]).toBeInTheDocument();
});

test('previous year', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("2025"));
    expect(screen.getAllByText("2025")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[4];
    fireEvent.click(button);
    expect(screen.getAllByText("2024")[0]).toBeInTheDocument();
});

test('next year', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("2025"));
    expect(screen.getAllByText("2025")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[5];
    fireEvent.click(button);
    expect(screen.getAllByText("2026")[0]).toBeInTheDocument();
});

test('previous month lowers day if needed', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText(/October/));
    expect(screen.getAllByText("October")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("31"));
    expect(screen.getAllByText("31")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[0];
    fireEvent.click(button);
    expect(screen.getAllByText("September")[0]).toBeInTheDocument();

    expect(screen.queryByText("31")).toBeNull();
    expect(screen.getAllByText("30")[0]).toBeInTheDocument();
});

test('next month lowers day if needed', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText(/January/));
    expect(screen.getAllByText("January")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("31"));
    expect(screen.getAllByText("31")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list3 = within(screen.getByRole('listbox'));
    fireEvent.click(list3.getByText("2025"));
    expect(screen.getAllByText("2025")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[1];
    fireEvent.click(button);
    expect(screen.getAllByText("February")[0]).toBeInTheDocument();

    expect(screen.queryByText("31")).toBeNull();
    expect(screen.getAllByText("28")[0]).toBeInTheDocument();
});

test('previous month lowering day accounts for leap years', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText(/March/));
    expect(screen.getAllByText("March")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("30"));
    expect(screen.getAllByText("30")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list3 = within(screen.getByRole('listbox'));
    fireEvent.click(list3.getByText("2024"));
    expect(screen.getAllByText("2024")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[0];
    fireEvent.click(button);
    expect(screen.getAllByText("February")[0]).toBeInTheDocument();

    expect(screen.queryByText("30")).toBeNull();
    expect(screen.getAllByText("29")[0]).toBeInTheDocument();
});

test('next month lowering day accounts for leap years', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText(/January/));
    expect(screen.getAllByText("January")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("31"));
    expect(screen.getAllByText("31")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list3 = within(screen.getByRole('listbox'));
    fireEvent.click(list3.getByText("2024"));
    expect(screen.getAllByText("2024")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[1];
    fireEvent.click(button);
    expect(screen.getAllByText("February")[0]).toBeInTheDocument();

    expect(screen.queryByText("31")).toBeNull();
    expect(screen.getAllByText("29")[0]).toBeInTheDocument();
});

test('previous month rollover', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText(/January/));
    expect(screen.getAllByText("January")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list3 = within(screen.getByRole('listbox'));
    fireEvent.click(list3.getByText("2024"));
    expect(screen.getAllByText("2024")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[0];
    fireEvent.click(button);
    expect(screen.getAllByText("December")[0]).toBeInTheDocument();
    expect(screen.getAllByText("2023")[0]).toBeInTheDocument();
});

test('next month rollover', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText(/December/));
    expect(screen.getAllByText("December")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list3 = within(screen.getByRole('listbox'));
    fireEvent.click(list3.getByText("2024"));
    expect(screen.getAllByText("2024")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[1];
    fireEvent.click(button);
    expect(screen.getAllByText("January")[0]).toBeInTheDocument();
    expect(screen.getAllByText("2025")[0]).toBeInTheDocument();
});

test('previous day rollover', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText(/April/));
    expect(screen.getAllByText("April")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("1"));
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[2];
    fireEvent.click(button);
    expect(screen.getAllByText("31")[0]).toBeInTheDocument();

    expect(screen.getAllByText("March")[0]).toBeInTheDocument();
});

test('next day rollover', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText(/April/));
    expect(screen.getAllByText("April")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("30"));
    expect(screen.getAllByText("30")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[3];
    fireEvent.click(button);
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();

    expect(screen.getAllByText("May")[0]).toBeInTheDocument();
});

test('previous day rollover with year change', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText(/January/));
    expect(screen.getAllByText("January")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("1"));
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list3 = within(screen.getByRole('listbox'));
    fireEvent.click(list3.getByText("2024"));
    expect(screen.getAllByText("2024")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[2];
    fireEvent.click(button);
    expect(screen.getAllByText("31")[0]).toBeInTheDocument();
    
    expect(screen.getAllByText("December")[0]).toBeInTheDocument();
    expect(screen.getAllByText("2023")[0]).toBeInTheDocument();
});

test('next day rollover with year change', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText(/December/));
    expect(screen.getAllByText("December")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("31"));
    expect(screen.getAllByText("31")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list3 = within(screen.getByRole('listbox'));
    fireEvent.click(list3.getByText("2024"));
    expect(screen.getAllByText("2024")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[3];
    fireEvent.click(button);
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();
    
    expect(screen.getAllByText("January")[0]).toBeInTheDocument();
    expect(screen.getAllByText("2025")[0]).toBeInTheDocument();
});

test('previous year lowers day if needed', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText(/February/));
    expect(screen.getAllByText("February")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list3 = within(screen.getByRole('listbox'));
    fireEvent.click(list3.getByText("2024"));
    expect(screen.getAllByText("2024")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("29"));
    expect(screen.getAllByText("29")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[4];
    fireEvent.click(button);
    expect(screen.getAllByText("2023")[0]).toBeInTheDocument();

    expect(screen.queryByText("29")).toBeNull();
    expect(screen.getAllByText("28")[0]).toBeInTheDocument();
});

test('next year lowers day if needed', () => {
    render(<DateNav />);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const list1 = within(screen.getByRole('listbox'));
    fireEvent.click(list1.getByText(/February/));
    expect(screen.getAllByText("February")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    const list3 = within(screen.getByRole('listbox'));
    fireEvent.click(list3.getByText("2024"));
    expect(screen.getAllByText("2024")[0]).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const list2 = within(screen.getByRole('listbox'));
    fireEvent.click(list2.getByText("29"));
    expect(screen.getAllByText("29")[0]).toBeInTheDocument();

    const button = screen.getAllByRole('button')[5];
    fireEvent.click(button);
    expect(screen.getAllByText("2025")[0]).toBeInTheDocument();

    expect(screen.queryByText("29")).toBeNull();
    expect(screen.getAllByText("28")[0]).toBeInTheDocument();
});