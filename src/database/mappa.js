import qs from 'qs'

const url = process.env.REACT_APP_URL_BACKEND;
const url_indirizzi = process.env.REACT_APP_URL_CERCA_INDIRIZZO+'/query';

class Mappa {

  async cercaIndirizzo(q){
    if (q && q.length > 2) {
      let options={
        where: 'upper("DENOMINAZIONE_X_VIA") LIKE upper(\'%'+q+'%\') OR upper("DENOMINAZIONE_X_SESTIERE") LIKE upper(\'%'+q+'%\')',
        outFields: '*',
        f: 'pjson'
      };
      const response = await fetch(
        url_indirizzi + '/?' + qs.stringify(options),
        { method: 'get' }
      )

      return await response.json()
    }
  }

  async nearestPoint(position){
    const params = {
      lat: position.lat,
      lon: position.lng
    }
    const response = await fetch(
      url + 'nearestpoint?' + qs.stringify(params),
      { method: 'get' }
    )

    return await response.json()
  }
}

export default new Mappa()