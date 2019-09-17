import qs from 'qs'
import store from 'store'

const url = process.env.REACT_APP_URL_BACKEND;

class Segnalazione {

  async Get(path, params) {
    var response = await fetch(
      url + path + '?' + qs.stringify(params),
      {
        method: 'get',
      }
    ).then(response => {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    });

    return await response;
  }

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

  async search(inputValue = '', filtro = '', dtinizio = null, dtfine = null, from = 0, to = 10, mine = false) {
    var size=to-from;
    if(filtro==='')
      filtro=null;
    else
      filtro=JSON.stringify(filtro);
    
    /*console.log({
      q: inputValue.toLowerCase(),
      filtro: filtro,
      dtinizio: dtinizio,
      dtfine: dtfine,
      size: size,
      from: from,
    });*/

    let params = {
      q: inputValue.toLowerCase(),
      filtro: filtro,
      dtinizio: dtinizio,
      dtfine: dtfine,
      size: size,
      from: from,
    };

    return await mine
      ? this.PostAuthenticated('searchmine', params)
      : this.Get('search', params);
  }

  async miaSegnalazione(id) {
    return await this.PostAuthenticated('checkmysegn', {
      theSegn: id
    })
  }

  async getDettaglio(id) {
    return await this.Get('search', {
      id_segnalazione: id
    })
  }

  async inviaSegnalazione(data) {
    return await this.PostAuthenticated('inserisci', {
      datiSegnalazione: data
    })
  }

  async rimuoviSegnalazione(data) {
    return await this.PostAuthenticated('rimuovisegnalazione', {
      datiInopportuna : data
    })
  }

  async aggiornaIter(data) {
    return await this.PostAuthenticated('operazione', {
      datiOperazione: data
    })
  }
}

export default new Segnalazione()