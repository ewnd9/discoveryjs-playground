import {Widget, router, complexViews} from '@discoveryjs/discovery/dist/lib.umd.js';
// import settingsPage from '../settings';
import '@discoveryjs/discovery/dist/lib.css';
import '@discoveryjs/discovery/client/common.css';
// import './index.css';

/**
 * Discovery initialization
 * @param {Object} options
 * @returns {Discovery}
 */
export function initDiscovery(options) {
  const {settings} = options;
  const discovery = new Widget(options.wrapper);

  discovery.apply(router);
  discovery.apply(complexViews);
  discovery.page.define('default', [
    'h1:#.name',
    'h2:"Struct"',
    {
      view: 'struct',
      expanded: parseInt(settings.expandLevel, 10) || 0,
    },
    'h2:"Buttons"',
    {
      view: 'context',
      data: [
        {title: 'Properties', query: 'dict.[type="Property"]'},
        {title: 'Types', query: 'dict.[type="Type"]'},
        {title: 'Functions', query: 'dict.[type="Function"]'},
        {title: 'Problems', query: 'dict.[no match or refs.resolved.[no match]]', href: '#problems'},
      ],
      content: {
        view: 'inline-list',
        item: 'indicator',
        data: `.({
              label: title,
              value: query.query(#.data, #).size(),
              href: href or pageLink('report', { query, title })
          })`,
      },
    },
    // https://github.com/csstree/docs/blob/master/src/syntax/ui/page/default.js
    {
      view: 'section',
      header: 'h3:"List"',
      content: {
        view: 'ul',
        item: 'link:{ text: title, href: pageLink("report", { ..., noedit: true }) }',
      },
      data: [
        {
          title: 'Syntax stat',
          query:
            "[{ header: 'Types', data: dict.group(<type>).({ type: key, count: value.size() }) },{ header: 'Origin', data: dict.({ type, name, mdn: mdn().syntax, csstree: syntax(), patch: patch() })\n        .[type!=\"Function\"]\n        .group(<\n            csstree=\"(generic)\" ? \"Generic\" :\n            no mdn ? 'Added (missed in MDN data)' :\n            patch ? 'Patched MDN data'\n                : 'As is from MDN data'\n        >)\n        .({ type: key, count: value.size() })\n    }\n]",
          view: {
            view: 'list',
            item: [
              'h2:header',
              {
                view: 'hstack',
                data: 'data',
                content: ['table', 'chart:.({ y: count, name: type })'],
              },
            ],
          },
        },
      ],
    },
  ]);

  discovery.view.define('raw', el => {
    const {raw} = discovery.context;
    const div = document.createElement('div');

    div.classList.add('user-select');
    div.innerHTML = raw;

    el.appendChild(div);
  });

  discovery.page.define('raw', [
    {
      view: 'raw',
    },
  ]);

  discovery.addBadge(
    'Index',
    () => {
      discovery.setPage('default');
      // history.replaceState(null, null, ' ');
    },
    host => host.pageId !== 'default',
  );
  discovery.addBadge('Make report', () => discovery.setPage('report'), host => host.pageId !== 'report');
  discovery.addBadge('Settings', () => discovery.setPage('settings'));
  discovery.addBadge('Raw', () => discovery.setPage('raw'), host => host.pageId !== 'raw');
  discovery.addBadge(
    'Copy raw',
    function() {
      const {raw} = discovery.context;
      const div = document.createElement('div');
      div.innerHTML = raw;
      const rawText = div.textContent;
      const el = document.createElement('textarea');
      el.value = rawText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      this.textContent = 'Copied!';
      setTimeout(() => {
        this.textContent = 'Copy raw';
      }, 700);
    },
    host => {
      if (host.pageId === 'raw') {
        document.body.classList.add('no-user-select');
      } else {
        document.body.classList.remove('no-user-select');
      }

      return host.pageId === 'raw';
    },
  );

  discovery.setData(options.data, {
    name: 'Discoveryjs Playground',
    raw: options.raw,
    settings,
    createdAt: new Date().toISOString(), // TODO fix in discovery
  });

  return discovery;
}
