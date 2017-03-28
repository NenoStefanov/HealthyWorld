/* globals $ app */

import { App } from './app';

const app = new App();

$(document).ready(() => {
    app.initialize();
});