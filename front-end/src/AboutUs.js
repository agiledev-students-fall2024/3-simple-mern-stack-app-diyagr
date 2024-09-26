import React, { useEffect, useState } from 'react';

// backendUrl = 'http://localhost:5002'
const AboutUs = () => {
    const [aboutData, setAboutData] = useState({ name: '', description: '', imageUrl: '' }); 
    useEffect(() => { 
       fetch(`http://localhost:5003/about`) 
       .then((response) => response.json()) 
       .then((data) => setAboutData(data)) 
       .catch((error) => console.error('Error fetching the about data:', error)); 
    }, []); 
    return (
        <div>
            <h1>Get to know me!</h1>
            <p>
                {aboutData.description}
            </p>
            {<img src= {aboutData.imageUrl}/>}
        </div>
    );
};
export default AboutUs; 