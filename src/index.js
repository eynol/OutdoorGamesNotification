import dva from 'dva';
import './index.css';
import 'antd-mobile/dist/antd-mobile.css?module=false';
import createLoading from 'dva-loading';
import { Toast } from 'antd-mobile';

// 1. Initialize
const app = dva({
  onError: (error) => {
    Toast.fail(
      error.name + ':' + error.message,
    );
    console.error('onError', error);
  }
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/games').default);
app.model(require('./models/messages').default);
app.model(require('./models/user').default);
app.model(require('./models/ui').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
