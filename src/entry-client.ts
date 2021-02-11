import { createSSRApp } from 'vue';
import App from './app.vue';
import '@/assets/css/index.css';
import createRouter from './router/';
import el from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

const router = createRouter();

const app = createSSRApp(App);
app.use(router);
app.use(el);

router.beforeResolve((to, from, next) => {
  let diffed = false;
  const matched = router.resolve(to).matched;
  const prevMatched = router.resolve(from).matched;

  if (from && !from.name && process.env.NODE_ENV !== 'development') {
    return next();
  }
  const activated = matched.filter((c, i) => {
    return diffed || (diffed = prevMatched[i] !== c);
  });
  if (!activated.length) {
    return next();
  }
  const matchedComponents: any = [];
  matched.map((route) => {
    matchedComponents.push(...Object.values(route.components));
  });
  const asyncDataFuncs = matchedComponents.map((component: any) => {
    const asyncData = component.asyncData || null;
    if (asyncData) {
      const config = {
        route: to
      };
      if (isPromise(asyncData) === false) {
        return Promise.resolve(asyncData(config));
      }
      return asyncData(config);
    }
  });
  try {
    Promise.all(asyncDataFuncs).then(() => {
      next();
    });
  } catch (err) {
    next(err);
  }
});


router.isReady().then(() => {
  app.mount('#app', true);
});
