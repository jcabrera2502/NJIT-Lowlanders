import React from 'react';
//import { PomoPopup } from '../components/Central-Components/Popup';
import PomoPopup from '../components/Central-Components/Popup';
import { render, screen, fireEvent } from '@testing-library/react'; // Make sure to import the render function
import '@testing-library/jest-dom'

function onPomoClose() {
    //example
}
const timeVals = [1, 2, 3, 4];
const exampleText = ['cool title', 'amazing description'];

test('renders PomoPopup', () => {
    render(<PomoPopup
        pomoOpen={true}
        onPomoClose={onPomoClose}
        taskTitle={'example title'}
        taskDesc={'example description'}
        taskTimers={2}
        taskTime={30}
        shortTime={5}
        longTime={15}
    />);
});

test('PomoPopup displays task title', () => {
    render(<PomoPopup
        pomoOpen={true}
        onPomoClose={onPomoClose}
        taskTitle={exampleText[0]}
        taskDesc={'example description'}
        taskTimers={2}
        taskTime={30}
        shortTime={5}
        longTime={15}
    />);

    expect(screen.getByText(/cool title/)).toBeInTheDocument();
});

test('PomoPopup displays task desc', () => {
    render(<PomoPopup
        pomoOpen={true}
        onPomoClose={onPomoClose}
        taskTitle={'example title'}
        subBox = {{"note":exampleText[1]}}
        taskTimers={2}
        taskTime={30}
        shortTime={5}
        longTime={15}
    />);

    expect(screen.getByText(/amazing description/)).toBeInTheDocument();
});
test('PomoPopup displays long time', () => {
    render(<PomoPopup
        pomoOpen={true}
        onPomoClose={onPomoClose}
        taskTitle={'example title'}
        taskDesc={'example description'}
        taskTimers={1}
        taskTime={25}
        shortTime={5}
        longTime={timeVals[3]}
    />);

    const longTab = screen.getByText('Long Break');
    fireEvent.click(longTab);

    expect(screen.getAllByText(/4/)[0]).toBeInTheDocument();
});
test('PomoPopup displays number of pomo times', () => {
    render(<PomoPopup
        pomoOpen={true}
        onPomoClose={onPomoClose}
        taskTitle={'example title'}
        taskDesc={'example description'}
        taskTimers={timeVals[0]}
        taskTime={30}
        shortTime={5}
        longTime={25}
    />);

    expect(screen.getAllByText(/1/)[0]).toBeInTheDocument();
});

test('PomoPopup displays task time', () => {
    render(<PomoPopup
        pomoOpen={true}
        onPomoClose={onPomoClose}
        taskTitle={'example title'}
        taskDesc={'example description'}
        taskTimers={1}
        taskTime={timeVals[1]}
        shortTime={5}
        longTime={15}
    />);

    expect(screen.getAllByText(/2/)[0]).toBeInTheDocument();
});
test('PomoPopup displays long time', () => {
    render(<PomoPopup
        pomoOpen={true}
        onPomoClose={onPomoClose}
        taskTitle={'example title'}
        taskDesc={'example description'}
        taskTimers={1}
        taskTime={25}
        shortTime={5}
        longTime={timeVals[3]}
    />);

    const longTab = screen.getByText('Long Break');
    fireEvent.click(longTab);

    expect(screen.getAllByText(/4/)[0]).toBeInTheDocument();
});
test('PomoPopup displays short time', () => {
    render(<PomoPopup
        pomoOpen={true}
        onPomoClose={onPomoClose}
        taskTitle={'example title'}
        taskDesc={'example description'}
        taskTimers={1}
        taskTime={25}
        shortTime={timeVals[2]}
        longTime={15}
    />);

    const shortTab = screen.getByText('Short Break');
    fireEvent.click(shortTab);

    expect(screen.getAllByText(/3/)[0]).toBeInTheDocument();
});

test('PomoPopup displays long time', () => {
    render(<PomoPopup
        pomoOpen={true}
        onPomoClose={onPomoClose}
        taskTitle={'example title'}
        taskDesc={'example description'}
        taskTimers={1}
        taskTime={25}
        shortTime={5}
        longTime={timeVals[3]}
    />);

    const longTab = screen.getByText('Long Break');
    fireEvent.click(longTab);

    expect(screen.getAllByText(/4/)[0]).toBeInTheDocument();
});

