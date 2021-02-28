import { isNil } from 'lodash';
import { initializeIcons } from 'office-ui-fabric-react';
import React from 'react';
import ReactDOM from 'react-dom';
import "./RootStyles.scss";
import { BaseWidget } from './WidgetFramework/BaseWidget';
import { WidgetType } from './WidgetFramework/Enums/WidgetType';
import { WidgetDashboard } from './WidgetFramework/WidgetDashboard';
import { ISerialisationInfo } from './WidgetFramework/Serialization/ISerialisationInfo';
import { WidgetDeserializer } from './WidgetFramework/Serialization/WidgetDeserializer';
import { ResizeProvider } from './WidgetFramework/UseResize';
import { Custom_Event } from './Widgets/CustomEvents';
import { LinkWidget } from './Widgets/LinkWidget/LinkWidget';
import { NotesWidget } from './Widgets/NoteWidget/NotesWidget';
import { SettingsWidget } from './Widgets/SettingsWidget/SettingsWidget';
import { WeatherWidget } from './Widgets/WeatherWidget/WeatherWidget';

initializeIcons();

const root = document.getElementById('root');
let widgets: BaseWidget[] = [];
let serialise = () => {};

const initializeWidgets = () =>
{
  WidgetDeserializer.register(WidgetType.NotesWidget, () => { return new NotesWidget(); });
  WidgetDeserializer.register(WidgetType.WeatherWidget, () => { return new WeatherWidget(); });
  WidgetDeserializer.register(WidgetType.SettingsWidget, () => { return new SettingsWidget(); });
  WidgetDeserializer.register(WidgetType.LinkWidget, () => { return new LinkWidget(); });
};

initializeWidgets();

const render = () =>
{
  ReactDOM.render(
    <div>
      <ResizeProvider element={root || document.createElement("div")} >
        <WidgetDashboard
          widgets={widgets}
          useSerialisation={(fn) => serialise = fn}
          onRemoveWidget={(widget) =>
          {
            widgets = widgets.filter(_widget => widget.id !== _widget.id);
            render();
          }}
        />
      </ResizeProvider>
    </div>,
    root
  );
};

const onLoadWidgets = (tryUseCache: boolean = true) =>
{
  if (!isNil(localStorage["WIDGET_SERILIZATION"]) && tryUseCache)
  {
    widgets = [];
    let WidgetSerialisations: ISerialisationInfo[] = JSON.parse(localStorage["WIDGET_SERILIZATION"]);
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

const onAddNewWidget = (Type: WidgetType) =>
{
  let widget: BaseWidget | undefined;

  switch (Type)
  {
    case WidgetType.NotesWidget:
      widget = new NotesWidget();
      break;
    case WidgetType.WeatherWidget:
      widget = new WeatherWidget();
      break;
    case WidgetType.SettingsWidget:
      widget = new SettingsWidget();
      break;
    case WidgetType.LinkWidget:
      widget = new LinkWidget();
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

const onSaveWidgets = () =>
{
  localStorage["WIDGET_SERILIZATION"] = serialise();
};

Custom_Event.addEventListener("ADD_WIDGET", onAddNewWidget);
Custom_Event.addEventListener("SAVE_WIDGETS", onSaveWidgets);
Custom_Event.addEventListener("LOAD_WIDGETS", onLoadWidgets);

onLoadWidgets();