import store from 'store'

const url = process.env.REACT_APP_URL_BACKEND;

class Utente {

  async PostAuthenticated(path, params) {
    var response = await fetch(
      url + path,
      {
        method: 'post',
        body: JSON.stringify(params),
        headers: {
          'Authorization': store.getState().login.login,
        }
      }
    ).then(response => {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    });

    return await response;
  }

  async checkToken(token) {
    var response = await fetch(
      url + 'checkToken?token='+encodeURIComponent(token),
      {method: 'get'}
    ).then(response => response.json());

    return await response;
  }

  async login(username,password) {
    var response = await fetch(
      url + 'login',
      {
        method: 'post',
        body: JSON.stringify({
          username: username,
          password: password
        }),
      }
    ).then(response => response);

    return await response;
  }

  async loginAnonimo(nome,cognome,email) {
    var response = await fetch(
      url + 'prelogintoken',
      {
        method: 'post',
        body: JSON.stringify({
          datiUtente: {
            nome: nome,
            cognome: cognome,
            email: email
          }
        }),
      }
    ).then(response => response.json());

    return await response;
  }

  async utenteAbilitato(id) {
    var response = await fetch(
      url + 'abilitato?theSegn=' + id,
      {
        method: 'post',
        headers: {
          'Authorization': store.getState().login.login,
        }
      }
    ).then(response => {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    });

    return await response;
  }

  async salvaEndpoint(endpoint) {
    return await endpoint && this.PostAuthenticated('setnewendpoint', {
      endpoint: endpoint,
      useragent: navigator.userAgent
    })
  }

  async disableEndpoint() {
    return await store.getState().login.endpoint && this.PostAuthenticated('disableendpoint', {
      endpoint: JSON.stringify(store.getState().login.endpoint)
    })
  }

  async echoUser() {
    var response = await fetch(
      url + 'echouser',
      {
        method: 'post',
        headers: {
          'Authorization': store.getState().login.login,
        }
      }
    ).then(response => {
      if (!response.ok) throw Error(response.statusText);
      return response.text();
    });

    return await response;
  }
}

export default new Utente()