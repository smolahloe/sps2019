import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
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
export default class CelebrationsWebPart extends BaseClientSideWebPart<ICelebrationsWebPartProps> {
    private _getMockListData();
    private _getListData();
    private _renderListAsync();
    private _renderList(items);
    render(): void;
    private _getWebPartHeading();
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
