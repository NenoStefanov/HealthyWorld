/* globals $ */

import { App } from './app';

$(document).ready(() => {
    const app = new App();
    app.initialize();
});