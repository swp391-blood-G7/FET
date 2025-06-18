// src/frontend/src/pages/HomePage.jsx
import React from 'react';
import Banner from '../components/Banner/Banner.jsx';
import Bennefits from '../components/Bennefits/Bennefits.jsx';
import Standards from '../components/Standards/Standards.jsx';

function HomePage() {
    return (
        <>
            <Banner />
            <Bennefits />
            <Standards />
        </>
    );
}

export default HomePage;