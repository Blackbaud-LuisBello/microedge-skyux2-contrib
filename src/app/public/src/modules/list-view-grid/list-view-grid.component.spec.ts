import {
  TestBed,
  async
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  ListState,
  ListStateDispatcher
} from '../list/state';
import * as moment from 'moment';

import {
  ListViewsLoadAction
} from '../list/state/views/actions';
import { ListViewModel } from '../list/state/views/view.model';
import { ListItemModel } from '../list/state/items/item.model';
import { ListItemsLoadAction } from '../list/state/items/actions';
import { ListViewGridFixturesModule } from './fixtures/list-view-grid-fixtures.module';
import { ListViewGridTestComponent } from './fixtures/list-view-grid.component.fixture';
import {
  ListViewGridDisplayTestComponent
} from './fixtures/list-view-grid-display.component.fixture';
import {
  ListViewGridEmptyTestComponent
} from './fixtures/list-view-grid-empty.component.fixture';
import { SkyContribListViewGridModule } from './';
import { SkyContribListToolbarModule } from '../list-toolbar';
import { ListToolbarItemModel } from '../list/state/toolbar/toolbar-item.model';
import { ListViewGridColumnModel } from './state/columns/column.model';
import { ListViewGridColumnsLoadAction } from './state/columns/actions';
import { GridState, GridStateDispatcher, GridStateModel } from './state';
import { ListToolbarItemsLoadAction } from '../list/state/toolbar/actions';

