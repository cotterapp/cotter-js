import API from "../API"
import { getAPIKeyIDFromAttr } from "../helper"

const COTTER_COMPANY_CACHE_EXPIRY_KEY = "cotter_company_cache_expiry"
const COTTER_COMPANY_CACHE_KEY = "cotter_company_info"

class CompanyHandler {
  static infoPromise: Promise<any>

  static getInfo(): any {
    let companyInfo = localStorage.getItem(COTTER_COMPANY_CACHE_KEY)
    let expiry = Date.parse(localStorage.getItem(COTTER_COMPANY_CACHE_EXPIRY_KEY))

    if(!companyInfo || expiry - Date.now() < 0) {
      // fetch from API
      let apiKeyID = getAPIKeyIDFromAttr()
      let spaceAPI = new API(apiKeyID)
      CompanyHandler.infoPromise = spaceAPI.getInfo().then((companyInfo) => {
        let newExpiry = Date.now() + 10
        localStorage.setItem(COTTER_COMPANY_CACHE_KEY, JSON.stringify(companyInfo))
        localStorage.setItem(COTTER_COMPANY_CACHE_EXPIRY_KEY, new Date(newExpiry).toString())
      })
    }
    return JSON.parse(companyInfo)
  }
}

export default CompanyHandler