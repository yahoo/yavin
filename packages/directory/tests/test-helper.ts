//@ts-ignore
import Application from 'dummy/app';
import config from 'dummy/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
// Install types for qunit-dom
import 'qunit-dom';

setApplication(Application.create(config.APP));
setup(QUnit.assert);
start();
