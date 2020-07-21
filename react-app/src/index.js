import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ContractContextProvider, ContractContext } from './context/contractContext';

ReactDOM.render(
  <React.StrictMode>
    <ContractContextProvider>
      <ContractContext.Consumer>
        {contractContext => {
          if (contractContext && contractContext.contractInst && contractContext.account) {
            return <App />
          } else {
            return (<p className="text-center">Loading application....</p>)
          }
        }}
      </ContractContext.Consumer>
    </ContractContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