test('PomoPopup displays all imported times', () => {
    render(<PomoPopup
        pomoOpen={true}
        onPomoClose={onPomoClose}
        taskTitle={'example title'}
        taskDesc={'example description'}
        taskTimers={9}
        taskTime={timeVals[1]}
        shortTime={timeVals[2]}
        longTime={timeVals[3]}
    />);

    expect(screen.getAllByText(/2/)[0]).toBeInTheDocument();

    const shortTab = screen.getByText('Short Break');
    fireEvent.click(shortTab);
    expect(screen.getAllByText(/3/)[0]).toBeInTheDocument();

    const longTab = screen.getByText('Long Break');
    fireEvent.click(longTab);
    expect(screen.getAllByText(/4/)[0]).toBeInTheDocument();

    const taskTab = screen.getByText('Pomodoro');
    fireEvent.click(taskTab);
    expect(screen.getAllByText(/2/)[0]).toBeInTheDocument();
});

test('timer starts', async () => {
    render(<PomoPopup
        pomoOpen={true}
        onPomoClose={onPomoClose}
        taskTitle={'example title'}
        taskDesc={'example description'}
        taskTimers={2}
        taskTime={30}
        shortTime={5}
        longTime={15}
        subBox={{"usedTimers":0, "pomTimers":2}}
    />);

    const timer = screen.getByText('START');
    fireEvent.click(timer);
    await new Promise((r) => setTimeout(r, 2000));
    expect(screen.getAllByText(/29/)[0]).toBeInTheDocument();
});

test('timer pauses', async () => {
    render(<PomoPopup
        pomoOpen={true}
        onPomoClose={onPomoClose}
        taskTitle={'example title'}
        taskDesc={'example description'}
        taskTimers={2}
        taskTime={30}
        shortTime={5}
        longTime={15}
        subBox={{"usedTimers":0, "pomTimers":2}}
    />);

    const timer = screen.getByText('START');
    fireEvent.click(timer);
    await new Promise((r) => setTimeout(r, 1000));
    fireEvent.click(timer);
    await new Promise((r) => setTimeout(r, 2000));
    expect(screen.getAllByText(/59/)[0]).toBeInTheDocument();
});
test('PomoPopup displays long time', () => {
    render(<PomoPopup
        pomoOpen={true}
        onPomoClose={onPomoClose}
        taskTitle={'example title'}
        taskDesc={'example description'}
        taskTimers={1}
        taskTime={25}
        shortTime={5}
        longTime={timeVals[3]}
    />);

    const longTab = screen.getByText('Long Break');
    fireEvent.click(longTab);

    expect(screen.getAllByText(/4/)[0]).toBeInTheDocument();
});
test('timer starts', async () => {
    render(<PomoPopup
        pomoOpen={true}
        onPomoClose={onPomoClose}
        taskTitle={'example title'}
        taskDesc={'example description'}
        taskTimers={2}
        taskTime={30}
        shortTime={5}
        longTime={15}
        subBox={{"usedTimers":0, "pomTimers":2}}
    />);

    const timer = screen.getByText('START');
    fireEvent.click(timer);
    await new Promise((r) => setTimeout(r, 2000));
    expect(screen.getAllByText(/29/)[0]).toBeInTheDocument();
});

/*
jest.setTimeout(7000);
test('timer ticking', async () => {
    render(<PomoPopup
        pomoOpen={true}
        onPomoClose={onPomoClose}
        taskTitle={'example title'}
        taskDesc={'example description'}
        taskTimers={2}
        taskTime={30}
        shortTime={5}
        longTime={15}
        subBox={{"usedTimers":0, "pomTimers":2}}
    />);

    const timer = screen.getByText('START');
    fireEvent.click(timer);
    await new Promise((r) => setTimeout(r, 1000));
    expect(screen.getAllByText(/00/)[0]).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 1000));
    expect(screen.getAllByText(/59/)[0]).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 1000));
    expect(screen.getAllByText(/58/)[0]).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 1000));
    expect(screen.getAllByText(/57/)[0]).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 1000));
    expect(screen.getAllByText(/56/)[0]).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 1000));
    expect(screen.getAllByText(/55/)[0]).toBeInTheDocument();
});*/