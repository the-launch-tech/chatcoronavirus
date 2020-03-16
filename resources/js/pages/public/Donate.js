import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import loader from '../../helpers/loader'
import mapAuth from '../../helpers/mapAuth'

const { log, errors } = console

export default connect(mapAuth)(Donate)

function Donate({ dispatch, page }) {
  const [showButton, setShowButton] = useState(false)

  loader(dispatch, false, 100)

  const addresses = {
    BTC_ADDRESS: '3CWRQMxhvS3aL3zETEzpE412r6GH72KAdj',
    ETH_ADDRESS: '0x70cb24c49236f6fd14afc18cd8512cf72f6d0be0',
    LTC_ADDRESS: 'MGgxcxk1cRdytWMHuU2i49hHBAGrywgzQ8',
    USDT_ADDRESS: '13c21dSziUpzoKMKFhs5hdaqcXCWQNpiAi',
  }

  return (
    <div id="page-wrapper" className={`page-wrapper ${page}`}>
      <div id="page-content" className={`page-content ${page}`}>
        <div className="feature-coming-soon-page">
          <h3>Consider A Donation</h3>
          <ul>
            <li>
              Paypal: <small>(below)</small>
            </li>
            <li>
              Bitcoin (BTC): <small>{addresses.BTC_ADDRESS}</small>
            </li>
            <li>
              Ethereum (ETH): <small>{addresses.ETH_ADDRESS}</small>
            </li>
            <li>
              Tether (USDT): <small>{addresses.USDT_ADDRESS}</small>
            </li>
            <li>
              Litecoin (LTC): <small>{addresses.LTC_ADDRESS}</small>
            </li>
          </ul>
          <p>
            Please consider donating in one of the above mentioned methods. All funds will go
            towards the time it takes to develop features, and platform/server maintainence.
          </p>
          <p>
            If a surplus of donations are received the net surplus will be directed towards some
            form of relief for those impacted.
          </p>
        </div>
        <form
          className="donate-pp"
          action="https://www.paypal.com/cgi-bin/webscr"
          method="post"
          target="_top"
        >
          <input type="hidden" name="cmd" value="_donations" />
          <input type="hidden" name="business" value="dgriffiths.coding@gmail.com" />
          <input type="hidden" name="item_name" value="Fundraising from website." />
          <input type="hidden" name="currency_code" value="USD" />
          <input
            type="image"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
            border="0"
            name="submit"
            title="PayPal - The safer, easier way to pay online!"
            alt="Donate with PayPal button"
          />
          <img
            alt=""
            border="0"
            src="https://www.paypal.com/en_US/i/scr/pixel.gif"
            width="1"
            height="1"
          />
        </form>
      </div>
    </div>
  )
}
