import React from 'react';
import { render } from '@testing-library/react';
import { createControllerContext } from './create-controller-context';
import '@testing-library/jest-dom';

describe('createControllerContext', () => {
    test('exposes the controller value via use()', () => {
        const useGreeting = () => 'hello';
        const Greeting = createControllerContext(useGreeting, 'Greeting');

        const Child = () => <div data-testid="child">{Greeting.use()}</div>;

        const { getByTestId } = render(
            <Greeting.Provider>
                <Child />
            </Greeting.Provider>,
        );
        expect(getByTestId('child')).toHaveTextContent('hello');
    });

    test('spreads typed Provider props into the controller', () => {
        const useEcho = ({ initialValue }: { initialValue?: string } = {}) => {
            const [value] = React.useState(initialValue || '');
            return { value };
        };
        const Echo = createControllerContext(useEcho, 'Echo');

        const Child = () => <div data-testid="child">{Echo.use().value}</div>;

        const { getByTestId } = render(
            <Echo.Provider initialValue="1234">
                <Child />
            </Echo.Provider>,
        );
        expect(getByTestId('child')).toHaveTextContent('1234');
    });

    test('use() throws a descriptive error outside the Provider', () => {
        const useThing = () => 'value';
        const Thing = createControllerContext(useThing, 'Thing');

        const Orphan = () => <div>{Thing.use()}</div>;

        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<Orphan />)).toThrow('Thing cannot be used outside its Provider.');
        consoleError.mockRestore();
    });

    test('error message falls back to the controller function name', () => {
        const useFallbackNamed = () => 'value';
        const Thing = createControllerContext(useFallbackNamed);

        const Orphan = () => <div>{Thing.use()}</div>;

        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<Orphan />)).toThrow('useFallbackNamed cannot be used outside its Provider.');
        consoleError.mockRestore();
    });

    test('falsy controller values do not trigger the orphan guard', () => {
        const useZero = () => 0;
        const Zero = createControllerContext(useZero, 'Zero');

        const Child = () => <div data-testid="child">{String(Zero.use())}</div>;

        const { getByTestId } = render(
            <Zero.Provider>
                <Child />
            </Zero.Provider>,
        );
        expect(getByTestId('child')).toHaveTextContent('0');
    });

    test('exposes the raw context for escape-hatch use', () => {
        const useGreeting = () => 'hello';
        const Greeting = createControllerContext(useGreeting, 'Greeting');

        const Child = () => {
            const value = React.useContext(Greeting.context);
            return <div data-testid="child">{value}</div>;
        };

        const { getByTestId } = render(
            <Greeting.context.Provider value="mocked">
                <Child />
            </Greeting.context.Provider>,
        );
        expect(getByTestId('child')).toHaveTextContent('mocked');
    });
});
