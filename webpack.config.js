if (process.env.NODE_MODULE === 'server') 
    module.exports = require('./webpack/webpack.config.server.js');
else if (process.env.NODE_MODULE === 'client') 
    module.exports = require('./webpack/webpack.config.client.js');    
else if (process.env.NODE_MODULE === 'amd') 
    module.exports = require('./webpack/webpack.config.server.amd.js');        
else if (process.env.NODE_MODULE === 'amd-common') 
    module.exports = require('./webpack/webpack.config.server.amd.common.js');
else if (process.env.NODE_MODULE === 'sfu') 
    module.exports = require('./webpack/webpack.config.sfu.js');    
/** desktop */    
// desktop
else if (process.env.NODE_MODULE === 'desktop-app') 
    module.exports = require('./webpack/webpack.config.desktop.app.js');    
else if (process.env.NODE_MODULE === 'desktop-web') 
    module.exports = require('./webpack/webpack.config.desktop.web.js');    
// desktop-sender  
else if (process.env.NODE_MODULE === 'desktop-sender-app') 
    module.exports = require('./webpack/webpack.config.desktop.sender.app.js');    
else if (process.env.NODE_MODULE === 'desktop-sender-web') 
    module.exports = require('./webpack/webpack.config.desktop.sender.web.js');
// desktop-receiver
else if (process.env.NODE_MODULE === 'desktop-receiver-app') 
    module.exports = require('./webpack/webpack.config.desktop.receiver.app.js');    
else if (process.env.NODE_MODULE === 'desktop-receiver-web') 
    module.exports = require('./webpack/webpack.config.desktop.receiver.web.js');
// desktop-loading
else if (process.env.NODE_MODULE === 'desktop-loading-app') 
    module.exports = require('./webpack/webpack.config.desktop.loading.app.js');    
else if (process.env.NODE_MODULE === 'desktop-loading-web') 
    module.exports = require('./webpack/webpack.config.desktop.loading.web.js');    

  