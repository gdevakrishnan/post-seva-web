import React, { Fragment, useEffect, useState } from 'react';
import './static/index.css';
import Router from './routers/Router';
import { ethers } from "ethers";
import ABI from "./contractJson/PostSevaComplaints.json";
import { userVerify } from './services/serviceWorker';
import appContext from './context/appContext';

const App = () => {
    // Web 2.0
    const [sidebarIsCollapse, setSidebarIsCollapse] = useState(true);
    const [userDetails, setUserDetails] = useState(null);

    const getUserDetails = () => {
        const token = localStorage.getItem("post-seva-token");

        if (token) {
            userVerify({ token })
                .then((response) => {
                    if (response.message === "Verified User") {
                        setUserDetails(response.data);
                    } else {
                        setUserDetails(null);
                    }
                })
                .catch((e) => {
                    console.error("Error verifying token:", e.message);
                    setUserDetails(null);
                });
        } else {
            setUserDetails(null);
        }
    }

    useEffect(() => {
        getUserDetails();
    }, [userDetails]);

    // Web 3.0
    const initialState = {
        WindowEthereum: false,
        ContractAddress: "0x5F8F608F7F30EC59b54c32D28E5AB00d372B1DE6",
        WalletAddress: null,
        ContractAbi: ABI.abi,
        Provider: null,
        Signer: null,
        ReadContract: null,
        WriteContract: null,
    };
    const [State, setState] = useState(initialState);

    const getStateParameters = async () => {
        if (window.ethereum) {
            setState(prevState => ({
                ...prevState,
                WindowEthereum: true
            }));

            const Provider = new ethers.providers.Web3Provider(window.ethereum);
            await Provider.send("eth_requestAccounts", []);
            const Signer = await Provider.getSigner();
            const WalletAddress = await Signer.getAddress();

            setState(prevState => ({
                ...prevState,
                WalletAddress,
                Provider,
                Signer
            }));

            const ReadContract = new ethers.Contract(
                State.ContractAddress,
                State.ContractAbi,
                Provider
            );
            const WriteContract = new ethers.Contract(
                State.ContractAddress,
                State.ContractAbi,
                Signer
            );

            setState(prevState => ({
                ...prevState,
                ReadContract,
                WriteContract
            }));
        } else {
            console.log("Metamask Not Found");
        }
    };

    const context = {
        userDetails,
        sidebarIsCollapse,
        State,
        setUserDetails,
        setSidebarIsCollapse,
        setState,
        getUserDetails,
        getStateParameters,
    }

    return (
        <Fragment>
            <appContext.Provider value={context}>
                <Router />
            </appContext.Provider>
        </Fragment>
    );
};

export default App;
