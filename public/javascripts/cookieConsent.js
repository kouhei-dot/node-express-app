(
  function () {
    window.cookieconsent.initialise({
      'palette': {
        'popup': {
          'background': '#efefef',
          'text': '#404040'
        },
        'button': {
          'background': '#8ec760',
          'text': '#ffffff'
        }
      },
      'theme': 'classic',
      'position': 'bottom-right',
      'type': 'opt-in',
      'content': {
        'message': '本サイトでは、お客様に快適にご利用いただくためにCookieを使用しています。',
        'allow': '全て許可',
        'deny': '全て拒否',
        'link': 'プライバシーポリシー',
        'href': '/public/help/privacy-policy.html',
      },
      onStatusChange: function() {
        console.log(this.hasConsented() ? 'Allow' : 'Deny');
      },
    });
  }
)();
