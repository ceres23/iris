import store from 'store'

const url = process.env.REACT_APP_URL_BACKEND;

class Inserimento {

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

  async inviaCommento(data) {
    return await this.PostAuthenticated('commenta', {
      datiCommento: data
    })
  }

  async rimuoviCommento(data) {
    return await this.PostAuthenticated('rimuovicommento', {
      datiCommento : data
    })
  }
}

export default new Inserimento()