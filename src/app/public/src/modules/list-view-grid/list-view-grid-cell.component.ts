import {
  Component, Input, ViewChild, ViewContainerRef, TemplateRef, OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { ListItemModel } from '../list/state/items/item.model';
import { getData } from '../list/helpers';

@Component({
  selector: 'sky-contrib-list-view-grid-cell',
  template: '<ng-template #cell></ng-template>',
  styleUrls: ['./list-view-grid-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyContribListViewGridCellComponent implements OnInit {
  @Input() public item: ListItemModel;
  @Input() public columnId: string;
  @Input() public isSelected: boolean;
  @Input() public template: TemplateRef<any>;
  @Input() public fieldSelector: string;
  @ViewChild('cell', { read: ViewContainerRef }) public container: ViewContainerRef;

  public ngOnInit() {
    this.container.createEmbeddedView(this.template, this);
  }

  get row() {
    return this.item.data;
  }

  get value() {
    if (this.item.data && (this.fieldSelector || this.columnId)) {
      return getData(this.item.data, this.fieldSelector || this.columnId);
    }

    return undefined;
  }
}
