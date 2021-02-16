import { isNil } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { BaseWidget } from './CustomGrid/BaseWidget';
import { Deserializer } from './CustomGrid/Deserializer';
import { WidgetType } from './CustomGrid/Enums/WidgetType';
import { GridHost } from './CustomGrid/GridHost';
import { ISerialisationInfo } from './CustomGrid/Interfaces/ISerialisationInfo';
import { ResizeProvider } from './CustomGrid/UseResize';
import { NumberWidget } from './Demo/NumberWidget';
import { WeatherWidget } from './Demo/WeatherWidget';
import "./RootStyles.scss";

const root = document.getElementById('root');

Deserializer.registerWidget(WidgetType.NumberWidget, () => { return new NumberWidget(); });
Deserializer.registerWidget(WidgetType.WeatherWidget, () => { return new WeatherWidget(); });

let widgets: BaseWidget[] = [];
let serialise = () => {};


const render = () =>
{
  ReactDOM.render(
    <div>
      <ResizeProvider element={root || document.createElement("div")} >
        <GridHost
          widgets={widgets}
          useSerialisation={(fn) => serialise = fn}
        />
      </ResizeProvider>
      <input type={"button"} value="Save" onClick={() =>
      {
        let info = serialise();
        sessionStorage["IPI_Serialisation"] = info;
      }} ></input>
      <input type={"button"} value="Load" onClick={() =>
      {
        console.log("loading");

        if (!isNil(sessionStorage["IPI_Serialisation"]))
        {
          widgets = [];
          let WidgetSerialisations: ISerialisationInfo[] = JSON.parse(sessionStorage["IPI_Serialisation"]);
          WidgetSerialisations.forEach(WidgetSerialisation =>
          {
            widgets.push(Deserializer.deserializeWidget(WidgetSerialisation));
          });
        }
        else
        {
          widgets = [];
          for (let i = 0; i < 30; i++)
          {
            widgets.push(new NumberWidget());
          }
        }
        render();
      }} ></input>
    </div >,
    root
  );
};

render();