import 'react-native-macos';

import { act } from 'react';
import renderer from 'react-test-renderer';

import App from '../src/App';

it('renders correctly', () => {
  let appRenderer;
  act(() => {
    appRenderer = renderer.create(<App />);
  });
  act(() => {
    appRenderer.unmount();
  });
});
