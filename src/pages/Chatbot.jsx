// Chat bot page for staffs to get awareness of the product and how to use the application

import React, { Fragment, useContext } from 'react'
import '../static/chatbot.css'
import appContext from '../context/appContext';

function Chatbot() {
  const { sidebarIsCollapse } = useContext(appContext);

  return (
    <Fragment>
      <section className="page chatbot_page">
        <h1>Chatbot page</h1>
      </section>
    </Fragment>
  )
}

export default Chatbot
