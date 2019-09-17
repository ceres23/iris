import qs from 'qs'

const url = process.env.REACT_APP_URL_BACKEND;

class Parametri {

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

  async getMunicipalita() {
    return await this.Get('leggimunicipalita')
  }

  async getTipologie() {
    return await this.Get('leggitipiproblema')
  }

  async getStati() {
    return await this.Get('leggitipistato')
  }

  async getStatiOperazione() {
    return await this.Get('leggitipioperazioni')
  }

  async getSubStati() {
    return await this.Get('leggitipisubstato')
  }

  async getStatistiche() {
    return await this.Get('leggistatistiche')
  }

  async getRipartizione() {
    return await this.Get('leggiripartizione')
  }
}

export default new Parametri()