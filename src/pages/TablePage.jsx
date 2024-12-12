import React, { Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';  
import '../static/chatbot.css';
import appContext from '../context/appContext';
import CustomPaginationActionsTable from '../components/dashboard-components/TablePaginationActions';
import '../static/tablepage.css';

function TablePage() {
  const { sidebarIsCollapse } = useContext(appContext);
  const navigate = useNavigate();  
  const handleBackButtonClick = () => {
    navigate(-1);  
  };

  return (
    <Fragment>
      <section className="page chatbot_page">
        
        <button 
          onClick={handleBackButtonClick}
          style={{
            backgroundColor: '#c23030',
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            fontSize: '16px',
            cursor: 'pointer', 
            borderRadius: '5px', 
            transition: 'background-color 0.3s', 
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#c23030'} 
          onMouseOut={(e) => e.target.style.backgroundColor = '#c23030'} 
        >
          Back
        </button>
        <CustomPaginationActionsTable />
      </section>
    </Fragment>
  );
}

export default TablePage;