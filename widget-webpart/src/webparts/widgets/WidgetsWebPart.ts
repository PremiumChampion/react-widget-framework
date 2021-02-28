import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import
{
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'WidgetsWebPartStrings';
import Widgets from './components/Widgets';
import { IWidgetsProps } from './components/IWidgetsProps';
import { WidgetDeserializer } from './WidgetFramework/Serialization/WidgetDeserializer';
import { WidgetType } from './WidgetFramework/Enums/WidgetType';
import { NotesWidget } from './Widgets/NoteWidget/NotesWidget';
import { LinkWidget } from './Widgets/LinkWidget/LinkWidget';
import { SettingsWidget } from './Widgets/SettingsWidget/SettingsWidget';
import { WeatherWidget } from './Widgets/WeatherWidget/WeatherWidget';
import { ResizeProvider } from './WidgetFramework/UseResize';
import { Custom_Event } from './Widgets/CustomEvents';

export interface IWidgetsWebPartProps
{
  serialisedData: string;
}

export default class WidgetsWebPart extends BaseClientSideWebPart<IWidgetsWebPartProps> {
  public saveListener: (ev: Event) => void;
  public render(): void
  {
    console.log(this.properties.serialisedData);
    
    const widget: React.ReactElement<IWidgetsProps> = React.createElement(
      Widgets,
      {
        serialisedData: (this.properties.serialisedData && this.properties.serialisedData.length > 0) ? this.properties.serialisedData : "[]"
      }
    );
    const Resize = React.createElement(
      ResizeProvider,
      {
        element: this.domElement, children: widget
      }
    );

    ReactDom.render(Resize, this.domElement);
  }

  protected onDispose(): void
  {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version
  {
    return Version.parse('1.0');
  }

  public onInit()
  {
    return super.onInit().then(_ =>
    {
      WidgetDeserializer.register(WidgetType.NotesWidget, () => { return new NotesWidget(); });
      WidgetDeserializer.register(WidgetType.WeatherWidget, () => { return new WeatherWidget(); });
      WidgetDeserializer.register(WidgetType.SettingsWidget, () => { return new SettingsWidget(); });
      WidgetDeserializer.register(WidgetType.LinkWidget, () => { return new LinkWidget(); });

      this.saveListener = Custom_Event.addEventListener("SAVE_WIDGETS_PROPERTY", this.onSaveWidgets.bind(this));
    });
  }

  /**
   * 
   */
  public dispose()
  {
    Custom_Event.removeEventListener("SAVE_WIDGETS_PROPERTY", this.saveListener);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration
  {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
  public onSaveWidgets(data: string)
  {
    debugger;
    this.properties.serialisedData = data;
  }
}
