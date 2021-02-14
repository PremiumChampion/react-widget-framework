import React from 'react';
import ReactDOM from 'react-dom';
import { BaseWidget } from './CustomGrid/BaseWidget';
import { GridHost } from './CustomGrid/GridHost';
import { ResizeProvider } from './CustomGrid/UseResize';
import { NumberWidget } from './Demo/NumberWidget';
import { WeatherWidget } from './Demo/WeatherWidget';
import "./RootStyles.scss";

const root = document.getElementById('root');
let widgets: BaseWidget[] = [new WeatherWidget()];

for (let i = 0; i < 29; i++)
{
  widgets.push(new NumberWidget(i));
}

ReactDOM.render(
  <ResizeProvider element={root || document.createElement("div")} >
    <GridHost
      widgets={widgets}
    />
  </ResizeProvider>,
  root
);
