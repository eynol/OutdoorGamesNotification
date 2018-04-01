import dva from 'dva';
import './index.css';
import 'antd-mobile/dist/antd-mobile.css?module=false';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
 app.model(require('./models/games').default);
 app.model(require('./models/messages').default);
 app.model(require('./models/user').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
