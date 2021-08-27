declare global {
  interface Window {
    initCookieConsent: () => {
      run: (config: any) => void
      allowedCategory: (category: string) => boolean
      loadScript: (url: string, callback: () => void) => void
    }
  }
}
interface CookiePreferences {
  level: string[]
}

export default () => {
  // obtain cookieconsent plugin
  const cc = window.initCookieConsent()

  // run plugin with config object
  cc.run({
    autorun: true,
    delay: 0,
    current_lang: 'en',
    auto_language: false,
    autoclear_cookies: true,
    cookie_expiration: 365,
    autoload_css: true,
    force_consent: false,

    onAccept: (preferences: CookiePreferences) => {
      console.log('onAccept fired ...', preferences)
      // TODO: plug analytics, intercom, amplitude
      if (cc.allowedCategory('analytics_cookies')) {
        // cc.loadScript('https://www.google-analytics.com/analytics.js', () => {
        //   ga('create', 'UA-46747204-4', 'auto')
        //   ga('send', 'pageview')
        //   console.log('analytics.js loaded')
        // })
        console.log('Allowed analytics')
      }
    },

    onChange: (preferences: CookiePreferences) => {
      console.log('onChange fired ...', preferences)
      // TODO: plug analytics, intercom, amplitude
    },

    languages: {
      en: {
        consent_modal: {
          title: 'We use cookies',
          description:
            'Hi, this website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent. <button type="button" data-cc="c-settings" class="cc-link">Let me choose</button>',
          primary_btn: {
            text: 'Accept',
            role: 'accept_all', //'accept_selected' or 'accept_all'
          },
          secondary_btn: {
            text: 'Reject',
            role: 'accept_necessary', //'settings' or 'accept_necessary'
          },
        },
        settings_modal: {
          title:
            '<div>Cookie settings</div><div aria-hidden="true" style="font-size: .8em; font-weight: 200; color: #687278; margin-top: 5px;">Powered by <a tabindex="-1" aria-hidden="true" href="https://github.com/orestbida/cookieconsent/" style="text-decoration: underline;">cookie-consent</a></div>',
          save_settings_btn: 'Save settings',
          accept_all_btn: 'Accept all',
          close_btn_label: 'Close',
          cookie_table_headers: [
            { col1: 'Name' },
            { col2: 'Domain' },
            { col3: 'Expiration' },
            { col4: 'Description' },
            { col5: 'Type' },
          ],
          blocks: [
            {
              title: 'Cookie usage',
              description:
                'I use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="#" class="cc-link">privacy policy</a>.',
            },
            {
              title: 'Strictly necessary cookies',
              description:
                'These cookies are essential for the proper functioning of my website. Without these cookies, the website would not work properly',
              toggle: {
                value: 'necessary_cookies',
                enabled: true,
                readonly: true, //cookie categories with readonly=true are all treated as "necessary cookies"
              },
            },
            {
              title: 'Preferences cookies',
              description:
                'These cookies allow the website to remember the choices you have made in the past',
              toggle: {
                value: 'preferences_cookies', //there are no default categories => you specify them
                enabled: true,
                readonly: false,
              },
            },
            {
              title: 'Analytics cookies',
              description:
                'These cookies collect information about how you use the website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you',
              toggle: {
                value: 'analytics_cookies',
                enabled: false,
                readonly: false,
              },
              cookie_table: [
                {
                  col1: '_ga',
                  col2: 'google.com',
                  col3: '2 years',
                  col4: 'description ...',
                  col5: 'Permanent cookie',
                },
                {
                  col1: '_gat',
                  col2: 'google.com',
                  col3: '1 minute',
                  col4: 'description ...',
                  col5: 'Permanent cookie',
                },
                {
                  col1: '_gid',
                  col2: 'google.com',
                  col3: '1 day',
                  col4: 'description ...',
                  col5: 'Permanent cookie',
                },
              ],
            },
            {
              title: 'More information',
              description:
                'For any queries in relation to my policy on cookies and your choices, please <a class="cc-link" href="https://yogalive.com/contact">contact us</a>.',
            },
          ],
        },
      },
    },
  })
}
