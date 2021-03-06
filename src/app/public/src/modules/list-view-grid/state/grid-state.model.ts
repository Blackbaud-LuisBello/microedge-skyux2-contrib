import { AsyncList } from 'microedge-rxstate';
import { ListViewGridColumnModel } from './columns/column.model';

export class GridStateModel {
  public columns: AsyncList<ListViewGridColumnModel> = new AsyncList<ListViewGridColumnModel>();
  public displayedColumns: AsyncList<ListViewGridColumnModel> =
    new AsyncList<ListViewGridColumnModel>();
}
