import { isNil } from 'lodash';
import { initializeIcons } from 'office-ui-fabric-react';
import React from 'react';
import ReactDOM from 'react-dom';
import { BaseWidget } from './CustomGrid/BaseWidget';
import { WidgetType } from './CustomGrid/Enums/WidgetType';
import { GridHost } from './CustomGrid/GridHost';
import { ISerialisationInfo } from './CustomGrid/Serialization/ISerialisationInfo';
import { WidgetDeserializer } from './CustomGrid/Serialization/WidgetDeserializer';
import { ResizeProvider } from './CustomGrid/UseResize';
import { ContactsWidget } from './Demo/ContactsWidget/ContactsWidget';
import { Custom_Event } from './Demo/CustomEvents';
import { SettingsWidget } from './Demo/SettingsWidget/SettingsWidget';
import { WeatherWidget } from './Demo/WeatherWidget/WeatherWidget';
import "./RootStyles.scss";

initializeIcons();

const root = document.getElementById('root');

WidgetDeserializer.register(WidgetType.KontaktWidget, () => { return new ContactsWidget(); });
WidgetDeserializer.register(WidgetType.WeatherWidget, () => { return new WeatherWidget(); });
WidgetDeserializer.register(WidgetType.SettingsWidget, () => { return new SettingsWidget(); });

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
            widgets = widgets.filter(_widget => widget.id !== _widget.id);
            render();
          }}
          onChange={(serialisationFn) =>
          {
          }}
        />
      </ResizeProvider>
    </div>,
    root
  );
};

const loadItems = (tryUseCache: boolean = true) =>
{
  if (!isNil(sessionStorage["IPI_Serialisation"]) && tryUseCache)
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
    widgets = [];
    
    widgets.push(new SettingsWidget());
  }
  render();
};
loadItems();


const onAddNewWidget = (Type: WidgetType) =>
{
  let widget: BaseWidget | undefined;

  switch (Type)
  {
    case WidgetType.KontaktWidget:
      widget = new ContactsWidget();
      break;
    case WidgetType.WeatherWidget:
      widget = new WeatherWidget();
      break;
    case WidgetType.SettingsWidget:
      widget = new SettingsWidget();
      break;
    default:
      break;
  }

  if (widget !== undefined)
  {
    widgets.push(widget);
    render();
  }
};

Custom_Event.addEventListener("IPI_ADD_WIDGET", onAddNewWidget);
Custom_Event.addEventListener("IPI_SAVE_WIDGETS", () => sessionStorage["IPI_Serialisation"] = serialise());
Custom_Event.addEventListener("IPI_LOAD_WIDGETS", loadItems);