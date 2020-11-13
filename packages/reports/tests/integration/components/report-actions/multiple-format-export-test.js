import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import $ from 'jquery';
import hbs from 'htmlbars-inline-precompile';
import { clickTrigger } from 'ember-basic-dropdown/test-support/helpers';

const TEMPLATE = hbs`
    <ReportActions::MultipleFormatExport
      @report={{this.report}}
      @title={{this.title}}
      @disabled={{this.disabled}}
      @naviNotifications={{this.mockNotifications}}
    >
      Export
    </ReportActions::MultipleFormatExport>
    `;

let Store;

module('Integration | Component | report actions - multiple-format-export', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    Store = this.owner.lookup('service:store');

    // Mock notifications
    this.mockNotifications = {
      add: () => null,
      clearMessages: () => {}
    };

    return this.owner
      .lookup('service:bard-metadata')
      .loadMetadata()
      .then(() => {
        return Store.findRecord('report', 1);
      })
      .then(report => {
        this.set('report', report);
      });
  });

  test('export links', async function(assert) {
    assert.expect(5);

    const factService = this.owner.lookup('service:navi-facts');
    const compressionService = this.owner.lookup('service:compression');

    await render(TEMPLATE);

    assert.dom('.ember-basic-dropdown-trigger').hasText('Export', 'Component yields content as expected');

    await clickTrigger();
    // CSV
    let expectedHref = factService.getURL(this.report.get('request').serialize(), { format: 'csv' });
    assert.equal(
      $('.multiple-format-export__dropdown a:contains("CSV")').attr('href'),
      expectedHref,
      'CSV link has appropriate link to API'
    );

    const exportHref = $('.multiple-format-export__dropdown a:contains("PDF")').attr('href');
    const encodedModel = exportHref.split('/export?reportModel=')[1];

    const actualModel = (await compressionService.decompressModel(encodedModel)).serialize();
    const expectedModel = this.report.serialize();

    //strip off owner
    delete expectedModel.data.relationships;

    assert.deepEqual(actualModel, expectedModel, 'PDF link has appropriate link to export service');

    const pngHref = $('.multiple-format-export__dropdown a:contains("PNG")').attr('href');
    assert.equal(`${exportHref}&fileType=png`, pngHref, 'PNG link has appropriate link to export service');

    const gSheetHref = $('.multiple-format-export__dropdown a:contains("Google Sheet")').attr('href');
    assert.equal(`/gsheet-export/report/1`, gSheetHref);
  });

  test('filename', async function(assert) {
    assert.expect(1);

    await render(TEMPLATE);

    await clickTrigger();
    assert.equal(
      $('.multiple-format-export__dropdown a:contains("CSV")').attr('download'),
      'hyrule-news',
      'The download attribute is set to the dasherized report name'
    );
  });

  test('close on click', async function(assert) {
    assert.expect(3);

    this.set('exportFormats', [
      {
        type: 'CSV',
        href: null,
        icon: 'file-text-o'
      }
    ]);
    await render(hbs`
      {{#report-actions/multiple-format-export
          report=report
          disabled=disabled
          naviNotifications=mockNotifications
          exportFormats=exportFormats
      }}
          Export
      {{/report-actions/multiple-format-export}}
    `);

    // Default state
    assert.notOk(
      find('.ember-basic-dropdown-trigger').getAttribute('aria-expanded'),
      'The dropdown is closed by default'
    );

    // Click trigger
    await clickTrigger();
    assert.ok(
      find('.ember-basic-dropdown-trigger').getAttribute('aria-expanded'),
      'The dropdown is open when the trigger is clicked'
    );

    // Click export option
    await click($('.multiple-format-export__dropdown a:contains("CSV")')[0]);
    assert.notOk(
      find('.ember-basic-dropdown-trigger').getAttribute('aria-expanded'),
      'The dropdown is closed when an export option is clicked'
    );
  });

  test('disabled dropdown', async function(assert) {
    assert.expect(1);

    this.set('disabled', true);
    await render(TEMPLATE);
    await clickTrigger();

    assert.dom('.ember-basic-dropdown-content-placeholder').isNotVisible('Dropdown should not be visible');
  });

  test('notifications', async function(assert) {
    assert.expect(1);

    this.mockNotifications.add = ({ message }) => {
      assert.equal(
        message,
        'CSV? Got it. The download should begin soon.',
        'A notification is added for the clicked export type'
      );
    };

    this.set('exportFormats', [
      {
        type: 'CSV',
        href: null,
        icon: 'file-text-o'
      }
    ]);
    await render(hbs`
      <ReportActions::MultipleFormatExport
        @report={{this.report}}
        @disabled={{this.disabled}}
        @naviNotifications={{this.mockNotifications}}
        @exportFormats={{this.exportFormats}}
      >
        Export
      </ReportActions::MultipleFormatExport>
    `);

    await clickTrigger();
    await click($('.multiple-format-export__dropdown a:contains("CSV")')[0]);
  });

  test('GSheet Notification', async function(assert) {
    assert.expect(2);

    let addCalls = 0;
    this.mockNotifications.add = ({ message }) => {
      addCalls += 1;
      if (addCalls == 1) {
        assert.equal(
          message,
          'We are building your spreadsheet and sending to Google Drive.  Keep an eye out for the email!',
          'A notification is added for the clicked export type'
        );
      } else {
        assert.equal(
          message?.string,
          'Your export is done and available at <a href="https://google.com/sheets/blah" target="_blank">here &raquo;</a>',
          'Second notification after ajax call comes back'
        );
      }
    };

    this.set('exportFormats', [
      {
        type: 'Google Sheet',
        href: '/gsheet-export/report/1',
        icon: 'google',
        async: true
      }
    ]);
    await render(hbs`
      <ReportActions::MultipleFormatExport
        @report={{this.report}}
        @disabled={{this.disabled}}
        @naviNotifications={{this.mockNotifications}}
        @exportFormats={{this.exportFormats}}
      >
        Export
      </ReportActions::MultipleFormatExport>
    `);

    await clickTrigger();
    await click($('.multiple-format-export__dropdown a:contains("Google Sheet")')[0]);
  });
});
