import {render, screen} from '@testing-library/react';
import Renderer from './Renderer';

test('renders learn react link', () => {
    render(<Renderer/>);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
