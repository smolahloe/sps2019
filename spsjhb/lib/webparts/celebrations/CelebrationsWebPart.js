var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PropertyPaneTextField, PropertyPaneToggle, PropertyPaneSlider } from '@microsoft/sp-property-pane';
import { escape } from '@microsoft/sp-lodash-subset';
import styles from './CelebrationsWebPart.module.scss';
import MockHttpClient from './MockHttpClient';
import { SPHttpClient } from '@microsoft/sp-http';
var CelebrationsWebPart = /** @class */ (function (_super) {
    __extends(CelebrationsWebPart, _super);
    function CelebrationsWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CelebrationsWebPart.prototype._getMockListData = function () {
        return MockHttpClient.get(this.context.pageContext.web.absoluteUrl).then(function () {
            var listData = {
                value: [
                    { EmployeeId: "23", Employee: 'Tony Stark', CelebrationType: 'Birthday', CelebrationDate: '06 April 2019' },
                    { EmployeeId: "34", Employee: 'Peter Parker', CelebrationType: 'Wedding', CelebrationDate: '13 April 2019' },
                    { EmployeeId: "45", Employee: 'Bruce Banner', CelebrationType: 'Graduation', CelebrationDate: '27 April 2019' }
                ]
            };
            return listData;
        });
    };
    CelebrationsWebPart.prototype._getListData = function () {
        var currentWebUrl = this.context.pageContext.web.absoluteUrl;
        var requestUrl = currentWebUrl.concat("/_api/web/Lists/GetByTitle('StaffCelebrations')/Items");
        return this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1).catch(function (response) {
            debugger;
            return response.json();
        });
    };
    CelebrationsWebPart.prototype._renderListAsync = function () {
        var _this = this;
        if (Environment.type === EnvironmentType.Local) {
            this._getMockListData().then(function (response) {
                _this._renderList(response.value);
            });
        }
        else {
            this._getListData()
                .then(function (response) {
                _this._renderList(response.value);
            });
        }
    };
    CelebrationsWebPart.prototype._renderList = function (items) {
        var html = '<table class="hover">';
        var icon = '';
        html += "<th width=\"2%\"></th><th width=\"20%\">Employee ID</th><th>Employee</th><th width=\"20%\">Celebration</th><th width=\"20%\">Date</th>";
        items.forEach(function (item) {
            switch (item.CelebrationType) {
                case "Wedding":
                    icon = "<i class=\"fas fa-ring fa-2x\"></i>";
                    break;
                case "Graduation":
                    icon = "<i class=\"fas fa-graduation-cap fa-2x\"></i>";
                    break;
                default:
                    icon = "<i class=\"fas fa-birthday-cake fa-2x\"></i>";
            }
            html += "\n         <tr>\n            <td>" + icon + "</td>\n            <td>" + item.EmployeeId + "</td>\n            <td>" + item.Employee + "</td>\n            <td>" + item.CelebrationType + "</td>\n            <td>" + item.CelebrationDate + "</td>\n        </tr>\n        ";
        });
        html += "</table>";
        var celebrationsContainer = this.domElement.querySelector('#spCelebrationsContainer');
        celebrationsContainer.innerHTML = html;
    };
    CelebrationsWebPart.prototype.render = function () {
        this.domElement.innerHTML = "\n      <div class=\"" + styles.celebrations + "\">\n        <div class=\"" + styles.container + "\">\n          <div class=\"" + styles.row + "\">"
            + this._getWebPartHeading() +
            "\n            <div id=\"spCelebrationsContainer\" />\n          </div>\n        </div>\n      </div>\n    ";
        this._renderListAsync();
    };
    CelebrationsWebPart.prototype._getWebPartHeading = function () {
        if (this.properties.toggleTitle) {
            return "\n        <div class=\"" + styles.column + " " + styles.alignment + "\">\n          <span class=\"" + styles.title + "\">" + escape(this.properties.description) + "</span>\n        </div><br/>\n      ";
        }
        else {
            return "<div>&nbsp;</div><br/>";
        }
    };
    Object.defineProperty(CelebrationsWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    CelebrationsWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                PropertyPaneToggle("toggleTitle", {
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
                                    min: 1, max: 15, value: 3, showValue: true
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return CelebrationsWebPart;
}(BaseClientSideWebPart));
export default CelebrationsWebPart;
//# sourceMappingURL=CelebrationsWebPart.js.map