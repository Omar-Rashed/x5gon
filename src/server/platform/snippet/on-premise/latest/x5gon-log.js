/**
 * Gets the cookie value.
 * @param {String} cookieName - The cookie name.
 * @returns {String} The cookieName value, empty string if the cookie not found.
 */
function x5gonGetCookie(cookieName) {
  if(document.cookie.length > 0) {
    var CStart = document.cookie.indexOf(cookieName + '=');
    if (CStart != -1) {
      CStart = CStart + cookieName.toString().length + 1;
      var CEnd = document.cookie.indexOf('; ', CStart);
      if (CEnd == -1) { CEnd = document.cookie.length; }
      var StrLen = CEnd - CStart;
      if (StrLen > 20) { CEnd = CStart + 20; }
      if (CEnd <= document.cookie.length) {
        return decodeURIComponent(document.cookie.substring(CStart, CEnd));
      }
    }
  }
  return '';
}

/**
 * Gets the domain of the current website.
 * @returns {String} The domain of the current website.
 */
function x5gonGetDomain() {
  domain = document.domain;
  domain_part = domain.split('.');
  domain_parts = domain_part.length;
  if (domain_parts > 2) {
    domain = domain_part[domain_parts - 2] + '.' + domain_part[domain_parts - 1];
  }
  return domain;
}

/**
 * Sets a new cookie for the current domain. The expiration date is 30 days.
 * @param {String} cookieName - The cookie name.
 * @param {String} cookieValue - The cookie value.
 */
function x5gonSetCookie(cookieName, cookieValue) {
  var expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 3650);
  document.cookie = cookieName + '=' + encodeURIComponent(cookieValue) +
    '; expires=' + expirationDate.toGMTString() + '; path=/' +
    '; domain=' + x5gonGetDomain();
}

/**
 * Checks if the cookie exists.
 * @returns {String|Null} The value of the cookie or null (redirection to the activity-tracker).
 */
function x5gonCheckCookie() {
  var validation = x5gonGetCookie('x5gonValidated');
  if (validation !== null && validation !== ''){
    return validation;
  } else {
    return 'false';
  }
}

/**
 * Creates the user activity tracker function.
 * @returns {Function} The user activity tracker function where the input parameter
 * is the provider token. Uses the image pixel integration.
 */
var x5gonActivityTracker = function () {
  /**
   * Creates the request string.
   * @param {Boolean|String} validationFlag - If the user already validated X5GON.
   * @param {String} providerToken - The OER provider token used for identification.
   * @param {Boolean} test - Indicator if the tracker is used for testing or production.
   */
  function x5gonGetRequestString(validationFlag, providerToken, test) {
    var Dat = new Date();
    var Dt = Dat.toISOString().split('.')[0] + 'Z';
    var CURL = document.URL;
    var PURL = document.referrer;

    var request = 'https://platform.x5gon.org/api/v1/snippet/log?x5gonValidated=';
    request += encodeURIComponent(validationFlag);
    request += '&dt=' + encodeURIComponent(Dt);
    request += '&rq=' + encodeURIComponent(CURL);
    request += '&rf=' + encodeURIComponent(PURL);
    request += '&cid=' + encodeURIComponent(providerToken);
    if (test) { request +='&test=' + test; }
    return request;
  }

  return function(providerToken, test) {
    try {
      var img = document.createElement('img');
      img.setAttribute('src', x5gonGetRequestString(x5gonCheckCookie(), providerToken, test));
      document.body.appendChild(img);
    } catch(err) { }
  };

}();

/**
 * Checks and fetches the x5gon validation.
 */
function x5gonValidate() {
  if (document.referrer.indexOf('platform.x5gon.org/api/v1/snippet/tracker') > -1) {
    // the user has already been validated
    x5gonSetCookie('x5gonValidated', 'true');
  } else {
    // check if the user has been validated
    var validation = x5gonGetCookie('x5gonValidated');
    if (validation === null || validation === '') {
      window.location.href='https://platform.x5gon.org/api/v1/snippet/tracker?callbackURL=' +
        document.URL;
    }
  }
}

// set the x5gonValidated cookie
x5gonValidate();