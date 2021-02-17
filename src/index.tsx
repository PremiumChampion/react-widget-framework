import { isNil } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { BaseWidget } from './CustomGrid/BaseWidget';
import { WidgetType } from './CustomGrid/Enums/WidgetType';
import { GridHost } from './CustomGrid/GridHost';
import { WidgetDeserializer } from './CustomGrid/Serialization/Deserializer';
import { ISerialisationInfo } from './CustomGrid/Serialization/ISerialisationInfo';
import { ResizeProvider } from './CustomGrid/UseResize';
import { NumberWidget } from './Demo/NumberWidget';
import { WeatherWidget } from './Demo/WeatherWidget';
import "./RootStyles.scss";

const root = document.getElementById('root');

WidgetDeserializer.register(WidgetType.NumberWidget, () => { return new NumberWidget(); });
WidgetDeserializer.register(WidgetType.WeatherWidget, () => { return new WeatherWidget(); });

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
          onRemoveWidget={(widget) =>
          {
            console.log("Deleting");
            widgets = widgets.filter(_widget => widget.id !== _widget.id);
            render();
          }}
          onChange={(serialisationFn)=>{
            // console.log("Changed");
          }}
        />
      </ResizeProvider>
      <input type={"button"} value="Save" onClick={() =>
      {
        let info = serialise();
        sessionStorage["IPI_Serialisation"] = info;
      }} ></input>
      <input type={"button"} value="Load" onClick={() =>
      {
        if (!isNil(sessionStorage["IPI_Serialisation"]))
        {
          widgets = [];
          let WidgetSerialisations: ISerialisationInfo[] = JSON.parse(sessionStorage["IPI_Serialisation"]);
          WidgetSerialisations.forEach(WidgetSerialisation =>
          {
            widgets.push(WidgetDeserializer.deserialize(WidgetSerialisation));
          });
        }
        else
        {
          alert("No save found");
          widgets = [];
          for (let i = 0; i < 30; i++)
          {
            widgets.push(new NumberWidget());
          }
        }
        render();
      }} ></input>
      <input type={"button"} value="New items" onClick={() =>
      {
        widgets = [];
        for (let i = 0; i < 30; i++)
        {
          widgets.push(new NumberWidget());
        }
        render();
      }}></input>
    </div>,
    root
  );
};

render();