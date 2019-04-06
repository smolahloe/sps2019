import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './CelebrationsWebPart.module.scss';
import * as strings from 'CelebrationsWebPartStrings';
import { ICelebrationsWebPartProps } from './ICelebrationsWebPartProps';

export interface ICelebrationsLists {
  value: ICelebration[];
}
export interface ICelebration {
  EmployeeId: string;
  CelebrationType: string;
  CelebrationDate: string;
  Employee: string;
}

import MockHttpClient  from './MockHttpClient';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions} from '@microsoft/sp-http';

export default class CelebrationsWebPart extends BaseClientSideWebPart<ICelebrationsWebPartProps> {

  private _getMockListData(): Promise<ICelebrationsLists> {
    return MockHttpClient.get(this.context.pageContext.web.absoluteUrl).then(() => {
        const listData: ICelebrationsLists = {
            value:
            [
                { EmployeeId: "23", Employee: 'Tony Stark', CelebrationType: 'Birthday', CelebrationDate: '06 April 2019' },
                 { EmployeeId: "34", Employee: 'Peter Parker', CelebrationType: 'Wedding', CelebrationDate: '13 April 2019'  },
                { EmployeeId: "45", Employee: 'Bruce Banner', CelebrationType: 'Graduation', CelebrationDate: '27 April 2019' }
            ]
            };
        return listData;
    }) as Promise<ICelebrationsLists>;
  }

  private _getListData(): Promise<ICelebrationsLists> {
    let currentWebUrl = this.context.pageContext.web.absoluteUrl;
    let requestUrl = currentWebUrl.concat(`/_api/web/Lists/GetByTitle('StaffCelebrations')/Items`);

    return this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1).catch((response: SPHttpClientResponse) => {
      debugger;
      return response.json();
    });
  }

  private _renderListAsync(): void {
    if (Environment.type === EnvironmentType.Local) {
      this._getMockListData().then((response) => {
        this._renderList(response.value);
      });
    }
     else {
       this._getListData()
      .then((response) => {
        this._renderList(response.value);
      });
   }
}

private _renderList(items: ICelebration[]): void {
  let html: string = '<table class="hover">';
  let icon: string = '';
  html += `<th width="2%"></th><th width="20%">Employee ID</th><th>Employee</th><th width="20%">Celebration</th><th width="20%">Date</th>`;

  items.forEach((item: ICelebration) => {
    switch(item.CelebrationType) {
      case "Wedding":
        icon = `<i class="fas fa-ring fa-2x"></i>`;
        break;
      case "Graduation":
        icon = `<i class="fas fa-graduation-cap fa-2x"></i>`;
        break;
      default:
        icon = `<i class="fas fa-birthday-cake fa-2x"></i>`;
    }
    html += `
         <tr>
            <td>${icon}</td>
            <td>${item.EmployeeId}</td>
            <td>${item.Employee}</td>
            <td>${item.CelebrationType}</td>
            <td>${item.CelebrationDate}</td>
        </tr>
        `;
  });
  html += `</table>`;
  const celebrationsContainer: Element = this.domElement.querySelector('#spCelebrationsContainer');
  celebrationsContainer.innerHTML = html;
}

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.celebrations }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">`

            + this._getWebPartHeading() +

            `
            <div id="spCelebrationsContainer" />
          </div>
        </div>
      </div>
    `;

    this._renderListAsync();
  }

  private _getWebPartHeading() : string {
    if(this.properties.toggleTitle) {
      return `
        <div class="${ styles.column} ${styles.alignment}">
          <span class="${ styles.title }">${escape(this.properties.description)}</span>
        </div><br/>
      `;
    }
    else {
      return `<div>&nbsp;</div><br/>`;
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Look & Feel"
          },
          groups: [
            {
              groupName: "UI Settings",
              groupFields: [
                PropertyPaneTextField('description', {
                  label: "Title"
                }),
                PropertyPaneToggle("toggleTitle",
                {
                  label: "Shows/hides title",
                  offText: "Title hidden",
                  onText: ""
                })
              ]
            },
            {
              groupName: "Configuration Settings",
              groupFields: [
                PropertyPaneSlider('displayItems', {
                  label: "Number of celebrations to display",
                  min:1, max: 15, value: 3, showValue:true
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
