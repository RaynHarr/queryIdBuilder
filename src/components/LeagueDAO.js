import React, { useState } from 'react'
import '../styles/LeagueDAO.css'
import '../styles/Button.css'
import RadioButtonCreateNew from './reusableComponents/RadioSelectCreateNew'
import Clipboard from '../assets/copy.svg'
import { ethers } from 'ethers'
import copy from 'copy-to-clipboard'
import { CustomTooltip } from './reusableComponents/CustomTooltip'

const initialFormState = {
  optionId: '',
}

const LeagueDAO = () => {
  //Component State
  const [form, setForm] = useState(initialFormState)
  const [jsonString, setJsonString] = useState()
  const [queryData, setQueryData] = useState()
  const [queryId, setQueryId] = useState()
  const [showResults, setShowResults] = useState(false)
  const [tooltipOpen0, setTooltipOpen0] = useState(false)
  const [tooltipOpen1, setTooltipOpen1] = useState(false)
  const [tooltipOpen2, setTooltipOpen2] = useState(false)
  //Globals
  const abiCoder = new ethers.utils.AbiCoder()

  //Helpers
  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }
  const handleGetLeagueDAOId = () => {
    const jsonStringToUse = JSON.stringify(
      `{ type: "LeagueDAO", optionId: "${parseInt(form.optionId)}" }`
    )
    const queryDataArg = abiCoder.encode(['uint256'], [parseInt(form.optionId)])
    const queryData = abiCoder.encode(
      ['string', 'bytes'],
      ['LeagueDAO', queryDataArg]
    )
    const queryId = ethers.utils.keccak256(queryData)
    setJsonString(jsonStringToUse)
    setQueryData(queryData)
    setQueryId(queryId)
    setForm(initialFormState)
    setShowResults(true)
  }
  //Clipboard Functions
  //Can both be consolidated at
  //higher level later.
  const copyToClipboard = (text) => {
    if (typeof text === 'object') {
      copy(text.join(''))
    } else {
      copy(text)
    }
  }
  const clipboardConsolidator = (content, num) => {
    switch (num) {
      case '0':
        setTooltipOpen0(true)
        copyToClipboard(content)
        setTimeout(() => {
          setTooltipOpen0(false)
        }, 2000)
        break
      case '1':
        setTooltipOpen1(true)
        copyToClipboard(content)
        setTimeout(() => {
          setTooltipOpen1(false)
        }, 2000)
        break
      case '2':
        setTooltipOpen2(true)
        copyToClipboard(content)
        setTimeout(() => {
          setTooltipOpen2(false)
        }, 2000)
        break
      default:
        return
    }
  }
  return (
    <div className="CreateNewLeagueDAOContainer">
      <RadioButtonCreateNew props="LeagueDAO" />
      <div className="LeagueDAOHeroContainer">
        <div className="LeagueDAOHero">
          <div className="LeagueDAOJSON">
            <p>
              &#123;<span>"type": </span>"LeagueDAO", <span>"optionId": </span>
            </p>
            <input
              onChange={handleChange}
              value={form.optionId}
              name="optionId"
              id="optionId"
              type="text"
              className="LeagueDAOInput"
            />
            <p>&#125;</p>
          </div>
          <button
            disabled={form.optionId ? false : true}
            className={form.optionId ? 'Button' : 'ButtonDisabled'}
            onClick={handleGetLeagueDAOId}
          >
            Generate ID
          </button>
        </div>
        {showResults ? (
          <div className="LeagueDAOResults">
            <div className="ResultTitle">
              <p>Query Descriptor:</p>
              <CustomTooltip
                open={tooltipOpen0}
                title="Copied!"
                placement="right"
                arrow
              >
                <img
                  src={Clipboard}
                  alt="copyToClipboardIcon"
                  className="CopyToClipboardIcon"
                  onClick={() =>
                    clipboardConsolidator(JSON.parse(jsonString), '0')
                  }
                />
              </CustomTooltip>
            </div>
            <p className="ResultContent">
              {jsonString ? JSON.parse(jsonString) : ''}
            </p>
            <div className="ResultTitle">
              <p>Query Data (Bytes):</p>
              <CustomTooltip
                open={tooltipOpen1}
                title="Copied!"
                placement="right"
                arrow
              >
                <img
                  src={Clipboard}
                  alt="copyToClipboardIcon"
                  className="CopyToClipboardIcon"
                  onClick={() => clipboardConsolidator(queryData, '1')}
                />
              </CustomTooltip>
            </div>
            <p className="ResultContent">{queryData ? queryData : ''}</p>
            <div className="ResultTitle">
              <p>Query ID (Hash):</p>
              <CustomTooltip
                open={tooltipOpen2}
                title="Copied!"
                placement="right"
                arrow
              >
                <img
                  src={Clipboard}
                  alt="copyToClipboardIcon"
                  className="CopyToClipboardIcon"
                  onClick={() => clipboardConsolidator(queryId, '2')}
                />
              </CustomTooltip>
            </div>
            <p className="ResultContent">{queryId ? queryId : ''}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default LeagueDAO