describe('List View Grid Component', () => {
  describe('Basic Fixture', () => {
    let state: ListState,
        dispatcher: ListStateDispatcher,
        component: ListViewGridTestComponent,
        fixture: any,
        nativeElement: HTMLElement,
        element: DebugElement;

    beforeEach(async(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      TestBed.configureTestingModule({
        imports: [
          ListViewGridFixturesModule,
          SkyContribListViewGridModule,
          SkyContribListToolbarModule
        ],
        providers: [
          { provide: ListState, useValue: state },
          { provide: ListStateDispatcher, useValue: dispatcher }
        ]
      });

      fixture = TestBed.createComponent(ListViewGridTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
      fixture.detectChanges();

      let items = [
        new ListItemModel('1', { column1: '1', column2: 'Apple',
          column3: 1, column4: moment().add(1, 'minute') }),
        new ListItemModel('2', { column1: '01', column2: 'Banana',
          column3: 1, column4: moment().add(6, 'minute'), column5: 'test' }),
        new ListItemModel('3', { column1: '11', column2: 'Carrot',
          column3: 11, column4: moment().add(4, 'minute') }),
        new ListItemModel('4', { column1: '12', column2: 'Daikon',
          column3: 12, column4: moment().add(2, 'minute') }),
        new ListItemModel('5', { column1: '13', column2: 'Edamame',
          column3: 13, column4: moment().add(5, 'minute') }),
        new ListItemModel('6', { column1: '20', column2: 'Fig',
          column3: 20, column4: moment().add(3, 'minute') }),
        new ListItemModel('7', { column1: '21', column2: 'Grape',
          column3: 21, column4: moment().add(7, 'minute') })
      ];

      dispatcher.next(new ListItemsLoadAction(items, true));
      dispatcher.next(new ListViewsLoadAction([
        new ListViewModel(component.grid.id, component.grid.label)
      ]));
      dispatcher.viewsSetActive(component.grid.id);
      fixture.detectChanges();

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.skip(1).take(1).subscribe(() => fixture.detectChanges());
      fixture.detectChanges();
    }));

    it('should enable sort selector button in toolbar with all 6 sort options', () => {
      expect(element.query(
        By.css('sky-contrib-list-toolbar-item-renderer[cmp-id="sort-selector"]')
      )).not.toBeNull();
      expect(element.query(By.css('sky-dropdown-item[cmp-id="column1_asc"]'))).not.toBeNull();
      expect(element.query(By.css('sky-dropdown-item[cmp-id="column1_desc"]'))).not.toBeNull();
      expect(element.query(By.css('sky-dropdown-item[cmp-id="column2_asc"]'))).not.toBeNull();
      expect(element.query(By.css('sky-dropdown-item[cmp-id="column2_desc"]'))).not.toBeNull();
      expect(element.query(By.css('sky-dropdown-item[cmp-id="column3_asc"]'))).not.toBeNull();
      expect(element.query(By.css('sky-dropdown-item[cmp-id="column3_desc"]'))).not.toBeNull();
    });

    it('should load a custom toolbar item for grid view', () => {
      state.take(1).subscribe(s => {
        let item: ListToolbarItemModel = s.toolbar.items.filter(f => f.location === 'left')[0];
        item.view = s.views.active;
        dispatcher.next(new ListToolbarItemsLoadAction([item]));
      });
      fixture.detectChanges();
      let custom = element.query(
        By.css('sky-contrib-list-toolbar-item-renderer[cmp-id="custom-item"]')
      );

      expect(custom).not.toBeNull();
    });

    it('should have a column selector button in the toolbar', () => {
      fixture.detectChanges();

      let columnSelectorButton = element.query(
        By.css('sky-contrib-list-toolbar-item-renderer[cmp-id="column-selector"]')
      );
      expect(columnSelectorButton).not.toBeNull();
    });

    describe('column selector', () => {
      let columnSelector: any;
      let timeout: any;

      beforeEach(() => {
        fixture.detectChanges();
        let columnSelectorButton = element.query(
          By.css('sky-contrib-list-toolbar-item-renderer[cmp-id="column-selector"]')
        );
        columnSelectorButton.query(By.css('button')).triggerEventHandler('click', undefined);
        fixture.detectChanges();

        columnSelector = document.querySelector('sky-contrib-list-view-grid-column-selector');
      });

      afterEach(() => {
        let closeButton = (document.querySelector('.sky-modal-btn-close') as HTMLButtonElement);
        if (closeButton) {
          closeButton.click();
        }

        clearTimeout(timeout);
        fixture.detectChanges();
      });

      it('should have 4 checked columns, 3 unchecked', () => {
        timeout = setTimeout(() => {
          fixture.detectChanges();
          expect(columnSelector.querySelectorAll('sky-checkbox input:checked').length).toBe(4);
          expect(columnSelector.querySelectorAll('sky-checkbox input:not(:checked)')
            .length).toBe(3);
        }, 0);
      });

      it('should let user clear all columns', () => {
        timeout = setTimeout(() => {
          fixture.detectChanges();
          let clearAllLink = columnSelector.querySelector('[cmp-id="clear-all"] a') as HTMLElement;

          clearAllLink.click();
          fixture.detectChanges();

          expect(columnSelector.querySelectorAll('sky-checkbox input:checked').length).toBe(0);
          expect(columnSelector.querySelectorAll('sky-checkbox input:not(:checked)')
            .length).toBe(7);
        }, 0);
      });

      it('should let user select all columns', () => {
        timeout = setTimeout(() => {
          fixture.detectChanges();
          let selectAllLink = columnSelector
            .querySelector('[cmp-id="select-all"] a') as HTMLElement;
          selectAllLink.click();
          fixture.detectChanges();

          expect(columnSelector.querySelectorAll('sky-checkbox input:checked').length).toBe(7);
          expect(columnSelector.querySelectorAll('sky-checkbox input:not(:checked)')
            .length).toBe(0);
        }, 0);
      });

      it('should let user select columns', () => {
        timeout = setTimeout(() => {
          fixture.detectChanges();
          let clearAllLink = columnSelector.querySelector('[cmp-id="clear-all"] a') as HTMLElement;
          clearAllLink.click();
          fixture.detectChanges();

          (columnSelector
            .querySelector(
              'sky-contrib-list-view-checklist-item[cmp-id="column1"] input') as HTMLElement)
            .click();
          expect(columnSelector.querySelectorAll('sky-checkbox input:checked').length).toBe(1);

          let closeButton = (document.querySelector(
            '[cmp-id="apply-changes"]') as HTMLButtonElement);
          closeButton.click();
          fixture.detectChanges();
        }, 0);
      });
    });

    describe('Models and State', () => {
      it('should run ListViewGridColumnsLoadAction action', async(() => {
        let gridDispatcher = new GridStateDispatcher();
        let gridState = new GridState(new GridStateModel(), gridDispatcher);

        let columns = [
          new ListViewGridColumnModel(component.viewtemplates.first, undefined),
          new ListViewGridColumnModel(component.viewtemplates.first, undefined)
        ];
        gridDispatcher.next(new ListViewGridColumnsLoadAction(columns));
        gridState.take(1).subscribe(s => {
          expect(s.columns.count).toBe(2);
        });
      }));

      it('should construct ListViewGridColumnModel without data', () => {
        let model = new ListViewGridColumnModel(component.viewtemplates.first, undefined);
        expect(model.template).not.toBeUndefined();
        expect(model.description).toBeUndefined();
        expect(model.field).toBeUndefined();
        expect(model.heading).toBeUndefined();
        expect(model.id).toBeUndefined();
        expect(model.locked).toBeUndefined();
        expect(model.hidden).toBeUndefined();
        expect(model.type).toBeUndefined();
        expect(model.width).toBeUndefined();
      });
    });

    describe('Selector column', () => {
      it('all checkboxes start unchecked by default', () => {
        let checkboxes = document.querySelectorAll('[class="select-checkbox"] input');

        for (let i = 0; i < checkboxes.length; i++) {
          let el = checkboxes[i] as HTMLInputElement;
          expect(el.checked).toBe(false);
        }
      });

      it('Select all header functionality', () => {
        let headerCheckbox = element.query(
          By.css('[cmp-id="select-header"] input')
        ).nativeElement as HTMLInputElement;
        headerCheckbox.click();
        fixture.detectChanges();

        let checkboxes = document.querySelectorAll('[class="select-checkbox"] input');

        for (let i = 0; i < checkboxes.length; i++) {
          let el = checkboxes[i] as HTMLInputElement;
          expect(el.checked).toBe(true);
        }

        // deselect
        headerCheckbox.click();
        fixture.detectChanges();

        for (let i = 0; i < checkboxes.length; i++) {
          let el = checkboxes[i] as HTMLInputElement;
          expect(el.checked).toBe(false);
        }
      });

      it('Select checkbox functionality', () => {
        let checkbox = element.query(
          By.css('[cmp-id="select-1"] input')
        ).nativeElement as HTMLInputElement;
        checkbox.click();
        fixture.detectChanges();

        expect(checkbox.checked).toBe(true);

        // deselect
        checkbox.click();
        fixture.detectChanges();

        expect(checkbox.checked).toBe(false);
      });
    });
  });

  describe('Display Fixture', () => {
    let state: ListState,
        dispatcher: ListStateDispatcher,
        component: ListViewGridTestComponent,
        fixture: any,
        nativeElement: HTMLElement,
        element: DebugElement;

    beforeEach(async(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      TestBed.configureTestingModule({
        imports: [
          ListViewGridFixturesModule,
          SkyContribListViewGridModule,
          SkyContribListToolbarModule
        ],
        providers: [
          { provide: ListState, useValue: state },
          { provide: ListStateDispatcher, useValue: dispatcher }
        ]
      });

      fixture = TestBed.createComponent(ListViewGridDisplayTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
      fixture.detectChanges();

      let items = [
        new ListItemModel('1', { column1: '1', column2: 'Apple',
          column3: 1, column4: moment().add(1, 'minute') }),
        new ListItemModel('2', { column1: '01', column2: 'Banana',
          column3: 1, column4: moment().add(6, 'minute'), column5: 'test' }),
        new ListItemModel('3', { column1: '11', column2: 'Carrot',
          column3: 11, column4: moment().add(4, 'minute') }),
        new ListItemModel('4', { column1: '12', column2: 'Daikon',
          column3: 12, column4: moment().add(2, 'minute') }),
        new ListItemModel('5', { column1: '13', column2: 'Edamame',
          column3: 13, column4: moment().add(5, 'minute') }),
        new ListItemModel('6', { column1: '20', column2: 'Fig',
          column3: 20, column4: moment().add(3, 'minute') }),
        new ListItemModel('7', { column1: '21', column2: 'Grape',
          column3: 21, column4: moment().add(7, 'minute') })
      ];

      dispatcher.next(new ListItemsLoadAction(items, true));
      dispatcher.next(new ListViewsLoadAction([
        new ListViewModel(component.grid.id, component.grid.label)
      ]));
      dispatcher.viewsSetActive(component.grid.id);
      fixture.detectChanges();

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.skip(1).take(1).subscribe(() => fixture.detectChanges());
      fixture.detectChanges();
    }));

    it('should show 2 columns', () => {
      expect(element.queryAll(By.css('th.heading')).length).toBe(2);
      expect(element.query(
        By.css('th[cmp-id="column3"]')).nativeElement.textContent.trim()
      ).toBe('Column3');
      expect(element.query(
        By.css('th[cmp-id="column4"]')
      ).nativeElement.textContent.trim()).toBe('Column4');
    });
  });

  describe('Empty Fixture', () => {
    let state: ListState,
        dispatcher: ListStateDispatcher,
        component: ListViewGridTestComponent,
        fixture: any,
        nativeElement: HTMLElement,
        element: DebugElement;

    beforeEach(async(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      TestBed.configureTestingModule({
        imports: [
          ListViewGridFixturesModule,
          SkyContribListViewGridModule,
          SkyContribListToolbarModule
        ],
        providers: [
          { provide: ListState, useValue: state },
          { provide: ListStateDispatcher, useValue: dispatcher }
        ]
      });

      fixture = TestBed.createComponent(ListViewGridEmptyTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      element = fixture.debugElement as DebugElement;
      component = fixture.componentInstance;
    }));

    it('should throw columns require error', () => {
      expect(() => { fixture.detectChanges(); })
        .toThrowError(
          /Grid view requires at least one sky-contrib-list-view-grid-column to render./
        );
    });
  });

});
