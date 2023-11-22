import React from 'react';
import { PomoPopup } from '../components/Central-Components/Popup';
import { render } from '@testing-library/react'; // Make sure to import the render function

test('renders PomoPopup', () => {
    render(<PomoPopup />);
});