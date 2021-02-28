import * as React from 'react';
import styles from './Widgets.module.scss';
import { IWidgetsProps } from './IWidgetsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { WidgetDashboard } from '../WidgetFramework/WidgetDashboard';
import { BaseWidget } from '../WidgetFramework/BaseWidget';
import { WidgetType } from '../WidgetFramework/Enums/WidgetType';
import { NotesWidget } from '../Widgets/NoteWidget/NotesWidget';
import { WeatherWidget } from '../Widgets/WeatherWidget/WeatherWidget';
import { SettingsWidget } from '../Widgets/SettingsWidget/SettingsWidget';
import { LinkWidget } from '../Widgets/LinkWidget/LinkWidget';
import { Custom_Event } from '../Widgets/CustomEvents';
import { isNil } from 'lodash';
import { ISerialisationInfo } from '../WidgetFramework/Serialization/ISerialisationInfo';
import { WidgetDeserializer } from '../WidgetFramework/Serialization/WidgetDeserializer';

export default class Widgets extends React.Component<IWidgetsProps, { widgets: BaseWidget[]; }> {
  private serialise: () => string = () =>
  {
    throw new Error("Serialisation not mounted");
  };
  addListener: (ev: Event) => void;
  saveListener: (ev: Event) => void;
  loadListener: (ev: Event) => void;

  constructor(props: IWidgetsProps)
  {
    super(props);
    this.state = { widgets: [] };
  }

  public render(): React.ReactElement<IWidgetsProps>
  {
    console.log(styles);

    return (
      <div style={{ background: "linear-gradient(130deg ,#ff7a18,#af002d 41.07%,#319197 76.05%)", height:"100%" }}>

        <WidgetDashboard
          widgets={this.state.widgets}
          onRemoveWidget={(widget) =>
          {
            const newWidgets = this.state.widgets.filter(_widget => widget.id !== _widget.id);
            this.setState({ widgets: newWidgets });
          }}
          useSerialisation={(fn) => { this.serialise = fn; }}
        />
      </div>
    );
  }

  public onAddNewWidget(Type: WidgetType)
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
    let newWidgets = this.state.widgets;
    newWidgets.push(widget);
    this.setState({ widgets: newWidgets });
  }

  public onSaveWidgets()
  {
    localStorage["WIDGET_SERILIZATION"] = this.serialise();
  };


  public onLoadWidgets(tryUseCache: boolean = true)
  {
    let widgets = [];
    if (!isNil(localStorage["WIDGET_SERILIZATION"]) && tryUseCache)
    {
      let WidgetSerialisations: ISerialisationInfo[] = JSON.parse(localStorage["WIDGET_SERILIZATION"]);
      WidgetSerialisations.forEach(WidgetSerialisation =>
      {
        widgets.push(WidgetDeserializer.deserialize(WidgetSerialisation));
      });

      if (widgets.length == 0)
      {
        widgets.push(new SettingsWidget());
      }
    }
    else
    {
      widgets.push(new SettingsWidget());
    }

    this.setState({ widgets });
  };


  componentDidMount()
  {
    this.addListener = Custom_Event.addEventListener("ADD_WIDGET", this.onAddNewWidget.bind(this));
    this.saveListener = Custom_Event.addEventListener("SAVE_WIDGETS", this.onSaveWidgets.bind(this));
    this.loadListener = Custom_Event.addEventListener("LOAD_WIDGETS", this.onLoadWidgets.bind(this));
    Custom_Event.fire("LOAD_WIDGETS", true);
  }

  componentWillUnmount()
  {
    Custom_Event.removeEventListener("ADD_WIDGET", this.addListener);
    Custom_Event.removeEventListener("SAVE_WIDGETS", this.saveListener);
    Custom_Event.removeEventListener("LOAD_WIDGETS", this.loadListener);
  }
}