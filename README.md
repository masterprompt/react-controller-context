# React Controller Context

Easily expose business logic to React components. Generate a provider and context effortlessly, simplifying access to controller hooks for streamlined development.

## Installation

`npm install --save react-controller-context`

## Usage

Create a controller (essentially the state and/or side effects you'd like to share between children of a provider), then create context from that controller.

```
import { createContextForController } from 'react-controller-context'

// Build a controller
const useFooState = () => {
    const [ foo, setFoo ] = React.useState('foo');
    return {
        foo,
        setFoo
    }
}
 
//  Create the context from the controller
const fooStateContext = createContextForController(useFooState);
 
//  Wrap all children with the provider of the context
const App = () => (
    <fooStateContext.Provider>
        <Main />
    </fooStateContext.Provider>
);
 
//  Dumb middle man component
const Main = () => (
    <>
        <FooInput />
    </>
);
 
const FooInput = () => {
    const fooStateController = fooStateContext.useController();
    return (
        <input type='text' value={fooStateController.foo} onChange={e => fooStateController.setFoo(e.target.value)}>
    );
};
```
 
## Advanced Usage
 
Creating a controller that has options and providing those options to the provider
 
```
import { createContextForController } from 'react-controller-context'
 
// Build a controller
interface Options {
    initialFoo: 'foo'
}
const useFooState = (options: Options) => {
    const [ foo, setFoo ] = React.useState(options.initialFoo);
    return {
        foo,
        setFoo
    }
}
 
//  Create the context from the controller
const fooStateContext = createContextForController(useFooState);
 
//  Wrap all children with the provider of the context
const App = () => (
    <fooStateContext.Provider options={{ initialFoo: 'bar' }}>
        <Main />
    </fooStateContext.Provider>
);
 
//  Dumb middle man component
const Main = () => (
    <>
        <FooInput />
    </>
);
 
const FooInput = () => {
    const fooStateController = fooStateContext.useController();
    return (
        <input type='text' value={fooStateController.foo} onChange={e => fooStateController.setFoo(e.target.value)}>
    );
};
```
