'use strict';

require('./utils/config').config();

new (require('./LuminClient'))().start(process.lumin.bot.token);