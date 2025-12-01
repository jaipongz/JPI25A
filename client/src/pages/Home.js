import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Team from '../components/Team';
import Articles from '../components/Articles';

const Home = () => {
    return (
        <>
            <Hero />
            <Services />
            <Portfolio />
            <Team />
            <Articles />
        </>
    );
};

export default Home;